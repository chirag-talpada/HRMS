const express = require("express");
const router = express.Router();
const moment = require("moment");
const jwt = require("jsonwebtoken");
const { handleLogin } = require("../middlewares/authMiddlewares");
const {
  checkIfUserIsonBreak,
  checkIfUserIsBreakedOut,
} = require("../controllers/activityController");

const {
  attendanceGenerate,
  returnSearchData,
  filterDataByDate
} = require("../controllers/attendanceControllers");

var connection = require("../connection/connection");
const e = require("express");
const { hoursToMilliseconds } = require("date-fns");

router.get("/home", handleLogin, async (req, res) => {

  let emp_id = req.session.user;

    let check_emp_details = `select * from basic_information where employee_id = '${emp_id}'`;
    try {
        let [hasData] = await connection.execute(check_emp_details);
        if (hasData.length === 0) {
            return res.redirect("/employee-form")
        }

    } catch (e) {
        console.log(e);
    }


  let name;
  let user_id = req.session.user;
  let currentDate = moment().format("YYYY-MM-DD");
  let breakAns = await checkIfUserIsonBreak(user_id);
  let breakoutAns = await checkIfUserIsBreakedOut(user_id);
  let hasCheckedIn = false;
  var executeAttendance, executeActivity;
  try {
    let getAttendanceDetails = `SELECT * FROM attendence_manager where employee_id = ${user_id} and date = '${currentDate}'`;
    [executeAttendance] = await connection.execute(getAttendanceDetails);

    if (executeAttendance.length != 0) {
      hasCheckedIn = true;
    }

    let getActivityDetails = `SELECT * FROM break_manager where employee_id = ${user_id} and created_date = '${currentDate}'`;
    [executeActivity] = await connection.execute(getActivityDetails);

    let hasUserCheckedOutQuery = `SELECT check_out FROM attendence_manager where employee_id = ${user_id} and date = '${currentDate}'`;
    let [hasUserCheckedOut] = await connection.execute(hasUserCheckedOutQuery);
    var checked_out = "not";

    let usersAttendance = `SELECT count(id) as attendance from attendence_manager WHERE employee_id = ${user_id}`;
    let [executeAttendanceDays] = await connection.execute(usersAttendance);
    var attendanceDays = executeAttendanceDays[0].attendance;

    let lateDays = `SELECT count(id) as late from attendence_manager WHERE employee_id = ${user_id} and is_late = 1`;
    let [executeLateDays] = await connection.execute(lateDays);
    var lateDaysCount = executeLateDays[0].late;

    const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
    const endOfMonth   = moment().endOf('month').format('YYYY-MM-DD');

    let totalHoursWorked = `SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(hours_worked))) AS hours_worked
        FROM attendence_manager
        WHERE date BETWEEN '${startOfMonth}' AND '${endOfMonth}' and employee_id = ${user_id}`;

    let [executeTotalHoursWorked] = await connection.execute(totalHoursWorked);
    var hoursWorked = executeTotalHoursWorked[0].hours_worked;
    if(hoursWorked){
      hoursWorked = hoursWorked.split(":").slice(0, 2).join(":");
    }
    if (hasUserCheckedOut.length) {
      if (hasUserCheckedOut[0].check_out != "0") {
        checked_out = "checkout";
      }
    }
    let qry_show = `SELECT * FROM comments where employee_id = ${user_id} and date ='${currentDate}' order by id DESC`;
    var [commentResult] = await connection.execute(qry_show);

  } catch (e) {
    console.log(e);
  }
  name = "dummy";
  let activatePage = "home";
  res.render("index", {
    name: name,
    attendance: executeAttendance[0],
    hoursWorked,
    attendanceDays,
    lateDaysCount,
    activity: executeActivity,
    breakAns,
    hasCheckedIn,
    breakoutAns,
    activatePage,
    checked_out,
    commentResult
  });
});

router.get("/logs", handleLogin, async (req, res) => {
  let currentDate = moment().format("YYYY-MM-DD");
  let getDailyLogs = `
        select full_name, activity, date, time from daily_logs d 
        INNER JOIN basic_information b
        ON b.employee_id = d.employee_id
        where date = '${currentDate}'
        order by time desc`;
  try {
    var [executeDailyLogs] = await connection.execute(getDailyLogs);
  } catch (e) {
    console.log(e);
  }

  return res.status(200).json({ logs: executeDailyLogs });
});


router.get("/attendance-report", handleLogin, attendanceGenerate);

router.get("/filter-data/:startDate/:endDate", handleLogin, filterDataByDate)

router.get("/get-log-search/:search", handleLogin, returnSearchData);

router.get("/get-user", handleLogin, async (req, res) => {
  let user = jwt.verify(req.cookies.user, "JWT_SECRET");

  try {
    let query = `select * from basic_information bi,company_relation cr where bi.employee_id=cr.employee_id and bi.employee_id=${user}`;

    let [[user_data]] = await connection.execute(query);

    return res.status(200).json({ msg: "done", user_data });
  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
});

module.exports = router;
