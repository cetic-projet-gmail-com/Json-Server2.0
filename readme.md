# Cetic Project - JSON Server

Launch Server (port 3000): Nodemon

## Users
Route: /administration/users
Requête : Get, Get/:id, Post, Patch/:id Delete/:id

### Créer un nouvel utilisateur*
Champs Requis:
email = email,
firstname = String,
lastname = String,
login = String (ex: d.pierre)
role_id = Number (à determiner)
departement_id = Number (à determiner)

## Activities
Route: /administration/activities/
Requête : Get, Get/:id, Post, Patch/:id Delete/:id

### Poster une nouvelle Activité
Champs Requis:
name = String,
description = String,
color_code = couleur hexa (#f6f6f6)

## TASKS
Route: /administration/tasks/
Requête : Get, Post, Patch/:id Delete/:id

### Poster une nouvelle Tâche*

Champs Requis:
name = String,
description = String,
activities_id = Vrai id d'une Activité

## EVENT
Route: /events
Requête : Post, Patch/:id Delete/:id

*Poster un nouvel event (billet visible calendrier)*

Champs Requis:
start = ISO9075,
end = ISO9075,
description = String,
tasks_id = Vrai Id d'une tâche 

(ISO9075 => 2020-02-29 09:00:00)
https://date-fns.org/v2.8.1/docs/formatISO9075

## Home Page
Route: /home
Requête : Get

Le json renvoie dans Data la liste des events, Activités et tâches
Params:
display = week | month | day
Par défaut, cette Route renvoie la semaine actuelle
*Week*
Params:
week = numéro de la semaine (+/- 52 semaine sur un an)
year
semaine suivant = links.nextWeek
semaine précédente = links.nextWeek
ex route: /home?display=week&week=8&year=2020
*Mont*
Params:
month
year
mois suivant = links.nextMonth
mois précédent = links.prevMonth
ex route = /home?display=month&month=2&year=2020
*Day*
Params:
Date = dd-mm-yyyy (pas de slash, des tirets)
jour suivant = links.nextDay
jour précédent = links.prevDay
ex route = /home?display=day&date=23-02-2020

**Login**
Route : /login
Requête: Post
Champs Requis:
login = (Moderateur, User, Admin ou tout autres users encodés)
password = (le vrai mdp => Moderateur2020,..)

**Profil**
Route : /Profil
Requête: Get


