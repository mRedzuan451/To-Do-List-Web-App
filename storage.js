// storage.js: Handles loading and saving tasks
export function loadTasks() {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
}

export function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}