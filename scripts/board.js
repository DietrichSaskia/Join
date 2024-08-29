let contactAllArray = [];
let currentDraggedElement;

function loadAll() {
  loadMembers();
  loadTasks();
}

function loadMembers() {
  let contactAsText = localStorage.getItem('contactAllArray');
  if (contactAsText) {
    contactAllArray = JSON.parse(contactAsText);  // Füllt das globale Array
  }
  getUsers(contactAllArray);
  console.log(contactAllArray);  // Gibt das globale Array aus
}

function loadTasks() {
  let tasksAsText = localStorage.getItem('taskAllArray');
  if (tasksAsText) {
    taskAllArray = JSON.parse(tasksAsText);
  }
  getTasks(taskAllArray);
  console.log(taskAllArray);
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



function renderSection(sectionName, containerId) {
  let container = document.getElementById(containerId);
  container.innerHTML = '';
  let formattedSectionName = sectionName.charAt(0).toUpperCase() + sectionName.slice(1).replace(/([A-Z])/g, ' $1').trim();
  let tasksFound = false;

  for (let i = 0; i < taskAllArray.length; i++) {
    let task = taskAllArray[i];
    if (task.section === sectionName) {
      container.innerHTML += generateTasksHTML(task, i);
      tasksFound = true;
    }
  }
  if (!tasksFound) {
    container.innerHTML = `<div class="noTasks">Keine Aufgaben in ${formattedSectionName}</div>`;
  }
}

function startDragging(taskIndex) {
  currentDraggedElement = taskIndex;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function moveTo(section) {
  if (typeof currentDraggedElement === 'number' && currentDraggedElement >= 0 && currentDraggedElement < taskAllArray.length) {
    let task = taskAllArray[currentDraggedElement];
    task.section = section;
    renderAllTasks();
    saveTasksToLocalStorage();
  } else {
    console.error('Aufgabe nicht gefunden');
  }
}

function truncateDescription(description, wordLimit) {
  let words = (typeof description === 'string' ? description.split(' ') : []);
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(' ') + '...'
    : description;
}

function assignAndDisplayInitials(users) {
  taskAllArray.forEach(task => {
    let randomMembers = getRandomMembers(users, 2, 3);
    task.assignedTo = randomMembers.map(user => ({
      initials: getInitials(user.name),
      name: user.name,
      bgColor: user.color
    }));

    let taskElement = document.querySelector(`.task[data-task='${task.title}'] .assignedTo`);
    if (taskElement) {
      taskElement.innerHTML = task.assignedTo.map(member => `
        <div class="assignedUser" style="background-color: ${member.bgColor};">
          <span class="userInitials">${member.initials}</span>
        </div>
      `).join('');
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

function generateTasksHTML(element, i) {
  let { category, title, description, subtasks = [], prio, assignedTo = [] } = element;
  let categoryClass = formatCategoryClass(category);
  let truncatedDescription = truncateDescription(description, 7);
  let subtaskHTML = generateSubtaskProgressHTML(subtasks, i);
  let assignedMembersHTML = generateAssignedMembersHTML(assignedTo);
  
  return `
   <div class="task" draggable="true" data-task="${title}" ondragstart="startDragging(${i})" ondragover="allowDrop(event)" ondrop="moveTo('${element.section}')" onclick="showTaskDetail(${i})">
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

function generateSubtaskProgressHTML(subtasks, taskIndex) {
  if (subtasks.length === 0) return '';
  let subtaskCount = subtasks.length;
  let completedSubtasks = subtasks.filter(subtask => subtask.completed).length;
  let subtaskBarWidth = (completedSubtasks / subtaskCount) * 100;
  return `
    <div class="subtasks">
      <div class="subtaskBarContainer">
        <div class="subtaskBar" id="subtaskBar${taskIndex}" style="width: ${subtaskBarWidth}%"></div>
      </div>
      <span class="subtaskCount">${completedSubtasks}/${subtaskCount} Unteraufgaben</span>
    </div>`;
}

function generateSubtaskItemsHTML(subtasks, taskIndex) {
  if (subtasks.length === 0) return '';
  let subtaskItems = '';

  for (let i = 0; i < subtasks.length; i++) {
    let subtask = subtasks[i];
    subtaskItems += `
      <div>
        <input type="checkbox" id="subtask-${taskIndex}-${i}" ${subtask.completed ? 'checked' : ''} onchange="updateSubtaskStatus(${taskIndex}, ${i})">
        <label for="subtask-${taskIndex}-${i}">Subtask ${i}</label>
      </div>
    `;
  }
  return subtaskItems;
}

function renderTaskWithSubtasks(task, taskIndex) {
  const progressHTML = generateSubtaskProgressHTML(task.subtasks, taskIndex);
  const itemsHTML = generateSubtaskItemsHTML(task.subtasks, taskIndex);
  return `
    <div class="task">
      <div class="task-header">${task.title}</div>
      ${progressHTML}
      <div class="subtask-items">${itemsHTML}</div>
    </div>`;
}

function generateAssignedMembersHTML(assignedTo) {
  return assignedTo.map(member => `
    <div class="assignedUser" style="background-color: ${member.bgColor};">
      <span class="userInitials">${member.initials}</span>
    </div>`).join('');
}
