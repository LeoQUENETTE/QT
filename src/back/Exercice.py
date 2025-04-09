import math
import random as r
class Exercice():
    equation : str
    answers : int
    
    def __init__(self):
        self.equation = ""
    
    def generateExercice(self, nbMinElement:int = 3, nbMaxElement:int = 5):
        numValues = r.randint(nbMinElement,nbMaxElement)
        
        equationParts = ""
        total = 0
        values = []
        for i in range(numValues):
            value = r.randint(-8,12)
            if i == 0:
                value = r.randint(1,8)
            total += value
            values.append(value)
            if (value >= 0 and i != 0):
                equationParts += "+ " + str(value)+" "
            elif(value < 0):
                equationParts += "- " + str(value * -1)+" "
            else:
                equationParts += str(value) + " "
        equationParts += "= " + str(total)
        for e in range(numValues//2):
            rndm = r.randint(0,len(values) - 1)
            value = values[rndm]
            values.pop(rndm)
            equationParts = equationParts.replace(str(int(math.sqrt(value**2))), "?", 1)
        self.equation = equationParts