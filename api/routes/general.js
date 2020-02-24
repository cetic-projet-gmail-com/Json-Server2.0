const Express = require('express');
const Router = Express.Router();
const homeController = require('../controllers/home')
const generalController = require('../controllers/general')
Router.route('/home').get(homeController.index);
Router.route('/login').post(generalController.login);
Router.route('/profil').get(generalController.profil);
Router.use((req, res) => {res.status(404).json({"errors":"404 not found!"})})
module.exports = Router;
