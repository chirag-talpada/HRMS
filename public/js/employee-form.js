

let uploadBtn = document.getElementById("upload-button");
let chosenImg = document.getElementById("chosen-image");
let uploadImg = document.getElementById("upload-image");
var removeImg = document.getElementById('remove-image');
var counter = 0;

uploadBtn.onchange = () => {
    let reader = new FileReader();
    reader.readAsDataURL(uploadBtn.files[0]);
    reader.onload = () => {
        chosenImg.setAttribute("src", reader.result);

    }
}

uploadImg.onclick = () => {
    removeImg.style.display = "block";
    uploadImg.style.display = "none";

}


if (uploadImg.id == "remove_image") {
    console.log('green');
    uploadImg.style.backgroundColor = "green";
}

removeImg.onclick = () => {

    removeImg.style.display = "none";
    uploadImg.style.display = "block"

    uploadImg.style.backgroundColor = "#002f4b";
    uploadImg.innerHTML = 'Upload Image';
    chosenImg.setAttribute("src", "https://hrms.appdemoserver.com/assets/img/avatars/profile_image.jpg ");


}


function uploadImage() {
    console.log("upload");
    fetch(`http://127.0.0.1:3000/employee-data/upload`);
}






// ------------------validation---------------------
var name = document.getElementById("fullname").value;

var dob = document.getElementById("dob").value;
var dobErr = document.getElementById("dobErr");

console.log(document.querySelectorAll(".btnNext"));



function require_validate(element, valid) {
    var data = element.value;
    console.log("element", element);

    if (data == "") {
        document.getElementById(valid).innerHTML = "Kindly add the information";

        counter--;
        return false;
    }

    else {
        document.getElementById(valid).innerHTML = " ";
        counter++;

        return true;
    }
}




function validateFullName() {
    var nameErr = document.getElementById("name_msg");
    var emailErr = document.getElementById("email_msg");

    var email = document.getElementById('email').value;
    var email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


    var name = document.getElementById("fullname").value;



    var regName = /^[a-zA-Z]+ [a-zA-Z]+$/;
    if (!regName.test(name)) {
        nameErr.innerHTML = "please enter valid full name";
        document.getElementById("basicnextBtn").disabled = true;

        return false;
    }

    else {

        nameErr.innerHTML = "";
        return true;

    }

}



function validateEmail() {
    var emailErr = document.getElementById("email_msg");

    var email = document.getElementById('email').value;
    var email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!email_regex.test(email)) {
        emailErr.innerHTML = "invalid email";
        document.getElementById("basicnextBtn").disabled = true;

        return false;
    }

    else {

        emailErr.innerHTML = '';

        return true;
    }



}



function num_validate(ele, id) {

    console.log(id);
    var num = /^[0-9]*$/;
    var alphabet = /^[a-zA-Z]+$/
    var sp_char = /[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]/g;
    var contact = ele.value;
    var alphabet = /^[a-zA-Z]+$/



    if (contact.length < 10 || contact.match(sp_char) || contact.match(alphabet) || !contact.match(num)) {
        document.getElementById(id).innerHTML = 'please enter valid contact number';
        document.getElementById("contactnextbtn").disabled = true;

        return false;
    }


    else {
        document.getElementById(id).innerHTML = " ";
        return true;
    }


}

function person_validate(ele, id) {
    // var num =/^[0-9]*$/;
    var alphabet = /^[a-zA-Z]+$/

    var person = ele.value;

    if (!person.match(alphabet)) {
        document.getElementById(id).innerHTML = "Input data should be alphabet only!";
        console.log("invalid name");
        return false;
    }
    else {
        document.getElementById(id).innerHTML = "";
        return true;
    }

}

function aadhar_validate() {
    var num = /^[0-9]*$/;
    var alphabet = /^[a-zA-Z]+$/
    var sp_char = /[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]/g;

    var aadhar_num = document.getElementById("aadhar_num").value;
    if (aadhar_num.length < 12 || aadhar_num.match(sp_char) || aadhar_num.match(alphabet) || !aadhar_num.match(num)) {
        document.getElementById("aadhar_num_msg").innerHTML = "Please enter valid aadhar number";
        document.getElementById("docnextBtn").disabled = true;

        return false;
    }
    else {
        document.getElementById("aadhar_num_msg").innerHTML = "";
        return true;
    }
}

