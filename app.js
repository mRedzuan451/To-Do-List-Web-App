import { loadTasks } from './storage.js';
import { renderTasks, getTaskInput, clearInputs, getFilter, getConfirm } from './ui.js';
import * as TaskManager from './tasks.js';

let tasks = loadTasks();
let filter = 'all';
let selectedTasks = new Set();

function App() {
    // Initial Render
    renderApp();

    // --- Event Listeners ---

    // Add Task
    document.getElementById('add-task-btn').addEventListener('click', () => {
        const input = getTaskInput();
        if (input.text) {
            tasks = TaskManager.addTask(tasks, input);
            clearInputs();
            renderApp();
        }
    });

    // Clear Inputs
    document.getElementById('clear-inputs-btn').addEventListener('click', () => {
        clearInputs();
    });

    // Task List actions (delegated)
    document.getElementById('task-list').addEventListener('click', (e) => {
        const taskItem = e.target.closest('.task-item');
        if (!taskItem) return;
        const taskId = taskItem.dataset.id;

        // Toggle complete
        if (e.target.matches('.task-checkbox')) {
            tasks = TaskManager.toggleTask(tasks, taskId);
            renderApp();
        }

        // Delete task
        if (e.target.matches('.delete-btn')) {
            getConfirm('Are you sure you want to delete this task?', (confirmed) => {
                if (confirmed) {
                    tasks = TaskManager.deleteTask(tasks, taskId);
                    renderApp();
                }
            });
        }
         // Select task
        if (e.target.matches('.select-checkbox')) {
            if (e.target.checked) {
                selectedTasks.add(taskId);
            } else {
                selectedTasks.delete(taskId);
            }
            renderApp();
        }
    });

    // Filter buttons
    document.querySelector('.filters').addEventListener('click', (e) => {
        if (e.target.matches('.filter-btn')) {
            filter = getFilter(e.target);
            renderApp();
        }
    });

     // --- Bulk Actions ---
    document.getElementById('select-all-btn').addEventListener('click', () => {
        const filteredTaskIds = TaskManager.getFilteredTasks(tasks, filter).map(t => t.id);
        if (selectedTasks.size === filteredTaskIds.length) {
            selectedTasks.clear();
        } else {
            filteredTaskIds.forEach(id => selectedTasks.add(String(id)));
        }
        renderApp();
    });

    document.getElementById('delete-selected-btn').addEventListener('click', () => {
        if (selectedTasks.size === 0) return;
        getConfirm('Are you sure you want to delete the selected tasks?', (confirmed) => {
            if (confirmed) {
                tasks = TaskManager.deleteMultipleTasks(tasks, selectedTasks);
                selectedTasks.clear();
                renderApp();
            }
        });
    });

    document.getElementById('complete-selected-btn').addEventListener('click', () => {
        if (selectedTasks.size === 0) return;
        tasks = TaskManager.completeMultipleTasks(tasks, selectedTasks);
        selectedTasks.clear();
        renderApp();
    });


    // Clear completed
    document.getElementById('clear-completed').addEventListener('click', () => {
        getConfirm('Are you sure you want to clear all completed tasks?', (confirmed) => {
            if (confirmed) {
                tasks = TaskManager.clearCompletedTasks(tasks);
                renderApp();
            }
        });
    });

    // Theme Toggle
    document.getElementById('theme-toggle').addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

     // Load theme from storage
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

function renderApp() {
    const filteredTasks = TaskManager.getFilteredTasks(tasks, filter);
    renderTasks(filteredTasks, selectedTasks);
}


// Start the app
App();