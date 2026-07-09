using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using WeatherAPI.Models;

namespace WeatherAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WeatherController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly string? _apiKey;

        public WeatherController(IHttpClientFactory httpClientFactory, IConfiguration config)
        {
            _httpClient = httpClientFactory.CreateClient();
            _apiKey = config["OpenWeather:ApiKey"];
        }


        public static string FormatLocalTime(long unixSeconds, int timezoneOffsetSeconds)
        {
            var utcTime = DateTimeOffset.FromUnixTimeSeconds(unixSeconds);
            var localTime = utcTime.ToOffset(TimeSpan.FromSeconds(timezoneOffsetSeconds));
            return localTime.ToString("HH:mm");
        }

        private Weather MapToWeather(OpenWeatherResponse responseJSON)
        {
            return new Weather
            {
                Location = responseJSON.Name?.Trim() ?? "Unknown",
                Temp = (int)responseJSON.Main!.Temp,
                FeelsLike = (int)responseJSON.Main.FeelsLike,
                Condition = responseJSON.Weather?[0].Condition ?? "Unknown",
                Humidity = responseJSON.Main.Humidity,
                WindSpeed = (int)responseJSON.Wind!.Speed,
                Precipitation = responseJSON.Rain != null ? (int)responseJSON.Rain.OneHour : 0,
                Pressure = responseJSON.Main.Pressure,
                VisibilityKM = responseJSON.Visibility,
                Sunrise = responseJSON.Sys != null ? FormatLocalTime(responseJSON.Sys.Sunrise, responseJSON.Timezone) : "--:--",
                Sunset = responseJSON.Sys != null ? FormatLocalTime(responseJSON.Sys.Sunset, responseJSON.Timezone) : "--:--"
            };
        }

        //Endpoint to get weather by city name for search functionality
        [HttpGet("{location}")]
        public async Task<ActionResult<Weather>> GetWeather(string location)
        {
            //catch error for no API key
            if (string.IsNullOrEmpty(_apiKey))
                return StatusCode(500, "API key is not configured");

            var encodedLocation = Uri.EscapeDataString(location);
            var url = $"https://api.openweathermap.org/data/2.5/weather?q={encodedLocation}&appid={_apiKey}&units=metric";
            var response = await _httpClient.GetAsync(url);
            if (!response.IsSuccessStatusCode) return NotFound("Location not found\n" + response.StatusCode);

            var json = await response.Content.ReadFromJsonAsync<OpenWeatherResponse>();
            if (json == null
                || json.Main == null
                || json.Wind == null
                || json.Weather?.Any() != true)
            {
                return NotFound("Failed to parse weather data\n" + response.StatusCode);
            }

            /*var weather = new Weather
            {
                Location = json.Name?.Trim() ?? "Unknown",
                Temp = (int)json.Main.Temp,
                Condition = json.Weather[0].Condition ?? "Unknown",
                Humidity = json.Main.Humidity,
                WindSpeed = (int)json.Wind.Speed,
                Precipitation = json.Rain != null ? (int)json.Rain.OneHour : 0
            };
            return Ok(weather);*/
            return Ok(MapToWeather(json));

        }
        //New endpoint to get weather by coordinates for users current location
        [HttpGet("coords")]
        public async Task<ActionResult<Weather>> GetWeatherByCoords(double lat, double lon)
        {
            if (string.IsNullOrEmpty(_apiKey))
                return StatusCode(500, "API key is not configured");

            var url = $"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={_apiKey}&units=metric";
            var response = await _httpClient.GetAsync(url);
            if (!response.IsSuccessStatusCode) return NotFound("Location not found\n" + response.StatusCode);

            var json = await response.Content.ReadFromJsonAsync<OpenWeatherResponse>();
            if (json == null
                || json.Main == null
                || json.Wind == null
                || json.Weather?.Any() != true)
            {
                return NotFound("Failed to parse weather data\n" + response.StatusCode);
            }

            /* var weather = new Weather
             {
                 Location = json.Name?.Trim() ?? "Unknown",
                 Temp = (int)json.Main.Temp,
                 Condition = json.Weather?[0].Condition ?? "Unknown",
                 Humidity = json.Main.Humidity,
                 WindSpeed = (int)json.Wind.Speed,
                 Precipitation = json.Rain != null ? (int)json.Rain.OneHour : 0
             };
             return Ok(weather);*/
            return Ok(MapToWeather(json));
        }

        //Endpoint for forecast data
        [HttpGet("forecast/{location}")]
        public async Task<ActionResult<List<ForecastDay>>> GetForecast(string location)
        {
            if (string.IsNullOrEmpty(_apiKey))
                return StatusCode(500, "API key is not configured");

            var encodedLocation = Uri.EscapeDataString(location);
            var url = $"https://api.openweathermap.org/data/2.5/forecast?q={encodedLocation}&appid={_apiKey}&units=metric";
            var response = await _httpClient.GetAsync(url);
            if (!response.IsSuccessStatusCode) return NotFound("Location not found\n" + response.StatusCode);

            var json = await response.Content.ReadFromJsonAsync<ForecastResponse>();
            if (json == null) return NotFound("Failed to parse forecast data\n" + response.StatusCode);

            var forecast = json.List
                .GroupBy(item => DateTimeOffset.FromUnixTimeSeconds(item.Dt).Date)
                .Take(8)
                .Select(group =>
                {
                    var midday = group.OrderBy(item => Math.Abs(DateTimeOffset.FromUnixTimeSeconds(item.Dt).Hour - 12)).First();
                    return new ForecastDay

                    {
                        Date = DateTimeOffset.FromUnixTimeSeconds(midday.Dt).ToString("ddd dd MMM"),
                        Temp = (int)midday.Main.Temp,
                        Condition = midday.Weather?[0].Condition ?? "Unknown",
                        Humidity = midday.Main.Humidity,
                        WindSpeed = (int)midday.Wind.Speed,
                        Precipitation = midday.Rain != null ? (int)midday.Rain.OneHour : 0
                    };
                })
                .ToList();

            return Ok(forecast);
        }


        //Hourly forecast
        [HttpGet("hourly/{location}")]
        public async Task<ActionResult<List<ForecastHourly>>> GetHourlyForecast(string location)
        {
            if (string.IsNullOrEmpty(_apiKey)) return StatusCode(500, "Api key is not configured");

            var encodedLocation = Uri.EscapeDataString(location);
            var url = $"https://api.openweathermap.org/data/2.5/forecast?q={encodedLocation}&appid={_apiKey}&units=metric";
            var response = await _httpClient.GetAsync(url);

            if (!response.IsSuccessStatusCode) return NotFound("Location not found:" + encodedLocation + "\nStatus Code: " + response.StatusCode);

            var json = await response.Content.ReadFromJsonAsync<ForecastResponse>();
            if (json == null) return NotFound("Failed to parse forecast data\n" + response.StatusCode.ToString());

            var hourly = json.List.Take(7).Select(item => new ForecastHourly
            {
                Time = DateTimeOffset.FromUnixTimeSeconds(item.Dt).ToString("h tt"),
                Temp = (int)item.Main.Temp,
                Condition = item.Weather?[0].Condition ?? "Unknown"
            })
            .ToList();

            return Ok(hourly);
        }
    }
}