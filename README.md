# Smart Crop Advisory Backend API

A comprehensive backend API for the Smart Crop Advisory system designed for Indian farmers. Built with Next.js API routes.

## Features

- **Weather Data**: Real-time weather information using OpenWeatherMap API
- **Crop Advisory**: Seasonal crop recommendations based on location
- **Pest Detection**: Image-based pest and disease identification
- **Market Prices**: Current mandi prices for various crops
- **Multilingual Support**: English, Hindi, and Punjabi translations
- **Voice Assistant**: Voice command processing (demo)

## API Endpoints

### Weather Information
\`\`\`
GET /api/weather?city=Delhi
\`\`\`

### Crop Advisory
\`\`\`
GET /api/advisory?location=Delhi
\`\`\`

### Pest Detection
\`\`\`
POST /api/pest-detection
Content-Type: multipart/form-data
Body: image file
\`\`\`

### Market Prices
\`\`\`
GET /api/market-prices?crop=wheat&limit=10
\`\`\`

### Language Support
\`\`\`
GET /api/language?lang=hi&type=all
\`\`\`

### Voice Assistant
\`\`\`
GET /api/voice?lang=hi&action=activate
POST /api/voice
Body: { "command": "weather information", "language": "en" }
\`\`\`

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local`
4. Add your OpenWeatherMap API key
5. Run development server: `npm run dev`

## Environment Variables

- `OPENWEATHER_API_KEY`: Required for weather data
- `NEXT_PUBLIC_API_URL`: API base URL for frontend integration

## Supported Languages

- English (en)
- Hindi (hi)
- Punjabi (pa)

## File Upload Limits

- Maximum file size: 10MB
- Supported formats: JPEG, PNG, JPG, WebP
