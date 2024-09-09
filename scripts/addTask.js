const taskURL = 'https://join-317-default-rtdb.europe-west1.firebasedatabase.app/tasksAll/';
const userURL = 'https://join-317-default-rtdb.europe-west1.firebasedatabase.app/contactall'

let tasks = [
    {
        'category': '',
        'date': '',
        'description': '',
        'id': '',
        'prio': '/assets/icons/prioMedium.png',
        'prioName': 'Medium',
        'section': 'toDo',
        'subtasks': ["", ""],
        'subtasksCheck': [false, false],
        'title': '',
        'assignedInitals': [],
        'assignedName': [],
        'color': [],
    },
];
let task = tasks[0];
let taskAllArray = [];
let contactAllArray = [];


/**
 * Loads the initial tasks for the addTask.html
 */
function loadFunctions() {
    loadAddTaskComplete('mainContent');
    activateprioButton(1);
    loadMembers();
    searchUsers();
    load();
    configureDueDateInput()
}


document.addEventListener('focusout', (event) => {
    if (event.target && event.target.id === 'subtasksInput') {
        showSubtaskIcons();
    }
});


document.addEventListener('focus', (event) => {
    if (event.target && event.target.id === 'subtasksInput') {
        addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                checkSubtask()
            }
        })
    }
});


document.addEventListener('dblclick', function (dblclickEvent) {
    let subTaskInput0 = document.getElementById("subtaskBox0");
    let subTaskInput1 = document.getElementById("subtaskBox1");
    if (subTaskInput0 && subTaskInput0.contains(dblclickEvent.target)) {
        editSubtask(0);
    }
    else if (subTaskInput1 && subTaskInput1.contains(dblclickEvent.target)) {
        editSubtask(1);
    }
});


document.addEventListener('click', function (clickEvent) {
    let dropdown = document.getElementById("dropdown");
    let button = document.getElementById('userButton');
    if (dropdown && button && !dropdown.contains(clickEvent.target) && !button.contains(clickEvent.target) && !dropdown.classList.contains('dNone')) {
        toggleUserDropdown();
    }
});


/**
 * Resets all priority Buttons and activates the clicked priority Button and it's Function
 * 
 * @param {number} i This is the number of the priority Button
 */
