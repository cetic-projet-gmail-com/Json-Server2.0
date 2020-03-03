const Express = require('express');
const {check} = require('express-validator');

const Router = Express.Router();
const url = (process.cwd()+'/api/controllers/');
const eventsController = require(url +  'events');


/*
Router.route('/')
    
;
Router.route('/:id')
    .patch(eventsController.upEvent)
    .delete(eventsController.delEvent)
;
module.exports = Router;
*/