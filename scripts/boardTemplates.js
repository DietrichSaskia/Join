/**
 * Generates the HTML structure for a task.
 * 
 * @param {Object} element - The task data object.
 * @param {number} i - The index of the task.
 * @returns {string} - The HTML string representing the task.
 */
function generateTasksHTML(element, i) {
  let { category, title, description, subtasks = [], prio, assignedInitals = [], color = [] } = element;
  let categoryClass = formatCategoryClass(category);
  let capitalizedTitle = capitalizeFirstLetter(title);
  let capitalizedDescription = capitalizeFirstLetter(description);
  let truncatedDescription = truncateDescription(capitalizedDescription, 7);

  // Generate the HTML for subtasks progress only if there are non-empty subtasks
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


/**
 * Generates the HTML for displaying assigned user initials and priority.
 * 
 * @param {string} initialElements - The HTML string of the user initials to show.
 * @param {string} remainingElement - The HTML string for the remaining initials count.
 * @param {string} prio - The path to the priority image.
 * @returns {string} - The HTML string for the initials and priority display.
 */
function generateInitialsAndPriorityHTML(initialElements, remainingElement, prio) {
  return `
    <div class="assignedToAndPrio">
      <div>${initialElements}${remainingElement}</div>
      <img src="${prio}" alt="PriorityImage" class="priority-icon">
    </div>
  `;
}


function generateSubtaskProgressHTML(subtasks, taskIndex) {
  // Filter out empty subtasks
  let nonEmptySubtasks = subtasks.filter(subtask => subtask.trim() !== '');

  if (nonEmptySubtasks.length === 0) return ''; // Return nothing if all subtasks are empty
  let amountSubtasks = nonEmptySubtasks.length;
  // Calculate the progress
  let subtaskProgress = calculateSubtaskProgress(amountSubtasks, taskIndex);

  return `
    <div class="subtasks">
      <div class="subtaskBarContainer">
        <div class="subtaskBar" id="subtaskBar${taskIndex}" style="width: ${subtaskProgress.subtaskBarWidth}%"></div>
      </div>
      <span class="subtaskCount" id="subtaskCount${taskIndex}">${subtaskProgress.completedSubtasks}/${subtaskProgress.amountSubtasks} Subtasks</span>
    </div>`;
}

function calculateSubtaskProgress(amountSubtasks, taskIndex) {
  let x = amountSubtasks + 1;
  let task = taskAllArray[taskIndex];
  let completedSubtasks = task.subtasksCheck.filter(check => check === true).length;
  let subtaskBarWidth = (completedSubtasks / amountSubtasks) * 100;
  return {completedSubtasks, amountSubtasks, subtaskBarWidth, x };
}