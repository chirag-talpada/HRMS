var connection = require("../connection/connection");

const leaveAdminController = async(req,res) => {
    // let id = req.session.user;
    let query=
    `SELECT basic_information.full_name,leave_request.id,leave_request.leave_date,leave_request.leave_reason,leave_request.leave_type,leave_request.half_day ,leave_request.employee_id FROM basic_information  INNER JOIN leave_request  ON basic_information.employee_id = leave_request.employee_id;`
    try {
        let showquery = await connection.execute(query);
        // console.log(showquery);
    res.render('leaveadmin.ejs',{showquery:showquery});

    }
    catch(err) {
        return console.log(err);
    }
}
const showleaveAdminController= async (req, res) => {
    var id = req.query.id;
    var query1 = `SELECT basic_information.full_name,leave_request.leave_date,leave_request.leave_reason,leave_request.leave_type,leave_request.half_day,leave_request.leave_status FROM basic_information  INNER JOIN leave_request  ON basic_information.employee_id = leave_request.employee_id where leave_request.id='${id}';`;
    var result1 = await connection.execute(query1);
    return res.json(result1[0])
}
const acceptLeaveController = async (req,res) => {
    var id = req.query.id;
    var main_qry = `select leave_status from leave_request where id=${id}`;
    var result = await connection.execute(main_qry);
    let leave_status = result[0][0].leave_status;
    if(leave_status == "pending") {
        var query2 = `update leave_request set leave_status = "accepted" where id='${id}';`
        var result2 = await connection.execute(query2);
    }
    else if(leave_status == "rejected"){
        var sub_query2 = `update leave_request set leave_status = "accepted" where id='${id}';`
        var sub_result2 = await connection.execute(sub_query2);
    }

}
const rejectLeaveController = async (req,res) => {
    var id = req.query.id;
    var main_qry = `select leave_status from leave_request where id="${id}"`;
    var result = await connection.execute(main_qry);
    let leave_status = result[0][0].leave_status;
   
    if(leave_status == "pending") {
    var query2 = `update leave_request set leave_status = "rejected" where leave_status = "pending" and id='${id}';`
    var result2 = await connection.execute(query2);
    }
    else if(leave_status == "accepted"){
        var sub_query2 = `update leave_request set leave_status = "rejected" where id='${id}';`
        var sub_result2 = await connection.execute(sub_query2);
    }

}
module.exports = {leaveAdminController,showleaveAdminController,acceptLeaveController,rejectLeaveController};