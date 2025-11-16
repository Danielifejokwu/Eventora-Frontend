const API_BASE = getAPIUrl();

document.addEventListener("DOMContentLoaded", () => {

  // ======== AUTH FUNCTIONS ======== //
  async function loginUser(email, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");
      localStorage.setItem("token", data.token);
      window.location.href = "events.html";
    } catch (err) {
      alert(err.message);
    }
  }

  async function registerUser(name, email, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Registration failed");
      alert("Registration successful! Please login.");
      window.location.href = "login.html";
    } catch (err) {
      alert(err.message);
    }
  }

  function logoutUser() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  }

  // ======== AUTH CHECK ======== //
  function checkAuth() {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "login.html";
    }
  }

  // ======== FETCH EVENTS ======== //
  async function renderEvents() {
    try {
      const res = await fetch(`${API_BASE}/events`);
      const events = await res.json();

      const container = document.querySelector(".events-grid");
      container.innerHTML = "";

      events.forEach(ev => {
        const card = document.createElement("div");
        card.classList.add("event-card");
        card.innerHTML = `
          <img src="${ev.picture}" alt="${ev.title}">
          <h3>${ev.title}</h3>
          <p><i class="fas fa-clock"></i> ${new Date(ev.dateTime).toLocaleString()}</p>
          <p><i class="fas fa-map-marker-alt"></i> ${ev.location}</p>
          <a href="event-details.html?id=${ev._id}" class="btn-primary">Details</a>
        `;
        container.appendChild(card);
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function renderEventDetails() {
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get("id");
    if (!eventId) return;

    try {
      const res = await fetch(`${API_BASE}/events/${eventId}`);
      const event = await res.json();

      document.querySelector(".event-banner img").src = event.picture;
      document.querySelector(".event-details-info h2").innerText = event.title;
      document.querySelector(".event-meta:nth-of-type(1)").innerHTML = `<i class="fas fa-clock"></i> ${new Date(event.dateTime).toLocaleString()}`;
      document.querySelector(".event-meta:nth-of-type(2)").innerHTML = `<i class="fas fa-map-marker-alt"></i> ${event.location}`;
      document.querySelector(".event-description").innerText = event.description || "No description available.";
      document.querySelector(".event-price").innerText = event.price > 0 ? `$${event.price}` : "Free Event";
    } catch (err) {
      console.error(err);
    }
  }

  // ======== PAGE LOGIC ======== //
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", e => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      loginUser(email, password);
    });
  }

  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", e => {
      e.preventDefault();
      console.log("trigger")
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      registerUser(name, email, password);
    });
  }

  if (document.querySelector(".events-grid")) {
    checkAuth();
    renderEvents();
  
  }

  if (document.querySelector(".event-details")) {
    checkAuth();
    renderEventDetails();
  }

  const logoutBtn = document.querySelector(".sidebar a[href='login.html']");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", e => {
      e.preventDefault();
      logoutUser();
    });
  }
});
