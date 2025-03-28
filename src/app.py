from flask import Flask, render_template, request
from back.BDDCommunication import BDDCommunication
from back.Exercice import Exercice as Ex
from back.Histoire import Histoire as Hiz

SRC_BDD = "/bdd/"
HISTORY_FILE_NAME = "Histoire_BDD.json"
EXOS_FILE_NAME = "Exos_BDD.json"
lang: str = "English"
bdd = BDDCommunication(SRC_BDD, HISTORY_FILE_NAME, EXOS_FILE_NAME)

app = Flask(__name__)

@app.route("/", methods=['GET', 'POST'])
def home():
    return render_template("index.html")

@app.route("/lang", methods=["GET"])
def change_lang():
    language : str = request.args.get("lang")
    lang = language
    return {"lang" : lang}
@app.route("/history", methods=['GET'])
def send_history_data():
    return bdd.getStoriesJson(lang)

@app.route("/maths", methods=['GET'])
def send_maths_data():
    data = bdd.getExosJson()
    return data

if __name__ == "__main__":
    app.run(debug=True)