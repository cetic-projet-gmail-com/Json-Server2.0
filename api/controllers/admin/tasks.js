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
    const indexActivity = await JSON.parse(activities).activities.findIndex((element) => element.id == req.body.activities_id);
    let resultData = await JSON.parse(tasks).tasks;

    if (indexActivity !==-1) {
        let body = req.body;
        let newTask = {
            "id": Date.now(),
            "activities_id": body.activities_id,
            "name": body.name,
            "description": body.description,
            "done": body.done? body.done: "",
            "created": formatISO9075(Date.now()),
            "updated": formatISO9075(Date.now())
        }
        resultData.push(newTask);
        fs.writeFileSync(process.cwd()+'/api/models/tasks.json', JSON.stringify({ "tasks": resultData }));
        res.json({"infos" : "task created", "data":{"task":newTask}});
    } else {
        res.json({ "errors": {
            "source": "/administration/tasks/",
            "title": "activity_id Not Found",
            "detail": "Check if the id has been altered."}
        })
    }
}
//? Update
exports.modifyTask = async (req, res) => {
    let body = req.body;

    let resultData = await JSON.parse(tasks).tasks;
    const indexTask = resultData.findIndex((element) => element.id == req.params.id);

    if (indexTask !== -1) {
        let task = resultData[indexTask];

        let taskModified = {
            "id": task.id,
            "activities_id": task.activities_id,
            "name": body.name? body.name: task.name,
            "description": body.description? body.description: task.description,
            "done": body.done? body.done: task.done,
            "created": formatISO9075(Date.now()),
            "updated": formatISO9075(Date.now())
        }
        resultData[indexTask] = taskModified;
        
        fs.writeFileSync(process.cwd()+'/api/models/tasks.json', JSON.stringify({ "tasks": resultData }))
        res.json({"infos": "task updated", "data": {"task" : resultData[indexTask] }});
    } else {
        res.status(422).json({
            "errors": {
                "source": "/administration/tasks/:" + req.params.id ,
                "title": "Task Not Found",
                "detail": "Check if the id has been altered."
            }
        });
    }
}
//? Delete
exports.delTask = async (req, res) => {
    let resultData = await JSON.parse(tasks).tasks;
    const indexTask = resultData.findIndex((element) => element.id == req.params.id);

    if (indexTask !== -1) {
        
        let task = resultData[indexTask];
        resultData.splice(indexTask, 1);
        res.json({ "infos": task.name+ " deleted" });
        fs.writeFileSync(process.cwd()+'/api/models/tasks.json', JSON.stringify({ "tasks": resultData }));
    } else {
        res.status(422).json({
            "errors": {
                "source": "/administration/tasks/:" + req.params.id,
                "title": "Task Not Found",
                "detail": "Check if the id has been altered."
            }
        });
    }
}