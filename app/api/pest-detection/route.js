import { NextResponse } from "next/server"

const pestDatabase = [
  {
    id: "rice_blast",
    name: "Rice Blast Disease",
    confidence: 0.92,
    treatment: [
      "Apply Tricyclazole 75% WP @ 0.6 g/l",
      "Avoid excessive nitrogen fertilizer",
      "Ensure proper water drainage",
      "Remove infected plant debris",
    ],
    prevention: ["Use resistant varieties", "Maintain proper plant spacing", "Avoid over-fertilization with nitrogen"],
    severity: "high",
  },
  {
    id: "wheat_rust",
    name: "Wheat Leaf Rust",
    confidence: 0.88,
    treatment: [
      "Spray Propiconazole 25% EC @ 1 ml/l",
      "Apply at early infection stage",
      "Repeat spray after 15 days if needed",
    ],
    prevention: ["Use rust-resistant varieties", "Avoid late sowing", "Maintain field hygiene"],
    severity: "medium",
  },
]

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get("image")

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Invalid file type. Please upload an image." }, { status: 400 })
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 400 })
    }

    // For demo purposes, randomly select a pest from database
    const randomPest = pestDatabase[Math.floor(Math.random() * pestDatabase.length)]

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      result: randomPest.name,
      confidence: randomPest.confidence,
      treatment: randomPest.treatment,
      prevention: randomPest.prevention,
      severity: randomPest.severity,
      processedAt: new Date().toISOString(),
      imageSize: file.size,
      imageType: file.type,
    })
  } catch (error) {
    console.error("Pest detection API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}