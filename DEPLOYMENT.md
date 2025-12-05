# Deployment Configuration

## ✅ Root Path Configuration

This project is configured to be served from the **root path (`/`)**.

### Vite Configuration

The `vite.config.ts` is set with:
```typescript
base: '/'
```

This ensures:
- ✅ All assets are referenced from the root
- ✅ Works with GitHub Pages, Vercel, Netlify, etc.
- ✅ No subdirectory path issues

---

## File Structure

All main files are in the **project root**:

```
PinFlow/
├── index.html          ← Entry point (root)
├── index.tsx           ← React app entry
├── App.tsx             ← Main component
├── package.json        ← Dependencies
├── vite.config.ts      ← Build config (base: '/')
├── .env.example        ← Environment template
├── components/         ← React components
├── services/           ← API services
└── dist/               ← Build output (after npm run build)
```

---

## Deployment Options

### 1. **Vercel** (Recommended)
```bash
npm run build
vercel --prod
```
- Auto-detects Vite
- Zero configuration needed
- Base path `/` works automatically

### 2. **Netlify**
```bash
npm run build
netlify deploy --prod --dir=dist
```
- Build command: `npm run build`
- Publish directory: `dist`
- Base path `/` works automatically

### 3. **GitHub Pages**

**Option A: Using `gh-pages` branch**
```bash
npm run build
# Push dist folder to gh-pages branch
```

**Option B: Using GitHub Actions**
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Build
        run: npm run build
        env:
          VITE_GEMINI_API_KEY: ${{ secrets.VITE_GEMINI_API_KEY }}
        
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

**Important for GitHub Pages:**
- Go to Settings → Pages
- Set source to `gh-pages` branch
- Set path to `/` (root)

### 4. **Static Hosting (Any Provider)**
```bash
npm run build
```
Upload the `dist/` folder contents to your hosting provider's root directory.

---

## Build Output

After running `npm run build`, the `dist/` folder will contain:

```
dist/
├── index.html          ← Entry point
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [other assets]
└── [other files]
```

All asset paths in `index.html` will be **absolute from root** (`/assets/...`), not relative.

---

## Environment Variables for Production

When deploying, set the environment variable:

**Variable Name:** `VITE_GEMINI_API_KEY`  
**Value:** Your Gemini API key from https://aistudio.google.com/apikey

### How to set in different platforms:

**Vercel:**
```bash
vercel env add VITE_GEMINI_API_KEY
```
Or via dashboard: Settings → Environment Variables

**Netlify:**
```bash
netlify env:set VITE_GEMINI_API_KEY "your-key-here"
```
Or via dashboard: Site Settings → Environment Variables

**GitHub Actions:**
- Go to Settings → Secrets and variables → Actions
- Add secret: `VITE_GEMINI_API_KEY`

---

## Verification Checklist

Before deploying, verify:

- [x] `vite.config.ts` has `base: '/'`
- [x] `index.html` is in project root
- [x] `index.tsx` is in project root
- [x] Build succeeds: `npm run build`
- [x] Preview works: `npm run preview`
- [x] Environment variable is set for production

---

## Testing Production Build Locally

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

The preview server will run at `http://localhost:4173` (or similar).

Test:
1. ✅ Page loads correctly
2. ✅ All assets load (no 404s)
3. ✅ Pinterest download works
4. ✅ AI features work (if API key is set)

---

## Troubleshooting Deployment

### Assets not loading (404 errors)
- ✅ **Fixed!** `base: '/'` is set in `vite.config.ts`
- Ensure you're deploying the `dist/` folder contents, not the folder itself

### Blank page after deployment
- Check browser console for errors
- Verify `index.html` is in the root of deployed files
- Check if environment variables are set

### API key not working
- Environment variable must be prefixed with `VITE_`
- Must be set before build time (not runtime)
- Rebuild after setting environment variables

---

## Current Status

✅ **Base path is set to `/` (root)**  
✅ **All files are in project root**  
✅ **Ready for deployment to any platform**  

The project is correctly configured for root path deployment! 🚀
