let currentMonth;
let currentYear;

function updateCalendarState(tasks, elementId) {
    const calendarEl = document.getElementById(elementId);
    if (!calendarEl) return;

    calendarEl.innerHTML = '';

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    const header = document.createElement('div');
    header.className = 'flex justify-between items-center mb-4';
    header.innerHTML = `
        <button data-calendar-id="${elementId}" class="prev-month-btn p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><i class="fas fa-chevron-left"></i></button>
        <h3 class="font-bold text-lg">${firstDay.toLocaleString('default', { month: 'long' })} ${currentYear}</h3>
        <button data-calendar-id="${elementId}" class="next-month-btn p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><i class="fas fa-chevron-right"></i></button>
    `;
    calendarEl.appendChild(header);

    const daysGrid = document.createElement('div');
    daysGrid.className = 'grid grid-cols-7 gap-1 text-center';
    
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysOfWeek.forEach(day => {
        daysGrid.innerHTML += `<div class="font-semibold text-xs text-gray-600 dark:text-gray-400">${day}</div>`;
    });

    for (let i = 0; i < firstDay.getDay(); i++) {
        daysGrid.innerHTML += '<div></div>';
    }

    const today = new Date();
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(currentYear, currentMonth, i);
        const dateString = date.toISOString().split('T')[0];
        const hasDueDate = tasks.some(task => task.dueDate === dateString && !task.completed);
        const isToday = i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
        
        let classes = "p-1.5 rounded-full cursor-pointer transition-colors duration-200";

        if (hasDueDate) {
            classes += " bg-blue-500 text-white hover:bg-blue-600";
        } else if (isToday) {
            // A special style for today's date if it's not a due date
            classes += " bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 font-bold";
        } else {
            classes += " hover:bg-gray-200 dark:hover:bg-gray-700";
        }

        if (isToday) {
            // Always add a ring to today's date to make it stand out
            classes += " ring-2 ring-blue-500";
        }
        
        daysGrid.innerHTML += `<div class="${classes}">${i}</div>`;
    }
    calendarEl.appendChild(daysGrid);

    // Re-add event listeners for the new buttons
    calendarEl.querySelector('.prev-month-btn').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendarState(tasks, elementId);
    });

    calendarEl.querySelector('.next-month-btn').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendarState(tasks, elementId);
    });
}

function renderCalendar(tasks = [], elementId) {
    if (currentMonth === undefined || currentYear === undefined) {
        const now = new Date();
        currentMonth = now.getMonth();
        currentYear = now.getFullYear();
    }
    updateCalendarState(tasks, elementId);
}

export { renderCalendar };