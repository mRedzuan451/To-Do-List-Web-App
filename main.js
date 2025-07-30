// main.js: Entry point
import { loadTasks } from './storage.js';
import { renderTasks } from './ui.js';

let tasks = loadTasks();
renderTasks(tasks, {});
// Wire up events and pass handlers as needed
