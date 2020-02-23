// const events = require('../models/events.json');
const fs = require('fs');
let eventsJSON = fs.readFileSync(process.cwd()+'/api/models/events.json');
let activities = fs.readFileSync(process.cwd()+'/api/models/activities.json');
let tasks = fs.readFileSync(process.cwd()+'/api/models/tasks.json');

let { getWeek, format, addDays, getWeekYear, getISOWeeksInYear } = require('date-fns');

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
        let events = await JSON.parse(eventsJSON).events.filter(element => {
            return format(new Date(element.start), dateFormat) === dayFormated;
        });

        let route = '/home?display=day&date='
        res.jsonp({
            "links": {
                "currentDay": route + dayFormated,
                "prevDay": route + format(addDays(Date.parse(day), 1), dateFormat),
                "nextDay": route + format(addDays(Date.parse(day), -1), dateFormat)
            },
            "data": {
                "activities": JSON.parse(activities).activities,
                "tasks": JSON.parse(tasks).tasks,
                "events": events
            }
        });
        
    } else if (req.query.display === "month") { //? Route: /home?display=month&month=2&year=2020


        let month = req.query.month ? parseInt(req.query.month) - 1 : today.getMonth();
        let year = req.query.year ? parseInt(req.query.year) : today.getFullYear();

        let events = await JSON.parse(eventsJSON).events.filter(element => {
            let tmpDate = new Date(element.start);
            return tmpDate.getMonth() === month && tmpDate.getFullYear() === year;
        });
        let prevMonth = month === 0 ? "12&year" + (year - 1) : month + "&year=" + year;
        let nextMonth = month === 11 ? "01&year" + (year + 1) : (month + 2) + "&year=" + year;
        let route = "/home?display=month&month=";
        res.jsonp({
            "links": {
                "currentMonth": route + (month + 1) + "&year=" + year,
                "prevMonth": route + prevMonth,
                "nextMonth": route + nextMonth,
            },
            "data": {
                "activities": JSON.parse(activities).activities,
                "tasks": JSON.parse(tasks).tasks,
                "events": events
            }
        });
        
    } else { //? Route: /home?display=week&week=12&year=2020
        let weekNumber = req.query.week ? parseInt(req.query.week) : getWeek(today);
        let year = req.query.year ? parseInt(req.query.year) : today.getFullYear();

        let events = await JSON.parse(eventsJSON).events.filter(element => {
            let elemWeek = getWeek(new Date(element.start));
            if (getWeekYear(new Date(element.start)) === year) {
                return elemWeek === weekNumber;
            }
        });

        //? Compare params for return the next or the previous year
        let prevWeek = weekNumber > 1 ? weekNumber - 1 + "&year=" + year : getISOWeeksInYear(new Date(year - 1, 03, 15)) + "&year=" + (year - 1);
        let nextWeek = weekNumber < getISOWeeksInYear(new Date(year, 03, 15)) ? weekNumber + 1 + "&year=" + year : 1 + "&year=" + (year + 1);

        let route = "/home?week=";

        res.jsonp({
            "links": {
                "currentWeek": route + weekNumber + "&year=" + year,
                "prevWeek": route + prevWeek,
                "nextWeek": route + nextWeek,
            },
            "data": {
                "activities": JSON.parse(activities).activities,
                "tasks": JSON.parse(tasks).tasks,
                "events": events
            }
        });
    }

}