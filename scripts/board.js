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

    renderToDos();
    renderInProgress();
    renderAwaitFeedback();
    renderDone();
  } catch (error) {
    console.error("Fehler beim Laden der Aufgaben:", error);
  }
}

loadTasks();


function renderToDos() {
  let toDo = allTasks.filter(function(t) {
    return t['section'] === 'toDo';
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
  let inProgress = allTasks.filter(function(t) {
    return t['section'] === 'inProgress';
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
  let awaitFeedback = allTasks.filter(function(t) {
    return t['section'] === 'awaitFeedback';
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
  let done = allTasks.filter(function(t) {
    return t['section'] === 'done';
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



async function moveTo(section) {
  let task = allTasks.find(task => task.id === currentDraggedElement);
  
  if (task) {
    task.section = section;
    
    try {
      await updateTaskSectionInDB(task.id, section);
      renderToDos();
      renderInProgress();
      renderAwaitFeedback();
      renderDone();
    } catch (error) {
      console.error('Failed to update task section in the database:', error);
    }
  } else {
    console.error('Task not found for id:', currentDraggedElement);
  }
}


async function updateTaskSectionInDB(taskId, section) {
  const url = `${taskUrl}${taskId}.json`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ section: section })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
}


function truncateDescription(description, wordLimit) {
  let words = description.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return description;
}


function getInitials(names) {
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
}


function truncateDescription(description, wordLimit) {
  const words = description.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return description;
}


function generateTasksHTML(element) {
  let categoryClass = element['category'].replace(/\s+/g, '');
  let title = element['title'].replace(/"/g, '&quot;');
  let truncatedDescription = truncateDescription(element['description'], 7);
  let initials = getInitials(element['assignedTo']);

  return /*html*/`
  <div draggable="true" ondragstart="startDragging(${element['id']})" class="task" onclick="showTaskDetail(${element['id']})">
    <div class="category ${categoryClass}">${element['category']}</div>
    <div class="title">${title}</div>
    <div class="description">${truncatedDescription}</div>
    <div class="subtasks"></div>
    <div class="assignedToAndPrio">
      <div class="assignedTo">${initials}</div>
      <img src="${element['prio']}" alt="PriorityImage">
    </div>
  </div>
  `;
}


function showTaskDetail(id) {
  let element = allTasks.find(task => task.id === id);
  if (!element) {
    console.error("Task not found with id:", id);
    return;
  }

  let taskContent = document.getElementById('containerTasksDetail');
  taskContent.innerHTML = '';

  taskContent.innerHTML += generateTaskDetailHTML(
    element.category, 
    element.title, 
    element.description, 
    element.prio, 
    element.assignedTo, 
    element.subtasks
  );
  openTask();
}

function openTask() {
  document.getElementById('containerTasksDetail').classList.remove('d-none');
}


function closeTask() {
  document.getElementById('containerTasksDetail').classList.add('d-none');
}


function generateTaskDetailHTML(category, title, description, prio, assignedTo, subtasks) {
  let categoryClass = category.replace(/\s+/g, '');
  let initials = getInitials(assignedTo);

  return /*html*/`
  <div class="detailtask">
    <div>
      <div class="category ${categoryClass}">${categoryClass}</div>
      <button onclick="closeTask()"><img src="/assets/icons/close.png" alt="Close"></button>
    </div>
    <div class="titleDetail">${title}</div>
    <div class="descriptionDetail">${description}</div>
    <div>Due date: Date</div>
    <div class="subtasksDetail">${subtasks}</div>
    <div class="assignedToAndPrio">
      <div class="assignedTo">${initials}</div>
      <img src="${prio}" alt="PriorityImage">
    </div>
  </div>
  `;
}





