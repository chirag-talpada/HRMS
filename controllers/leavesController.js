var connection = require("../connection/connection");
var moment = require("moment")
let currentDate = moment().format("YYYY-MM-DD");
const leavesController = async(req,res) => {
    let id = req.session.user;
    let query = `select * from leave_request where employee_id = "${id}" order by created_at desc`;
    let leaveRemaining = [];
    let allowed = [];
    try {
        var showquery = await connection.execute(query);
        let getAllowedData = `SELECT * FROM leave_balance`;
        let [executeAllowedData] = await connection.execute(getAllowedData);
        console.log(executeAllowedData);
        let [getCL] = executeAllowedData.filter(el => el.leave_type == "CL");
        let allowedCL = getCL.allowed_leave;
        allowed.push(allowedCL)

        let [getSL] = executeAllowedData.filter(el => el.leave_type == "SL");
        let allowedSL = getSL.allowed_leave;
        allowed.push(allowedSL)

        let [getUL] = executeAllowedData.filter(el => el.leave_type == "UL");
        let allowedUL = getUL.allowed_leave;
        allowed.push(allowedUL)

        let [getHL] = executeAllowedData.filter(el => el.leave_type == "PL");
        let allowedHL = getHL.allowed_leave;
        allowed.push(allowedHL)

        let getCLData = `SELECT count(*) as CL_length from leave_request where employee_id = ${id} and leave_status = 'accepted' and leave_type = 'CL'`;
        let [executeCLdata] = await connection.execute(getCLData);
        let clDataLength = executeCLdata[0].CL_length;

        let getSLData = `SELECT count(*) as SL_length from leave_request where employee_id = ${id} and leave_status = 'accepted' and leave_type = 'SL'`;
        let [executeSLdata] = await connection.execute(getSLData);
        let slDataLength = executeSLdata[0].SL_length;

        let getULData = `SELECT count(*) as UL_length from leave_request where employee_id = ${id} and leave_status = 'accepted' and leave_type = 'UL'`;
        let [executeULdata] = await connection.execute(getULData);
        let ulDataLength = executeULdata[0].UL_length;

        let getHLData = `SELECT count(*) as PL_length from leave_request where employee_id = ${id} and leave_status = 'accepted' and leave_type = 'PL'`;
        let [executeHLdata] = await connection.execute(getHLData);
        let hlDataLength = executeHLdata[0].PL_length

       leaveRemaining.push(allowedCL - clDataLength);
       leaveRemaining.push(allowedSL - slDataLength);
       leaveRemaining.push(allowedUL - ulDataLength);
       leaveRemaining.push(allowedHL - hlDataLength);
        
    }
    catch(err) {
        return console.log(err);
    }
    res.render('leaves',{showquery:showquery, activatePage: "leave", leaveRemaining, allowed, currentDate});
}

const addleavesController = async (req,res) => {
    let id = req.session.user;

    let leave_date = req.body.date;
    let leave_type = req.body.type;
    let leave_reason = req.body.reason;
    let leave_day = req.body.day;


    let query = `INSERT INTO leave_request (employee_id,leave_date,leave_type,leave_reason, half_day) VALUES (${id},'${leave_date}',"${leave_type}",'${leave_reason}','${leave_day}')`;
    
    try {
        let insertQuery = await connection.execute(query);
    } catch (err) {
        return console.log(err);
    }    

    return res.json({status: "added"})
}


const getLeaveByStatus = async(req, res) => {
    let status = req.params.status;
    let id = req.session.user;

    let query = `SELECT * from leave_request where employee_id = ${id} and leave_status = '${status}'`;
    try{
        var [fireQuery] = await connection.execute(query);
    }catch(e){
        console.log(e);
    }

    return res.json({data:fireQuery})
}



module.exports = {leavesController, addleavesController, getLeaveByStatus};