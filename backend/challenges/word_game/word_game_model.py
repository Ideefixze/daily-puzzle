import json
from pydantic import BaseModel

from sqlalchemy import Column, Text, Integer, ForeignKey
from sqlalchemy.orm import relationship
from pydantic_sqlalchemy import sqlalchemy_to_pydantic

from database import Base    

class WordGameSQLModel(Base):
    __tablename__ = "word_game"

    id = Column(Integer, primary_key=True, index=True)
    word_game = Column(Text)
    
    def to_dict(self):
        return {
            'id': self.id,
            'word_game': json.loads(self.word_game)
        }
     
WordGame = sqlalchemy_to_pydantic(WordGameSQLModel)

class UserSQLModel(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    discord_id = Column(Text)
    username = Column(Text)
    avatar = Column(Text)
    
User = sqlalchemy_to_pydantic(UserSQLModel)

class WordGameSolutionSQLModel(Base):
    __tablename__ = "word_game_solution"

    id = Column(Integer, primary_key=True, index=True)
    solution = Column(Text)
    score = Column(Integer)
    word_game_id = Column(Integer, ForeignKey('word_game.id'))
    word_game = relationship("WordGameSQLModel")
    solver_id = Column(Integer, ForeignKey('user.id'))
    solver = relationship("UserSQLModel", lazy='joined')
    
     
class WordGameSolution(BaseModel):
    solution: str
    

