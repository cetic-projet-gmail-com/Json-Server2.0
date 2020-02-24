const Express = require('express');
const {check} = require('express-validator');

const Router = Express.Router();
const url = (process.cwd()+'/api/controllers/admin/');
const usersController = require(url +  'users');
const activitiesController = require(url +  'activities');
const tasksController = require(url +  'tasks');
const departementsController = require(url + 'departements')
//* ---------------------------------- Users --------------------------------- */

const validPostUser = [
    check("email").isEmail(),
    check("firstname").notEmpty(),
    check("lastname").notEmpty(),
    check("login").notEmpty(),
    check("role_id").notEmpty(),
    check("departement_id").notEmpty()
];

Router.route('/users')
    .get(usersController.getUsers)
    .post(validPostUser, usersController.addUser)
;
Router.route('/users/:id')
    .get(usersController.getUniqueUser)
    .delete( usersController.delUser)
    .patch(usersController.modifyUser)
;
//* ------------------------------- Activities ------------------------------- */
const validPostActivity = [
    check("name").notEmpty(),
    check("description").notEmpty(),
    check("color_code").notEmpty(),
];
Router.route('/activities')
    .get(activitiesController.getActivities)
    .post(validPostActivity, activitiesController.postActivity)
;

Router.route('/activities/:id')
    .get(activitiesController.getUniqueActivity)
    .delete(activitiesController.delActivity)
    .patch(activitiesController.modifyActivity)
;

//* ---------------------------------- Tasks --------------------------------- */
const validPostTask = [
    check("name").notEmpty(),
    check("description").notEmpty(),
    check("activities_id").notEmpty(),
];
Router.route('/tasks')
    .post(validPostTask, tasksController.postTasks)
;
Router.route('/tasks/:id')
    .delete(tasksController.delTask)
    .patch(tasksController.modifyTask)
;

//* ------------------------------- Depatements ------------------------------ */

const validPostDepartement = [
    check("name").notEmpty(),
    check("responsable_id").notEmpty()
];
Router.route('/departements')
    .get(departementsController.getDeparts)
    .post(validPostDepartement, departementsController.createDepart)
;
Router.route('/departements/:id')
    .patch(departementsController.upDepart)
    .get(departementsController.getUniqueDepart)
;
module.exports = Router;