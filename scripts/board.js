let allTasks = [];
let currentDraggedElement;

const taskUrl = 'https://join-317-default-rtdb.europe-west1.firebasedatabase.app/tasksAll/';

async function loadTasks() {
  try {
    let response = await fetch(taskUrl + '.json');
    if (!response.ok) {
      throw new Error(`HTTP-Fehler! Status: ${response.status}`);
    }
    let responseToJson = await response.json();
    allTasks = Array.isArray(responseToJson) ? responseToJson : Object.values(responseToJson);
    console.log(allTasks);

    renderSections();
  } catch (error) {
    console.error("Fehler beim Laden der Aufgaben:", error);
  }
}

loadTasks();


function renderSections() {
  ['toDo', 'inProgress', 'awaitFeedback', 'done'].forEach(section => {
    let tasks = allTasks.filter(t => t['section'] === section);
    let container = document.getElementById(section);
    container.innerHTML = tasks.length 
      ? tasks.map(generateTasksHTML).join('')
      : `<div class="noTasks">No tasks ${capitalizeFirstLetter(section)}</div>`;
  });
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function startDragging(id) {
  currentDraggedElement = id;
}


function allowDrop(ev) {
  ev.preventDefault();
}


async function moveTo(section) {
  let task = allTasks.find(task => task.id === currentDraggedElement);

  if (!task) {
    console.error(`Task with id ${currentDraggedElement} not found`);
    return;
  }

  task.section = section;

  try {
    await updateTaskSectionInDB(task.id, section);
    renderSections(); // Re-render all sections
  } catch (error) {
    console.error(`Failed to update task (id: ${task.id}) section to "${section}":`, error);
  }
}


async function updateTaskSectionInDB(taskId, section) {
  const url = `${taskUrl}${taskId}.json`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ section })
  });

  if (!response.ok) {
    throw new Error(`Failed to update task (id: ${taskId}) section to "${section}". Status: ${response.status}`);
  }
}


function truncateDescription(description, wordLimit) {
  let words = (typeof description === 'string' ? description.split(' ') : []);
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(' ') + '...'
    : description;
}


/*function getInitials(names) {
  let initials = [];
  for (let i = 0; i < names.length; i++) {
    let name = names[i];
    let nameParts = name.split(' ');
    if (nameParts.length < 2) {
      initials.push(nameParts[0].charAt(0).toUpperCase());
    } else {
      let initialsPart = '';
      for (let j = 0; j < nameParts.length; j++) {
        initialsPart += nameParts[j].charAt(0).toUpperCase();
      }
      initials.push(initialsPart);
    }
  }
  return initials.join(' ');
}*/


function generateTasksHTML(element) {
  let { category, title, description, assignedTo, subtasks = [], prio, id } = element;
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
      <div class="assignedTo">${element['assignedTo']}</div>
      <img src="${prio}" alt="PriorityImage">
    </div>
  </div>`;
}




