import { PinData } from '../types';

// Helper to wait/sleep
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface ProxyConfig {
  url: (u: string) => string;
  type: 'json' | 'text';
}

// Ordered list of proxies to attempt fetching from.
// We mix JSON-wrapping proxies and raw proxies to maximize success rates.
const PROXIES: ProxyConfig[] = [
  { 
    url: (u: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(u)}&disableCache=${Date.now()}`, 
    type: 'json' 
  },
  { 
    url: (u: string) => `https://corsproxy.io/?${encodeURIComponent(u)}`, 
    type: 'text' 
  },
  {
    url: (u: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
    type: 'text'
  }
];

async function fetchWithRetry(targetUrl: string): Promise<string> {
  let lastError;
  
  for (const proxy of PROXIES) {
    try {
      const proxyUrl = proxy.url(targetUrl);
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
         throw new Error(`Proxy returned ${response.status}`);
      }

      let text = '';
      if (proxy.type === 'json') {
        const data = await response.json();
        text = data.contents;
        // AllOrigins returns status object inside sometimes for errors
        if (data.status && data.status.http_code && data.status.http_code >= 400) {
           throw new Error(`Target URL returned ${data.status.http_code}`);
        }
      } else {
        text = await response.text();
      }

      if (!text || text.length < 50) {
          throw new Error('Empty or invalid response content');
      }

      return text;
    } catch (e: any) {
      console.warn(`Proxy attempt failed for ${targetUrl}: ${e.message}`);
      lastError = e;
      await delay(300); // Brief pause before retry
      continue;
    }
  }
  
  throw new Error(lastError?.message || 'Unable to fetch content. Please check the URL or try again later.');
}

export const fetchPinData = async (pinUrl: string): Promise<Partial<PinData>> => {
  try {
    // Normalize URL to global domain to reduce regional redirection issues
    // e.g., in.pinterest.com -> www.pinterest.com
    let targetUrl = pinUrl;
    try {
        const u = new URL(pinUrl);
        // Force www if it's a country subdomain (approximate check)
        if (u.hostname.match(/^[a-z]{2}\.pinterest\.com$/)) {
             u.hostname = 'www.pinterest.com';
        }
        targetUrl = u.toString();
    } catch (e) {
        // Continue with original URL if parsing fails
    }

    // Basic URL validation
    if (!targetUrl.includes('pinterest.com') && !targetUrl.includes('pin.it')) {
      throw new Error('Invalid Pinterest URL');
    }

    const htmlContent = await fetchWithRetry(targetUrl);

    return parsePinterestHtml(htmlContent, targetUrl);

  } catch (error: any) {
    console.error("Fetch Pin Data Error:", error);
    throw new Error(error.message || 'Failed to fetch Pin data');
  }
};

function parsePinterestHtml(html: string, originalUrl: string): Partial<PinData> {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Strategy 1: Open Graph Meta Tags (Most reliable for public pins)
    const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
    const ogDescription = doc.querySelector('meta[property="og:description"]')?.getAttribute('content');
    const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content');
    const ogVideo = doc.querySelector('meta[property="og:video"]')?.getAttribute('content');
    const videoSecureUrl = doc.querySelector('meta[property="og:video:secure_url"]')?.getAttribute('content');
    
    // Strategy 2: JSON-LD Structured Data (Fallback)
    let jsonLdImage = null;
    let jsonLdDesc = null;
    let jsonLdVideo = null;

    try {
        const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
        scripts.forEach(script => {
            const content = script.textContent;
            if (content) {
                const json = JSON.parse(content);
                // Look for SocialMediaPosting, ImageObject, or VideoObject types
                const type = json['@type'];
                
                if (type === 'SocialMediaPosting' || type === 'ImageObject' || type === 'VideoObject') {
                    if (json.image) jsonLdImage = json.image;
                    if (json.articleBody) jsonLdDesc = json.articleBody;
                    if (json.description && !jsonLdDesc) jsonLdDesc = json.description;
                    
                    if (type === 'VideoObject' || json.contentUrl) {
                        jsonLdVideo = json.contentUrl;
                    }
                }
            }
        });
    } catch(e) {
        // Ignore JSON parse errors
    }

    // Determine Media URL
    let mediaUrl = videoSecureUrl || ogVideo || jsonLdVideo || ogImage || jsonLdImage;
    let mediaType: 'image' | 'video' | 'unknown' = 'unknown';

    if (mediaUrl) {
      // If it looks like a video or has video metadata
      if (ogVideo || videoSecureUrl || jsonLdVideo || mediaUrl.endsWith('.mp4') || mediaUrl.endsWith('.m3u8')) {
        mediaType = 'video';
      } else {
        mediaType = 'image';
        // Upgrade image quality to original if possible
        // Pattern: https://i.pinimg.com/236x/... -> https://i.pinimg.com/originals/...
        if (mediaUrl.includes('pinimg.com')) {
             mediaUrl = mediaUrl.replace(/\/\d+x\//, '/originals/');
        }
      }
    }

    // Strategy 3: Direct Video Tag fallback (rare but possible in some raw renders)
    if (!mediaUrl) {
      const videoTag = doc.querySelector('video');
      if (videoTag && videoTag.src) {
          mediaUrl = videoTag.src;
          mediaType = 'video';
      }
    }

    if (!mediaUrl) {
      throw new Error('Could not find media URL. The Pin might be private.');
    }

    return {
      originalUrl,
      mediaUrl,
      mediaType,
      description: ogDescription || jsonLdDesc || ogTitle || 'No description found',
    };
}

export const fetchMediaBlob = async (mediaUrl: string): Promise<Blob> => {
   // Try multiple proxies for the binary data
   const proxies = [
       (u: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
       (u: string) => `https://corsproxy.io/?${encodeURIComponent(u)}`
   ];

   for (const p of proxies) {
       try {
           const res = await fetch(p(mediaUrl));
           if (res.ok) {
               return await res.blob();
           }
       } catch (e) {
           continue;
       }
   }
   throw new Error('Failed to download media file. Please try the "Save" button again.');
}