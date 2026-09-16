# WeatherApp

A full-stack weather app with a React frontend and a .NET 9 Web API backend, powered by the [OpenWeatherMap API](https://openweathermap.org/api). Search any city, use your current location, and view current conditions, an hourly outlook, and a multi-day forecast — all in a dark, card-based UI.

## Features

- **Current location weather** via the browser Geolocation API, with a fallback city if location access is denied
- **City search** to add multiple location cards, each loaded independently
- **Current conditions**: temperature, feels-like, humidity, wind speed, precipitation, pressure, visibility, sunrise/sunset
- **Hourly forecast** and **multi-day forecast** (high/low, condition)
- Condition-based icons (clear, cloud, rain, drizzle, snow, storm) via [lucide-react](https://lucide.dev/)
- Responsive, horizontally-scrollable card layout built with Tailwind CSS

## Tech Stack

**Frontend** — `Frontend/`
- React 19 + Vite
- Tailwind CSS v4
- lucide-react (icons)
- oxlint (linting)

**Backend** — `Backend/`
- ASP.NET Core 9 Web API
- Proxies and reshapes requests to the OpenWeatherMap API
- Dockerfile included for containerized deployment

## Project Structure

```
WeatherApp/
├── Backend/
│   ├── Controllers/
│   │   └── WeatherController.cs   # /api/weather endpoints
│   ├── Models/
│   │   └── Weather.cs             # DTOs + OpenWeatherMap response models
│   ├── Program.cs                 # App setup, CORS, config
│   ├── Dockerfile
│   └── appsettings.json
└── Frontend/
    ├── src/
    │   ├── components/            # WeatherCard, SearchBar, skeleton loader
    │   ├── hooks/
    │   │   └── useWeather.js      # Data fetching + loading/error state
    │   └── utils/
    │       ├── APICall.js         # Fetch wrappers for the backend API
    │       └── MapWeatherCondition.js
    └── package.json
```

## API Endpoints

All endpoints are served under `/api/weather`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/weather/{location}` | Current weather for a city name |
| `GET` | `/api/weather/coords?lat={lat}&lon={lon}` | Current weather for coordinates |
| `GET` | `/api/weather/forecast/{location}` | Multi-day forecast for a city (up to 7 days) |
| `GET` | `/api/weather/hourly/{location}` | Hourly forecast for a city |

## Getting Started

### Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) 18+
- A free API key from [OpenWeatherMap](https://openweathermap.org/api)

### Backend setup

```bash
cd Backend
```

Set your OpenWeatherMap API key as an environment variable (read by `Program.cs` and mapped to `OpenWeather:ApiKey`):

```bash
export API_KEY=your_openweathermap_api_key
```

Then run the API:

```bash
dotnet restore
dotnet run
```

By default this runs on `http://localhost:5128` (see `Properties/launchSettings.json`).

> **Note:** `Program.cs` currently restricts CORS to specific deployed frontend URLs (`AllowReact` policy). For local development against `http://localhost:5000`, update the CORS policy in `Program.cs` to include your local frontend origin.

### Frontend setup

```bash
cd Frontend
npm install
```

Create a `.env` file in `Frontend/` pointing at your running backend:

```
VITE_WEATHER_API_URL=http://localhost:5000/api/weather
```

Then start the dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5000`.

### Building for production

```bash
cd Frontend
npm run build
```

## Deployment

- **Backend**: includes a `Dockerfile` (multi-stage build on `mcr.microsoft.com/dotnet/sdk:9.0` / `aspnet:9.0`), suited for platforms like Render that inject a `PORT` environment variable at runtime.
- **Frontend**: deployable as a static Vite build (e.g. to Vercel). Set `VITE_WEATHER_API_URL` to your deployed backend's `/api/weather` base URL in the platform's environment settings.

## License

No license specified yet.
