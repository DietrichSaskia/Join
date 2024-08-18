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
    allTasks = Array.isArray(responseToJson) ? responseToJson : [responseToJson];
    console.log(allTasks);

    renderToDos();
    renderInProgress();
    renderAwaitFeedback();
    renderDone();
  } catch (error) {
    console.error("Fehler beim Laden der Aufgaben:", error);
  }
}


function renderToDos() {
  let toDo = allTasks.filter(function(t) {
    return t['section'] == 'toDo';
  });
  document.getElementById('toDo').innerHTML = '';

  for (let index = 0; index < toDo.length; index++) {
    let element = toDo[index];
    document.getElementById('toDo').innerHTML += generateTasksHTML(element);
  }
}


function renderInProgress(){
  let inProgress = allTasks.filter(function(t) {
    return t['section'] == 'inProgress';
  });
  document.getElementById('inProgress').innerHTML = '';

  for (let index = 0; index < inProgress.length; index++) {
    let element = inProgress[index];
    document.getElementById('inProgress').innerHTML += generateTasksHTML(element);
  }
}


function renderAwaitFeedback(){
  let awaitFeedback = allTasks.filter(function(t) {
    return t['section'] == 'awaitFeedback';
  });
  document.getElementById('awaitFeedback').innerHTML = '';

  for (let index = 0; index < awaitFeedback.length; index++) {
    let element = awaitFeedback[index];
    document.getElementById('awaitFeedback').innerHTML += generateTasksHTML(element);
  }
}


function renderDone(){
  let done = allTasks.filter(function(t) {
    return t['section'] == 'done';
  });
  document.getElementById('done').innerHTML = '';

  for (let index = 0; index < done.length; index++) {
    let element = done[index];
    document.getElementById('done').innerHTML += generateTasksHTML(element);
  }
}


function startDragging(index) {
  currentDraggedIndex = index;
}


function allowDrop(ev) {
  ev.preventDefault();
}


function moveTo(section) {
  if (currentDraggedElement && allTasks[currentDraggedElement]) {
    allTasks[currentDraggedElement]['section'] = section;
    renderToDos();
    renderInProgress();
    renderAwaitFeedback();
    renderDone();
  } else {
    console.error('Current dragged element is not defined or not found in allTasks.');
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


function generateTasksHTML(element, index) {
  let categoryClass = element['category'].replace(/\s+/g, '');
  let title = element['title'].replace(/"/g, '&quot;');
  let truncatedDescription = truncateDescription(element['description'], 7);
  let initials = getInitials(element['assignedTo']);

  return /*html*/`
  <div draggable="true" ondragstart="startDragging('${index}')" class="task" onclick="openTask(${index})">
    <div class="category ${categoryClass}">${element['category']}</div>
    <div class="title">${element['title']}</div>
    <div class="description">${truncatedDescription}</div>
    <div class="subtasks"></div>
    <div class="assignedToAndPrio">
      <div class="assignedTo">${initials}</div>
      <img src="${element['prio']}" alt="PriorityImage">
    </div>
  </div>
  `;
}


