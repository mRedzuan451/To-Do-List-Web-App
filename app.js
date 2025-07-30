// To-Do List App Logic
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed');

let tasks = [];
let filter = 'all';

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
        li.className = 'task-item' + (task.completed ? ' completed' : '');
        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTask(idx));
        // Task text
        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.text;
        span.addEventListener('click', () => toggleTask(idx));
        // Delete button
        const delBtn = document.createElement('button');
        delBtn.className = 'delete-btn';
        delBtn.innerHTML = '🗑️';
        delBtn.title = 'Delete';
        delBtn.addEventListener('click', () => deleteTask(idx));
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(delBtn);
        taskList.appendChild(li);
    });
    updateCount();
}

// Add task
function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;
    tasks.push({ text, completed: false });
    saveTasks();
    renderTasks();
    taskInput.value = '';
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

// Update active task count
function updateCount() {
    const active = tasks.filter(t => !t.completed).length;
    taskCount.textContent = `${active} task${active !== 1 ? 's' : ''} left`;
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
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
});

// Add task on button click or Enter key
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') addTask();
});

// Initial load
loadTasks();
renderTasks();
