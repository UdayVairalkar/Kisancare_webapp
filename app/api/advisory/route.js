import { NextResponse } from "next/server"

const cropAdvisoryData = {
  Delhi: {
    season: "Rabi",
    crops: [
      {
        name: "Wheat",
        status: "Ideal time for irrigation",
        recommendation: "Apply irrigation at crown root initiation stage",
        icon: "check-circle",
        priority: "high",
      },
      {
        name: "Rice",
        status: "Monitor for bacterial leaf blight",
        recommendation: "Spray Streptocycline 300 ppm + Copper oxychloride 2500 ppm",
        icon: "exclamation-triangle",
        priority: "medium",
      },
      {
        name: "Cotton",
        status: "Suggest neem-based pesticide spray",
        recommendation: "Apply neem oil 0.03% or neem seed kernel extract 5%",
        icon: "check-circle",
        priority: "low",
      },
    ],
    generalAdvice: [
      "Monitor weather conditions for sudden temperature changes",
      "Ensure proper drainage in fields due to expected rainfall",
      "Check soil moisture levels before irrigation",
    ],
  },
  Mumbai: {
    season: "Kharif",
    crops: [
      {
        name: "Rice",
        status: "Transplanting season",
        recommendation: "Maintain 2-3 cm water level in fields",
        icon: "check-circle",
        priority: "high",
      },
      {
        name: "Sugarcane",
        status: "Apply fertilizer",
        recommendation: "Apply NPK 120:60:60 kg/ha in split doses",
        icon: "check-circle",
        priority: "medium",
      },
    ],
    generalAdvice: ["Prepare for monsoon season", "Clean drainage channels", "Store seeds in dry conditions"],
  },
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get("location") || "Delhi"

    const advisory = cropAdvisoryData[location] || cropAdvisoryData["Delhi"]

    return NextResponse.json({
      location,
      ...advisory,
      timestamp: new Date().toISOString(),
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Valid for 7 days
    })
  } catch (error) {
    console.error("Advisory API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
