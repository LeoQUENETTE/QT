import {Exercices, Exercice} from "./Exercices.js";

export default class Body{
    constructor (homePage){
        this.history_txt = document.getElementById("history_text");
        this.math_zone = document.getElementById("math_zone");
        this.help_btn_panel = document.getElementById("help_btn");
        this.lang_btn_panel = document.getElementById("lang_btn");
        this.retour_btn = document.getElementById("retour_btn");

        this.help_btn_panel.addEventListener("click", () => {
            this.help_btn_handler(homePage);
        })
        this.lang_btn_panel.addEventListener("click", () => {
            this.lang_btn_handler(homePage);
        })
    }

    help_btn_handler(homePage){}
    async lang_btn_handler(homePage){
        let json = await homePage.httpGet("/lang?lang=Français")
        await json.json()
        .then((data) => {
            console.log(data.lang)
        });
    }
    

    generate_history(history){
        this.history_txt.style.display = "block";
        this.history_txt.style.visibility = "visible";

        this.math_zone.style.display = "none";
        this.math_zone.style.visibility = "hidden";

        this.history_txt.textContent = history
    }
    generation_math_exos(list_exos){
        this.history_txt.style.display = "none";
        this.history_txt.style.visibility = "hidden";
        this.math_zone.style.display = "block";
        this.math_zone.style.visibility = "visible";

        let exoHTML = document.getElementById("exo");
        let valider_btn = document.getElementById("valider_btn");

        let exercices = new Exercices(list_exos);
        let mathExosBox = this.generateExosBox(exercices.nbExos, exoHTML);
        this.generateEquation(exercices, exoHTML);
        
        valider_btn.addEventListener("click", () => {
            if (!exercices.allExerciceDone){
                this.btnValidation(exercices, mathExosBox)
            }
            if (!exercices.allExerciceDone){
                exoHTML.innerHTML = ""
                this.generateEquation(exercices, exoHTML);
            }
        })
    }
    generateEquation(exercices,exoHTML){
        let exo = exercices.actualExo;
        for (let i = 0; i < exo.nb_equations; i++){
            let equation = document.createElement("p");
            equation.id = "equation"+i
            equation.innerHTML=exo.splitedEquations[i];
            exoHTML.appendChild(equation);
            if (i < exo.nb_equations - 1){
                let answer = document.createElement("textarea");
                answer.value="?";
                answer.classList.add("answer_area");
                answer.id = "answer"+i;
                answer.addEventListener("input",() => {
                    exo.userAnswers[i] = answer.value
                })
                exoHTML.appendChild(answer);
            }
        }
    }

    generateExosBox(nb, exo){
        let math_list = document.getElementById("list_exos");
        math_list.innerHTML = '';
        exo.innerHTML = '';
        let div_list = [];
        //Create the litle boxes above the exercises
        for (let index = 0; index < nb; index++) {
            const new_div = document.createElement("div");
            if (index == 0){
                new_div.classList.add("selected");
            }
            else{
                new_div.classList.add("locked");
            }
            new_div.innerText = index + 1;
            math_list.appendChild(new_div);
            div_list.push(new_div);
        }
        return div_list
    }
    btnValidation(exercices, mathExosBox){
        let goodAnswer = exercices.actualExo.checkAnswers();
        let valider_btn = document.getElementById("valider_btn");
        let errorArea = document.getElementById("errorArea");
        errorArea.classList.add("invisible");
        if (goodAnswer){
            valider_btn.classList.remove("error");
            exercices.nextExercice();
            mathExosBox[exercices.nbSolvedExos - 1].classList.remove("selected");
            mathExosBox[exercices.nbSolvedExos - 1].classList.add("success");
            if (!exercices.allExerciceDone){
                this.retour_btn.style.display = "flex";
                mathExosBox[exercices.nbSolvedExos].classList.add("selected")           
            }else{
                console.log("Plus d'exos GG !")
            }
        }else{
            valider_btn.classList.add("error");
            errorArea.textContent=exercices.actualExo.errorName;
            errorArea.classList.remove("invisible");
        }
    }
}
