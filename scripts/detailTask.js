function showTaskDetail(task) {
  renderTaskDetails(task);
  openTask();
}


function renderTaskDetails(task) {
  let taskContent = document.getElementById('taskDetailCard');
  taskContent.innerHTML = generateTaskDetailHTML(
    task.category, 
    task.title, 
    task.description, 
    task.date,
    task.prioName,
    task.prio, 
    task.assignedMembers,
    renderSubtasks(task.subtasks)
  );
}


function openTask() {
  document.getElementById('containerTasksDetail').classList.remove('d-none');
}


function closeTask() {
  document.getElementById('containerTasksDetail').classList.add('d-none');
}


function updateSubtaskStatus(subtaskIndex, subtaskTitle) {
  const task = allTasks.find(t => t.subtasks.includes(subtaskTitle));
  if (!task) return;

  let checkbox = document.getElementById(`subtask-${subtaskIndex}`);
  let isChecked = checkbox.checked;

  if (isChecked) {
    task.completedSubtasks = task.completedSubtasks || [];
    task.completedSubtasks.push(subtaskTitle);
  } else {
    task.completedSubtasks = task.completedSubtasks.filter(subtask => subtask !== subtaskTitle);
  }

  updateTaskProgress(task.id);
}

function updateTaskProgress(taskId) {
  const task = allTasks.find(t => t.id === taskId);
  if (!task) return;

  let completedSubtasks = task.completedSubtasks ? task.completedSubtasks.length : 0;
  let subtaskCount = task.subtasks.length;
  let subtaskBarWidth = (completedSubtasks / subtaskCount) * 100;

  const taskElement = document.getElementById(`task-${taskId}`);
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




function renderSubtasks(subtasks) {
  if (!subtasks || subtasks.length === 0) return '';

  return subtasks.map((subtask, index) => `
    <div class="subtask">
      <input type="checkbox" id="subtask-${index}" onchange="updateSubtaskStatus(${index}, '${subtask}')" />
      <label for="subtask-${index}">${subtask}</label>
    </div>
  `).join('');
}


function generateAssignedMembersHTMLDetail(assignedTo) {
  return assignedTo.map(name => {
    let initials = getInitials(name);
    let bgColor = getRandomColor();  // Beispielhafte Funktion, um eine zufällige Farbe zu generieren
    return `
      <div class="assigned-member">
        <div class="assigned-user" style="background-color: ${bgColor};">
          <span class="user-initials">${initials}</span>
        </div>
        <span class="user-name">${name}</span>
      </div>`;
  }).join('');
}

function generateTaskDetailHTML(category, title, description, date, prioName, prio, assignedTo, subtasks) {
  let categoryClass = category.replace(/\s+/g, '');

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


