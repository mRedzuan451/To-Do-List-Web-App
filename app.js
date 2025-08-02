import { loadTasks } from './storage.js';
import { renderTasks, getTaskInput, clearInputs, getFilter, showConfirm } from './ui.js';
import * as TaskManager from './tasks.js';
import { renderCalendar } from './calendar.js';

document.addEventListener('DOMContentLoaded', () => {
    let tasks = loadTasks();
    let filter = 'all';
    let selectedTasks = new Set();
    let draggedTaskId = null;
    let actionToConfirm = null; // Stores the action to perform after confirmation
    let timerInterval = null;

    function App() {
        renderApp();

        const taskList = document.getElementById('task-list');
        const confirmDialog = document.getElementById('confirm-dialog');

        // --- SINGLE, RELIABLE LISTENER FOR THE CONFIRMATION DIALOG ---
        confirmDialog.addEventListener('click', (e) => {
            const dialog = e.currentTarget;
            if (e.target.id === 'confirm-yes') {
                if (actionToConfirm) {
                    actionToConfirm(); // Execute the stored action
                }
                actionToConfirm = null; // Clear the action
                dialog.classList.add('hidden');
            } else if (e.target.id === 'confirm-no') {
                actionToConfirm = null; // Clear the action
                dialog.classList.add('hidden');
            }
        });

        taskList.addEventListener('click', (e) => {
            const taskItem = e.target.closest('.task-item');
            if (!taskItem) return;
            const taskId = taskItem.dataset.id;

            if (e.target.closest('.timer-btn')) {
                const task = tasks.find(t => t.id == taskId);
                if (task) {
                    if (task.timerStartTime) {
                        tasks = TaskManager.stopTimer(tasks, taskId);
                    } else {
                        tasks = TaskManager.startTimer(tasks, taskId);
                    }
                    renderApp();
                }
            } else if (e.target.matches('.delete-btn')) {
                // Store the delete action, then show the dialog
                actionToConfirm = () => {
                    tasks = TaskManager.deleteTask(tasks, taskId);
                    renderApp();
                };
                showConfirm('Are you sure you want to delete this task?');
            } else if (e.target.matches('.task-checkbox')) {
                tasks = TaskManager.toggleTask(tasks, taskId);
                renderApp();
            } else if (e.target.matches('.select-checkbox')) {
                if (e.target.checked) {
                    selectedTasks.add(taskId);
                } else {
                    selectedTasks.delete(taskId);
                }
                renderApp();
            }
        });

        document.getElementById('delete-selected-btn').addEventListener('click', () => {
            if (selectedTasks.size === 0) return;
            actionToConfirm = () => {
                tasks = TaskManager.deleteMultipleTasks(tasks, selectedTasks);
                selectedTasks.clear();
                renderApp();
            };
            showConfirm('Delete selected tasks?');
        });

        document.getElementById('clear-completed').addEventListener('click', () => {
            actionToConfirm = () => {
                tasks = TaskManager.clearCompletedTasks(tasks);
                renderApp();
            };
            showConfirm('Clear all completed tasks?');
        });

        // Other event listeners...
        document.getElementById('add-task-btn').addEventListener('click', () => {
            const input = getTaskInput();
            if (input.text) {
                tasks = TaskManager.addTask(tasks, input);
                clearInputs();
                renderApp();
            }
        });

        document.getElementById('clear-inputs-btn').addEventListener('click', () => {
            clearInputs();
        });

        taskList.addEventListener('dblclick', (e) => {
            if (e.target.matches('.task-text')) {
                const taskTextSpan = e.target;
                const taskItem = e.target.closest('.task-item');
                const taskId = taskItem.dataset.id;
                const originalText = taskTextSpan.textContent;

                taskTextSpan.contentEditable = true;
                taskTextSpan.focus();
                taskItem.draggable = false;

                const saveChanges = () => {
                    taskTextSpan.contentEditable = false;
                    taskItem.draggable = true;
                    const newText = taskTextSpan.textContent.trim();
                    
                    if (newText && newText !== originalText) {
                        tasks = TaskManager.editTask(tasks, taskId, newText);
                    } else {
                        taskTextSpan.textContent = originalText;
                    }
                    renderApp();
                };
                
                taskTextSpan.addEventListener('blur', saveChanges);
                taskTextSpan.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        saveChanges();
                    } else if (e.key === 'Escape') {
                        taskTextSpan.textContent = originalText;
                        taskTextSpan.blur();
                    }
                }, { once: true });
            }
        });

        taskList.addEventListener('dragstart', (e) => {
            if (e.target.matches('.task-item')) {
                draggedTaskId = e.target.dataset.id;
                e.target.classList.add('opacity-50');
            }
        });

        taskList.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        taskList.addEventListener('drop', (e) => {
            e.preventDefault();
            const toTaskItem = e.target.closest('.task-item');
            if (toTaskItem && draggedTaskId) {
                const toTaskId = toTaskItem.dataset.id;
                tasks = TaskManager.reorderTask(tasks, draggedTaskId, toTaskId);
                renderApp();
            }
        });
        
        taskList.addEventListener('dragend', (e) => {
            if(e.target.matches('.task-item')) {
                e.target.classList.remove('opacity-50');
            }
            draggedTaskId = null;
        });

        document.querySelector('.filters').addEventListener('click', (e) => {
            if (e.target.matches('.filter-btn')) {
                filter = getFilter(e.target);
                renderApp();
            }
        });

        document.getElementById('select-all-btn').addEventListener('click', () => {
            const filteredTaskIds = TaskManager.getFilteredTasks(tasks, filter).map(t => t.id);
            if (selectedTasks.size === filteredTaskIds.length) {
                selectedTasks.clear();
            } else {
                filteredTaskIds.forEach(id => selectedTasks.add(String(id)));
            }
            renderApp();
        });

        document.getElementById('complete-selected-btn').addEventListener('click', () => {
            if (selectedTasks.size === 0) return;
            tasks = TaskManager.completeMultipleTasks(tasks, selectedTasks);
            selectedTasks.clear();
            renderApp();
        });

        document.getElementById('theme-toggle').addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });

        if (localStorage.getItem('theme') === 'dark') {
            document.documentElement.classList.add('dark');
        }

        const openCalendarBtn = document.getElementById('open-calendar-btn');
        const closeCalendarBtn = document.getElementById('close-calendar-btn');
        const calendarModal = document.getElementById('calendar-modal');
        if(openCalendarBtn && closeCalendarBtn && calendarModal) {
            openCalendarBtn.addEventListener('click', () => calendarModal.classList.remove('hidden'));
            closeCalendarBtn.addEventListener('click', () => calendarModal.classList.add('hidden'));
            calendarModal.addEventListener('click', (e) => {
                if(e.target === calendarModal) calendarModal.classList.add('hidden');
            });
        }
    }

    function updateTimers() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }

        const activeTask = tasks.find(task => task.timerStartTime);

        if (activeTask) {
            timerInterval = setInterval(() => {
                const taskItem = document.querySelector(`.task-item[data-id='${activeTask.id}'] .timer-display`);
                if (taskItem) {
                    const totalElapsedTime = activeTask.elapsedTime + (Date.now() - activeTask.timerStartTime);
                    const totalSeconds = Math.floor(totalElapsedTime / 1000);
                    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
                    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
                    const seconds = String(totalSeconds % 60).padStart(2, '0');
                    taskItem.textContent = `${hours}:${minutes}:${seconds}`;
                }
            }, 1000);
        }
    }

    function renderApp() {
        const filteredTasks = TaskManager.getFilteredTasks(tasks, filter);
        renderTasks(filteredTasks, selectedTasks);
        renderCalendar(tasks, 'desktop-calendar');
        renderCalendar(tasks, 'mobile-calendar');
        updateTimers();
    }

    App();

    const dueDateInput = document.getElementById('due-date-input');
    
    function updatePlaceholder() {
        if (dueDateInput.value) {
            dueDateInput.classList.add('has-value');
        } else {
            dueDateInput.classList.remove('has-value');
        }
    }

    dueDateInput.addEventListener('change', updatePlaceholder);

    // Also check on page load in case a value is pre-filled
    updatePlaceholder();
});