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
        'subTasks': [],
        'title': '',
        'assignedInitals': [],
        'assignedName': [],
        'color': [],
    },
];
let task = tasks[0];
let taskAllArray = [];


/**
 * Loads the initial tasks for the addTask.html
 */
function loadFunctions() {
    loadAddTaskComplete('mainContent');
    activateprioButton(1);
    loadMembers();
    searchUsers();
    load();
}


document.addEventListener('focusout', (event) => {
    if (event.target && event.target.id === 'subtasksInput') {
        showSubtaskIcons();
    }
});


if (dateInput) {
    dateInput.addEventListener('input', function () {
        if (dateInput.value) {
            dateInput.classList.add('has-value');
        } else {
            dateInput.classList.remove('has-value');
        }
    });
}


document.addEventListener('dblclick', function (dblclickEvent) {
    let subTaskInput0 = document.getElementById("subTaskBox0");
    let subTaskInput1 = document.getElementById("subTaskBox1");
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


/**
 * Sets the priority in the Array[task] to high and colors the button
 * 
 * @param {Array} task The array that is used to temporarily save all inputs
 */
function setPrioHigh(task) {
    document.getElementById('prio0').classList.add('high', 'active');
    document.getElementById('prioHigh').src = "../assets/icons/prioHighWhite.png";
    task['prio'] = '/assets/icons/prioHigh.png';
    task['prioName'] = 'High';
}


/**
 * Sets the priority in the Array[task] to medium and colors the button
 * 
 * @param {Array} task The array that is used to temporarily save all inputs
 */
function setPrioMedium(task) {
    document.getElementById('prio1').classList.add('medium', 'active');
    document.getElementById('prioMed').src = "../assets/icons/prioMediumWhite.png";
    task['prio'] = '/assets/icons/prioMedium.png';
    task['prioName'] = 'Medium';
}


/**
 * This function sets the priority in the Array[task] to low and colors the button
 * 
 * @param {Array} task The array that is used to temporarily save all inputs
 */
function setPrioLow(task) {
    document.getElementById('prio2').classList.add('low', 'active');
    document.getElementById('prioLow').src = "../assets/icons/prioLowWhite.png";
    task['prio'] = '/assets/icons/prioLow.png';
    task['prioName'] = 'Low';
}


/**
 * Resets all priority buttons to normal with no colors
 */
function resetprioButtons() {
    document.getElementById('prio0').classList.remove('high', 'active');
    document.getElementById('prio1').classList.remove('medium', 'active');
    document.getElementById('prio2').classList.remove('low', 'active');
    document.getElementById('prioHigh').src = "../assets/icons/prioHigh.png";
    document.getElementById('prioMed').src = "../assets/icons/prioMedium.png";
    document.getElementById('prioLow').src = "../assets/icons/prioLow.png";
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
    let nameParts = user.name.split(' ');
    let initials = nameParts.slice(0, 2).map(part => part.charAt(0).toUpperCase()).join('');
    renderAssignedTo(user, initials, i);
    renderAssignedUser(user, initials, i);
}


/**
 * Renders the dropdown button for 1 user
 * 
 * @param {Object} user The individual User in the Array
 * @param {string} initials The initials of the User
 * @param {number} i The index of the Object in the Array, used to set the ID of the Button
 */
function renderAssignedTo(user, initials, i) {
    document.getElementById('dropdownUsers').innerHTML += /*html*/`
        <div class="dropdownButton" id="user${i}" onclick="toggleAssignedUser(${i})">
            <div class="dropdownUser">
                <div class="userCircle" style="background-color:${user.color};">${initials}</div>
                <div class="searchUserName" id="searchUserName${i}">${user.name}</div>
            </div>
            <img id="assignedCheck${i}" class="dropdownCheckMark" src="../assets/icons/checkButtonblank.png" type="checkbox">
          </div>
    `
}


/**
 * Renders the circle user icon
 * 
 * @param {*} user The individual User in the Array
 * @param {*} initials The initials of the User
 * @param {*} i The index of the Object in the Array, used to set the ID of the Button
 */
function renderAssignedUser(user, initials, i) {
    document.getElementById('assignedUsers').innerHTML += /*html*/`
        <div class="userCircle dNone" id="userCircle${i}" style="background-color:${user.color};">${initials}</div>
    `
}


/**
 * Checks the Button of a User in the dropdown Menu
 * 
 * @param {*} i The index of the Button
 */
function toggleAssignedUser(i) {
    let buttonChecked = "/assets/icons/checkButtonMobile.png";
    let buttonUnchecked = "../assets/icons/checkButtonblank.png";
    let check = document.getElementById(`assignedCheck${i}`);
    let currentCheck = check.src.split('/').pop();
    document.getElementById(`user${i}`).classList.toggle('dropdownButtonSelectedUser');
    document.getElementById(`userCircle${i}`).classList.toggle('dNone');
    check.src = currentCheck === 'checkButtonMobile.png' ? buttonUnchecked : buttonChecked;
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
 * Sets the category userstory as category
 * 
 * @param {id} userstory The button User Story
 * @param {id} techTask The button Technical Task
 */
function selectUserStory(userstory, techTask) {
    userstory.classList.toggle('dropdownButtonSelected');
    techTask.classList.remove('dropdownButtonSelected');
    document.getElementById('category').innerHTML = "User Story";
}


/**
 * Sets the category userstory as Technical Task
 * 
 * @param {id} userstory The button User Story
 * @param {id} techTask The button Technical Task
 */
function selectTechTask(userstory, techTask) {
    techTask.classList.toggle('dropdownButtonSelected');
    userstory.classList.remove('dropdownButtonSelected');
    document.getElementById('category').innerHTML = "Technical Task";
}


/**
 * Clears the category Input
 * 
 * @param {id} userstory The button User Story
 * @param {id} techTask The button Technical Task
 */
function clearCategory() {
    document.getElementById('userStory').classList.remove('dropdownButtonSelected');
    document.getElementById('techTask').classList.remove('dropdownButtonSelected');
    document.getElementById('category').innerHTML = "Select task category";
}


/**
 * Toggles the users dropdown menu
 */
function toggleUserDropdown() {
    let dropdown = document.getElementById("dropdown");
    let dropdownUsers = document.getElementById("dropdownUsers");
    dropdown.classList.toggle("dNone");
    dropdownUsers.classList.toggle("dNone");
    document.getElementById('searchUser').focus();
}


/**
 * Toggles the category dropdown menu
 */
function toggleCategory() {
    let dropdown = document.getElementById("dropdownCategory");
    dropdown.classList.toggle("dNone");
}


/**
 * Activates the Buttons beside the subtask input field
 */
function showSubtaskIcons() {
    setTimeout(function () {
        document.getElementById('subtaskActive').classList.toggle('dNone');
        document.getElementById('subtaskInactive').classList.toggle('dNone');
    }, 200);
}


/**
 * Sets the focus on the subtask input field
 */
function showSubtask() {
    document.getElementById('subtasksInput').focus();
}


/**
 * Checks if there are already 2 subtasks and shows an error message if the user tries to create a third
 */
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


/**
 * Pushes the subtask input field into the task Array and puts it into a subtaskbox
 * 
 * @param {string} input The value of the subtask input
 */
function createSubtask(input) {
    if (task['subTask'][0] === null || task['subTask'].length === 0) {
        putSubTask(input, 0);
        task['subTask'].splice(0, 1, input);
        clearSubtaskInput(0);
    }
    else if (task['subTask'][1] === null || task['subTask'].length === 1) {
        putSubTask(input, 1);
        task['subTask'].splice(1, 1, input);
        clearSubtaskInput(1);
    }
    else {
        document.getElementById('inputerrorSubTask2').style.display = 'block';
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
 * renders a subtask box below the subtask input
 * 
 * @param {string} input The value of the subtask input
 * @param {number} i The number of the subtask box
 */
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


/**
 * Deletes a subtask box and removes the value from the array
 * 
 * @param {number} i The number of the subtask box
 */
function deleteSubtask(i) {
    task['subTask'][i] = null;
    document.getElementById(`subTaskBox${i}`).remove();
}


/**
 * Deletes a subtask box
 * 
 * @param {number} i The number of the subtask box
 */
function clearSubtask(i) {
    if (document.getElementById(`subTaskBox${i}`)) {
        document.getElementById(`subTaskBox${i}`).remove();
    }
}


/**
 * removes the subtaskbox and replaces it with a box with the same structure but with with an input field
 * 
 * @param {number} i The number of the subtask box
 */
function editSubtask(i) {
    let info = task['subTask'][i];
    document.getElementById(`subTaskBox${i}`).remove();
    putSubTaskInput(info, i);
    let input = document.getElementById(`subTask${i}`);
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
}


/**
 * renders a subtask box below the subtask with an input field
 * 
 * @param {string} input The value of the subtask input
 * @param {number} i The number of the subtask box
 */
function putSubTaskInput(input, i) {
    document.getElementById('subTasksBox').innerHTML += /*html*/`
    <div id="subTaskBox${i}" class="subTaskBox">
        <div class="dFlexAlign backgroundWhite">
            <input id="subTask${i}" value="${input}" class="editSubtaskInput">
            <div class="subtaskIconsLower">
                <img class="subtaskIcon" onclick="deleteSubtask(${i})" src="../assets/icons/delete.png">
                <div class="smallSeparator"></div>
                <img class="subtaskIcon" src="../assets/icons/check.png" onclick="changeSubtask(${i})">
            </div>
        </div>
    </div>
    `
}


/**
 * changes the new imput on the subtask box with input to the normal subtask box
 * 
 * @param {number} i The number of the subtask box
 */
function changeSubtask(i) {
    let input = document.getElementById(`subTask${i}`).value;
    document.getElementById(`subTaskBox${i}`).remove();
    putSubTask(input, i);
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
    checked = checkInput1(checked);
    checked = checkInput2(checked);
    checked = checkInput3(checked);
    return checked;
}


/**
 * validates input and shows an error message if not true
 * 
 * @returns true if input is validated / false if not 
 */
function checkInput1() {
    if (document.getElementById('titleInput').value === "") {
        document.getElementById('inputerror1').style.display = 'block';
        document.getElementById('titleInput').classList.add('redInputBorder');
        checked = false;
    }
    else {
        document.getElementById('inputerror1').style.display = 'none';
        return true;
    }
}


/**
 * validates input and shows an error message if not true
 * 
 * @returns true if input is validated / false if not 
 */
function checkInput2() {
    if (document.getElementById('dueDateInput').value === "") {
        document.getElementById('inputerror2').style.display = 'block';
        document.getElementById('dueDateInput').classList.add('redInputBorder');
        checked = false;
    }
    else {
        document.getElementById('inputerror2').style.display = 'none';
        return true;
    }
}


/**
 * validates input and shows an error message if not true
 * 
 * @returns true if input is validated / false if not 
 */
function checkInput3() {
    if (document.getElementById('category').innerText === 'Select task category') {
        document.getElementById('inputerror3').style.display = 'block';
        checked = false;
    }
    else {
        document.getElementById('inputerror3').style.display = 'none';
        return true;
    }
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
    let formattedDateStr = `${ day }/${month}/${ year }`;
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
    setTimeout(function() {
        document.querySelector('.taskSuccessAdd').classList.add('taskSuccessAdded');
    }, 10);
}


/**
 * This functions sends the user to the board.html
 */
function goToBoard() {
    setTimeout(function() {
        window.location.href = 'board.html';
    }, 1500);
}
// Füge normales Datum ins Array ein