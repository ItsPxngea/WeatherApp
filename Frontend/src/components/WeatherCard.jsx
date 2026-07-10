import {
    Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle,
    Wind, Droplets, Gauge, Eye, Sunrise, Sunset, Search, X, RefreshCw
} from "lucide-react";
import { useWeather } from "../hooks/useWeather";
import { mapCondition } from "../utils/MapWeatherCondition";
import WeatherCardSkeleton from "./WeatherCardSkeleton";

//Assigning icons
const ICONS = {
    sun: Sun,
    cloud: Cloud,
    "partly-cloudy": Cloud,
    rain: CloudRain,
    drizzle: CloudDrizzle,
    snow: CloudSnow,
    storm: CloudLightning,
};

function ConditionIcon({ apiCondition, size = 20 }) {
    const Icon = ICONS[mapCondition(apiCondition)] || Cloud;
    return <Icon size={size} strokeWidth={1.5} />
}

//Creating a visual to show the highest and lowest temps
function TempRangeBar({ lo, hi, globalLo, globalHi }) {
    const span = globalHi - globalLo || 1;
    const left = ((lo - globalLo) / span) * 100;
    const width = ((hi - lo) / span) * 100;

    return (
        <div className="relative h-1 flex-1 rounded-full" style={{ background: "#2A323D" }}>
            <div className="absolute h-1 rounded-full"
                style={{
                    left: `${left}%`,
                    width: `${Math.max(width, 4)}%`,
                    background: "linear-gradient(90deg, #5C8AA6, #D9A059)"
                }} />
        </div>
    );
}


function Readout({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "#232A35", border: "1px solid #2A323D" }}>
                <Icon size={14} strokeWidth={1.5} style={{ color: "#D9A059" }} />
            </div>
            <div>
                <div className="f-mono text-[9px] tracking-wider" style={{ color: "#6E7887" }}>
                    {label}
                </div>
                <div className="f-mono text-sm mt-0.5" style={{ color: "#E7EAEE" }}>
                    {value}
                </div>
            </div>
        </div>
    );
}

