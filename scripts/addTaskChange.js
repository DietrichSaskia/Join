/**
 * Sets the priority in the Array[task] to high and colors the button
 * 
 * @param {Array} task The array that is used to temporarily save all inputs
 */
function setPrioHigh(task) {
    resetprioButtons()
    document.getElementById('prio0').classList.add('high', 'active');
    document.getElementById('prioHigh').src = "../assets/icons/prioUrgentWhite.png";
    task['prio'] = '../assets/icons/prioUrgent.png';
    task['prioName'] = 'Urgent';
}


/**
 * Sets the priority in the Array[task] to medium and colors the button
 * 
 * @param {Array} task The array that is used to temporarily save all inputs
 */
function setPrioMedium(task) {
    resetprioButtons()
    document.getElementById('prio1').classList.add('medium', 'active');
    document.getElementById('prioMed').src = "../assets/icons/prioMediumWhite.png";
    task['prio'] = '../assets/icons/prioMedium.png';
    task['prioName'] = 'Medium';
}


/**
 * This function sets the priority in the Array[task] to low and colors the button
 * 
 * @param {Array} task The array that is used to temporarily save all inputs
 */
function setPrioLow(task) {
    resetprioButtons()
    document.getElementById('prio2').classList.add('low', 'active');
    document.getElementById('prioLow').src = "../assets/icons/prioLowWhite.png";
    task['prio'] = '../assets/icons/prioLow.png';
    task['prioName'] = 'Low';
}


/**
 * Resets all priority buttons to normal with no colors
 */
function resetprioButtons() {
    document.getElementById('prio0').classList.remove('high', 'active');
    document.getElementById('prio1').classList.remove('medium', 'active');
    document.getElementById('prio2').classList.remove('low', 'active');
    document.getElementById('prioHigh').src = "../assets/icons/prioUrgent.png";
    document.getElementById('prioMed').src = "../assets/icons/prioMedium.png";
    document.getElementById('prioLow').src = "../assets/icons/prioLow.png";
}


/**
 * Checks the Button of a User in the dropdown Menu
 * 
 * @param {*} i The index of the Button
 */
function toggleAssignedUser(i) {
    let buttonChecked = "../assets/icons/checkButtonMobile.png";
    let buttonUnchecked = "../assets/icons/checkButtonblank.png";
    let check = document.getElementById(`assignedCheck${i}`);
    let checkedImg = check.src
    if (check) {
        let currentCheck = check.src.split('/').pop();
        document.getElementById(`user${i}`).classList.toggle('dropdownButtonSelectedUser');
        check.src = currentCheck === 'checkButtonMobile.png' ? buttonUnchecked : buttonChecked;
        toggleAssignedUserCircle(i);
    }


/**
 * This function is fancy
 * 
 * @param {number} i Index of the Button of the assigned User Dropdown
 */
function toggleAssignedUserCircle(i) {
        let visibleUserCircles = countVisibleUserCircles();
        if (visibleUserCircles <= 4) {
            if (!checkedImg.includes("checkButtonMobile.png")) {
                document.getElementById(`userCircle${i}`).classList.remove('dNone')
            }
            else {
                document.getElementById('extraUsers').classList.add('dNone');
                document.getElementById(`userCircle${i}`).classList.add('dNone')
            }}
        else if (visibleUserCircles > 4) {
            document.getElementById('extraUsers').classList.remove('dNone');
            document.getElementById('extraUsers').innerHTML = `+${visibleUserCircles - 4}`;
        }}};


function countVisibleUserCircles() {
    let count = 0;
    for (let i = 0; i < contactAllArray.length; i++) {
        let check = document.getElementById(`assignedCheck${i}`);
        let checkedImg = check.src;
        if (checkedImg.includes("checkButtonMobile.png")) {
            count++;
        }
    }
    return count;
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
 * Checks if there are already 2 subtasks and shows an error message if the user tries to create a third
 */
function checkSubtask() {
    let input = document.getElementById('subtasksInput').value;
    document.getElementById('inputerrorSubtask1').style.display = 'none';
    document.getElementById('inputerrorSubtask2').style.display = 'none';
    document.getElementById('subtasksInput').classList.remove('redInputBorder');
    if (input.length === 0) {
        document.getElementById('inputerrorSubtask1').style.display = 'block';
        document.getElementById('subtasksInput').classList.add('redInputBorder');
    }
    else {
        createSubtask(input)
    }
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
        return false;
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
        return false;
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
    if (!document.getElementById('category')) {
        return true
    }
    if (document.getElementById('category').innerText === 'Select task category') {
        document.getElementById('inputerror3').style.display = 'block';
        checked = false;
        return false;
    }
    else {
        document.getElementById('inputerror3').style.display = 'none';
        return true;
    }
}


/**
 * Deletes a subtask box and removes the value from the array
 * 
 * @param {number} i The number of the subtask box
 */
function deleteSubtask(i) {
    task['subtasks'][i] = "";
    document.getElementById(`subtaskBox${i}`).remove();
}


/**
 * Deletes a subtask box
 * 
 * @param {number} i The number of the subtask box
 */
function clearSubtask(i) {
    if (document.getElementById(`subtaskBox${i}`)) {
        task['subtasks'][i] = "";
        document.getElementById(`subtaskBox${i}`).remove();
    }
}


/**
 * removes the subtaskbox and replaces it with a box with the same structure but with with an input field
 * 
 * @param {number} i The number of the subtask box
 */
function editSubtask(i) {
    let info = task['subtasks'][i];
    document.getElementById(`subtaskBox${i}`).remove();
    putSubTaskInput(info, i);
    let input = document.getElementById(`subtask${i}`);
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
}


/**
 * changes the new imput on the subtask box with input to the normal subtask box
 * 
 * @param {number} i The number of the subtask box
 */
function changeSubtask(i) {
    let input = document.getElementById(`subtask${i}`).value;
    document.getElementById(`subtaskBox${i}`).remove();
    putSubTask(input, i);
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
 * Toggles the category dropdown menu
 */
function toggleCategory() {
    let dropdown = document.getElementById("dropdownCategory");
    dropdown.classList.toggle("dNone");
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