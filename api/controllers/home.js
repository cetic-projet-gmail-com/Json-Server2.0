// const events = require('../models/events.json');
const fs = require('fs');
// let eventsJSON = fs.readFileSync(process.cwd()+'/api/models/events.json');
let events = fs.readFileSync(process.cwd()+'/api/models/events.json');
let users = fs.readFileSync(process.cwd()+'/api/models/users.json');

let activities = fs.readFileSync(process.cwd()+'/api/models/activities.json');
let tasks = fs.readFileSync(process.cwd()+'/api/models/tasks.json');

let { getWeek, format, addDays, getWeekYear, getISOWeeksInYear } = require('date-fns');
const {  validationResult } = require('express-validator');
var {formatISO9075,differenceInMinutes, parseISO} = require('date-fns');

exports.index = async (req, res) => {
    let today = new Date(Date.now());
    
    if (req.query.display === "day") { //? Route: /home?display=day&date=21/02/2020

        let dateFormat = 'dd-MM-yyyy';
        let day = req.query.date ? urlDate(req.query.date) : today;
        let dayFormated = format(new Date(day), dateFormat);
        function urlDate(date) {
            date = date.split('-');
            return date[2] + "-" + date[1] + "-" + date[0];
        }
        //? Return Array if events start date = query date !(compare whitout time)
        let eventsArr = await JSON.parse(events).events.filter(element => {
            return format(new Date(element.start), dateFormat) === dayFormated;
        });

        let route = '/home?display=day&date='
        return res.status(200).json({/*
            "links": {
                "currentDay": route + dayFormated,
                "prevDay": route + format(addDays(Date.parse(day), 1), dateFormat),
                "nextDay": route + format(addDays(Date.parse(day), -1), dateFormat)
            },*/
            "data": {
                "activities": JSON.parse(activities).activities,
                "tasks": JSON.parse(tasks).tasks,
                "events": eventsArr
            }
        });
        
    } else if (req.query.display === "month") { //? Route: /home?display=month&month=2&year=2020


        let month = req.query.month ? parseInt(req.query.month) - 1 : today.getMonth();
        let year = req.query.year ? parseInt(req.query.year) : today.getFullYear();

        let eventsArr = await JSON.parse(events).events.filter(element => {
            let tmpDate = new Date(element.start);
            return tmpDate.getMonth() === month && tmpDate.getFullYear() === year;
        });
        //let prevMonth = month === 0 ? "12&year" + (year - 1) : month + "&year=" + year;
        //let nextMonth = month === 11 ? "01&year" + (year + 1) : (month + 2) + "&year=" + year;
        //let route = "/home?display=month&month=";
        return res.status(200).json({
            /*"links": {
                "currentMonth": route + (month + 1) + "&year=" + year,
                "prevMonth": route + prevMonth,
                "nextMonth": route + nextMonth,
            },*/
            "data": {
                "activities": JSON.parse(activities).activities,
                "tasks": JSON.parse(tasks).tasks,
                "events": eventsArr
            }
        });
        
    } else { //? Route: /home?display=week&week=12&year=2020
        let weekNumber = req.query.week ? parseInt(req.query.week) : getWeek(today);
        let year = req.query.year ? parseInt(req.query.year) : today.getFullYear();

        let eventsArr = await JSON.parse(events).events.filter(element => {
            let elemWeek = getWeek(new Date(element.start), {weekStartsOn :1});
            if (getWeekYear(new Date(element.start)) === year) {
                return elemWeek === weekNumber;
            }
        });

        //? Compare params for return the next or the previous year
        //let prevWeek = weekNumber > 1 ? weekNumber - 1 + "&year=" + year : getISOWeeksInYear(new Date(year - 1, 03, 15)) + "&year=" + (year - 1);
        //let nextWeek = weekNumber < getISOWeeksInYear(new Date(year, 03, 15)) ? weekNumber + 1 + "&year=" + year : 1 + "&year=" + (year + 1);

        let route = "/home?week=";

        return res.status(200).json({/*
            "links": {
                "currentWeek": route + weekNumber + "&year=" + year,
                "prevWeek": route + prevWeek,
                "nextWeek": route + nextWeek,
            },*/
            "data": {
                "activities": JSON.parse(activities).activities,
                "tasks": JSON.parse(tasks).tasks,
                "events": eventsArr
            }
        });
    }
}
//? Create

exports.postEvent = async(req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors)
        return res.status(422).json({ errors: errors.array() });
    }
    const indexTask = await JSON.parse(tasks).tasks.findIndex((element) => element.id == req.body.tasks_id);
    if (indexTask !==-1) {
        let body = req.body;
        usersArr = await JSON.parse(users).users;
        let resultData = await JSON.parse(events).events;
        let start = parseISO(body.start);
        let end = parseISO(body.end);
        let duration = await differenceInMinutes(end, start);
        let newEvent = {
            "id": Date.now(),
            "duration": duration,
            "start": formatISO9075(start),
            "end": formatISO9075(end),
            "created": formatISO9075(Date.now()),
            "updated": formatISO9075(Date.now()),
            "description": body.description,
            "user_id": usersArr[Math.floor(Math.random() * Math.floor(usersArr.length))].id,
            "tasks_id": body.tasks_id
        }
        resultData.push(newEvent);
        fs.writeFileSync(process.cwd()+  '/api/models/events.json', JSON.stringify({ "events": resultData }));
        return res.json({"infos" : "event created", "data" : {"event" : newEvent}});
    } else {
        return res.status(200).json({
            "errors": {
                "source": "/events",
                "title": "tasks_id Not Found",
                "detail": "Check if the id has been altered."
            }});
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
        let duration = await differenceInMinutes(end, start);
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
        res.json({ "infos": "event modified", "data": {"event" : resultData[indexEvent] }});
    } else {
        res.status(422).json({
            "errors": {
                "source": "/administration/events/:" + req.params.id ,
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
        res.json({ "infos": event.description + " deleted" });
        fs.writeFileSync(process.cwd()+'/api/models/events.json', JSON.stringify({ "events": resultData }));
    } else {
        res.status(422).json({
            "errors": {
                "source": "/events/:" + req.params.id,
                "title": "Event Not Found",
                "detail": "Check if the id has been altered."
            }
        });
    }
}