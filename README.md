# Cursor Vite App

A React application built with Vite, configured for deployment on Vercel.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

This project is configured for automatic deployment on Vercel from GitHub.

### Setup Instructions:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the Vite configuration
   - Click "Deploy"

### Configuration:
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Framework:** Vite
- **Install Command:** `npm install`

The project will automatically deploy on every push to the main branch.