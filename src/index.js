function formatIcon(iconCode) {
  switch (true) {
    case iconCode === "01d":
      return "/img/clear-day.svg";
    case iconCode === "01n":
      return "/img/clear-night.svg";
    case iconCode === "02d":
      return "/img/partly-cloudy-day.svg";
    case iconCode === "02n":
      return "/img/partly-cloudy-night";
    case iconCode === "03d":
      return "/img/overcast-day.svg";
    case iconCode === "03n":
      return "/img/overcast-night.svg";
    case iconCode === "04d" || iconCode === "04n":
      return "/img/overcast.svg";
    case iconCode === "09d" || iconCode === "09n":
      return "/img/rain.svg";
    case iconCode === "10d" || iconCode === "10n":
      return "/img/drizzle.svg";
    case iconCode === "11d":
      return "/img/thunderstorms.svg";
    case iconCode === "11n":
      return "/img/thunderstorms-night.svg";
    case iconCode === "13d" || iconCode === "13n":
      return "/img/snow.svg";
    case iconCode === "50d" || iconCode === "50n":
      return "/img/mist.svg";
    default:
      console.error("Weather Icon error");
  }
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHtml = ``;
  forecast.forEach((forecastDay, index) => {
    if (index < 5) {
      forecastHtml =
        forecastHtml +
        `<li class="card">
      
      <div>${formatDay(forecastDay.dt)}</div>
      <div>
      <img src="${formatIcon(
        forecastDay.weather[0].icon
      )}" class="forecast-icon"alt="Weather icon"/>
      </div>
      <div>H: ${Math.round(forecastDay.temp.max)}° L: ${Math.round(
          forecastDay.temp.min
        )}°</div>
      
      </li>`;
    }
  });

  console.log(forecastHtml);
  forecastElement.innerHTML = forecastHtml;
}

function getForecast(coordinates) {
  let apiKey = "d1a86552de255334f6117b348c4519bd";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude={part}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayForecast);
}

function windDescription(response) {
  let windSpeed = response;
  switch (true) {
    case windSpeed === 0:
      return "calm wind";
    case windSpeed >= 1 && windSpeed <= 3:
      return "light air";
    case windSpeed >= 4 && windSpeed <= 7:
      return "light breeze";
    case windSpeed >= 8 && windSpeed <= 19:
      return "breezy";
    case windSpeed >= 20 && windSpeed <= 25:
      return "windy";
    case windSpeed >= 26 && windSpeed <= 35:
      return "very windy";
    case windSpeed >= 36:
      return "extremely windy";
    default:
      console.log("Wind speed error");
  }
}

function formatTime(timestamp) {
  let date = new Date(timestamp * 1000);
  let hour = date.getHours();

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let amPM = hour <= 11 ? `AM` : `PM`;

  switch (true) {
    case hour === 0:
      hour = 12;
      break;
    case hour > 12 && hour <= 24:
      hour = hour - 12;
      break;
    case hour === 12:
      break;
    default:
      return "loading..";
  }

  return `${hour}:${minutes} ${amPM}`;
}

function displayWeather(response) {
  let city = document.querySelector("#city");
  let temperature = document.querySelector("#main-temp");
  let description = document.querySelector("#weather-description");
  let wind = document.querySelector("#wind");
  let highTemp = document.querySelector("#high-temp");
  let lowTemp = document.querySelector("#low-temp");
  let currentTime = document.querySelector("#header-time");
  console.log(response);

  city.innerHTML = response.data.name;
  temperature.innerHTML = Math.round(response.data.main.temp);
  description.innerHTML = response.data.weather[0].description;
  wind.innerHTML = windDescription(Math.round(response.data.wind.speed));
  highTemp.innerHTML = Math.round(response.data.main.temp_max);
  lowTemp.innerHTML = Math.round(response.data.main.temp_min);
  currentTime.innerHTML = formatTime(response.data.dt);

  getForecast(response.data.coord);
}

function searchCity(city) {
  let apiKey = "d1a86552de255334f6117b348c4519bd";
  let units = "imperial";
  let apiEndPoint = "https://api.openweathermap.org/data/2.5/weather?";
  let apiUrl = `${apiEndPoint}q=${city}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(displayWeather);
}

function handleSearch(event) {
  event.preventDefault();

  let city = event.target[0].value;
  searchCity(city);

  event.target[0].value = "";
}

let searchBar = document.querySelector("#search-bar");

searchBar.addEventListener("submit", handleSearch);

searchCity("Minneapolis");
