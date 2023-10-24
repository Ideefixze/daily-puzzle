import asyncio
from typing import List

import discord as discordpy

from fastapi import Depends, FastAPI, APIRouter, Request
from fastapi.responses import JSONResponse
from fastapi_discord import DiscordOAuthClient, RateLimited, Unauthorized, User
from fastapi_discord.exceptions import ClientSessionNotInitialized
from fastapi_discord.models import GuildPreview


from fastapi.middleware.cors import CORSMiddleware

from config import *
from challenges.word_game.word_game import *
from challenges.word_game.word_game_model import *
from challenges.word_game.word_game_crud import *
from database import engine, SessionLocal, Base
import tasks

Base.metadata.create_all(engine)

session = SessionLocal()
word_game = WordGameChecker()

app = FastAPI()

origins = [    
    "http://localhost:3000",
]  
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

discord = DiscordOAuthClient(
    DISCORD_ID, DISCORD_SECRET, DISCORD_REDIRECT, ("identify", "guilds", "email")
) 

discord_client = discordpy.Client(intents=discordpy.Intents.default())

def init_db_data():
    print("Stating up game. Initializing data.")
    if not session.query(UserSQLModel).filter(UserSQLModel.discord_id=='anon').first():
        print("Default, anonymous user not found.")
        anon_user = UserSQLModel(discord_id="anon", username="Anonymous", avatar="")

        session.add(anon_user)
        session.commit()
        print("Anonymous user created.")
        
        test_game = WordGameSQLModel(word_game=json.dumps({"t": 2, "e": 1, "s": 1}))
        session.add(test_game)
        session.commit()
        print("Initialized test game.")
    
    word_game.init_char_dict(json.loads(get_current_word_game(session).word_game))

    
@app.on_event("startup")
async def on_startup():
    init_db_data()
    await discord.init()
    asyncio.create_task(discord_client.start(DISCORD_API))
    tasks.start_scheduler(session, word_game)

# === AUTH

@app.get("/login")
async def login():
    return {"url": discord.oauth_login_url}


@app.get("/callback")
async def callback(code: str):
    token, refresh_token = await discord.get_access_token(code)
    return {"access_token": token, "refresh_token": refresh_token}


@app.get("/refresh_token")
async def refresh_token(code: str):
    token, refresh_token = await discord.refresh_access_token(code)
    return {"access_token": token, "refresh_token": refresh_token}

@app.get(
    "/authenticated",
    dependencies=[Depends(discord.requires_authorization)],
    response_model=bool,
)
async def isAuthenticated(token: str = Depends(discord.get_token)):
    try:
        auth = await discord.isAuthenticated(token)
        return auth
    except Unauthorized:
        return False


@app.exception_handler(Unauthorized)
async def unauthorized_error_handler(_, __):
    return JSONResponse({"error": "Unauthorized"}, status_code=401)


@app.exception_handler(RateLimited)
async def rate_limit_error_handler(_, e: RateLimited):
    return JSONResponse(
        {"error": "RateLimited", "retry": e.retry_after, "message": e.message},
        status_code=429,
    )


@app.exception_handler(ClientSessionNotInitialized)
async def client_session_error_handler(_, e: ClientSessionNotInitialized):
    return JSONResponse({"error": "Internal Error"}, status_code=500)


@app.get("/user", dependencies=[Depends(discord.requires_authorization)], response_model=User)
async def get_user(user: User = Depends(discord.user)):
    return user

@app.get("/user/{id}")
async def get_user(id: str):
    return get_user_by_internal_id(session, id)

@app.get(
    "/guilds",
    dependencies=[Depends(discord.requires_authorization)],
    response_model=List[GuildPreview],
)
async def get_guilds(guilds: List = Depends(discord.guilds)):
    return guilds

# === Word Game
word_game_router = APIRouter(prefix="/word_game")

@word_game_router.get("/current")
async def current_word_game():
    return {"word_game": word_game.word_game}

@word_game_router.get("/check")
async def get_score(solution: str):
    score = word_game.get_solution_score(solution)
    return {
        "score": score, 
        "status": word_game.check_solution(solution) == WordGameSolutionStatus.OK,
        "place": get_current_place(session, score)
    }

@word_game_router.get("/solutions")
async def current_solutions():
    return get_current_solutions(session)

async def optional_user(request: Request):
    try:
        return (await discord.user(request)).id
    except:
        return "anon"

@word_game_router.post("/submit")
async def submit_word_game(solution: WordGameSolution, user: str = Depends(optional_user)):
    user = await get_user_by_discord_id(session, user, discord_client)
    solution = submit_solution(session, solution.solution, word_game, user)
    if solution:
        return {"status": "OK"}
    else:
        return {"status": "Bad answer or solution was already sent"}
    
app.include_router(word_game_router)