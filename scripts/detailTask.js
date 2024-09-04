let editedTaskArrays = [
  {
    'category': '',
    'date': '',
    'description': '',
    'id': '',
    'prio': '/assets/icons/prioMedium.png',
    'prioName': 'Medium',
    'section': 'toDo',
    'subtasks': [],
    'subtasksCheck': [],
    'title': '',
    'assignedInitals': [],
    'assignedName': [],
    'color': [],
  },
];


let editedTaskArray = editedTaskArrays[0];


function showTaskDetail(taskIndex) {
  let task = taskAllArray[taskIndex];
  let taskDetailsHTML = generateTaskDetails(task, taskIndex);
  let taskContent = document.getElementById("taskDetailCard");
  if (taskContent) {
    taskContent.innerHTML = taskDetailsHTML;
  }
  let subtasksElement = document.getElementById("subtasksDetail");
  if (subtasksElement && Array.isArray(task.subtasks) && task.subtasks.length > 0) {
    subtasksElement.innerHTML = renderSubtasks(taskIndex, task);
    calculateSubtaskProgress(taskIndex);
  }
  toggleTask();
}


function toggleTask() {
  let taskDetailContainer = document.getElementById("containerTasksDetail");
  taskDetailContainer.classList.toggle("d-none");
}

function renderSubtasks(taskIndex, task) {
  let subtasks = task.subtasks || [];
  let subtasksCheck = task.subtasksCheck || [];

  // Filtere leere oder undefinierte Subtasks heraus
  let validSubtasks = subtasks.filter(subtask => subtask && subtask.trim() !== "");

  // Falls keine gültigen Subtasks vorhanden sind
  if (!validSubtasks.length) return "<p>No subtasks available.</p>";

  return validSubtasks.map((subtask, validIndex) => {
    let isChecked = subtasksCheck[validIndex] || false;
    let imageSrc = isChecked
      ? "/assets/icons/checkButtonChecked.png"
      : "/assets/icons/checkButtonblank.png";
    return `
      <div class="subtask">
        <img src="${imageSrc}" id="subtask-image-${taskIndex}-${validIndex}" class="custom-checkbox" onclick="toggleSubtaskImage(${taskIndex}, ${validIndex})" alt="Subtask Status">
        <span>${subtask}</span>
      </div>`;
  }).join("");
}


function toggleSubtaskImage(taskIndex, subtaskIndex) {
  let task = taskAllArray[taskIndex];
  if (!task || !Array.isArray(task.subtasksCheck)) return console.error('Invalid task data', taskIndex);

  task.subtasksCheck[subtaskIndex] = !task.subtasksCheck[subtaskIndex];
  let image = document.getElementById(`subtask-image-${taskIndex}-${subtaskIndex}`);
  if (image) {
    image.src = task.subtasksCheck[subtaskIndex]
      ? "/assets/icons/checkButtonChecked.png"
      : "/assets/icons/checkButtonblank.png";
  }

  saveTasksToLocalStorage();
  let { subtaskBarWidth, completedSubtasks, amountSubtasks } = calculateSubtaskProgress(taskIndex);
  updateSubtaskProgressBar(taskIndex, subtaskBarWidth, completedSubtasks, amountSubtasks);
}


function updateSubtaskProgressBar(taskIndex, subtaskBarWidth, completedSubtasks, amountSubtasks) {
  let subtaskBar = document.getElementById(`subtaskBar${taskIndex}`);
  let subtaskCount = document.getElementById(`subtaskCount${taskIndex}`);

  if (subtaskBar) {
    subtaskBar.style.width = `${subtaskBarWidth}%`;
  }

  if (subtaskCount) {
    subtaskCount.innerText = `${completedSubtasks}/${amountSubtasks} Subtasks`;
  }
}


function deleteTask(taskIndex) {
  taskAllArray.splice(taskIndex, 1);
  saveTasksToLocalStorage();
  toggleTask();
  renderAllTasks();
}


function editTask(taskIndex) {
  let task = taskAllArray[taskIndex];
  let date = changeDateFormatEdit(task.date);
  console.log(date);
  
  setTimeout(() => {
    editTaskTemplate(task, date, taskIndex);
  }, 100);
  setTimeout(() => {
    setpriorityButton(task);
    getusers();
    setAssignedUsers(task);
  }, 150);
}


