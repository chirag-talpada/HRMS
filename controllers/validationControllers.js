const jwt = require("jsonwebtoken");
var connection = require("../connection/connection");

const activateLinkController = async(req, res) => {
    let token = req.params.token;
    let decode = jwt.verify(token, "JWT_SECRET");
    let email = decode.email;
    let query = `UPDATE register SET isActivated = 1 where email = '${email}'`;
    try {
        let updateQuery = await connection.execute(query);
        res.clearCookie("token");
        return res.redirect("/")
    } catch (err) {
        return console.log(err);
    }
}

const renderActivatePage = async(req, res) => {
    let email = req.session.email;
    res.render("activation", { email });
}

module.exports = {activateLinkController, renderActivatePage}