var connection = require("../connection/connection");
const moment = require("moment");
const { min } = require("date-fns");
const { months } = require("moment");
   let currentTime = moment().utcOffset(330);
   let currentDate = moment().format("YYYY-MM-DD");
   let tenAM = moment("10:00:00", "HH:mm:ss");
   let isLate = 0;


const checkInHandler = async (req, res) => {  
   
   let time = moment().format("HH:mm:ss");
   if (currentTime.isAfter(tenAM)) {
      isLate = 1;
   }
   let currentEmployee = req.session.user;

   let alreadyOnBreak = await checkIfUserIsonBreak(currentEmployee);
   if(alreadyOnBreak == false){
      return res.json({status: "ERROR", message: "You are already on a break"})
   }


   let didUserCheckout = await checkIfUserCheckedOut(currentEmployee);
   if(didUserCheckout == false){
      return res.json({status: "ERROR", message: "You have already checked out!"})
   }

   let checkIfalreadyExist = `SELECT * FROM attendence_manager where employee_id = ${currentEmployee} and date = '${currentDate}'`;

   try{
      let [executeAlreadyExists] = await connection.execute(checkIfalreadyExist);
      if(executeAlreadyExists.length){
         return;
      }
   }catch(e){
      console.log(e);
   }
   let insertQuery = `INSERT INTO attendence_manager (employee_id, check_in, date, is_late) VALUES (${currentEmployee}, '${time}', '${currentDate}', ${isLate})`;

   try{
      let [executeInsert] = await connection.execute(insertQuery);
      if(executeInsert){
         let insertIntoLogs = `INSERT INTO daily_logs(employee_id, activity, date, time) VALUES (${currentEmployee}, "Checked In", '${currentDate}', '${time}')`;
         let [executeLogs] = await connection.execute(insertIntoLogs); 
         let updateStatus = `update status set status ='online' where employee_id = ${currentEmployee}`;
         let [status] = await connection.execute(updateStatus); 
      }
      return res.json({status: "DONE", checkInTime: time})
      
   }
   catch(e){
      console.log(e);
   }


}


const checkOutHandler = async (req, res) => {
   let currentEmployee = req.session.user;
   let didUserCheckedIn = await checkIfUserCheckedIn(currentEmployee); 
   if(didUserCheckedIn == false){
      return res.json({status: "ERROR", message: "Please Check In First"})
   }

   let didUserCheckout = await checkIfUserCheckedOut(currentEmployee);
   if(didUserCheckout == false){
      return res.json({status: "ERROR", message: "You have already checked out!"})
   }

   let alreadyOnBreak = await checkIfUserIsonBreak(currentEmployee);
   if(alreadyOnBreak == false){
      return res.json({status: "ERROR", message: "You are already on a break"})
   }
   let checkIfalreadyExist = `SELECT count(*) as length FROM attendence_manager where employee_id = ${currentEmployee} and date = '${currentDate}' and check_out <> 0`;
   try{
      let [executeAlreadyExists] = await connection.execute(checkIfalreadyExist);
      if(executeAlreadyExists[0].length != 0){
         return;
      }
   }catch(e){
      return console.log(e);
   }

   let time = moment().format("HH:mm:ss");
   let getCheckInTimeOfUser = `SELECT check_in from attendence_manager where employee_id = ${currentEmployee} and date = '${currentDate}'`;
   try{
      let [executeGetCheckIn] = await connection.execute(getCheckInTimeOfUser);
      let check_in_time = executeGetCheckIn[0].check_in;
      let startTime = moment(check_in_time, "hh:mm:ss");
      let currentTime = moment();
      let secDiff = currentTime.diff(startTime, "minutes");
      let duration = moment.duration(secDiff, 'minutes');
      var hours = duration.hours();
      var minutes = duration.minutes();
      var workedHours = hours + ":" + minutes;

   }
   catch(e){
      console.log("error",e);
   }

   let timeForThatDay = `SELECT duration from break_manager where created_date = '${currentDate}' and employee_id = ${currentEmployee}`;
   let [getTimeForThatDay] = await connection.execute(timeForThatDay);
   let initial_time = 0;
   getTimeForThatDay.forEach(data => {
      initial_time += parseInt(data.duration);
    })

    var duration = moment.duration(initial_time, 'seconds');
    var formatted = duration.hours() + ":" + duration.minutes();

    let checkIfLessThanHour = moment(formatted, 'h:mm');
    const seconds = checkIfLessThanHour.hours() * 3600 + checkIfLessThanHour.minutes() * 60 + checkIfLessThanHour.seconds();
    console.log(seconds);
    if(seconds < 3600){
      formatted = "1:00"
    } 

    let time1 = moment(workedHours, "hh:mm");
    let time2 = moment(formatted, "hh:mm");

    let finalWorkedTime = moment.duration(time1.diff(time2));
    var formattedFinalTime = moment.utc(finalWorkedTime.as("milliseconds")).format("HH:mm");
    console.log(formattedFinalTime);

   let updateQuery = `UPDATE attendence_manager SET check_out = '${time}', hours_worked = '${formattedFinalTime}', break_taken = '${formatted}'
    where employee_id = ${currentEmployee} and date = '${currentDate}'`;

   try{
      let [executeUpdateQuery] = await connection.execute(updateQuery);
      if(executeUpdateQuery){
         let insertIntoLogs = `INSERT INTO daily_logs(employee_id, activity, date, time) VALUES (${currentEmployee}, "Checked Out", '${currentDate}', '${time}')`;
         let [executeLogs] = await connection.execute(insertIntoLogs); 
         let updateStatus = `update status set status ='offline' where employee_id = ${currentEmployee}`;
         let [status] = await connection.execute(updateStatus); 
         return res.json({status: "DONE", checkOutTime: time});
      }
   }catch(e){
      console.log(e);
      return res.json({status: "ERROR"});
   }
   
}


