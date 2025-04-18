/**
 * Classe gérant la synthèse vocale pour l'application d'histoire
 */
export default class SpeechSynthesis {
    constructor() {
        // Vérifier si la synthèse vocale est disponible dans le navigateur
        this.available = 'speechSynthesis' in window;

        // Propriétés de la synthèse vocale
        this.synth = this.available ? window.speechSynthesis : null;
        this.utterance = null;
        this.voicesLoaded = false;
        this.voices = [];
        this.currentVoice = null;
        this.currentLanguage = "fr-FR"; // Langue par défaut
        this.speaking = false;
        this.paused = false;

        // Initialiser les voix si disponibles
        if (this.available) {
            this.initVoices();
        }
    }

    /**
     * Initialise les voix disponibles
     */
    initVoices() {
        // Certains navigateurs chargent les voix de manière asynchrone
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => {
                this.loadVoices();
            };
        } else {
            // Pour les navigateurs qui chargent les voix immédiatement
            this.loadVoices();
        }
    }

    /**
     * Charge les voix disponibles
     */
    loadVoices() {
        this.voices = this.synth.getVoices();
        this.voicesLoaded = true;
        this.selectAppropriateVoice();
    }

    /**
     * Sélectionne une voix appropriée en fonction de la langue actuelle
     */
    selectAppropriateVoice() {
        if (!this.voicesLoaded || this.voices.length === 0) return;

        // Chercher une voix correspondant à la langue actuelle
        const languagePrefix = this.currentLanguage.split('-')[0]; // 'fr' ou 'en'

        // Essayer de trouver une voix qui correspond exactement à la langue
        let matchingVoice = this.voices.find(voice =>
            voice.lang.toLowerCase() === this.currentLanguage.toLowerCase()
        );

        // Si pas de correspondance exacte, essayer avec le préfixe de langue
        if (!matchingVoice) {
            matchingVoice = this.voices.find(voice =>
                voice.lang.toLowerCase().startsWith(languagePrefix.toLowerCase())
            );
        }

        // Si toujours pas de correspondance, utiliser la première voix disponible
        if (!matchingVoice && this.voices.length > 0) {
            matchingVoice = this.voices[0];
        }

        this.currentVoice = matchingVoice;
        console.log(`Voix sélectionnée: ${this.currentVoice ? this.currentVoice.name : 'Aucune'}`);
    }

    /**
     * Définit la langue à utiliser
     * @param {string} language - Code de langue (fr-FR, en-US, etc.)
     */
    setLanguage(language) {
        this.currentLanguage = language;
        this.selectAppropriateVoice();
    }

    /**
     * Lit un texte à haute voix
     * @param {string} text - Texte à lire
     * @returns {boolean} - Succès de l'opération
     */
    speak(text) {
        if (!this.available || !text) return false;

        // Arrêter toute lecture en cours
        this.stop();

        // Créer un nouvel objet d'énoncé
        this.utterance = new SpeechSynthesisUtterance(text);

        // Définir la voix et les paramètres
        if (this.currentVoice) {
            this.utterance.voice = this.currentVoice;
        }

        this.utterance.lang = this.currentLanguage;
        this.utterance.rate = 1.0; // Vitesse normale
        this.utterance.pitch = 1.0; // Hauteur normale
        this.utterance.volume = 1.0; // Volume maximal

        // Ajouter des gestionnaires d'événements
        this.utterance.onstart = () => {
            this.speaking = true;
            this.paused = false;
            console.log('Lecture démarrée');
        };

        this.utterance.onend = () => {
            this.speaking = false;
            this.paused = false;
            console.log('Lecture terminée');
        };

        this.utterance.onerror = (event) => {
            console.error('Erreur de synthèse vocale:', event.error);
            this.speaking = false;
            this.paused = false;
        };

        // Démarrer la lecture
        this.synth.speak(this.utterance);
        return true;
    }

    /**
     * Obtient l'objet d'énoncé actuel
     * @returns {SpeechSynthesisUtterance|null} - L'objet d'énoncé ou null
     */
    getCurrentUtterance() {
        return this.utterance;
    }

    /**
     * Met en pause la lecture en cours
     * @returns {boolean} - Succès de l'opération
     */
    pause() {
        if (!this.available || !this.speaking || this.paused) return false;

        this.synth.pause();
        this.paused = true;
        console.log('Lecture en pause');
        return true;
    }

    /**
     * Reprend la lecture après une pause
     * @returns {boolean} - Succès de l'opération
     */
    resume() {
        if (!this.available || !this.speaking || !this.paused) return false;

        this.synth.resume();
        this.paused = false;
        console.log('Lecture reprise');
        return true;
    }

    /**
     * Arrête la lecture en cours
     * @returns {boolean} - Succès de l'opération
     */
    stop() {
        if (!this.available) return false;

        this.synth.cancel();
        this.speaking = false;
        this.paused = false;
        console.log('Lecture arrêtée');
        return true;
    }

    /**
     * Vérifie si la synthèse vocale est disponible
     * @returns {boolean} - Disponibilité de la synthèse vocale
     */
    isAvailable() {
        return this.available;
    }

    /**
     * Vérifie si la lecture est en cours
     * @returns {boolean} - État de la lecture
     */
    isSpeaking() {
        return this.speaking;
    }

    /**
     * Vérifie si la lecture est en pause
     * @returns {boolean} - État de la pause
     */
    isPaused() {
        return this.paused;
    }

    /**
     * Obtient la liste des voix disponibles
     * @returns {Array} - Liste des voix
     */
    getVoices() {
        return this.voices;
    }

    /**
     * Change la voix utilisée
     * @param {number} index - Index de la voix dans la liste
     * @returns {boolean} - Succès de l'opération
     */
    changeVoice(index) {
        if (!this.available || !this.voices || index >= this.voices.length) return false;

        this.currentVoice = this.voices[index];
        return true;
    }

    /**
     * Ajuste la vitesse de lecture
     * @param {number} rate - Vitesse de lecture (0.1 à 10)
     */
    setRate(rate) {
        if (!this.available || !this.utterance) return;

        // Limiter la vitesse entre 0.1 et 10
        const normalizedRate = Math.max(0.1, Math.min(10, rate));

        if (this.utterance) {
            this.utterance.rate = normalizedRate;
        }
    }

    /**
     * Ajuste la hauteur de la voix
     * @param {number} pitch - Hauteur (0 à 2)
     */
    setPitch(pitch) {
        if (!this.available || !this.utterance) return;

        // Limiter la hauteur entre 0 et 2
        const normalizedPitch = Math.max(0, Math.min(2, pitch));

        if (this.utterance) {
            this.utterance.pitch = normalizedPitch;
        }
    }

    /**
     * Ajuste le volume de lecture
     * @param {number} volume - Volume (0 à 1)
     */
    setVolume(volume) {
        if (!this.available || !this.utterance) return;

        // Limiter le volume entre 0 et 1
        const normalizedVolume = Math.max(0, Math.min(1, volume));

        if (this.utterance) {
            this.utterance.volume = normalizedVolume;
        }
    }
}