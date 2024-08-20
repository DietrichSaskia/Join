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


async function showMembers() {
    let response = await fetch(userURL + '.json');
    let json = await response.json();
    getusers(json);
}


function getusers(users) {
    document.getElementById('dropdown').innerHTML = ``;
    for (let i = 0; i < users.length; i++) {
        let user = users[i];
        let nameParts = user.name.split(' ');
        let initials = nameParts.slice(0, 2).map(part => part.charAt(0).toUpperCase()).join('');
        renderAssignedTo(user, initials, i);
    }
}


function renderAssignedTo(user, initials, i) {
    document.getElementById('dropdown').innerHTML += /*html*/`
        
          <div>
            <div class="userCircle">${initials}</div>
            <span>${user}</span>
            <input type="checkbox">
          </div>
        
    `
}

function toggleDropdown() {
    showMembers();
    var dropdown = document.getElementById("dropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

window.onclick = function(event) {
    if (!event.target.matches('.dropdown-btn')) {
        var dropdowns = document.getElementsByClassName("dropdown");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.style.display === "block") {
                openDropdown.style.display = "none";
            }
        }
    }
}

function getInitials(i) { }
function getColors(i) { }


function createTask() {

}