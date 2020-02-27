const Express = require('express');
const jwtTwo = require('express-jwt');

const Router = Express.Router();
const homeController = require('../controllers/home');
const generalController = require('../controllers/general');


var auth = jwtTwo({
    secret: 'gWC93b#gg^s9',
    userProperty: 'payload'
});
Router.route('/home').get(homeController.index);
// Router.route('/login').post(generalController.login);
Router.route('/profile').get(auth, generalController.profil);
Router.use((req, res) => {res.status(404).json({"errors":"404 not found!"})})
module.exports = Router;
