const jwt = require("jsonwebtoken");
var connection = require("../connection/connection");

function checkIfTokenExists(req, res, next) {
    let token = req.cookies.token;
    if (!token) {
        next();
    } else {
        return res.redirect("/activate");
    }
}

async function handleLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect("/")
    }
    next();
    
}


function checkIfLoggedIn(req, res, next) {
    if (req.session.user) {
        return res.redirect("/self/home")
    }
    next();
}

async function hasEmployeeData(req, res, next) {
    let emp_id = req.session.user;

    let check_emp_details = `select * from basic_information where employee_id = '${emp_id}'`;
    try {
        let [hasData] = await connection.execute(check_emp_details);

        if (hasData.length === 0) {
            return res.redirect("/employee-form");
        }else{
            return res.redirect("/self/home");
        }

    } catch (e) {
        console.log(e);
    }
}

module.exports = { checkIfTokenExists, handleLogin, checkIfLoggedIn };