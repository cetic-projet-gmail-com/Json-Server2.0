const express = require('express');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const fs = require('fs');
// const bodyParser = require('body-parser');

const app = express();

//GLOBAL MIDDLEWARES
var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(passport.initialize());

const routes = process.cwd() + '/api/routes/';
const GeneralRouter = require(routes +'general');
const AdminRouter = require(routes+'admin');
const EventsRouter = require(routes + 'events');

const Login = require(process.cwd() + '/api/controllers/login')
// Show method of all request

passport.use(new LocalStrategy({
    usernameField: 'login'
    },
    async (username, password, done) => {
        let usersArr = fs.readFileSync(process.cwd()+'/api/models/users.json');

        let users = await JSON.parse(usersArr).users;
        let index = await users.findIndex(element => username === element.login);
        console.log(password)
        if (index !== -1) {
            if (users[index].password === password) {
                console.log("Good pass")
                return done(null, users[index]);
            }
            return done(null, false, {
                message: 'Password is wrong.'
            });

        } else {
            return done(null, false, {
                message: 'User not found'
            });
        }
    }
));
app.all('*', (req, res, next) => {
    console.log(req.method + " " +req.path);
    
    next();
})
// SPECIFIC ROUTES

app.use('/administration', AdminRouter);
app.use('/events', EventsRouter);
app.use('/login', Login)
app.use('/', GeneralRouter);


app.listen(3000, () => {
    console.log('json server started on port 3000')
});
