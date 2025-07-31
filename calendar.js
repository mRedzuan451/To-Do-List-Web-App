function renderCalendar(tasks = []) {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) return; // Guard clause in case the element isn't there

    let currentMonth, currentYear;

    function updateCalendar(month, year) {
        currentMonth = month;
        currentYear = year;

        calendarEl.innerHTML = '';
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0); // Corrected typo here

        const header = document.createElement('div');
        header.className = 'flex justify-between items-center mb-4';
        header.innerHTML = `
            <button id="prev-month" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><i class="fas fa-chevron-left"></i></button>
            <h3 class="font-bold">${firstDay.toLocaleString('default', { month: 'long' })} ${currentYear}</h3>
            <button id="next-month" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><i class="fas fa-chevron-right"></i></button>
        `;
        calendarEl.appendChild(header);

        const daysGrid = document.createElement('div');
        daysGrid.className = 'grid grid-cols-7 gap-1 text-center';
        
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        daysOfWeek.forEach(day => {
            daysGrid.innerHTML += `<div class="font-semibold text-xs">${day}</div>`;
        });

        for (let i = 0; i < firstDay.getDay(); i++) {
            daysGrid.innerHTML += '<div></div>';
        }

        const today = new Date();
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const date = new Date(currentYear, currentMonth, i);
            const dateString = date.toISOString().split('T')[0];
            const hasDueDate = tasks.some(task => task.dueDate === dateString && !task.completed);
            
            let classes = "p-1 rounded-full";
            if (hasDueDate) {
                classes += " bg-blue-500 text-white";
            }
            if (i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
                classes += " ring-2 ring-blue-500";
            }
            
            daysGrid.innerHTML += `<div class="${classes}">${i}</div>`;
        }
        calendarEl.appendChild(daysGrid);

        document.getElementById('prev-month').addEventListener('click', () => {
            let newMonth = currentMonth - 1;
            let newYear = currentYear;
            if (newMonth < 0) {
                newMonth = 11;
                newYear--;
            }
            updateCalendar(newMonth, newYear);
        });

        document.getElementById('next-month').addEventListener('click', () => {
            let newMonth = currentMonth + 1;
            let newYear = currentYear;
            if (newMonth > 11) {
                newMonth = 0;
                newYear++;
            }
            updateCalendar(newMonth, newYear);
        });
    }

    // Initialize calendar with current month and year
    if (calendarEl.innerHTML === '') {
        const now = new Date();
        updateCalendar(now.getMonth(), now.getFullYear());
    }
}

export { renderCalendar };