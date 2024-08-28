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

    <p class="required"><span>*</span>This field is required</p>

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

    <div class="taskButtons">
      <button class="clearButton" onclick="clearAddTask()">Clear</button>
      <button class="createTaskButton" onclick="createTask()">Create Task</button>
    </div>

  </div>

  </form>
</section>
    `
}