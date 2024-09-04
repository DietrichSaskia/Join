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