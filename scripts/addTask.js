const taskURL = 'https://join-317-default-rtdb.europe-west1.firebasedatabase.app/tasksAll/';
const userURL = 'https://join-317-default-rtdb.europe-west1.firebasedatabase.app/contactall'
let users = [];
let initial = [];
let color = [];


function activateprioButton(i) {
    resetprioButtons()
    switch (i) {
        case 0:
            document.getElementById('prio0').classList.add('high', 'active');
            document.getElementById('prioHigh').src = "../assets/icons/prioHightWhite.png";
            break;
        case 1:
            document.getElementById('prio1').classList.add('medium', 'active');
            document.getElementById('prioMed').src = "../assets/icons/prioMediumWhite.png";
            break;
        case 2:
            document.getElementById('prio2').classList.add('low', 'active');
            document.getElementById('prioLow').src = "../assets/icons/prioLowWhite.png";
            break;
    }
}


function resetprioButtons() {
    document.getElementById('prio0').classList.remove('high', 'active');
    document.getElementById('prio1').classList.remove('medium', 'active');
    document.getElementById('prio2').classList.remove('low', 'active');
    document.getElementById('prioHigh').src = "../assets/icons/prioHight.png";
    document.getElementById('prioMed').src = "../assets/icons/prioMedium.png";
    document.getElementById('prioLow').src = "../assets/icons/prioLow.png";
}


function clearAddTask() {
    document.getElementById('titleInput').value = "";
    document.getElementById('descriptionInput').value = "";
    document.getElementById('assignedToInput').value = "";
    document.getElementById('dueDateInput').value = "";
    activateprioButton(1)
    document.getElementById('category').value = "";
    document.getElementById('subtasksInput').value = "";
}


async function loadMembers() {
    let response = await fetch(userURL + '.json');
    let json = await response.json();
    getusers(json);
}


function getusers(users) {
    document.getElementById('dropdown').innerHTML = ``;
    document.getElementById('assignedUsers').innerHTML = ``;
    for (let i = 0; i < users.length; i++) {
        let user = users[i];
        let nameParts = user.name.split(' ');
        let initials = nameParts.slice(0, 2).map(part => part.charAt(0).toUpperCase()).join('');
        renderAssignedTo(user, initials, i);
        renderAssignedUser(user, initials, i);
    }
}


function renderAssignedTo(user, initials, i) {
    document.getElementById('dropdown').innerHTML += /*html*/`
        <div class="dropdownButton" id="user${i}" onclick="toggleAssignedUser(${i})">
            <div class="dropdownUser">
                <div class="userCircle" style="background-color:${user.color};">${initials}</div>
                <div>${user.name}</div>
            </div>
            <img id="assignedCheck${i}" class="dropdownCheckMark" src="../assets/icons/checkButtonblank.png" type="checkbox">
          </div>
    `
}


function renderAssignedUser(user, initials, i) {
    document.getElementById('assignedUsers').innerHTML += /*html*/`
        <div class="userCircle dNone" id="userCircle${i}" style="background-color:${user.color};">${initials}</div>
    `
}


function toggleAssignedUser(i) {
    let buttonChecked = "/assets/icons/checkButtonMobile.png";
    let buttonUnchecked = "../assets/icons/checkButtonblank.png";
    let check = document.getElementById(`assignedCheck${i}`);
    let currentCheck = check.src.split('/').pop();
    document.getElementById(`user${i}`).classList.toggle('dropdownButtonSelected');
    document.getElementById(`userCircle${i}`).classList.toggle('dNone');
    check.src = currentCheck === 'checkButtonMobile.png' ? buttonUnchecked : buttonChecked;
    // Hier den User adden in einem JSON Array
}


function selectCategory(cat) {
    // Hier die Kategorie zum JSON Array adden
}


function toggleUserDropdown() {
    let dropdown = document.getElementById("dropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}


function toggleCategory() {
    let dropdown = document.getElementById("dropdownCategory");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

function createTask() {

}