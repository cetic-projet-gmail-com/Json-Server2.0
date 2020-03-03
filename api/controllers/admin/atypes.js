const fs = require('fs');
let atypes = fs.readFileSync(process.cwd()+'/api/models/a_types.json');

module.exports = async (req, res) => {
    res.json({"data": JSON.parse(atypes).types})
}