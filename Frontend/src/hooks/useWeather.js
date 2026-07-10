import { useState, useEffect, useCallback } from "react";
import { getWeatherByCity, getWeatherByCoords, getHourly, getForecast } from "../utils/APICall";

//Function used for independent loading/error states
//'query' is whatever is used for sending requests.
//E.g: {city:"London"} OR {lat: -33.09, lon: 20.04}
export function useWeather(query) {
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [hourly, setHourly] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const load = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            //Used as an object to get information from
            let weatherData;
            //Used as a reusable variable for city name
            let city;

            if (query.lat != null && query.lon != null) {
                //Card info used to display users current location
                weatherData = await getWeatherByCoords(query.lat, query.lon);

                //Storing location of city in variable
                city = weatherData.location;

            } else {
                weatherData = await getWeatherByCity(query.city);
                city = query.city;
            }
            setWeather(weatherData);

            //Fetch forecast and hourly data in parallel to minimize loading time
            //NB!: Promise.all makes this possible
            const [forecastData, hourlyData] = await Promise.all([
                getForecast(city),
                getHourly(city)
            ]);

            setForecast(forecastData);
            setHourly(hourlyData);

        } catch (err) {
            setError(err.message || "Failed to load weather for this location");
        } finally {
            setLoading(false);
        }
    }, [query.lat, query.lon, query.city]);

    //Rerun load() whenever query changes
    useEffect(() => {
        load();
    }, [load]);

    return { weather, forecast, hourly, loading, error, refetch: load };

}