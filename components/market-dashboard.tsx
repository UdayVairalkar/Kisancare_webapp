"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface MarketPrice {
  crop: string
  market: string
  price: number
  trend: "up" | "down" | "stable"
  change: number
  unit: string
  lastUpdated: string
  volume?: number
  high?: number
  low?: number
  previousClose?: number
}

interface MarketData {
  success: boolean
  data: MarketPrice[]
  total: number
  timestamp: string
  disclaimer: string
  summary?: {
    totalMarkets: number
    trending: {
      up: number
      down: number
      stable: number
    }
  }
}

interface MarketDashboardProps {
  marketData: MarketData
  lastUpdate: Date | null
}

export function MarketDashboard({ marketData, lastUpdate }: MarketDashboardProps) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4" />
      case "down":
        return <TrendingDown className="w-4 h-4" />
      default:
        return <Minus className="w-4 h-4" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "bg-green-500 hover:bg-green-600 text-white"
      case "down":
        return "bg-red-500 hover:bg-red-600 text-white"
      default:
        return "bg-gray-500 hover:bg-gray-600 text-white"
    }
  }

  const getCropEmoji = (crop: string) => {
    const cropLower = crop.toLowerCase()
    if (cropLower.includes("wheat")) return "🌾"
    if (cropLower.includes("rice")) return "🍚"
    if (cropLower.includes("cotton")) return "🌿"
    if (cropLower.includes("maize") || cropLower.includes("corn")) return "🌽"
    if (cropLower.includes("sugarcane")) return "🎋"
    if (cropLower.includes("soybean")) return "🫘"
    if (cropLower.includes("mustard")) return "🌻"
    if (cropLower.includes("onion")) return "🧅"
    if (cropLower.includes("tomato")) return "🍅"
    if (cropLower.includes("potato")) return "🥔"
    if (cropLower.includes("garlic")) return "🧄"
    if (cropLower.includes("turmeric")) return "🟡"
    return "🌱"
  }

  return (
    <div className="space-y-6">
      {/* Header with market summary */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Live Market Prices</h2>
          <p className="text-gray-600 dark:text-gray-300">Real-time crop prices across Indian mandis</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Updated: {lastUpdate?.toLocaleTimeString() || "Never"}</span>
        </div>
      </div>

      {/* Market summary cards */}
      {marketData.summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="glass-card border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📊</span>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total Markets</p>
                  <p className="text-2xl font-bold text-blue-600">{marketData.summary.totalMarkets}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Trending Up</p>
                  <p className="text-2xl font-bold text-green-600">{marketData.summary.trending.up}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-6 h-6 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Trending Down</p>
                  <p className="text-2xl font-bold text-red-600">{marketData.summary.trending.down}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Minus className="w-6 h-6 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Stable</p>
                  <p className="text-2xl font-bold text-gray-600">{marketData.summary.trending.stable}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Market price cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {marketData.data.map((price, index) => (
          <Card key={index} className="glass-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getCropEmoji(price.crop)}</span>
                  <CardTitle className="text-lg group-hover:text-green-600 transition-colors">{price.crop}</CardTitle>
                </div>
                <Badge className={`${getTrendColor(price.trend)} flex items-center gap-1`}>
                  {getTrendIcon(price.trend)}
                  {price.change !== 0 && `${Math.abs(price.change)}%`}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-bold text-green-600 group-hover:scale-105 transition-transform">
                ₹{price.price.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{price.unit}</div>

              {/* Additional market details */}
              {(price.high || price.low || price.volume) && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {price.high && (
                    <div>
                      <span className="text-gray-500">High: </span>
                      <span className="font-semibold text-green-600">₹{price.high}</span>
                    </div>
                  )}
                  {price.low && (
                    <div>
                      <span className="text-gray-500">Low: </span>
                      <span className="font-semibold text-red-600">₹{price.low}</span>
                    </div>
                  )}
                  {price.volume && (
                    <div className="col-span-2">
                      <span className="text-gray-500">Volume: </span>
                      <span className="font-semibold">{price.volume} quintals</span>
                    </div>
                  )}
                </div>
              )}

              <div className="border-t pt-2 space-y-1">
                <div className="text-xs text-gray-500">{price.market}</div>
                <div className="text-xs text-gray-400">Updated: {new Date(price.lastUpdated).toLocaleString()}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Disclaimer */}
      <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <span className="text-yellow-600 text-lg">⚠️</span>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">{marketData.disclaimer}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
