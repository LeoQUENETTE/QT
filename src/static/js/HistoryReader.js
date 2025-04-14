export default class HistoryReader {
    constructor(storyData) {
        // Données de l'histoire
        this.storyData = storyData;
        this.currentIndex = 0;
        this.totalSentences = storyData.sentences.length;

        // Éléments DOM
        this.historyTextElement = document.getElementById("history_text");
        this.feedbackImageElement = document.getElementById("feedbackImage");

        // Contrôles
        this.nextBtn = document.getElementById("story_next_btn");
        this.prevBtn = document.getElementById("story_prev_btn");
        this.autoBtn = document.getElementById("story_auto_btn");
        this.stopBtn = document.getElementById("story_stop_btn");

        // Auto-play
        this.autoPlayInterval = null;
        this.autoPlaySpeed = 3000; // 3 secondes par défaut

        // Initialiser les contrôles
        this.initializeControls();
    }

    initializeControls() {
        if (this.nextBtn) {
            this.nextBtn.addEventListener("click", () => this.nextSentence());
        }

        if (this.prevBtn) {
            this.prevBtn.addEventListener("click", () => this.prevSentence());
        }

        if (this.autoBtn) {
            this.autoBtn.addEventListener("click", () => this.startAutoPlay());
        }

        if (this.stopBtn) {
            this.stopBtn.addEventListener("click", () => this.stopAutoPlay());
        }
        // Ajouter le gestionnaire d'événement pour le switch de langue
        const languageToggle = document.getElementById("language_toggle");

        if (languageToggle) {
            // Définir l'état initial du toggle en fonction de la langue courante
            languageToggle.checked = window.homePage.lang === "English";

            languageToggle.addEventListener("change", () => {
                const newLang = languageToggle.checked ? "English" : "French";
                this.changeLanguage(newLang);
            });
        }

    }

    // Affiche la phrase courante et met à jour l'image d'émotion
    displayCurrentSentence() {
        if (this.currentIndex < 0 || this.currentIndex >= this.totalSentences) {
            return;
        }

        const currentSentence = this.storyData.sentences[this.currentIndex];
        this.historyTextElement.textContent = currentSentence.text;

        // Mettre à jour l'image en fonction de l'émotion
        if (currentSentence.emotions && currentSentence.emotions.length > 0) {
            // Prendre la première émotion (prioritaire)
            const emotion = currentSentence.emotions[0];
            this.updateEmotionImage(emotion);
        } else {
            // Par défaut, afficher l'image neutre
            this.updateEmotionImage("neutral");
        }

        // Mise à jour des contrôles de navigation
        this.updateNavigationControls();
    }

    // Met à jour l'image en fonction de l'émotion
    updateEmotionImage(emotion) {
        const emotionMap = {
            "happy": "happy.png",
            "sad": "sad.png",
            "angry": "angry.png",
            "surprised": "surprised.png",
            "scared": "scared.png",
            "neutral": "neutre.png",
            "jealous": "jealous.png",
            "ashamed": "ashamed.png"
        };

        const imagePath = emotionMap[emotion] || "neutre.png";
        this.feedbackImageElement.src = "/static/images/" + imagePath;
    }

    // Passe à la phrase suivante
    nextSentence() {
        if (this.currentIndex < this.totalSentences - 1) {
            this.currentIndex++;
            this.displayCurrentSentence();
        }
    }

    // Revient à la phrase précédente
    prevSentence() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.displayCurrentSentence();
        }
    }

    // Démarre la lecture automatique
    startAutoPlay() {
        if (this.autoPlayInterval) {
            this.stopAutoPlay(); // Arrêter l'intervalle existant si présent
        }

        this.autoPlayInterval = setInterval(() => {
            if (this.currentIndex < this.totalSentences - 1) {
                this.nextSentence();
            } else {
                this.stopAutoPlay(); // Arrêter quand on atteint la fin
            }
        }, this.autoPlaySpeed);

        // Mise à jour des boutons
        if (this.autoBtn) this.autoBtn.style.display = "none";
        if (this.stopBtn) this.stopBtn.style.display = "block";
    }

    // Arrête la lecture automatique
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }

        // Mise à jour des boutons
        if (this.autoBtn) this.autoBtn.style.display = "block";
        if (this.stopBtn) this.stopBtn.style.display = "none";
    }

    // Met à jour les contrôles de navigation (activer/désactiver les boutons)
    updateNavigationControls() {
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex <= 0;
        }

        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentIndex >= this.totalSentences - 1;
        }
    }

    // Réinitialiser le lecteur
    reset() {
        this.currentIndex = 0;
        this.stopAutoPlay();
        this.displayCurrentSentence();
    }

    // Démarre la lecture depuis le début
    start() {
        this.reset();
        this.displayCurrentSentence();
    }

    // Méthode modifiée pour changer la langue et recommencer la lecture depuis le début
    async changeLanguage(newLang) {
        // Arrêter la lecture automatique si elle est active
        this.stopAutoPlay();

        // Mettre à jour la langue dans l'objet homePage
        window.homePage.lang = newLang;

        // Appeler l'API pour changer la langue
        await fetch(`/lang?lang=${newLang}`);

        // Récupérer l'histoire avancée dans la nouvelle langue
        let response = await fetch("/advanced_history");
        let data = await response.json();

        if (data.type === "History" && data.advanced_format) {
            // Mettre à jour les données de l'histoire
            this.storyData = data;
            this.totalSentences = data.sentences.length;

            // Recommencer la lecture depuis le début
            this.reset();
        } else {
            // Essayer le format standard si l'histoire avancée n'est pas disponible
            response = await fetch("/history");
            data = await response.json();

            if (data.type === "History") {
                if (data.advanced_format) {
                    // Mettre à jour les données et recommencer
                    this.storyData = data;
                    this.totalSentences = data.sentences.length;
                    this.reset();
                } else {
                    // Pour une histoire standard, mettre à jour le contenu
                    this.historyTextElement.textContent = data.content;
                }
            }
        }
    }
}