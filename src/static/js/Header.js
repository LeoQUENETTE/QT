import Body from "./Body.js";
export default class Header {
    constructor(homePage) {
        this.homePage = homePage;
        this.history_btn = document.getElementById("histoire_btn");
        this.math_btn = document.getElementById("math_btn");
        this.hamburger_btn = document.getElementById("hamburger_btn");
        this.floating_side_menu = document.getElementById("floating_side_menu");
        this.float_cross = document.getElementById("menu_cross");
        this.menu_home_btn = document.getElementById("menu_home_btn");

        this.hamburger_btn.addEventListener("click", () => {
            this.floating_side_menu.classList.add("visible");
        });

        this.history_btn.addEventListener("click", async () => {
            this.historyMode(homePage);
        });

        this.math_btn.addEventListener("click", async () => {
            this.mathsMode(homePage);
        });

        this.float_cross.addEventListener("click", () => {
            this.floating_side_menu.classList.remove("visible");
        });

        // Ajouter gestionnaire d'événement pour le bouton Accueil
        if (this.menu_home_btn) {
            this.menu_home_btn.addEventListener("click", () => {
                this.goToHomePage();
            });
        }
    }

    // Méthode pour retourner à la page d'accueil
    goToHomePage() {
        // Fermer le menu flottant
        this.floating_side_menu.classList.remove("visible");

        // Utiliser la méthode goToHome de homePage
        this.homePage.goToHome();
    }

    async mathsMode(homePage) {
        // Masquer le menu d'accueil et afficher le module spécifique
        if (homePage.homeContent) {
            homePage.homeContent.showMainContent();
        }

        // Nettoyer l'état actuel si nécessaire
        if (homePage.body && homePage.body.cleanup) {
            homePage.body.cleanup();
        }

        const headerBaseColor = "#5271ff";
        const headerSelectedColor = "#004aad ";
        homePage.selectedMode = "maths";
        let json = await homePage.httpGet("/" + homePage.selectedMode);
        await json.json()
            .then((data) => {
                if (data.type == "Maths") {
                    this.math_btn.style.background = headerSelectedColor;
                    this.history_btn.style.background = headerBaseColor;
                    homePage.main = new Body(homePage).generation_math_exos(data.exercices);
                } else {
                    homePage.selectedMode = "";
                }
            })
    }

    async historyMode(homePage) {
        // Masquer le menu d'accueil et afficher le module spécifique
        if (homePage.homeContent) {
            homePage.homeContent.showMainContent();
        }

        // Nettoyer l'état actuel si nécessaire
        if (homePage.body && homePage.body.cleanup) {
            homePage.body.cleanup();
        }

        const headerBaseColor = "#5271ff";
        const headerSelectedColor = "#004aad ";
        homePage.selectedMode = "history";

        // Tenter d'abord de récupérer l'histoire au format avancé
        let json = await homePage.httpGet("/advanced_history");
        let data = await json.json();

        if (data.type == "History" && data.advanced_format) {
            // Nous avons une histoire au format avancé
            homePage.selectedMode = "history";
            this.math_btn.style.background = headerBaseColor;
            this.history_btn.style.background = headerSelectedColor;
            homePage.main = new Body(homePage).generate_history(data);
        } else {
            // Essayer le format standard
            json = await homePage.httpGet("/" + homePage.selectedMode);
            await json.json()
                .then((data) => {
                    if (data.type == "History") {
                        homePage.selectedMode = "history";
                        this.math_btn.style.background = headerBaseColor;
                        this.history_btn.style.background = headerSelectedColor;
                        homePage.main = new Body(homePage).generate_history(data);
                    } else {
                        homePage.selectedMode = "";
                    }
                })
        }
    }
}