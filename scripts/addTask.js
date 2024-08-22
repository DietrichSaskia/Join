const taskURL = 'https://join-317-default-rtdb.europe-west1.firebasedatabase.app/tasksAll/';
const userURL = 'https://join-317-default-rtdb.europe-west1.firebasedatabase.app/contactall'
const dateInput = document.getElementById('dueDateInput');

    dateInput.addEventListener('input', function() {
        if (dateInput.value) {
            dateInput.classList.add('has-value');
        } else {
            dateInput.classList.remove('has-value');
        }
    });


function activateprioButton(i) {
    resetprioButtons()
    switch (i) {
        case 0:
            document.getElementById('prio0').classList.add('high', 'active');
            document.getElementById('prioHigh').src = "../assets/icons/prioHighWhite.png";
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
    document.getElementById('prioHigh').src = "../assets/icons/prioHigh.png";
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
    if (cat === "User Story") {
        document.getElementById('userStory').classList.toggle('dropdownButtonSelected');
        document.getElementById('techTask').classList.remove('dropdownButtonSelected');
    }
    else {
        document.getElementById('techTask').classList.toggle('dropdownButtonSelected');
        document.getElementById('userStory').classList.remove('dropdownButtonSelected');
    }
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


function searchUser(input) {
    input = input.toLowerCase();
    let users = document.getElementsByClassName('dropdownUser');
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const id = user.id.toLowerCase();
        if (input.length >= 3) {
            if (id.includes(input)) {
                card.style.display = 'inline-block';
            } else {
                card.style.display = 'none';
            }
        } else {
            card.style.display = 'inline-block';
        }
    }
}
let debounceTimeout;
document.getElementById('searchUser').addEventListener('input', function () {
clearTimeout(debounceTimeout);
debounceTimeout = setTimeout(() => {
    searchUser(this.value);
}, 300);
});