export function renderTasks(tasks, selectedTasks) {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; // Clear the list before re-rendering

    if (tasks.length === 0) {
        taskList.innerHTML = '<p class="empty-message">No tasks to show.</p>';
        return;
    }

    tasks.forEach(task => {
        const isSelected = selectedTasks.has(String(task.id));
        const taskItem = document.createElement('li');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''} ${isSelected ? 'selected' : ''}`;
        taskItem.dataset.id = task.id;

        taskItem.innerHTML = `
            <div class="task-main">
                 <input type="checkbox" class="select-checkbox" ${isSelected ? 'checked' : ''} aria-label="Select task">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} aria-label="Mark task complete">
                <span class="task-text">${task.text}</span>
                <span class="due-date">${task.dueDate ? `Due: ${task.dueDate}` : ''}</span>
            </div>
            <div class="task-details">
                ${task.description ? `<p class="task-desc">${task.description}</p>` : ''}
                ${task.link ? `<a href="${task.link}" target="_blank" class="task-link">🔗 Link</a>` : ''}
            </div>
            <div class="task-actions">
                <button class="delete-btn" aria-label="Delete task">🗑️</button>
            </div>
        `;

        taskList.appendChild(taskItem);
    });

    updateTaskCount(tasks);
    updateProgressBar(tasks);
}

export function getTaskInput() {
    const text = document.getElementById('task-input').value.trim();
    const dueDate = document.getElementById('due-date-input').value;
    const priority = document.getElementById('priority-input').value;
    const description = document.getElementById('desc-input').value.trim();
    const link = document.getElementById('link-input').value.trim();
    // Note: file attachments need more complex handling (uploading/storing)
    // For now, we'll just get the name
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
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    filterButton.classList.add('active');
    return filterButton.dataset.filter;
}

function updateTaskCount(tasks) {
    const activeTasks = tasks.filter(task => !task.completed).length;
    const taskCountEl = document.getElementById('task-count');
    taskCountEl.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} left`;
}

function updateProgressBar(tasks) {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const progressBar = document.getElementById('progress-bar');
    progressBar.value = total > 0 ? (completed / total) * 100 : 0;
}


export function getConfirm(message, callback) {
    const dialog = document.getElementById('confirm-dialog');
    const messageEl = document.getElementById('confirm-message');
    const yesBtn = document.getElementById('confirm-yes');
    const noBtn = document.getElementById('confirm-no');

    messageEl.textContent = message;
    dialog.style.display = 'flex';

    const handleYes = () => {
        callback(true);
        cleanup();
    };

    const handleNo = () => {
        callback(false);
        cleanup();
    };

    yesBtn.addEventListener('click', handleYes);
    noBtn.addEventListener('click', handleNo);

    function cleanup() {
        dialog.style.display = 'none';
        yesBtn.removeEventListener('click', handleYes);
        noBtn.removeEventListener('click', handleNo);
    }
}