# Projet QTrobot - Apprentissage Ludique pour Enfants

Projet réalisé par l'équipe **template pourris™** :  
- Maksym Lytvynenko  
- Léonard Rivals  
- Léo Quenette  
- Matis Bazireau  

Dans le cadre de l’UE **Gestion de Projet**, il nous a été demandé de développer une page web éducative destinée aux enfants, avec pour objectif de les accompagner dans l’apprentissage de deux matières fondamentales : **les mathématiques** et **l’histoire**.

Nous avons utilisé l’interface du **QTrobot**, un petit robot humanoïde expressif, comme support ludique et pédagogique. Ce robot est initialement conçu pour les enfants atteints de troubles du spectre autistique, afin de les aider à mieux comprendre les émotions, la communication et les compétences sociales.

> 💡 **Note :** Dans notre projet, nous utilisons une version **2D** de QTrobot (images et animations) et non le robot physique. Cela nous permet d’évaluer l’efficacité d'une interface visuelle dans la transmission des intentions du robot.

---

## 🧠 Fonctionnalités

### 🤖 Interaction Émotionnelle

L’un des objectifs de ce projet est de permettre aux enfants de reconnaître des émotions simples à travers des visuels. QTrobot affiche différentes expressions en fonction des réponses de l’enfant :
- ✅ Bonne réponse : QT est **heureux**.
- ❌ Mauvaise réponse : QT devient **triste** ou **déçu**.

Ce fonctionnement est vrai aussi lors de la lecture des histoires :
- Mot faisant référence à la joie : QT est **heureux**
- Mot faisant référence à la trsitessse : QT est **triste**
- Mot faisant référence à la colère : QT est en **colère** 

Cette approche aide à développer l’empathie et à renforcer le lien affectif avec l’interface.

### ➕ Mathématiques (niveau CP)

Le robot propose une série de **5 questions** basées sur des opérations simples (additions et soustractions).  
Fonctionnalités incluses :
- Validation de la réponse.
- Explication de la bonne réponse en cas d’erreur.
- Affichage d'une popup en cas de réponse incorrecte, montrant le raisonnement suivi.
- Sauvegarde du score de l’enfant à la fin du quiz.

### 📖 Lecture d'Histoires

QTrobot lit des histoires en **français** et en **anglais**, accompagnées d’une **synthèse vocale** synchronisée avec le texte affiché à l’écran :
- L’enfant suit les mots à l’écran pendant qu’ils sont lus.
- Possibilité de **mettre en pause** la lecture ou de **revenir en arrière** pour mieux comprendre.
- Aide à la reconnaissance des mots et à l’apprentissage de la langue choisie.

---

## ⚙️ Installation et Lancement

Le projet n'étant pas encore hébergé en ligne, il doit être exécuté **en local** sur votre machine.

### Prérequis
- **Python 3.9 ou supérieur** : [Télécharger ici](https://www.python.org/)

### Étapes d'installation
1. **Instaler Flask** :
    ```bash
    pip install flask
    ```

2. **Cloner le dépôt du projet** :
   ```bash
   git clone https://github.com/LeoQUENETTE/QT.git
   cd QT
   ```
3. **Lancer le projet** :
    ```bash
    python src/app.py
    ```
