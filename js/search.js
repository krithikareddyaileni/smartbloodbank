<<<<<<< HEAD
// Global markers array
let markers = [];

async function search() {

  const blood = document.getElementById("blood").value.trim();
  const radius = document.getElementById("radius").value;
  const availability = document.getElementById("availability").value;
  const emergency = document.getElementById("emergency").value;

  if (!blood) {
    alert("Please select blood group");
    return;
  }

  // Clear old markers
  if (typeof map !== "undefined") {
    markers.forEach(m => map.removeLayer(m));
    markers = [];
  }

  // 📍 Get location
  navigator.geolocation.getCurrentPosition(
    pos => runSearch(pos.coords.latitude, pos.coords.longitude),
    () => {
      alert("Location denied, using default");
      runSearch(17.3850, 78.4867); // Hyderabad fallback
    }
  );

  // 🔥 MAIN SEARCH FUNCTION
  async function runSearch(lat, lng) {
    try {

      const res = await fetch("https://bloodbank-backend-080z.onrender.com/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          blood_group: blood,
          radius: parseInt(radius) || 5,
          availability: parseInt(availability) || 1,
          emergency: parseInt(emergency) || 0,
          lat,
          lng
        })
      });

      const data = await res.json();

      console.log("API Response:", data);

      if (!Array.isArray(data) || data.length === 0) {
        alert("No donors found nearby");
        return;
      }

      // 🔥 Add markers
      data.forEach(d => {

        const marker = L.marker([d.latitude, d.longitude])
          .addTo(map)
          .bindPopup(`
            <b>${d.name}</b><br>
            📞 ${d.phone}<br>
            🩸 ${d.blood_group}<br>
            📍 ${Number(d.distance).toFixed(2)} km away
          `);

        markers.push(marker);
      });

      // Zoom to first donor
      map.setView([data[0].latitude, data[0].longitude], 13);

    } catch (err) {
      console.error("FETCH ERROR:", err);
      alert("Error connecting to server ❌");
    }
  }
=======
// Global markers array
let markers = [];

async function search() {

  const blood = document.getElementById("blood").value.trim();
  const radius = document.getElementById("radius").value;
  const availability = document.getElementById("availability").value;
  const emergency = document.getElementById("emergency").value;

  if (!blood) {
    alert("Please select blood group");
    return;
  }

  // Clear old markers
  if (typeof map !== "undefined") {
    markers.forEach(m => map.removeLayer(m));
    markers = [];
  }

  // 📍 Get location
  navigator.geolocation.getCurrentPosition(
    pos => runSearch(pos.coords.latitude, pos.coords.longitude),
    () => {
      alert("Location denied, using default");
      runSearch(17.3850, 78.4867); // Hyderabad fallback
    }
  );

  // 🔥 MAIN SEARCH FUNCTION
  async function runSearch(lat, lng) {
    try {

      const res = await fetch("https://bloodbank-backend-080z.onrender.com/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          blood_group: blood,
          radius: parseInt(radius) || 5,
          availability: parseInt(availability) || 1,
          emergency: parseInt(emergency) || 0,
          lat,
          lng
        })
      });

      const data = await res.json();

      console.log("API Response:", data);

      if (!Array.isArray(data) || data.length === 0) {
        alert("No donors found nearby");
        return;
      }

      // 🔥 Add markers
      data.forEach(d => {

        const marker = L.marker([d.latitude, d.longitude])
          .addTo(map)
          .bindPopup(`
            <b>${d.name}</b><br>
            📞 ${d.phone}<br>
            🩸 ${d.blood_group}<br>
            📍 ${Number(d.distance).toFixed(2)} km away
          `);

        markers.push(marker);
      });

      // Zoom to first donor
      map.setView([data[0].latitude, data[0].longitude], 13);

    } catch (err) {
      console.error("FETCH ERROR:", err);
      alert("Error connecting to server ❌");
    }
  }
>>>>>>> b20fe091f1141d699df17e2b80d689bde79e6ccb
}