function pan_validate() {
    var regex = "[A-Z]{5}[0-9]{4}[A-Z]{1}";
    var pan_num = document.getElementById("pan_num").value;

    if (!pan_num.match(regex) || pan_num.length < 10) {
        document.getElementById("pan_msg").innerHTML = "Enter valid PAN Number";
        document.getElementById("docnextBtn").disabled = true;
        return false;
    }
    else {
        document.getElementById("pan_msg").innerHTML = "";
        return true;
    }
}

function cheque_validate() {
    var num = /^[0-9]*$/;
    // var alphabet =/^[a-zA-Z]+$/
    // var sp_char =/[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]/g;
    var cheque_num = document.getElementById("cheque_num").value;

    if (!cheque_num.match(num)) {
        document.getElementById("cheque_msg").innerHTML = "Please enter valid cheque number";
        document.getElementById("docnextBtn").disabled = true;

        return false;
    }
    else {
        document.getElementById("cheque_msg").innerHTML = "";
        return true;
    }

}


async function sendData(data){

    let profile=document.querySelector('#upload-button').files[0];
    let aadhar=document.querySelector('#aadhar_doc').files[0];
    let pan=document.querySelector('#pan_doc').files[0];
    let cheque=document.querySelector('#cheque_doc').files[0];
    let resume=document.querySelector('#resume_doc').files[0];

    let myForm=new FormData();

    data=JSON.stringify(data);

    myForm.append("file",profile);
    myForm.append("file",aadhar);
    myForm.append("file",pan);
    myForm.append("file",cheque);
    myForm.append("file",resume);
    myForm.append("data",data);
    

    try {
        const response = await fetch(`/employee-form`, {
            method: 'POST',
            body:myForm
        });

        let res = await response.json();

        if(res.status==200){
            location.assign('/self/home')
        }else{
            alert(res.msg);
            
        }
        


    } catch (err) {
        console.log(err);

    }
}


document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();

    let data={};

    let basic_details={};

    basic_details.fullname=document.querySelector('#fullname').value;

    let raw_dob=document.querySelector('#dob').value;
    let dob=raw_dob.split('/');

    basic_details.dob=`${dob[2]}-${dob[0]}-${dob[1]}`;

    basic_details.email=document.querySelector('#email').value;
    basic_details.gender=document.querySelector('#gender').value;
    basic_details.m_status=document.querySelector('#status').value;
    if(document.querySelector('#wfh_yes').checked){
        basic_details.wfh=document.querySelector('#wfh_yes').value;
    }else{
        basic_details.wfh=document.querySelector('#wfh_no').value;
    }
    
    data.basic_details=basic_details;
    
    let contact_info={};

    contact_info.current_address=document.querySelector('#current_address').value;
    contact_info.permanent_address=document.querySelector('#permanent_address').value;
    contact_info.contact=document.querySelector('#contact').value;
    contact_info.emergency_contact=document.querySelector('#emergency_contact').value;
    contact_info.emergency_person=document.querySelector('#emergency_person').value;

    data.contact_info=contact_info;


    let company_relation = {};

    company_relation.designation = document.querySelector('#designation').value;
    company_relation.department = document.querySelector('#department').value;

    let raw_join = document.querySelector('#join_date').value;
    let join_d = raw_join.split('/');

    company_relation.join_date = `${join_d[0]}`;


    let raw_prob = document.querySelector('#probation_date').value;
    let prob_d = raw_prob.split('/');

    company_relation.probation_date = `${prob_d[0]}`;



    data.company_relation = company_relation;

    let document_info={};

    document_info.aadhar_number=document.querySelector('#aadhar_num').value;
    document_info.pan_num=document.querySelector('#pan_num').value;
    document_info.cheque_num=document.querySelector('#cheque_num').value;

    data.document_info=document_info;

    let social={};

    social.twitter=document.querySelector('#twitter').value;
    social.linkedin=document.querySelector('#linkedin').value;
    social.github=document.querySelector('#github').value;
    social.facebook=document.querySelector('#facebook').value;

    data.social=social;
    
    sendData(data);

    let submit_btn=document.querySelector('.update');

    submit_btn.classList.add('disabled-submit');
    submit_btn.disabled=true;

});

