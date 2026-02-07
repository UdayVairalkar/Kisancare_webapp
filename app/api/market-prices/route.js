import { NextResponse } from "next/server"

const generateRealtimeMarketData = () => {
  const baseData = [
    { crop: "Wheat", market: "Ludhiana Mandi", basePrice: 2250, volatility: 0.05 },
    { crop: "Rice (Basmati)", market: "Amritsar Mandi", basePrice: 3500, volatility: 0.04 },
    { crop: "Cotton", market: "Bathinda Mandi", basePrice: 6800, volatility: 0.08 },
    { crop: "Maize", market: "Jalandhar Mandi", basePrice: 1800, volatility: 0.03 },
    { crop: "Sugarcane", market: "Muzaffarnagar Mandi", basePrice: 350, volatility: 0.02 },
    { crop: "Soybean", market: "Indore Mandi", basePrice: 4200, volatility: 0.06 },
    { crop: "Mustard", market: "Jaipur Mandi", basePrice: 5500, volatility: 0.05 },
    { crop: "Onion", market: "Nashik Mandi", basePrice: 1200, volatility: 0.12 },
    { crop: "Tomato", market: "Pune Mandi", basePrice: 800, volatility: 0.15 },
    { crop: "Potato", market: "Agra Mandi", basePrice: 600, volatility: 0.1 },
    { crop: "Garlic", market: "Indore Mandi", basePrice: 2800, volatility: 0.08 },
    { crop: "Turmeric", market: "Erode Mandi", basePrice: 7500, volatility: 0.07 },
  ]

  return baseData.map((item) => {
    // Generate realistic price fluctuations
    const priceVariation = (Math.random() - 0.5) * 2 * item.volatility
    const currentPrice = Math.round(item.basePrice * (1 + priceVariation))
    const change = ((currentPrice - item.basePrice) / item.basePrice) * 100

    // Determine trend based on change
    let trend = "stable"
    if (change > 0.5) trend = "up"
    else if (change < -0.5) trend = "down"

    // Generate realistic timestamps (within last 30 minutes)
    const lastUpdated = new Date(Date.now() - Math.random() * 30 * 60 * 1000).toISOString()

    return {
      crop: item.crop,
      market: item.market,
      price: currentPrice,
      trend,
      change: Math.round(change * 100) / 100,
      unit: "₹/Quintal",
      lastUpdated,
      volume: Math.round(Math.random() * 1000 + 100), // Trading volume
      high: Math.round(currentPrice * (1 + Math.random() * 0.05)),
      low: Math.round(currentPrice * (1 - Math.random() * 0.05)),
      previousClose: item.basePrice,
    }
  })
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const crop = searchParams.get("crop")
    const market = searchParams.get("market")
    const limit = Number.parseInt(searchParams.get("limit")) || 12

    let marketPricesData = generateRealtimeMarketData()

    // Filter by crop if specified
    if (crop) {
      marketPricesData = marketPricesData.filter((item) => item.crop.toLowerCase().includes(crop.toLowerCase()))
    }

    // Filter by market if specified
    if (market) {
      marketPricesData = marketPricesData.filter((item) => item.market.toLowerCase().includes(market.toLowerCase()))
    }

    // Limit results
    marketPricesData = marketPricesData.slice(0, limit)

    return NextResponse.json({
      success: true,
      data: marketPricesData,
      total: marketPricesData.length,
      timestamp: new Date().toISOString(),
      disclaimer: "⚠️ Prices are indicative and may vary. Please verify with local mandis before making transactions.",
      summary: {
        totalMarkets: marketPricesData.length,
        trending: {
          up: marketPricesData.filter((item) => item.trend === "up").length,
          down: marketPricesData.filter((item) => item.trend === "down").length,
          stable: marketPricesData.filter((item) => item.trend === "stable").length,
        },
      },
    })
  } catch (error) {
    console.error("Market prices API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