function changeDateFormatEdit(dateGerman) {
  let [year, month, day] = dateGerman.split("/");
  let formattedDateStr = `${day}-${month}-${year}`;
  return formattedDateStr;
}

/**
 * Changes Date format from Input to German format
 * 
 * @returns formatted Date in German
 */
function changeDateFormat(dateEnglish) {
  let formattedDate = dateEnglish.replace(/-/g, '/');
  let [year, month, day] = formattedDate.split('/');
  let formattedDateStr = `${day}/${month}/${year}`;
  return formattedDateStr;
}


function toggleUserDropdownEdit() {
  let dropdown = document.getElementById("dropdown");
  let dropdownUsers = document.getElementById("dropdownUsers");
  dropdown.classList.toggle("dNone");
  dropdownUsers.classList.toggle("dNone");
  document.getElementById("searchUser").focus();
}


function setpriorityButton(task) {
  resetprioButtons();
  if (task.prioName === "Low") {
    setPrioLowEdit();
  }
  if (task.prioName === "Urgent") {
    setPrioHighEdit();
  }
  if (task.prioName === "Medium") {
    setPrioMediumEdit();
  }
}


function setPrioHighEdit() {
  resetprioButtons()
  document.getElementById('prio0').classList.add('high', 'active');
  document.getElementById('prioHigh').src = "../assets/icons/prioUrgentWhite.png";
}


function setPrioMediumEdit() {
  resetprioButtons()
  document.getElementById('prio1').classList.add('medium', 'active');
  document.getElementById('prioMed').src = "../assets/icons/prioMediumWhite.png";
}


