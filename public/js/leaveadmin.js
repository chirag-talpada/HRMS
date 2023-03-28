async function show(id) {
    console.log(id);
    let res = await fetch(`/leaveadmin/showleaveAdmin/?id=${id}`);
    let databasedata = await res.json();
    console.log(databasedata);
    let data = "";
    data += `<div class="showdata">
        <table class="tab">
            <tr>
                <div class="column-entry">
                    <div class="coll">
                        <h4>Name</h4>
                    </div>
                    <div class="coll">
                        <h4>Leave Date</h4>
                    </div>
                    <div class="coll">
                        <h4>Leave Type</h4>
                    </div>
                    <div class="coll">
                        <h4>Leave Reason</h4>
                    </div>
                    <div class="coll">
                        <h4>Half Day</h4>
                    </div>
                    
            </tr>
            <tr>
                <div class="column2">
                    <div class="col-data">
                        <p>${databasedata[0].full_name}</p>
                    </div>
                    <div class="col-data">
                        <p>${databasedata[0].leave_type}</p>
                    </div>
                    <div class="col-data">
                        <p>${databasedata[0].leave_date}</p>
                    </div>
                    <div class="col-data">
                        <p>${databasedata[0].leave_reason}</p>
                    </div>
                    <div class="col-data">
                        <p>${databasedata[0].half_day}</p>
                    </div>
                </div>
            </tr>
        </table>       
        </div>
        <div class="leave-status">
        <p>Your leave-status : ${databasedata[0].leave_status}</p>
        </div>
<div class="apply">
     
 <input type="button" onclick="return acceptleave('${id}')" class="applied" id="one" value="Accept"> 

 <input type="button" onclick="return rejectleave('${id}')" class="applied" id="two" value="Reject"> 

              
</div>`;

    let showleaves = document.createElement("div");
    showleaves.className = "show";
    showleaves.innerHTML = data;
    document.getElementById("leaves").appendChild(showleaves);

}

async function acceptleave(id) {
    console.log("test");
    let showcase = document.getElementsByClassName("show")[0];
    //console.log(showcase);
    showcase.style.display = "none";

    let res = await fetch(`/leaveadmin/acceptLeave/?id=${id}`);
    let databasedata1 = await res.json();
}

async function rejectleave(id) {
    let showcase = document.getElementsByClassName("show")[0];
    //console.log(showcase);
    showcase.style.display = "none";

    let res = await fetch(`/leaveadmin/rejectLeave/?id=${id}`);
    let databasedata2 = await res.json();
    //  console.log(databasedata2);

}

