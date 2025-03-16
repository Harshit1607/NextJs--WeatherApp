import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const latitude = searchParams.get("lat");
    const longitude = searchParams.get("long");
    const APIKey = process.env.OPENWEATHER_API_KEY; // Use your OpenWeather API key

    const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${APIKey}`
    );

    if (!res.ok) throw new Error("Failed to fetch location data");

    const data = await res.json();

    if (data.length > 0) {
      return NextResponse.json({
        city: data[0].name,  // City Name
        state: data[0].state, // State Name
        country: data[0].country, // Country Code
      });
    } else {
      return NextResponse.json({ error: "No location found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: error}, { status: 500 });
  }
}