export default class Body{
    constructor (homePage){
        this.history_txt = document.getElementById("history_text");
        this.math_zone = document.getElementById("math_zone");
        this.help_btn_panel = document.getElementById("help_btn");
        this.lang_btn_panel = document.getElementById("lang_btn");
        this.nb_exo_solved = 0;

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

    generation_math_exos(nb, list_exos){
        if (nb > 0){            
            this.history_txt.style.display = "none";
            this.history_txt.style.visibility = "hidden";

            this.math_zone.style.display = "block";
            this.math_zone.style.visibility = "visible";
            //Get relevant element
            let math_list = document.getElementById("list_exos");
            let exo = document.getElementById("exo");
            let valider_btn = document.getElementById("valider_btn");
            let retour_btn = document.getElementById("retour_btn");
            let div_list = [];
            math_list.innerHTML = '';
            exo.innerHTML = '';

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

            //Create the exos
            let actualAnswer = []
            equations = list_exos[0].equation.split("?")
            for (let i = 0; i < equations.length; i++){
                let equation = document.createElement("p");
                let answer = document.createElement("textarea");
                actualAnswer
            }
            
            
             = list_exos[0].answers[0]; 
            equation.innerHTML=list_exos[0].equation;
            console.log();
            answer.value="?";
            answer.classList.add("answer_area");
            answer.id = "answer"

            exo.appendChild(equation);
            exo.appendChild(answer);
            
            valider_btn.addEventListener("click", () => {
                if (answer.value == actualAnswer){
                    this.nb_exo_solved += 1;
                    if (this.nb_exo_solved == 1){
                        retour_btn.style.display = "flex";
                    }
                    if (this.nb_exo_solved < nb){
                        answer.value="?";
                        actualAnswer = list_exos[this.nb_exo_solved].reponse;
                        equation.innerHTML = list_exos[this.nb_exo_solved].equation;

                        let prec_div = div_list[this.nb_exo_solved - 1];
                        prec_div.classList.remove("selected")
                        prec_div.classList.add("success")
                        let new_div = div_list[this.nb_exo_solved];
                        new_div.classList.add("selected")
                        new_div.classList.remove("locked")
                    }else{
                        console.log("Plus d'exos GG !")
                    }
                }else if(answer.value == ""){
                    //TODO Error msg if the value is empty
                    console.log("Can't have an empty answer")
                }else if (this.notANumber(answer.value)){
                    //TODO Error msg if the value not a number
                    console.log("Not a number !")
                }else {
                    //TODO Error msg if the value is not the one desired
                    console.log("Bad answer")
                }
            })
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
