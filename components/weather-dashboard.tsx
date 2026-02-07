"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface WeatherData {
  city: string
  temperature: number
  condition: string
  humidity: number
  wind: number
  icon: string
  feelsLike?: number
  pressure?: number
  visibility?: number
  sunrise?: string
  sunset?: string
  timestamp: string
}

interface WeatherDashboardProps {
  weather: WeatherData
  lastUpdate: Date | null
}

export function WeatherDashboard({ weather, lastUpdate }: WeatherDashboardProps) {
  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition.toLowerCase()
    if (conditionLower.includes("clear")) return "☀️"
    if (conditionLower.includes("cloud")) return "☁️"
    if (conditionLower.includes("rain")) return "🌧️"
    if (conditionLower.includes("storm")) return "⛈️"
    if (conditionLower.includes("snow")) return "❄️"
    if (conditionLower.includes("mist") || conditionLower.includes("fog")) return "🌫️"
    return "🌤️"
  }

  const getTemperatureColor = (temp: number) => {
    if (temp >= 35) return "text-red-600"
    if (temp >= 25) return "text-orange-500"
    if (temp >= 15) return "text-yellow-500"
    if (temp >= 5) return "text-blue-500"
    return "text-blue-700"
  }

  return (
    <div className="space-y-6">
      {/* Header with live status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{getWeatherIcon(weather.condition)}</div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Live Weather</h2>
            <p className="text-gray-600 dark:text-gray-300 capitalize">{weather.condition}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Updated: {lastUpdate?.toLocaleTimeString() || "Never"}</span>
        </div>
      </div>

      {/* Main weather cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">🌡️ Temperature</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-4xl font-bold ${getTemperatureColor(weather.temperature)} group-hover:scale-110 transition-transform`}
            >
              {weather.temperature}°C
            </div>
            {weather.feelsLike && <p className="text-xs text-muted-foreground">Feels like {weather.feelsLike}°C</p>}
          </CardContent>
        </Card>

        <Card className="glass-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">💧 Humidity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600 group-hover:scale-110 transition-transform">
              {weather.humidity}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${weather.humidity}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">💨 Wind Speed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-600 group-hover:scale-110 transition-transform">
              {weather.wind}
            </div>
            <p className="text-xs text-muted-foreground">km/h</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">📍 Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 group-hover:scale-110 transition-transform">
              {weather.city}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional weather details */}
      {(weather.pressure || weather.visibility || weather.sunrise) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {weather.pressure && (
            <Card className="glass-card border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌊</span>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Pressure</p>
                    <p className="text-lg font-semibold">{weather.pressure} hPa</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {weather.visibility && (
            <Card className="glass-card border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👁️</span>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Visibility</p>
                    <p className="text-lg font-semibold">{weather.visibility} km</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {weather.sunrise && (
            <Card className="glass-card border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌅</span>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Sunrise</p>
                    <p className="text-lg font-semibold">{weather.sunrise}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
