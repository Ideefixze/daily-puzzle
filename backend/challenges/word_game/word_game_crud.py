from typing import List, Union
from sqlalchemy import column
from sqlalchemy.orm import Session

from .word_game_model import UserSQLModel, WordGame, WordGameSQLModel, WordGameSolution, WordGameSolutionSQLModel
from .word_game import WordGameChecker, WordGameSolutionStatus
from fastapi_discord import User
import bisect

def get_current_word_game(db: Session) -> WordGameSQLModel:
    return db.query(WordGameSQLModel).order_by(WordGameSQLModel.id.desc()).first()

def get_previous_word_game(db: Session) -> WordGameSQLModel:
    if db.query(WordGameSQLModel).count() >= 2:
        return db.query(WordGameSQLModel).order_by(WordGameSQLModel.id.desc()).limit(2)[1]
    else:
        return db.query(WordGameSQLModel)[0]
    
async def get_user_by_discord_id(db: Session, discord_id:str, discord_client) -> User:
    user = db.query(UserSQLModel).filter(UserSQLModel.discord_id==discord_id).first()
    if user:
        return user
    else:
        u = await discord_client.fetch_user(int(discord_id))
        new_u = UserSQLModel(discord_id=discord_id, username=u.global_name, avatar=u.display_avatar.url)
        db.add(new_u)
        db.commit()
        return new_u
    
def get_user_by_internal_id(db: Session, id:int) -> User:
    return db.query(UserSQLModel).filter(UserSQLModel.id==id).first()

def get_current_solutions(db: Session) -> List[WordGameSolutionSQLModel]:
    previous_game = get_previous_word_game(db)
    return db.query(WordGameSolutionSQLModel).filter(WordGameSolutionSQLModel.word_game_id == previous_game.id).all()

def get_current_place(db: Session, score: int) -> int:
    current_game = get_current_word_game(db)
    scores = db.query(WordGameSolutionSQLModel).filter(WordGameSolutionSQLModel.word_game_id == current_game.id).values(column('score') )
    scores = [r[0] for r in scores]
    scores = sorted(list(set(scores)))
    bisect.insort(scores, score)
    position = scores.index(score)
    return len(scores) - position

def submit_solution(db: Session, solution: str, checker: WordGameChecker, user: UserSQLModel) -> WordGameSQLModel:
    already_solution = db.query(WordGameSolutionSQLModel).filter(WordGameSolutionSQLModel.word_game == get_current_word_game(db)).filter(WordGameSolutionSQLModel.solver == user).first()
    if user.discord_id != "anon" and already_solution:
        return None
        
    if checker.check_solution(solution) == WordGameSolutionStatus.OK:
        new_word_game_solution = WordGameSolutionSQLModel(solution=solution, 
                                                          solver=user,
                                                          score=checker.get_solution_score(solution), 
                                                          word_game=get_current_word_game(db))
        db.add(new_word_game_solution)
        db.commit()
        return new_word_game_solution
    else:
        return None