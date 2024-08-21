function showTaskDetail(id) {
  const task = findTaskById(id);
  if (!task) return;

  renderTaskDetails(task);
  openTask();
}


function findTaskById(id) {
  const element = allTasks.find(task => task.id === id);
  if (!element) {
    console.error("Task not found with id:", id);
  }
  return element;
}


function renderTaskDetails(task) {
  const taskContent = document.getElementById('containerTasksDetail');
  taskContent.innerHTML = generateTaskDetailHTML(
    task.category, 
    task.title, 
    task.description, 
    task.date,
    task.prioName,
    task.prio, 
    task.assignedTo, 
    task.subtasks
  );
}


function openTask() {
  document.getElementById('containerTasksDetail').classList.remove('d-none');
}


function closeTask() {
  document.getElementById('containerTasksDetail').classList.add('d-none');
}


function generateTaskDetailHTML(category, title, description, date, prioName, prio, assignedTo, subtasks) {
  let categoryClass = category.replace(/\s+/g, '');
  let initials = getInitials(assignedTo);

  return /*html*/`
  <div class="detailtask">
    <div class="categoryAndClose">
      <div class="category ${categoryClass}">${category}</div>
      <img onclick="closeTask()" src="/assets/icons/close.png" alt="Close">
    </div>
    <div class="titleDetail">${title}</div>
    <div class="descriptionDetail">${description}</div>
    <div>Due date: ${date}</div>
    <div>Priority:
      ${prioName}
      <img src="${prio}" alt="PriorityImage">
    </div>
    <div class="assignedTo">${initials} ${assignedTo}</div>
    <div class="subtasksDetail">${subtasks}</div>
  </div>
  `;
}
