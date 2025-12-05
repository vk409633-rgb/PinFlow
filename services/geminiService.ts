import { GoogleGenAI, Type } from "@google/genai";

// Using the requested lite model for low latency
const MODEL_NAME = 'gemini-2.5-flash-lite-02-05'; 
// Fallback if strict validation fails, but user asked for lite.
// Ideally, we respect the instruction mapping if standard aliases are used, 
// but 'gemini-2.5-flash-lite' is a specific version request.

export const analyzeImage = async (imageBlob: Blob): Promise<{ title: string; caption: string; hashtags: string[] }> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key not found");

    const ai = new GoogleGenAI({ apiKey });

    // Convert Blob to Base64
    const base64Data = await blobToBase64(imageBlob);

    const prompt = "Analyze this image. Provide a creative 3-5 word title, a short engaging caption (max 20 words), and 5 relevant hashtags.";

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: imageBlob.type,
              data: base64Data
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            caption: { type: Type.STRING },
            hashtags: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["title", "caption", "hashtags"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Return fallback data to not break UI
    return {
      title: "Analysis Failed",
      caption: "Could not generate AI insights for this image.",
      hashtags: []
    };
  }
};

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove data url prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