//'query' is whatever is passed from App.jsx, that goes to useWeather.js
//Component renders whatever state the hook (useWeather.js) gives it
export default function WeatherCard({ query, onRemove, removable }) {
    const { weather, forecast, hourly, loading, error, refetch } = useWeather(query);

    //Loading state, shown when card fetches initially
    if (loading) {
        {/*return(
            <div className="shrink-0 snap-center rounded-2x1 flex items-center justify-center f-mono text-sm"
            style={{width:"340px", height:"500px", background:"#1C222B", border:"1px solid #2A323D", color:"#6E7887"}}>
                Loading...
            </div>
        );*/}

        return <WeatherCardSkeleton />;
    }


    //Error state - should only show the error for individiual card
    //Retry button if something goes wrong
    if (error || !weather) {
        return (
            <div className="shrink-0 snap-center rounded-2x1 flex flex-col items-center justify-center gap-3 f-mono text-sm text-center px-6"
                style={{ width: "340px", height: "500px", background: "#1C222B", border: "1px solid #2A323D", color: "#8A97A8" }}>
                <p>{error || "Something went wrong"}</p>
                <button onClick={refetch}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
                    style={{ background: "#232A35", border: "1px solid #2A323D", color: "#D9A059" }}>
                    <RefreshCw size={12} />Retry
                </button>
                {removable && (
                    <button onClick={onRemove} className="text-xs underline" style={{ color: "#6E7887" }}>
                        Remove Card
                    </button>
                )}
            </div>
        );
    }

    //Working out range for temp bars
    const globalLo = forecast.length ? Math.min(...forecast.map((d) => d.lowTemp)) : 0;
    const globalHi = forecast.length ? Math.max(...forecast.map((d) => d.hiTemp)) : 0;
    const hourlyTemps = hourly.map((h) => h.temp);
    const hourlyMax = hourlyTemps.length ? Math.max(...hourlyTemps) : 0;
    const hourlyMin = hourlyTemps.length ? Math.min(...hourlyTemps) : 0;

    return (
        <div
            className="shrink-0 snap-center rounded-2xl overflow-hidden f-body relative"
            style={{ width: "340px", background: "#1C222B", border: "1px solid #2A323D", boxShadow: "0 30px 60px -20px rgba(0,0,0,0.6)" }}
        >
            {removable && (
                <button
                    onClick={onRemove}
                    className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center z-10"
                    style={{ background: "#232A35", border: "1px solid #2A323D" }}
                >
                    <X size={13} style={{ color: "#8A97A8" }} />
                </button>
            )}

            <div className="flex items-center justify-between px-6 pt-5 pb-3">
                <div>
                    <div className="f-mono text-[11px] tracking-wider" style={{ color: "#8A97A8" }}>STATION</div>
                    <div className="text-sm font-medium mt-0.5" style={{ color: "#E7EAEE" }}>{weather.location}</div>
                </div>
            </div>

            <div className="h-px mx-6" style={{ background: "#2A323D" }} />

            <div className="flex items-center justify-between px-6 py-6">
                <div>
                    <div className="flex items-start">
                        <span className="f-display leading-none" style={{ fontSize: "76px", fontWeight: 400, color: "#F2F0EA" }}>
                            {weather.temp}
                        </span>
                        <span className="f-display leading-none mt-1" style={{ fontSize: "28px", color: "#8A97A8" }}>°</span>
                    </div>
                    <div className="text-sm mt-1" style={{ color: "#B7C0CC" }}>
                        {weather.condition} · Feels like <span className="f-mono">{weather.feelsLike}°</span>
                    </div>
                </div>
                <ConditionIcon apiCondition={weather.condition} size={54} />
            </div>

            <div className="h-px mx-6" style={{ background: "#2A323D" }} />

            {hourly.length > 0 && (
                <>
                    <div className="px-6 py-5">
                        <div className="f-mono text-[10px] tracking-wider mb-3" style={{ color: "#8A97A8" }}>NEXT 24 HOURS</div>
                        <div className="flex items-end justify-between gap-2" style={{ height: "72px" }}>
                            {hourly.map((h, i) => {
                                const range = hourlyMax - hourlyMin || 1;
                                const heightPct = 20 + ((h.temp - hourlyMin) / range) * 60;
                                return (
                                    <div key={i} className="flex flex-col items-center flex-1 h-full justify-end">
                                        <span className="f-mono text-[10px] mb-1" style={{ color: "#D9A059" }}>{h.temp}°</span>
                                        <div className="w-1.5 rounded-full" style={{ height: `${heightPct}%`, background: i === 0 ? "#D9A059" : "#3A4351" }} />
                                        <span className="f-mono text-[9px] mt-2" style={{ color: "#6E7887" }}>{h.time}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="h-px mx-6" style={{ background: "#2A323D" }} />
                </>
            )}

            <div className="px-6 py-5 grid grid-cols-2 gap-4">
                <Readout icon={Droplets} label="HUMIDITY" value={`${weather.humidity}%`} />
                <Readout icon={Wind} label="WIND" value={`${weather.windSpeed} km/h`} />
                <Readout icon={Gauge} label="PRESSURE" value={`${weather.pressure} hPa`} />
                <Readout icon={Eye} label="VISIBILITY" value={`${weather.visibilityKm} km`} />
                <Readout icon={Sunrise} label="SUNRISE" value={weather.sunrise} />
                <Readout icon={Sunset} label="SUNSET" value={weather.sunset} />
            </div>

            {forecast.length > 0 && (
                <>
                    <div className="h-px mx-6" style={{ background: "#2A323D" }} />
                    <div className="px-6 py-5">
                        <div className="f-mono text-[10px] tracking-wider mb-3" style={{ color: "#8A97A8" }}>7-DAY FORECAST</div>
                        <div className="flex flex-col gap-3">
                            {forecast.map((d, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="text-xs w-16" style={{ color: i === 0 ? "#F2F0EA" : "#B7C0CC", fontWeight: i === 0 ? 600 : 400 }}>
                                        {d.date}
                                    </span>
                                    <ConditionIcon apiCondition={d.condition} size={16} />
                                    <span className="f-mono text-xs w-7 text-right" style={{ color: "#6E7887" }}>{d.lowTemp}°</span>
                                    <TempRangeBar lo={d.lowTemp} hi={d.highTemp} globalLo={globalLo} globalHi={globalHi} />
                                    <span className="f-mono text-xs w-7" style={{ color: "#E7EAEE" }}>{d.highTemp}°</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
