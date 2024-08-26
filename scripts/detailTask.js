function showTaskDetail(taskIndex) {
  let task = allTasks[taskIndex];
  console.log('Task:', task);
  renderTaskDetails(task, taskIndex);
  openTask();
}

function renderTaskDetails(task, taskIndex) {
  console.log('Rendering task details:', task);
  let taskContent = document.getElementById('taskDetailCard');
  taskContent.innerHTML = generateTaskDetailHTML(
    task.category, 
    task.title, 
    task.description, 
    task.date,
    task.prioName,
    task.prio, 
    task.assignedTo,
    renderSubtasks(taskIndex, task.subtasks)
  );
}


function openTask() {
  document.getElementById('containerTasksDetail').classList.remove('d-none');
}


function closeTask() {
  document.getElementById('containerTasksDetail').classList.add('d-none');
}


function renderSubtasks(taskIndex, subtasks) {
  if (!subtasks || subtasks.length === 0) return '';

  return subtasks.map((subtask, index) => `
    <div class="subtask">
      <input type="checkbox" id="subtask-${index}" onchange="updateSubtaskStatus(${taskIndex}, ${index}, '${subtask}')" />
      <label for="subtask-${index}">${subtask}</label>
    </div>
  `).join('');
}

function updateSubtaskStatus(taskIndex, subtaskIndex, subtaskTitle) {
  const task = allTasks[taskIndex];
  if (!task) return;

  let checkbox = document.getElementById(`subtask-${subtaskIndex}`);
  let isChecked = checkbox.checked;

  if (isChecked) {
    task.completedSubtasks = task.completedSubtasks || [];
    task.completedSubtasks.push(subtaskTitle);
  } else {
    task.completedSubtasks = task.completedSubtasks.filter(subtask => subtask !== subtaskTitle);
  }

  updateTaskProgress(task);
}

function updateTaskProgress(task) {
  let completedSubtasks = task.completedSubtasks ? task.completedSubtasks.length : 0;
  let subtaskCount = task.subtasks.length;
  let subtaskBarWidth = (completedSubtasks / subtaskCount) * 100;

  const taskElement = document.querySelector(`[data-task-index='${taskIndex}']`);
  if (taskElement) {
    const subtaskBar = taskElement.querySelector('.subtaskBar');
    if (subtaskBar) {
      subtaskBar.style.width = `${subtaskBarWidth}%`;
    }
    const subtaskCountDisplay = taskElement.querySelector('.subtaskCount');
    if (subtaskCountDisplay) {
      subtaskCountDisplay.innerText = `${completedSubtasks}/${subtaskCount} Subtasks`;
    }
  }
  saveTasksToLocalStorage();
}


function generateAssignedMembersHTMLDetail(assignedTo) {
  return assignedTo.map(member => {
    let initials = member.initials || getInitials(member.name);
    let bgColor = member.bgColor || getRandomColor();
    return `
      <div class="assigned-member">
        <div class="assignedUser" style="background-color: ${bgColor};">
          <span class="userInitials">${initials}</span>
        </div>
        <span class="user-name">${member.name}</span>
      </div>`;
  }).join('');
}

function generateTaskDetailHTML(category, title, description, date, prioName, prio, assignedTo, subtasks) {
  let categoryClass = category ? category.replace(/\s+/g, '') : 'default-category';

  // Aufruf der neuen Funktion
  let assignedMembersHTML = generateAssignedMembersHTMLDetail(assignedTo);

  return `
    <div class="detailtask">
      <div class="categoryAndClose">
        <div class="category ${categoryClass}">${category}</div>
        <img onclick="closeTask()" src="/assets/icons/close.png" alt="Close">
      </div>
      <div class="titleDetail">${title}</div>
      <div class="descriptionDetail">${description}</div>
      <div>Due date: ${date}</div>
      <div>Priority: ${prioName} <img src="${prio}" alt="PriorityImage"></div>
      <div class="assignedTo">${assignedMembersHTML}</div>
      <div class="subtasksDetail">${subtasks}</div>
    </div>`;
}



