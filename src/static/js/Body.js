import { Exercices, Exercice } from "./Exercices.js";
import HistoryReader from "./HistoryReader.js";

export default class Body {
    constructor(homePage) {
        this.homePage = homePage;
        this.history_txt = document.getElementById("history_text");
        this.math_zone = document.getElementById("math_zone");
        this.history_controls = document.getElementById("history_controls");
        this.help_btn_panel = document.getElementById("help_btn");
        this.retour_btn = document.getElementById("retour_btn");
        this.historyReader = null;

        this.help_btn_panel.addEventListener("click", () => {
            this.help_btn_handler(homePage);
        });
    }

    generate_history(historyData) {
        // Masquer la page d'accueil et afficher le contenu principal
        if (this.homePage.homeContent) {
            this.homePage.homeContent.showMainContent();
        }

        // Cacher la zone de maths et afficher la zone d'histoire
        this.history_txt.style.display = "block";
        this.history_txt.style.visibility = "visible";
        this.math_zone.style.display = "none";
        this.math_zone.style.visibility = "hidden";

        // Afficher les contrôles d'histoire si disponibles
        if (this.history_controls) {
            this.history_controls.style.display = "block";
            this.history_controls.style.visibility = "visible";
        }

        // Vérifier si c'est une histoire au format avancé (avec phrases et émotions)
        if (historyData.advanced_format && historyData.sentences) {
            this.generate_advanced_history(historyData);
        } else {
            // Format standard - afficher tout le contenu d'un coup
            this.history_txt.textContent = historyData.content;

            // Cacher les contrôles car non nécessaires pour le format standard
            if (this.history_controls) {
                this.history_controls.style.display = "none";
                this.history_controls.style.visibility = "hidden";
            }
        }
    }

    generate_advanced_history(historyData) {
        // Initialiser le lecteur d'histoire avec les données
        this.historyReader = new HistoryReader(historyData);

        // Démarrer la lecture à partir de la première phrase
        this.historyReader.start();
    }

    generation_math_exos(list_exos) {
        // Masquer la page d'accueil et afficher le contenu principal
        if (this.homePage.homeContent) {
            this.homePage.homeContent.showMainContent();
        }

        // Cacher la zone d'histoire et afficher la zone de maths
        this.history_txt.style.display = "none";
        this.history_txt.style.visibility = "hidden";
        this.math_zone.style.display = "block";
        this.math_zone.style.visibility = "visible";

        // Cacher les contrôles d'histoire s'ils existent
        if (this.history_controls) {
            this.history_controls.style.display = "none";
            this.history_controls.style.visibility = "hidden";
        }

        let exoHTML = document.getElementById("exo");
        let valider_btn = document.getElementById("valider_btn");

        let exercices = new Exercices(list_exos);
        let mathExosBox = this.generateExosBox(exercices.nbExos, exoHTML);
        this.generateEquation(exercices, exoHTML);

        document.getElementById("math_form").addEventListener("submit", (event) => {
            event.preventDefault();
            if (!exercices.allExerciceDone) {
                this.btnValidation(exercices, mathExosBox)
            }
            if (!exercices.allExerciceDone) {
                exoHTML.innerHTML = ""
                this.generateEquation(exercices, exoHTML);
            }
        })

        valider_btn.addEventListener("click", () => {
            if (!exercices.allExerciceDone) {
                this.btnValidation(exercices, mathExosBox)
            }
            if (!exercices.allExerciceDone) {
                exoHTML.innerHTML = ""
                this.generateEquation(exercices, exoHTML);
            }
        })
    }

    generateEquation(exercices, exoHTML) {
        let exo = exercices.actualExo;
        for (let i = 0; i < exo.nb_equations; i++) {
            let equation = document.createElement("p");
            equation.id = "equation" + i
            equation.innerHTML = exo.splitedEquations[i];
            exoHTML.appendChild(equation);
            if (i < exo.nb_equations - 1) {
                let answer = document.createElement("input");
                answer.value = "";
                answer.classList.add("answer_area");
                answer.id = "answer" + i;
                answer.addEventListener("input", () => {
                    exo.userAnswers[i] = answer.value
                })
                exoHTML.appendChild(answer);
            }
        }
    }

