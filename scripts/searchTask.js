function searchTask() {
  let searchQuery = document.getElementById('searchInput').value.toLowerCase();

  if (searchQuery.length >= 3) {
    const filteredTasks = allTasks.filter(task => {
      const titleMatch = task.title.toLowerCase().includes(searchQuery);
      const descriptionMatch = task.description.toLowerCase().includes(searchQuery);
      return titleMatch || descriptionMatch;
    });

    renderFilteredTasks(filteredTasks);
  } else {
    renderToDos();
    renderInProgress();
    renderAwaitFeedback();
    renderDone();
  }
  searchInput.value = '';
}


function renderFilteredTasks(tasks) {
  let toDoTasks = tasks.filter(t => t.section === 'toDo');
  let inProgressTasks = tasks.filter(t => t.section === 'inProgress');
  let awaitFeedbackTasks = tasks.filter(t => t.section === 'awaitFeedback');
  let doneTasks = tasks.filter(t => t.section === 'done');

  renderTasksInSection('toDo', toDoTasks);
  renderTasksInSection('inProgress', inProgressTasks);
  renderTasksInSection('awaitFeedback', awaitFeedbackTasks);
  renderTasksInSection('done', doneTasks);
}


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