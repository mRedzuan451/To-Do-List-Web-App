// calendar.js

function renderCalendar(tasks = []) {
    const calendarEl = document.getElementById('calendar');
    const now = new Date();
    let currentMonth = now.getMonth();
    let currentYear = now.getFullYear();

    function updateCalendar() {
        calendarEl.innerHTML = '';
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new BDate(currentYear, currentMonth + 1, 0);

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

        for (let i = 1; i <= lastDay.getDate(); i++) {
            const date = new Date(currentYear, currentMonth, i);
            const dateString = date.toISOString().split('T')[0];
            const hasDueDate = tasks.some(task => task.dueDate === dateString);
            
            daysGrid.innerHTML += `
                <div class="p-1 rounded-full ${hasDueDate ? 'bg-blue-500 text-white' : ''} ${i === now.getDate() && currentMonth === now.getMonth() && currentYear === now.getFullYear() ? 'ring-2 ring-blue-500' : ''}">
                    ${i}
                </div>
            `;
        }
        calendarEl.appendChild(daysGrid);

        document.getElementById('prev-month').addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            updateCalendar();
        });

        document.getElementById('next-month').addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            updateCalendar();
        });
    }

    updateCalendar();
}

export { renderCalendar };