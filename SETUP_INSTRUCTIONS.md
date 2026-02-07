# Smart Crop Advisory - Complete Setup Guide

## 📋 Overview

This guide will help you set up and run the Smart Crop Advisory application on your local system. The application provides real-time weather updates, market prices, pest detection, and voice assistance for farmers.

## 🛠️ Prerequisites

Before starting, ensure you have the following installed on your system:

- **Node.js** (version 18.0 or higher)
- **npm** or **yarn** package manager
- **Git** (for cloning the repository)
- A modern web browser (Chrome, Firefox, Safari, or Edge)

## 📥 Installation Steps

### Step 1: Download the Project

After downloading the ZIP file from v0:

1. **Extract the ZIP file** to your desired location
2. **Open Terminal/Command Prompt** and navigate to the extracted folder:
   \`\`\`bash
   cd path/to/smart-crop-advisory
   \`\`\`

### Step 2: Install Dependencies

Run the following command to install all required packages:

\`\`\`bash
npm install
\`\`\`

Or if you prefer yarn:
\`\`\`bash
yarn install
\`\`\`

This will install all the necessary dependencies including:
- Next.js framework
- React components
- UI libraries (shadcn/ui)
- Tailwind CSS
- TypeScript support

### Step 3: Environment Setup

1. **Create environment file**:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Or manually create a `.env.local` file in the root directory.

2. **Add your API keys** to `.env.local`:
   \`\`\`env
   # Required: OpenWeatherMap API Key
   OPENWEATHER_API_KEY=your_openweathermap_api_key_here
   
   # Optional: Climate API Key (if using additional weather services)
   CLIMATEAPI=your_climate_api_key_here
   \`\`\`

### Step 4: Get OpenWeatherMap API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Go to "API Keys" section in your dashboard
4. Copy your API key
5. Paste it in your `.env.local` file

## 🚀 Running the Application

### Development Mode

Start the development server:

\`\`\`bash
npm run dev
\`\`\`

Or with yarn:
\`\`\`bash
yarn dev
\`\`\`

The application will be available at: **http://localhost:3000**

### Production Build

To create a production build:

\`\`\`bash
npm run build
npm start
\`\`\`

## 🌐 Accessing the Application

1. **Open your web browser**
2. **Navigate to**: `http://localhost:3000`
3. **Allow microphone access** when prompted (for voice assistant feature)
4. **Enter your city name** in the location field
5. **Explore the features**:
   - 🌤️ **Weather**: Real-time weather data
   - 🌾 **Advisory**: Crop recommendations
   - 🐛 **Pest Detection**: Upload crop images
   - 📈 **Market**: Live market prices
   - 🎤 **Voice**: Voice assistant (English, Hindi, Punjabi)

## 🔧 Configuration Options

### Auto-Refresh Settings

The application includes real-time updates:
- **Weather data**: Updates every 5 minutes
- **Market prices**: Updates every 3 minutes
- **Manual refresh**: Click the "Disable Auto-Refresh" button to control updates manually

### Language Support

The voice assistant supports:
- **English**: Default language
- **हिंदी (Hindi)**: Indian language support
- **ਪੰਜਾਬੀ (Punjabi)**: Regional language support

### Browser Permissions

For full functionality, allow:
- **Microphone access**: Required for voice assistant
- **Location access**: Optional, for automatic city detection

## 📱 Features Overview

### 1. Real-time Weather Dashboard
- Current temperature with color-coded display
- Humidity levels with progress bars
- Wind speed and direction
- Additional metrics (pressure, visibility, sunrise/sunset)
- Auto-refresh every 5 minutes

### 2. Live Market Prices
- Real-time crop prices from Indian mandis
- Price trend indicators (up/down/stable)
- Market volume and trading data
- Auto-refresh every 3 minutes
- Support for 12+ major crops

### 3. AI-Powered Pest Detection
- Upload crop images (max 10MB)
- AI analysis for pest identification
- Treatment recommendations
- Prevention tips
- Confidence scoring

### 4. Multilingual Voice Assistant
- Voice command recognition
- Natural language processing
- Multi-language support
- Real-time status updates

### 5. Crop Advisory System
- Seasonal recommendations
- Location-based advice
- Priority-based suggestions
- Weather-integrated planning

## 🐛 Troubleshooting

### Common Issues

**1. API Key Not Working**
\`\`\`
Error: "OpenWeather API key not configured"
\`\`\`
**Solution**: Ensure your API key is correctly added to `.env.local` and restart the server.

**2. Voice Assistant Not Working**
\`\`\`
Error: "Voice Recognition Not Supported"
\`\`\`
**Solution**: Use a modern browser (Chrome recommended) and allow microphone permissions.

**3. Port Already in Use**
\`\`\`
Error: "Port 3000 is already in use"
\`\`\`
**Solution**: 
\`\`\`bash
# Kill the process using port 3000
npx kill-port 3000

# Or run on a different port
npm run dev -- -p 3001
\`\`\`

**4. Module Not Found Errors**
\`\`\`
Error: "Cannot resolve module"
\`\`\`
**Solution**: 
\`\`\`bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
\`\`\`

**5. Build Errors**
\`\`\`
Error: "Build failed"
\`\`\`
**Solution**: 
\`\`\`bash
# Clear Next.js cache
rm -rf .next
npm run build
\`\`\`

### Performance Optimization

**For better performance:**

1. **Disable auto-refresh** if not needed
2. **Close unused browser tabs**
3. **Use Chrome or Edge** for best performance
4. **Ensure stable internet connection** for real-time features

## 📊 System Requirements

### Minimum Requirements
- **RAM**: 4GB
- **Storage**: 1GB free space
- **Internet**: Stable broadband connection
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Recommended Requirements
- **RAM**: 8GB or higher
- **Storage**: 2GB free space
- **Internet**: High-speed broadband
- **Browser**: Latest version of Chrome or Edge

## 🔒 Security Notes

- **API Keys**: Never commit API keys to version control
- **Environment Files**: Keep `.env.local` secure and private
- **HTTPS**: Use HTTPS in production environments
- **Permissions**: Only grant necessary browser permissions

## 📞 Support

If you encounter any issues:

1. **Check the troubleshooting section** above
2. **Verify all prerequisites** are installed
3. **Ensure API keys** are correctly configured
4. **Check browser console** for error messages
5. **Try in incognito/private mode** to rule out extensions

## 🚀 Deployment Options

### Vercel (Recommended)
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- **Netlify**: Static site deployment
- **Railway**: Full-stack deployment
- **DigitalOcean**: VPS deployment
- **AWS**: Enterprise deployment

## 📈 Next Steps

After successful setup:

1. **Customize the location** for your region
2. **Test all features** to ensure proper functionality
3. **Configure auto-refresh** based on your needs
4. **Explore voice commands** in your preferred language
5. **Upload test images** for pest detection

## 🎯 Tips for Best Experience

- **Use a stable internet connection** for real-time features
- **Allow microphone access** for voice assistant
- **Keep the browser tab active** for auto-refresh to work
- **Use landscape mode** on mobile devices
- **Clear browser cache** if experiencing issues

---

**Congratulations!** 🎉 Your Smart Crop Advisory application is now ready to use. Enjoy exploring the AI-powered farming solutions!
\`\`\`

```json file="" isHidden
