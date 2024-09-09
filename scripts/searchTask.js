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

  renderTasksInSearch('toDo', toDoTasks);
  renderTasksInSearch('inProgress', inProgressTasks);
  renderTasksInSearch('awaitFeedback', awaitFeedbackTasks);
  renderTasksInSearch('done', doneTasks);
}


/**
 * Renders a list of tasks in a specific section.
 * 
 * @param {string} sectionId - The ID of the HTML element where the tasks should be rendered.
 * @param {Array<Object>} tasks - Array of task objects to be rendered in the section.
 */
function renderTasksInSearch(sectionId, tasks) {
  let container = document.getElementById(sectionId);
  container.innerHTML = '';

  if (tasks.length === 0) {
    container.innerHTML = `<div class="noTasks">No tasks in ${sectionId}</div>`;
  } else {
    tasks.forEach((subtasks, taskIndex) => {
      container.innerHTML += generateTasksHTML(subtasks, taskIndex);
    });
  }
}