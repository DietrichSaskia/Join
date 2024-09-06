let taskAllArray = [];
let contactAllArray = [];
let currentDraggedElement;


/**
 * Loads all necessary data (contacts and tasks) from local storage 
 * and renders the tasks on the page.
 */
function loadAll() {
  loadContact();
  loadTasks();
  renderAllTasks();
}


/**
 * Loads the contact array from local storage if it exists.
 * Otherwise, the contact array remains empty.
 */
function loadContact() {
  let contactAsText = localStorage.getItem('contactAllArray');
  if (contactAsText) {
    contactAllArray = JSON.parse(contactAsText);
  }
}


/**
 * Loads the task array from local storage if it exists.
 * Otherwise, the task array remains empty.
 */
function loadTasks() {
  let tasksAsText = localStorage.getItem('taskAllArray');
  if (tasksAsText) {
    taskAllArray = JSON.parse(tasksAsText);
  }
}


/**
 * Saves the task array to local storage.
 */
function saveTasksToLocalStorage() {
  localStorage.setItem('taskAllArray', JSON.stringify(taskAllArray));
}


/**
 * Renders tasks in all task sections (toDo, inProgress, awaitFeedback, done).
 */
function renderAllTasks() {
  renderSection('toDo', 'toDo');
  renderSection('inProgress', 'inProgress');
  renderSection('awaitFeedback', 'awaitFeedback');
  renderSection('done', 'done');
}


/**
 * Renders tasks within a specific section by clearing the container and 
 * generating the appropriate task HTML.
 *
 * @param {string} section - The name of the section to render tasks for.
 * @param {string} containerId - The HTML element ID of the section's container.
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
 * Formats the section name by capitalizing the first letter and adding spaces before any capitalized letters.
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
 * @returns {string} - The truncated description followed by an ellipsis if truncated.
 */
function truncateDescription(description, wordLimit) {
  let words = (typeof description === 'string' ? description.split(' ') : []);
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(' ') + '...'
    : description;
}


/**
 * Capitalizes the first letter of a given text.
 *
 * @param {string} text - The text to capitalize.
 * @returns {string} - The text with the first letter capitalized.
 */
function capitalizeFirstLetter(text) {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}


/**
 * Starts dragging a task by setting the currentDraggedElement index and adding a "dragging" class to the task.
 *
 * @param {number} taskIndex - The index of the task being dragged.
 */
function startDragging(taskIndex) {
  currentDraggedElement = taskIndex;
  let taskElement = document.querySelector(`[data-task="${taskAllArray[taskIndex].title}"]`);
  taskElement.classList.add('dragging');
}


/**
 * Allows dropping of an element during a drag-and-drop operation.
 *
 * @param {DragEvent} ev - The drag event.
 */
function allowDrop(ev) {
  ev.preventDefault();
}


/**
 * Moves a dragged task to a new section and updates the task array and local storage.
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


function highlightBox(sectionId) {
  document.getElementById(sectionId).classList.add('dragHover');
}

function removeHighlightBox(sectionId) {
  document.getElementById(sectionId).classList.remove('dragHover');
}


/**
 * Formats a category string by removing spaces.
 *
 * @param {string} category - The category to format.
 * @returns {string} - The formatted category class name.
 */
function formatCategoryClass(category) {
  return category ? category.replace(/\s+/g, '') : '';
}


/**
 * Returns the initials to display and the count of remaining initials not shown.
 *
 * @param {Array<string>} assignedInitals - The list of initials assigned to a task.
 * @param {number} maxInitialsToShow - The maximum number of initials to display.
 * @returns {{initialsToShow: Array<string>, remainingInitialsCount: number}} - An object containing the initials to show and the remaining count.
 */
function getInitialsToShow(assignedInitals, maxInitialsToShow) {
  let initialsToShow = assignedInitals.slice(0, maxInitialsToShow);
  let remainingInitialsCount = assignedInitals.length - maxInitialsToShow;
  return { initialsToShow, remainingInitialsCount };
}


/**
 * Renders initials for assigned users along with a priority indicator.
 *
 * @param {Array<string>} assignedInitals - The initials of assigned users.
 * @param {Array<string>} colors - The colors associated with each initial.
 * @param {string} prio - The task priority level.
 * @returns {string} - The HTML to display the initials and priority.
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
 * Calculates the progress of subtasks for a given task.
 *
 * @param {number} taskIndex - The index of the task.
 * @returns {{subtaskBarWidth: number, completedSubtasks: number, amountSubtasks: number}} - An object containing subtask progress information.
 */
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


