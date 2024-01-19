const calendar = document.getElementById('calendar');
const dialog = document.getElementById('dialog');
const [editButton, deleteButton, cancelButton] = ['edit-button', 'delete-button', 'cancel-button'].map(id => document.getElementById(id));
let date = new Date();
const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
['prev-month', 'next-month'].forEach((id, i) => document.getElementById(id).addEventListener('click', () => changeMonth(i * 2 - 1)));

function changeMonth(direction) {
    const year = date.getFullYear();
    const month = date.getMonth() + direction;
    date = new Date(year, month, 1);
    calendar.innerHTML = '';
    buildCalendar();
}

function createEvent(day, dayKey, eventText) {
    const eventDiv = document.createElement('div');
    eventDiv.textContent = eventText;
    eventDiv.className = 'event';
    day.appendChild(eventDiv);
    eventDiv.addEventListener('click', e => showDialog(e, dayKey, eventText));
}

function showDialog(e, dayKey, eventText) {
    dialog.style.display = 'block';
    const actions = [editEvent, deleteEvent, cancelDialog];
    [editButton, deleteButton, cancelButton].forEach((btn, i) => btn.addEventListener('click', actions[i]));

    function editEvent() {
        const newEventText = window.prompt('Enter the new event text:');
        if (newEventText) {
            e.target.textContent = newEventText;
            updateLocalStorage(dayKey, eventText, newEventText);
        }
        hideDialog();
    }

    function deleteEvent() {
        if (window.confirm('Are you sure you want to delete this event?')) {
            e.target.remove();
            updateLocalStorage(dayKey, eventText);
        }
        hideDialog();
    }

    function cancelDialog() {
        hideDialog();
    }

    function hideDialog() {
        dialog.style.display = 'none';
        [editButton, deleteButton, cancelButton].forEach((btn, i) => btn.removeEventListener('click', actions[i]));
    }
}

function updateLocalStorage(dayKey, oldEvent, newEvent) {
    const savedEvents = JSON.parse(localStorage.getItem(dayKey) || '[]');
    const index = savedEvents.indexOf(oldEvent);
    if (index !== -1) {
        if (newEvent) {
            savedEvents[index] = newEvent;
        } else {
            savedEvents.splice(index, 1);
        }
        localStorage.setItem(dayKey, savedEvents.length ? JSON.stringify(savedEvents) : '');
    }
}

function buildCalendar() {
    const month = date.getMonth();
    const year = date.getFullYear();
    const today = new Date();
    calendar.appendChild(createElement('div', `${monthNames[month]} ${year}`, 'month-year'));
    dayNames.forEach(name => calendar.appendChild(createElement('div', name, 'day-name')));
    const firstDay = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();

    // Add empty slots for the days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        calendar.appendChild(createElement('div', '', 'empty-day'));
    }

    for (let i = 1; i <= lastDay; i++) {
        const day = createElement('div', i, i === today.getDate() && month === today.getMonth() && year === today.getFullYear() ? 'today' : '');
        const dayKey = `${year}-${month}-${i}`;
        (JSON.parse(localStorage.getItem(dayKey) || '[]')).forEach(event => createEvent(day, dayKey, event));
        day.addEventListener('click', (e) => {
            if (e.target === day) {
                const event = prompt('Enter your event:');
                if (event) {
                    createEvent(day, dayKey, event);
                    const existingEvents = JSON.parse(localStorage.getItem(dayKey) || '[]');
                    existingEvents.push(event);
                    localStorage.setItem(dayKey, JSON.stringify(existingEvents));
                }
            }
        });
        calendar.appendChild(day);
    }
}

function createElement(type, textContent, className) {
    const element = document.createElement(type);
    element.textContent = textContent;
    element.className = className;
    return element;
}

buildCalendar();