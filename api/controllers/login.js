const passport = require('passport');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const express= require('express');
const Router = express.Router();
let users = fs.readFileSync(process.cwd()+'/api/models/users.json');

Router.route('/').post(async (req, res) => {
    usersArr = await JSON.parse(users).users;
  
    passport.authenticate('local', async function (err, user, info) {
        const index = await usersArr.findIndex((element) => element.login == user.login);

        var token;
        if (err) {
            res.status(404).json(err);
            return;
        }

        if (index !== -1) {
            token = generateJwt(usersArr[index]);
            res.status(200);
            res.json({
                "token": token
            });
        } else {
            console.log(info)
            res.status(401);
            res.json({"errors" : info});
        }
    })(req, res);
})
module.exports = Router;

function generateJwt(user) {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: user.id,
        login: this.login,
        firstName: user.firstname,
        lastName: user.lastname,
        role: user.roleId,
        exp: parseInt(expiry.getTime() / 1000),
    }, "gWC93b#gg^s9"); 
}