export function renderTasks(tasks, selectedTasks) {
    const taskList = document.getElementById('task-list');
    const currentlyEditing = document.querySelector('.task-text[contenteditable="true"]');
    
    // If we are editing, don't re-render the whole list to avoid losing focus
    if (currentlyEditing) {
        return;
    }

    taskList.innerHTML = ''; // Clear the list before re-rendering

    if (tasks.length === 0) {
        taskList.innerHTML = '<p class="empty-message text-center text-gray-500 py-4">No tasks to show.</p>';
        return;
    }

    tasks.forEach(task => {
        const isSelected = selectedTasks.has(String(task.id));
        const taskItem = document.createElement('li');
        taskItem.className = `task-item flex items-center p-3 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200 ${task.completed ? 'completed' : ''} ${isSelected ? 'bg-blue-100 dark:bg-blue-900/50' : ''}`;
        taskItem.dataset.id = task.id;
        taskItem.draggable = true;

        taskItem.innerHTML = `
            <div class="flex items-center flex-grow gap-3">
                <input type="checkbox" class="select-checkbox form-checkbox h-5 w-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-blue-600" ${isSelected ? 'checked' : ''} aria-label="Select task">
                <input type="checkbox" class="task-checkbox form-checkbox h-5 w-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-blue-600" ${task.completed ? 'checked' : ''} aria-label="Mark task complete">
                <span class="task-text flex-grow cursor-pointer outline-none focus:outline-blue-500 rounded px-1" tabindex="0">${task.text}</span>
            </div>
            <div class="task-actions flex items-center gap-2">
                ${task.dueDate ? `<span class="due-date text-xs text-gray-500 dark:text-gray-400">${task.dueDate}</span>` : ''}
                <button class="delete-btn text-gray-400 hover:text-red-500 text-lg transition-colors" aria-label="Delete task">🗑️</button>
            </div>
        `;

        taskList.appendChild(taskItem);
    });

    // Update other UI elements like task count, progress bar etc.
}

export function getTaskInput() {
    const text = document.getElementById('task-input').value.trim();
    const dueDate = document.getElementById('due-date-input').value;
    const priority = document.getElementById('priority-input').value;
    const description = document.getElementById('desc-input').value.trim();
    const link = document.getElementById('link-input').value.trim();
    const attachments = Array.from(document.getElementById('attach-input').files).map(f => f.name);

    return { text, dueDate, priority, description, link, attachments };
}

export function clearInputs() {
    document.getElementById('task-input').value = '';
    document.getElementById('due-date-input').value = '';
    document.getElementById('priority-input').value = 'none';
    document.getElementById('desc-input').value = '';
    document.getElementById('link-input').value = '';
    document.getElementById('attach-input').value = '';
    document.getElementById('task-input').focus();
}

export function getFilter(filterButton) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active', 'bg-gray-200', 'dark:bg-gray-700'));
    filterButton.classList.add('active', 'bg-gray-200', 'dark:bg-gray-700');
    return filterButton.dataset.filter;
}

export function getConfirm(message, callback) {
    const dialog = document.getElementById('confirm-dialog');
    const messageEl = document.getElementById('confirm-message');
    const yesBtn = document.getElementById('confirm-yes');
    const noBtn = document.getElementById('confirm-no');

    messageEl.textContent = message;
    dialog.classList.remove('hidden');

    const handleYes = () => {
        callback(true);
        cleanup();
    };

    const handleNo = () => {
        callback(false);
        cleanup();
    };
    
    yesBtn.onclick = handleYes;
    noBtn.onclick = handleNo;

    function cleanup() {
        dialog.classList.add('hidden');
        yesBtn.onclick = null;
        noBtn.onclick = null;
    }
}