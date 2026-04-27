import { Product, PredictionResult, EthicalInsight } from "../types";

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

  if (currentPrice < 40000) {
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

export async function getEthicalInsights(
  product: Product,
  platformName: string
): Promise<EthicalInsight> {
  const platform = product.platforms.find(p => p.name === platformName);

  if (!platform) throw new Error("Platform not found");

  let score = 7.0;

  if (platformName === "Amazon") score = 8.5;
  if (platformName === "Flipkart") score = 7.8;
  if (platformName === "Reliance Digital") score = 8.8;
  if (platformName === "Myntra") score = 6.5;

  if (product.category === "Electronics" && platformName === "Reliance Digital") score += 0.5;
  if (product.category === "Electronics" && platformName === "Myntra") score -= 1;

  score += (platform.sellerRating - 4) * 0.5;

  score = Math.min(10, Math.max(5, Number(score.toFixed(1))));

  return {
    score,
    pros: [
      "Trusted platform reputation",
      "Seller rating is good",
      "Secure payment support"
    ],
    cons: [
      "Dynamic pricing possible",
      "Delivery may vary by location"
    ],
    verdict:
      score >= 8.5
        ? "Highly reliable seller with strong customer trust."
        : score >= 7.5
        ? "Generally reliable with good buying confidence."
        : "Acceptable platform, compare before purchase."
  };
}