/**
 * Updates the progress of a task's subtasks and renders the progress bar.
 * 
 * @param {number} taskIndex - The index of the task to update.
 */
function updateTaskProgress(taskIndex) {
    let task = taskAllArray[taskIndex];
  
    let completedSubtasks = task.subtasksCheck.filter(status => status).length; // Zählt die erledigten Subtasks
    let totalSubtasks = task.subtasksCheck.length; // Gesamtanzahl der Subtasks
  
    let progress = (completedSubtasks / totalSubtasks) * 100; // Berechnet den Fortschritt in Prozent
  
    renderSubtaskProgress(taskIndex, progress);
  }

  /**
 * Rendert den Fortschritt der Subtasks eines Tasks.
 * 
 * @param {number} taskIndex - Der Index des Tasks im Array.
 * @param {number} progress - Der Fortschritt in Prozent.
 */
function renderSubtaskProgress(taskIndex, progress) {
    let progressBar = document.getElementById(`progress-bar-${taskIndex}`); // Annahme: Es gibt eine Progress-Bar mit dieser ID
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
        progressBar.innerText = `${Math.round(progress)}%`;
    }
  }
  function calculateSubtaskProgress(totalSubtasks, taskIndex) {
    let completedSubtasks = 0;
    let subtasks = taskAllArray[taskIndex].subtasks;
  
    // Zähle die abgeschlossenen Unteraufgaben
    for (let i = 0; i < totalSubtasks; i++) {
        if (subtasks[i] !== "") {
            completedSubtasks++;
        }
    }
  
    // Berechne die Breite des Fortschrittsbalkens in Prozent
    let subtaskBarWidth = (completedSubtasks / totalSubtasks) * 100;
  
    // Erstelle das Fortschrittsobjekt
    let progress = {
        subtaskBarWidth: subtaskBarWidth,
        completedSubtasks: completedSubtasks,
        subtaskCount: totalSubtasks
    };
  
    return progress;
  }
  /**
 * Calculates the progress of subtasks for a given task.
 * 
 * @param {Array} subtasks - The array of subtasks.
 * @param {number} taskIndex - The index of the task.
 * @returns {Object} - An object containing the number of completed subtasks, total subtasks, and the width percentage of the progress bar.
 */
function calculateSubtaskProgress(subtasks, taskIndex) {
    let completedSubtasks = subtasks.reduce((count, _, subtaskIndex) => {
      let storageKey = `task-${taskIndex}-subtask-${subtaskIndex}`;
      return count + (localStorage.getItem(storageKey) === 'true' ? 1 : 0);
    }, 0);
    
    let subtaskCount = subtasks.length;
    let subtaskBarWidth = (completedSubtasks / subtaskCount) * 100;
  
    return { completedSubtasks, subtaskCount, subtaskBarWidth };
  }

  /**
 * Renders the progress of subtasks for a task.
 * 
 * @param {number} taskIndex - The index of the task.
 * @param {Object} progress - An object containing the progress data.
 */
function renderSubtaskProgress(taskIndex, progress) {
    let subtaskBar = document.getElementById(`subtaskBar${taskIndex}`);
    let subtaskCount = document.getElementById(`subtaskCount${taskIndex}`);
    
    if (subtaskBar && subtaskCount) {
      subtaskBar.style.width = `${progress.subtaskBarWidth}%`;
      subtaskCount.textContent = `${progress.completedSubtasks}/${progress.subtaskCount} Subtasks`;
    }
  }
  
  
  /**
   * Loads the subtask progress for a specific task from localStorage and updates the UI accordingly.
   * 
   * @param {number} taskIndex - The index of the task to load progress for.
   */
  function loadTaskProgress(taskIndex) {
    let task = taskAllArray[taskIndex];
    task.subtasks.forEach((subtask, subtaskIndex) => {
      let storageKey = `task-${taskIndex}-subtask-${subtaskIndex}`;
      let isChecked = localStorage.getItem(storageKey) === 'true';
      let checkbox = document.getElementById(`subtask-image-${taskIndex}-${subtaskIndex}`);
      if (checkbox) {
        checkbox.src = isChecked ? '/assets/icons/checkButtonChecked.png' : '/assets/icons/checkButtonblank.png';
      }
    });
    updateTaskProgress(taskIndex);
  }