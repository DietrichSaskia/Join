/**
 * This function loads the HTML-Code for the Load Task Site and the Load Task Function in the board.html
 * 
 */
function loadAddTaskComplete() {
  document.getElementById('mainContent').innerHTML = /*html*/`
<section class="wrapper">

  <h1>Add Task</h1>
  <img src="../assets/icons/close.png" class="xButton dNone" id="xButton"  onclick="closeAddTask2()">

  <form class="dFlex" onsubmit="return false" novalidate>
  <div class="taskForm">

    <p>Title<span>*</span></p>

    <input id="titleInput" placeholder="Enter a title" type="text" required>
    <span class="inputError" id="inputerror1">This field is required</span>


    <p>Description</p>
    <textarea class="description" id="descriptionInput" placeholder="Enter a Description"></textarea>


    <p>Assigned to</p>
    <div class="dropdownWrapper">
    </div>
    <button type="button" class="dropdownButtonArea" id="userButton" onclick="toggleUserDropdown()">Select Contacts
      to assign<img class="arrow" src="../assets/icons/arrowDrop.png"></button>

    <div class="dropdownWrapper">
      <div class="dropdown dNone" id="dropdown">
        <input id="searchUser" class="searchUser" type="search">
        <img class="upArrow" src="../assets/icons/arrowDrop.png" onclick="toggleUserDropdown()">
        <div class="dropdownUsers dNone" id="dropdownUsers"></div>
      </div>
    </div>

    <div id="assignedUsers" class="assignedUsers"></div>

  </div>


  <div class="taskSeperator"></div>


  <div class="taskForm">

    <p>Due Date<span>*</span></p>
    <div class="dueDate">
      <input id="dueDateInput" class="dateInput" type="date" required>
      <img class="calendar" src="../assets/icons/calendar.png">
    </div>
    <span class="inputError" id="inputerror2">This field is required</span>


    <p>Prio</p>

    <div class="prio">

      <div id="prio0" class="prioButton" onclick="activateprioButton(0)">Urgent
        <img id="prioHigh" src="../assets/icons/prioHigh.png">
      </div>

      <div id="prio1" class="prioButton" onclick="activateprioButton(1)">Medium
        <img id="prioMed" src="../assets/icons/prioMedium.png">
      </div>

      <div id="prio2" class="prioButton" onclick="activateprioButton(2)">Low
        <img id="prioLow" src="../assets/icons/prioLow.png">
      </div>

    </div>


    <p>Category<span>*</span></p>
    <button type="button" class="dropdownButtonArea" id="category" onclick="toggleCategory()">Select task
      category<img class="arrow" src="../assets/icons/arrowDrop.png"></button>
    <div class="dropdownWrapper">
      <div class="dropdowncat dNone" id="dropdownCategory">
        <div class="dropdownButton" id="techTask" onclick="selectCategory('Technical Task')">Technical Task</div>
        <div class="dropdownButton" id="userStory" onclick="selectCategory('User Story')">User Story</div>
      </div>
    </div>
    <span class="inputError" id="inputerror3">This field is required</span>


    <p class="subtaskHeadline">Subtasks</p>

    <input id="subtasksInput" placeholder="Add new subtask" onfocus="showSubtaskIcons()">

    <div class="subtaskIcons">
      <img class="subtaskIcon" id="subtaskInactive" src="../assets/icons/addNoBorder.png" onclick="showSubtask()">

      <div class="dNone dFlexAlign" id="subtaskActive">
        <img class="subtaskIcon" src="../assets/icons/close.png" onclick="clearSubtaskInput()">
        <div class="smallSeparator"></div>
        <img class="subtaskIcon" src="../assets/icons/check.png" onclick="checkSubtask()">
      </div>

    </div>

    <span class="inputError" id="inputerrorSubTask1">Subtask needs Description</span>
    <span class="inputError" id="inputerrorSubTask2">Max 2 Subtasks allowed</span>
    <div class="subTasksBox" id="subTasksBox"></div>

    <div class="emptyBox"></div>

  </div>

  <div class="addTaskBottomBar">
  <p class="required"><span>*</span>This field is required</p>
  <div class="taskButtons">
      <button class="clearButton" onclick="clearAddTask()">Clear</button>
      <button class="createTaskButton" onclick="createTask()">Create Task</button>
    </div>
  </div>

  </form>
</section>
    `
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