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

Dans notre cas, nous avons décidé d'utiliser comme matière les "mathématiques".

# Fonctionnalités

Notre robot devra pouvoir être capable de proposer des questions de mathématiques de niveau "cp", tout en pouvant expliquer si la réponse donnée par l'utilisateur est vraie ou non et expliquer comment trouver la solution si l'on s'est trompé.

(!! Attention, qtrobot est un robot physique dans son emploi principal, ici, nous utilisons juste une version 2D pour chercher si oui ou non, une interface 2d/image peut avoir un rôle à Qtrobot « physique »!!)

# Installation

Afin de pouvoir profiter du site il est nécessaire de devoir installer python au minimum 3.9 sut le site de l'entreprise : 
https://www.python.org/

Puis de cloner le code du site est de faire les commandes suivantes dans un terminal :  
pip install flask
python src/app.py

Cela vous lancera une instance du site sur votre machine en local permettant de profiter de l'expérience QT en local.

# Information complémentaire

Le site n'est pas mis en ligne suite a des complications lors de la mise en ligne sur Azure Cloud. Si une version en ligne est mis en ligne ce README sera mis à jour. De plus le site devait pouvoir présenté à la fois les fonctionnalités pour les histoires et les mathématiques mais au vu de la contrainte de temps cela n'a malheuresement pas été possible. Il est tout de fois possible de voir le début d'implémentation.

Un système de difficulté est bien présent mais il n'a pas encore été relié à l'interface front.
