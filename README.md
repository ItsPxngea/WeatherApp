# Weather App

A full-stack weather application with an instrument-panel-inspired UI, supporting multi-city tracking with current conditions, hourly, and forecast data.

## Live Demo

- **Frontend:** https://weather-app-michaeljohnson5143.vercel.app
- **Backend API:** https://weatherapp-0omm.onrender.com

> Note: the backend runs on Render's free tier and may take 30–60 seconds to respond on the first request after a period of inactivity (cold start).

## Tech Stack

**Frontend**
- React + Vite
- Fetch-based API layer with typed response handling

**Backend**
- ASP.NET Core (.NET 9) Web API
- OpenWeather API integration
- Dockerized for deployment

**Hosting**
- Frontend: Vercel (Static Site)
- Backend: Render (Docker Web Service)

## Features

- Multi-city dashboard with instrument-panel-style cards
- Current weather by city name or geographic coordinates
- Hourly forecast
- Multi-day forecast
- Geolocation-based weather lookup

## Project Structure

```
/
├── Frontend/          # React + Vite client
│   ├── src/
│   └── package.json
├── Backend/           # ASP.NET Core Web API
│   ├── Controllers/
│   ├── Dockerfile
│   └── WeatherAPI.csproj
└── README.md
```

## API Endpoints

| Method | Endpoint                          | Description                     |
|--------|------------------------------------|----------------------------------|
| GET    | `/api/weather/{city}`             | Current weather by city name    |
| GET    | `/api/weather/coords?lat=&lon=`   | Current weather by coordinates  |
| GET    | `/api/weather/forecast/{city}`    | Multi-day forecast by city      |
| GET    | `/api/weather/hourly/{city}`      | Hourly forecast by city         |

## Running Locally

### Backend

```bash
cd Backend
dotnet restore
dotnet run
```

Add your OpenWeather API key to `appsettings.Development.json` or as a user secret:

```json
{
  "OpenWeather": {
    "ApiKey": "your-api-key-here"
  }
}
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

Create a `.env` file in `Frontend/` with:

```
VITE_WEATHER_API_URL=http://localhost:5000/api/weather
```

(Swap in your local backend port if different.)

## Deployment

- **Backend** deploys via Docker on Render. Root Directory: `Backend`, Dockerfile Path: `Dockerfile`.
- **Frontend** deploys as a static site on Vercel. Root Directory: `Frontend`, Build Command: `npm run build`, Output Directory: `dist`.
- CORS on the backend is configured to allow the deployed Vercel origin.

## License

This project is for personal/portfolio use.
