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
    'title': '',
    'assignedInitals': [],
    'assignedName': [],
    'color': [],
  },
];
let editedTaskArray = editedTaskArrays[0];

function showTaskDetail(taskIndex) {
  let task = taskAllArray[taskIndex];
  renderTaskDetails(task, taskIndex);
  toggleTask();
}

function renderTaskDetails(task, taskIndex) {
  let taskContent = document.getElementById("taskDetailCard");
  taskContent.innerHTML = generateTaskDetails(taskIndex);
  if (document.getElementById("subtasksDetail")) {
    document.getElementById("subtasksDetail").innerHTML = renderSubtasks(
      taskIndex,
      task
    );
    updateTaskProgress(taskIndex);
  }
}

function toggleTask() {
  let taskDetailContainer = document.getElementById("containerTasksDetail");
  taskDetailContainer.classList.toggle("d-none");
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
  toggleTask();
  renderAllTasks();
}

function generateTaskDetails(taskIndex) {
  let task = taskAllArray[taskIndex];
  let categoryClass = task.category
    ? task.category.replace(/\s+/g, "")
    : "default-category";
  if (!task.subtasks || task.subtasks === null) {
    return generateTaskDetailsNoSubtask(task, categoryClass, taskIndex);
  } else {
    return generateTaskDetailsSubtask(task, categoryClass, taskIndex);
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

function generateTaskDetailsNoSubtask(task, categoryClass, taskIndex) {
  let initialsAndName = generateInitalsAndNameDetailHTML(task);
  let capitalizedTitle = capitalizeFirstLetter(task.title);
  let capitalizedDescription = capitalizeFirstLetter(task.description);

  return /*html*/ `
  <div class="detailtask">
    <div class="categoryAndClose">
      <div class="category ${categoryClass}">${task.category}</div>
      <img onclick="toggleTask()" src="/assets/icons/close.png" alt="Close">
    </div>
    <div class="detailtaskinfos">
      <div class="titleDetail">${capitalizedTitle}</div>
      <div class="descriptionDetail">${capitalizedDescription}</div>
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

function generateTaskDetailsSubtask(task, categoryClass, taskIndex) {
  let initialsAndName = generateInitalsAndNameDetailHTML(task);
  let capitalizedTitle = capitalizeFirstLetter(task.title);
  let capitalizedDescription = capitalizeFirstLetter(task.description);

  return /*html*/ `
    <div class="detailtask">
      <div class="categoryAndClose">
        <div class="category ${categoryClass}">${task.category}</div>
        <img onclick="toggleTask()" src="/assets/icons/close.png" alt="Close">
      </div>
      <div class="detailtaskinfos">
      <div class="titleDetail">${capitalizedTitle}</div>
      <div class="descriptionDetail">${capitalizedDescription}</div>
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


function changeDateFormatEdit(dateGerman) {
  let [year, month, day] = dateGerman.split("/");
  let formattedDateStr = `${day}-${month}-${year}`;
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
    if (task.subtasks) {
      editTaskTemplateSubTasks(0, taskIndex, task);
      if (task.subtasks.length === 2) {
        editTaskTemplateSubTasks(1, taskIndex, task);
      }
    }
    setpriorityButton(task);
    getusers();
    setAssignedUsers(task);
  }, 150);
}


function subtaskEdit(taskIndex, i) {
  let task = taskAllArray[taskIndex];
  let subtask = task.subtasks[i];
  document.getElementById(`subtaskBox${i}`).remove();
  subtaskEditInput(subtask, i, taskIndex);
  let input = document.getElementById(`subtask${i}`);
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);
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
      <div class="subtasksBox" id="subtasksBox"></div>

      </div>
      <button onclick="saveEditedTasktoLocalStorage(${taskIndex})" class="okButton"><img src="/assets/icons/checkWhite.png"></button>
    </div>
    `;
}

function editTaskTemplateSubTasks(i, taskIndex, task) {
  document.getElementById('subtasksBox').innerHTML += /*html*/`
  <div id="subtaskBox${i}" class="subtaskBox">
        <ul>
            <li id="subtask${i}">${task.subtasks[taskIndex, [i]]}</li>
            <div class="subtaskIconsLower">
                <img class="subtaskIcon" onclick="subtaskEdit(${taskIndex}, ${i})" src="../assets/icons/edit.png">
                <div class="smallSeparator"></div>
                <img class="subtaskIcon" onclick="deleteSubtaskEdit(${i})" src="../assets/icons/delete.png">
            </div>
        </ul>
    </div>
    `
}


function subtaskEditInput(subtask, i, taskIndex) {
  document.getElementById('subtasksBox').innerHTML += /*html*/`
    <div id="subtaskBox${i}" class="subtaskBox">
        <div class="dFlexAlign backgroundWhite">
            <input id="subtask${i}" value="${subtask}" class="editSubtaskInput">
            <div class="subtaskIconsLower">
                <img class="subtaskIcon" onclick="deleteSubtaskEdit(${i})" src="../assets/icons/delete.png">
                <div class="smallSeparator"></div>
                <img class="subtaskIcon" src="../assets/icons/check.png" onclick="subtaskChange(${i}, ${taskIndex})">
            </div>
        </div>
    </div>
    `
}


function subtaskChange(i, taskIndex) {
  let input = document.getElementById(`subtask${i}`).value;
  document.getElementById(`subtaskBox${i}`).remove();
  subTaskEdited(input, i, taskIndex);
}

function subtaskEditTwice(i, taskIndex) {
  let input = document.getElementById(`subtask${i}`).innerText;
  document.getElementById(`subtaskBox${i}`).remove();
  subtaskEditedTwice(input, i, taskIndex);
}


function subtaskEditedTwice(input, i, taskIndex) {
  document.getElementById('subtasksBox').innerHTML += /*html*/`
    <div id="subtaskBox${i}" class="subtaskBox">
        <div class="dFlexAlign backgroundWhite">
            <input id="subtask${i}" value="${input}" class="editSubtaskInput">
            <div class="subtaskIconsLower">
                <img class="subtaskIcon" onclick="deleteSubtaskEdit(${i})" src="../assets/icons/delete.png">
                <div class="smallSeparator"></div>
                <img class="subtaskIcon" src="../assets/icons/check.png" onclick="subtaskChange(${i}, ${taskIndex})">
            </div>
        </div>
    </div>
    `
}

function subTaskEdited(input, i, taskIndex) {
  document.getElementById('subtasksBox').innerHTML += /*html*/`
    <div id="subtaskBox${i}" class="subtaskBox">
        <ul>
            <li id="subtask${i}">${input}</li>
            <div class="subtaskIconsLower">
                <img class="subtaskIcon" onclick="subtaskEditTwice(${i}, ${taskIndex})" src="../assets/icons/edit.png">
                <div class="smallSeparator"></div>
                <img class="subtaskIcon" onclick="deleteSubtaskEdit(${i})" src="../assets/icons/delete.png">
            </div>
        </ul>
    </div>
  `
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
  taskAllArray.splice(taskIndex, 1);
  taskAllArray.splice(taskIndex, 0, editedTaskArray);
  let tasksAsText = JSON.stringify(taskAllArray);
  localStorage.setItem('taskAllArray', tasksAsText);
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



function deleteSubtaskEdit(taskIndex, subtaskIndex) {
  if (taskIndex >= 0 && taskIndex < taskAllArray.length) {
    let task = taskAllArray[taskIndex];
    if (task.subtasks && Array.isArray(task.subtasks)) {
      task.subtasks.splice(subtaskIndex, 1);

      saveEditedTasktoLocalStorage(taskIndex);
      updateTaskProgress(taskIndex);
      renderTaskDetails(task, taskIndex);
    }
  }
}