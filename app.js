import { loadTasks } from './storage.js';
import { renderTasks, getTaskInput, clearInputs, getFilter, getConfirm } from './ui.js';
import * as TaskManager from './tasks.js';
import { renderCalendar } from './calendar.js';

document.addEventListener('DOMContentLoaded', () => {
    let tasks = loadTasks();
    let filter = 'all';
    let selectedTasks = new Set();
    let draggedTaskId = null;

    function App() {
        renderApp();

        const taskList = document.getElementById('task-list');
        const openCalendarBtn = document.getElementById('open-calendar-btn');
        const closeCalendarBtn = document.getElementById('close-calendar-btn');
        const calendarModal = document.getElementById('calendar-modal');

        if(openCalendarBtn && closeCalendarBtn && calendarModal) {
            openCalendarBtn.addEventListener('click', () => {
                calendarModal.classList.remove('hidden');
            });
            closeCalendarBtn.addEventListener('click', () => {
                calendarModal.classList.add('hidden');
            });
            calendarModal.addEventListener('click', (e) => {
                if (e.target === calendarModal) {
                    calendarModal.classList.add('hidden');
                }
            });
        }

        // Make the main click handler async to use await
        taskList.addEventListener('click', async (e) => {
            const taskItem = e.target.closest('.task-item');
            if (!taskItem) return;
            const taskId = taskItem.dataset.id;

            if (e.target.matches('.delete-btn')) {
                const confirmed = await getConfirm('Are you sure you want to delete this task?');
                if (confirmed) {
                    tasks = TaskManager.deleteTask(tasks, taskId);
                    renderApp();
                }
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

        document.getElementById('delete-selected-btn').addEventListener('click', async () => {
            if (selectedTasks.size === 0) return;
            const confirmed = await getConfirm('Delete selected tasks?');
            if(confirmed) {
                tasks = TaskManager.deleteMultipleTasks(tasks, selectedTasks);
                selectedTasks.clear();
                renderApp();
            }
        });

        document.getElementById('complete-selected-btn').addEventListener('click', () => {
            if (selectedTasks.size === 0) return;
            tasks = TaskManager.completeMultipleTasks(tasks, selectedTasks);
            selectedTasks.clear();
            renderApp();
        });

        document.getElementById('clear-completed').addEventListener('click', async () => {
            const confirmed = await getConfirm('Clear all completed tasks?');
            if (confirmed) {
                tasks = TaskManager.clearCompletedTasks(tasks);
                renderApp();
            }
        });

        document.getElementById('theme-toggle').addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });

        if (localStorage.getItem('theme') === 'dark') {
            document.documentElement.classList.add('dark');
        }
    }

    function renderApp() {
        const filteredTasks = TaskManager.getFilteredTasks(tasks, filter);
        renderTasks(filteredTasks, selectedTasks);
        renderCalendar(tasks, 'desktop-calendar');
        renderCalendar(tasks, 'mobile-calendar');
    }

    App();
});