const API_KEY = '5372ae1145b54eca9fb1e77cb333cdb0'; // Replace with your actual API key
const EVENTS_API_URL = 'https://api.nyc.gov/calendar/search'; // Using the /search endpoint

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
        }n
        const data = await response.json();
        const events = data.items; // Assuming the events are in a 'items' array

        if (events && events.length > 0) {
            container.innerHTML = ''; // Clear loading message
            const eventsToDisplay = events.slice(0, 3); // Display only the first 3 events

            eventsToDisplay.forEach(event => {
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
            });

            if (events.length > 3) {
                // Add a link to view all events
                container.innerHTML += '<div class="view-all-events"><a href="/all-events.html">View All Events</a></div>';
            }

        } else {
            container.innerHTML = '<p>No events found for today. Check back soon!</p>';
        }

    } catch (error) {
        console.error('Error fetching NYC events:', error);
        container.innerHTML = '<p>Failed to load events. Please try again later.</p>';
    }
}

// Call the function to fetch events when the DOM is loaded
document.addEventListener('DOMContentLoaded', fetchNYCEvents);



live
