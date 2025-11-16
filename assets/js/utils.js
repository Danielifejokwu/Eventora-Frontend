function getAPIUrl() {
    const isLocal = window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname === "";

    return isLocal
        ? "http://localhost:5000" // Local API (Node, .NET, etc.)
        : "https://eventora-backend-dqcx.onrender.com"; // Live API

}
