import { saveTasks } from './storage.js';

function findTask(tasks, id) {
    for (const task of tasks) {
        if (task.id == id) return task;
        if (task.subtasks && task.subtasks.length > 0) {
            const found = findTask(task.subtasks, id);
            if (found) return found;
        }
    }
    return null;
}

export function addTask(tasks, taskData) {
    const newTask = {
        id: String(Date.now()),
        text: taskData.text,
        completed: false,
        dueDate: taskData.dueDate,
        priority: taskData.priority,
        description: taskData.description,
        link: taskData.link,
        attachments: taskData.attachments || [],
        elapsedTime: 0,
        timerStartTime: null,
        subtasks: [], // For nested tasks
        parentId: null // To identify a subtask's parent
    };
    const newTasks = [...tasks, newTask];
    saveTasks(newTasks);
    return newTasks;
}

export function addSubtask(tasks, parentId, subtaskData) {
    const newTasks = JSON.parse(JSON.stringify(tasks)); // Deep copy
    const parentTask = findTask(newTasks, parentId);
    if (parentTask) {
        const newSubtask = {
            id: String(Date.now()),
            text: subtaskData.text,
            completed: false,
            parentId: parentId,
            // Subtasks can inherit properties or have their own
            dueDate: null,
            priority: 'none',
            elapsedTime: 0,
            timerStartTime: null,
        };
        parentTask.subtasks.push(newSubtask);
    }
    saveTasks(newTasks);
    return newTasks;
}


export function deleteTask(tasks, id) {
    const newTasks = tasks.filter(task => task.id != id).map(task => {
        if (task.subtasks) {
            task.subtasks = deleteTask(task.subtasks, id);
        }
        return task;
    });
    saveTasks(newTasks);
    return newTasks;
}

export function toggleTask(tasks, id) {
    const newTasks = JSON.parse(JSON.stringify(tasks));
    const task = findTask(newTasks, id);
    if(task) {
        task.completed = !task.completed;
    }
    saveTasks(newTasks);
    return newTasks;
}

export function editTask(tasks, id, newText) {
    const newTasks = JSON.parse(JSON.stringify(tasks));
    const task = findTask(newTasks, id);
    if(task) {
        task.text = newText;
    }
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
    let newTasks = tasks.filter(task => !task.completed);
    newTasks = newTasks.map(task => {
        if (task.subtasks && task.subtasks.length > 0) {
            task.subtasks = clearCompletedTasks(task.subtasks);
        }
        return task;
    });
    saveTasks(newTasks);
    return newTasks;
}

export function deleteMultipleTasks(tasks, selectedIds) {
    let newTasks = tasks.filter(task => !selectedIds.has(String(task.id)));
    newTasks = newTasks.map(task => {
        if (task.subtasks) {
            task.subtasks = deleteMultipleTasks(task.subtasks, selectedIds);
        }
        return task;
    });
    saveTasks(newTasks);
    return newTasks;
}

export function completeMultipleTasks(tasks, selectedIds) {
    const newTasks = tasks.map(task => {
        if (selectedIds.has(String(task.id))) {
            task.completed = true;
        }
        if (task.subtasks) {
            task.subtasks = completeMultipleTasks(task.subtasks, selectedIds);
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

export function startTimer(tasks, id) {
    const newTasks = JSON.parse(JSON.stringify(tasks));
    const task = findTask(newTasks, id);
     if(task) {
        task.timerStartTime = Date.now();
    }
    saveTasks(newTasks);
    return newTasks;
}

export function stopTimer(tasks, id) {
    const newTasks = JSON.parse(JSON.stringify(tasks));
    const task = findTask(newTasks, id);
    if(task && task.timerStartTime) {
        task.elapsedTime += Date.now() - task.timerStartTime;
        task.timerStartTime = null;
    }
    saveTasks(newTasks);
    return newTasks;
}