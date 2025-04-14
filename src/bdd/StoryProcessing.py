import json
import re
import nltk
from nltk.tokenize import sent_tokenize

# Télécharger les ressources NLTK nécessaires (à exécuter une seule fois)
# nltk.download('punkt')

# Dictionnaire des émotions
emotions_dictionary = {
    "happy": {
        "fr": ["joyeux", "joyeuse", "éclata de rire", "fier", "léger", "s'amuser", "rigolo", "blagues", "sifflotait", "cœur léger", "énerg", "plein d'idées", "félicit"],
        "en": ["happy", "joyful", "laughing", "proud", "light", "fun", "funny", "jokes", "whistled", "light heart", "energy", "full of ideas", "congratulated"]
    },
    "sad": {
        "fr": ["triste", "cœur lourd", "larme", "renifla"],
        "en": ["sad", "heart heavy", "tear", "sniffled"]
    },
    "scared": {
        "fr": ["inquiet", "peur", "paniqua", "trembl", "se serra"],
        "en": ["scared", "fear", "worried", "panic", "trembled", "tightened"]
    },
    "angry": {
        "fr": ["fâché", "colère", "contrariait", "renfrognait", "explosait", "explosa", "monter au nez", "rouge", "hurla", "grommelant", "énerver", "tapa du pied"],
        "en": ["angry", "explode", "exploded", "furious", "gotten angry", "red", "frown", "temper rising", "shouted", "muttering", "stomped"]
    },
    "surprised": {
        "fr": ["excité", "excédé"],
        "en": ["excited", "exasperated", "surprised"]
    },
    "jealous": {
        "fr": ["jaloux"],
        "en": ["jealous"]
    },
    "ashamed": {
        "fr": ["honteux"],
        "en": ["ashamed"]
    },
    "neutral": {
        "fr": ["patient", "serein", "calmer", "apprendre"],
        "en": ["patient", "peaceful", "neutral", "emotional", "emotions", "starving", "calm down", "learn"]
    }
}

def detect_emotions_in_text(text, language):
    """Détecte les émotions présentes dans un texte."""
    detected_emotions = []
    
    text_lower = text.lower()
    
    for emotion, lang_dict in emotions_dictionary.items():
        emotion_words = lang_dict.get(language, [])
        
        for word in emotion_words:
            if word.lower() in text_lower:
                detected_emotions.append(emotion)
                break
    
    # Si aucune émotion n'est détectée, on retourne "neutral"
    return detected_emotions if detected_emotions else ["neutral"]

def split_french_english_content(content):
    """Sépare le contenu en versions française et anglaise."""
    if "English version:" in content:
        parts = content.split("English version:")
        french_content = parts[0].strip()
        english_content = parts[1].strip()
        return french_content, english_content
    else:
        # Si pas de séparation explicite, on essaie de détecter la langue
        if "Once upon a time" in content:
            return None, content
        else:
            return content, None

def process_language_content(content, language):
    """Traite le contenu d'une langue spécifique."""
    # Supprimer les séparateurs de paragraphes
    content = content.replace("________________", "")
    
    # Tokenizer le texte en phrases
    sentences = sent_tokenize(content)
    
    # Traiter chaque phrase
    story_data = []
    for sentence in sentences:
        sentence = sentence.strip()
        if sentence:  # Ignorer les phrases vides
            emotions = detect_emotions_in_text(sentence, language)
            story_data.append({
                "text": sentence,
                "emotions": emotions
            })
    
    return story_data

def process_story_file(file_path):
    """Traite un fichier d'histoire et crée deux fichiers JSON (français et anglais)."""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Séparer les versions française et anglaise
        french_content, english_content = split_french_english_content(content)
        
        results = {}
        
        # Traiter la version française si elle existe
        if french_content:
            french_data = process_language_content(french_content, "fr")
            results["fr"] = {
                "title": "Le Loup qui apprivoisait ses émotions",
                "language": "French",
                "sentences": french_data
            }
        
        # Traiter la version anglaise si elle existe
        if english_content:
            english_data = process_language_content(english_content, "en")
            results["en"] = {
                "title": "The Wolf Who Learned to Control His Emotions",
                "language": "English",
                "sentences": english_data
            }
        
        # Écrire les résultats dans des fichiers JSON
        output_files = []
        
        for lang, data in results.items():
            output_file = file_path.replace('.txt', f'_{lang}.json')
            with open(output_file, 'w', encoding='utf-8') as json_file:
                json.dump(data, json_file, ensure_ascii=False, indent=2)
            output_files.append(output_file)
        
        # Créer également un fichier combiné avec les deux langues
        if len(results) > 1:
            combined_output = file_path.replace('.txt', '_combined.json')
            with open(combined_output, 'w', encoding='utf-8') as json_file:
                json.dump(results, json_file, ensure_ascii=False, indent=2)
            output_files.append(combined_output)
        
        return output_files
    
    except Exception as e:
        print(f"Erreur lors du traitement du fichier: {e}")
        return None

# Exemple d'utilisation
if __name__ == "__main__":
    file_path = "Histoire_HAI810_Conduite_Projet_2025.txt"
    output_files = process_story_file(file_path)
    if output_files:
        print(f"Fichiers JSON créés avec succès: {', '.join(output_files)}")