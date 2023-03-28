const usercardContainer = document.querySelector('.display');

const onlineDiv = document.querySelector('.count-record');
const onBreakDiv = document.querySelector('.count-onbreak');
const offlineDiv = document.querySelector('.count-offline');

const searchInput = document.querySelector('#search-user');
let timer, lastName = "";


function renderUserCard(users, status) {

    usercardContainer.innerHTML = "";

    let statusClass = "";

    if (status == "online") {
        statusClass = "on";
    } else if (status == "On Break") {
        statusClass = "onBreak";
    } else if (status == "offline") {
        statusClass = "off";
    }

    users.forEach(user => {

        let card = `<div class="person">
        <div class="head">
            <div class="hotline-office">
                <i class="fa-solid fa-building"></i>
            </div>
            <div class="${statusClass}">
                <span>${status}</span>
            </div>
        </div>
        <div class="person-img">
            <div class="p-img">
                <img src="/upload_uncompressed/${user.profile_pic}">
            </div>
            <span>${user.full_name}</span>
            <p class="hotline-designation">${user.designation}</p>
        </div>
        <div class="details">
            <div class="row1">
                <div>
                    <p>Departement</p>
                    <span>${user.department}</span>
                </div>
                <div>
                    <p>Date Hired</p>
                    <span>23-01-2023</span>
                </div>
            </div>
            <div class="row2">
                <div class="hotline-person-icon">
                    <span class="material-symbols-outlined">
                        mail
                        </span>
                </div>
                <div class="hotline-mail-text">${user.email}</div>
            </div>
            <div class="row2">
                <div class="hotline-person-icon">
                    <span class="material-symbols-outlined">
                        call
                        </span>
                </div>
                <div>${user.contact_no}</div>
            </div>
        </div>
    </div>`;

        usercardContainer.innerHTML += card;

    });


}

function renderMixUserCard(data) {

    usercardContainer.innerHTML = "";

    data.forEach(user => {

        let statusClass = "",status="";

        if (user.status == "online") {
            statusClass = "on";
            status="online";
        } else if (user.status == "onBreak") {
            statusClass = "onBreak";
            status="On Break";
        } else if (user.status == "offline") {
            statusClass = "off";
            status="offline";
        }

        let card = `<div class="person">
        <div class="head">
            <div class="hotline-office">
                <i class="fa-solid fa-building"></i>
            </div>
            <div class="${statusClass}">
                <span>${status}</span>
            </div>
        </div>
        <div class="person-img">
            <div class="p-img">
                <img src="/upload_uncompressed/${user.profile_pic}">
            </div>
            <span>${user.full_name}</span>
            <p class="hotline-designation">${user.designation}</p>
        </div>
        <div class="details">
            <div class="row1">
                <div>
                    <p>Departement</p>
                    <span>${user.department}</span>
                </div>
                <div>
                    <p>Date Hired</p>
                    <span>23-01-2023</span>
                </div>
            </div>
            <div class="row2">
                <div class="hotline-person-icon">
                    <span class="material-symbols-outlined">
                        mail
                        </span>
                </div>
                <div class="hotline-mail-text">${user.email}</div>
            </div>
            <div class="row2">
                <div class="hotline-person-icon">
                    <span class="material-symbols-outlined">
                        call
                        </span>
                </div>
                <div>${user.contact_no}</div>
            </div>
        </div>
    </div>`;

        usercardContainer.innerHTML += card;

    });


}


async function showOnlineUser() {

    let res = await fetch(`/self/hotline/user/online`);
    let { users } = await res.json();

    renderUserCard(users, 'online');

}

async function showOnBreakUser() {
    let res = await fetch(`/self/hotline/user/onBreak`);
    let { users } = await res.json();

    renderUserCard(users, 'On Break');
}

async function showOfflineUser() {
    let res = await fetch(`/self/hotline/user/offline`);
    let { users } = await res.json();

    renderUserCard(users, 'offline');
}

async function getOnlineUserNumber() {
    let res = await fetch(`/self/hotline/user-count/online`);
    let { count } = await res.json();

    document.getElementById('online-number').innerHTML = count;

}

async function getOnBreakUserNumber() {
    let res = await fetch(`/self/hotline/user-count/onBreak`);
    let { count } = await res.json();

    document.getElementById('onBreak-number').innerHTML = count;

}

async function getofflineUserNumber() {
    let res = await fetch(`/self/hotline/user-count/offline`);
    let { count } = await res.json();

    document.getElementById('offline-number').innerHTML = count;

}

function displayAllNumbers() {
    getOnlineUserNumber();
    getOnBreakUserNumber();
    getofflineUserNumber();
}

//showing employee profile and name

async function getUserInfo() {
    try {
        let res = await fetch(`/self/get-user`);

        let { user_data } = await res.json();

        document.querySelector('.user-name').innerHTML = user_data.full_name;
        document.querySelector('.profile__photo').setAttribute('src', `/upload_compressed/${user_data.profile_pic}`)

    } catch (err) {
        console.log(err);

    }
}

getUserInfo();
showOnlineUser();

onlineDiv.addEventListener('click', function () {
    showOnlineUser();
});

onBreakDiv.addEventListener('click', function () {
    showOnBreakUser();
});

offlineDiv.addEventListener('click', function () {
    showOfflineUser();
});

async function getSearchedUser(name) {
    let res = await fetch(`/self/hotline/search?name=${name}`);
    let { data } = await res.json();

    renderMixUserCard(data)

}

function debounce(name) {
    clearTimeout(timer);

    timer = setTimeout(function () {
        getSearchedUser(name);
    }, 800);
}

displayAllNumbers();

searchInput.addEventListener('keyup', function (e) {

    if (lastName == e.target.value) {
        return
    }

    lastName = e.target.value;

    debounce(e.target.value);
})