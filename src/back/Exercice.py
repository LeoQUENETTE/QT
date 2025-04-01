
class Exercice():
    equation : str
    answers : int
    
    def __init__(self, equation : str, answers : list[str]):
        self.equation = equation
        self.answers = answers