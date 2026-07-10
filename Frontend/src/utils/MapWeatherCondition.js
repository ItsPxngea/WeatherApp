//Used to convert backend weather conditions to strings so icon names can match in frontend
export function mapCondition(apiWeatherCondition) {
    const key = (apiWeatherCondition || "").toLowerCase();

    if (key.includes("clear")) return "sun";
    if (key.includes("cloud")) return "cloud";
    if (key.includes("thunderstorm")) return "storm";
    if (key.includes("drizzle")) return "drizzle";
    if (key.includes("rain")) return "rain";
    if (key.includes("snow")) return "snow";

    return "cloud";
}