import SpeechSynthesis from './SpeechSynthesis.js';

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
        this.speakBtn = document.getElementById("story_speak_btn");
        this.pauseSpeakBtn = document.getElementById("story_pause_speak_btn");

        // Auto-play
        this.autoPlayInterval = null;
        this.autoPlaySpeed = 3000; // 3 secondes par défaut
        this.autoPlayWithVoice = false; // Indicateur pour la lecture automatique avec voix

        // Initialisation de la synthèse vocale
        this.speechSynthesis = new SpeechSynthesis();

        // Définir la langue initiale pour la synthèse vocale
        this.updateSpeechLanguage();

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
            this.autoBtn.addEventListener("click", () => this.startAutoPlay(false));
        }

        if (this.stopBtn) {
            this.stopBtn.addEventListener("click", () => this.stopAutoPlay());
        }

        // Nouveaux contrôles pour la synthèse vocale
        if (this.speakBtn) {
            this.speakBtn.addEventListener("click", () => {
                // Si déjà en lecture auto avec voix, arrêter
                if (this.autoPlayWithVoice) {
                    this.stopAutoPlay();
                    return;
                }

                // Sinon, basculer entre lecture simple et lecture auto avec voix
                if (this.speechSynthesis.isSpeaking()) {
                    this.speechSynthesis.stop();
                    this.updateSpeakButton(false);
                } else {
                    // Démarrer la lecture automatique avec voix si le bouton est pressé plus longtemps
                    this.startAutoPlay(true);
                }
            });

            // Ajouter un événement pour la pression longue pour activer la lecture auto avec voix
            this.speakBtn.addEventListener("contextmenu", (e) => {
                e.preventDefault(); // Empêcher le menu contextuel
                this.startAutoPlay(true);
            });
        }

        if (this.pauseSpeakBtn) {
            this.pauseSpeakBtn.addEventListener("click", () => this.pauseResumeSpeech());
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

        // Arrêter la synthèse vocale en cours si présente ET si on n'est pas en mode auto avec voix
        if (this.speechSynthesis.isSpeaking() && !this.autoPlayWithVoice) {
            this.speechSynthesis.stop();
        }

        // Si on est en mode auto avec voix, lire la phrase automatiquement
        if (this.autoPlayWithVoice) {
            this.speakCurrentSentence();
        }
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
        } else if (this.autoPlayWithVoice) {
            // Si on est à la fin et en mode auto avec voix, arrêter la lecture auto
            this.stopAutoPlay();
        }
    }

    // Revient à la phrase précédente
    prevSentence() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.displayCurrentSentence();
        }
    }

    // Démarre la lecture automatique, avec ou sans voix
    startAutoPlay(withVoice = false) {
        // Arrêter tout intervalle existant
        this.stopAutoPlay();

        // Mettre à jour le mode
        this.autoPlayWithVoice = withVoice;

        if (withVoice) {
            // Configurer la détection de fin de lecture pour avancer automatiquement
            this.setupVoiceSyncAutoPlay();
        } else {
            // Mode auto classique avec intervalle
            this.autoPlayInterval = setInterval(() => {
                if (this.currentIndex < this.totalSentences - 1) {
                    this.nextSentence();
                } else {
                    this.stopAutoPlay();
                }
            }, this.autoPlaySpeed);
        }

        // Mise à jour des boutons
        if (this.autoBtn) this.autoBtn.style.display = "none";
        if (this.stopBtn) this.stopBtn.style.display = "block";

        if (withVoice) {
            // Mettre à jour le bouton de lecture vocale
            this.updateSpeakButton(true);
            // Démarrer la lecture vocale de la phrase actuelle
            this.speakCurrentSentence();
        }
    }

    // Configure la lecture automatique synchronisée avec la voix
    setupVoiceSyncAutoPlay() {
        if (!this.speechSynthesis.isAvailable()) return;

        // Créer une référence à l'instance actuelle pour utiliser dans l'écouteur d'événements
        const self = this;

        // Configurer l'écouteur d'événements pour la fin de lecture
        const utterance = this.speechSynthesis.getCurrentUtterance();
        if (utterance) {
            utterance.onend = function () {
                // Attendre un court délai pour une meilleure expérience utilisateur
                setTimeout(() => {
                    if (self.autoPlayWithVoice && self.currentIndex < self.totalSentences - 1) {
                        self.nextSentence();
                    } else if (self.currentIndex >= self.totalSentences - 1) {
                        self.stopAutoPlay();
                    }
                }, 500); // Délai de 500ms
            };
        }
    }

    // Arrête la lecture automatique
    stopAutoPlay() {
        // Arrêter l'intervalle si présent
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }

        // Réinitialiser le mode auto avec voix
        this.autoPlayWithVoice = false;

        // Arrêter la synthèse vocale si active
        if (this.speechSynthesis.isSpeaking()) {
            this.speechSynthesis.stop();
        }

        // Mise à jour des boutons
        if (this.autoBtn) this.autoBtn.style.display = "block";
        if (this.stopBtn) this.stopBtn.style.display = "none";
        this.updateSpeakButton(false);
    }

    // MÉTHODES POUR LA SYNTHÈSE VOCALE

    // Met à jour la langue pour la synthèse vocale en fonction de la langue actuelle de l'histoire
    updateSpeechLanguage() {
        const languageCode = this.storyData.language === "French" ? "fr-FR" : "en-US";
        this.speechSynthesis.setLanguage(languageCode);
    }

    // Lit la phrase courante à haute voix
    speakCurrentSentence() {
        if (this.currentIndex < 0 || this.currentIndex >= this.totalSentences) {
            return false;
        }

        const currentSentence = this.storyData.sentences[this.currentIndex];
        const success = this.speechSynthesis.speak(currentSentence.text);

        // Si en mode auto avec voix, configurer l'écouteur pour la synchronisation
        if (success && this.autoPlayWithVoice) {
            this.setupVoiceSyncAutoPlay();
        }

        return success;
    }

    // Met en pause ou reprend la lecture vocale
    pauseResumeSpeech() {
        if (!this.speechSynthesis.isSpeaking()) {
            return;
        }

        if (this.speechSynthesis.isPaused()) {
            this.speechSynthesis.resume();
            this.updatePauseSpeakButton(false);
        } else {
            this.speechSynthesis.pause();
            this.updatePauseSpeakButton(true);
        }
    }

    // Met à jour l'apparence du bouton de lecture vocale
    updateSpeakButton(isSpeaking) {
        if (!this.speakBtn) return;

        if (isSpeaking) {
            this.speakBtn.classList.add("active");

            // Texte différent selon le mode
            if (this.autoPlayWithVoice) {
                this.speakBtn.innerHTML = "<span>🔇</span> Arrêter la lecture auto";
            } else {
                this.speakBtn.innerHTML = "<span>🔇</span> Arrêter";
            }

            // Afficher le bouton pause si on n'est pas en mode auto avec voix
            if (this.pauseSpeakBtn && !this.autoPlayWithVoice) {
                this.pauseSpeakBtn.style.display = "block";
            }
        } else {
            this.speakBtn.classList.remove("active");
            this.speakBtn.innerHTML = "<span>🔊</span> Lire";

            // Cacher le bouton pause
            if (this.pauseSpeakBtn) {
                this.pauseSpeakBtn.style.display = "none";
            }
        }
    }

    // Met à jour l'apparence du bouton pause
    updatePauseSpeakButton(isPaused) {
        if (!this.pauseSpeakBtn) return;

        if (isPaused) {
            this.pauseSpeakBtn.innerHTML = "<span>▶️</span> Reprendre";
        } else {
            this.pauseSpeakBtn.innerHTML = "<span>⏸️</span> Pause";
        }
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
        // Arrêter la lecture automatique
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

            // Mettre à jour la langue pour la synthèse vocale
            this.updateSpeechLanguage();

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

                    // Mettre à jour la langue pour la synthèse vocale
                    this.updateSpeechLanguage();

                    this.reset();
                } else {
                    // Pour une histoire standard, mettre à jour le contenu
                    this.historyTextElement.textContent = data.content;
                }
            }
        }
    }

    // Méthode pour nettoyage lorsqu'on quitte le lecteur
    cleanup() {
        // Arrêter la lecture automatique
        this.stopAutoPlay();
    }
}