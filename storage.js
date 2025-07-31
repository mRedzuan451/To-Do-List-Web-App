export function addTask(tasks, newTaskData) {
    const newTask = {
        id: Date.now(),
        text: newTaskData.text,
        completed: false,
        dueDate: newTaskData.dueDate,
        priority: newTaskData.priority,
        description: newTaskData.description,
        link: newTaskData.link,
        attachments: newTaskData.attachments,
    };
    const newTasks = [...tasks, newTask];
    saveTasks(newTasks);
    return newTasks;
}

export function deleteTask(tasks, id) {
    const newTasks = tasks.filter(task => task.id !== id);
    saveTasks(newTasks);
    return newTasks;
}

export function toggleTask(tasks, id) {
    const newTasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveTasks(newTasks);
    return newTasks;
}

// storage.js: Handles loading and saving tasks
export function loadTasks() {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
}

export function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}