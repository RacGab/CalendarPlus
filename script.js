// Get the calendar element
const calendar = document.getElementById('calendar');

// Get the current date
const date = new Date();

// Set the year to 2024
date.setFullYear(2024);

// Month names array
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Day names array
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Get the control buttons
const prevMonthButton = document.getElementById('prev-month');
const nextMonthButton = document.getElementById('next-month');

// Add event listeners to the buttons
prevMonthButton.addEventListener('click', () => changeMonth(-1));
nextMonthButton.addEventListener('click', () => changeMonth(1));

// Function to change the current month
function changeMonth(direction) {
    // Change the month
    date.setMonth(date.getMonth() + direction);

    // Clear the calendar
    calendar.innerHTML = '';

    // Rebuild the calendar
    buildCalendar();
}

// Function to create an event
function createEvent(day, dayKey, eventText) {
    const eventDiv = document.createElement('div');
    eventDiv.textContent = eventText;
    eventDiv.className = 'event';
    day.appendChild(eventDiv);

    // Add an event listener to the event div
    eventDiv.addEventListener('click', function(e) {
        // Prompt the user to confirm the deletion
        const confirmDelete = window.confirm('Do you want to delete this event?');

        // If the user confirmed, delete the event
        if (confirmDelete) {
            // Remove the event from the DOM
            e.target.remove();

            // Remove the event from localStorage
            const savedEvents = JSON.parse(localStorage.getItem(dayKey) || '[]');
            const index = savedEvents.indexOf(eventText);
            if (index !== -1) {
                savedEvents.splice(index, 1);
                if (savedEvents.length === 0) {
                    // If there are no more events for the day, remove the key from localStorage
                    localStorage.removeItem(dayKey);
                } else {
                    // Otherwise, save the updated array back to localStorage
                    localStorage.setItem(dayKey, JSON.stringify(savedEvents));
                }
            }
        }

        // Prevent the click event from bubbling up to the day div
        e.stopPropagation();
    });
}

// Function to build the calendar
function buildCalendar() {
    // Get the current month and year
    const month = date.getMonth();
    const year = date.getFullYear();

    // Get today's date
    const today = new Date();

    // Add month and year to the calendar
    const monthYear = document.createElement('div');
    monthYear.textContent = `${monthNames[month]} ${year}`;
    monthYear.className = 'month-year';
    calendar.appendChild(monthYear);

    // Create a new Date object for the first day of the current month
    const firstDay = new Date(year, month, 1);

    // Get the day of the week for the first day of the month
    const startingDayOfWeek = firstDay.getDay();

    // Adjust the day names array to start with the correct day of the week
    const adjustedDayNames = dayNames.slice(startingDayOfWeek).concat(dayNames.slice(0, startingDayOfWeek));

    // Add adjusted day names to the calendar
    for (let i = 0; i < adjustedDayNames.length; i++) {
        const dayName = document.createElement('div');
        dayName.textContent = adjustedDayNames[i];
        dayName.className = 'day-name';
        calendar.appendChild(dayName);
    }

    // Create a new Date object for the last day of the current month
    const lastDay = new Date(year, month + 1, 0);

    // Loop through each day of the month
    for (let i = firstDay.getDate(); i <= lastDay.getDate(); i++) {
        // Create a new div for each day
        const day = document.createElement('div');
        day.textContent = i;

        // If the day is today, add a special class
        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            day.className = 'today';
        }

        // Load events from localStorage
        const dayKey = `${year}-${month}-${i}`; // Create a unique key for each day
        const savedEvents = JSON.parse(localStorage.getItem(dayKey) || '[]'); // Get saved events for the day
        for (const event of savedEvents) {
            createEvent(day, dayKey, event);
        }

        // Add an event listener to the day
        day.addEventListener('click', function() {
            // Open a prompt for the user to enter their event
            const event = prompt('Enter your event:');

            // If the user entered an event, add it to the day
            if (event) {
                createEvent(day, dayKey, event);

                // Save the event to localStorage
                const existingEvents = JSON.parse(localStorage.getItem(dayKey) || '[]'); // Get existing events for the day
                existingEvents.push(event); // Add the new event to the array
                localStorage.setItem(dayKey, JSON.stringify(existingEvents)); // Save the updated array back to localStorage
            }
        });

        calendar.appendChild(day);
    }
}

// Build the initial calendar
buildCalendar();