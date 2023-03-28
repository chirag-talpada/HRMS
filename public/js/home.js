async function gettingLogData(){
    let res = await fetch(`/self/logs`);
    let data = await res.json();
    let logs = data["logs"];
    if(data){
        let container = document.getElementById("logs-container");
        logs.forEach(log => {
            console.log(log.activity);
            if(log.activity == "Checked In"){
                container.innerHTML += `<div class="activity-log">
                <div class="card-title-small">${log.full_name}</div>
                <div class="checkin-text activity-log-text">Checked In</div>
                <div class="log-time">${log.time}</div>
            </div>`}
            else if(log.activity == "Checked Out"){
                container.innerHTML += `<div class="activity-log">
                <div class="card-title-small">${log.full_name}</div>
                <div class="checkout-text activity-log-text">Checked Out</div>
                <div class="log-time">${log.time}</div>
            </div>`}
            else if(log.activity == "Breaked Out"){
                container.innerHTML += `<div class="activity-log">
                <div class="card-title-small">${log.full_name}</div>
                <div class="breakout-text activity-log-text">Breaked Out</div>
                <div class="log-time">${log.time}</div>
            </div>`
            }
            else if(log.activity == "Breaked In"){
                container.innerHTML += `<div class="activity-log">
                <div class="card-title-small">${log.full_name}</div>
                <div class="breakin-text activity-log-text">Breaked In</div>
                <div class="log-time">${log.time}</div>
            </div>`
            }
        });
    }
}
// gettingLogData();

