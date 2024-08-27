function showTaskDetail(taskIndex) {
  let task = allTasks[taskIndex];
  renderTaskDetails(task, taskIndex);
  openTask();
}

function renderTaskDetails(task, taskIndex) {
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
  return subtasks.map((subtask, subtaskIndex) => `
    <div class="subtask">
      <input type="checkbox" id="subtask-${taskIndex}-${subtaskIndex}" onchange="updateSubtaskStatus(${taskIndex}, ${subtaskIndex})" />
      <label for="subtask-${subtaskIndex}">${subtask}</label>
    </div>
  `
  ).join('');
}

function updateSubtaskStatus(taskIndex, subtaskIndex) {
  const task = allTasks[taskIndex];

  let checkbox = document.getElementById(`subtask-${taskIndex}-${subtaskIndex}`);

  let isChecked = checkbox.checked;
  task.subtasks[subtaskIndex].completed = isChecked;

  // Aktualisiere den Fortschritt
  updateTaskProgress(taskIndex, subtaskIndex, task);
  saveTasksToLocalStorage();
}

function updateTaskProgress(taskIndex, subtaskIndex, task) {
  let btn1check = (document.getElementById(`subtask-${taskIndex}-0`).checked == true)
  let btn2check = (document.getElementById(`subtask-${taskIndex}-1`).checked == true)
  console.log(subtaskIndex);
  let amountSubtasks = task['subtasks'].length;
  if (amountSubtasks === 1) {
    if (btn1check) {     
      //Balken 100%     
      return
    }
    else{
      //Balken 0%
      return
    }
  }
  if (amountSubtasks === 2) {
    if (btn1check && btn2check) {
      //Balken 100%     
      return
    }
    else if (btn1check || btn2check) {
      //Balken 50%     
      return
    }
    else {
      //Balken 0%
      return
    }
  }
  let subtaskBarWidth = (completedSubtasks / subtaskCount) * 100;

  const taskElement = document.querySelector(`[data-task-index='${subtaskIndex}']`);
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



