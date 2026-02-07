"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { WeatherDashboard } from "@/components/weather-dashboard"
import { MarketDashboard } from "@/components/market-dashboard"

interface WeatherData {
  city: string
  temperature: number
  condition: string
  humidity: number
  wind: number
  icon: string
}

interface CropAdvisory {
  location: string
  season: string
  crops: Array<{
    name: string
    status: string
    recommendation: string
    icon: string
    priority: string
  }>
  generalAdvice: string[]
  timestamp: string
  validUntil: string
}

interface MarketPriceData {
  success: boolean
  data: Array<{
    crop: string
    market: string
    price: number
    trend: "up" | "down" | "stable"
    change: number
    unit: string
    lastUpdated: string
  }>
  total: number
  timestamp: string
  disclaimer: string
}

export default function SmartCropAdvisory() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [city, setCity] = useState("Delhi")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedCrop, setSelectedCrop] = useState("wheat")
  const [cropAdvisory, setCropAdvisory] = useState<CropAdvisory | null>(null)
  const [marketData, setMarketData] = useState<MarketPriceData | null>(null)
  const [language, setLanguage] = useState("en")
  const [pestResult, setPestResult] = useState<any>(null)
  const [pestLoading, setPestLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [voiceStatus, setVoiceStatus] = useState("")
  const [voiceSupported, setVoiceSupported] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)

  const [lastWeatherUpdate, setLastWeatherUpdate] = useState<Date | null>(null)
  const [lastMarketUpdate, setLastMarketUpdate] = useState<Date | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)

  const fetchWeather = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch(`/api/weather?city=${city}&timestamp=${Date.now()}`)
      const data = await response.json()

      if (response.ok) {
        setWeather(data)
        setLastWeatherUpdate(new Date())
      } else {
        setError(data.error || "Failed to fetch weather data")
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }, [city])

  const fetchMarketPrices = useCallback(async () => {
    try {
      const response = await fetch(`/api/market-prices?timestamp=${Date.now()}`)
      const data = await response.json()
      setMarketData(data)
      setLastMarketUpdate(new Date())
    } catch (err) {
      console.error("Failed to fetch market prices:", err)
    }
  }, [])

  const fetchCropAdvice = async () => {
    try {
      const response = await fetch(`/api/advisory?location=${city}`)
      const data = await response.json()
      setCropAdvisory(data)
    } catch (err) {
      console.error("Failed to fetch crop advice:", err)
    }
  }

  useEffect(() => {
    fetchWeather()
    fetchCropAdvice()
    fetchMarketPrices()
  }, [city])

  const handlePestDetection = async (file: File) => {
    const formData = new FormData()
    formData.append("image", file)

    setPestLoading(true)
    setPestResult(null)

    try {
      const response = await fetch("/api/pest-detection", {
        method: "POST",
        body: formData,
      })
      const result = await response.json()

      if (response.ok) {
        setPestResult(result)
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (err) {
      alert("Failed to analyze image")
    } finally {
      setPestLoading(false)
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        setVoiceSupported(true)
        const recognitionInstance = new SpeechRecognition()
        recognitionInstance.continuous = false
        recognitionInstance.interimResults = false
        recognitionInstance.lang = language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : "en-IN"

        recognitionInstance.onstart = () => {
          setIsListening(true)
          setVoiceStatus("Listening...")
        }

        recognitionInstance.onresult = async (event: any) => {
          const transcript = event.results[0][0].transcript
          setVoiceStatus(`Processing: "${transcript}"`)

          try {
            const response = await fetch("/api/voice", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ command: transcript, language }),
            })
            const result = await response.json()

            if (result.success && result.redirect) {
              setVoiceStatus(result.message)
              if (result.action === "weather") {
                fetchWeather()
              } else if (result.action === "advisory") {
                fetchCropAdvice()
              } else if (result.action === "market") {
                fetchMarketPrices()
              }
            } else {
              setVoiceStatus(result.message || "Command not recognized")
            }
          } catch (err) {
            setVoiceStatus("Error processing voice command")
          }
        }

        recognitionInstance.onerror = () => {
          setVoiceStatus("Voice recognition error")
          setIsListening(false)
        }

        recognitionInstance.onend = () => {
          setIsListening(false)
        }

        setRecognition(recognitionInstance)
      }
    }
  }, [language])

  const startVoiceRecognition = () => {
    if (recognition && !isListening) {
      recognition.start()
    }
  }

  const stopVoiceRecognition = () => {
    if (recognition && isListening) {
      recognition.stop()
    }
  }

  useEffect(() => {
    if (autoRefresh) {
      const weatherInterval = setInterval(fetchWeather, 300000) // 5 minutes
      const marketInterval = setInterval(fetchMarketPrices, 180000) // 3 minutes

      return () => {
        clearInterval(weatherInterval)
        clearInterval(marketInterval)
      }
    }
  }, [autoRefresh, fetchWeather, fetchMarketPrices])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl mb-6 float-animation shadow-2xl">
            <span className="text-4xl">🌾</span>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4 text-balance">
            KisanCare
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 font-medium mb-6 text-pretty">
            AI-Powered Real-time Farming Solutions for Indian Agriculture
          </p>

          {/* Live status indicator */}
          <div className="flex items-center justify-center gap-6 mb-4">
            <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className={`w-3 h-3 rounded-full ${autoRefresh ? "bg-green-500 pulse-glow" : "bg-gray-400"}`}></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {autoRefresh ? "Live Updates Active" : "Manual Mode"}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-8"
            >
              {autoRefresh ? "Disable Auto-Refresh" : "Enable Auto-Refresh"}
            </Button>
          </div>
        </div>

        {/* Enhanced Location Input */}
        <Card className="mb-8 glass-card border-0 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <span className="text-2xl">📍</span>
              Location Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                placeholder="Enter city name (e.g., Delhi, Mumbai, Bangalore)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="flex-1 border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm text-lg py-6"
              />
              <Button
                onClick={fetchWeather}
                disabled={loading}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 px-8"
              >
                {loading ? "Updating..." : "Update Location"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50 shadow-lg">
            <AlertDescription className="text-red-800 font-medium">{error}</AlertDescription>
          </Alert>
        )}

        {/* Enhanced Tabs */}
        <Tabs defaultValue="weather" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-xl rounded-2xl p-2 h-16">
            <TabsTrigger
              value="weather"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl text-sm font-medium transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                🌤️ <span className="hidden sm:inline">Weather</span>
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="advisory"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl text-sm font-medium transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                🌾 <span className="hidden sm:inline">Advisory</span>
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="pest"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl text-sm font-medium transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                🐛 <span className="hidden sm:inline">Pest Detection</span>
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="market"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl text-sm font-medium transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                📈 <span className="hidden sm:inline">Market</span>
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="voice"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl text-sm font-medium transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                🎤 <span className="hidden sm:inline">Voice</span>
              </span>
            </TabsTrigger>
          </TabsList>

          {/* Weather Tab with new dashboard */}
          <TabsContent value="weather">
            {weather && <WeatherDashboard weather={weather} lastUpdate={lastWeatherUpdate} />}
          </TabsContent>

          {/* Crop Advisory Tab */}
          <TabsContent value="advisory">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🌾 Crop Advisory - {cropAdvisory?.season} Season
                </CardTitle>
                <CardDescription>Get personalized farming recommendations for {city}</CardDescription>
              </CardHeader>
              <CardContent>
                {cropAdvisory && (
                  <div className="space-y-6">
                    {/* General Advice */}
                    <div>
                      <h4 className="font-semibold mb-3">General Advice:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {cropAdvisory.generalAdvice.map((advice, index) => (
                          <li key={index} className="text-sm">
                            {advice}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Crop Specific Advice */}
                    <div>
                      <h4 className="font-semibold mb-3">Crop Recommendations:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cropAdvisory.crops.map((crop, index) => (
                          <Card key={index} className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-semibold">{crop.name}</h5>
                              <Badge
                                variant={
                                  crop.priority === "high"
                                    ? "destructive"
                                    : crop.priority === "medium"
                                      ? "default"
                                      : "secondary"
                                }
                              >
                                {crop.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{crop.status}</p>
                            <p className="text-sm">{crop.recommendation}</p>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      Last updated: {new Date(cropAdvisory.timestamp).toLocaleString()}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pest Detection Tab */}
          <TabsContent value="pest">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">🐛 Pest Detection</CardTitle>
                <CardDescription>Upload crop images for AI-powered pest analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="text-6xl mb-4">📤</div>
                    <p className="text-lg font-medium mb-2">Upload Crop Image</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Drag and drop or click to select an image of your crop (Max 10MB)
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handlePestDetection(file)
                      }}
                      className="hidden"
                      id="pest-upload"
                      disabled={pestLoading}
                    />
                    <Button asChild disabled={pestLoading}>
                      <label htmlFor="pest-upload" className="cursor-pointer">
                        {pestLoading ? "Analyzing..." : "Select Image"}
                      </label>
                    </Button>
                  </div>

                  {pestResult && (
                    <Card className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">Detection Result</h3>
                          <Badge
                            variant={
                              pestResult.severity === "high"
                                ? "destructive"
                                : pestResult.severity === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {pestResult.severity} severity
                          </Badge>
                        </div>

                        <div>
                          <h4 className="font-semibold text-lg text-red-600">{pestResult.result}</h4>
                          <p className="text-sm text-gray-600">
                            Confidence: {Math.round(pestResult.confidence * 100)}%
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Treatment Recommendations:</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {pestResult.treatment.map((treatment: string, index: number) => (
                              <li key={index} className="text-sm">
                                {treatment}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Prevention Tips:</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {pestResult.prevention.map((prevention: string, index: number) => (
                              <li key={index} className="text-sm">
                                {prevention}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="text-xs text-gray-500 border-t pt-2">
                          Analysis completed at: {new Date(pestResult.processedAt).toLocaleString()}
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Market Tab with new dashboard */}
          <TabsContent value="market">
            {marketData && <MarketDashboard marketData={marketData} lastUpdate={lastMarketUpdate} />}
          </TabsContent>

          {/* Voice Assistant Tab */}
          <TabsContent value="voice">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">🎤 Voice Assistant</CardTitle>
                <CardDescription>Ask farming questions in your preferred language</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Language Selection */}
                  <div className="flex gap-2 justify-center">
                    <Button
                      variant={language === "en" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setLanguage("en")}
                    >
                      English
                    </Button>
                    <Button
                      variant={language === "hi" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setLanguage("hi")}
                    >
                      हिंदी
                    </Button>
                    <Button
                      variant={language === "pa" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setLanguage("pa")}
                    >
                      ਪੰਜਾਬੀ
                    </Button>
                  </div>

                  <div className="text-center space-y-4">
                    <div
                      className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-4xl transition-colors ${
                        isListening ? "bg-red-100 animate-pulse" : "bg-green-100"
                      }`}
                    >
                      {isListening ? "🔴" : "🎤"}
                    </div>

                    {voiceSupported ? (
                      <>
                        <div className="space-y-2">
                          <p className="text-lg font-medium">
                            {isListening ? "Listening..." : "Voice Assistant Ready"}
                          </p>
                          {voiceStatus && <p className="text-sm text-gray-600">{voiceStatus}</p>}
                        </div>

                        <div className="flex gap-2 justify-center">
                          <Button
                            onClick={startVoiceRecognition}
                            disabled={isListening}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {isListening ? "Listening..." : "Start Voice Chat"}
                          </Button>
                          {isListening && (
                            <Button onClick={stopVoiceRecognition} variant="outline">
                              Stop
                            </Button>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-lg">Voice Recognition Not Supported</p>
                        <p className="text-sm text-gray-500">Please use a modern browser with microphone access</p>
                      </div>
                    )}
                  </div>

                  {/* Voice Commands Help */}
                  <Card className="bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-sm">Sample Voice Commands</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="font-medium">English:</p>
                          <ul className="text-xs space-y-1 text-gray-600">
                            <li>"What is the weather today?"</li>
                            <li>"Give me crop advisory"</li>
                            <li>"Show market prices"</li>
                            <li>"Help with pest detection"</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium">हिंदी:</p>
                          <ul className="text-xs space-y-1 text-gray-600">
                            <li>"मौसम की जानकारी दें"</li>
                            <li>"फसल की सलाह बताएं"</li>
                            <li>"बाजार भाव क्या है"</li>
                            <li>"कीट की पहचान करें"</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
