const fs = require('fs');
let users = fs.readFileSync(process.cwd()+'/api/models/users.json');
let activities = fs.readFileSync(process.cwd()+'/api/models/activities.json');
let tasks = fs.readFileSync(process.cwd()+'/api/models/tasks.json');
const {  validationResult } = require('express-validator');
var {formatISO9075} = require('date-fns');

//? Read
exports.getActivities = async (req, res) => {
    let nbre = req.query.nbre ? parseInt(req.query.nbre) : 20;
    let page = req.query.page ? parseInt(req.query.page) : 1;

    let activitiesTmp = await JSON.parse(activities).activities;
    let activitiesArr = activitiesTmp
        .slice((page - 1) * nbre, page * nbre)
        .map(element => {
            return { "id": element.id, "name": element.name, "description": element.description };
        });
    let route = "/administration/activities?page=";
    res.jsonp({
        "links": {
            "current": route + page + "&nbre=" + nbre,
            "previous": page > 1 ? route + (page - 1) + "&nbre=" + nbre : undefined,
            "next": page < activitiesTmp.length / nbre ? route + (page + 1) + "&nbre=" + nbre : undefined,
            "first": page > 1 ? route + "1&nbre=" + nbre : undefined,
            "last": page < activitiesTmp.length / nbre ? route + Math.round(Math.ceil(activitiesTmp.length / nbre)) + "&nbre=" + nbre : undefined
        },
        "data": { "activities": activitiesArr }
    });
}
exports.getUniqueActivity = async (req, res) => {
    const activitiesArr = JSON.parse(activities).activities;
    //? Get pos of unique activity in the db
    const indexActivity = activitiesArr.findIndex((element) => element.id == req.params.id);
    //? Request of all tasks belongs activity
    const tasksArr = await JSON.parse(tasks).tasks.filter(element => {
        return element.activities_id === activitiesArr[indexActivity].id;
    });
    //? Check if the activity has been found
    if (indexActivity !== -1) {
        res.jsonp({ "activitiy": activitiesArr[indexActivity], "tasks" :tasksArr})
    } else {
        res.jsonp({
            "errors": {
                "status": "422",
                "source": { "pointer": "/administration/activities/:" + req.params.id },
                "title": "Activitie Not Found",
                "detail": "Check if the id has been altered."
            }

        })
    }
}
//? Create
exports.postActivity = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let body = req.body;
    let resultData = await JSON.parse(activities).activities;
    let newActivity = {
        "name": body.name,
        "description": body.description,
        "color_code": body.color_code,
        "status" : "ongoing",
        "created": formatISO9075(Date.now()),
        "updated": null,
        "id": Date.now(),
        "a_type": {
            "name": "",
            "id": 1
        }
    }
    resultData.push(newActivity);
    fs.writeFileSync(process.cwd() + '/api/models/activities.json', JSON.stringify({ "activities": resultData }));
    res.jsonp(newActivity)
}
//? Remove
exports.delActivity = async(req, res) => {
    let resultData = await JSON.parse(activities).activities;
    const indexActivity = resultData.findIndex((element) => element.id == req.params.id);

    let activity = resultData[indexActivity];
    if (indexActivity !== -1) {
        resultData.splice(indexActivity, 1);
        res.jsonp({ "infos": activity.name + " has been successefully deleted" });
        fs.writeFileSync(process.cwd() + '/api/models/activities.json', JSON.stringify({ "activities": resultData }));
    } else {
        res.status(422).jsonp({
            "errors": {
                "status": "422",
                "source": { "pointer": "/administration/activities/:" + req.params.id },
                "title": "Activity Not Found",
                "detail": "Check if the id has been altered."
            }

        })
    }
}
//? Update
exports.modifyActivity = async(req, res) => {
    let resultData = await JSON.parse(activities).activities;
    const indexActivity = resultData.findIndex((element) => element.id == req.params.id);
    if (indexActivity !== -1) {
        let body = req.body;
        let activity = resultData[indexActivity];
        let activityModified = {
            "name": body.name ? body.name : activity.name,
            "description": body.description? body.description: activity.description,
            "color_code": body.color_code? body.color_code: activity.color_code,
            "status" : body.done? body.done: activity.done,
            "created": activity.created,
            "updated": formatISO9075(Date.now()),
            "id": activity.id,
            "a_type": body.a_type? body.a_type: activity.a_type
        }
        resultData[indexActivity] = activityModified;
        fs.writeFileSync(process.cwd()+'/api/models/activities.json', JSON.stringify({ "activities": resultData }))
        res.jsonp({ "activity_infos": resultData[indexActivity] })
    } else {
        res.jsonp({
            "errors": {
                "status": "422",
                "source": { "pointer": "/administration/activities/:" + req.params.id },
                "title": "Activity Not Found",
                "detail": "Check if the id has been altered."
            }

        })
    }
}