const fs = require('fs');
let roles = fs.readFileSync(process.cwd()+'/api/models/roles.json');

module.exports = async (req, res) => {
    res.json({"data": JSON.parse(roles).roles})
}