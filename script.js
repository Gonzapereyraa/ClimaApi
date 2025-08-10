const apiKey = "1953e614d9e14a748e6214938250908";
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherInfo = document.getElementById("weatherInfo");
const cityName = document.getElementById("cityName");
const localTime = document.getElementById("localTime");
const temp = document.getElementById("temp");
const condition = document.getElementById("condition");
const icon = document.getElementById("icon");
const forecastContainer = document.getElementById("forecast");
const historyContainer = document.getElementById("history");
const detectBtn = document.getElementById("detectBtn");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (!city) {
    alert("Por favor, escribe una ciudad.");
    return;
  }
  getWeather(city);
});

detectBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Tu navegador no soporta Geolocalización.");
    return;
  }
  detectBtn.disabled = true;
  detectBtn.textContent = "Detectando...";
  navigator.geolocation.getCurrentPosition(
    position => {
      console.log("Posición obtenida", position.coords);
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      getWeather(`${lat},${lon}`);
      detectBtn.disabled = false;
      detectBtn.textContent = "Detectar Ubicación";
    },
    error => {
      console.error("Error geolocalización:", error);
      alert("No se pudo obtener la ubicación: " + error.message);
      detectBtn.disabled = false;
      detectBtn.textContent = "Detectar Ubicación";
    }
  );
});

async function getWeather(location) {
  try {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(location)}&lang=es&days=7`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Error en la API: " + res.status);
    const data = await res.json();

    cityName.textContent = `${data.location.name}, ${data.location.country}`;
    localTime.textContent = `Hora local: ${data.location.localtime}`;
    temp.textContent = `🌡 Temp: ${data.current.temp_c}°C | Sensación: ${data.current.feelslike_c}°C`;
    condition.textContent = `🌥 ${data.current.condition.text} | 💧 Humedad: ${data.current.humidity}% | 💨 Viento: ${data.current.wind_kph} km/h`;
    icon.src = `https:${data.current.condition.icon}`;
    icon.alt = data.current.condition.text;

    forecastContainer.innerHTML = "";
    const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

data.forecast.forecastday.slice(1, 7).forEach(day => {
  const fecha = new Date(day.date);
  const nombreDia = diasSemana[fecha.getDay()];

  const div = document.createElement("div");
  div.classList.add("forecast-day");
  div.innerHTML = `
    <p><strong>${nombreDia.charAt(0).toUpperCase() + nombreDia.slice(1)}</strong></p>
    <img src="https:${day.day.condition.icon}" alt="Icono" />
    <p>${day.day.avgtemp_c}°C</p>
    <p>${day.day.condition.text}</p>
  `;
  forecastContainer.appendChild(div);
});

    weatherInfo.classList.remove("hidden");
  } catch (e) {
    alert("Error al obtener datos: " + e.message);
  }
}
