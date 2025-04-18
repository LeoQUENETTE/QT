# Description

Il s'agit d'un projet développé par l'équipe template pourris™
* Maksym Lytvynenko
* Léonard Rivals
* Léo Quenette
* Matis Bazireau
 

Dans le cadre de l'UE gestion de projet, la réalisation de l'exercice suivant nous as été demandé.
Cet exercice consiste en le développement d'une page-web pouvant aider des enfants dans l'apprentissage de deux matières, les mathématiques et l'histoire.
L'objectif est de choisir l'une de ses deux matières et d'utiliser l'interface de QTrobot pour rendre le tout éducatif et ludique.

"QTrobot est un petit humanoïde expressif conçu comme un outil pour les thérapeutes et les éducateurs. Il utilise des expressions faciales, des gestes et des jeux pour enseigner aux enfants atteints de troubles du spectre autistique la communication, les émotions et les compétences sociales."

Dans notre cas, nous avons décidé d'implémenter les deux matières, les "mathématiques" et les "histoires". Nous avons fait ce choix dans l'objetif de donner une expérience complètes aux utilisateur mais aussi de varier les exercices auxquelles l'enfant est soumis.

(!! Attention, qtrobot est un robot physique dans son emploi principal, ici, nous utilisons juste une version 2D pour chercher si oui ou non, une interface 2d/image peut avoir un rôle à Qtrobot « physique »!!)

# Fonctionnalités

## Mathématiques

Notre robot devra pouvoir être capable de proposer des questions de mathématiques de niveau "CP", tout en pouvant expliquer si la réponse donnée par l'utilisateur est vraie ou non et expliquer comment trouver la solution si l'on s'est trompé.

L'enfant peut ainsi faire une série de 5 questions faciles en mathématiques ne comportant que des additions et des soustractions. A chaque erreur une popup est affiché montrant le calcul réalisé par l'enfant.

Si un enfant réussi la série de question son score est sauvegardé e il pourra ainsi admiré son score !

## Lecture

Notre robot permet de lire des histoires en français et en anglais, et de les afficher. Les histoires sont lu grâce à de la synthérication vocale et sont synchronisé avec la lecture, permettant à l'enfant de faire le lien entre les mots lu et les mots dit par le robot, facilitant l'apprentissage de la langue choisi.

Il est aussi tout à fait possible de faire une pause dans la lecture de l'histoire ou de revenir sur une phrase déjà entamer.

# Installation

Le site n'étant pas hébergé, et donc non disponible en ligne il est nécessaire de le télécharger et de le faire fonctionner sur un réseau local.

Afin de pouvoir profiter du site il est nécessaire de devoir installer python au minimum 3.9 sut le site de l'entreprise : 
https://www.python.org/

Puis de cloner le code du site est de faire les commandes suivantes dans un terminal :  
pip install flask
python src/app.py

Cela vous lancera une instance du site sur votre machine en local permettant de profiter de l'expérience QT en local.