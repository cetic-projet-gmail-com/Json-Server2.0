const {  validationResult } = require('express-validator');
const fs = require('fs');
var {formatISO9075} = require('date-fns');

let departements = fs.readFileSync(process.cwd()+'/api/models/departements.json');
let users = fs.readFileSync(process.cwd()+'/api/models/users.json');


//?Read
exports.getDeparts = async (req, res) => {
    const datas = await JSON.parse(departements).departments;
    let nbre = req.query.nbre ? parseInt(req.query.nbre) : 20;
    let page = req.query.page ? parseInt(req.query.page) : 1;

    let datasRes = datas
    .slice((page - 1) * nbre, page * nbre)
    .map(element => {
        return { "id": element.id, "name": element.name, "responsibleId": element.responsibleId };
    });
    let route = "/administration/departments?page=";

    res.jsonp({
        "links": {
            "current": route + page + "&nbre=" + nbre,
            "previous": page > 1 ? route + (page - 1) + "&nbre=" + nbre : undefined,
            "next": page < datas.length / nbre ? route + (page + 1) + "&nbre=" + nbre : undefined,
            "first": page > 1 ? route + "1&nbre=" + nbre : undefined,
            "last": page < datas.length / nbre ? route + Math.round(Math.ceil(datas.length / nbre)) + "&nbre=" + nbre : undefined
        },
        "data": {"departments": datasRes }
    });
}

exports.getUniqueDepart = async (req, res) => {
    const datas = await JSON.parse(departements).departments;
    const index = await datas.findIndex(element => {return element.id == req.params.id});

    if (index !==-1) {
        res.json({"data": { "department": datas[index] }});
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
        const datas = await JSON.parse(departements).departments;

        let newDepartement = {
            "id" : Date.now(),
            "name" : req.body.name,
            "responsibleId" : req.body.responsibleId,
            "createdAt" : formatISO9075(Date.now()),
            "updated" : formatISO9075(Date.now())
        }
        datas.push(newDepartement);
        fs.writeFileSync(process.cwd() + '/api/models/departments.json', JSON.stringify({ "departments": datas }));
        res.json({"infos": "departement createdAt", "data" : {"department" : newDepartement}});
    } else {
        res.status(422).json( {"errors": {
            "source": "/administration/departement/",
            "title": "responsibleId not found",
            "detail": "Check if the id has been altered or been remove."}
        });
    }
}

exports.upDepart = async (req, res) => {
    const datas = await JSON.parse(departements).departments;
    const index = await datas.findIndex(element => {return element.id == req.params.id});
    let responsable = req.body.responsibleId ? await checkResponsableId(req.body) : datas[index].responsibleId;
    console.log(index + " " + responsable)
    if (responsable !== -1 && index !==-1) {
        let departement = datas[index];

        let departementModified = {
            "id" : departement.id,
            "name" : req.body.name? req.body.name : departement.name,
            "responsibleId" : req.body.responsibleId? req.body.responsibleId: departement.responsibleId,
            "createdAt" : departement.createdAt,
            "updatedAt" : formatISO9075(Date.now())
        }
        datas[index] = departementModified;
        fs.writeFileSync(process.cwd() + '/api/models/departments.json', JSON.stringify({ "departments": datas }));
        res.jsonp({"infos" : "departement updated", "data" : {"department" : datas[index]}});
    } else {
        res.status(422).json({ "errors": {
            "source": "/administration/activities/:" + req.params.id,
            "title": "Activity or responsibleId",
            "detail": "Check if the ids has been altered."
        }});
    }
}

exports.deleteDepartement = async (req, res) => {
    const datas = await JSON.parse(departements).departments;
    const index = await datas.findIndex(element => {return element.id == req.params.id});
    console.log(index)

    if (index !== -1) {
        
        // let departement = data[index];
        datas.splice(index, 1);
        res.status(200).json({ "infos":  "department deleted" });
        fs.writeFileSync(process.cwd()+'/api/models/departments.json', JSON.stringify({ "departments": datas }));
    } else {
        return res.status(422).json({
            "errors": {
                "source": "/administration/departments/:" + req.params.id,
                "title": "deârtemenent Not Found",
                "detail": "Check if the id has been altered."
            }
        });
    }
}
 async function  checkResponsableId(body) {
    return await JSON.parse(users).users.findIndex((element) => element.id === body.responsibleId);


}
