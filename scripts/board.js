let allTasks = [];
let currentDraggedElement;


let taskUrl = 'https://join-317-default-rtdb.europe-west1.firebasedatabase.app/tasksAll/';
let userURL = 'https://join-317-default-rtdb.europe-west1.firebasedatabase.app/contactall';


async function loadTasks() {
  try {
    allTasks = JSON.parse(localStorage.getItem('allTasks')) || await fetchTasksFromAPI();
    renderAllTasks();
  } catch (error) {
    console.error("Fehler beim Laden der Aufgaben:", error);
  }
  await showMembers();
}


async function fetchTasksFromAPI() {
  let response = await fetch(`${taskUrl}.json`);
  if (!response.ok) throw new Error(`HTTP-Fehler! Status: ${response.status}`);
  
  let responseToJson = await response.json();
  let tasks = Array.isArray(responseToJson) ? responseToJson : Object.values(responseToJson);
  
  localStorage.setItem('allTasks', JSON.stringify(tasks));
  
  return tasks;
}


function saveTasksToLocalStorage() {
  localStorage.setItem('allTasks', JSON.stringify(allTasks));
}


function renderAllTasks() {
  renderSection('toDo', 'toDo');
  renderSection('inProgress', 'inProgress');
  renderSection('awaitFeedback', 'awaitFeedback');
  renderSection('done', 'done');
}


function renderSection(sectionName, containerId) {
  let tasks = allTasks.filter(task => task.section === sectionName);
  let container = document.getElementById(containerId);
  container.innerHTML = '';
  let formattedSectionName = sectionName.charAt(0).toUpperCase() + sectionName.slice(1).replace(/([A-Z])/g, ' $1').trim();

  if (tasks.length === 0) {
    container.innerHTML = `<div class="noTasks">No tasks ${formattedSectionName}</div>`;
  } else {
    tasks.forEach(task => {
      container.innerHTML += generateTasksHTML(task);
    });
  }
}


function startDragging(id) {
  currentDraggedElement = id;
}


function allowDrop(ev) {
  ev.preventDefault();
}


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


function truncateDescription(description, wordLimit) {
  let words = (typeof description === 'string' ? description.split(' ') : []);
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(' ') + '...'
    : description;
}


async function showMembers() {
  try {
    let response = await fetch(userURL + '.json');
    if (!response.ok) {
      throw new Error(`HTTP-Fehler! Status: ${response.status}`);
    }
    let users = await response.json();
    if (allTasks.some(task => !task.assignedTo || task.assignedTo.length === 0)) {
      assignAndDisplayInitials(users);
    }
    renderAllTasks();
  } catch (error) {
    console.error("Fehler beim Abrufen der Benutzerdaten:", error);
  }
  saveTasksToLocalStorage();
}


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


function getRandomMembers(users, min, max) {
  let shuffled = users.sort(() => 0.5 - Math.random());
  let count = Math.floor(Math.random() * (max - min + 1)) + min;
  return shuffled.slice(0, count);
}


function getInitials(name) {
  if (!name) return '';
  let nameParts = name.trim().split(/\s+/);
  return nameParts.slice(0, 2).map(part => part.charAt(0).toUpperCase()).join('');
}


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


function formatCategoryClass(category) {
  return category ? category.replace(/\s+/g, '') : '';
}


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


function generateAssignedMembersHTML(assignedTo) {
  return assignedTo.map(member => `
    <div class="assignedUser" style="background-color: ${member.bgColor};">
      <span class="userInitials">${member.initials}</span>
    </div>`).join('');
}


loadTasks();
