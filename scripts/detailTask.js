function showTaskDetail(taskIndex) {
  let task = allTasks[taskIndex];
  console.log('Task:', task);
  renderTaskDetails(task, taskIndex);
  openTask();
}

function renderTaskDetails(task, taskIndex) {
  console.log('Rendering task details:', task);
  let taskContent = document.getElementById('taskDetailCard');
  taskContent.innerHTML = generateTaskDetailHTML(
    task.category, 
    task.title, 
    task.description, 
    task.date,
    task.prioName,
    task.prio, 
    task.assignedTo,
    renderSubtasks(taskIndex, task.subtasks)
  );
}


function openTask() {
  document.getElementById('containerTasksDetail').classList.remove('d-none');
}


function closeTask() {
  document.getElementById('containerTasksDetail').classList.add('d-none');
}


function renderSubtasks(taskIndex, subtasks) {
  if (!subtasks || subtasks.length === 0) return '';

  return subtasks.map((subtask, index) => `
    <div class="subtask">
      <input type="checkbox" id="subtask-${index}" onchange="updateSubtaskStatus(${taskIndex}, ${index}, '${subtask}')" />
      <label for="subtask-${index}">${subtask}</label>
    </div>
  `).join('');
}

function updateSubtaskStatus(taskIndex, subtaskIndex) {
  const task = allTasks[taskIndex];
  if (!task) return;

  let checkbox = document.getElementById(`subtask-${taskIndex}-${subtaskIndex}`);
  if (!checkbox) {
    console.error(`Checkbox with ID subtask-${taskIndex}-${subtaskIndex} not found!`);
    return;
  }

  let isChecked = checkbox.checked;
  task.subtasks[subtaskIndex].completed = isChecked;

  // Aktualisiere den Fortschritt
  updateTaskProgress(taskIndex, task);
  saveTasksToLocalStorage();
}

function updateTaskProgress(taskIndex, task) {
  let completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length;
  let subtaskCount = task.subtasks.length;
  let subtaskBarWidth = (completedSubtasks / subtaskCount) * 100;

  const taskElement = document.querySelector(`[data-task-index='${taskIndex}']`);
  if (taskElement) {
    const subtaskBar = taskElement.querySelector('.subtaskBar');
    if (subtaskBar) {
      subtaskBar.style.width = `${subtaskBarWidth}%`;
    }
    const subtaskCountDisplay = taskElement.querySelector('.subtaskCount');
    if (subtaskCountDisplay) {
      subtaskCountDisplay.innerText = `${completedSubtasks}/${subtaskCount} Unteraufgaben`;
    }
  }
}


function getVisibleAssignedMembers(assignedTo, displayLimit = 3) {
  let visibleMembers = assignedTo.slice(0, displayLimit);
  return visibleMembers.map(member => {
    let initials = member.initials || getInitials(member.name);
    let bgColor = member.bgColor || getRandomColor();
    return `
      <div class="assignedMember">
        <div class="assignedUserDetail" style="background-color: ${bgColor};">
          <span class="userInitials">${initials}</span>
        </div>
        <span class="user-name">${member.name}</span>
      </div>
    `;
  }).join('');
}

function getRemainingMembersCount(assignedTo, displayLimit = 3) {
  let remainingMembersCount = assignedTo.length - displayLimit;
  if (remainingMembersCount > 0) {
    return `
      <div class="assignedMember">
        <div class="assignedUserDetail more-members">
          <span class="userInitials">+${remainingMembersCount}</span>
        </div>
      </div>
    `;
  }
  return '';
}

function generateAssignedMembersHTMLDetail(assignedTo) {
  let visibleMembersHTML = getVisibleAssignedMembers(assignedTo);
  let remainingMembersHTML = getRemainingMembersCount(assignedTo);

  return visibleMembersHTML + remainingMembersHTML;
}


function generateTaskDetailHTML(category, title, description, date, prioName, prio, assignedTo, subtasks) {
  let categoryClass = category ? category.replace(/\s+/g, '') : 'default-category';
  let assignedMembersHTML = generateAssignedMembersHTMLDetail(assignedTo);

  return  /*html*/`
    <div class="detailtask">
      <div class="categoryAndClose">
        <div class="category ${categoryClass}">${category}</div>
        <img onclick="closeTask()" src="/assets/icons/close.png" alt="Close">
      </div>
      <div class="titleDetail">${title}</div>
      <div class="descriptionDetail">${description}</div>
      <div>Due date: ${date}</div>
      <div>Priority: ${prioName} <img src="${prio}" alt="PriorityImage"></div>
       <div> Assigned To:</div>
      <div class="assignedTo">${assignedMembersHTML}</div>
      <div>Subtaks:</div>
      <div class="subtasksDetail">${subtasks}</div>
      <div class="iconContainer">
        <div class="detailTaskIcon">
          <img src="/assets/icons/delete.png" alt="">
          <p>Delete</p>
        </div>
        <div class="verticalLine"></div>
        <div class="detailTaskIcon">
          <img src="/assets/icons/edit.png" alt="">
          <p>Edit</p>
        </div>
      </div>
    </div>`;
}



