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
  
  if (subtasks.length === 0) return "";

  let subtasksHTML = subtasks.map((subtask, subtaskIndex) => {
    let isChecked = subtasksCheck[subtaskIndex] || false;
    let imageSrc = isChecked
      ? "/assets/icons/checkButtonChecked.png"
      : "/assets/icons/checkButtonblank.png";

    return `
    <div class="subtask">
      <img src="${imageSrc}" id="subtask-image-${taskIndex}-${subtaskIndex}" class="custom-checkbox" onclick="toggleSubtaskImage(${taskIndex}, ${subtaskIndex})" alt="Subtask Status">
      <span>${subtask}</span>
    </div>`;
  }).join("");

  return subtasksHTML;
}

function toggleSubtaskImage(taskIndex, subtaskIndex) {
  let task = taskAllArray[taskIndex];
  
  if (!task || !Array.isArray(task.subtasksCheck)) {
    console.error('Invalid task data or subtasksCheck missing at task index:', taskIndex);
    return;
  }
  task.subtasksCheck[subtaskIndex] = !task.subtasksCheck[subtaskIndex];
  let image = document.getElementById(`subtask-image-${taskIndex}-${subtaskIndex}`);
  if (image) {
    image.src = task.subtasksCheck[subtaskIndex] 
      ? "/assets/icons/checkButtonChecked.png" 
      : "/assets/icons/checkButtonblank.png";
  }
  saveTasksToLocalStorage();
  let progressData = calculateSubtaskProgress(taskIndex);
  updateSubtaskProgressBar(taskIndex, progressData.subtaskBarWidth, progressData.completedSubtasks, progressData.amountSubtasks);
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


function generateTaskDetails(task, taskIndex) {
  let categoryClass = formatCategoryClass(task.category);
  let initialsAndName = generateInitalsAndNameDetailHTML(task);
  let capitalizedTitle = task.title ? capitalizeFirstLetter(task.title) : "No Title";
  let capitalizedDescription = task.description ? capitalizeFirstLetter(task.description) : "No Description";
  let hasValidSubtasks = Array.isArray(task.subtasks) && task.subtasks.some(subtask => subtask && subtask.trim() !== "");
  let subtasksCheck = Array.isArray(task.subtasksCheck) && task.subtasksCheck.length === task.subtasks.length 
    ? task.subtasksCheck 
    : task.subtasks.map(() => false);

  return /*html*/ `
    <div class="detailtask">
      <div class="categoryAndClose">
        <div class="category ${categoryClass}">${task.category || "No Category"}</div>
        <img onclick="toggleTask()" src="/assets/icons/close.png" alt="Close">
      </div>
      <div class="detailtaskinfos">
        <div class="titleDetail">${capitalizedTitle}</div>
        <div class="descriptionDetail">${capitalizedDescription}</div>
        <div>Due date: ${task.date || 'No Date'}</div>
        <div>Priority: ${task.prioName ? task.prioName : 'No Priority'} <img src="${task.prio}" alt="PriorityImage"></div>
        <div class="assignedTo">Assigned To:</div>
        <div class="initalsAndName">${initialsAndName}</div>
        ${hasValidSubtasks ? `
        <div>Subtasks:</div>
        <div class="subtasksDetail" id="subtasksDetail">
          ${task.subtasks.map((subtask, index) => `
            <div class="subtaskItem">
              <input type="checkbox" ${subtasksCheck[index] ? 'checked' : ''} disabled>
              <span>${subtask || 'No Subtask'}</span>
            </div>
          `).join('')}
        </div>
        ` : ''}
      </div>
      <div onclick="deleteTask(${taskIndex})" class="iconContainer">
        <div class="detailTaskIcon">
          <img src="/assets/icons/delete.png" alt="Delete">
          <p>Delete</p>
        </div>
        <div class="verticalLine"></div>
        <div onclick="editTask(${taskIndex})" class="detailTaskIcon">
          <img src="/assets/icons/edit.png" alt="Edit">
          <p>Edit</p>
        </div>
      </div>
    </div>
  `;
}



function changeDateFormatEdit(dateGerman) {
  let [day, month, year] = dateGerman.split("/");
  if (!day || !month || !year) {
    console.error('Invalid date format.');
    return '';
  }
  return `${day}-${month}-${year}`;
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
  document.getElementById('prio0').classList.add('high', 'active');
  document.getElementById('prioHigh').src = "../assets/icons/prioUrgentWhite.png";
}

function setPrioMediumEdit() {
  document.getElementById('prio1').classList.add('medium', 'active');
  document.getElementById('prioMed').src = "../assets/icons/prioMediumWhite.png";
}
function setPrioLowEdit() {
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

function editTask(taskIndex) {
  let task = taskAllArray[taskIndex];
  let date = changeDateFormatEdit(task.date);
  setTimeout(() => {
    editTaskTemplate(task, date, taskIndex);
  }, 100);
  setTimeout(() => {
    setpriorityButton(task);
    getusers();
    setAssignedUsers(task);
  }, 150);
}


async function editTaskTemplate(task, date, taskIndex) {
  document.getElementById("taskDetailCard").innerHTML = /*html*/ `
    <div class="detailtaskEdit">
      <div class="closeTaskContainer">
        <img class="closeTask" onclick="toggleTask()" src="/assets/icons/close.png" alt="Close">
      </div>
      <p class="titleEdit">Title</p>
      <input id="titleInput"  class="titleInput" placeholder="Enter a Title" value="${task.title}" type="text" required>
      <span class="inputError" id="inputerror1">This field is required</span>
      
      <p class="descriptionEdit">Description</p>
      <textarea class="descriptionInput" id="descriptionInput" placeholder="Enter a Description" >${task.description}</textarea>

      <p>Due Date</p>
      <div class="dueDate">
        <input id="dueDateInput" class="dateInput" type="date" min="" placeholder="dd/mm/yyyy" value="${date}" required>
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
      <span class="inputError dNone" id="inputerrorSubtask1">Subtask needs Description</span>
      <span class="inputError dNone" id="inputerrorSubtask2">Max 2 Subtasks allowed</span>
      <div class="subtasksBox" id="subtasksBox">

      <div id="subtaskBox0" class="subtaskBox">
        <ul>
            <li id="subtask0">${task.subtasks[0]}</li>
            <div class="subtaskIconsLower">
                <img class="subtaskIcon" onclick="subtaskEdit(0)" src="../assets/icons/edit.png">
                <div class="smallSeparator"></div>
                <img class="subtaskIcon" onclick="deleteSubtaskEdit(${taskIndex}, 0)" src="../assets/icons/delete.png">
            </div>
        </ul>
    </div>

    <div id="subtaskBox1" class="subtaskBox">
        <ul>
            <li id="subtask1">${task.subtasks[1]}</li>
            <div class="subtaskIconsLower">
                <img class="subtaskIcon" onclick="subtaskEdit(1)" src="../assets/icons/edit.png">
                <div class="smallSeparator"></div>
                <img class="subtaskIcon" onclick="deleteSubtaskEdit(${taskIndex}, 1)" src="../assets/icons/delete.png">
            </div>
        </ul>
    </div>

    <div id="subtaskBoxEdit0" class="subtaskBox dNone">
        <div class="dFlexAlign backgroundWhite">
            <input id="subtaskEdit0" value="${task.subtasks[0]}" class="editSubtaskInput">
            <div class="subtaskIconsLower">
                <img class="subtaskIcon" onclick="deleteSubtaskEdit(${taskIndex}, 0)" src="../assets/icons/delete.png">
                <div class="smallSeparator"></div>
                <img class="subtaskIcon" src="../assets/icons/check.png" onclick="subtaskChange(${taskIndex}, 0)">
            </div>
        </div>
    </div>

    <div id="subtaskBoxEdit1" class="subtaskBox dNone">
        <div class="dFlexAlign backgroundWhite">
            <input id="subtaskEdit1" value="${task.subtasks[1]}" class="editSubtaskInput">
            <div class="subtaskIconsLower">
                <img class="subtaskIcon" onclick="deleteSubtaskEdit(${taskIndex}, 1)" src="../assets/icons/delete.png">
                <div class="smallSeparator"></div>
                <img class="subtaskIcon" src="../assets/icons/check.png" onclick="subtaskChange(${taskIndex}, 1)">
            </div>
        </div>
    </div>

      </div>


      </div>
      <button onclick="saveEditedTasktoLocalStorage(${taskIndex})" class="okButton"><img src="/assets/icons/checkWhite.png"></button>
    </div>
    `;
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
  taskAllArray[taskIndex] = { ...editedTaskArray }; // Verwende eine Kopie für saubere Referenz
  saveTasksToLocalStorage();
}


function setEditedArray(taskIndex) {
  initializeEditedTaskArray();
  updateAssignedUsers();
  updateTaskDetails(taskIndex);
  updateSubtasks();
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
  editedTaskArray['section'] = taskAllArray[taskIndex].section;
  editedTaskArray['category'] = taskAllArray[taskIndex].category;
  editedTaskArray['date'] = changeDateFormat();
  editedTaskArray['description'] = document.getElementById('descriptionInput').value;
  editedTaskArray['id'] = `${taskIndex}`;
  editedTaskArray['title'] = document.getElementById('titleInput').value;
}

function updateSubtasks() {
  if (document.getElementById('subtask0')) {
    editedTaskArray['subtasks'][0] = (document.getElementById('subtask0').innerText);
  }
  if (document.getElementById('subtask1')) {
    editedTaskArray['subtasks'][1] = (document.getElementById('subtask1').innerText);
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


function deleteSubtaskEdit(taskIndex, i) {
  let task = taskAllArray[taskIndex];
  if (task) {
    task.subtasks.splice(i, 1);
    task.subtasksCheck.splice(i, 1);
    saveTasksToLocalStorage();
    calculateSubtaskProgress(taskIndex);
    editTask(taskIndex);
  } else {
    console.error('Task not found for deletion at index:', taskIndex);
  }
}

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