"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PestResult {
  success: boolean
  result: string
  confidence: number
  treatment: string[]
  prevention: string[]
  severity: "low" | "medium" | "high"
  processedAt: string
  imageSize: number
  imageType: string
}

export default function PestDetectionEnhanced() {
  const [pestResult, setPestResult] = useState<PestResult | null>(null)
  const [pestLoading, setPestLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePestDetection = async (file: File) => {
    const formData = new FormData()
    formData.append("image", file)

    setPestLoading(true)
    setPestResult(null)

    // Create preview URL
    const imageUrl = URL.createObjectURL(file)
    setSelectedImage(imageUrl)

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
        setSelectedImage(null)
      }
    } catch (err) {
      alert("Failed to analyze image")
      setSelectedImage(null)
    } finally {
      setPestLoading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith("image/")) {
        handlePestDetection(file)
      } else {
        alert("Please upload an image file")
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handlePestDetection(file)
    }
  }

  const resetDetection = () => {
    setPestResult(null)
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? "border-green-400 bg-green-50"
            : pestLoading
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-6xl mb-4">{pestLoading ? "🔄" : dragActive ? "📥" : "📤"}</div>
        <p className="text-lg font-medium mb-2">{pestLoading ? "Analyzing Image..." : "Upload Crop Image"}</p>
        <p className="text-sm text-gray-500 mb-4">
          {pestLoading
            ? "Please wait while AI analyzes your crop image"
            : "Drag and drop or click to select an image of your crop (Max 10MB)"}
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="pest-upload"
          disabled={pestLoading}
        />

        <div className="flex gap-2 justify-center">
          <Button asChild disabled={pestLoading}>
            <label htmlFor="pest-upload" className="cursor-pointer">
              {pestLoading ? "Analyzing..." : "Select Image"}
            </label>
          </Button>
          {(pestResult || selectedImage) && (
            <Button onClick={resetDetection} variant="outline">
              Upload New Image
            </Button>
          )}
        </div>
      </div>

      {/* Image Preview */}
      {selectedImage && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Uploaded Image</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="Uploaded crop"
              className="max-w-full h-auto max-h-64 mx-auto rounded-lg shadow-md"
            />
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {pestResult && (
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">🐛 Detection Result</CardTitle>
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
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert
              className={
                pestResult.severity === "high"
                  ? "border-red-200 bg-red-50"
                  : pestResult.severity === "medium"
                    ? "border-yellow-200 bg-yellow-50"
                    : "border-green-200 bg-green-50"
              }
            >
              <AlertDescription>
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg">{pestResult.result}</h4>
                  <p className="text-sm">
                    Confidence: <span className="font-medium">{Math.round(pestResult.confidence * 100)}%</span>
                  </p>
                </div>
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h4 className="font-semibold mb-3 text-red-600">🚨 Treatment Required</h4>
                <ul className="space-y-2">
                  {pestResult.treatment.map((treatment: string, index: number) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>{treatment}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold mb-3 text-green-600">🛡️ Prevention Tips</h4>
                <ul className="space-y-2">
                  {pestResult.prevention.map((prevention: string, index: number) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>{prevention}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            <div className="text-xs text-gray-500 border-t pt-3 flex justify-between">
              <span>Analysis completed: {new Date(pestResult.processedAt).toLocaleString()}</span>
              <span>Image: {(pestResult.imageSize / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
