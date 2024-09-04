function generateTasksHTML(element, i) {
  let { category, title, description, subtasks = [], prio, assignedInitals = [], color = [] } = element;
  let categoryClass = formatCategoryClass(category);
  let capitalizedTitle = capitalizeFirstLetter(title);
  let capitalizedDescription = capitalizeFirstLetter(description);
  let truncatedDescription = truncateDescription(capitalizedDescription, 7);

  let progressHTML = subtasks.length > 0 ? generateSubtaskProgressHTML(subtasks, i) : '';
  let initials = renderInitials(assignedInitals, color, prio);

  return `
    <div class="task" draggable="true" data-task="${title}" ondragstart="startDragging(${i})" ondragover="allowDrop(event)" ondrop="moveTo('${element.section}')" onclick="showTaskDetail(${i})">
       <div class="category ${categoryClass}">${category}</div>
       <div class="title">${capitalizedTitle}</div>
       <div class="description">${truncatedDescription}</div>
       ${progressHTML}
       ${initials}
     </div>
  `;
}


function generateInitialsAndPriorityHTML(initialElements, remainingElement, prio) {
  let validPrio = prio || '/assets/icons/defaultPriority.png';
  
  return `
    <div class="assignedToAndPrio">
      <div>${initialElements}${remainingElement}</div>
      <img src="${validPrio}" alt="PriorityImage" class="priority-icon">
    </div>
  `;
}


function generateSubtaskProgressHTML(subtasks, taskIndex) {
  let nonEmptySubtasks = subtasks.filter(subtask => subtask.trim() !== '');
  if (nonEmptySubtasks.length === 0) return ''; 

  let subtaskProgress = calculateSubtaskProgress(taskIndex);

  if (!subtaskProgress || typeof subtaskProgress.subtaskBarWidth === 'undefined') {
    console.error('Invalid subtaskProgress:', subtaskProgress);
    return '';
  }

  return `
    <div class="subtasks">
      <div class="subtaskBarContainer">
        <div class="subtaskBar" id="subtaskBar${taskIndex}" style="width: ${subtaskProgress.subtaskBarWidth}%"></div>
      </div>
      <span class="subtaskCount" id="subtaskCount${taskIndex}">${subtaskProgress.completedSubtasks}/${subtaskProgress.amountSubtasks} Subtasks</span>
    </div>`;
}


function renderSubtasks(taskIndex) {
  let { subtasksStatus } = calculateSubtaskProgress(taskIndex) || { subtasksStatus: [] };
  if (!Array.isArray(subtasksStatus)) {
    console.error('subtasksStatus is not an array:', subtasksStatus);
    return '';
  }
  return subtasksStatus.map(({ subtask, isCompleted }) => `
    <div class="subtaskItem">
      <input type="checkbox" ${isCompleted ? 'checked' : ''} disabled>
      <span>${subtask}</span>
    </div>
  `).join('');
}


function generateTaskDetails(task, taskIndex) {
  let categoryClass = formatCategoryClass(task.category);
  let initialsAndName = generateInitalsAndNameDetailHTML(task);
  let capitalizedTitle = task.title ? capitalizeFirstLetter(task.title) : "No Title";
  let capitalizedDescription = task.description ? capitalizeFirstLetter(task.description) : "No Description";
  let hasValidSubtasks = Array.isArray(task.subtasks) && task.subtasks.some(subtask => subtask && subtask.trim() !== "");
  let subtasksCheck = Array.isArray(task.subtasksCheck) && task.subtasksCheck.length === task.subtasks.length 
    ? task.subtasksCheck 
    : task.subtasks.map(() => false);

  return /*html*/ `
    <div class="detailtask">
      <div class="categoryAndClose">
        <div class="category ${categoryClass}">${task.category || "No Category"}</div>
        <img onclick="toggleTask()" src="/assets/icons/close.png" alt="Close">
      </div>
      <div class="detailtaskinfos">
        <div class="titleDetail">${capitalizedTitle}</div>
        <div class="descriptionDetail">${capitalizedDescription}</div>
        <div>Due date: ${task.date || 'No Date'}</div>
        <div>Priority: ${task.prioName ? task.prioName : 'No Priority'} <img src="${task.prio}" alt="PriorityImage"></div>
        <div class="assignedTo">Assigned To:</div>
        <div class="initalsAndName">${initialsAndName}</div>
        ${hasValidSubtasks ? `
        <div>Subtasks:</div>
        <div class="subtasksDetail" id="subtasksDetail">
          ${task.subtasks.map((subtask, index) => `
            <div class="subtaskItem">
              <input type="checkbox" ${subtasksCheck[index] ? 'checked' : ''} disabled>
              <span>${subtask || 'No Subtask'}</span>
            </div>
          `).join('')}
        </div>
        ` : ''}
      </div>
      <div class="iconContainer">
        <div onclick="deleteTask(${taskIndex})" class="detailTaskIcon">
          <img src="/assets/icons/delete.png" alt="Delete">
          <p>Delete</p>
        </div>
        <div class="verticalLine"></div>
        <div onclick="editTask(${taskIndex})" class="detailTaskIcon">
          <img src="/assets/icons/edit.png" alt="Edit">
          <p>Edit</p>
        </div>
      </div>
    </div>
  `;
}


function generateInitalsAndNameDetailHTML(task) {
  if (!task.assignedInitals || task.assignedInitals.length === 0) return "";
  if (!task.assignedName || task.assignedName.length === 0) return "";
  if (!task.color || task.color.length === 0) return "";

  let detailHtml = "";

  task.assignedInitals.forEach((initial, index) => {
    let color = task.color[index];
    let name = task.assignedName[index];

    detailHtml += /*html*/ `
      <div class="intalsAndName">
        <div class="assignedInitals" style="background-color: ${color};">
          ${initial}
        </div>
        <div>
          ${name}
        </div>
      </div>
    `;
  });
  return detailHtml;
}