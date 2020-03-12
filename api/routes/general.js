const Express = require('express');
const jwtTwo = require('express-jwt');
const {check} = require('express-validator');

const Router = Express.Router();
const homeController = require('../controllers/home');
const generalController = require('../controllers/general');

const validPostEvent = [
    check("taskId").notEmpty(),
    check("start").isISO8601(),
    check("end").isISO8601(),
    check("description").notEmpty(),
];

var auth = jwtTwo({
    secret: 'gWC93b#gg^s9',
    userProperty: 'payload'
});
Router.route('/home/:id')
    .patch(homeController.upEvent)
    .delete(homeController.delEvent)
;
Router.route('/home')
    .get(homeController.index)
    .post(validPostEvent, homeController.postEvent);

// Router.route('/login').post(generalController.login);
Router.route('/profile').get(auth, generalController.profil);
Router.use((req, res) => {res.status(404).json({"errors":"404 not found!"})})
module.exports = Router;
