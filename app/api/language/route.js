import { NextResponse } from "next/server"

const translations = {
  en: {
    welcome: "Welcome to Smart Crop Advisory",
    weather: "Weather Forecast",
    advisory: "Crop Advisory",
    pestDetection: "Pest Detection",
    marketPrices: "Market Prices",
    voiceAssistant: "Voice Assistant",
    uploadImage: "Upload Image of Affected Crop",
    treatment: "Recommended Treatment",
    prevention: "Prevention Tips",
  },
  hi: {
    welcome: "स्मार्ट फसल सलाहकार में आपका स्वागत है",
    weather: "मौसम पूर्वानुमान",
    advisory: "फसल सलाह",
    pestDetection: "कीट पहचान",
    marketPrices: "बाजार भाव",
    voiceAssistant: "आवाज सहायक",
    uploadImage: "प्रभावित फसल की तस्वीर अपलोड करें",
    treatment: "अनुशंसित उपचार",
    prevention: "रोकथाम के उपाय",
  },
  pa: {
    welcome: "ਸਮਾਰਟ ਫਸਲ ਸਲਾਹਕਾਰ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ",
    weather: "ਮੌਸਮ ਦੀ ਭਵਿੱਖਬਾਣੀ",
    advisory: "ਫਸਲ ਸਲਾਹ",
    pestDetection: "ਕੀੜੇ ਦੀ ਪਛਾਣ",
    marketPrices: "ਮਾਰਕੀਟ ਰੇਟ",
    voiceAssistant: "ਆਵਾਜ਼ ਸਹਾਇਕ",
    uploadImage: "ਪ੍ਰਭਾਵਿਤ ਫਸਲ ਦੀ ਤਸਵੀਰ ਅੱਪਲੋਡ ਕਰੋ",
    treatment: "ਸਿਫਾਰਸ਼ ਕੀਤਾ ਇਲਾਜ",
    prevention: "ਰੋਕਥਾਮ ਦੇ ਉਪਾਅ",
  },
}

const cropAdvisoryTranslations = {
  en: {
    wheatIrrigation: "Wheat: Ideal time for irrigation",
    riceMonitor: "Rice: Monitor for bacterial leaf blight",
    cottonSpray: "Cotton: Suggest neem-based pesticide spray",
  },
  hi: {
    wheatIrrigation: "गेहूं: सिंचाई के लिए आदर्श समय",
    riceMonitor: "चावल: बैक्टीरियल लीफ ब्लाइट की निगरानी करें",
    cottonSpray: "कपास: नीम आधारित कीटनाशक स्प्रे का सुझाव",
  },
  pa: {
    wheatIrrigation: "ਕਣਕ: ਸਿੰਚਾਈ ਲਈ ਆਦਰਸ਼ ਸਮਾਂ",
    riceMonitor: "ਚਾਵਲ: ਬੈਕਟੀਰੀਅਲ ਲੀਫ ਬਲਾਈਟ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ",
    cottonSpray: "ਕਪਾਹ: ਨਿੰਮ ਅਧਾਰਿਤ ਕੀੜੇਮਾਰ ਸਪਰੇਅ ਦਾ ਸੁਝਾਅ",
  },
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const lang = searchParams.get("lang") || "en"
    const type = searchParams.get("type") || "general"

    // Validate language
    if (!translations[lang]) {
      return NextResponse.json({ error: "Unsupported language" }, { status: 400 })
    }

    const responseData = {
      language: lang,
      translations: translations[lang],
    }

    // Add crop advisory translations if requested
    if (type === "advisory" || type === "all") {
      responseData.cropAdvisory = cropAdvisoryTranslations[lang]
    }

    // Add language metadata
    const languageInfo = {
      en: { name: "English", nativeName: "English", rtl: false },
      hi: { name: "Hindi", nativeName: "हिन्दी", rtl: false },
      pa: { name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", rtl: false },
    }

    responseData.languageInfo = languageInfo[lang]
    responseData.availableLanguages = Object.keys(translations).map((key) => ({
      code: key,
      ...languageInfo[key],
    }))

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Language API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
