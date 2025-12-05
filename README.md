<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# PinFlow - AI Pinterest Downloader

Download Pinterest images and videos with AI-powered caption and hashtag generation.

View your app in AI Studio: https://ai.studio/apps/drive/1X3eeh9Dyg3W2xKJuEJ6xCQFs2JuZwoL-

## Features

- 📥 Download Pinterest images and videos in high quality
- 🔄 Batch processing - download multiple pins at once
- 🤖 AI-powered caption and hashtag generation using Gemini 2.5 Flash Lite
- 🎨 Modern, responsive UI with smooth animations
- ⚡ Fast and efficient with CORS proxy fallbacks

## Run Locally

**Prerequisites:** Node.js (v16 or higher)

### Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up your Gemini API Key:**
   
   a. Copy the example environment file:
   ```bash
   copy .env.example .env.local
   ```
   
   b. Get your API key from [Google AI Studio](https://aistudio.google.com/apikey)
   
   c. Open `.env.local` and replace `your_api_key_here` with your actual API key:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## Usage

1. **Single Link Mode:** Paste a single Pinterest URL and click "Download Media"
2. **Batch Mode:** Paste multiple Pinterest URLs (one per line) for bulk downloads
3. **AI Analysis:** For images, click "Generate AI Tags & Caption" to get AI-powered metadata

## How It Works

- Uses multiple CORS proxy services to fetch Pinterest content
- Extracts media URLs from Open Graph meta tags and JSON-LD structured data
- Upgrades image quality to original resolution when possible
- Leverages Gemini AI for intelligent image analysis and social media optimization

## Important Notes

- This tool is for personal use only
- Please respect Pinterest's terms of service and copyright policies
- Some pins may be private and cannot be downloaded
- AI features require a valid Gemini API key

## Tech Stack

- **Frontend:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **AI:** Google Gemini 2.5 Flash Lite
- **Deployment:** Ready for static hosting

---

© 2025 PinFlow. Not affiliated with Pinterest.
