//Found in .env file
const BASE_URL = import.meta.env.VITE_WEATHER_API_URL;

//Generic response to throw an error message
async function handleResponse(res) {
    if (!res.ok) {
        const message = await res.text().catch(() => "");
        throw new Error(message || `Request failed with status ${res.status}`);

    }
    return res.json();
}

//GET /{location}
export function getWeatherByCity(city) {
    return fetch(`${BASE_URL}/${encodedURIComponent(city)}`).then(handleResponse);
}

//GET using /coords?lat=...&lon=...
export function getWeatherByCoords(lat, lon) {
    return fetch(`${BASE_URL}/coords?lat=${lat}&lon=${lon}`).then(handleResponse);
}

//GET /forecast/{location}
export function getForecast(city) {
    return fetch(`${BASE_URL}/forecast/${encodedURIComponent(city)}`).then(handleResponse);
}

//GET /hourly/{location}
export function getHourly(city) {
    return fetch(`${BASE_URL}/hourly/${encodedURIComponent(city)}`).then(handleResponse);
}