import { NextResponse } from "next/server"

const voiceCommands = [
  "मौसम की जानकारी दें",
  "फसल की सलाह बताएं",
  "बाजार भाव क्या है",
  "कीट की पहचान करें",
  "What is the weather today",
  "Give me crop advisory",
  "Show market prices",
  "Detect pest in my crop",
]

const voiceResponses = {
  hi: {
    activated: "आवाज़ सहायक सक्रिय हो गया है। कृपया बोलें...",
    listening: "सुन रहा हूँ...",
    processing: "आपकी आवाज़ को समझ रहा हूँ...",
    error: "क्षमा करें, मैं आपकी आवाज़ नहीं समझ पाया।",
  },
  en: {
    activated: "Voice assistant activated. Please speak...",
    listening: "Listening...",
    processing: "Processing your voice...",
    error: "Sorry, I could not understand your voice.",
  },
  pa: {
    activated: "ਆਵਾਜ਼ ਸਹਾਇਕ ਸਰਗਰਮ ਹੋ ਗਿਆ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਬੋਲੋ...",
    listening: "ਸੁਣ ਰਿਹਾ ਹਾਂ...",
    processing: "ਤੁਹਾਡੀ ਆਵਾਜ਼ ਨੂੰ ਸਮਝ ਰਿਹਾ ਹਾਂ...",
    error: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਂ ਤੁਹਾਡੀ ਆਵਾਜ਼ ਨਹੀਂ ਸਮਝ ਸਕਿਆ।",
  },
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const lang = searchParams.get("lang") || "en"
    const action = searchParams.get("action") || "activate"

    const responses = voiceResponses[lang] || voiceResponses["en"]

    const responseData = {
      success: true,
      action,
      language: lang,
      timestamp: new Date().toISOString(),
    }

    switch (action) {
      case "activate":
        responseData.message = responses.activated
        responseData.status = "ready"
        responseData.supportedCommands = voiceCommands
        break

      case "listening":
        responseData.message = responses.listening
        responseData.status = "listening"
        break

      case "processing":
        responseData.message = responses.processing
        responseData.status = "processing"
        break

      case "commands":
        responseData.message = "Available voice commands"
        responseData.commands = voiceCommands
        responseData.status = "ready"
        break

      default:
        responseData.message = responses.activated
        responseData.status = "ready"
    }

    // Add voice assistant capabilities
    responseData.capabilities = [
      "Weather information",
      "Crop advisory",
      "Market prices",
      "Pest detection guidance",
      "Multilingual support",
    ]

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Voice API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { command, language = "en" } = body

    if (!command) {
      return NextResponse.json({ error: "Voice command is required" }, { status: 400 })
    }

    const responses = voiceResponses[language] || voiceResponses["en"]

    // Simple command processing (in real app, this would use speech recognition)
    const response = {
      success: true,
      command,
      language,
      timestamp: new Date().toISOString(),
    }

    // Basic command matching
    if (command.toLowerCase().includes("weather") || command.includes("मौसम")) {
      response.action = "weather"
      response.message = "Fetching weather information..."
      response.redirect = "/api/weather"
    } else if (command.toLowerCase().includes("crop") || command.includes("फसल")) {
      response.action = "advisory"
      response.message = "Getting crop advisory..."
      response.redirect = "/api/advisory"
    } else if (command.toLowerCase().includes("market") || command.includes("बाजार")) {
      response.action = "market"
      response.message = "Checking market prices..."
      response.redirect = "/api/market-prices"
    } else if (command.toLowerCase().includes("pest") || command.includes("कीट")) {
      response.action = "pest"
      response.message = "Ready for pest detection..."
      response.redirect = "/api/pest-detection"
    } else {
      response.message = responses.error
      response.suggestions = voiceCommands.slice(0, 3)
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Voice POST API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
