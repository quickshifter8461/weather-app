const inputEL = document.getElementById("city-name");
const buttonEl = document.getElementById("search-btn");
const resultEl = document.getElementById("result");
const temp = document.getElementById("temp");
const weatherDes = document.getElementById("weather-des");
const icon = document.getElementById("icon");
const apiKey = "81806752e51eef514b410c567eaf89f7";
const errorEl = document.getElementById("name-error");
const dateEl = document.getElementById("date");
const dateData = new Date();
const date = dateData.toLocaleDateString();
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const weekdayName = weekdays[dateData.getDay()];
const locationEl = document.getElementById("current-city");
const minTempEL = document.getElementById("min-temp");
const maxTempEl = document.getElementById("max-temp");
const feelsLikeEl = document.getElementById("feels-like");
const humidityEl = document.getElementById("humidity");
const pressureEl = document.getElementById("pressure");
const visibilityEl = document.getElementById("visibility");
const titleEL = document.getElementById("current-title")
const windSpeedEl = document.getElementById("wind-speed")
const windDirectionEl = document.getElementById("wind-direction")
const windGustEl =document.getElementById("wind-gust")
const populationEl = document.getElementById("population")
const cityLatitudeEL = document.getElementById('latitude')
const cityLongitudeEl = document.getElementById('longitude')
const currentCityNameEl =document.getElementById("current-city-name")
let latitude, longitude;

dateEl.textContent = `${weekdayName} - ${date}`;

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
  
  function showPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    fetchWeatherData(latitude, longitude);
  }
  
  function showError(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        console.log("Geolocation request denied.");
        break;
      case error.POSITION_UNAVAILABLE:
        console.log("Location unavailable.");
        break;
      case error.TIMEOUT:
        console.log("The request timed out.");
        break;
      case error.UNKNOWN_ERROR:
        console.log("An unknown error occurred.");
        break;
    }
  }
}
getLocation();
function getWindDirection(degree) {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(degree / 45) % 8;
    return directions[index];
  }

async function fetchWeatherData(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();
    let minTempDay = [];
    for (i = 0; i < data.list.length; i++) {
      minTempDay.push(Math.floor(data.list[i].main.temp_min));
    }
    let maxTempDay = [];
    for (i = 0; i < data.list.length; i++) {
      maxTempDay.push(Math.floor(data.list[i].main.temp_max));
    }
    titleEL.innerHTML =`Today's Weather In ${data.city.name}`
    locationEl.innerHTML = `${data.city.name}`;
    temp.innerHTML = `${Math.floor(data.list[0].main.temp)}°c`;
    weatherDes.innerHTML = `${data.list[0].weather[0].description}`;
    minTempEL.innerHTML = `${Math.min(...minTempDay)}°c`;
    maxTempEl.innerHTML = `${Math.max(...maxTempDay)}°c`;
    feelsLikeEl.innerHTML = `${Math.floor(data.list[0].main.feels_like)}°c`;
    humidityEl.innerHTML = `${data.list[0].main.humidity}%`;
    pressureEl.innerHTML = `${data.list[0].main.pressure}mb`;
    visibilityEl.innerHTML = `${Math.floor(data.list[0].visibility / 1000)}Km`;
    windSpeedEl.innerHTML = `Wind Speed: ${Math.floor((data.list[0].wind.speed)*3.6)} km/h`
    windDirectionEl.innerHTML =`Wind Direction: ${getWindDirection(data.list[0].wind.deg)}`
    windGustEl.innerHTML =`Wind Gust: ${Math.floor((data.list[0].wind.gust)*3.6)} km/h`
    populationEl.innerHTML =`Population: ${data.city.population}`
    currentCityNameEl.innerHTML=`${data.city.name}`
    cityLatitudeEL.innerHTML = `Latitude: ${data.city.coord.lat}°N`
    cityLongitudeEl.innerHTML = `Longitude: ${data.city.coord.lon}°E`
    icon.setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@4x.png`
    );
  } catch (err) {
    resultEl.textContent = "Error fetching data";
    console.log("Fetch weather data error:", err);
  }
}



buttonEl.addEventListener("click", async () => {
    resultEl.textContent =""
  try {
    let cityName = inputEL.value.trim();
    if (cityName === "") {
      errorEl.textContent = "Please enter valid city name";
      return;
    }
    errorEl.textContent = "";
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`
    );
    const data = await response.json();
    const lon = data[0].lon;
    const lat = data[0].lat;
    temp.innerHTML = "";
    weatherDes.innerHTML = "";
    fetchWeatherData(lat, lon);
  } catch (err) {
    resultEl.textContent = "Error fetching data";
    console.log("Fetch city data error:", err);
  }
  inputEL.value=''
});
