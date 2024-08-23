let allTasks = [];
let currentDraggedElement;

const taskUrl = 'https://join-317-default-rtdb.europe-west1.firebasedatabase.app/tasksAll/';
const userURL = 'https://join-317-default-rtdb.europe-west1.firebasedatabase.app/contactall';

async function loadTasks() {
  try {
    let storedTasks = localStorage.getItem('allTasks');
    if (storedTasks) {
      // Wenn Aufgaben im Local Storage vorhanden sind, lade diese
      allTasks = JSON.parse(storedTasks);
    } else {
      // Wenn keine Aufgaben im Local Storage vorhanden sind, lade von der API
      let response = await fetch(taskUrl + '.json');
      if (!response.ok) {
        throw new Error(`HTTP-Fehler! Status: ${response.status}`);
      }
      let responseToJson = await response.json();
      allTasks = Array.isArray(responseToJson) ? responseToJson : Object.values(responseToJson);
    }
    console.log(allTasks);

    renderToDos();
    renderInProgress();
    renderAwaitFeedback();
    renderDone();
  } catch (error) {
    console.error("Fehler beim Laden der Aufgaben:", error);
  }
  await showMembers();
}


loadTasks();


/*function renderSections() {
  ['toDo', 'inProgress', 'awaitFeedback', 'done'].forEach(section => {
    let tasks = allTasks.filter(t => t['section'] === section);
    let container = document.getElementById(section);
    container.innerHTML = tasks.length 
      ? tasks.map(generateTasksHTML).join('')
      : `<div class="noTasks">No tasks ${capitalizeFirstLetter(section)}</div>`;
  });
}*/


/*function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}*/


function renderToDos() {
  let toDo = allTasks.filter(function(element) {
    return element['section'] === 'toDo';
  });
  
  let container = document.getElementById('toDo');
  container.innerHTML = '';

  if (toDo.length === 0) {
    container.innerHTML = '<div class="noTasks">No tasks To Do</div>';
  } else {
    for (let index = 0; index < toDo.length; index++) {
      let element = toDo[index];
      container.innerHTML += generateTasksHTML(element);
    }
  }
}


function renderInProgress() {
  let inProgress = allTasks.filter(function(element) {
    return element['section'] === 'inProgress';
  });

  let container = document.getElementById('inProgress');
  container.innerHTML = '';

  if (inProgress.length === 0) {
    container.innerHTML = '<div class="noTasks">No tasks in Progress</div>';
  } else {
    for (let index = 0; index < inProgress.length; index++) {
      let element = inProgress[index];
      container.innerHTML += generateTasksHTML(element);
    }
  }
}


function renderAwaitFeedback() {
  let awaitFeedback = allTasks.filter(function(element) {
    return element['section'] === 'awaitFeedback';
  });

  let container = document.getElementById('awaitFeedback');
  container.innerHTML = '';

  if (awaitFeedback.length === 0) {
    container.innerHTML = '<div class="noTasks">No tasks Await Feedback</div>';
  } else {
    for (let index = 0; index < awaitFeedback.length; index++) {
      let element = awaitFeedback[index];
      container.innerHTML += generateTasksHTML(element);
    }
  }
}


function renderDone() {
  let done = allTasks.filter(function(element) {
    return element['section'] === 'done';
  });
  
  let container = document.getElementById('done');
  container.innerHTML = '';

  if (done.length === 0) {
    container.innerHTML = '<div class="noTasks">No tasks Done</div>';
  } else {
    for (let index = 0; index < done.length; index++) {
      let element = done[index];
      container.innerHTML += generateTasksHTML(element);
    }
  }
}


function startDragging(id) {
  currentDraggedElement = id;
}


function allowDrop(ev) {
  ev.preventDefault();
}

function saveTasksToLocalStorage() {
  localStorage.setItem('allTasks', JSON.stringify(allTasks));
}

function loadTasksFromLocalStorage() {
  const storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    allTasks = JSON.parse(storedTasks);
    renderAllTasks(); // Eine Funktion, die alle Aufgaben rendert
  }
}

function renderAllTasks() {
  renderToDos();
  renderInProgress();
  renderAwaitFeedback();
  renderDone();
}

// Beim Laden der Seite
document.addEventListener('DOMContentLoaded', () => {
  loadTasksFromLocalStorage();
  showMembers();
});

function moveTo(section) {
  let task = allTasks.find(task => task.id === currentDraggedElement);
  if (!task) {
    console.error(`Task with id ${currentDraggedElement} not found`);
    return;
  }
  task.section = section;
  renderToDos();
  renderInProgress();
  renderAwaitFeedback();
  renderDone();
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
    if (allTasks.some(task => !task.assignedMembers)) {
      assignAndDisplayInitials(users);
    }
    renderToDos();
    renderInProgress();
    renderAwaitFeedback();
    renderDone();  // Tasks zuerst rendern
  } catch (error) {
    console.error("Fehler beim Abrufen der Benutzerdaten:", error);
  }
  saveTasksToLocalStorage();
}


function assignAndDisplayInitials(users) {
  allTasks.forEach(task => {
    let randomMembers = getRandomMembers(users, 2, 3); // 2-3 zufällige Mitglieder
    task.assignedTo = randomMembers.map(user => ({
      initials: getInitials(user.name),
      name: user.name,
      bgColor: user.color
    }));

    // Finde das HTML-Element für diesen Task über seine ID
    let taskElement = document.querySelector(`#task-${task.id} .assignedTo`);
    if (taskElement) {
      taskElement.innerHTML = task.assignedTo.map(member => `
        <div class="assigned-user" style="background-color: ${member.bgColor};">
          <span class="user-initials">${member.initials}</span>
        </div>`
      ).join('');
    }
  });
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
  let { category, title, description, subtasks = [], prio, id, assignedMembers = [] } = element;
  let categoryClass = (typeof category === 'string') ? category.replace(/\s+/g, '') : '';
  let truncatedDescription = truncateDescription(description, 7);

  let subtaskCount = subtasks.length;
  let completedSubtasks = subtasks.filter(s => s.completed).length;
  let subtaskBarWidth = (subtaskCount > 0) ? (completedSubtasks / subtaskCount) * 100 : 0;

  let subtaskHTML = subtaskCount ? `
    <div class="subtasks">
      <div class="subtaskBarContainer">
        <div class="subtaskBar" style="width: ${subtaskBarWidth}%"></div>
      </div>
      <span class="subtaskCount">${completedSubtasks}/${subtaskCount} Subtasks</span>
    </div>` : '';

    let assignedMembersHTML = assignedMembers.map(initials => `
      <div class="assignedUser" style="background-color: ${initials.bgColor};">
        <span class="userInitials">${initials.initials}</span>
      </div>`
    ).join('');

  return `
  <div id="task-${id}" draggable="true" ondragstart="startDragging('${id}')" ondragover="allowDrop(event)" ondrop="moveTo('${element.section}')" class="task" onclick="showTaskDetail('${id}')">
    <div class="category ${categoryClass}">${category}</div>
    <div class="title">${title}</div>
    <div class="description">${truncatedDescription}</div>
    ${subtaskHTML}
    <div class="assignedToAndPrio">
      <div class="assignedTo">${assignedMembersHTML}</div>  <!-- Initialen werden hier eingefügt -->
      <img src="${prio}" alt="PriorityImage">
    </div>
  </div>`;
}





