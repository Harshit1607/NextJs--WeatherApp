import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const latitude = searchParams.get("lat");
    const longitude = searchParams.get("long");

    if (!latitude || !longitude) {
      return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 });
    }

    const APIKey = process.env.OPENWEATHER_API_KEY;

    if (!APIKey) {
      return NextResponse.json({ error: "API key is missing" }, { status: 500 });
    }

    const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${APIKey}`
    );

    if (!res.ok) {
      throw new Error("Failed to fetch location data");
    }

    const data = await res.json();

    if (data.length > 0) {
      return NextResponse.json({
        city: data[0].name, 
        state: data[0].state || "Unknown",  // Fallback for state
        country: data[0].country,
      });
    } else {
      return NextResponse.json({ error: "No location found" }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
