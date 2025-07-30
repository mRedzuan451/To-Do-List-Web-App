// tasks.js: Task logic
import { saveTasks } from './storage.js';

export function addTask(tasks, newTask) {
    tasks.push(newTask);
    saveTasks(tasks);
}
export function editTask(tasks, idx, newText) {
    tasks[idx].text = newText;
    saveTasks(tasks);
}
export function deleteTask(tasks, idx) {
    tasks.splice(idx, 1);
    saveTasks(tasks);
}
export function toggleTask(tasks, idx) {
    tasks[idx].completed = !tasks[idx].completed;
    saveTasks(tasks);
}
// Add more task logic as needed (rollup, etc)
