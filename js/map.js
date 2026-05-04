let map;
let markers = [];

// ✅ INIT MAP
document.addEventListener("DOMContentLoaded", () => {

  map = L.map('map').setView([17.3850, 78.4867], 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);

  console.log("✅ Map Loaded");
});


// 🔍 SEARCH FUNCTION
async function search() {

  if (!map) {
    alert("Map not loaded yet");
    return;
  }

  const blood = document.getElementById("blood").value;
  const radius = document.getElementById("radius").value;
  const availability = document.getElementById("availability").value;
  const emergency = document.getElementById("emergency").value;

  const resultsDiv = document.getElementById("results");

  if (!blood) {
    alert("Select blood group");
    return;
  }

  // 🧹 CLEAR OLD DATA
  markers.forEach(m => map.removeLayer(m));
  markers = [];
  resultsDiv.innerHTML = "";

  // 📍 GET LOCATION
  navigator.geolocation.getCurrentPosition(
    pos => runSearch(pos.coords.latitude, pos.coords.longitude),
    () => {
      console.warn("Location denied → using default");
      runSearch(17.3850, 78.4867);
    }
  );

  // 🚀 MAIN SEARCH
  async function runSearch(lat, lng) {

    try {
      const res = await fetch("https://bloodbank-backend-080z.onrender.com/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          blood_group: blood,
          radius: parseInt(radius) || 10,
          availability: availability ? parseInt(availability) : null,
          emergency: emergency ? parseInt(emergency) : null,
          lat,
          lng
        })
      });

      const data = await res.json();
      console.log("API:", data);

      if (!Array.isArray(data) || data.length === 0) {
        resultsDiv.innerHTML = "<p style='text-align:center;'>❌ No donors found</p>";
        return;
      }

      // 🔁 LOOP RESULTS
      data.forEach(d => {

        // 📍 MAP MARKER
        const marker = L.marker([d.latitude, d.longitude])
          .addTo(map)
          .bindPopup(`
            <b>${d.name}</b><br>
            📞 <a href="tel:${d.phone}">${d.phone}</a><br>
            🩸 ${d.blood_group}<br>
            📍 ${d.distance ? d.distance.toFixed(2) + " KM" : ""}<br><br>

            <a href="https://www.google.com/maps/dir/?api=1&destination=${d.latitude},${d.longitude}" target="_blank">
              🚗 Get Directions
            </a><br><br>

            <button onclick="markDonated(${d.id}, this)">
              🩸 Donated
            </button>
          `);

        markers.push(marker);

        // 📋 RESULT CARD
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
          <h3>${d.name}</h3>
          <p>📞 ${d.phone}</p>
          <p>🩸 ${d.blood_group}</p>
          <p>📍 ${d.distance ? d.distance.toFixed(2) + " KM away" : ""}</p>
        `;

        // 🎯 CLICK CARD → ZOOM
        card.addEventListener("click", () => {
          map.setView([d.latitude, d.longitude], 14);
          marker.openPopup();
        });

        resultsDiv.appendChild(card);
      });

      // 🎯 AUTO FOCUS FIRST RESULT
      map.setView([data[0].latitude, data[0].longitude], 13);

    } catch (err) {
      console.error("FETCH ERROR:", err);
      alert("Server connection error ❌");
    }
  }
}


// 🩸 MARK DONATED FUNCTION (FIXED)
async function markDonated(id, btn) {

  console.log("Sending ID:", id);

  if (!confirm("Mark this donor as donated?")) return;

  // 🔒 Disable button
  if (btn) {
    btn.disabled = true;
    btn.innerText = "Processing...";
  }

  try {
    const res = await fetch("https://bloodbank-backend-080z.onrender.com/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id })
    });

    const data = await res.json();
    console.log("DONATION RESPONSE:", data);

    // ❌ Handle backend error properly
    if (!res.ok) {
      alert(data.message || "Error updating donor ❌");

      if (btn) {
        btn.disabled = false;
        btn.innerText = "🩸 Donated";
      }
      return;
    }

    // ✅ SUCCESS
    alert("Donor marked as donated ✅");

    // 🔥 REMOVE MARKER INSTANTLY (better UX)
    markers.forEach(m => {
      if (m.getLatLng().lat === data.latitude &&
          m.getLatLng().lng === data.longitude) {
        map.removeLayer(m);
      }
    });

    // 🔄 REFRESH RESULTS
    setTimeout(() => {
      search();
    }, 300);

  } catch (err) {
    console.error("DONATION ERROR:", err);
    alert("Error updating donor ❌");

    if (btn) {
      btn.disabled = false;
      btn.innerText = "🩸 Donated";
    }
  }
}