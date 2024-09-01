function showTaskDetail(taskIndex) {
  let task = taskAllArray[taskIndex];
  renderTaskDetails(task, taskIndex);
  openTask();
}

function renderTaskDetails(task, taskIndex) {
  let taskContent = document.getElementById("taskDetailCard");
  taskContent.innerHTML = generateTaskDetailHTML(taskIndex);
  if (document.getElementById("subtasksDetail")) {
    document.getElementById("subtasksDetail").innerHTML = renderSubtasks(
      taskIndex,
      task
    );
    updateTaskProgress(taskIndex); // Fortschritt aktualisieren, nachdem Subtasks gerendert wurden
  }
}

function openTask() {
  document.getElementById("containerTasksDetail").classList.remove("d-none");
}

function closeTask() {
  document.getElementById("containerTasksDetail").classList.add("d-none");
}

function renderSubtasks(taskIndex, task) {
  let subtasks = task.subtasks;
  if (!subtasks || subtasks.length === 0) return "";

  let subtasksHTML = subtasks
    .map((subtask, subtaskIndex) => {
      let storageKey = `task-${taskIndex}-subtask-${subtaskIndex}`;
      let isChecked = localStorage.getItem(storageKey) === "true";
      let imageSrc = isChecked
        ? "/assets/icons/checkButtonChecked.png"
        : "/assets/icons/checkButtonblank.png";

      return `
      <div class="subtask">
        <img src="${imageSrc}" id="subtask-image-${taskIndex}-${subtaskIndex}" class="custom-checkbox" onclick="toggleSubtaskImage(${taskIndex}, ${subtaskIndex})" alt="Subtask Status">
        <span>${subtask}</span>
      </div>`;
    })
    .join("");

  return subtasksHTML;
}

function toggleSubtaskImage(taskIndex, subtaskIndex) {
  let storageKey = `task-${taskIndex}-subtask-${subtaskIndex}`;
  let image = document.getElementById(
    `subtask-image-${taskIndex}-${subtaskIndex}`
  );
  let isChecked = localStorage.getItem(storageKey) === "true";

  if (isChecked) {
    image.src = "/assets/icons/checkButtonblank.png";
    localStorage.setItem(storageKey, "false");
  } else {
    image.src = "/assets/icons/checkButtonChecked.png";
    localStorage.setItem(storageKey, "true");
  }

  updateTaskProgress(taskIndex);
}

function deleteTask(taskIndex) {
  taskAllArray.splice(taskIndex, 1);
  saveTasksToLocalStorage();
  closeTask();
  renderAllTasks();
}

function generateTaskDetailHTML(taskIndex) {
  let task = taskAllArray[taskIndex];
  let categoryClass = task.category
    ? task.category.replace(/\s+/g, "")
    : "default-category";
  if (!task.subtasks || task.subtasks === null) {
    return renderTaskDetailsNoSubtask(task, categoryClass, taskIndex);
  } else {
    return renderTaskDetailsSubtask(task, categoryClass, taskIndex);
  }
}

function generateInitalsAndNameDetailHTML(task) {
  if (!task.assignedInitals || task.assignedInitals.length === 0) return "";
  if (!task.assignedName || task.assignedName.length === 0) return "";
  if (!task.color || task.color.length === 0) return "";

  let detailHtml = "";

  task.assignedInitals.forEach((initial, index) => {
    let color = task.color[index];
    let name = task.assignedName[index];

    detailHtml += /*html*/ `
      <div class="intalsAndName">
        <div class="assignedInitals" style="background-color: ${color};">
          ${initial}
        </div>
        <div>
          ${name}
        </div>
      </div>
    `;
  });
  return detailHtml;
}

function renderTaskDetailsNoSubtask(task, categoryClass, taskIndex) {
  let initialsAndName = generateInitalsAndNameDetailHTML(task);

  return /*html*/ `
  <div class="detailtask">
    <div class="categoryAndClose">
      <div class="category ${categoryClass}">${task.category}</div>
      <img onclick="closeTask()" src="/assets/icons/close.png" alt="Close">
    </div>
    <div class="detailtaskinfos">
      <div class="titleDetail">${task.title}</div>
      <div class="descriptionDetail">${task.description}</div>
      <div>Due date: ${task.date}</div>
      <div>Priority: ${task.prioName} <img src="${task.prio}" alt="PriorityImage"></div>
      <div class="assignedTo"> Assigned To:</div>
        <div class="initalsAndName">
          ${initialsAndName}
        </div>
      <div class="iconContainer">
      <div class="detailTaskIcon">
        <img src="/assets/icons/delete.png" alt="">
        <p onclick="deleteTask(${taskIndex})">Delete</p>
      </div>
      <div class="verticalLine"></div>
      <div class="detailTaskIcon">
        <img src="/assets/icons/edit.png" alt="">
        <p onclick="editTask(${taskIndex})">Edit</p>
      </div>
    </div>
    </div>
  </div>
  `;
}