    generateExosBox(nb, exo) {
        let math_list = document.getElementById("list_exos");
        math_list.innerHTML = '';
        exo.innerHTML = '';
        let div_list = [];
        //Create the litle boxes above the exercises
        for (let index = 0; index < nb; index++) {
            const new_div = document.createElement("div");
            if (index == 0) {
                new_div.classList.add("selected");
            }
            else {
                new_div.classList.add("locked");
            }
            new_div.innerText = index + 1;
            math_list.appendChild(new_div);
            div_list.push(new_div);
        }
        return div_list
    }

    btnValidation(exercices, mathExosBox) {
        let goodAnswer = exercices.actualExo.checkAnswers();
        let valider_btn = document.getElementById("valider_btn");
        let errorArea = document.getElementById("errorArea");
        let next_btn = document.getElementById("next_btn");
        let feedbackImage = document.getElementById("feedbackImage");
        let errorPopup = document.getElementById("error_menu");
        let errorBtn = document.getElementById("error_btn");
        errorBtn.addEventListener("click", () => {
            errorPopup.classList.add("invisible");
        })

        errorArea.classList.add("invisible");
        next_btn.style.display = "none";

        if (goodAnswer) {
            feedbackImage.src = "/static/images/correct.png";
            valider_btn.classList.remove("error");
            errorArea.textContent = "Bonne réponse !";
            errorArea.style.color = "green";
            errorArea.classList.remove("invisible");

            valider_btn.style.display = "none";
            next_btn.style.display = "block";

            next_btn.addEventListener("click", () => {
                next_btn.style.display = "none";
                errorArea.classList.add("invisible");
                valider_btn.style.display = "block";

                feedbackImage.src = "/static/images/neutre.png";

                exercices.nextExercice();
                mathExosBox[exercices.nbSolvedExos - 1].classList.remove("selected");
                mathExosBox[exercices.nbSolvedExos - 1].classList.add("success");

                this.retour_btn.style.display = "none";

                if (!exercices.allExerciceDone) {
                    mathExosBox[exercices.nbSolvedExos].classList.add("selected");
                } else {
                    // Tous les exercices sont terminés

                    // Sauvegarder le score
                    this.saveMathScore(exercices);

                    // Afficher le popup de félicitations
                    let popup = document.getElementById("popup_menu");
                    popup.classList.remove("invisible");
                    let popup_btn = document.getElementById("popup_btn");
                    popup_btn.addEventListener("click", () => {
                        location.reload();
                    });
                }

                let exoHTML = document.getElementById("exo");
                exoHTML.innerHTML = "";
                this.generateEquation(exercices, exoHTML);
            }, { once: true });
        } else {
            feedbackImage.src = "/static/images/incorrect.png";
            valider_btn.classList.add("error");
            errorArea.textContent = exercices.actualExo.errorName;
            errorArea.style.color = "red";
            errorArea.classList.remove("invisible");
            if (exercices.actualExo.errorName == "Mauvaise réponse") {
                let errorExplanation = document.getElementById("error_explain");
                errorPopup.classList.remove("invisible");
                errorExplanation.innerHTML = exercices.actualExo.evaluatedLeft + "= " + exercices.actualExo.leftResult
            }
        }
    }

    // Méthode pour sauvegarder le score de mathématiques
    saveMathScore(exercices) {
        if (this.homePage && this.homePage.saveMathScore) {
            // Calculer le score
            const score = exercices.nbSolvedExos;
            const total = exercices.nbExos;

            // Envoyer le score au serveur
            this.homePage.saveMathScore(score, total)
                .then(response => {
                    console.log("Score sauvegardé avec succès");
                })
                .catch(error => {
                    console.error("Erreur lors de la sauvegarde du score:", error);
                });
        }
    }

    // Méthode pour arrêter/nettoyer toutes les ressources avant de naviguer ailleurs
    cleanup() {
        // Arrêter la lecture automatique si active
        if (this.historyReader) {
            this.historyReader.stopAutoPlay();
            this.historyReader = null;
        }
    }
}