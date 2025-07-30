// To-Do List App Logic with advanced features
const taskInput = document.getElementById('task-input');
const dueDateInput = document.getElementById('due-date-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed');
const themeToggle = document.getElementById('theme-toggle');
const progressBar = document.getElementById('progress-bar');
const selectAllBtn = document.getElementById('select-all-btn');
const deleteSelectedBtn = document.getElementById('delete-selected-btn');
const completeSelectedBtn = document.getElementById('complete-selected-btn');
const exportBtn = document.getElementById('export-tasks');
const importBtn = document.getElementById('import-tasks-btn');
const importInput = document.getElementById('import-tasks');
const confirmDialog = document.getElementById('confirm-dialog');
const confirmTitle = document.getElementById('confirm-title');
const confirmMessage = document.getElementById('confirm-message');
const confirmYes = document.getElementById('confirm-yes');
const confirmNo = document.getElementById('confirm-no');

let tasks = [];
let filter = 'all';
let selectedTasks = new Set();
let dragSrcIdx = null;
let confirmCallback = null;

// Accessibility: focus trap for modal
function trapFocus(modal) {
    const focusable = modal.querySelectorAll('button');
    let idx = 0;
    focusable[0].focus();
    modal.onkeydown = e => {
        if (e.key === 'Tab') {
            e.preventDefault();
            idx = (idx + (e.shiftKey ? -1 : 1) + focusable.length) % focusable.length;
            focusable[idx].focus();
        }
    };
}

// Modal confirmation dialog
function showConfirm(message, callback) {
    confirmMessage.textContent = message;
    confirmDialog.style.display = 'flex';
    confirmCallback = callback;
    trapFocus(confirmDialog);
}
function hideConfirm() {
    confirmDialog.style.display = 'none';
    confirmCallback = null;
    confirmDialog.onkeydown = null;
}
confirmYes.onclick = () => { if (confirmCallback) confirmCallback(true); hideConfirm(); };
confirmNo.onclick = () => { if (confirmCallback) confirmCallback(false); hideConfirm(); };

// Dark mode
function setTheme(dark) {
    document.body.classList.toggle('dark-mode', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    themeToggle.textContent = dark ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
}
themeToggle.addEventListener('click', () => setTheme(!document.body.classList.contains('dark-mode')));
if (localStorage.getItem('theme') === 'dark') setTheme(true);

// Load tasks from localStorage
function loadTasks() {
    const saved = localStorage.getItem('tasks');
    tasks = saved ? JSON.parse(saved) : [];
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
    taskList.innerHTML = '';
    let filtered = tasks;
    if (filter === 'active') filtered = tasks.filter(t => !t.completed);
    if (filter === 'completed') filtered = tasks.filter(t => t.completed);
    filtered.forEach((task, idx) => {
        const li = document.createElement('li');
        li.className = 'task-item' + (task.completed ? ' completed' : '') + (selectedTasks.has(task.id) ? ' selected' : '');
        li.setAttribute('draggable', 'true');
        li.setAttribute('tabindex', '0');
        // Checkbox for selection
        const selectBox = document.createElement('input');
        selectBox.type = 'checkbox';
        selectBox.checked = selectedTasks.has(task.id);
        selectBox.title = 'Select task';
        selectBox.addEventListener('change', e => {
            if (e.target.checked) selectedTasks.add(task.id);
            else selectedTasks.delete(task.id);
            renderTasks();
        });
        // Checkbox for completion
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.title = 'Mark complete';
        checkbox.addEventListener('change', () => toggleTask(idx));
        // Task text (editable)
        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.text;
        span.tabIndex = 0;
        span.setAttribute('role', 'textbox');
        span.setAttribute('aria-label', 'Edit task');
        span.addEventListener('dblclick', () => editTask(span, idx));
        span.addEventListener('keydown', e => {
            if (e.key === 'Enter') e.preventDefault();
        });
        // Due date
        if (task.dueDate) {
            const due = document.createElement('span');
            due.className = 'due-date' + (isOverdue(task.dueDate, task.completed) ? ' overdue' : '');
            due.textContent = `Due: ${task.dueDate}`;
            li.appendChild(due);
        }
        // Delete button
        const delBtn = document.createElement('button');
        delBtn.className = 'delete-btn';
        delBtn.innerHTML = '🗑️';
        delBtn.title = 'Delete';
        delBtn.addEventListener('click', () => {
            showConfirm('Delete this task?', yes => { if (yes) deleteTask(idx); });
        });
        // Drag and drop events
        li.addEventListener('dragstart', e => { dragSrcIdx = idx; li.classList.add('dragging'); });
        li.addEventListener('dragend', e => { dragSrcIdx = null; li.classList.remove('dragging'); });
        li.addEventListener('dragover', e => { e.preventDefault(); });
        li.addEventListener('drop', e => { e.preventDefault(); if (dragSrcIdx !== null && dragSrcIdx !== idx) reorderTasks(dragSrcIdx, idx); });
        // Keyboard selection
        li.addEventListener('keydown', e => {
            if (e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                if (selectedTasks.has(task.id)) selectedTasks.delete(task.id);
                else selectedTasks.add(task.id);
                renderTasks();
            }
        });
        li.appendChild(selectBox);
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(delBtn);
        taskList.appendChild(li);
    });
    updateCount();
    updateProgress();
}

function isOverdue(dueDate, completed) {
    if (!dueDate || completed) return false;
    return new Date(dueDate) < new Date(new Date().toDateString());
}

// Edit task in place
function editTask(span, idx) {
    span.contentEditable = true;
    span.focus();
    span.onblur = () => {
        span.contentEditable = false;
        const newText = span.textContent.trim();
        if (newText) {
            tasks[idx].text = newText;
            saveTasks();
        } else {
            showConfirm('Delete empty task?', yes => { if (yes) deleteTask(idx); else renderTasks(); });
        }
        renderTasks();
    };
    span.onkeydown = e => {
        if (e.key === 'Enter') {
            span.blur();
        }
    };
}

// Add task
function addTask() {
    const text = taskInput.value.trim();
    const dueDate = dueDateInput.value;
    if (!text) return;
    tasks.push({ id: Date.now() + Math.random(), text, completed: false, dueDate });
    saveTasks();
    renderTasks();
    taskInput.value = '';
    dueDateInput.value = '';
}

// Toggle task completion
function toggleTask(idx) {
    tasks[idx].completed = !tasks[idx].completed;
    saveTasks();
    renderTasks();
}

// Delete task
function deleteTask(idx) {
    tasks.splice(idx, 1);
    saveTasks();
    renderTasks();
}

// Reorder tasks (drag and drop)
function reorderTasks(from, to) {
    const moved = tasks.splice(from, 1)[0];
    tasks.splice(to, 0, moved);
    saveTasks();
    renderTasks();
}

// Update active task count
function updateCount() {
    const active = tasks.filter(t => !t.completed).length;
    taskCount.textContent = `${active} task${active !== 1 ? 's' : ''} left`;
}

// Update progress bar
function updateProgress() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    progressBar.value = total ? Math.round((completed / total) * 100) : 0;
    progressBar.max = 100;
}

