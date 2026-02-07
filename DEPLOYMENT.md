# Deployment Guide - Smart Crop Advisory

## 🚀 Deployment Options

### 1. Vercel (Recommended)

Vercel is the easiest way to deploy your Next.js application:

#### Steps:
1. **Push to GitHub**:
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/smart-crop-advisory.git
   git push -u origin main
   \`\`\`

2. **Connect to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your repository

3. **Configure Environment Variables**:
   - In Vercel dashboard, go to Project Settings
   - Navigate to "Environment Variables"
   - Add your variables:
     \`\`\`
     OPENWEATHER_API_KEY=your_actual_api_key
     CLIMATEAPI=your_climate_api_key
     NEXT_PUBLIC_API_URL=https://your-app.vercel.app
     \`\`\`

4. **Deploy**:
   - Vercel will automatically build and deploy
   - Your app will be live at `https://your-app.vercel.app`

### 2. Netlify

#### Steps:
1. **Build the project**:
   \`\`\`bash
   npm run build
   npm run export
   \`\`\`

2. **Deploy to Netlify**:
   - Drag and drop the `out` folder to [netlify.com/drop](https://netlify.com/drop)
   - Or connect your GitHub repository

3. **Configure Environment Variables**:
   - In Netlify dashboard: Site Settings → Environment Variables
   - Add your API keys

### 3. Railway

#### Steps:
1. **Install Railway CLI**:
   \`\`\`bash
   npm install -g @railway/cli
   \`\`\`

2. **Login and Deploy**:
   \`\`\`bash
   railway login
   railway init
   railway up
   \`\`\`

3. **Add Environment Variables**:
   \`\`\`bash
   railway variables set OPENWEATHER_API_KEY=your_api_key
   \`\`\`

### 4. DigitalOcean App Platform

#### Steps:
1. **Create App**:
   - Go to DigitalOcean App Platform
   - Connect your GitHub repository

2. **Configure Build Settings**:
   - Build Command: `npm run build`
   - Run Command: `npm start`

3. **Set Environment Variables**:
   - Add your API keys in the app settings

## 🔧 Production Configuration

### Environment Variables for Production

\`\`\`env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-domain.com
OPENWEATHER_API_KEY=your_production_api_key
CLIMATEAPI=your_production_climate_key
\`\`\`

### Performance Optimizations

1. **Enable Compression**:
   \`\`\`javascript
   // next.config.js
   module.exports = {
     compress: true,
     poweredByHeader: false,
     generateEtags: false,
   }
   \`\`\`

2. **Image Optimization**:
   - Next.js automatically optimizes images
   - Use WebP format when possible

3. **Caching Strategy**:
   - API responses are cached for better performance
   - Static assets are cached by CDN

## 🔒 Security Considerations

### Production Security Checklist

- [ ] API keys are stored securely in environment variables
- [ ] HTTPS is enabled (automatic with Vercel/Netlify)
- [ ] Rate limiting is implemented for API endpoints
- [ ] File upload validation is in place
- [ ] CORS is properly configured
- [ ] Security headers are set

### Security Headers

Add to `next.config.js`:

\`\`\`javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}
\`\`\`

## 📊 Monitoring and Analytics

### Built-in Analytics

The app includes Vercel Analytics for:
- Page views
- User interactions
- Performance metrics
- Error tracking

### Custom Monitoring

Add monitoring services:
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **Google Analytics**: User behavior

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

\`\`\`yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test
      
    - name: Build application
      run: npm run build
      
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
\`\`\`

## 🌍 Domain Configuration

### Custom Domain Setup

1. **Purchase Domain**: From any domain registrar
2. **Configure DNS**: Point to your hosting provider
3. **SSL Certificate**: Automatically provided by most platforms

### Domain Examples
- `smartcrop.farm`
- `cropadvisory.in`
- `farmassist.ai`

## 📱 Mobile Optimization

The app is fully responsive and works on:
- iOS Safari
- Android Chrome
- Progressive Web App (PWA) ready

### PWA Configuration

Add to `public/manifest.json`:

\`\`\`json
{
  "name": "Smart Crop Advisory",
  "short_name": "CropAdvisory",
  "description": "AI-Powered Farming Solutions",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#22c55e",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
\`\`\`

## 🚨 Troubleshooting Deployment

### Common Issues

1. **Build Failures**:
   \`\`\`bash
   # Clear cache and rebuild
   rm -rf .next node_modules
   npm install
   npm run build
   \`\`\`

2. **Environment Variables Not Working**:
   - Ensure variables are set in deployment platform
   - Restart the application after adding variables
   - Check variable names match exactly

3. **API Endpoints Not Working**:
   - Verify API routes are in `pages/api` or `app/api`
   - Check CORS configuration
   - Validate API key permissions

### Performance Issues

1. **Slow Loading**:
   - Enable compression
   - Optimize images
   - Use CDN for static assets

2. **High Memory Usage**:
   - Implement proper caching
   - Optimize bundle size
   - Use dynamic imports

## 📞 Support

For deployment issues:
1. Check platform-specific documentation
2. Review build logs for errors
3. Test locally before deploying
4. Use staging environment for testing

---

**Your Smart Crop Advisory application is now ready for production deployment!** 🎉
