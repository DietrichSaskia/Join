const taskURL = 'https://join-317-default-rtdb.europe-west1.firebasedatabase.app/tasksAll/';
const userURL = 'https://join-317-default-rtdb.europe-west1.firebasedatabase.app/contactall'
const dateInput = document.getElementById('dueDateInput');

let tasks = [
    {
        'category': '',
        'date': '',
        'description': '',
        'id': '',
        'prio': '/assets/icons/prioMedium.png',
        'prioName': 'Medium',
        'section': 'toDo',
        'subTask': [],
        'title': '',
    },
];
let task = tasks[0];
let debounceTimeout;


function loadFunctions() {
    searchStart();
    loadMembers();
    activateprioButton(1);
}


document.getElementById('subtasksInput').addEventListener("focusout", (event) => { showSubtaskIcons() });


dateInput.addEventListener('input', function () {
    if (dateInput.value) {
        dateInput.classList.add('has-value');
    } else {
        dateInput.classList.remove('has-value');
    }
});


document.addEventListener('click', function (clickEvent) {
    let dropdown = document.getElementById("dropdown");
    let button = document.getElementById('userButton');
    if (!dropdown.contains(clickEvent.target) && !button.contains(clickEvent.target) && !dropdown.classList.contains('dNone')) {
        toggleUserDropdown();
    }
});


function activateprioButton(i) {
    resetprioButtons()
    switch (i) {
        case 0:
            setPrioHigh(task);
            break;
        case 1:
            setPrioMedium(task);
            break;
        case 2:
            setPrioLow(task);
            break;
    }
}


function setPrioHigh(task) {
    document.getElementById('prio0').classList.add('high', 'active');
    document.getElementById('prioHigh').src = "../assets/icons/prioHighWhite.png";
    task['prio'] = '/assets/icons/prioHigh.png';
    task['prioName'] = 'High';
}


function setPrioMedium(task) {
    document.getElementById('prio1').classList.add('medium', 'active');
    document.getElementById('prioMed').src = "../assets/icons/prioMediumWhite.png";
    task['prio'] = '/assets/icons/prioMedium.png';
    task['prioName'] = 'Medium';
}


function setPrioLow(task) {
    document.getElementById('prio2').classList.add('low', 'active');
    document.getElementById('prioLow').src = "../assets/icons/prioLowWhite.png";
    task['prio'] = '/assets/icons/prioLow.png';
    task['prioName'] = 'Low';
}


function resetprioButtons() {
    document.getElementById('prio0').classList.remove('high', 'active');
    document.getElementById('prio1').classList.remove('medium', 'active');
    document.getElementById('prio2').classList.remove('low', 'active');
    document.getElementById('prioHigh').src = "../assets/icons/prioHigh.png";
    document.getElementById('prioMed').src = "../assets/icons/prioMedium.png";
    document.getElementById('prioLow').src = "../assets/icons/prioLow.png";
}


async function loadMembers() {
    let response = await fetch(userURL + '.json');
    let json = await response.json();
    getusers(json);
}


function getusers(users) {
    for (let i = 0; i < 5; i++) {
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
                <div class="searchUserName">${user.name}</div>
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
    let userstory = document.getElementById('userStory');
    let techTask = document.getElementById('techTask');
    if (cat === "User Story" && !userstory.classList.contains('dropdownButtonSelected')) {
        userstory.classList.toggle('dropdownButtonSelected');
        techTask.classList.remove('dropdownButtonSelected');
        document.getElementById('category').innerHTML = "User Story";
    }
    else if (cat === "Technical Task" && !techTask.classList.contains('dropdownButtonSelected')) {
        techTask.classList.toggle('dropdownButtonSelected');
        userstory.classList.remove('dropdownButtonSelected');
        document.getElementById('category').innerHTML = "Technical Task";
    }
    else {
        userstory.classList.remove('dropdownButtonSelected');
        techTask.classList.remove('dropdownButtonSelected');
        document.getElementById('category').innerHTML = "Select task category";
    }
    task['category'] = cat;
    toggleCategory()
}


function toggleUserDropdown() {
    let dropdown = document.getElementById("dropdown");
    dropdown.classList.toggle("dNone");
    document.getElementById('searchUser').focus();
}


function toggleCategory() {
    let dropdown = document.getElementById("dropdownCategory");
    dropdown.classList.toggle("dNone");
}


function showSubtaskIcons() {
    setTimeout(function () {
        document.getElementById('subtaskActive').classList.toggle('dNone');
        document.getElementById('subtaskInactive').classList.toggle('dNone');
    }, 200);
}


function showSubtask() {
    document.getElementById('subtasksInput').focus();
}


function createSubtask() {
    let input = document.getElementById('subtasksInput').value;
    if (task['subTask'].length === 0) {
        putSubTask(input, 0);
        task['subTask'].push(input);
        removeSubtask();
    }
    else if (task['subTask'].length === 1) {
        putSubTask(input, 1);
        task['subTask'].push(input);
        removeSubtask();
    }
    else {
        return
    }

}


function removeSubtask() {
    document.getElementById('subtasksInput').value = "";
}


function putSubTask(input, i) {
    document.getElementById('subTasksBox').innerHTML += /*html*/`
        <ul>
            <li id="subTask${i}">${input}</li>
            <div class="subtaskIconsLower">
                <img class="subtaskIcon" src="../assets/icons/delete.png">
                <div class="smallSeparator"></div>
                <img class="subtaskIcon" src="../assets/icons/check.png">
            </div>
        </ul>
    `
}


function clearAddTask() {
    document.getElementById('titleInput').value = "";
    document.getElementById('descriptionInput').value = "";
    document.getElementById('dueDateInput').value = "";
    activateprioButton(1);
    document.getElementById('category').value = "";
    document.getElementById('subtasksInput').value = "";
}


function createTask() {
    // task['category'] = document.getElementById('category').value;
    task['date'] = document.getElementById('dueDateInput').value;
    task['description'] = document.getElementById('descriptionInput').value;
    task['subTask'] = document.getElementById('subtasksInput').value;
    task['title'] = document.getElementById('titleInput').value;
    clearAddTask()

}


function searchStart() {
    document.getElementById('searchUser').addEventListener('input', function () {
        console.log('test');
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            searchUser(this.value);
            console.log(this.value);
        }, 300);
    });
}


function searchUser(input) {
    console.log('suchfunktion klappt');
    input = input.toLowerCase();
    let users = document.getElementsByClassName('searchUserName');
    console.log(users);
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const id = user.id.toLowerCase();
        if (input.length >= 3) {
            if (id.includes(input)) {
                user.style.display = 'inline-block';
            } else {
                user.style.display = 'none';
            }
        } else {
            user.style.display = 'inline-block';
        }
    }
}


// Habe Saskia ins Array prio und PrioName gepusht prio=der Link vom Bild