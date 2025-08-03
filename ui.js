function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

function createTaskElement(task, selectedTasks) {
    const isSelected = selectedTasks.has(String(task.id));
    const taskItem = document.createElement('li');
    taskItem.className = `task-item flex flex-col p-3 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200 ${task.completed ? 'completed' : ''} ${isSelected ? 'bg-blue-100 dark:bg-blue-900/50' : ''}`;
    taskItem.dataset.id = task.id;
    taskItem.draggable = true;

    const isTimerRunning = task.timerStartTime !== null;
    const totalElapsedTime = task.elapsedTime + (isTimerRunning ? Date.now() - task.timerStartTime : 0);

    const hasSubtasks = task.subtasks && task.subtasks.length > 0;

    taskItem.innerHTML = `
        <div class="flex items-center w-full">
            <div class="flex items-center flex-grow gap-3">
                <input type="checkbox" class="select-checkbox form-checkbox h-5 w-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-blue-600" ${isSelected ? 'checked' : ''} aria-label="Select task">
                <input type="checkbox" class="task-checkbox form-checkbox h-5 w-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-blue-600" ${task.completed ? 'checked' : ''} aria-label="Mark task complete">
                <span class="task-text flex-grow cursor-pointer outline-none focus:outline-blue-500 rounded px-1" tabindex="0">${task.text}</span>
            </div>
            <div class="task-actions flex items-center gap-3">
                 ${!task.parentId ? `<button class="add-subtask-btn text-gray-400 hover:text-blue-500 text-lg" aria-label="Add subtask"><i class="fas fa-plus"></i></button>` : ''}
                <span class="timer-display text-sm font-mono">${formatTime(totalElapsedTime)}</span>
                <button class="timer-btn text-gray-400 hover:text-green-500 text-lg transition-colors" aria-label="${isTimerRunning ? 'Stop timer' : 'Start timer'}">
                    <i class="fas ${isTimerRunning ? 'fa-pause-circle' : 'fa-play-circle'}"></i>
                </button>
                ${task.dueDate ? `<span class="due-date text-xs text-gray-500 dark:text-gray-400">${task.dueDate}</span>` : ''}
                <button class="delete-btn text-gray-400 hover:text-red-500 text-lg transition-colors" aria-label="Delete task">🗑️</button>
                ${hasSubtasks ? `<button class="toggle-subtasks-btn text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-lg"><i class="fas fa-chevron-down"></i></button>` : ''}
            </div>
        </div>
        ${hasSubtasks ? `<ul class="subtask-list pl-8 pt-2" style="display: none;"></ul>` : ''}
    `;
    return taskItem;
}

function renderTaskTree(tasks, container, selectedTasks) {
    tasks.forEach(task => {
        const taskElement = createTaskElement(task, selectedTasks);
        container.appendChild(taskElement);

        if (task.subtasks && task.subtasks.length > 0) {
            const sublistContainer = taskElement.querySelector('.subtask-list');
            renderTaskTree(task.subtasks, sublistContainer, selectedTasks);
        }
    });
}


export function renderTasks(tasks, selectedTasks) {
    const taskList = document.getElementById('task-list');
    if (!taskList) return;

    const currentlyEditing = document.querySelector('.task-text[contenteditable="true"]');
    if (currentlyEditing) return;

    taskList.innerHTML = '';

    if (tasks.length === 0) {
        taskList.innerHTML = '<p class="empty-message text-center text-gray-500 py-4">No tasks to show.</p>';
        return;
    }
    
    renderTaskTree(tasks, taskList, selectedTasks);
}

export function getTaskInput() {
    const text = document.getElementById('task-input').value.trim();
    const dueDate = document.getElementById('due-date-input').value;
    const priority = document.getElementById('priority-input').value;
    const description = document.getElementById('desc-input').value.trim();
    const link = document.getElementById('link-input').value.trim();
    
    const attachInput = document.getElementById('attach-input');
    const attachments = attachInput ? Array.from(attachInput.files).map(f => f.name) : [];

    return { text, dueDate, priority, description, link, attachments };
}

export function clearInputs() {
    document.getElementById('task-input').value = '';
    document.getElementById('due-date-input').value = '';
    document.getElementById('priority-input').value = 'none';
    document.getElementById('desc-input').value = '';
    document.getElementById('link-input').value = '';
    
    const attachInput = document.getElementById('attach-input');
    if (attachInput) attachInput.value = '';
    
    document.getElementById('task-input').focus();
}

export function getFilter(filterButton) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active', 'bg-gray-200', 'dark:bg-gray-700'));
    filterButton.classList.add('active', 'bg-gray-200', 'dark:bg-gray-700');
    return filterButton.dataset.filter;
}

export function showConfirm(message) {
    const dialog = document.getElementById('confirm-dialog');
    const messageEl = document.getElementById('confirm-message');

    if (!dialog || !messageEl) {
        console.error('Confirmation dialog elements not found.');
        return;
    }

    messageEl.textContent = message;
    dialog.classList.remove('hidden');
}