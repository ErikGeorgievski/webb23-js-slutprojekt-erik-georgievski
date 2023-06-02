//desktop version är inte så snyggt mobile version lite mer snyggare har använd grid, flexbox mm.



// ApiKey från hemsidan
const apiKey = "6c51d211d689d6595498e3aab080e8d7";

// 
//function för att hämta coordinates url / fetch
async function getWeatherDataByCoordinates(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const response = await fetch(url);
  const data = await response.json();//konvertera till Json format
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

// function för att hämtas data för stad 
async function getWeatherData(city) {
  const urlData = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
  const response = await fetch(urlData);
  const data = await response.json();

  if (data.length === 0) {  //Alert-error message om man skriver fel stad
    throw new Error('City not found.');
  }

  const lat = data[0].lat;
  const lon = data[0].lon;
  return await getWeatherDataByCoordinates(lat, lon);
}

//querySelector för att kopplas med html element
function updateUI(weatherData) {
  const temperature = document.querySelector('#temperature');
  const condition = document.querySelector('#condition');
  const location = document.querySelector('#location');
  const latitude = document.querySelector('#latitude');
  const longitude = document.querySelector('#longitude');
  const windSpeed = document.querySelector('#wind-speed');
  const iconImg = document.querySelector('#weather-icon');

  const roundedTemperature = Math.round(weatherData.temperature);// Math.round för att avrunda temperatur nummer.
  //html elementer visar hämtat data
  temperature.innerText = `${roundedTemperature}°C`;
  condition.innerText = weatherData.condition;
  location.innerText = weatherData.location;
  latitude.innerText = weatherData.latitude;
  longitude.innerText = weatherData.longitude;
  windSpeed.innerText = weatherData.windSpeed;
  if (weatherData.condition === 'Clear') {
    document.body.style.backgroundImage = 'url(https://www.therightnews.in/wp-content/uploads/2022/06/17-14.jpg)';//Andreas hjälpte mig lite med detta :)
  } else if (weatherData.condition === 'Rain') {
    document.body.style.backgroundImage = 'url(https://c4.wallpaperflare.com/wallpaper/5/528/863/lightning-thunder-sky-lightning-strikes-wallpaper-preview.jpg)';
  } else if (weatherData.condition === 'Clouds') {
    document.body.style.backgroundImage = 'url(https://bpvernonms.wpenginepowered.com/wp-content/uploads/2019/08/17959850_web1_190731-ok-shu-weather-tues-768x512.jpg)';
  }else if (weatherData.condition === 'Smoke') {
    document.body.style.backgroundImage = 'url(https://s.w-x.co/util/image/w/citysmokeeee.jpg?v=at&w=815&h=458)';
  }


//fontSize 20px till data från url
  temperature.style.fontSize = '20px'; 
  condition.style.fontSize = '20px'
  location.style.fontSize = '20px'
  latitude.style.fontSize = '20px';
  longitude.style.fontSize = '20px';
  windSpeed.style.fontSize = '20px';
  
  const icon = weatherData.icon;//iconer för vädret
  const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;
  iconImg.src = iconUrl;
  
}

// Event listener till submit knappen
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

// Event listener till hämtat data 3-timmars data
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

function showWeather(data, hoursToWeather) {
  const weatherListTime = document.getElementById('time-weather');
  weatherListTime.innerHTML = '';
  
//forEach list med weatherdata

  
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
