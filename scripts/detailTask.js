function showTaskDetail(taskIndex) {
  let task = taskAllArray[taskIndex];
  renderTaskDetails(task, taskIndex);
  openTask();
}

function renderTaskDetails(task, taskIndex) {
  let taskContent = document.getElementById('taskDetailCard');
  taskContent.innerHTML = generateTaskDetailHTML(taskIndex);
  if(document.getElementById('subtasksDetail')) {
  document.getElementById('subtasksDetail').innerHTML = renderSubtasks(taskIndex, task);
  }
}


function openTask() {
  document.getElementById('containerTasksDetail').classList.remove('d-none');
}


function closeTask() {
  document.getElementById('containerTasksDetail').classList.add('d-none');
}


function renderSubtasks(taskIndex, task) {
  let subtasks = task.subtasks;
  if (!subtasks || subtasks.length === 0) return '';
  
  let subtasksHTML = subtasks.map((subtask, subtaskIndex) => {
    let storageKey = `task-${taskIndex}-subtask-${subtaskIndex}`;
    let isChecked = localStorage.getItem(storageKey) === 'true';
    return `
      <div class="subtask">
        <input type="checkbox" id="subtask-${taskIndex}-${subtaskIndex}" onchange="updateSubtaskStatus(${taskIndex}, ${subtaskIndex})" ${isChecked ? 'checked' : ''}/>
        <label for="subtask-${taskIndex}-${subtaskIndex}">${subtask}</label>
      </div>`;
  }).join('');

  return subtasksHTML;
}


function deleteTask(taskIndex) {
  taskAllArray.splice(taskIndex, 1);
  saveTasksToLocalStorage();
  closeTask();
  renderAllTasks();
}


function generateTaskDetailHTML(taskIndex) {
  let task = taskAllArray[taskIndex];
  let categoryClass = task.category ? task.category.replace(/\s+/g, '') : 'default-category';
  if (!task.subtasks || task.subtasks === null) {
    return (renderTaskDetailsNoSubtask(task, categoryClass, taskIndex));
  }
  else {
    return (renderTaskDetailsSubtask(task, categoryClass, taskIndex));
  }
}


function renderTaskDetailsNoSubtask(task, categoryClass, taskIndex) {
  return  /*html*/`
  <div class="detailtask">
    <div class="categoryAndClose">
      <div class="category ${categoryClass}">${task.category}</div>
      <img onclick="closeTask()" src="/assets/icons/close.png" alt="Close">
    </div>
    <div class="titleDetail">${task.title}</div>
    <div class="descriptionDetail">${task.description}</div>
    <div>Due date: ${task.date}</div>
    <div>Priority: ${task.prioName} <img src="${task.prio}" alt="PriorityImage"></div>
     <div> Assigned To:</div>
    <div class="assignedTo">
      <div>${task.assignedInitals}</div>
      <div>${task.assignedName}</div>
    </div>
    <div class="iconContainer">
      <div class="detailTaskIcon">
        <img src="/assets/icons/delete.png" alt="">
        <p onclick="deleteTask(${taskIndex})">Delete</p>
      </div>
      <div class="verticalLine"></div>
      <div class="detailTaskIcon">
        <img src="/assets/icons/edit.png" alt="">
        <p>Edit</p>
      </div>
    </div>
  </div>`;
}


function renderTaskDetailsSubtask(task, categoryClass, taskIndex) {
  return  /*html*/`
    <div class="detailtask">
      <div class="categoryAndClose">
        <div class="category ${categoryClass}">${task.category}</div>
        <img onclick="closeTask()" src="/assets/icons/close.png" alt="Close">
      </div>
      <div class="titleDetail">${task.title}</div>
      <div class="descriptionDetail">${task.description}</div>
      <div>Due date: ${task.date}</div>
      <div>Priority: ${task.prioName} <img src="${task.prio}" alt="PriorityImage"></div>
      <div class="assignedTo"> Assigned To:</div>
        <div class="initalsAndName">
          <div class="assignedInitals">${task.assignedInitals}</div>
          <div class="assignedName">${task.assignedName}</div>
        </div>
      <div>Subtaks:</div>
      <div class="subtasksDetail" id="subtasksDetail"></div>
      <div class="iconContainer">
        <div class="detailTaskIcon">
          <img src="/assets/icons/delete.png" alt="">
          <p onclick="deleteTask(${taskIndex})">Delete</p>
        </div>
        <div class="verticalLine"></div>
        <div class="detailTaskIcon">
          <img src="/assets/icons/edit.png" alt="">
          <p>Edit</p>
        </div>
      </div>
    </div>`;
}