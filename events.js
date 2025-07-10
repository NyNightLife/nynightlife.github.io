const API_KEY = '5372ae1145b54eca9fb1e77cb333cdb0'; // Replace with your actual API key
const EVENTS_API_URL = 'https://api.nyc.gov/calendar/search'; // Using the /search endpoint

let currentEventIndex = 0;
let allEvents = [];
const eventsPerPage = 3; // Display 3 events at a time

async function fetchNYCEvents() {
    const container = document.getElementById('nyc-events-container');
    if (!container) {
        console.error('Events container not found.');
        return;
    }

    container.innerHTML = '<p>Loading NYC events...</p>'; // Show loading message

    try {
        const today = new Date();
        const formattedStartDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()} 05:00 PM`; // 5 PM
        const formattedEndDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()} 11:59 PM`; // 11:59 PM

        const response = await fetch(`${EVENTS_API_URL}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`, {
            headers: {
                'Ocp-Apim-Subscription-Key': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        allEvents = data.items; // Store all fetched events

        if (allEvents && allEvents.length > 0) {
            renderEvents();
        } else {
            container.innerHTML = '<p>No events found for today. Check back soon!</p>';
        }

    } catch (error) {
        console.error('Error fetching NYC events:', error);
        container.innerHTML = '<p>Failed to load events. Please try again later.</p>';
    }
}

function renderEvents() {
    const container = document.getElementById('nyc-events-container');
    container.innerHTML = ''; // Clear loading message

    const start = currentEventIndex;
    const end = Math.min(currentEventIndex + eventsPerPage, allEvents.length);

    for (let i = start; i < end; i++) {
        const event = allEvents[i];
        const eventCard = `
            <div class="event-card">
                <div class="event-time">${event.time || 'N/A'}</div>
                <h3 class="event-title">${event.name || 'No Title'}</h3>
                <div class="event-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${event.location || 'N/A'}
                </div>
                <p>${event.description || 'No description available.'}</p>
                <a href="${event.event_url || '#'}" class="event-cta" target="_blank" rel="noopener">Get Tickets</a>
            </div>
        `;
        container.innerHTML += eventCard;
    }

    // Update arrow visibility
    document.getElementById('prev-event').style.display = currentEventIndex > 0 ? 'block' : 'none';
    document.getElementById('next-event').style.display = currentEventIndex + eventsPerPage < allEvents.length ? 'block' : 'none';
}

function nextEvents() {
    if (currentEventIndex + eventsPerPage < allEvents.length) {
        currentEventIndex += eventsPerPage;
        renderEvents();
    }
}

function prevEvents() {
    if (currentEventIndex > 0) {
        currentEventIndex -= eventsPerPage;
        renderEvents();
    }
}

// Call the function to fetch events when the DOM is loaded
document.addEventListener('DOMContentLoaded', fetchNYCEvents);

// Attach event listeners to arrows
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('prev-event').addEventListener('click', prevEvents);
    document.getElementById('next-event').addEventListener('click', nextEvents);
});
