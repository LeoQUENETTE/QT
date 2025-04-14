import Body from "./Body.js";
import Header from "./Header.js";
import Footer from "./Footer.js";
import HomeContent from "./HomeContent.js";

class HomePage {
    constructor() {
        this.lang = "English";
        this.selectedMode = null;
        this.header = new Header(this);
        this.body = new Body(this);
        this.footer = new Footer(this);
        this.homeContent = new HomeContent(this);
        window.homePage = this;
    }

    async httpGet(url) {
        return await fetch(url, {
            headers: {
                'Accept': 'application/json'
            }
        });
    }

    async httpPost(url, jsonBody) {
        return await fetch(url, {
            method: "POST",
            body: JSON.stringify(jsonBody),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
    }

    async changeLanguage(newLang) {
        this.lang = newLang;
        // Faire l'appel API
        const response = await this.httpGet(`/lang?lang=${newLang}`);
        return await response.json();
    }

    // Méthode pour enregistrer un score de mathématiques
    async saveMathScore(score, total) {
        return await this.httpPost("/math/score", {
            score: score,
            total: total
        });
    }

    // Méthode pour retourner à la page d'accueil
    goToHome() {
        // Nettoyer l'état actuel si nécessaire
        if (this.body && this.body.cleanup) {
            this.body.cleanup();
        }

        // Réinitialiser le mode sélectionné
        this.selectedMode = null;

        // Réinitialiser les couleurs des boutons du menu
        const headerBaseColor = "#5271ff";
        this.header.math_btn.style.background = headerBaseColor;
        this.header.history_btn.style.background = headerBaseColor;

        // Afficher la page d'accueil
        this.homeContent.showHomeContent();
    }
}

const homePage = new HomePage();

// Ajouter un écouteur d'événement pour le bouton d'accueil
const homeBtn = document.getElementById("menu_home_btn");
if (homeBtn) {
    homeBtn.addEventListener("click", () => {
        // Fermer le menu flottant
        const floatingMenu = document.getElementById("floating_side_menu");
        if (floatingMenu) floatingMenu.classList.remove("visible");

        // Aller à la page d'accueil
        homePage.goToHome();
    });
}