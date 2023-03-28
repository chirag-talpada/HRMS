const express = require("express");
const router = express.Router();

const { handleLogin } = require("../middlewares/authMiddlewares");
var connection = require("../connection/connection");

router.get("/hotline", handleLogin, (req, res) => {
    res.render("hotline", { activatePage: "hotline" });
});

router.get("/hotline/user/:status", handleLogin, async (req, res) => {

    let status=req.params.status;
    
    try {
        let findUser = `select bi.full_name,bi.profile_pic,cr.designation,cr.department,cr.join_date,ci.contact_no,r.email from basic_information bi INNER JOIN company_relation cr ON bi.employee_id = cr.employee_id INNER JOIN contact_information ci ON bi.employee_id = ci.employee_id INNER JOIN register r ON bi.employee_id = r.id INNER JOIN status s on bi.employee_id = s.employee_id where s.status='${status}'`;
        let [users] = await connection.execute(findUser);

        res.status(200).json({ users});

    } catch (err) {
        console.log(err);

    }
  
});

router.get("/hotline/user-count/:status", handleLogin, async (req, res) => {

    let status=req.params.status;
    
    try {
        let getUser = `select bi.full_name,bi.profile_pic,cr.designation,cr.department,cr.join_date,ci.contact_no,r.email from basic_information bi INNER JOIN company_relation cr ON bi.employee_id = cr.employee_id INNER JOIN contact_information ci ON bi.employee_id = ci.employee_id INNER JOIN register r ON bi.employee_id = r.id INNER JOIN status s on bi.employee_id = s.employee_id where s.status='${status}'`;
        let [users] = await connection.execute(getUser);        

        res.status(200).json({ count:users.length});

    } catch (err) {
        console.log(err);

    }
  
});

router.get("/hotline/search", handleLogin, async (req, res) => {
    
    let user = req.query.name;

    try {
        let searchQuery=`select s.status,bi.full_name,bi.profile_pic,cr.designation,cr.department,cr.join_date,ci.contact_no,r.email from basic_information bi INNER JOIN company_relation cr ON bi.employee_id = cr.employee_id INNER JOIN contact_information ci ON bi.employee_id = ci.employee_id INNER JOIN register r ON bi.employee_id = r.id INNER JOIN status s on bi.employee_id = s.employee_id where bi.full_name like '%${user}%'`;
        let [users] = await connection.execute(searchQuery); 
        res.status(200).json({ data:users });
    
    } catch (err) {
        console.log(err);
        
    }

        
});



module.exports = router;