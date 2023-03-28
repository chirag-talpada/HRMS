var connection = require("../connection/connection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const moment = require("moment");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tushar24081@gmail.com",
    pass: "ixhxfutyajfpmprc",
  },
});

const loginController = async (req, res) => {
  const loginErrors = {};
  const { email, password, ip } = req.body;

  
  let results;
  let query = `SELECT * FROM register where email = '${email}'`;
  try {
    results = await connection.execute(query);
    results = results[0];

    if (results.length == 0) {
      return res.status(404).json({ msg: "There are no users with this credentials",ans:"error" });
    }

    
    let ipCheckingQuery = `SELECT * FROM ip_handler where ip_address = '${ip}'`;
    let executeIpQuery = await connection.execute(ipCheckingQuery);
    if (!executeIpQuery[0].length) {
      return res.status(401).json({ msg: "The device you're trying is not acceptable in our case",ans:"error" });
    }

  } catch (err) {
    console.log(err);
  }

  if (results[0].isActivated == "0") {
    return res.status(200).json({ msg: "redirected",ans:"activate" });
    // return res.redirect("/activate");
  }

  let dbPass = results[0].password;

  if (results[0].status == "B") {
    let getTimeOfBlock = `SELECT final_attempt_time from register where email = '${email}'`;
    let executeQuery = await connection.execute(getTimeOfBlock);
    let final_time = executeQuery[0][0].final_attempt_time;
    if (final_time) {
      let dbTime = new Date(final_time);
      const currentTime = moment();
      const diffInMilliseconds = currentTime.diff(dbTime);
      if (diffInMilliseconds >= 86400000) {

        let update_attempts = `UPDATE register SET attempts_remaining = 3, status = 'U' WHERE email = '${email}'`;
        try {
          let execute_update_query = await connection.execute(update_attempts);
        } catch (err) {
          console.log(err);
        }
      }
    }
  }


  const isMatch = await bcrypt.compare(password, dbPass);
  

  if (!isMatch) {
    let query = `SELECT attempts_remaining FROM register where email = '${email}'`;
    try {
      [results] = await connection.execute(query);
      let attempts_remaining = results[0].attempts_remaining;

      if (attempts_remaining <= 0) {
        try {
          let currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
          let update_attempts = `UPDATE register SET attempts_remaining = ${attempts_remaining}, final_attempt_time = '${currentDate}', status = 'B' WHERE email = '${email}'`;
          let execute_time = await connection.execute(update_attempts);
          return res.status(200).json({ msg: "redirected",ans:"suspend" });
          // return res.redirect("/suspend");
        } catch (err) {
          console.log(err);
        }
      } else {
        attempts_remaining = attempts_remaining - 1;
        let update_attempts = `UPDATE register SET attempts_remaining = ${attempts_remaining} WHERE email = '${email}'`;
        try {
          let execute_update_query = await connection.execute(update_attempts);
        } catch (err) {
          console.log(err);
        }
      }

    }
    catch (e) {
      console.log(e);
    }
    return res.status(401).json({ msg: "Oops your password is wrong",ans:"error" });
  }

  let final_time_checking = `SELECT * FROM register where email = '${email}'`;
  try {
    let [results] = await connection.execute(final_time_checking);

    if (results[0].status == "B") {
      return res.status(200).json({ msg: "redirected",ans:"suspend" });
      // return res.redirect("/suspend");
    }

  }
  catch (e) {
    console.log(e);
  }

  req.session.user = results[0].id;
  let upadting_attempts = `UPDATE register set attempts_remaining = 3 where email = '${email}'`;
  try{
    let execute_attempts = await connection.execute(upadting_attempts);
  }catch(e){  
    console.log(e);
  }


  //check whether the user entered their details or not

  let emp_id=results[0].id;
  let check_emp_details = `select * from basic_information where employee_id = '${emp_id}'`;
  try{
    let [hasData] = await connection.execute(check_emp_details);

    if(hasData.length===0){
      return res.status(200).json({ msg: "redirected",ans:"employee-form" });
    }
    

  }catch(e){  
    console.log(e);
  }

  const user = jwt.sign(emp_id, "JWT_SECRET");
  res.cookie("user", user);
  
  return res.status(200).json({ msg: "success",ans:"home" });
  // return res.redirect("/self/home");
};

const registerController = async (req, res) => {
  let { email, password } = req.body;

  password = await bcrypt.hash(password, 10);
  const sqlQuery = `INSERT INTO register (email, password) VALUES('${email}', '${password}')`;
  try {
    const executeInsert = await connection.execute(sqlQuery);
    if (executeInsert[0]) {
      req.session.email = email;
      let sessionEmail = req.session.email;
      let payload = { email };
      const token = jwt.sign(payload, "JWT_SECRET");
      res.cookie("token", token);
      var mailOptions = {
        from: "tushar24081@gmail.com",
        to: `${email}`,
        subject: "Password Activation Link",
        html: `<h1>Welcome aboard!</h1><p>Click the below activation link to get started.</p><a href="http://localhost:3000/activate-account/${token}">${token}</a>`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          // console.log("Email sent: " + info.response);
        }
      });
      return res.render("activation", { email: sessionEmail });
    }
  } catch (err) {
    console.log(err);
  }
};

const logoutController = async (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

const checkEmailExistController = async (req, res) => {
  let getEmail = req.body.email;
  let sqlQuery = `SELECT * FROM register where email = '${getEmail}'`;
  try {
    let results = await connection.execute(sqlQuery);
    if (results[0].length) {
      return res.json({ status: "exist" });
    } else {
      return res.json({ status: "not" });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  loginController,
  registerController,
  checkEmailExistController,
  logoutController,
};
