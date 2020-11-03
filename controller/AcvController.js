const Acv = require('../modules/Acv')
module.exports.startScraping = async function (req, res) {
    try {
        let bodyInfo = req.body
        if (1) {
            var response = await new Acv().getLoggedIn();
            res.send(response)
        } else {
            res.send({ "success": true, "Error": error, "Payload": [] })
        }
    } catch (e) {
        res.send({ "success": false, "Error": e.toString(), "Payload": [] });
    }
};