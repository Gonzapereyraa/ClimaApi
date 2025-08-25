const apiKey = "48cade6b435f48bdabc7a5e3b87090f8"; 
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherInfo = document.getElementById("weatherInfo");
const cityName = document.getElementById("cityName");
const localTime = document.getElementById("localTime");
const temp = document.getElementById("temp");
const condition = document.getElementById("condition");
const icon = document.getElementById("icon");
const forecastContainer = document.getElementById("forecast");
const detectBtn = document.getElementById("detectBtn");

const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

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
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      getWeather(`${lat},${lon}`);
      detectBtn.disabled = false;
      detectBtn.textContent = "Detectar Ubicación";
    },
    error => {
      alert("No se pudo obtener la ubicación: " + error.message);
      detectBtn.disabled = false;
      detectBtn.textContent = "Detectar Ubicación";
    }
  );
});

async function getWeather(location) {
  try {
    let url;

    if (location.includes(",")) {
      const [lat, lon] = location.split(",");
      url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&days=7&lang=es&key=${apiKey}`;
    } else {
      const ciudadArgentina = `${encodeURIComponent(location)},AR`;
      url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${ciudadArgentina}&days=7&lang=es&key=${apiKey}`;
    }

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Error en la API: ${res.status} ${res.statusText}`);
    }

    const text = await res.text();
    if (!text) {
      throw new Error("La API devolvió respuesta vacía");
    }

    let data;
    try {
      data = JSON.parse(text); 
    } catch (err) {
      console.error("Respuesta no es JSON:", text);
      throw new Error("Respuesta de la API no es JSON válido");
    }

    
    const hoy = data.data[0];
    cityName.textContent = `${data.city_name}, ${data.country_code}`;
    localTime.textContent = `Fecha: ${hoy.valid_date}`;
    temp.textContent = `🌡 Temp: ${hoy.temp}°C | Sensación: ${hoy.app_max_temp}°C`;
    condition.textContent = `🌥 ${hoy.weather.description} | 💧 Humedad: ${hoy.rh}% | 💨 Viento: ${hoy.wind_spd.toFixed(1)} m/s`;
    icon.src = `https://www.weatherbit.io/static/img/icons/${hoy.weather.icon}.png`;
    icon.alt = hoy.weather.description;


    forecastContainer.innerHTML = "";
    data.data.slice(1, 7).forEach(day => {
      const fecha = new Date(day.valid_date);
      const nombreDia = diasSemana[fecha.getDay()];

      const div = document.createElement("div");
      div.classList.add("forecast-day");
      div.innerHTML = `
        <p><strong>${nombreDia.charAt(0).toUpperCase() + nombreDia.slice(1)}</strong></p>
        <img src="https://www.weatherbit.io/static/img/icons/${day.weather.icon}.png" alt="Icono" />
        <p>${day.temp}°C</p>
        <p>${day.weather.description}</p>
      `;
      forecastContainer.appendChild(div);
    });

    weatherInfo.classList.remove("hidden");

  } catch (e) {
    alert("Error al obtener datos: " + e.message);
    console.error(e);
  }
}
