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


function updateTaskProgress(taskIndex) {
  if (taskIndex < 0 || taskIndex >= taskAllArray.length) {
    return;
  }
  let task = taskAllArray[taskIndex];
  if (!task || !task.subtasks || task.subtasks.length === 0) {
    return;
  }
  let progress = calculateSubtaskProgress(task.subtasks, taskIndex);
  renderSubtaskProgress(taskIndex, progress);
}


function calculateSubtaskProgress(subtasks, taskIndex) {
  let completedSubtasks = subtasks.reduce((count, _, subtaskIndex) => {
    let storageKey = `task-${taskIndex}-subtask-${subtaskIndex}`;
    return count + (localStorage.getItem(storageKey) === 'true' ? 1 : 0);
  }, 0);
  
  let subtaskCount = subtasks.length;
  let subtaskBarWidth = (completedSubtasks / subtaskCount) * 100;

  return { completedSubtasks, subtaskCount, subtaskBarWidth };
}


function renderSubtaskProgress(taskIndex, progress) {
  let subtaskBar = document.getElementById(`subtaskBar${taskIndex}`);
  let subtaskCount = document.getElementById(`subtaskCount${taskIndex}`);
  
  if (subtaskBar && subtaskCount) {
    subtaskBar.style.width = `${progress.subtaskBarWidth}%`;
    subtaskCount.textContent = `${progress.completedSubtasks}/${progress.subtaskCount} Subtasks`;
  }
}


function loadTaskProgress(taskIndex) {
  let task = taskAllArray[taskIndex];
  if (!task || !task.subtasks || task.subtasks.length === 0) {
    return;
  }
  task.subtasks.forEach((subtask, subtaskIndex) => {
    let storageKey = `task-${taskIndex}-subtask-${subtaskIndex}`;
    let isChecked = localStorage.getItem(storageKey) === 'true';
    let checkbox = document.getElementById(`subtask-image-${taskIndex}-${subtaskIndex}`);
    if (checkbox) {
      checkbox.src = isChecked ? '/assets/icons/checkButtonChecked.png' : '/assets/icons/checkButtonblank.png';
    }
  });
  updateTaskProgress(taskIndex);
}


function generateTasksHTML(element, i) {
  let { category, title, description, subtasks = [], prio, assignedInitals = [], color = [] } = element;
  let categoryClass = formatCategoryClass(category);
  let truncatedDescription = truncateDescription(description, 7);
  let subtaskHTML = generateSubtaskProgressHTML(subtasks, i);
  let initials = generateInitalsHTML(assignedInitals, color, prio);
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


function getInitialsToShow(assignedInitals, maxInitialsToShow) {
  let initialsToShow = assignedInitals.slice(0, maxInitialsToShow);
  let remainingInitialsCount = assignedInitals.length - maxInitialsToShow;
  return { initialsToShow, remainingInitialsCount };
}


function generateInitialsHTML(initialElements, remainingElement, prio) {
  return `
    <div class="assignedToAndPrio">
      <div>${initialElements}${remainingElement}</div>
      <img src="${prio}" alt="PriorityImage" class="priority-icon">
    </div>
  `;
}


function generateInitalsHTML(assignedInitals, colors, prio) {
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

  return generateInitialsHTML(initialElements, remainingElement, prio);
}


function generateSubtaskProgressHTML(subtasks, taskIndex) {
  if (subtasks.length === 0) return '';
  
  let subtaskCount = subtasks.length;
  let completedSubtasks = subtasks.reduce((count, subtask, subtaskIndex) => {
    let storageKey = `task-${taskIndex}-subtask-${subtaskIndex}`;
    return count + (localStorage.getItem(storageKey) === 'true' ? 1 : 0);
  }, 0);
  
  let subtaskBarWidth = (completedSubtasks / subtaskCount) * 100;
  
  return `
    <div class="subtasks">
      <div class="subtaskBarContainer">
        <div class="subtaskBar" id="subtaskBar${taskIndex}" style="width: ${subtaskBarWidth}%"></div>
      </div>
      <span class="subtaskCount" id="subtaskCount${taskIndex}">${completedSubtasks}/${subtaskCount} Subtasks</span>
    </div>`;
}


window.onload = function() {
  loadAll(); 
  for (let i = 0; i < taskAllArray.length; i++) {
    loadTaskProgress(i);
  }
};
