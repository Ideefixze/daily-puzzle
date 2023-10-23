import json
from sqlalchemy.orm import Session

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger

from challenges.word_game.word_game import WordGameChecker
from challenges.word_game.word_game_model import WordGameSQLModel
from discord_webhook import DiscordWebhook, DiscordEmbed
import config
    
def prepare_new_game(db: Session, word_game_checker: WordGameChecker):
    try:
        new_word_game_dict = word_game_checker.get_new_game_dict()
        new_word_game = WordGameSQLModel(word_game=json.dumps(new_word_game_dict))
        word_game_checker.init_char_dict(new_word_game_dict)
        db.add(new_word_game)
        db.commit()
        if config.ENABLE_WEBHOOK:
            webhook = DiscordWebhook(url=config.DISCORD_SERVER_WEBHOOK)
            embed = DiscordEmbed("Witajcie na Rokkenjimie,", "Rozwiążcie nowe epitafium.")
            embed.add_embed_field(name='Link', value=f'[Kliknij tutaj!]({config.APP_LINK})')
            webhook.add_embed(embed)
            webhook.execute() 
    except:
        print("Error when creating a new game")
    

def start_scheduler(db: Session, word_game_checker: WordGameChecker):
    scheduler = BackgroundScheduler()
    scheduler.start()

    trigger = IntervalTrigger(minutes=30)
    scheduler.add_job(prepare_new_game, trigger, [db, word_game_checker])

