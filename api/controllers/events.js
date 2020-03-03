const fs = require('fs');
let events = fs.readFileSync(process.cwd()+'/api/models/events.json');
let activities = fs.readFileSync(process.cwd()+'/api/models/activities.json');
let users = fs.readFileSync(process.cwd()+'/api/models/users.json');

let tasks = fs.readFileSync(process.cwd()+'/api/models/tasks.json');
const {  validationResult } = require('express-validator');
var {formatISO9075,differenceInMinutes, parseISO} = require('date-fns');

