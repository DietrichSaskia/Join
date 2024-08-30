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

function generateInitalsAndNameDetailHTML(task) {
  if (!task.assignedInitals || task.assignedInitals.length === 0) return '';
  if (!task.assignedName || task.assignedName.length === 0) return '';
  if (!task.color || task.color.length === 0) return '';
  
  let detailHtml = '';
  
  task.assignedInitals.forEach((initial, index) => {
    let color = task.color[index]; 
    let name = task.assignedName[index];
    
    detailHtml += /*html*/`
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
  let initialsAndName = generateInitalsAndNameDetailHTML(task)

  return /*html*/`
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
        <p>Edit</p>
      </div>
    </div>
  </div>`;
}


function renderTaskDetailsSubtask(task, categoryClass, taskIndex) {
  let initialsAndName = generateInitalsAndNameDetailHTML(task)

  return /*html*/`
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
          <p>Edit</p>
        </div>
      </div>
    </div>`;
}