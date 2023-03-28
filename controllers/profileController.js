var connection = require("../connection/connection");
const dateformat = require('date-fns');

const profile = async(req, res) => {
    let empId = req.session.user;
    let query1 = `select employee_id,full_name,gender,birthdate,marital_status,allowed_wfh from basic_information where employee_id=${empId}`;
    let query2 = `select contact_no,emergency_contact,emergency_person_name,permenant_address,current_address from contact_information where employee_id=${empId}`;
    let query3 = `select designation,department,join_date,probation_date from company_relation where employee_id=${empId}`;
    let query4 = `select twitter,linkedin,github from social_information where employee_id=${empId}`;
    let query5 = `select aadhar_no,pancard_no from documents where employee_id=${empId}`;

        let result1 = await connection.execute(query1);
        let result2 = await connection.execute(query2);
        let result3 = await connection.execute(query3);
        let result4 = await connection.execute(query4);
        let result5 = await connection.execute(query5);
        let dob = dateformat.format(new Date(result1[0][0]?.birthdate ?? '27-02-2001'), 'dd-MM-yyyy');
        let join_date = dateformat.format(new Date(result3[0][0]?.join_date), 'dd-MM-yyyy');
        let probation_date = dateformat.format(new Date(result3[0][0]?.probation_date), 'dd-MM-yyyy');
       

        res.render('profile', {
            data: result1[0],dob:dob,data2:result2[0],data3:result3[0],data4:result4[0],data5:result5[0], activatePage: "home", join_date, probation_date

        });
    
}
module.exports =profile;