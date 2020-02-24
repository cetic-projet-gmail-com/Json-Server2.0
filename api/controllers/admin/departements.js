const {  validationResult } = require('express-validator');
const fs = require('fs');
var {formatISO9075} = require('date-fns');

let departements = fs.readFileSync(process.cwd()+'/api/models/departements.json');
let users = fs.readFileSync(process.cwd()+'/api/models/users.json');


//?Read
exports.getDeparts = async (req, res) => {
    const datas = await JSON.parse(departements).departements;
    let nbre = req.query.nbre ? parseInt(req.query.nbre) : 20;
    let page = req.query.page ? parseInt(req.query.page) : 1;

    let datasRes = datas
    .slice((page - 1) * nbre, page * nbre)
    .map(element => {
        return { "id": element.id, "name": element.name, "responsable_id": element.responsable_id };
    });
    let route = "/administration/departements?page=";

    res.jsonp({
        "links": {
            "current": route + page + "&nbre=" + nbre,
            "previous": page > 1 ? route + (page - 1) + "&nbre=" + nbre : undefined,
            "next": page < datas.length / nbre ? route + (page + 1) + "&nbre=" + nbre : undefined,
            "first": page > 1 ? route + "1&nbre=" + nbre : undefined,
            "last": page < datas.length / nbre ? route + Math.round(Math.ceil(datas.length / nbre)) + "&nbre=" + nbre : undefined
        },
        "data": { "activities": datasRes }
    });
}
//? Create

exports.setDepart = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const responsable = await JSON.parse(users).users.findIndex(element => {element.id === req.body.responsable_id});
    if (responsable !== -1) {
        const datas = await JSON.parse(departements).departements;

        let newDepartement = {
            "id" : Date.now(),
            "name" : req.body.name,
            "responsable_id" : req.body.responsable_id,
            "created" : formatISO9075(Date.now()),
            "updated" : null
        }
        datas.push(newDepartement);
        fs.writeFileSync(process.cwd() + '/api/models/departements.json', JSON.stringify({ "departements": datas }));
        res.jsonp(newDepartement);
    } else {
        res.status(422).json({"errors":"responsable_id invalid"})
    }
    
}

exports.upDepart = async (req, res) => {

}
