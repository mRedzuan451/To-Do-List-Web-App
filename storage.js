import { saveTasks } from './storage.js';

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