const Express = require('express');
const Cors = require('cors');

const bodyParser = require('body-parser');

const App = Express();

//GLOBAL MIDDLEWARES
var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
App.use(Cors(corsOptions))
App.use(bodyParser.json());
const routes = process.cwd() + '/api/routes/';
const GeneralRouter = require(routes +'general');
const AdminRouter = require(routes+'admin');
const EventsRouter = require(routes + 'events');
// Show method of all request
App.all('*', (req, res, next) => {
    console.log(req.method + " " +req.path);
    
    next();
})
// SPECIFIC ROUTES
App.use('/administration', AdminRouter);
App.use('/events', EventsRouter);
App.use('/', GeneralRouter);


App.listen(3000, () => {
    console.log('json server started on port 3000')
});