/**
 * Updates the subtask progress bar and count of completed subtasks.
 *
 * @param {number} taskIndex - The index of the task in the taskAllArray.
 * @param {number} subtaskBarWidth - The width of the progress bar as a percentage.
 * @param {number} completedSubtasks - The number of completed subtasks.
 * @param {number} amountSubtasks - The total number of subtasks.
 */
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


/**
 * Displays the details of a specific task, including subtasks.
 *
 * @param {number} taskIndex - The index of the task in the taskAllArray.
 */
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


/**
 * Converts a date from German format (DD/MM/YYYY) to standard format (YYYY-MM-DD).
 *
 * @param {string} dateGerman - The date in German format.
 * @returns {string} - The date in standard format.
 */
function changeDateFormatEdit(dateGerman) {
  let [year, month, day] = dateGerman.split("/");
  let formattedDateStr = `${day}-${month}-${year}`;
  return formattedDateStr;
}


/**
 * Converts a date from standard format (YYYY-MM-DD) to German format (DD/MM/YYYY).
 *
 * @param {string} dateEnglish - The date in standard format.
 * @returns {string} - The date in German format.
 */
function changeDateFormat(dateEnglish) {
  let formattedDate = dateEnglish.replace(/-/g, '/');
  let [year, month, day] = formattedDate.split('/');
  let formattedDateStr = `${day}/${month}/${year}`;
  return formattedDateStr;
}


/**
 * Toggles the visibility of the task detail view.
 */
function toggleTask() {
  let taskDetailContainer = document.getElementById("containerTasksDetail");
  taskDetailContainer.classList.toggle("d-none");
}


/**
 * Closes the current Task
 */
function closeTask() {
  let taskDetailContainer = document.getElementById("containerTasksDetail");
  taskDetailContainer.classList.toggle("d-none");
  document.getElementById("taskDetailCard").innerHTML = ``;
}


/**
 * Deletes a task from the taskAllArray and updates the task display.
 *
 * @param {number} taskIndex - The index of the task in the taskAllArray.
 */
function deleteTask(taskIndex) {
  taskAllArray.splice(taskIndex, 1);
  saveTasksToLocalStorage();
  toggleTask();
  renderAllTasks();
}


/**
 * Toggles the completion status of a subtask and updates its display.
 *
 * @param {number} taskIndex - The index of the task in the taskAllArray.
 * @param {number} subtaskIndex - The index of the subtask within the task.
 */
function toggleSubtaskImage(taskIndex, subtaskIndex) {
  let task = taskAllArray[taskIndex];
  if (!task || !Array.isArray(task.subtasksCheck)) return console.error('Invalid task data', taskIndex);

  task.subtasksCheck[subtaskIndex] = !task.subtasksCheck[subtaskIndex];
  let image = document.getElementById(`subtask-image-${taskIndex}-${subtaskIndex}`);
  if (image) {
    image.src = task.subtasksCheck[subtaskIndex]
      ? "../assets/icons/checkButtonChecked.png"
      : "../assets/icons/checkButtonblank.png";
  }
  saveTasksToLocalStorage();
  let { subtaskBarWidth, completedSubtasks, amountSubtasks } = calculateSubtaskProgress(taskIndex);
  updateSubtaskProgressBar(taskIndex, subtaskBarWidth, completedSubtasks, amountSubtasks);
}


/**
 * Renders the subtasks of a task.
 *
 * @param {number} taskIndex - The index of the task in the taskAllArray.
 * @param {Object} task - The task object containing subtasks.
 * @returns {string} - The HTML string for rendering subtasks.
 */
function renderSubtasks(taskIndex, task) {
  let subtasks = task.subtasks || [];
  let subtasksCheck = task.subtasksCheck || [];
  let validSubtasks = subtasks.filter(subtask => subtask && subtask.trim() !== "");
  if (!validSubtasks.length) return "<p>No subtasks available.</p>";

  return validSubtasks.map((subtask, validIndex) => {
    let isChecked = subtasksCheck[validIndex] || false;
    let imageSrc = isChecked
      ? "../assets/icons/checkButtonChecked.png"
      : "../assets/icons/checkButtonblank.png";
    return `
      <div class="subtask">
        <img src="${imageSrc}" id="subtask-image-${taskIndex}-${validIndex}" class="custom-checkbox" onclick="toggleSubtaskImage(${taskIndex}, ${validIndex})" alt="Subtask Status">
        <span>${subtask}</span>
      </div>`;
  }).join("");
}