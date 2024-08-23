function showTaskDetail(id) {
  const task = findTaskById(id);
  if (!task) return;

  renderTaskDetails(task);
  openTask();
}

function findTaskById(id) {
  const element = allTasks.find(task => task.id === id);
  if (!element) {
    console.error("Task not found with id:", id);
  }
  return element;
}

function renderTaskDetails(task) {
  const taskContent = document.getElementById('taskDetailCard');
  taskContent.innerHTML = generateTaskDetailHTML(
    task.category, 
    task.title, 
    task.description, 
    task.date,
    task.prioName,
    task.prio, 
    task.assignedMembers, // Hier wurde 'assignedTo' durch 'assignedMembers' ersetzt
    renderSubtasks(task.subtasks) // Erstelle Subtasks HTML hier
  );
}


function openTask() {
  document.getElementById('containerTasksDetail').classList.remove('d-none');
}


function closeTask() {
  document.getElementById('containerTasksDetail').classList.add('d-none');
}


function updateSubtaskStatus(subtaskIndex, subtaskTitle) {
  const task = allTasks.find(t => t.subtasks.includes(subtaskTitle));
  if (!task) return;

  // Toggle den Status der Checkbox im UI (wir nehmen an, dass es keine persistente Speicherung gibt)
  const checkbox = document.getElementById(`subtask-${subtaskIndex}`);
  const isChecked = checkbox.checked;

  // Falls du den Zustand im localStorage oder in einem Array speichern möchtest:
  if (isChecked) {
      task.completedSubtasks = task.completedSubtasks || [];
      task.completedSubtasks.push(subtaskTitle);
  } else {
      task.completedSubtasks = task.completedSubtasks.filter(subtask => subtask !== subtaskTitle);
  }

  // Aktualisiere die Fortschrittsanzeige
  updateTaskProgress(task.id);
}

function updateTaskProgress(taskId) {
  const task = allTasks.find(t => t.id === taskId);
  if (!task) return;

  const completedSubtasks = task.completedSubtasks ? task.completedSubtasks.length : 0;
  const subtaskCount = task.subtasks.length;
  const subtaskBarWidth = (completedSubtasks / subtaskCount) * 100;

  const taskElement = document.getElementById(`task-${taskId}`);
  if (taskElement) {
      const subtaskBar = taskElement.querySelector('.subtaskBar');
      if (subtaskBar) {
          subtaskBar.style.width = `${subtaskBarWidth}%`;
      }
      const subtaskCountDisplay = taskElement.querySelector('.subtaskCount');
      if (subtaskCountDisplay) {
          subtaskCountDisplay.innerText = `${completedSubtasks}/${subtaskCount} Subtasks`;
      }
  }

  // Optional: Speichere den Fortschritt im localStorage
  saveTasksToLocalStorage();
}



function renderSubtasks(subtasks) {
  if (!subtasks || subtasks.length === 0) return '';

  return subtasks.map((subtask, index) => `
      <div class="subtask">
          <input type="checkbox" id="subtask-${index}" onchange="updateSubtaskStatus(${index}, '${subtask}')" />
          <label for="subtask-${index}">${subtask}</label>
      </div>
  `).join('');
}


function generateTaskDetailHTML(category, title, description, date, prioName, prio, assignedTo, subtasks) {
  const categoryClass = category.replace(/\s+/g, '');
  const assignedMembersHTML = assignedTo.map(name => {
      const initials = getInitials(name);
      const bgColor = getRandomColor();  // Beispielhafte Funktion, um eine zufällige Farbe zu generieren
      return `
          <div class="assigned-member">
              <div class="assigned-user" style="background-color: ${bgColor};">
                  <span class="user-initials">${initials}</span>
              </div>
              <span class="user-name">${name}</span>
          </div>`;
  }).join('');

  return `
      <div class="detailtask">
          <div class="categoryAndClose">
              <div class="category ${categoryClass}">${category}</div>
              <img onclick="closeTask()" src="/assets/icons/close.png" alt="Close">
          </div>
          <div class="titleDetail">${title}</div>
          <div class="descriptionDetail">${description}</div>
          <div>Due date: ${date}</div>
          <div>Priority:
              ${prioName}
              <img src="${prio}" alt="PriorityImage">
          </div>
          <div class="assignedTo">${assignedMembersHTML}</div>
          <div class="subtasksDetail">${renderSubtasks(subtasks)}</div>
      </div>`;
}

