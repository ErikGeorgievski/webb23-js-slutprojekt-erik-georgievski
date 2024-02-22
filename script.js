//desktop version är inte så snyggt mobile version lite mer snyggare har använd grid, flexbox mm.



// ApiKey från hemsidan
const apiKey = "6c51d211d689d6595498e3aab080e8d7";

// 
//function som hämtar väderdata från hemsidans Api med hjälp av koordinaterna och hämta två parameter 
//latitud och longitud för att visa returnerad data för en plats.
//Jag har använt  AWAIT för resultatet och returnerad data  av fetch(url)
//hela data conventeras till JSON-format genom await response.json
async function getWeatherDataByCoordinates(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const response = await fetch(url);
  const data = await response.json();
  const weatherData = {                 //vilken data ska hämtas
    temperature: data.main.temp,
    condition: data.weather[0].main,
    location: data.name,
    latitude: lat,
    longitude: lon,
    windSpeed: data.wind.speed + "m/s",
    icon: data.weather[0].icon
  };
  return weatherData;
}

// function som hämtar data för specifik stad genom parameter city och hämtar den datan som vi valde.
//har använd await  för resultatet och returnerad data  av fetch(urlData) och hela datan converteras i JSON-format.
async function getWeatherData(city) {
  const urlData = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
  const response = await fetch(urlData);
  const data = await response.json();

  if (data.length === 0) {  //Alert-error message om man skriver fel stad 
    throw new Error('City not found.');//Text till alert-message när man skriver stad som ej existera.
  }

  const lat = data[0].lat;
  const lon = data[0].lon;
  return await getWeatherDataByCoordinates(lat, lon);
}

//function som uppdaterar väerdata som returnera från hemsidansAPI.
//quert.selector-  selectera html element med hjälp av deras #id  och med hjälp av innerText uppdaterad weathercondition visas upp på skärmen.

function updateUI(weatherData) {
  const temperature = document.querySelector('#temperature');
  const condition = document.querySelector('#condition');
  const location = document.querySelector('#location');
  const latitude = document.querySelector('#latitude');
  const longitude = document.querySelector('#longitude');
  const windSpeed = document.querySelector('#wind-speed');
  const iconImg = document.querySelector('#weather-icon');

  const roundedTemperature = Math.round(weatherData.temperature);// Math.round för att avrunda temperatur nummer.
  temperature.innerText = `${roundedTemperature}°C`;
  condition.innerText = weatherData.condition;
  location.innerText = weatherData.location;
  latitude.innerText = weatherData.latitude;
  longitude.innerText = weatherData.longitude;
  windSpeed.innerText = weatherData.windSpeed;
//Bilder som finns redan på nätet som jag har använd deras url och att backgroundImage ska ändras beror på weather condition om det är (rain, clear, smoke eller clouds)
  if (weatherData.condition === 'Clear') {
    document.body.style.backgroundImage = 'url(https://www.therightnews.in/wp-content/uploads/2022/06/17-14.jpg)';
  } else if (weatherData.condition === 'Rain') {
    document.body.style.backgroundImage = 'url(https://c4.wallpaperflare.com/wallpaper/5/528/863/lightning-thunder-sky-lightning-strikes-wallpaper-preview.jpg)';
  } else if (weatherData.condition === 'Clouds') {
    document.body.style.backgroundImage = 'url(https://images.pexels.com/photos/209831/pexels-photo-209831.jpeg?auto=compress&cs=tinysrgb&w=600)';
  }else if (weatherData.condition === 'Smoke') {
    document.body.style.backgroundImage = 'url(https://img.freepik.com/free-vector/realistic-fog-background_23-2149115275.jpg?w=996&t=st=1708603620~exp=1708604220~hmac=16a866eabc3cc0e320b83f50cf57917a49845396e2eacee38324377e46d8c96c)';
  }

  
  const icon = weatherData.icon;//iconer för vädret
  const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;
  iconImg.src = iconUrl;
  
}

// function när användaren kan söka och hämta väderdata för stad och med hjälp av submit knappen och addEventLIstener(arrow function) som hanterar datan.
// sen hämtas datan från input med document.querySelector('#search-bar').value och sparas i city-variabeln.
// har använt  .then() för att hantera det returnerade resultatet (weatherData).
const form = document.querySelector('#search-city');
form.addEventListener('submit',async (event) => {
  event.preventDefault();
  const city = document.querySelector('#search-bar').value;

  getWeatherData(city)
    .then(weatherData => {
      updateUI(weatherData);
    })
    .catch(error => {
      alert(error.message);
    });
});

// function när användaren skickar en förutsägelse för väder baserat på en specifik tidpunkt i detta fallet 3 timmar.
// sen hämtas datan med document.querySelector('#time').value och sparas i hours-variabeln.
//om det kommer till något fel under datahämtningen fängas med catch och en alert felmeddelande.
  const predictWeather = document.querySelector('#weather-time');
  predictWeather.addEventListener('submit', (event) => {
      event.preventDefault();
      const hours = document.querySelector('#time').value;
      const takeHours = parseInt(hours, 10);
      const hoursToWeather = Math.ceil(takeHours /10);

      getWeatherData(document.querySelector('#search-bar').value)
        .then(weatherData => {
          getFetchDataForecast(weatherData.latitude, weatherData.longitude, takeHours, hoursToWeather);
        })
        .catch(error => {
          alert(error.message);
        });
    });


function getFetchDataForecast(lat, lon, hours, hoursToWeather) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&cnt=${hours}&units=metric`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      showWeather(data, hoursToWeather);
    })
}
//function används för att visa väderinformation baserat på den hämtade datan och det angivna antalet timmar (hoursToWeather).
function showWeather(data, hoursToWeather) {
  const weatherListTime = document.getElementById('time-weather');
weatherListTime.innerHTML = '';
  


  // för att visa weather condition lista för varje tidpunkt baserat på användarens angivna antal timmar. 
  // här kontrolleras om index är delbart med 'hoursToWeather (index % hoursToWeather === 0) varje gång efter 3 timmar.
  // sen jag har skappat ett 'div' som har et class som heter weather-info för att listan ska vissas.
data.list.forEach((forecast, index) => {
  if (index % hoursToWeather === 0) {
    const weatherTime = forecast.dt_txt;
    const weatherIcon = forecast.weather[0].icon;
    const weatherTemp = Math.round(forecast.main.temp) + " °C";

    const weatherInfo = document.createElement('div');
      weatherInfo.setAttribute('class', 'weather-info');
      weatherInfo.innerHTML = `
      <p class="weathertime">${weatherTime}</p>
      <p class="weathertemp">Temperature: ${weatherTemp}</p>
      <img src="https://openweathermap.org/img/wn/${weatherIcon}.png">
    `;

    weatherListTime.append(weatherInfo);
    }
  });
}


//kommer gå genom hela materialet under sommaren och repetera och göra övningarna. Tack för tiden :) (om du vil se regn bild sök efter "Huaquillas" stad i Ecuador brukar regna hela tiden)
