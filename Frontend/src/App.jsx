import { useState, useRef, useEffect } from "react";
/*import {
  Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle,
  Wind, Droplets, Gauge, Eye, Sunrise, Sunset, Search, X, Plu
} from "lucide-react";
 */
import WeatherCard from "./components/WeatherCard";
//Fallback city if user denies location or anything else
const FALLBACK_CITY = "Globe"


/*const CONDITIONS = ["sun", "cloud", "partly-cloudy", "rain", "drizzle", "storm", "snow"];
const CONDITION_LABELS = {
  sun: "Clear",
  cloud: "Cloudy",
  "partly-cloudy": "Partly Cloudy",
  rain: "Rainy",
  drizzle: "Drizzle",
  storm: "Thunderstorms",
  snow: "Snowy",
}*/

//Each entry is {id,query}
//'query' = {city: "globe"} OR {lat, lon}
export default function App() {
  const [locations, setLocations] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocations([{ id: "default", query: { city: FALLBACK_CITY } }]);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocations([{ id: "home", query: { lat: latitude, lon: longitude } }]);
      },
      () => {
        //Fallback to not let user see a blank screen
        setLocations([{ id: "default", query: { city: FALLBACK_CITY } }]);
      }
    );

  }, []);

  const addCity = (cityName) => {
    const newLocation = { id: `${cityName}-${Date.now()}`, query: { city: cityName } };
    setLocations((prev) => [...prev, newLocation]);

    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ left: scrollRef.current.scrollWidth, behaviour: "smooth" });
    });

  };
  const removeCity = (cityName) => {
    setLocations((prev) => prev.filter((loc) => loc.id !== id));
  }



  return (
    <div className="w-full min-h-screen flex flex-col items-center p-6" style={{ background: "#12161C" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,340..600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .f-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .f-body { font-family: 'Inter', sans-serif; }
        .f-mono { font-family: 'IBM Plex Mono', monospace; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      {/*<SearchBar onAddCity={addCity} />*/}

      {locations.length === 0 ? (
        <div className="f-mono text-sm mt-16" style={{ color: "#6E7887" }}>
          Getting your location...
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="w-full flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {locations.map((loc) => (
            <WeatherCard
              key={loc.id}
              query={loc.query}
              onRemove={() => removeCity(loc.id)}
              removable={locations.length > 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}