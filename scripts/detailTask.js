function showTaskDetail(taskIndex) {
  let task = taskAllArray[taskIndex];
  renderTaskDetails(task, taskIndex);
  openTask();
}

function renderTaskDetails(task, taskIndex) {
  let taskContent = document.getElementById('taskDetailCard');
  taskContent.innerHTML = generateTaskDetailHTML(taskIndex);
  document.getElementById('subtasksDetail').innerHTML = renderSubtasks(taskIndex, task);
}


function openTask() {
  document.getElementById('containerTasksDetail').classList.remove('d-none');
}


function closeTask() {
  document.getElementById('containerTasksDetail').classList.add('d-none');
}


function renderSubtasks(taskIndex, task) {
  let subtasks = task.subtasks;
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
  const task = taskAllArray[taskIndex];

  let checkbox = document.getElementById(`subtask-${taskIndex}-${subtaskIndex}`);

  let isChecked = checkbox.checked;
  task.subtasks[subtaskIndex].completed = isChecked;

  // Aktualisiere den Fortschritt
  updateTaskProgress(taskIndex, task);
  saveTasksToLocalStorage();
}


function updateTaskProgress(taskIndex, task) {
  let btn1check = (document.getElementById(`subtask-${taskIndex}-0`).checked == true)
  if (!document.getElementById(`subtask-${taskIndex}-1`)) {
    let subtaskBar = document.getElementById(`subtaskBar${taskIndex}`);
    if (btn1check) {
      subtaskBar.style.width = `100%`;
      //count 1/1   
      return
    }
    else {
      subtaskBar.style.width = `0%`;
      //Count 0
      return
    }
  }
  else {
    updateTaskProgress2(taskIndex, task)
  };
}


function updateTaskProgress2(taskIndex, task) {
  let btn1check = (document.getElementById(`subtask-${taskIndex}-0`).checked == true)
  let btn2check = (document.getElementById(`subtask-${taskIndex}-1`).checked == true)
  let subtaskBar = document.getElementById(`subtaskBar${taskIndex}`);
  if (btn1check && btn2check) {
    subtaskBar.style.width = `100%`;
    //Count 2/2  
    return
  }
  else if (btn1check || btn2check) {
    subtaskBar.style.width = `50%`;
    //Count 1/2  
    return
  }
  else {
    subtaskBar.style.width = `0%`;
    //Count 0/2
    return
  }
}


function getVisibleAssignedMembers(assignedTo, displayLimit = 3) {
  console.log(assignedTo);

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


function generateTaskDetailHTML(taskIndex) {
  let task = taskAllArray[taskIndex];
  let categoryClass = task.category ? task.category.replace(/\s+/g, '') : 'default-category';
  if (!task.subtasks || task.subtasks === null) {
    return (renderTaskDetailsNoSubtask(task, categoryClass));
  }
  else {
    return (renderTaskDetailsSubtask(task, categoryClass));
  }
}

function renderTaskDetailsNoSubtask(task, categoryClass) {
  return  /*html*/`
  <div class="detailtask">
    <div class="categoryAndClose">
      <div class="category ${categoryClass}">${task.category}</div>
      <img onclick="closeTask()" src="/assets/icons/close.png" alt="Close">
    </div>
    <div class="titleDetail">${task.title}</div>
    <div class="descriptionDetail">${task.description}</div>
    <div>Due date: ${task.date}</div>
    <div>Priority: ${task.prioName} <img src="${task.prio}" alt="PriorityImage"></div>
     <div> Assigned To:</div>
    <div class="assignedTo">${task.assignedName}</div>
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
function renderTaskDetailsSubtask(task, categoryClass) {
  return  /*html*/`
    <div class="detailtask">
      <div class="categoryAndClose">
        <div class="category ${categoryClass}">${task.category}</div>
        <img onclick="closeTask()" src="/assets/icons/close.png" alt="Close">
      </div>
      <div class="titleDetail">${task.title}</div>
      <div class="descriptionDetail">${task.description}</div>
      <div>Due date: ${task.date}</div>
      <div>Priority: ${task.prioName} <img src="${task.prio}" alt="PriorityImage"></div>
       <div> Assigned To:</div>
      <div class="assignedTo">${task.assignedName}</div>
      <div>Subtaks:</div>
      <div class="subtasksDetail" id="subtasksDetail"></div>
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