const breakInHandler = async (req, res) => {
   let currentEmployee = req.session.user;
   let didUserCheckedIn = await checkIfUserCheckedIn(currentEmployee); 

   if(didUserCheckedIn == false){
      return res.json({status: "ERROR", message: "Please Check-In First"})
   }

   let checkUser = `SELECT check_out FROM attendence_manager where employee_id = ${currentEmployee} and date = '${currentDate}' and check_out = '0'`;
   let [executeCheckUser] = await connection.execute(checkUser);

   if(executeCheckUser.length == 0){
      return res.json({status: "ERROR", message: "You have already checked out!"});
   }
  
   let didUserCheckout = await checkIfUserCheckedOut(currentEmployee);
   if(didUserCheckout == false){
      return res.json({status: "ERROR", message: "You have already checked out!"})
   }
   
   let alreadyOnBreak = await checkIfUserIsonBreak(currentEmployee);
   if(alreadyOnBreak == false){
      return res.json({status: "ERROR", message: "You are already on a break"})
   }


   let time = moment().format("HH:mm:ss");
   
   let insertQueryForBreak = `INSERT INTO break_manager (employee_id, break_in, created_date) VALUES (${currentEmployee}, '${time}', '${currentDate}')`;
   
   try{
      let [executeInsertForBreak] = await connection.execute(insertQueryForBreak);
      
      if(executeInsertForBreak){
         let insertIntoLogs = `INSERT INTO daily_logs(employee_id, activity, date, time) VALUES (${currentEmployee}, "Breaked In", '${currentDate}', '${time}')`;
         let [executeLogs] = await connection.execute(insertIntoLogs); 
         let updateStatus = `update status set status ='onBreak' where employee_id = ${currentEmployee}`;
         let [status] = await connection.execute(updateStatus); 
         return res.json({status: "DONE", breakInTime: time});
      }
   }
   catch(e){
      console.log(e);
      return res.json({status: "ERROR"});
   }

}

