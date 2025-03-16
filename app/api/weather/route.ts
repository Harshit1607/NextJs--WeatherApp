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

    const getDayOfWeek  = (timestamp: number) : string => {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
      return days[date.getDay()];
    };
    
    // Restructure response to match frontend expectations
    const formattedData = {
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp), // Temperature in °C
      humidity: data.main.humidity, // Humidity in %
      wind_speed: data.wind.speed, // Wind speed in km/h
      wind_dir: data.wind.deg, // Wind direction in degrees
      pressure_mb: data.main.pressure, // Pressure in mb
      visibility_km: data.visibility / 1000, // Visibility in km
      feels_like: data.main.feels_like,
      weather: data.weather[0].description, // Weather condition
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`, // Weather icon
      day_of_week: getDayOfWeek(data.dt), // Day of the week
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    return NextResponse.json({ error: error}, { status: 500 });
  }
}
