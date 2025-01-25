
async function fetchWeatherData(city) {
    const apiUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;

    try {
        const geoResponse = await fetch(apiUrl, { headers: { 'User-Agent': 'WeatherApp/1.0 (romeoasante66@gmail.com)' } });
        if (!geoResponse.ok) {
            throw new Error('City not found');
        }

        const geoData = await geoResponse.json();
        if (geoData.results.length === 0) {
            throw new Error('City not found');
        }

        const { latitude, longitude } = geoData.results[0];


        const weatherUrl = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${latitude}&lon=${longitude}`;
        const weatherResponse = await fetch(weatherUrl, { headers: { 'User-Agent': 'WeatherApp/1.0 (romeoasante66@gmail.com)' } });
        if (!weatherResponse.ok) {
            throw new Error('Error fetching weather data');
        }

        const weatherData = await weatherResponse.json();
        displayWeatherData(weatherData, city);
    } catch (error) {
        alert(error.message);
    }
}

function displayWeatherData(data, city) {
    const cityName = document.getElementById('city-name');
    const dateElement = document.getElementById('date');
    const temperature = document.getElementById('temperature');
    const weatherDescription = document.getElementById('weather-description');
    const humidity = document.getElementById('humidity');
    const windSpeed = document.getElementById('wind-speed');
    const pressure = document.getElementById('pressure');

    const weather = data.properties.timeseries[0].data.instant.details;

    cityName.textContent = city;
    dateElement.textContent = new Date().toLocaleString();
    temperature.textContent = `${Math.round(weather.air_temperature)}°C`;
    weatherDescription.textContent = 'Clear Sky';
    humidity.textContent = `${weather.relative_humidity}%`;
    windSpeed.textContent = `${weather.wind_speed} m/s`;
    pressure.textContent = `${weather.air_pressure_at_sea_level} hPa`;
}


document.getElementById('search-btn').addEventListener('click', () => {
    const city = document.getElementById('city-input').value;
    if (city) {
        fetchWeatherData(city);
    } else {
        alert('Please enter a city name');
    }
});