function renderTaskDetailsSubtask(task, categoryClass, taskIndex) {
  let initialsAndName = generateInitalsAndNameDetailHTML(task);

  return /*html*/ `
    <div class="detailtask">
      <div class="categoryAndClose">
        <div class="category ${categoryClass}">${task.category}</div>
        <img onclick="closeTask()" src="/assets/icons/close.png" alt="Close">
      </div>
      <div class="detailtaskinfos">
      <div class="titleDetail">${task.title}</div>
      <div class="descriptionDetail">${task.description}</div>
      <div>Due date: ${task.date}</div>
      <div>Priority: ${task.prioName} <img src="${task.prio}" alt="PriorityImage"></div>
      <div class="assignedTo"> Assigned To:</div>
        <div class="initalsAndName">
          ${initialsAndName}
        </div>
      <div>Subtasks:</div>
      <div class="subtasksDetail" id="subtasksDetail"></div>
      <div class="iconContainer">
        <div class="detailTaskIcon">
          <img src="/assets/icons/delete.png" alt="">
          <p onclick="deleteTask(${taskIndex})">Delete</p>
        </div>
        <div class="verticalLine"></div>
        <div class="detailTaskIcon">
          <img src="/assets/icons/edit.png" alt="">
          <p onclick="editTask(${taskIndex})">Edit</p>
        </div>
      </div>
    </div>
    `;
}

/**
 * Changes Date format from Input to English format
 *
 * @returns formatted Date in English
 */
function changeDateFormatEdit(dateGerman) {
  let [year, month, day] = dateGerman.split("/");
  let formattedDateStr = `${day}-${month}-${year}`;
  return formattedDateStr;
}

/**
 * Toggles the users dropdown menu
 */
function toggleUserDropdownEdit() {
  let dropdown = document.getElementById("dropdown");
  let dropdownUsers = document.getElementById("dropdownUsers");
  dropdown.classList.toggle("dNone");
  dropdownUsers.classList.toggle("dNone");
  document.getElementById("searchUser").focus();
}


function setpriorityButton(task) {
  if (task.prioName === 'Low') {
    activateprioButton(2)
  }
  if (task.prioName === 'High') {
    activateprioButton(0)
  }
  else {
    activateprioButton(1)
  }
}


function setAssignedUsers(task) {
  let users = task.assignedName;
  let allUsers = contactAllArray;
  for (let i = 0; i < allUsers.length; i++) {
    let allUser = allUsers[i].name;
    if (users.includes(allUser)) {
      toggleAssignedUser(i);
    }
  }
}


function editTask(taskIndex) {
  let task = taskAllArray[taskIndex];
  let date = changeDateFormatEdit(task.date);
  editTaskTemplate(task, date);
  setpriorityButton(task);
  timeout = setTimeout(() => {
    getusers(this.value);
    setAssignedUsers(task);
}, 200);
}


function editTaskTemplate(task, date) {
  document.getElementById("taskDetailCard").innerHTML = /*html*/ `
    <div class="detailtaskEdit">
        <img class="xButton" onclick="closeTask()" src="/assets/icons/close.png" alt="Close">
      
      <p>Title</p>
      <input id="titleInput" value="${task.title}" type="text" required>
      
      <p>Description</p>
      <textarea class="descriptionEdit" id="descriptionInput" >${task.description}</textarea>

      <p>Due Date</p>
      <div class="dueDate">
        <input id="dueDateInput" class="dateInput" type="date" min="" value="${date}" required>
        <img class="calendar" src="../assets/icons/calendar.png">
      </div>

      <p>Prio</p>
  
      <div class="prio">
  
        <div id="prio0" class="prioButtonEdit" onclick="activateprioButton(0)">Urgent
          <img id="prioHigh" src="../assets/icons/prioHigh.png">
        </div>
  
        <div id="prio1" class="prioButtonEdit" onclick="activateprioButton(1)">Medium
          <img id="prioMed" src="../assets/icons/prioMedium.png">
        </div>
  
        <div id="prio2" class="prioButtonEdit" onclick="activateprioButton(2)">Low
          <img id="prioLow" src="../assets/icons/prioLow.png">
        </div>
      </div>
      
      <p>Assigned to</p>
      <div class="dropdownWrapper">
      </div>
      <button type="button" class="dropdownButtonArea" id="userButton" onclick="toggleUserDropdownEdit()">Select Contacts
        to assign<img class="arrow" src="../assets/icons/arrowDrop.png"></button>
  
      <div class="dropdownWrapper">
        <div class="dropdown dNone" id="dropdown">
          <input id="searchUser" class="searchUser" type="search">
          <img class="upArrow" src="../assets/icons/arrowDrop.png" onclick="toggleUserDropdownEdit()">
          <div class="dropdownUsers dNone" id="dropdownUsers"></div>
        </div>
      </div>
  
      <div id="assignedUsers" class="assignedUsers"></div>
  
    </div>

      <div>Subtasks:</div>
      <div class="subtasksDetail" id="subtasksDetail"></div>
      <div class="iconContainer">

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
  
      
      
  
    </div>

        <button class="okButton"><img src="/assets/icons/checkWhite.png"></button>
      </div>
    </div>
    </div>
    `;
}

/*<div id="subTaskBox${task.subtasks[0]}" class="subTaskBox">
        <ul>
            <li id="subTask${task.subtasks[0]}">${task.subtasks[1]}</li>
            <div class="subtaskIconsLower">
                <img class="subtaskIcon" onclick="editSubtask(${i})" src="../assets/icons/edit.png">
                <div class="smallSeparator"></div>
                <img class="subtaskIcon" onclick="deleteSubtask(${i})" src="../assets/icons/delete.png">
            </div>
        </ul>
    </div>

    <div id="subTaskBox${task.subtasks[1]}" class="subTaskBox">
        <ul>
            <li id="subTask${task.subtasks[1]}">${task.subtasks[1]}</li>
            <div class="subtaskIconsLower">
                <img class="subtaskIcon" onclick="editSubtask(${i})" src="../assets/icons/edit.png">
                <div class="smallSeparator"></div>
                <img class="subtaskIcon" onclick="deleteSubtask(${i})" src="../assets/icons/delete.png">
            </div>
        </ul>
    </div>
      <div class="emptyBox"></div>  */
