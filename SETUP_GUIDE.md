# PinFlow Setup Guide

## Quick Start

Follow these steps to get PinFlow running on your local machine:

### Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required packages including React, Vite, TypeScript, and the Gemini AI SDK.

### Step 2: Configure Your API Key

1. **Copy the environment template:**
   ```bash
   copy .env.example .env.local
   ```
   
   On Mac/Linux, use:
   ```bash
   cp .env.example .env.local
   ```

2. **Get your Gemini API key:**
   - Visit [Google AI Studio](https://aistudio.google.com/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the generated key

3. **Add your API key:**
   - Open the `.env.local` file in a text editor
   - Replace `your_api_key_here` with your actual API key
   - Save the file

   Example:
   ```
   VITE_GEMINI_API_KEY=AIzaSyAbc123def456ghi789jkl012mno345pqr678
   ```

### Step 3: Start the Development Server

```bash
npm run dev
```

The app will start at `http://localhost:3000`

### Step 4: Test the Application

1. Open your browser and go to `http://localhost:3000`
2. You should see the PinFlow interface
3. Try downloading a Pinterest image or video:
   - Find a Pinterest pin (e.g., https://www.pinterest.com/pin/123456789/)
   - Copy the URL
   - Paste it into PinFlow
   - Click "Download Media"

## Features Overview

### 1. Single Link Download
- Paste one Pinterest URL
- Click "Download Media"
- The image/video will be fetched and ready to download

### 2. Batch Download
- Switch to "Batch Mode"
- Paste multiple URLs (one per line)
- All pins will be processed simultaneously
- Each result appears as a card with download button

### 3. AI Caption & Hashtag Generation
- For images only
- Click "Generate AI Tags & Caption" on any image card
- Gemini AI will analyze the image and provide:
  - A creative title
  - An engaging caption
  - 5 relevant hashtags

## Troubleshooting

### "API Key not found" Error
- Make sure you created `.env.local` (not `.env.example`)
- Verify your API key is correctly pasted
- Restart the dev server after adding the API key

### "Failed to fetch Pinterest data" Error
- The pin might be private or deleted
- Try a different Pinterest URL
- Check your internet connection
- Some pins may be region-restricted

### Images/Videos Not Loading
- This is usually due to CORS restrictions
- The app tries multiple proxy services automatically
- If all fail, the pin might not be publicly accessible

### TypeScript Errors
- Run `npm install` again to ensure all dependencies are installed
- Make sure `vite-env.d.ts` exists in the project root
- Restart your code editor

## Building for Production

To create a production build:

```bash
npm run build
```

The optimized files will be in the `dist` folder, ready to deploy to any static hosting service (Vercel, Netlify, GitHub Pages, etc.).

To preview the production build locally:

```bash
npm run preview
```

## Tech Details

- **React 19** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **Tailwind CSS** via CDN for styling
- **Gemini 2.5 Flash Lite** for AI analysis
- **Multiple CORS proxies** for reliable Pinterest content fetching

## Privacy & Legal

- All processing happens in your browser
- No data is stored on any server
- Your API key is only used locally
- Respect Pinterest's terms of service
- Only download content you have rights to use

## Need Help?

If you encounter any issues:
1. Check the browser console for error messages (F12)
2. Verify all setup steps were completed
3. Try with a different Pinterest URL
4. Restart the development server

---

Happy downloading! 🎉
