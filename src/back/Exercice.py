
class Exercice():
    equation1 : str
    equation2 : str
    reponse : int
    
    def __init__(self, equation : str, reponses : list[str]):
        self.equation = equation
        self.reponse = reponses