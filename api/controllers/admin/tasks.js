const fs = require('fs');
let users = fs.readFileSync(process.cwd()+'/api/models/users.json');
let activities = fs.readFileSync(process.cwd()+'/api/models/activities.json');
let tasks = fs.readFileSync(process.cwd()+'/api/models/tasks.json');
const {  validationResult } = require('express-validator');
var {formatISO9075} = require('date-fns');

//? Create
exports.postTasks = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const resultData = await JSON.parse(activities).activities;
    const indexActivity = resultData.findIndex((element) => element.id == req.body.activities_id);
    if (indexActivity !==-1) {
        let body = req.body;
        let newTask = {
            "id": Date.now(),
            "activities_id": body.activities_id,
            "name": body.name,
            "description": body.description,
            "done": body.done? body.done: "",
            "created": formatISO9075(Date.now()),
            "updated": null
        }
        resultData.push(newTask);
        fs.writeFileSync(process.cwd()+'/api/models/tasks.json', JSON.stringify({ "tasks": resultData }));
        res.jsonp(newTask)
    } else {
        res.jsonp({"error" : "activities parent not find or not been set (activies_id)"})
    }
}
//? Update
exports.modifyTask = async (req, res) => {
    let resultData = await JSON.parse(tasks).tasks;
    const indexTask = resultData.findIndex((element) => element.id == req.params.id);
    if (indexTask !== -1) {
        let body = req.body;
        let task = resultData[indexTask];

        let taskModified = {
            "id": task.id,
            "activities_id": task.activities_id,
            "name": body.name? body.name: task.name,
            "description": body.description? body.description: task.description,
            "done": body.done? body.done: task.done,
            "created": task.created,
            "updated": formatISO9075(Date.now())
        }
        resultData[indexTask] = taskModified;
        
        fs.writeFileSync(process.cwd()+'/api/models/tasks.json', JSON.stringify({ "tasks": resultData }))
        res.jsonp({ "task_infos": resultData[indexTask] })
    } else {
        res.jsonp({
            "errors": {
                "status": "422",
                "source": { "pointer": "/administration/tasks/:" + req.params.id },
                "title": "Task Not Found",
                "detail": "Check if the id has been altered."
            }

        })
    }
}
//? Delete
exports.delTask = async (req, res) => {
    let resultData = await JSON.parse(tasks).tasks;
    const indexTask = resultData.findIndex((element) => element.id == req.params.id);

    if (indexTask !== -1) {
        
        let task = resultData[indexTask];
        resultData.splice(indexTask, 1);
        res.jsonp({ "infos": task.name+ " has been successefully deleted" });
        fs.writeFileSync(process.cwd()+'/api/models/tasks.json', JSON.stringify({ "tasks": resultData }));
    } else {
        res.jsonp({
            "errors": {
                "status": "422",
                "source": { "pointer": "/administration/tasks/:" + req.params.id },
                "title": "Task Not Found",
                "detail": "Check if the id has been altered."
            }
        });
    }
}