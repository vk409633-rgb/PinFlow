# ✅ PinFlow Quick Start Checklist

Follow these steps in order to get PinFlow working:

## Prerequisites
- [ ] Node.js installed (v16 or higher)
- [ ] Terminal/Command Prompt access

## Setup Steps

### 1️⃣ Install Dependencies
```bash
npm install
```
**Expected result:** "added X packages" message

---

### 2️⃣ Create Environment File
```bash
copy .env.example .env.local
```
(On Mac/Linux: `cp .env.example .env.local`)

**Expected result:** `.env.local` file created

---

### 3️⃣ Get Gemini API Key
1. [ ] Go to https://aistudio.google.com/apikey
2. [ ] Sign in with Google account
3. [ ] Click "Create API Key"
4. [ ] Copy the key

---

### 4️⃣ Add API Key to .env.local
1. [ ] Open `.env.local` in a text editor
2. [ ] Replace `your_api_key_here` with your actual API key
3. [ ] Save the file

**Should look like:**
```
VITE_GEMINI_API_KEY=AIzaSyAbc123def456...
```

---

### 5️⃣ Start Development Server
```bash
npm run dev
```
**Expected result:** 
```
VITE ready in XXX ms
➜  Local:   http://localhost:3000/
```

---

### 6️⃣ Open in Browser
1. [ ] Open browser
2. [ ] Go to `http://localhost:3000`
3. [ ] You should see the PinFlow interface

---

## ✅ Verification Tests

### Test 1: Basic Load
- [ ] Page loads without errors
- [ ] You see "PinFlow" header
- [ ] Input area is visible
- [ ] No error messages in browser console (F12)

### Test 2: Download a Pin
1. [ ] Find a Pinterest URL (e.g., https://www.pinterest.com/pin/123456/)
2. [ ] Paste it into the input
3. [ ] Click "Download Media"
4. [ ] Image/video card appears
5. [ ] Hover over card and click "Save" button
6. [ ] File downloads successfully

### Test 3: AI Analysis (Optional - requires API key)
1. [ ] Download an image pin
2. [ ] Click "Generate AI Tags & Caption"
3. [ ] AI-generated title, caption, and hashtags appear

### Test 4: Batch Mode
1. [ ] Click "Batch Mode" tab
2. [ ] Paste multiple Pinterest URLs (one per line)
3. [ ] Click "Download Media"
4. [ ] Multiple cards appear with loading states
5. [ ] All pins load successfully

---

## 🔧 Troubleshooting

### App doesn't load / blank page
- ✅ **Fixed!** Make sure `index.html` has the script tag (already fixed)
- Check browser console for errors (F12)

### "API Key not found" error
- Make sure `.env.local` exists (not `.env.example`)
- Verify API key is correct
- Restart dev server: Stop (Ctrl+C) and run `npm run dev` again

### "Failed to fetch Pinterest data"
- Pin might be private or deleted
- Try a different Pinterest URL
- Check internet connection

### TypeScript errors
- ✅ **Fixed!** `vite-env.d.ts` should exist (already created)
- Run `npm install` again if needed

---

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ App loads at localhost:3000
- ✅ No console errors
- ✅ Can paste Pinterest URLs
- ✅ Download button appears on hover
- ✅ Files download successfully
- ✅ AI analysis works (if API key configured)

---

## 📝 Notes

- **AI features require API key** - Without it, you can still download pins
- **Some pins may fail** - Private or deleted pins won't work
- **CORS proxies** - The app uses multiple fallback proxies for reliability
- **No data stored** - Everything happens in your browser

---

## 🚀 Ready to Use!

If all checkboxes are checked, you're ready to start downloading Pinterest content!

**Need more help?** Check `SETUP_GUIDE.md` for detailed instructions.
