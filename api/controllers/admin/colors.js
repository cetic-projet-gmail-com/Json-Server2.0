const fs = require('fs');
let colors = fs.readFileSync(process.cwd()+'/api/models/colors.json');

module.exports = async (req, res) => {
    res.json({"data": JSON.parse(colors).colors})
}