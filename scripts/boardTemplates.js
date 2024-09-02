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
  let subtaskHTML = generateSubtaskProgressHTML(subtasks, i);
  let initials = renderInitials(assignedInitals, color, prio);
  
  return `
   <div class="task" draggable="true" data-task="${title}" ondragstart="startDragging(${i})" ondragover="allowDrop(event)" ondrop="moveTo('${element.section}')" onclick="showTaskDetail(${i})">
      <div class="category ${categoryClass}">${category}</div>
      <div class="title">${capitalizedTitle}</div>
      <div class="description">${truncatedDescription}</div>
      ${subtaskHTML}
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


/**
 * Generates the HTML structure for displaying subtask progress.
 * 
 * @param {Array} subtasks - The array of subtasks.
 * @param {number} taskIndex - The index of the task.
 * @returns {string} - The HTML string representing the subtask progress bar.
 */
function generateSubtaskProgressHTML(subtasks, taskIndex) {
  if (subtasks.length === 0) return '';
  let subtaskProgress = calculateSubtaskProgress(subtasks, taskIndex);
  
  return `
    <div class="subtasks">
      <div class="subtaskBarContainer">
        <div class="subtaskBar" id="subtaskBar${taskIndex}" style="width: ${subtaskProgress.subtaskBarWidth}%"></div>
      </div>
      <span class="subtaskCount" id="subtaskCount${taskIndex}">${subtaskProgress.completedSubtasks}/${subtaskProgress.subtaskCount} Subtasks</span>
    </div>`;
}