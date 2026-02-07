import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get("city") || "Delhi"

    const apiKey = process.env.OPENWEATHER_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "OpenWeather API key not configured" }, { status: 500 })
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&_=${Date.now()}`,
      { cache: "no-store" }, // Ensure fresh data
    )

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch weather data" }, { status: response.status })
    }

    const data = await response.json()

    const weatherData = {
      city: data.name,
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].description,
      humidity: data.main.humidity,
      wind: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      icon: data.weather[0].icon,
      feelsLike: Math.round(data.main.feels_like),
      pressure: data.main.pressure,
      visibility: data.visibility ? Math.round(data.visibility / 1000) : null,
      uvIndex: data.uvi || null,
      sunrise: data.sys.sunrise ? new Date(data.sys.sunrise * 1000).toLocaleTimeString() : null,
      sunset: data.sys.sunset ? new Date(data.sys.sunset * 1000).toLocaleTimeString() : null,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(weatherData)
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
