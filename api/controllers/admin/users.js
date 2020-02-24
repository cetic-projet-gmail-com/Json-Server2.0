const fs = require('fs');
let users = fs.readFileSync(process.cwd()+'/api/models/users.json');
let activities = fs.readFileSync(process.cwd()+'/api/models/activities.json');
let tasks = fs.readFileSync(process.cwd()+'/api/models/tasks.json');
const {  validationResult } = require('express-validator');
var {formatISO9075} = require('date-fns');

//? Read
exports.getUsers = async (req, res) => {
    let nbre = req.query.nbre ? parseInt(req.query.nbre) : 20;
    let page = req.query.page ? parseInt(req.query.page) : 1;

    let usersTmp = await JSON.parse(users).users;
    let usersArr = usersTmp
        .slice((page - 1) * nbre, page * nbre)
        .map(element => {
            return { "id": element.id, "firstname": element.firstname, "lastname": element.lastname };
        });
    let route = "/administration/users?page=";
    res.json({
        "links": {
            "current": route + page + "&nbre=" + nbre,
            "previous": page > 1 ? route + (page - 1) + "&nbre=" + nbre : undefined,
            "next": page < usersTmp.length / nbre ? route + (page + 1) + "&nbre=" + nbre : undefined,
            "first": page > 1 ? route + "1&nbre=" + nbre : undefined,
            "last": page < usersTmp.length / nbre ? route + Math.round(Math.ceil(usersTmp.length / nbre)) + "&nbre=" + nbre : undefined
        },
        "data": { "users": usersArr }
    });
}
exports.getUniqueUser = async (req, res) => {
    let usersArr = JSON.parse(users).users;
    const indexUser = usersArr.findIndex((element) => element.id == req.params.id);
    if (indexUser !== -1) {
        res.json({ "data": {"user": usersArr[indexUser] }});
    } else {
        res.status(422).json({
            "errors": {
                "source": "/administration/users/:" + req.params.id,
                "title": "User Not Found",
                "detail": "Check if the id has been altered."
            }

        })
    }
}
//? Create
exports.addUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let body = req.body;
    let resultData = await JSON.parse(users).users;

    let newUser = {
        "login": body.login,
        "firstname": body.firstname,
        "lastname": body.lastname,
        "email": body.email,
        "password": body.password,
        "created": formatISO9075(Date.now()),
        "updated": formatISO9075(Date.now()),
        "role_id": body.role_id,
        "departement_id": body.departement_id,
        "id": Date.now()
    }
    resultData.push(newUser);
    fs.writeFileSync(process.cwd()+'/api/models/users.json', JSON.stringify({ "users": resultData }));
    res.jsonp({"infos": "user created", "data" : {"user" : newUser}});
}
//? Remove
exports.delUser = async (req,res) => {
    let resultData = await JSON.parse(users).users;
    const indexUser = resultData.findIndex((element) => element.id == req.params.id);

    if (indexUser !== -1) {
        
        let user = resultData[indexUser];
        resultData.splice(indexUser, 1);
        res.jsonp({ "infos": user.login + " deleted" });
        fs.writeFileSync(process.cwd()+'/api/models/users.json', JSON.stringify({ "users": resultData }));
    } else {
        res.status(422).json({
            "errors": {
                "source": "/administration/users/:" + req.params.id,
                "title": "User Not Found",
                "detail": "Check if the id has been altered."
            }
        });
    }
}
//? Update
exports.modifyUser = async (req, res) => {
    let resultData = await JSON.parse(users).users;
    const indexUser = resultData.findIndex((element) => element.id == req.params.id);
    if (indexUser !== -1) {
        let body = req.body;
        let user = resultData[indexUser];
        let userModified = {
            "login": body.login ? body.login : user.login,
            "firstname": body.firstname ? body.firstname : user.firstname,
            "lastname": body.lastname ? body.lastname : user.lastname,
            "email": body.email ? body.email : user.email,
            "password": body.password ? body.password : user.password,
            "created": user.created,
            "updated": formatISO9075(Date.now()),
            "role_id": body.role_id ? body.role_id : user.role_id,
            "departement_id": body.departement_id ? body.departement_id : user.departement_id,
            "id": user.id
        }
        resultData[indexUser] = userModified;
        
        fs.writeFileSync(process.cwd()+'/api/models/users.json', JSON.stringify({ "users": resultData }))
        res.json({ "infos" : "user modified", "data": {"user" : resultData[indexUser] }})
    } else {
        res.status(422).json({
            "errors": {
                "source": "/administration/users/:" + req.params.id ,
                "title": "User Not Found",
                "detail": "Check if the id has been altered."
            }
        });
    }
}