// Filter tasks
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filter = btn.dataset.filter;
        renderTasks();
    });
});

// Clear completed tasks
clearCompletedBtn.addEventListener('click', () => {
    showConfirm('Clear all completed tasks?', yes => {
        if (yes) {
            tasks = tasks.filter(t => !t.completed);
            saveTasks();
            renderTasks();
        }
    });
});

// Add task on button click or Enter key
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') addTask();
});
dueDateInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') addTask();
});

// Bulk actions
selectAllBtn.addEventListener('click', () => {
    if (selectedTasks.size < tasks.length) tasks.forEach(t => selectedTasks.add(t.id));
    else selectedTasks.clear();
    renderTasks();
});
deleteSelectedBtn.addEventListener('click', () => {
    if (selectedTasks.size === 0) return;
    showConfirm('Delete selected tasks?', yes => {
        if (yes) {
            tasks = tasks.filter(t => !selectedTasks.has(t.id));
            selectedTasks.clear();
            saveTasks();
            renderTasks();
        }
    });
});
completeSelectedBtn.addEventListener('click', () => {
    if (selectedTasks.size === 0) return;
    tasks.forEach(t => { if (selectedTasks.has(t.id)) t.completed = true; });
    saveTasks();
    renderTasks();
});

// Export tasks
exportBtn.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.json';
    a.click();
    URL.revokeObjectURL(url);
});

// Import tasks
importBtn.addEventListener('click', () => {
    importInput.click();
});
importInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
        try {
            const imported = JSON.parse(evt.target.result);
            if (Array.isArray(imported)) {
                showConfirm('Import will overwrite your current tasks. Continue?', yes => {
                    if (yes) {
                        tasks = imported;
                        saveTasks();
                        renderTasks();
                    }
                });
            }
        } catch (err) { alert('Invalid file.'); }
    };
    reader.readAsText(file);
});

// Keyboard navigation for accessibility
taskList.addEventListener('keydown', e => {
    const items = Array.from(taskList.children);
    const idx = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown' && idx < items.length - 1) {
        items[idx + 1].focus();
        e.preventDefault();
    } else if (e.key === 'ArrowUp' && idx > 0) {
        items[idx - 1].focus();
        e.preventDefault();
    }
});

// Initial load
loadTasks();
renderTasks();
