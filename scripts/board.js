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
    container.innerHTML = `<div class="noTasks">No Tasks in ${formattedSectionName}</div>`;
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


function capitalizeFirstLetter(text) {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}


function startDragging(taskIndex) {
  currentDraggedElement = taskIndex;
  let taskElement = document.querySelector(`[data-task="${taskAllArray[taskIndex].title}"]`);
  taskElement.classList.add('dragging');
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
  let taskElement = document.querySelector(`[data-task="${taskAllArray[currentDraggedElement].title}"]`);
  taskElement.classList.remove('dragging');

  renderAllTasks();
  saveTasksToLocalStorage();
}


function formatCategoryClass(category) {
  return category ? category.replace(/\s+/g, '') : '';
}


function getInitialsToShow(assignedInitals, maxInitialsToShow) {
  let initialsToShow = assignedInitals.slice(0, maxInitialsToShow);
  let remainingInitialsCount = assignedInitals.length - maxInitialsToShow;
  return { initialsToShow, remainingInitialsCount };
}



function renderInitials(assignedInitals, colors, prio) {
  let maxInitialsToShow = 3;
  let { initialsToShow, remainingInitialsCount } = getInitialsToShow(assignedInitals, maxInitialsToShow);
  let initialElements = initialsToShow.map((initial, index) => `
    <div class="assignedUser" style="background-color: ${colors[index]};">
      <span class="userInitials">${initial}</span>
    </div>
  `).join('');
  let remainingElement = remainingInitialsCount > 0 
    ? `<div class="assignedUser remainingUsers"><span class="userInitials">+${remainingInitialsCount}</span></div>` 
    : '';
  return generateInitialsAndPriorityHTML(initialElements, remainingElement, prio);
}


function calculateSubtaskProgress(taskIndex) {
  let task = taskAllArray[taskIndex];
  if (!task) return { subtaskBarWidth: 0, completedSubtasks: 0, amountSubtasks: 0 };

  let validSubtasks = task.subtasks.filter(subtask => subtask && subtask.trim() !== '');
  let completedSubtasks = task.subtasksCheck.filter(Boolean).length;
  let amountSubtasks = validSubtasks.length;

  let subtaskBarWidth = amountSubtasks > 0 ? (completedSubtasks / amountSubtasks) * 100 : 0;

  return {
    subtaskBarWidth,
    completedSubtasks,
    amountSubtasks
  };
}