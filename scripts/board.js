let taskAllArray = [];
let contactAllArray = [];
let currentDraggedElement;


/**
 * Loads all necessary data (contacts and tasks) and renders all tasks on the page.
 */
function loadAll() {
  loadContact();
  loadTasks();
  renderAllTasks();
}


/**
 * Loads contacts from localStorage and parses them into the contactAllArray.
 */
function loadContact() {
  let contactAsText = localStorage.getItem('contactAllArray');
  if (contactAsText) {
    contactAllArray = JSON.parse(contactAsText);
  }
}


/**
 * Loads tasks from localStorage and parses them into the taskAllArray.
 */
function loadTasks() {
  let tasksAsText = localStorage.getItem('taskAllArray');
  if (tasksAsText) {
    taskAllArray = JSON.parse(tasksAsText);
  }
}


/**
 * Saves the current task array to localStorage.
 */
function saveTasksToLocalStorage() {
  localStorage.setItem('taskAllArray', JSON.stringify(taskAllArray));
}


/**
 * Renders all tasks in their respective sections.
 */
function renderAllTasks() {
  renderSection('toDo', 'toDo');
  renderSection('inProgress', 'inProgress');
  renderSection('awaitFeedback', 'awaitFeedback');
  renderSection('done', 'done');
}


/**
 * Renders tasks for a specific section into the provided container.
 * 
 * @param {string} section - The section name (e.g., 'toDo', 'inProgress').
 * @param {string} containerId - The ID of the HTML container where tasks should be rendered.
 */
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


/**
 * Formats a section name to be more readable.
 * 
 * @param {string} section - The section name to format.
 * @returns {string} - The formatted section name.
 */
function formatSectionName(section) {
  let formattedName = section.charAt(0).toUpperCase() + section.slice(1);
  formattedName = formattedName.replace(/([A-Z])/g, ' $1').trim();
  return formattedName;
}


/**
 * Truncates a task description to a specified word limit.
 * 
 * @param {string} description - The task description.
 * @param {number} wordLimit - The maximum number of words to display.
 * @returns {string} - The truncated description.
 */
function truncateDescription(description, wordLimit) {
  let words = (typeof description === 'string' ? description.split(' ') : []);
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(' ') + '...'
    : description;
}


/**
 * Capitalizes the first letter of the given text, ensuring the rest of the string remains unchanged.
 * 
 * @param {string} text - The input string to capitalize.
 * @returns {string} - The modified string with only the first letter capitalized.
 */
function capitalizeFirstLetter(text) {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}


/**
 * Initiates the dragging process for a task.
 * 
 * @param {number} taskIndex - The index of the task being dragged.
 */
function startDragging(taskIndex) {
  currentDraggedElement = taskIndex;
  let taskElement = document.querySelector(`[data-task="${taskAllArray[taskIndex].title}"]`);
  taskElement.classList.add('dragging');
}


/**
 * Allows an element to be dropped.
 * 
 * @param {Event} ev - The dragover event.
 */
function allowDrop(ev) {
  ev.preventDefault();
}


/**
 * Moves a task to a different section.
 * 
 * @param {string} section - The section to move the task to.
 */
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


/**
 * Updates the progress of a task's subtasks and renders the progress bar.
 * 
 * @param {number} taskIndex - The index of the task to update.
 */
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


/**
 * Calculates the progress of subtasks for a given task.
 * 
 * @param {Array} subtasks - The array of subtasks.
 * @param {number} taskIndex - The index of the task.
 * @returns {Object} - An object containing the number of completed subtasks, total subtasks, and the width percentage of the progress bar.
 */
function calculateSubtaskProgress(subtasks, taskIndex) {
  let completedSubtasks = subtasks.reduce((count, _, subtaskIndex) => {
    let storageKey = `task-${taskIndex}-subtask-${subtaskIndex}`;
    return count + (localStorage.getItem(storageKey) === 'true' ? 1 : 0);
  }, 0);
  
  let subtaskCount = subtasks.length;
  let subtaskBarWidth = (completedSubtasks / subtaskCount) * 100;

  return { completedSubtasks, subtaskCount, subtaskBarWidth };
}


/**
 * Renders the progress of subtasks for a task.
 * 
 * @param {number} taskIndex - The index of the task.
 * @param {Object} progress - An object containing the progress data.
 */
function renderSubtaskProgress(taskIndex, progress) {
  let subtaskBar = document.getElementById(`subtaskBar${taskIndex}`);
  let subtaskCount = document.getElementById(`subtaskCount${taskIndex}`);
  
  if (subtaskBar && subtaskCount) {
    subtaskBar.style.width = `${progress.subtaskBarWidth}%`;
    subtaskCount.textContent = `${progress.completedSubtasks}/${progress.subtaskCount} Subtasks`;
  }
}


/**
 * Loads the subtask progress for a specific task from localStorage and updates the UI accordingly.
 * 
 * @param {number} taskIndex - The index of the task to load progress for.
 */
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


/**
 * Formats the category name into a valid CSS class name.
 * 
 * @param {string} category - The category name.
 * @returns {string} - The formatted category class name.
 */
function formatCategoryClass(category) {
  return category ? category.replace(/\s+/g, '') : '';
}


/**
 * Determines the initials to display for assigned users and calculates if there are more users than can be displayed.
 * 
 * @param {Array} assignedInitals - The array of assigned user initials.
 * @param {number} maxInitialsToShow - The maximum number of initials to show.
 * @returns {Object} - An object containing the initials to show and the count of remaining initials.
 */
function getInitialsToShow(assignedInitals, maxInitialsToShow) {
  let initialsToShow = assignedInitals.slice(0, maxInitialsToShow);
  let remainingInitialsCount = assignedInitals.length - maxInitialsToShow;
  return { initialsToShow, remainingInitialsCount };
}


/**
 * Generates the full HTML structure for the initials and priority of assigned users.
 * 
 * @param {Array} assignedInitals - The array of assigned user initials.
 * @param {Array} colors - The array of colors associated with the initials.
 * @param {string} prio - The path to the priority image.
 * @returns {string} - The HTML string for the initials and priority display.
 */
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


/**
 * Initializes the application by loading all data and rendering task progress.
 */
window.onload = function() {
  loadAll(); 
  for (let i = 0; i < taskAllArray.length; i++) {
    loadTaskProgress(i);
  }
};