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
        "data": {"departement": datasRes }
    });
}

exports.getUniqueDepart = async (req, res) => {
    const datas = await JSON.parse(departements).departements;
    const index = await datas.findIndex(element => {return element.id == req.params.id});

    if (index !==-1) {
        res.json({"data": { "departement": datas[index] }});
    } else {
        res.status.json({"errors": {
                "source": "/administration/departement/:" + req.params.id,
                "title": "Departement Not Found",
                "detail": "Check if the id has been altered."
            }
        });
    }
}
//? Create

exports.createDepart = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const responsable = checkResponsableId(req.body);
    if (responsable !== -1) {
        const datas = await JSON.parse(departements).departements;

        let newDepartement = {
            "id" : Date.now(),
            "name" : req.body.name,
            "responsable_id" : req.body.responsable_id,
            "createdAt" : formatISO9075(Date.now()),
            "updated" : formatISO9075(Date.now())
        }
        datas.push(newDepartement);
        fs.writeFileSync(process.cwd() + '/api/models/departements.json', JSON.stringify({ "departements": datas }));
        res.json({"infos": "departement createdAt", "data" : {"departement" : newDepartement}});
    } else {
        res.status(422).json( {"errors": {
            "source": "/administration/departement/",
            "title": "responsable_id not found",
            "detail": "Check if the id has been altered or been remove."}
        });
    }
}

exports.upDepart = async (req, res) => {
    const datas = await JSON.parse(departements).departements;
    const index = await datas.findIndex(element => {return element.id == req.params.id});
    let responsable = req.body.responsable_id ? await checkResponsableId(req.body) : datas[index].responsable_id;
    console.log(index + " " + responsable)
    if (responsable !== -1 && index !==-1) {
        let departement = datas[index];

        let departementModified = {
            "id" : departement.id,
            "name" : req.body.name? req.body.name : departement.name,
            "responsable_id" : req.body.responsable_id? req.body.responsable_id: departement.responsable_id,
            "createdAt" : departement.createdAt,
            "updatedAt" : formatISO9075(Date.now())
        }
        datas[index] = departementModified;
        fs.writeFileSync(process.cwd() + '/api/models/departements.json', JSON.stringify({ "departements": datas }));
        res.jsonp({"infos" : "departement updated", "data" : {"departement" : datas[index]}});
    } else {
        res.status(422).json({ "errors": {
            "source": "/administration/activities/:" + req.params.id,
            "title": "Activity or responsable_id",
            "detail": "Check if the ids has been altered."
        }});
    }
}

exports.deleteDepartement = async (req, res) => {
    const datas = await JSON.parse(departements).departements;
    const index = await datas.findIndex(element => {return element.id == req.params.id});
    console.log(index)

    if (index !== -1) {
        
        // let departement = data[index];
        datas.splice(index, 1);
        res.status(200).json({ "infos":  "departement deleted" });
        fs.writeFileSync(process.cwd()+'/api/models/departements.json', JSON.stringify({ "departements": datas }));
    } else {
        return res.status(422).json({
            "errors": {
                "source": "/administration/departements/:" + req.params.id,
                "title": "deârtemenent Not Found",
                "detail": "Check if the id has been altered."
            }
        });
    }
}
 async function  checkResponsableId(body) {
    return await JSON.parse(users).users.findIndex((element) => element.id === body.responsable_id);


}
