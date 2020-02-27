const fs = require('fs');

let users = fs.readFileSync(process.cwd()+'/api/models/users.json');
/*
exports.login = async (req, res) => {
    usersArr = JSON.parse(users).users;
    const indexUser = await usersArr.findIndex((element) => element.login == req.body.login);
    if (indexUser !== -1) {
        if (usersArr[indexUser].password === req.body.password) {
            res.json({ "infos": "youre now connected" })
        } else {
            res.status(422).json({
                "errors": {
                    "source": "/login",
                    "title": "bad password",
                }
            });
        }
    } else {
        res.status(422).json({
            "errors": {
                "source": "/login" ,
                "title": "Name of user not find"
            }
        })
    }
}*/
exports.profil = async (req, res) => {
    console.log('ok')
    const usersArr = await JSON.parse(users).users;
    // let userRandom = usersArr[Math.floor(Math.random() * Math.floor(usersArr.length))];
    let index = usersArr.findIndex(element => req.payload._id === element.id)
    res.json({ "data":  usersArr[index]});
}
