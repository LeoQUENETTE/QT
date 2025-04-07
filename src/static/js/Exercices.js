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
        this.equations = exo.equation.split("?");
        this.nb_equations = this.equations.length;
        this.actualAnswers = exo.answers;
        this.userAnswers = new Array(this.nb_equations);
        this.userAnswers.fill(0)
        this.errorName = "No error";
    }

    checkAnswers(){
        let nbGoodAnwser = 0;
        this.errorName = "No error";
        for (let i = 0; i < this.actualAnswers.length; i++){
            let answer = this.actualAnswers[i]
            let uAnswer = this.userAnswers[i]
            if (uAnswer == answer && nbGoodAnwser == this.actualAnswers.length - 1){
                return true;
            }
            if(uAnswer == "" || uAnswer =="?"){
                this.errorName = "No value passed"
                return false;
            }
            if (this.notANumber(uAnswer)){
                this.errorName = "Not a number"
                return false;
            }
            if (uAnswer == answer && nbGoodAnwser != this.actualAnswers.length){
                nbGoodAnwser = nbGoodAnwser + 1
            }else{
                this.errorName = "Bad answer";
                return false;
            }
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