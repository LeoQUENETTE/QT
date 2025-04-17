from flask import Flask, render_template, request, jsonify
import json
from shared import SRC_DIRECTORY
from datetime import datetime
from back.BDDCommunication import BDDCommunication
from back.Exercice import Exercice as Ex
from back.Histoire import Histoire as Hiz

SRC_BDD = "bdd/"
HISTORY_FILE_NAME = "Histoire_BDD.json"
EXOS_FILE_NAME = "Exos_BDD.json"
ADVANCED_HISTORY_FILE_NAME = "Histoire_HAI810_Conduite_Projet_2025.json"
MATH_SCORES_FILE = "math_scores.json"  # Fichier pour stocker les scores
lang: str = "English"
bdd = BDDCommunication(SRC_BDD, HISTORY_FILE_NAME, EXOS_FILE_NAME, ADVANCED_HISTORY_FILE_NAME)

app = Flask(__name__)

@app.route("/", methods=['GET', 'POST'])
def home():
    return render_template("index.html")

@app.route("/lang", methods=["GET"])
def change_lang():
    global lang  # Assurez-vous d'utiliser la variable globale
    language : str = request.args.get("lang")
    if language:
        lang = language
    return {"lang" : lang}

@app.route("/history", methods=['GET'])
def send_history_data():
    return bdd.getStoriesJson(lang)

@app.route("/advanced_history", methods=['GET'])
def send_advanced_history_data():
    """Endpoint pour récupérer l'histoire au format avancé (avec phrases et émotions)"""
    requested_lang = request.args.get("lang", lang)  # Utiliser la langue spécifiée ou la langue globale
    advanced_story = bdd._getAdvancedStoryJson(requested_lang)
    if advanced_story:
        return advanced_story
    return {"error": "No advanced story available", "type": "Error"}

@app.route("/maths", methods=['GET'])
def send_maths_data():
    data = bdd.getExosJson()
    return data

@app.route("/math/scores", methods=['GET'])
def get_math_scores():
    """Récupérer l'historique des scores en mathématiques"""
    try:
        # Essayer de lire le fichier des scores s'il existe
        try:
            with open(f"{SRC_DIRECTORY}/{SRC_BDD}{MATH_SCORES_FILE}", "r", encoding="utf-8") as file:
                scores = json.load(file)
        except (FileNotFoundError, json.JSONDecodeError):
            # Si le fichier n'existe pas ou est corrompu, renvoyer une liste vide
            scores = []
        
        # Renvoyer les 5 derniers scores
        return jsonify(scores[-5:])
    except Exception as e:
        return jsonify({"error": str(e), "type": "Error"})

@app.route("/math/score", methods=['POST'])
def save_math_score():
    """Enregistrer un nouveau score de mathématiques"""
    try:
        # Récupérer les données du score
        score_data = request.json
        print(score_data)
        if not score_data or "score" not in score_data or "total" not in score_data:
            return jsonify({"error": "Invalid score data", "type": "Error"})
        
        # Créer l'entrée du score
        new_score = {
            "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "score": score_data["score"],
            "total": score_data["total"],
            "percentage": round((score_data["score"] / score_data["total"]) * 100)
        }
        print(f"{SRC_DIRECTORY}/{SRC_BDD}{MATH_SCORES_FILE}")
        # Lire les scores existants
        try:
            with open(f"{SRC_DIRECTORY}/{SRC_BDD}{MATH_SCORES_FILE}", "r", encoding="utf-8") as file:
                scores = json.load(file)
        except (FileNotFoundError, json.JSONDecodeError):
            scores = []
        
        # Ajouter le nouveau score
        scores.append(new_score)
        
        # Enregistrer les scores mis à jour
        with open(f"{SRC_DIRECTORY}/{SRC_BDD}{MATH_SCORES_FILE}", "w", encoding="utf-8") as file:
            json.dump(scores, file, indent=4)
        
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e), "type": "Error"})

if __name__ == "__main__":
    app.run(debug=True)