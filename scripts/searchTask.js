/**
 * Searches for tasks based on the user's input in the search field.
 * If the search query is at least 3 characters long, the tasks are filtered.
 * If the input field is empty, all tasks are displayed.
 */
function searchTask() {
  let searchQuery = document.getElementById('searchInput').value.toLowerCase();
  
  if (searchQuery.length >= 3) {
    let filteredTasks = taskAllArray.filter(task => {
      let titleMatch = task.title.toLowerCase().includes(searchQuery);
      let descriptionMatch = task.description.toLowerCase().includes(searchQuery);
      return titleMatch || descriptionMatch;
    });
    renderFilteredTasks(filteredTasks);
  } else {
    renderAllTasks();
  }

  if (searchQuery.length === 0) {
    renderAllTasks();
  }
}


/**
 * Renders the filtered tasks in their respective sections.
 * 
 * @param {Array<Object>} tasks - Array of task objects to be filtered and rendered.
 */
function renderFilteredTasks(tasks) {
  let toDoTasks = tasks.filter(task => task.section === 'toDo');
  let inProgressTasks = tasks.filter(task => task.section === 'inProgress');
  let awaitFeedbackTasks = tasks.filter(task => task.section === 'awaitFeedback');
  let doneTasks = tasks.filter(task => task.section === 'done');

  renderTasksInSection('toDo', toDoTasks);
  renderTasksInSection('inProgress', inProgressTasks);
  renderTasksInSection('awaitFeedback', awaitFeedbackTasks);
  renderTasksInSection('done', doneTasks);
}


/**
 * Renders a list of tasks in a specific section.
 * 
 * @param {string} sectionId - The ID of the HTML element where the tasks should be rendered.
 * @param {Array<Object>} tasks - Array of task objects to be rendered in the section.
 */
function renderTasksInSection(sectionId, tasks) {
  let container = document.getElementById(sectionId);
  container.innerHTML = '';

  if (tasks.length === 0) {
    container.innerHTML = `<div class="noTasks">No tasks in ${sectionId}</div>`;
  } else {
    tasks.forEach(task => {
      container.innerHTML += generateTasksHTML(task);
    });
  }
}


// Toggles the visibility of the section dropdown
function toggleSectionDropdown() {
  let dropdown = document.getElementById('sectionDropdown');
  dropdown.classList.toggle('d-none');
}

// Moves the task to the selected section
function moveTaskToSection(section, taskIndex) {
  // Directly use the taskIndex passed in
  if (typeof taskIndex === 'number' && taskIndex >= 0 && taskIndex < taskAllArray.length) {
      taskAllArray[taskIndex].section = section; // Change the section of the task
      saveTasksToLocalStorage(); // Save the tasks to local storage
      renderAllTasks(); // Re-render the tasks
      toggleSectionDropdown(); // Close the dropdown
  } else {
      console.error('Task index is not valid:', taskIndex); // Error handling
  }
}

// Function to get and return the task index (it can just return the index passed to it)
function getCurrentTaskIndex(taskIndex) {
  console.log('Current Task Index:', taskIndex); // Log the index for debugging
  return taskIndex; // Return the task index
}