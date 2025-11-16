const API_BASE = getAPIUrl();

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("eventsContainer");

  try {
    const response = await fetch(`${API_BASE}/api/events`);
    if (!response.ok) throw new Error("Failed to fetch events");

    const events = await response.json();

    if (events.length === 0) {
      container.innerHTML = "<p>No events available.</p>";
      return;
    }

    container.innerHTML = "";
    events.forEach(event => {
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <div class="card-body">
          <h3>${event.title}</h3>
          <p><i class="fas fa-clock"></i> ${new Date(event.dateTime).toLocaleString()}</p>
          <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
          <p>Status: <span class="badge">${event.price > 0 ? `$${event.price}` : "Free"}</span></p>
          <div class="card-actions">
            <a href="event-details.html?id=${event._id}" class="btn-primary">View Details</a>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    container.innerHTML = "<p>Error loading events. Please try again later.</p>";
  }
});
