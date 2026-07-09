using System.Runtime.Intrinsics.Arm;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
namespace WeatherAPI.Models
{
    public class Weather
    {
        public string Location { get; set; } = string.Empty;
        public string Condition { get; set; } = string.Empty;
        public int Temp { get; set; }
        public int Humidity { get; set; }
        public int WindSpeed { get; set; }
        public int Precipitation { get; set; }
        public int Pressure { get; set; }
        public int VisibilityKM { get; set; }
        public string Sunrise { get; set; } = string.Empty;
        public string Sunset { get; set; } = string.Empty;
        public int FeelsLike { get; set; }

    }
    public class OpenWeatherResponse
    {
        public string? Name { get; set; }
        public MainData? Main { get; set; }
        public List<WeatherDescription>? Weather { get; set; }
        public WindData? Wind { get; set; }
        public RainInfo? Rain { get; set; }
        public SysData? Sys { get; set; }
        public int Visibility { get; set; }
        public int Timezone { get; set; }

    }
    public class MainData
    {
        public double Temp { get; set; }
        public int Humidity { get; set; }
        [JsonPropertyName("feels-like")]
        public double FeelsLike { get; set; }
        [JsonPropertyName("temp-min")]
        public double TempMin { get; set; }
        [JsonPropertyName("temp-max")]
        public double TempMax { get; set; }
        public int Pressure { get; set; }

    }
    public class WeatherDescription
    {
        [JsonPropertyName("main")]
        public string? Condition { get; set; }
    }
    public class WindData
    {
        public double Speed { get; set; }
    }
    public class RainInfo
    {
        [JsonPropertyName("1h")]
        public double OneHour { get; set; }
        [JsonPropertyName("3h")]
        public double ThreeHour { get; set; }
    }

    public class SysData
    {
        public long Sunrise { get; set; }
        public long Sunset { get; set; }
    }

    public class ForecastDay
    {
        public string Date { get; set; } = string.Empty;
        public int Temp { get; set; }
        public string Condition { get; set; } = string.Empty;
        public int Humidity { get; set; }
        public int WindSpeed { get; set; }
        public int Precipitation { get; set; }
        public int HighTemp { get; set; }
        public int LowTempt { get; set; }

    }
    public class ForecastResponse
    {
        public List<ForecastItem> List { get; set; } = new List<ForecastItem>();
    }
    public class ForecastItem
    {
        public long Dt { get; set; }
        public MainData? Main { get; set; }
        public List<WeatherDescription>? Weather { get; set; }
        public WindData? Wind { get; set; }
        public RainInfo? Rain { get; set; }

    }

    public class ForecastHourly
    {
        public int Temp { get; set; }
        public string Time { get; set; } = string.Empty;
        public string Condition { get; set; } = string.Empty;
    }
}