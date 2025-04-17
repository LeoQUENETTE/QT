export default class HomeContent {
    constructor(homePage) {
        this.homePage = homePage;

        // Référence aux éléments DOM
        this.homeContent = document.getElementById("home_content");
        this.mainContent = document.getElementById("main-content-container");
        this.langTabs = document.querySelectorAll(".lang-tab");
        this.frStoriesList = document.getElementById("fr-stories");
        this.enStoriesList = document.getElementById("en-stories");
        this.mathScoresList = document.getElementById("math-scores-list");

        // Initialiser les onglets de langue
        this.initLangTabs();

        // Charger les données
        this.loadStoriesList();
        this.loadMathScores();
    }

    // Initialise les onglets de langue pour les histoires
    initLangTabs() {
        this.langTabs.forEach(tab => {
            tab.addEventListener("click", () => {
                // Désactiver tous les onglets
                this.langTabs.forEach(t => t.classList.remove("active"));
                // Activer l'onglet cliqué
                tab.classList.add("active");

                // Masquer toutes les listes d'histoires
                document.querySelectorAll(".lang-stories").forEach(list => {
                    list.style.display = "none";
                });

                // Afficher la liste correspondante
                const lang = tab.dataset.lang;
                document.getElementById(`${lang}-stories`).style.display = "block";
            });
        });
    }

    // Charge uniquement les titres des histoires depuis le fichier JSON avancé
    async loadStoriesList() {
        const languages = new Map([
            ["French" , this.frStoriesList],
            ["English",this.enStoriesList]]
        );
        try {
            // Récupérer directement les données du fichier avancé
            languages.forEach(async (htmlElement,lang) => {
                const response = await fetch("/advanced_history?lang="+lang);
                const data = await response.json();
                

                // Afficher le titre de l'histoire en français
                if (data && data.title && data.language === lang) {
                    htmlElement.innerHTML = `
                        <div class="story-item">
                            <span class="story-icon">📖</span>
                            <p class="story-title">${data.title}</p>
                        </div>
                    `;

                    // Ajouter un événement de clic pour charger l'histoire en français
                    const storyItem = htmlElement.querySelector(".story-item");
                    if (storyItem) {
                        storyItem.addEventListener("click", () => {
                            // Changer la langue si nécessaire
                            if (this.homePage.lang !== lang) {
                                this.homePage.changeLanguage(lang).then(() => {
                                    // Puis charger l'histoire
                                    this.homePage.header.historyMode(this.homePage);
                                });
                            } else {
                                // Sinon, charger directement l'histoire
                                this.homePage.header.historyMode(this.homePage);
                            }
                        });
                    }
                } else {
                    htmlElement.innerHTML = "<p class='loading'>Aucune histoire disponible</p>";
                }
            })
        } catch (error) {
            console.error("Erreur lors du chargement des histoires:", error);
            this.frStoriesList.innerHTML = "<p class='loading'>Erreur de chargement</p>";
            this.enStoriesList.innerHTML = "<p class='loading'>Loading error</p>";
        }
    }

    // Charge les scores de mathématiques depuis l'API
    async loadMathScores() {
        try {
            const response = await fetch("/math/scores");
            const scores = await response.json();
            console.log(response)

            if (!scores || scores.length === 0 || scores.error) {
                this.mathScoresList.innerHTML = "<p class='no-scores'>Aucun exercice effectué récemment</p>";
                return;
            }

            // Vider le conteneur
            this.mathScoresList.innerHTML = "";

            // Trier les scores par date (du plus récent au plus ancien)
            scores.sort((a, b) => new Date(b.date) - new Date(a.date));

            // Afficher les 5 derniers scores maximum
            const recentScores = scores.slice(0, 5);
            recentScores.forEach(score => {
                const scoreElement = document.createElement("div");
                scoreElement.className = `score-item ${score.percentage === 100 ? 'perfect-score' : ''}`;

                // Formater la date
                const scoreDate = new Date(score.date);
                const formattedDate = scoreDate.toLocaleDateString() + ' ' +
                    scoreDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                scoreElement.innerHTML = `
                    <div class="score-info">
                        <div class="score-date">${formattedDate}</div>
                        <div>Score: <span class="score-value">${score.score}/${score.total} (${score.percentage}%)</span></div>
                    </div>
                `;

                this.mathScoresList.appendChild(scoreElement);
            });
        } catch (error) {
            console.error("Erreur lors du chargement des scores:", error);
            this.mathScoresList.innerHTML = "<p class='no-scores'>Erreur de chargement des scores</p>";
        }
    }

    // Affiche la page d'accueil
    showHomeContent() {
        if (this.homeContent) this.homeContent.style.display = "flex";
        if (this.mainContent) this.mainContent.style.display = "none";

        // Masquer les contrôles d'histoire
        const historyControls = document.getElementById("history_controls");
        if (historyControls) historyControls.style.display = "none";

        // Rafraîchir les scores
        this.loadMathScores();
    }

    // Affiche le contenu principal (histoire ou mathématiques)
    showMainContent() {
        if (this.homeContent) this.homeContent.style.display = "none";
        if (this.mainContent) this.mainContent.style.display = "flex";
    }
}