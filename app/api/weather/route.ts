import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city") || "New Delhi"; // Default city
    const APIKey = process.env.OPENWEATHER_API_KEY; // Use your OpenWeather API key

    // OpenWeather API URL
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=metric`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch weather data");

    const data = await res.json();

    console.log("Weather Data:", data);

    // Restructure response to match frontend expectations
    const formattedData = {
      city: data.name,
      country: data.sys.country,
      temperature: data.main.temp,         // Temperature in °C
      humidity: data.main.humidity,        // Humidity in %
      wind_speed: data.wind.speed,         // Wind speed in km/h
      wind_dir: data.wind.speed,             // Wind direction in degrees
      pressure_mb: data.main.pressure,     // Pressure in mb
      visibility_km: data.visibility / 1000, // Visibility in km
      weather: data.weather[0].description, // Weather condition
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`, // Weather icon
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    return NextResponse.json({ error: error}, { status: 500 });
  }
}
