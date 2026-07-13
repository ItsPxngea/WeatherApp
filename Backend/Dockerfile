# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj first for layer caching (wildcard so filename doesn't matter)
COPY *.csproj ./
RUN dotnet restore

# Copy everything else and publish
COPY . .
RUN dotnet publish -c Release -o /app/publish

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Render sets PORT dynamically at runtime
ENV ASPNETCORE_URLS=http://+:$PORT

ENTRYPOINT ["dotnet", "WeatherAPI.dll"]