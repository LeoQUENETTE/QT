import math
import random

def generate_equation() -> str:
    numValues = random.randint(3,5)
    
    equationParts = ""
    total = 0
    values = []
    for i in range(numValues):
        value = random.randint(-8,12)
        if i == 0:
            value = random.randint(1,8)
        total += value
        values.append(value)
        if (value >= 0 and i != 0):
            equationParts += "+ " + str(value)+" "
        elif(value < 0):
            equationParts += "- " + str(value * -1)+" "
        else:
            equationParts += str(value) + " "
    equationParts += "= " + str(total)
    print(equationParts)
    for e in range(numValues//2):
        rndm = random.randint(0,len(values) - 1)
        value = values[rndm]
        values.pop(rndm)
        equationParts = equationParts.replace(str(int(math.sqrt(value**2))), "?", 1)
    
    return equationParts

# Example usage:
print(generate_equation())
