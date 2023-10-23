import json
from enum import Enum
from collections import Counter
from english_words import get_english_words_set
import random

class WordGameSolutionStatus(Enum):
    OK = 0
    LETTERS = 1
    NOT_WORD = 2

def is_subdict(dict1:dict, dict2:dict):
    return all((key in dict2 and value <= dict2[key]) for key, value in dict1.items())


class WordGameChecker():
    """
        Word Game handler. Checks validity and generates new word dicts.
    """
    def __init__(self) -> None:
        self.word_set = get_english_words_set(['web2'], lower=True, alpha=True)
        self.word_list = list(self.word_set)
        
        self.init_char_dict({})
    
    def init_char_dict(self, char_dict:dict) -> None:
        if isinstance(char_dict, dict):
            self.word_game = char_dict
            print("Initialized game: "+json.dumps(self.word_game))
        else:
            print("Provided incorrect char_dict, expected dict but got: ", type(char_dict))
    
    def get_new_game_dict(self) -> dict:
        result = {}
        word_count = random.randint(2, 3)
        words = ''.join([random.choice(self.word_list) for _ in range(word_count)])
        words = dict(Counter(words.lower()))
        return words
        
    def check_solution(self, solution:str) -> WordGameSolutionStatus:
        solution_dict = dict(Counter(solution.lower().replace(' ', '')))
        if not is_subdict(solution_dict, self.word_game):
            return WordGameSolutionStatus.LETTERS
        
        words = solution.lower().split(' ')
        for word in words:
            if word not in self.word_set:
                return WordGameSolutionStatus.NOT_WORD
        return WordGameSolutionStatus.OK
    
    def get_solution_score(self, solution):
        words = solution.lower().split(' ')
        score = 0
        for word in words:
            score += len(word) * len(word) * 10
        return score * len(words)

        