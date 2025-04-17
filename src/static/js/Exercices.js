export class Exercices{

    constructor(list_exos){
        this.list_exos = this.generateExos(list_exos);
        this.nbExos = list_exos.length;
        this.nbSolvedExos = 0;
        this.actualExo = this.list_exos[this.nbSolvedExos];
        this.allExerciceDone = false;
    }

    generateExos(list_exos){
        let exoArray = new Array(list_exos.length)
        for (let exoID = 0; exoID < list_exos.length; exoID++){
            let exo = new Exercice(list_exos[exoID]);
            exoArray[exoID] = exo;
        }
        return exoArray 
    }

    nextExercice(){
        this.nbSolvedExos += 1;
        if (this.nbSolvedExos < this.nbExos){
            this.actualExo = this.list_exos[this.nbSolvedExos];
        }else{
            this.allExerciceDone = true;
        } 
    }
}

export class Exercice{
    constructor(exo){
        this.equation = exo.equation
        this.splitedEquations = exo.equation.split("?");
        this.nb_equations = this.splitedEquations.length;
        this.actualAnswers = exo.answers;
        this.userAnswers = new Array(this.nb_equations);
        this.userAnswers.fill(0)
        this.errorName = "No error";
        this.leftResult = ""
        this.evaluatedLeft = ""
    }

    checkAnswers() {
        const [left, right] = this.equation.split('=').map(s => s.trim());
        
        let answerIndex = 0;
        let error = false;
        let evaluatedLeft = "";
    
        // Replace each '?' in the left side with userAnswers
        evaluatedLeft = left.replace(/\?/g, (match) => {
            const userAnswer = this.userAnswers[answerIndex];
    
            if (userAnswer === "" || userAnswer === "?") {
                this.errorName = "Répondez à toute la question";
                error = true;
                return match; // Keep ? as placeholder, since there's an error
            }
    
            if (this.notANumber(userAnswer)) {
                this.errorName = "Entrez une réponse valdie";
                error = true;
                return match; // Same here
            }
    
            const replacement = userAnswer;
            answerIndex++;
            return replacement;
        });
    
        if (error) {
            return false;
        }
    
        try {
            const leftResult = eval(evaluatedLeft);
            const rightResult = parseInt(right, 10);
            const equal = leftResult === rightResult
            if (!equal){
                this.errorName="Mauvaise réponse";
                this.leftResult = leftResult;
                this.evaluatedLeft = evaluatedLeft;
            }
            return equal;
        } catch (e) {
            this.errorName = "S'il y a eu un problème pendant l'évaluation";
            return false;
        }
    }
    
    
    notANumber(input){
        for (let index = 0; index < input.length; index++){
            const e = input[index];
            if (e == 0 || e == 1 || e == 2 || e == 3 || e == 4 || e == 5 || e == 6 || e == 7 || e == 8 || e == 9){
                return false
            }
        }
        return true
    }
}