function activateprioButton(i) {
    resetprioButtons
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


/**
 * Loads the Users from the local storage
 */
function loadMembers() {
    let tasksAsText = localStorage.getItem('contactAllArray');
    if (tasksAsText) {
        json = JSON.parse(tasksAsText);
    }
    getusers(json);
}


/**
 * Breaks up the array and load the individual user
 * 
 * @param {Array} users The Array that is used to temporarily save all users
 */
function getusers(users) {
    document.getElementById('dropdownUsers').innerHTML = ``;
    document.getElementById('assignedUsers').innerHTML = ``;
    for (let i = 0; i < users.length; i++) {
        let user = users[i];

        loadUser(user, i)
    }
}


/**
 * Gets the initials of the individual user and starts the render Function for the dropdown Menu
 * 
 * @param {Object} user The individual User in the Array
 * @param {number} i The index of the Object in the Array
 */
function loadUser(user, i) {
    contactAllArray.push(user);
    let nameParts = user.name.split(' ');
    let initials = nameParts.slice(0, 2).map(part => part.charAt(0).toUpperCase()).join('');
    renderAssignedTo(user, initials, i);
    renderAssignedUser(user, initials, i);
}


/**
 * Selects the Category in the dropdown Menu and resets it if the same one is clicked and sets it into the array task
 * 
 * @param {string} cat This string contains the category
 */
function selectCategory(cat) {
    let userstory = document.getElementById('userStory');
    let techTask = document.getElementById('techTask');
    if (cat === "User Story" && !userstory.classList.contains('dropdownButtonSelected')) {
        selectUserStory(userstory, techTask)
    }
    else if (cat === "Technical Task" && !techTask.classList.contains('dropdownButtonSelected')) {
        selectTechTask(userstory, techTask)
    }
    else {
        clearCategory();
    }
    task['category'] = cat;
    toggleCategory()
}


/**
 * Sets the focus on the subtask input field
 */
function showSubtask() {
    document.getElementById('subtasksInput').focus();
}


/**
 * Pushes the subtask input field into the task Array and puts it into a subtaskbox
 * 
 * @param {string} input The value of the subtask input
 */
function createSubtask(input) {
    if (task['subtasks'][0] === "") {
        putSubTask(input, 0);
        task['subtasks'].splice(0, 1, input);
        clearSubtaskInput(0);
    }
    else if (task['subtasks'][1] === "") {
        putSubTask(input, 1);
        task['subtasks'].splice(1, 1, input);
        clearSubtaskInput(1);
    }
    else {
        document.getElementById('inputerrorSubtask2').style.display = 'block';
        document.getElementById('subtasksInput').classList.add('redInputBorder');
    }
}


/**
 * clears the value of the subtask input field
 */
function clearSubtaskInput() {
    document.getElementById('subtasksInput').value = "";
}


/**
 * clears all Input Fields and buttons and puts them into their default state
 */
function clearAddTask() {
    loadMembers();
    document.getElementById('titleInput').value = "";
    document.getElementById('descriptionInput').value = "";
    document.getElementById('dueDateInput').value = "";
    document.getElementById('subtasksInput').value = "";
    activateprioButton(1);
    clearCategory();
    clearSubtask(0);
    clearSubtask(1);
}


/**
 * Creates a new Task and adds it to the local storage
 * 
 * @returns stops the function if not all inputs needed are filled
 */
function createTask() {
    load();
    setArray();
    if (!checkInputs()) {
        return;
    }
    save();
    showSuccessTask();
    goToBoard();
}


/**
 * checks if all 3 inputs are filled
 * 
 * @returns true if all inputs are validated
 */
function checkInputs() {
        let checked = true;
        let check1 = checkInputTitle(checked);
        if (!check1) {
          checked = false;
        }
        let check2 = checkInputDate(checked);
        if (!check2) {
          checked = false;
        }
        let check3 = checkInputCategory(checked);
        if (!check3) {
          checked = false;
        }
        return checked;
      }


/**
 * fills the Object [task] with all inputs from the user
 */
function setArray() {
    let users = document.getElementsByClassName('dropdownButton');
    for (let i = 0; i < users.length; i++) {
        if (users[i].classList.contains('dropdownButtonSelectedUser')) {
            task['assignedName'].push(document.getElementById(`searchUserName${i}`).innerText);
            task['assignedInitals'].push(document.getElementById(`userCircle${i}`).innerText);
            task['color'].push(document.getElementById(`userCircle${i}`).style.backgroundColor);
        }
    }
    task['date'] = changeDateFormat();
    task['description'] = document.getElementById('descriptionInput').value;
    let id = taskAllArray.length;
    task['id'] = id;
    task['title'] = document.getElementById('titleInput').value;
}


/**
 * Changes Date format from Input to German format
 * 
 * @returns formatted Date in German
 */
function changeDateFormat() {
    let date = document.getElementById('dueDateInput').value;
    let formattedDate = date.replace(/-/g, '/');
    let [year, month, day] = formattedDate.split('/');
    let formattedDateStr = `${day}/${month}/${year}`;
    return formattedDateStr;
}


/**
 * checks if the searchUser input is filled and pushes the info to the function searchuser()
 */
function searchUsers() {
    let timeout;
    document.getElementById('searchUser').addEventListener('input', function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            searchUser(this.value);
        }, 300);
    })
};


/**
 * filters the dropdown users by the input and only shows the users that matches the input
 * 
 * @param {string} input the input the user writes in searchUser ID
 */
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


/**
 * pushes the current taskAllArray into the local storage Array
 */
function save() {
    taskAllArray.push(task);
    let tasksAsText = JSON.stringify(taskAllArray);
    localStorage.setItem('taskAllArray', tasksAsText);
}


/**
 * loads the current Array from the local storage in the taskAllArray
 */
function load() {
    let tasksAsText = localStorage.getItem('taskAllArray');
    if (tasksAsText) {
        taskAllArray = JSON.parse(tasksAsText);
    }
}


/**
 * This Functions shows a box to the user that the task has been added
 */
function showSuccessTask() {
    document.getElementById('taskSuccessAdd').classList.remove('dNone');
    setTimeout(function () {
        document.querySelector('.taskSuccessAdd').classList.add('taskSuccessAdded');
    }, 10);
}


/**
 * This functions sends the user to the board.html
 */
function goToBoard() {
    setTimeout(function () {
        window.location.href = 'board.html';
    }, 1500);
}