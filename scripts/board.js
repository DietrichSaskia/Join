let taskAllArray = [];
let contactAllArray = [];
let currentDraggedElement;


function loadAll() {
  loadContact();
  loadTasks();
  renderAllTasks();
}


function loadContact() {
  let contactAsText = localStorage.getItem('contactAllArray');
  if (contactAsText) {
    contactAllArray = JSON.parse(contactAsText);
  }
}


function loadTasks() {
  let tasksAsText = localStorage.getItem('taskAllArray');
  if (tasksAsText) {
    taskAllArray = JSON.parse(tasksAsText);
  }
}


function saveTasksToLocalStorage() {
  localStorage.setItem('taskAllArray', JSON.stringify(taskAllArray));
}


function renderAllTasks() {
  renderSection('toDo', 'toDo');
  renderSection('inProgress', 'inProgress');
  renderSection('awaitFeedback', 'awaitFeedback');
  renderSection('done', 'done');
}


function renderSection(section, containerId) {
  let container = document.getElementById(containerId);
  container.innerHTML = '';
  let formattedSectionName = formatSectionName(section);
  let tasksFound = false;

  for (let i = 0; i < taskAllArray.length; i++) {
    let task = taskAllArray[i];
    if (task && task.section === section) {
      container.innerHTML += generateTasksHTML(task, i);
      tasksFound = true;
    }
  }
  if (!tasksFound) {
    container.innerHTML = `<div class="noTasks">Keine Aufgaben in ${formattedSectionName}</div>`;
  }
}


function formatSectionName(section) {
  let formattedName = section.charAt(0).toUpperCase() + section.slice(1);
  formattedName = formattedName.replace(/([A-Z])/g, ' $1').trim();
  return formattedName;
}


function truncateDescription(description, wordLimit) {
  let words = (typeof description === 'string' ? description.split(' ') : []);
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(' ') + '...'
    : description;
}


function startDragging(taskIndex) {
  currentDraggedElement = taskIndex;
}


function allowDrop(ev) {
  ev.preventDefault();
}


function moveTo(section) {
  if (typeof currentDraggedElement !== 'number' || currentDraggedElement < 0 || currentDraggedElement >= taskAllArray.length) {
    return;
  }
  let task = taskAllArray[currentDraggedElement];
  task.section = section;
  
  renderAllTasks();
  saveTasksToLocalStorage();
}

function updateSubtaskStatus(taskIndex, subtaskIndex) {
  let checkbox = document.getElementById(`subtask-${taskIndex}-${subtaskIndex}`);
  let isChecked = checkbox.checked;

  let storageKey = `task-${taskIndex}-subtask-${subtaskIndex}`;
  localStorage.setItem(storageKey, isChecked);

  updateTaskProgress(taskIndex);
  saveTasksToLocalStorage();
}


function calculateSubtaskProgress(subtasks, taskIndex) {
  let completedSubtasks = subtasks.reduce((count, _, subtaskIndex) => 
    count + (document.getElementById(`subtask-${taskIndex}-${subtaskIndex}`).checked ? 1 : 0), 0);
  
  let subtaskCount = subtasks.length;
  let subtaskBarWidth = (completedSubtasks / subtaskCount) * 100;

  return { completedSubtasks, subtaskCount, subtaskBarWidth };
}


function renderSubtaskProgress(taskIndex, progress) {
  document.getElementById(`subtaskBar${taskIndex}`).style.width = `${progress.subtaskBarWidth}%`;
  document.getElementById(`subtaskCount${taskIndex}`).textContent = `${progress.completedSubtasks}/${progress.subtaskCount} Unteraufgaben`;
  saveTasksToLocalStorage();
}


function updateTaskProgress(taskIndex) {
  let subtasks = taskAllArray[taskIndex].subtasks;
  let progress = calculateSubtaskProgress(subtasks, taskIndex);
  renderSubtaskProgress(taskIndex, progress);
}


function generateTasksHTML(element, i) {
  let { category, title, description, subtasks = [], prio, assignedInitals = [], color = [] } = element;
  let categoryClass = formatCategoryClass(category);
  let truncatedDescription = truncateDescription(description, 7);
  let subtaskHTML = generateSubtaskProgressHTML(subtasks, i);
  let initials = generateInitalsHTML(assignedInitals, color, prio)
  return `
   <div class="task" draggable="true" data-task="${title}" ondragstart="startDragging(${i})" ondragover="allowDrop(event)" ondrop="moveTo('${element.section}')" onclick="showTaskDetail(${i})">
      <div class="category ${categoryClass}">${category}</div>
      <div class="title">${title}</div>
      <div class="description">${truncatedDescription}</div>
      ${subtaskHTML}
      ${initials}
    </div>
  `;
}


function formatCategoryClass(category) {
  return category ? category.replace(/\s+/g, '') : '';
}


function generateInitalsHTML(assignedInitals, colors, prio) {
  if (assignedInitals.length === 0) return '';
  
  let html = '<div class="assignedToAndPrio"><div>';
  
  assignedInitals.forEach((initial, index) => {
    let color = colors[index];
    html += `
      <div class="assignedUser" style="background-color: ${color};">
        <span class="userInitials">${initial}</span>
      </div>
    `;
  });

  html += `</div><img src="${prio}" alt="PriorityImage" class="priority-icon"></div>`;
  
  return html;
}


function generateSubtaskProgressHTML(subtasks, taskIndex) {
  if (subtasks.length === 0) return '';
  
  let subtaskCount = subtasks.length;
  let completedSubtasks = subtasks.filter(subtask => subtask.completed).length;
  let subtaskBarWidth = (completedSubtasks / subtaskCount) * 100;
  
  return `
    <div class="subtasks">
      <div class="subtaskBarContainer">
        <div class="subtaskBar" id="subtaskBar${taskIndex}" style="width: ${subtaskBarWidth}%"></div>
      </div>
      <span class="subtaskCount" id="subtaskCount${taskIndex}">${completedSubtasks}/${subtaskCount} Unteraufgaben</span>
    </div>`;
}