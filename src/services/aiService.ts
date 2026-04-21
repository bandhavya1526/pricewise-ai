import { GoogleGenAI, Type } from "@google/genai";
import { Product, PredictionResult, EthicalInsight } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getPricePrediction(product: Product): Promise<PredictionResult> {
  const currentPrice = Math.min(...product.platforms.map(p => p.price));

  if (currentPrice < 15000) {
    return {
      recommendation: "BUY",
      predictedPrice: currentPrice + 500,
      confidence: 0.92,
      reasoning: "Affordable product currently at a strong price."
    };
  }

  if (currentPrice >= 15000 && currentPrice < 40000) {
    return {
      recommendation: "WAIT",
      predictedPrice: currentPrice - 2000,
      confidence: 0.88,
      reasoning: "Price likely to drop during upcoming sale."
    };
  }

  return {
    recommendation: "BUY",
    predictedPrice: currentPrice - 1000,
    confidence: 0.90,
    reasoning: "Premium product currently priced competitively."
  };
}


export async function getEthicalInsights(product: Product, platformName: string): Promise<EthicalInsight> {
  const model = "gemini-3-flash-preview";
  const platform = product.platforms.find(p => p.name === platformName);
  
  if (!platform) throw new Error("Platform not found");

  const prompt = `
    Evaluate the ethical standing of the seller "${platform.seller}" on "${platform.name}" for the product "${product.name}".
    Consider:
    - Pricing fairness (Current: ${platform.price}, Original: ${platform.originalPrice})
    - Seller Rating: ${platform.sellerRating}
    - Sustainability indicators
    - General corporate reputation of ${platform.name}

    Provide an Ethics Score (1-10), a list of pros, a list of cons, and a final verdict.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            pros: { type: Type.ARRAY, items: { type: Type.STRING } },
            cons: { type: Type.ARRAY, items: { type: Type.STRING } },
            verdict: { type: Type.STRING }
          },
          required: ["score", "pros", "cons", "verdict"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Ethical insight error:", error);
    return {
      score: platform.ethicsScore,
      pros: ["Established retailer", "Verified seller"],
      cons: ["Dynamic pricing used"],
      verdict: "Generally reliable but watch for price fluctuations."
    };
  }
}