const breakOutHander = async (req, res) => {
   let currentEmployee = req.session.user;
   let didUserCheckedIn = await checkIfUserCheckedIn(currentEmployee); 
   if(didUserCheckedIn == false){
      return res.json({status: "ERROR", message: "Please Check In First"})
   }
   let getLastDataofUser = `SELECT * FROM break_manager where employee_id = ${currentEmployee} order by id desc LIMIT 1`;

   let didUserCheckout = await checkIfUserCheckedOut(currentEmployee);
   if(didUserCheckout == false){
      return res.json({status: "ERROR", message: "You have already checked out!"})
   }

   try{
      let [executeForLastData] = await connection.execute(getLastDataofUser);
      let returnedData = executeForLastData[0];
      let breakedInTime = returnedData.break_in;
      var startTime = moment(breakedInTime, "hh:mm:ss");
      var currentTime = moment();
      var secDiff = currentTime.diff(startTime, "seconds");
      let time = moment().format("HH:mm:ss");
      let insertIntoLogs = `INSERT INTO daily_logs(employee_id, activity, date, time) VALUES (${currentEmployee}, "Breaked Out", '${currentDate}', '${time}')`;
      let [executeLogs] = await connection.execute(insertIntoLogs); 

      let updateBreakOut = `UPDATE break_manager SET break_out = '${time}', duration = '${secDiff}' where employee_id = ${currentEmployee} and id = ${executeForLastData[0].id}`;

      let executeUpdate = await connection.execute(updateBreakOut);

      let updateBreakTime = `SELECT * FROM break_manager where employee_id = ${currentEmployee} and created_date = '${currentDate}'`;
      let [executeUpdateBreak] = await connection.execute(updateBreakTime);
      let initialTimer = 0;
      executeUpdateBreak.forEach(data => {
         initialTimer += parseInt(data.duration);
      })
      console.log(initialTimer);
      const duration = moment.duration(initialTimer, "seconds");
      const formattedBreakTime = moment.utc(duration.asMilliseconds()).format("HH:mm");

      let updatingBreakQuery = `UPDATE attendence_manager SET break_taken = '${formattedBreakTime}' where employee_id = '${currentEmployee}' and date = '${currentDate}'`;
      let [executeBreakUpdate] = await connection.execute(updatingBreakQuery);

      if(executeUpdate && executeLogs){
         let updateStatus = `update status set status ='online' where employee_id = ${currentEmployee}`;
         let [status] = await connection.execute(updateStatus); 
         return res.json({status: "DONE", breakOutTime: time});
      }
   }catch(e){
      console.log(e)
   }
}


const addcommentControllers = async (req, res) => {
   let id = req.session.user;
   let comment = req.body;
   let comments = comment.data;

   let query = `INSERT INTO comments(employee_id,comment,date) VALUES (${id},"${comments}","${currentDate}"); `;
   try {
       let insertQuery = await connection.execute(query);
       res.json({comment})

   } catch (err) {
       return console.log(err);
   }

}


const checkIfUserCheckedIn = async (getUserId) => {
   let checkUser = `SELECT * FROM attendence_manager where employee_id = ${getUserId} and date = '${currentDate}'`;
   let [executeCheckUser] = await connection.execute(checkUser);
   if(executeCheckUser.length == 0){
      return false;
   }
   return true;
}

const checkIfUserCheckedOut = async (getUserId) => {
   let checkUser = `SELECT check_out FROM attendence_manager where employee_id = ${getUserId} and date = '${currentDate}' and check_out = '0'`;
   let [executeCheckUser] = await connection.execute(checkUser);

   if(executeCheckUser?.check_out == "0"){
      return false;
   }
   return true;
   
}

const checkIfUserIsonBreak = async (getUserId) => {
   let checkUser = `SELECT * FROM break_manager where employee_id = ${getUserId} order by id desc LIMIT 1`;
   let [executeCheckUser] = await connection.execute(checkUser);
   if(executeCheckUser[0]?.break_out == "00:00:00"){
      return false;
   }return true;
}


const checkIfUserIsBreakedOut = async (getUserId) => {
   let checkUser = `SELECT * FROM break_manager where employee_id = ${getUserId} order by id desc LIMIT 1`;
   let [executeCheckUser] = await connection.execute(checkUser);
   if(executeCheckUser[0]?.break_out != "00:00:00"){
      return true;
   }return false;
}
module.exports = {checkInHandler, checkOutHandler, breakInHandler, breakOutHander, checkIfUserIsonBreak, checkIfUserIsBreakedOut, addcommentControllers}
