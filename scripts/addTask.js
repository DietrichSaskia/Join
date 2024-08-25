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
        'assignedInitals': '',
        'assignedName': '',
    },
];

let task = tasks[0];


async function loadFunctions() {
    activateprioButton(1);
    await loadMembers();
    searchUsers();
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
    for (let i = 0; i < users.length; i++) {
        let user = users[i];
        loadUser(user, i)
    }
}


function loadUser(user, i) {
    let nameParts = user.name.split(' ');
    let initials = nameParts.slice(0, 2).map(part => part.charAt(0).toUpperCase()).join('');
    renderAssignedTo(user, initials, i);
    renderAssignedUser(user, initials, i);
}


function renderAssignedTo(user, initials, i) {
    document.getElementById('dropdownUsers').innerHTML += /*html*/`
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
    let dropdownUsers = document.getElementById("dropdownUsers");
    dropdown.classList.toggle("dNone");
    dropdownUsers.classList.toggle("dNone");
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


function checkSubtask() {
    let input = document.getElementById('subtasksInput').value;
    document.getElementById('inputerrorSubTask1').style.display = 'none';
    document.getElementById('inputerrorSubTask2').style.display = 'none';
    document.getElementById('subtasksInput').classList.remove('redInputBorder');
    if (input.length === 0) {
        document.getElementById('inputerrorSubTask1').style.display = 'block';
        document.getElementById('subtasksInput').classList.add('redInputBorder');
    }
    else {
        createSubtask(input)
    }
}


function createSubtask(input) {
    if (task['subTask'][0] === null || task['subTask'].length === 0) {
        putSubTask(input, 0);
        task['subTask'].splice(0, 1, input);
        clearSubtask(0);
    }
    else if (task['subTask'][1] === null || task['subTask'].length === 1) {
        putSubTask(input, 1);
        task['subTask'].splice(1, 1, input);
        clearSubtask(1);
    }
    else {
        document.getElementById('inputerrorSubTask2').style.display = 'block';
        document.getElementById('subtasksInput').classList.add('redInputBorder');
    }
}


function clearSubtask() {
    document.getElementById('subtasksInput').value = "";
}


function putSubTask(input, i) {
    document.getElementById('subTasksBox').innerHTML += /*html*/`
    <div id="subTaskBox${i}" class="subTaskBox">
        <ul>
            <li id="subTask${i}">${input}</li>
            <div class="subtaskIconsLower">
                <img class="subtaskIcon" onclick="editSubtask(${i})" src="../assets/icons/edit.png">
                <div class="smallSeparator"></div>
                <img class="subtaskIcon" onclick="deleteSubtask(${i})" src="../assets/icons/delete.png">
            </div>
        </ul>
    </div>
    `
}


function deleteSubtask(i) {
    task['subTask'][i] = null;
    document.getElementById(`subTaskBox${i}`).remove();
}


function editSubtask(i) {
    
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


function searchUsers() {
    let timeout;
    document.getElementById('searchUser').addEventListener('input', function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            searchUser(this.value);
        }, 300);
    })
};


function searchUser(input) {
    input = input.toLowerCase();
    let users = document.getElementsByClassName('dropdownButton');
    for (let i = 0; i < users.length; i++) {
        let userNameElement = users[i].getElementsByClassName('searchUserName')[0];
        let userName = userNameElement.innerHTML;
        const id = userName.toLowerCase();
        if (input.length >= 3) {
            if (id.includes(input)) {
                users[i].style.display = 'flex';
            } else {
                users[i].style.display = 'none';
            }
        } else {
            users[i].style.display = 'flex';
        }
    }
}