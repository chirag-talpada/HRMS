var connection = require("../connection/connection");
const moment = require("moment");


const attendanceGenerate = async (req, res) => {
    let user_id = req.session.user;
    let getAllRecords = `SELECT * from attendence_manager where employee_id = ${user_id} order by id desc`;
    let [executeGetRecords] = await connection.execute(getAllRecords);
    var array_of_break = [];
    var array_of_passedTime = [];


    let getLeaves = `SELECT count(*) as leaves FROM leave_request where employee_id = ${user_id} and leave_status = 'accepted'`;
    let [executeLeaves] = await connection.execute(getLeaves);
    var leave_data = 0;
    if(executeLeaves){
       leave_data = executeLeaves[0]?.leaves;
    }

    let getHalf = `SELECT count(*) as half FROM leave_request where employee_id = ${user_id} and leave_status = 'accepted' and half_day = 1`;
    let [executeHalf] = await connection.execute(getHalf);
    var half_data = 0;
    if(executeHalf){
       half_data = executeHalf[0]?.half;
    }

    const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
    const endOfMonth   = moment().endOf('month').format('YYYY-MM-DD');
    let getWorkingDaysOfUser = `SELECT count(*) as days from attendence_manager where date BETWEEN '${startOfMonth}' AND '${endOfMonth}' AND employee_id = ${user_id}`;


   
    let [executeGetWorkingDays] = await connection.execute(getWorkingDaysOfUser);
    if(executeGetWorkingDays){
      var totalWorkingDays = executeGetWorkingDays[0]?.days;
    }
    let getTotalOfficeHours = totalWorkingDays * 10;

    let lateDays = `SELECT count(id) as late from attendence_manager WHERE employee_id = ${user_id} and is_late = 1`;
    let [executeLateDays] = await connection.execute(lateDays);
    let array_of_worked_hours = [];
    var lateDaysCount = executeLateDays[0].late;
    
    // Use for...of loop to iterate through the array
    for (const record of executeGetRecords) {

    let worked_hours = record.hours_worked;
    array_of_worked_hours.push(worked_hours);
    // console.log(worked_hours);
    let [hours, minutes] = worked_hours.split(":");
    let passedMinutes = parseInt(hours) * 60 + parseInt(minutes);
    let percentage = (passedMinutes / 540) * 100;
    array_of_passedTime.push(percentage.toFixed(2))
    }
    let finalMinutes = 0;
    for(const work of array_of_worked_hours){
      const time = moment.duration(work);
      const mins = time.asMinutes();
      finalMinutes += mins;
    }
    finalMinutes = finalMinutes.toFixed(0);


    const duration = moment.duration(finalMinutes, "minutes");
    const hoursWorked = duration.asHours().toFixed(0);

    const workingRatio = (hoursWorked / getTotalOfficeHours) * 100;

    let formattedTimes = array_of_break.map(sec => moment.utc(sec * 1000).format('H:mm'));
    res.render("attendance", { activatePage: "attendance", getTotalOfficeHours, workingRatio, hoursWorked, totalWorkingDays, lateDaysCount, executeGetRecords, formattedTimes, array_of_passedTime, leave_data, half_data });

  }
  

const returnSearchData = async (req, res) => {
  let currentDate = moment().format("YYYY-MM-DD");
  let searchString = req.params.search;
  let sqlQuery = `SELECT b.full_name, activity, time from basic_information b 
  INNER JOIN daily_logs d
  ON d.employee_id = b.employee_id
  where date = '${currentDate}' and b.full_name LIKE '${searchString}%';`

  let [executeLog] = await connection.execute(sqlQuery);
  
  return res.json({ans: executeLog});
}


const filterDataByDate = async (req, res) => {
  let start = req.params.startDate;
  let end = req.params.endDate;

  let user_id = req.session.user;
  let getAllRecords = `SELECT * from attendence_manager where employee_id = ${user_id} and date between '${end}' and '${start}' order by id desc`;
  console.log(getAllRecords);
  let [executeGetRecords] = await connection.execute(getAllRecords);
  if(executeGetRecords){
    return res.json({data: executeGetRecords})
  }

  
}

module.exports = {attendanceGenerate, returnSearchData, filterDataByDate};
