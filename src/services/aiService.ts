import { Product, PredictionResult, EthicalInsight } from "../types";

export async function getPricePrediction(product: Product): Promise<PredictionResult> {
  const bestPlatform = product.platforms.reduce((best, p) => {
    const score = (p.ethicsScore * 10) - (p.price / 10000);
    const bestScore = (best.ethicsScore * 10) - (best.price / 10000);

    return score > bestScore ? p : best;
  });

  const score = (bestPlatform.ethicsScore * 10) - (bestPlatform.price / 10000);

  if (score >= 75) {
    return {
      recommendation: "BUY",
      predictedPrice: bestPlatform.price - 500,
      confidence: 0.94,
      reasoning: `${bestPlatform.name} offers strong ethics and competitive pricing.`
    };
  }

  return {
    recommendation: "WAIT",
    predictedPrice: bestPlatform.price - 1500,
    confidence: 0.88,
    reasoning: `Better deals may arrive soon. Current best option is ${bestPlatform.name}.`
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