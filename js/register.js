<<<<<<< HEAD
async function registerDonor() {

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const blood = document.getElementById("blood").value;

  const age = document.getElementById("age").value;
  const gender = document.getElementById("gender").value;
  const last_donation = document.getElementById("last_donation").value;
  const weight = document.getElementById("weight").value;
  const health = document.getElementById("health").value;
  const disease = document.getElementById("disease").value;
  const availability = document.getElementById("availability").value;
  const emergency = document.getElementById("emergency").value;

  if (!name || !phone || !blood) {
    alert("Fill required fields");
    return;
  }

  navigator.geolocation.getCurrentPosition(async pos => {

    sendData(pos.coords.latitude, pos.coords.longitude);

  }, () => {
    alert("Location denied, using default");
    sendData(17.3850, 78.4867);
  });

  async function sendData(lat, lng) {
    try {
      const res = await fetch("https://bloodbank-backend-080z.onrender.com/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          phone,
          blood_group: blood,
          latitude: lat,
          longitude: lng,
          age,
          gender,
          last_donation,
          weight,
          health,
          disease,
          availability: parseInt(availability),
          emergency: parseInt(emergency)
        })
      });

      const data = await res.json();
      console.log(data);

      alert(data.message);

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  }
=======
async function registerDonor() {

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const blood = document.getElementById("blood").value;

  const age = document.getElementById("age").value;
  const gender = document.getElementById("gender").value;
  const last_donation = document.getElementById("last_donation").value;
  const weight = document.getElementById("weight").value;
  const health = document.getElementById("health").value;
  const disease = document.getElementById("disease").value;
  const availability = document.getElementById("availability").value;
  const emergency = document.getElementById("emergency").value;

  if (!name || !phone || !blood) {
    alert("Fill required fields");
    return;
  }

  navigator.geolocation.getCurrentPosition(async pos => {

    sendData(pos.coords.latitude, pos.coords.longitude);

  }, () => {
    alert("Location denied, using default");
    sendData(17.3850, 78.4867);
  });

  async function sendData(lat, lng) {
    try {
      const res = await fetch("https://bloodbank-backend-080z.onrender.com/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          phone,
          blood_group: blood,
          latitude: lat,
          longitude: lng,
          age,
          gender,
          last_donation,
          weight,
          health,
          disease,
          availability: parseInt(availability),
          emergency: parseInt(emergency)
        })
      });

      const data = await res.json();
      console.log(data);

      alert(data.message);

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  }
>>>>>>> b20fe091f1141d699df17e2b80d689bde79e6ccb
}