function setPrioLowEdit() {
  resetprioButtons()
  document.getElementById('prio2').classList.add('low', 'active');
  document.getElementById('prioLow').src = "../assets/icons/prioLowWhite.png";
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


function subtaskEdit(i) {
  document.getElementById(`subtaskBoxEdit${i}`).classList.remove('dNone');
  document.getElementById(`subtaskBox${i}`).classList.add('dNone');
}


function saveEditedTasktoLocalStorage(taskIndex) {
  setEditedArray(taskIndex);
  if (!checkInputs()) {
    return;
  }
  saveToCurrentTask(taskIndex);
  toggleTask();
  renderAllTasks();
  showTaskDetail(taskIndex);
}


function saveToCurrentTask(taskIndex) {
  taskAllArray[taskIndex] = { ...editedTaskArray };
  saveTasksToLocalStorage();
}


function setEditedArray(taskIndex) {
  initializeEditedTaskArray();
  updateAssignedUsers();
  updateTaskDetails(taskIndex);
  updateSubtasks(taskIndex);
  updateTaskPriority();
}


function initializeEditedTaskArray() {
  editedTaskArray['assignedName'] = [];
  editedTaskArray['assignedInitals'] = [];
  editedTaskArray['color'] = [];
  document.getElementById('taskDetailCard').classList.remove('initalsAndName');
}


function updateAssignedUsers() {
  let users = document.getElementsByClassName('dropdownButton');
  for (let i = 0; i < users.length; i++) {
    let check = document.getElementById(`assignedCheck${i}`);
    let currentCheck = check.src.split('/').pop();
    if (users[i].classList.contains('dropdownButtonSelectedUser') && currentCheck !== "checkButtonBlank.png") {
      editedTaskArray['assignedName'].push(document.getElementById(`searchUserName${i}`).innerText);
      editedTaskArray['assignedInitals'].push(document.getElementById(`userCircle${i}`).innerText);
      editedTaskArray['color'].push(document.getElementById(`userCircle${i}`).style.backgroundColor);
    }
  }
}


function updateTaskDetails(taskIndex) {
  let taskDate = taskAllArray[taskIndex].date;
  editedTaskArray['section'] = taskAllArray[taskIndex].section;
  editedTaskArray['category'] = taskAllArray[taskIndex].category;
  editedTaskArray['date'] = changeDateFormat(taskDate);
  editedTaskArray['description'] = document.getElementById('descriptionInput').value;
  editedTaskArray['id'] = `${taskIndex}`;
  editedTaskArray['title'] = document.getElementById('titleInput').value;
}


function updateSubtasks(taskIndex) {
  let task = taskAllArray[taskIndex];
  if (document.getElementById('subtask0')) {
    editedTaskArray['subtasks'][0] = (document.getElementById('subtask0').innerText);
    let checked = task.subtasksCheck[0];
    editedTaskArray['subtasksCheck'][0] = checked;
    if (document.getElementById('subtask1')) {
      editedTaskArray['subtasks'][1] = (document.getElementById('subtask1').innerText);
      let checked = task.subtasksCheck[1];
      editedTaskArray['subtasksCheck'][1] = checked;
    }
  }
}


function updateTaskPriority() {
  let prioButtons = document.getElementsByClassName('prioButtonEdit');
  for (let j = 0; j < prioButtons.length; j++) {
    let prioButton = prioButtons[j];
    if (prioButton.classList.contains('active')) {
      editedTaskArray['prioName'] = prioButton.innerText;
      editedTaskArray['prio'] = `/assets/icons/prio${prioButton.innerText}.png`;
    }
  }
}


function deleteSubtaskEdit(taskIndex, subtaskIndex) {
  let task = taskAllArray[taskIndex];
  if (task) {
    task.subtasks.splice(subtaskIndex, 1);
    task.subtasksCheck.splice(subtaskIndex, 1);

    //synchronizeSubtasksAndChecks(task);
    saveTasksToLocalStorage();
    calculateSubtaskProgress(taskIndex);

    let subtasksElement = document.getElementById("subtasksDetail");
    if (subtasksElement) {
      subtasksElement.innerHTML = renderSubtasks(taskIndex, task);
    }
    editTask(taskIndex);
  } else {
    console.error('Task not found for deletion at index:', taskIndex);
  }
  saveEditedTasktoLocalStorage(taskIndex);
}


/*function synchronizeSubtasksAndChecks(task) {
  while (task.subtasksCheck.length > task.subtasks.length) {
    task.subtasksCheck.pop();
  }
  while (task.subtasksCheck.length < task.subtasks.length) {
    task.subtasksCheck.push(false);
  }
}*/


function subtaskChange(taskIndex, i) {
  let task = taskAllArray[taskIndex];
  if (task) {
    let input = document.getElementById(`subtaskEdit${i}`).value.trim();
    if (input) {
      task.subtasks.splice(i, 1, input);
      task.subtasksCheck.splice(i, 1, false);
      saveTasksToLocalStorage();
      calculateSubtaskProgress(taskIndex);
      editTask(taskIndex);
    } else {
      console.warn('Empty subtask description. Consider deleting instead.');
    }
  } else {
    console.error('Task not found for subtask change at index:', taskIndex);
  }
}


function editTaskTemplate(task, date, taskIndex) {
  let subtask0 = task.subtasks[0] ? task.subtasks[0] : '';
  let subtask1 = task.subtasks[1] ? task.subtasks[1] : '';

  document.getElementById("taskDetailCard").innerHTML = /*html*/ `
    <div class="detailtaskEdit">
      <div class="closeTaskContainer">
        <img class="closeTask" onclick="toggleTask()" src="/assets/icons/close.png" alt="Close">
      </div>
      <p class="titleEdit">Title</p>
      <input id="titleInput" class="titleInput" placeholder="Enter a Title" value="${task.title}" type="text" required>
      <span class="inputError" id="inputerror1">This field is required</span>
      
      <p class="descriptionEdit">Description</p>
      <textarea class="descriptionInput" id="descriptionInput" placeholder="Enter a Description">${task.description}</textarea>

      <p>Due Date</p>
      <div class="dueDate">
        <input id="dueDateInput" class="dateInput" type="date" min="" value="${date || today}" required>
        <img class="calendar" src="../assets/icons/calendar.png">
      </div>
      <span class="inputError" id="inputerror2">This field is required</span>

      <p class="priorityEdit"><b>Priority</b></p>
      <div class="prio">
        <div id="prio0" class="prioButtonEdit" onclick="setPrioHighEdit()">Urgent
          <img id="prioHigh" src="../assets/icons/prioUrgent.png">
        </div>
        <div id="prio1" class="prioButtonEdit" onclick="setPrioMediumEdit()">Medium
          <img id="prioMed" src="../assets/icons/prioMedium.png">
        </div>
        <div id="prio2" class="prioButtonEdit" onclick="setPrioLowEdit()">Low
          <img id="prioLow" src="../assets/icons/prioLow.png">
        </div>
      </div>
      
      <p>Assigned to</p>
      <div class="dropdownWrapper"></div>
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

      <div class="subtasksDetail" id="subtasksDetail"></div>
      <div class="subtasksContainer">
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
        <span class="inputError dNone" id="inputerrorSubtask1">Subtask needs Description</span>
        <span class="inputError dNone" id="inputerrorSubtask2">Max 2 Subtasks allowed</span>
        <div class="subtasksBox" id="subtasksBox">
          <div id="subtaskBox0" onmouseover="onmouse('0')" onmouseout="outmouse('0')" class="subtaskBox">
            <ul>
              <li id="subtask0">${subtask0}</li>
              <div id="subtaskIconsLower0" class="subtaskIconsLower dNone">
                <img class="subtaskIcon" onclick="subtaskEdit(0)" src="../assets/icons/edit.png">
                <div class="smallSeparator"></div>
                <img class="subtaskIcon" onclick="deleteSubtaskEdit(${taskIndex}, 0)" src="../assets/icons/delete.png">
              </div>
            </ul>
          </div>

          <div id="subtaskBox1" onmouseover="onmouse('1')" onmouseout="outmouse('1')" class="subtaskBox">
            <ul>
              <li id="subtask1">${subtask1}</li>
              <div id="subtaskIconsLower1" class="subtaskIconsLower dNone">
                <img class="subtaskIcon" onclick="subtaskEdit(1)" src="../assets/icons/edit.png">
                <div class="smallSeparator"></div>
                <img class="subtaskIcon" onclick="deleteSubtaskEdit(${taskIndex}, 1)" src="../assets/icons/delete.png">
              </div>
            </ul>
          </div>

          <div id="subtaskBoxEdit0" class="subtaskBox dNone">
            <div class="dFlexAlign backgroundWhite">
              <input id="subtaskEdit0" value="${subtask0}" class="editSubtaskInput">
              <div class="subtaskIconsLower">
                <img class="subtaskIcon" onclick="deleteSubtaskEdit(${taskIndex}, 0)" src="../assets/icons/delete.png">
                <div class="smallSeparator"></div>
                <img class="subtaskIcon" src="../assets/icons/check.png" onclick="subtaskChange(${taskIndex}, 0)">
              </div>
            </div>
          </div>

          <div id="subtaskBoxEdit1" class="subtaskBox dNone">
            <div class="dFlexAlign backgroundWhite">
              <input id="subtaskEdit1" value="${subtask1}" class="editSubtaskInput">
              <div class="subtaskIconsLower">
                <img class="subtaskIcon" onclick="deleteSubtaskEdit(${taskIndex}, 1)" src="../assets/icons/delete.png">
                <div class="smallSeparator"></div>
                <img class="subtaskIcon" src="../assets/icons/check.png" onclick="subtaskChange(${taskIndex}, 1)">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="okButtonContainer">
        <button onclick="saveEditedTasktoLocalStorage(${taskIndex})" class="okButton">Ok<img src="/assets/icons/checkWhite.png"></button>
      </div>
    </div>
  `;
}


/**
* A different path is used depending on which ID is transferred. This is used to exchange icons.
* 
* @param {*} id 
*/
function outmouse(subtaskID) {
  document.getElementById(`subtaskIconsLower${subtaskID}`).classList.add('dNone')
}


/**
* A different path is used depending on which ID is transferred. This is used to exchange icons.
* 
* @param {*} id 
*/
function onmouse(subtaskID) {
  document.getElementById(`subtaskIconsLower${subtaskID}`).classList.remove('dNone')
}



//// Leere SubtaskBox ausblenden!!
//// Required wird bei Add Task Dropdown User überschrieben
//// + Dinger (Add Task) brauchen Hover Effekt in blau = 100 verschiedene sepia etc
//// Delete Subtask im EditBoard geht nicht
//// CSS Responsive und EditBoard