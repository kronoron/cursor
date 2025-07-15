# Cursor Vite App

A React application built with Vite, optimized for seamless deployment and re-deployment.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deployment Options

### Option 1: Automated Vercel Deployment
```bash
# Production deployment
npm run deploy:vercel

# Preview deployment
npm run deploy:preview
```

### Option 2: Manual Build & Preview
```bash
# Build and preview locally before deployment
npm run deploy
```

### Option 3: Clean Re-deployment
```bash
# Clean previous build and deploy fresh
npm run clean
npm run build
```

## Vercel Configuration

This project is configured for deployment on Vercel with:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18.x
- **Framework**: Vite

## Deployment Features

- ✅ Automated build cleaning before each deployment
- ✅ Build success confirmation
- ✅ Local preview capabilities
- ✅ Multiple deployment environments (production/preview)
- ✅ Optimized Vite configuration for production builds

## Re-deployment Process

1. **Clean previous build**: `npm run clean`
2. **Install dependencies**: `npm install`
3. **Build application**: `npm run build`
4. **Deploy to Vercel**: `npm run deploy:vercel`

The combined deployment process ensures reliable and consistent deployments every time.