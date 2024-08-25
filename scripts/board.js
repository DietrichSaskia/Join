// Eine leere Liste, um alle Aufgaben zu speichern
let allTasks = [];

// Variable, um das gerade gezogene Element zu speichern
let currentDraggedElement;

// URLs, um Aufgaben und Benutzer aus einer Datenbank zu laden
let taskUrl = 'https://join-317-default-rtdb.europe-west1.firebasedatabase.app/tasksAll/';
let userURL = 'https://join-317-default-rtdb.europe-west1.firebasedatabase.app/contactall';

// Funktion, um Aufgaben zu laden, entweder aus dem lokalen Speicher oder von einem Server
async function loadTasks() {
  try {
    // Lade Aufgaben entweder aus dem lokalen Speicher oder vom Server
    let storedTasks = localStorage.getItem('allTasks');
    if (!storedTasks) {
      let response = await fetch(taskUrl + '.json');
      if (!response.ok) throw new Error(`HTTP-Fehler! Status: ${response.status}`);
      
      let responseToJson = await response.json();
      allTasks = Array.isArray(responseToJson) ? responseToJson : Object.values(responseToJson);
    } else {
      allTasks = JSON.parse(storedTasks);
    }
    renderSections();
    await showMembers(); // Zeige Benutzer nach dem Laden der Aufgaben
  } catch (error) {
    console.error("Fehler beim Laden der Aufgaben:", error);
  }
}

// Warte, bis das HTML-Dokument vollständig geladen ist, bevor die Aufgaben geladen werden
document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
});

// Funktion, um die Aufgaben in den verschiedenen Abschnitten (toDo, inProgress, etc.) zu zeigen
function renderSections() {
  // Gehe durch die verschiedenen Abschnitte
  ['toDo', 'inProgress', 'awaitFeedback', 'done'].forEach(section => {
    let container = document.getElementById(section);
    if (!container) {
      console.error(`Container mit ID "${section}" nicht gefunden.`);
      return;
    }
    // Filtere die Aufgaben nach dem Abschnitt, in dem sie sich befinden
    let tasks = allTasks.filter(t => t['section'] === section);
    // Wenn Aufgaben vorhanden sind, zeige sie an, ansonsten zeige eine Nachricht an
    container.innerHTML = tasks.length 
      ? tasks.map(generateTasksHTML).join('')
      : `<div class="noTasks">No tasks ${capitalizeFirstLetter(section)}</div>`;
  });
}

// Funktion, um den ersten Buchstaben eines Wortes groß zu schreiben
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Funktion, die aufgerufen wird, wenn ein Ziehvorgang beginnt
function startDragging(id) {
  currentDraggedElement = id;
}

// Erlaubt das Ablegen eines gezogenen Elements
function allowDrop(ev) {
  ev.preventDefault();
}

// Speichert die aktuellen Aufgaben im lokalen Speicher des Browsers
function saveTasksToLocalStorage() {
  localStorage.setItem('allTasks', JSON.stringify(allTasks));
}

// Lädt Aufgaben aus dem lokalen Speicher und zeigt sie an
function loadTasksFromLocalStorage() {
  let storedTasks = localStorage.getItem('allTasks');
  if (storedTasks) {
    allTasks = JSON.parse(storedTasks);
    renderSections();
  }
}

// Funktion, um eine Aufgabe in einen anderen Abschnitt zu verschieben
function moveTo(section) {
  let task = allTasks.find(task => task.id === currentDraggedElement);
  if (!task) {
    console.error(`Task with id ${currentDraggedElement} not found`);
    return;
  }
  task.section = section; // Ändere den Abschnitt der Aufgabe
  renderSections(); // Zeige die aktualisierten Aufgaben an
  saveTasksToLocalStorage(); // Speichere die Änderungen
}

// Funktion, um die Beschreibung einer Aufgabe auf eine bestimmte Anzahl von Wörtern zu kürzen
function truncateDescription(description, wordLimit) {
  let words = (typeof description === 'string' ? description.split(' ') : []);
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(' ') + '...'
    : description;
}

// Funktion, um Benutzer von einem Server zu laden und ihnen Aufgaben zuzuweisen
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
    renderSections();
  } catch (error) {
    console.error("Fehler beim Abrufen der Benutzerdaten:", error);
  }
  saveTasksToLocalStorage();
}

// Funktion, um das HTML für die zugewiesenen Mitglieder einer Aufgabe zu generieren
function generateAssignedMembersHTML(assignedMembers) {
  return assignedMembers.map(member => `
    <div class="assignedUser" style="background-color: ${member.bgColor};">
      <span class="userInitials">${getInitials(member.name)}</span>
    </div>`
  ).join('');
}

// Funktion, um die Initialen eines Namens zu erhalten
function getInitials(name) {
  if (!name) return '';
  let nameParts = name.trim().split(/\s+/);
  return nameParts.slice(0, 2).map(part => part.charAt(0).toUpperCase()).join('');
}

// Funktion, um das HTML für eine Aufgabe zu erstellen
function generateTasksHTML(element) {
  let { category, title, description, subtasks = [], prio, id, assignedTo = [] } = element;
  let categoryClass = (typeof category === 'string') ? category.replace(/\s+/g, '') : '';
  let truncatedDescription = truncateDescription(description, 7);

  // Verwende die ausgelagerte Funktion für die Subtasks
  let subtaskHTML = generateSubtaskHTML(subtasks);

  return `
  <div id="task-${id}" draggable="true" ondragstart="startDragging('${id}')" ondragover="allowDrop(event)" ondrop="moveTo('${element.section}')" class="task" onclick="showTaskDetail(${id})">
    <div class="category ${categoryClass}">${category}</div>
    <div class="title">${title}</div>
    <div class="description">${truncatedDescription}</div>
    ${subtaskHTML}
    <div class="assignedToAndPrio">
      <div class="assignedTo">${generateAssignedMembersHTML(assignedTo)}</div>
      <img src="${prio}" alt="PriorityImage">
    </div>
  </div>`;
}

function generateSubtaskHTML(subtasks) {
  let subtaskCount = subtasks.length;
  let completedSubtasks = subtasks.filter(s => s.completed).length;
  let subtaskBarWidth = (subtaskCount > 0) ? (completedSubtasks / subtaskCount) * 100 : 0;

  return subtaskCount ? `
    <div class="subtasks">
      <div class="subtaskBarContainer">
        <div class="subtaskBar" style="width: ${subtaskBarWidth}%"></div>
      </div>
      <span class="subtaskCount">${completedSubtasks}/${subtaskCount} Subtasks</span>
    </div>` : '';
}

