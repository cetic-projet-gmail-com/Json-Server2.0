const fs = require('fs');
let events = fs.readFileSync(process.cwd()+'/api/models/events.json');
let activities = fs.readFileSync(process.cwd()+'/api/models/activities.json');
let users = fs.readFileSync(process.cwd()+'/api/models/users.json');

let tasks = fs.readFileSync(process.cwd()+'/api/models/tasks.json');
const {  validationResult } = require('express-validator');
var {formatISO9075,differenceInHours, parseISO} = require('date-fns');
//? Create
exports.postEvent = async(req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const indexTask = await JSON.parse(tasks).tasks.findIndex((element) => element.id == req.body.tasks_id);
    if (indexTask !==-1) {
        let body = req.body;
        usersArr = await JSON.parse(users).users;
        let resultData = await JSON.parse(events).events;
        let start = parseISO(body.start);
        let end = parseISO(body.end);
        let duration = await differenceInHours(end, start);
        let newEvent = {
            "id": Date.now(),
            "duration": duration,
            "start": formatISO9075(start),
            "end": formatISO9075(end),
            "created": formatISO9075(Date.now()),
            "updated": null,
            "description": body.description,
            "user_id": usersArr[Math.floor(Math.random() * Math.floor(usersArr.length))].id,
            "tasks_id": body.tasks_id
        }
        resultData.push(newEvent);
        fs.writeFileSync(process.cwd()+  '/api/models/events.json', JSON.stringify({ "events": resultData }));
        res.jsonp(newEvent)
    } else {
        res.jsonp({"error" : "event parent not find or not been set (tasks_id)"})
    }
}
//? Update
exports.upEvent = async (req, res) => {
    let resultData = await JSON.parse(events).events;
    const indexEvent = resultData.findIndex((element) => element.id == req.params.id);
    if (indexEvent !== -1) {
        let body = req.body;
        let event = resultData[indexEvent];
        let start = body.start? parseISO(body.start): parseISO(event.start);
        let end = body.end? parseISO(body.end): parseISO(event.end);
        let duration = await differenceInHours(end, start);
        console.log(duration)
        let eventModified = {
            "id": event.id,
            "duration": duration,
            "start": formatISO9075(start),
            "end": formatISO9075(end),
            "created": event.created,
            "updated": formatISO9075(Date.now()),
            "description": body.description ? body.description: event.description,
            "user_id": event.user_id,
            "tasks_id": event.tasks_id
        }
        resultData[indexEvent] = eventModified;
        fs.writeFileSync(process.cwd()+'/api/models/events.json', JSON.stringify({ "events": resultData }))
        res.jsonp({ "event_infos": resultData[indexEvent] })
    } else {
        res.jsonp({
            "errors": {
                "status": "422",
                "source": { "pointer": "/administration/events/:" + req.params.id },
                "title": "Event Not Found",
                "detail": "Check if the id has been altered."
            }
        });
    }
}
//? Delete
exports.delEvent = async(req, res) => {
    let resultData = await JSON.parse(events).events;
    const indexEvent = resultData.findIndex((element) => element.id == req.params.id);

    let event = resultData[indexEvent];
    if (indexEvent !== -1) {
        resultData.splice(indexEvent, 1);
        res.jsonp({ "infos": event.description + " has been successefully deleted" });
        fs.writeFileSync(process.cwd()+'/api/models/events.json', JSON.stringify({ "events": resultData }));
    } else {
        res.jsonp({
            "errors": {
                "status": "422",
                "source": { "pointer": "/events/:" + req.params.id },
                "title": "Event Not Found",
                "detail": "Check if the id has been altered."
            }
        });
    }
}
