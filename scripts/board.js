let allTasks = [];
let currentDraggedElement;

const taskUrl = 'https://join-317-default-rtdb.europe-west1.firebasedatabase.app/tasksAll/';
const userURL = 'https://join-317-default-rtdb.europe-west1.firebasedatabase.app/contactall';

async function loadTasks() {
  try {
    let response = await fetch(taskUrl + '.json');
    if (!response.ok) {
      throw new Error(`HTTP-Fehler! Status: ${response.status}`);
    }
    let responseToJson = await response.json();
    allTasks = Array.isArray(responseToJson) ? responseToJson : Object.values(responseToJson);
    console.log(allTasks);

    renderToDos();
    renderInProgress();
    renderAwaitFeedback();
    renderDone();
  } catch (error) {
    console.error("Fehler beim Laden der Aufgaben:", error);
  }
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


function moveTo(section) {
  let task = allTasks.find(task => task.id === currentDraggedElement);
  if (!task) {
    console.error(`Task with id ${currentDraggedElement} not found`);
    return;
  }
  task.section = section;
  renderSections();
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
    getAssignedTo(users);
  } catch (error) {
    console.error("Fehler beim Abrufen der Benutzerdaten:", error);
  }
}


function getAssignedTo(users) {
  const assignedUsersContainer = document.getElementById('assignedUsers');

  assignedUsersContainer.innerHTML = '';

  users.forEach(user => {
    if (!user || !user.name) {
      return;
    }
    let nameParts = user.name.trim().split(/\s+/);
    let initials = nameParts.slice(0, 2).map(part => part.charAt(0).toUpperCase()).join('');

    assignedUsersContainer.innerHTML += `
      <div class="assigned-user">
        <span class="user-initials">${initials}</span>
      </div>
    `;
  });
}


function generateTasksHTML(element) {
  let { category, title, description, subtasks = [], prio, id } = element;
  let categoryClass = (typeof category === 'string') ? category.replace(/\s+/g, '') : '';
  let truncatedDescription = truncateDescription(description, 7);
  //let initials = getInitials(assignedTo);

  let subtaskCount = subtasks.length;
  let completedSubtasks = subtasks.filter(s => s.completed).length;
  let subtaskBarWidth = (subtaskCount > 0) ? (completedSubtasks / subtaskCount) * 100 : 0;

  let subtaskHTML = subtaskCount ? `
    <div class="subtasks">
      <div class="subtask-bar-container" style="width: 100%; background-color: lightgray; border-radius: 5px; overflow: hidden;">
        <div class="subtask-bar" style="width: ${subtaskBarWidth}%; height: 10px; background-color: blue;"></div>
      </div>
      <span class="subtask-count">${completedSubtasks}/${subtaskCount} Subtasks</span>
    </div>` : '';

  return `
  <div draggable="true" ondragstart="startDragging('${id}')" class="task" onclick="showTaskDetail('${id}')">
    <div class="category ${categoryClass}">${category}</div>
    <div class="title">${title}</div>
    <div class="description">${truncatedDescription}</div>
    ${subtaskHTML}
    <div class="assignedToAndPrio">
      <div class="assignedTo" id="assignedUsers"></div>
      <img src="${prio}" alt="PriorityImage">
    </div>
  </div>`;
}




