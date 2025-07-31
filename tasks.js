import { saveTasks } from './storage.js';

export function addTask(tasks, taskData) {
    const newTask = {
        id: String(Date.now()), // Use string IDs for consistency
        text: taskData.text,
        completed: false,
        dueDate: taskData.dueDate,
        priority: taskData.priority,
        description: taskData.description,
        link: taskData.link,
        attachments: taskData.attachments || [],
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

export function editTask(tasks, id, newText) {
    const newTasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, text: newText };
        }
        return task;
    });
    saveTasks(newTasks);
    return newTasks;
}

export function reorderTask(tasks, fromId, toId) {
    const fromIndex = tasks.findIndex(task => task.id === fromId);
    const toIndex = tasks.findIndex(task => task.id === toId);

    const newTasks = [...tasks];
    const [movedTask] = newTasks.splice(fromIndex, 1);
    newTasks.splice(toIndex, 0, movedTask);
    
    saveTasks(newTasks);
    return newTasks;
}


export function clearCompletedTasks(tasks) {
    const newTasks = tasks.filter(task => !task.completed);
    saveTasks(newTasks);
    return newTasks;
}

export function deleteMultipleTasks(tasks, selectedIds) {
    const newTasks = tasks.filter(task => !selectedIds.has(task.id));
    saveTasks(newTasks);
    return newTasks;
}

export function completeMultipleTasks(tasks, selectedIds) {
    const newTasks = tasks.map(task => {
        if (selectedIds.has(task.id)) {
            return { ...task, completed: true };
        }
        return task;
    });
    saveTasks(newTasks);
    return newTasks;
}


export function getFilteredTasks(tasks, filter) {
    switch (filter) {
        case 'active':
            return tasks.filter(task => !task.completed);
        case 'completed':
            return tasks.filter(task => task.completed);
        case 'all':
        default:
            return tasks;
    }
}