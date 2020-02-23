const fs = require('fs');
let users = fs.readFileSync(process.cwd()+'/api/models/users.json');

exports.login = async (req, res) => {
    usersArr = JSON.parse(users).users;
    const indexUser = await usersArr.findIndex((element) => element.login == req.body.login);
    if (indexUser !== -1) {
        if (usersArr[indexUser].password === req.body.password) {
            res.jsonp({ "infos": "youre now connected" })
        } else {
            res.jsonp({
                "errors": {
                    "source": { "pointer": "/login" },
                    "title": "bad password",
                }
            });
        }
    } else {
        res.jsonp({
            "errors": {
                "source": { "pointer": "/login" },
                "title": "Name of user not find"
            }
        })
    }
}
exports.profil = async (req, res) => {
    const usersArr = JSON.parse(users).users;
    let userRandom = usersArr[Math.floor(Math.random() * Math.floor(usersArr.length))];
    res.jsonp({ "user_infos": userRandom });
}
