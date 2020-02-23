const Express = require('express');
const {check} = require('express-validator');

const Router = Express.Router();
const url = (process.cwd()+'/api/controllers/');
const eventsController = require(url +  'events');

const validPostEvent = [
    check("tasks_id").notEmpty(),
    check("start").isISO8601(),
    check("end").isISO8601(),
    check("description").notEmpty(),
]

Router.route('/')
    .post(validPostEvent, eventsController.postEvent)
;
Router.route('/:id')
    .patch(eventsController.upEvent)
    .delete(eventsController.delEvent)

module.exports = Router;
