let currentMonth;
let currentYear;

function updateCalendarState(tasks) {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) return;

    // Clear previous calendar content
    calendarEl.innerHTML = '';

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    const header = document.createElement('div');
    header.className = 'flex justify-between items-center mb-4';
    header.innerHTML = `
        <button id="prev-month" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><i class="fas fa-chevron-left"></i></button>
        <h3 class="font-bold text-lg">${firstDay.toLocaleString('default', { month: 'long' })} ${currentYear}</h3>
        <button id="next-month" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><i class="fas fa-chevron-right"></i></button>
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
        
        let classes = "p-1.5 rounded-full cursor-pointer transition-colors duration-200";
        if (hasDueDate) {
            classes += " bg-blue-500 text-white hover:bg-blue-600";
        } else {
            classes += " hover:bg-gray-200 dark:hover:bg-gray-700";
        }

        if (i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
            classes += " ring-2 ring-blue-500";
        }
        
        daysGrid.innerHTML += `<div class="${classes}">${i}</div>`;
    }
    calendarEl.appendChild(daysGrid);

    document.getElementById('prev-month').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendarState(tasks);
    });

    document.getElementById('next-month').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendarState(tasks);
    });
}

function renderCalendar(tasks = []) {
    // Initialize month and year on the first run
    if (currentMonth === undefined || currentYear === undefined) {
        const now = new Date();
        currentMonth = now.getMonth();
        currentYear = now.getFullYear();
    }
    updateCalendarState(tasks);
}

export { renderCalendar };