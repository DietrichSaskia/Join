/**
 * Array to store all tasks.
 * @type {Array<Object>}
 */
let allTasks = [];


/**
 * Stores the ID of the currently dragged task element.
 * @type {string|null}
 */
let currentDraggedElement;


/**
 * URL for the tasks API endpoint.
 * @type {string}
 */
let taskUrl = 'https://join-317-default-rtdb.europe-west1.firebasedatabase.app/tasksAll/';


/**
 * URL for the users API endpoint.
 * @type {string}
 */
let userURL = 'https://join-317-default-rtdb.europe-west1.firebasedatabase.app/contactall';


/**
 * Loads tasks from localStorage or fetches them from the API if not available locally.
 * Then renders the tasks and loads the members.
 * @async
 * @function
 */
async function loadTasks() {
  try {
    allTasks = JSON.parse(localStorage.getItem('allTasks')) || await fetchTasksFromAPI();
    renderAllTasks();
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
  await showMembers();
}


/**
 * Fetches tasks from the API and saves them to localStorage.
 * @async
 * @function
 * @returns {Promise<Array<Object>>} The array of tasks fetched from the API.
 * @throws Will throw an error if the fetch operation fails.
 */
async function fetchTasksFromAPI() {
  let response = await fetch(`${taskUrl}.json`);
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

  let responseToJson = await response.json();
  let tasks = Array.isArray(responseToJson) ? responseToJson : Object.values(responseToJson);

  localStorage.setItem('allTasks', JSON.stringify(tasks));

  return tasks;
}


/**
 * Saves the current state of all tasks to localStorage.
 * @function
 */
function saveTasksToLocalStorage() {
  localStorage.setItem('allTasks', JSON.stringify(allTasks));
}


/**
 * Renders all tasks by section.
 * @function
 */
function renderAllTasks() {
  renderSection('toDo', 'toDo');
  renderSection('inProgress', 'inProgress');
  renderSection('awaitFeedback', 'awaitFeedback');
  renderSection('done', 'done');
}


/**
 * Renders tasks in a specific section.
 * @function
 * @param {string} sectionName - The name of the task section (e.g., 'toDo', 'inProgress').
 * @param {string} containerId - The ID of the HTML container where tasks should be rendered.
 */
function renderSection(sectionName, containerId) {
  let tasks = allTasks.filter(task => task.section === sectionName);
  let container = document.getElementById(containerId);
  container.innerHTML = '';
  let formattedSectionName = sectionName.charAt(0).toUpperCase() + sectionName.slice(1).replace(/([A-Z])/g, ' $1').trim();

  if (tasks.length === 0) {
    container.innerHTML = `<div class="noTasks">No tasks in ${formattedSectionName}</div>`;
  } else {
    tasks.forEach(task => {
      container.innerHTML += generateTasksHTML(task);
    });
  }
}


/**
 * Initiates dragging by setting the current dragged task ID.
 * @function
 * @param {string} id - The ID of the task being dragged.
 */
function startDragging(id) {
  currentDraggedElement = id;
}


/**
 * Allows a dragged item to be dropped by preventing the default behavior.
 * @function
 * @param {Event} ev - The dragover event.
 */
function allowDrop(ev) {
  ev.preventDefault();
}


/**
 * Moves the dragged task to a new section.
 * @function
 * @param {string} section - The section to move the task to (e.g., 'toDo', 'inProgress').
 */
function moveTo(section) {
  let task = allTasks.find(task => task.id === currentDraggedElement);
  if (!task) {
    console.error(`Task with id ${currentDraggedElement} not found`);
    return;
  }
  task.section = section;
  renderAllTasks();
  saveTasksToLocalStorage();
}


/**
 * Truncates the task description to a specified word limit.
 * @function
 * @param {string} description - The task description to truncate.
 * @param {number} wordLimit - The maximum number of words to display.
 * @returns {string} The truncated description.
 */
function truncateDescription(description, wordLimit) {
  let words = (typeof description === 'string' ? description.split(' ') : []);
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(' ') + '...'
    : description;
}


/**
 * Loads and assigns members to tasks, then renders the tasks.
 * @async
 * @function
 */
async function showMembers() {
  try {
    let response = await fetch(userURL + '.json');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let users = await response.json();
    if (allTasks.some(task => !task.assignedTo || task.assignedTo.length === 0)) {
      assignAndDisplayInitials(users);
    }
    renderAllTasks();
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
  saveTasksToLocalStorage();
}


/**
 * Assigns random members to tasks and updates the task display.
 * @function
 * @param {Array<Object>} users - Array of user objects to assign to tasks.
 */
function assignAndDisplayInitials(users) {
  allTasks.forEach(task => {
    let randomMembers = getRandomMembers(users, 2, 3);
    task.assignedTo = randomMembers.map(user => ({
      initials: getInitials(user.name),
      name: user.name,
      bgColor: user.color
    }));

    let taskElement = document.querySelector(`#task-${task.id} .assignedTo`);
    if (taskElement) {
      taskElement.innerHTML = task.assignedTo.map(member => `
        <div class="assignedUser" style="background-color: ${member.bgColor};">
          <span class="userInitials">${member.initials}</span>
        </div>`
      ).join('');
    }
  });
  saveTasksToLocalStorage();
}


/**
 * Selects a random number of users from the provided array.
 * @function
 * @param {Array<Object>} users - Array of user objects to select from.
 * @param {number} min - Minimum number of users to select.
 * @param {number} max - Maximum number of users to select.
 * @returns {Array<Object>} An array of randomly selected user objects.
 */
function getRandomMembers(users, min, max) {
  let shuffled = users.sort(() => 0.5 - Math.random());
  let count = Math.floor(Math.random() * (max - min + 1)) + min;
  return shuffled.slice(0, count);
}


/**
 * Gets the initials of a user's name.
 * @function
 * @param {string} name - The full name of the user.
 * @returns {string} The initials of the user.
 */
function getInitials(name) {
  if (!name) return '';
  let nameParts = name.trim().split(/\s+/);
  return nameParts.slice(0, 2).map(part => part.charAt(0).toUpperCase()).join('');
}


/**
 * Generates the HTML for a task element.
 * @function
 * @param {Object} element - The task object containing details to render.
 * @returns {string} The HTML string for the task element.
 */
function generateTasksHTML(element) {
  let { category, title, description, subtasks = [], prio, id, assignedTo = [] } = element;
  let categoryClass = formatCategoryClass(category);
  let truncatedDescription = truncateDescription(description, 7);
  let subtaskHTML = generateSubtaskHTML(subtasks);
  let assignedMembersHTML = generateAssignedMembersHTML(assignedTo);
  return `
    <div id="task-${id}" draggable="true" ondragstart="startDragging('${id}')"ondragover="allowDrop(event)" ondrop="moveTo('${element.section}')"class="task" onclick="showTaskDetail('${id}')">
      <div class="category ${categoryClass}">${category}</div>
      <div class="title">${title}</div>
      <div class="description">${truncatedDescription}</div>
      ${subtaskHTML}
      <div class="assignedToAndPrio">
        <div class="assignedTo">${assignedMembersHTML}</div>
        <img src="${prio}" alt="PriorityImage" class="priority-icon">
      </div>
    </div>
  `;
}


/**
 * Formats the category string by removing spaces.
 * @function
 * @param {string} category - The category name to format.
 * @returns {string} The formatted category string.
 */
function formatCategoryClass(category) {
  return category ? category.replace(/\s+/g, '') : '';
}


/**
 * Generates the HTML for the subtask section of a task.
 * @function
 * @param {Array<Object>} subtasks - The array of subtasks for the task.
 * @returns {string} The HTML string for the subtask section.
 */
function generateSubtaskHTML(subtasks) {
  if (subtasks.length === 0) return '';

  let subtaskCount = subtasks.length;
  let completedSubtasks = subtasks.filter(s => s.completed).length;
  let subtaskBarWidth = (completedSubtasks / subtaskCount) * 100;

  return `
    <div class="subtasks">
      <div class="subtaskBarContainer">
        <div class="subtaskBar" style="width: ${subtaskBarWidth}%"></div>
      </div>
      <span class="subtaskCount">${completedSubtasks}/${subtaskCount} Subtasks</span>
    </div>`;
}


/**
 * Generates the HTML for displaying the assigned members of a task.
 * @function
 * @param {Array<Object>} assignedTo - The array of assigned members for the task.
 * @returns {string} The HTML string for the assigned members section.
 */
function generateAssignedMembersHTML(assignedTo) {
  return assignedTo.map(member => `
    <div class="assignedUser" style="background-color: ${member.bgColor};">
      <span class="userInitials">${member.initials}</span>
    </div>`).join('');
}


/**
 * Adds an event listener that triggers the loadTasks function once the DOM is fully loaded.
 * This ensures that the tasks are loaded and rendered only after the HTML structure is available.
 *
 * @event DOMContentLoaded
 * @function loadTasks
 */
document.addEventListener('DOMContentLoaded', loadTasks);