export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  images: string[];
  description: string;
  rating: number;
  reviewCount: number;
  specifications: Record<string, string>;
  platforms: PlatformPrice[];
  historicalData: PricePoint[];
  stockStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
}

export interface PlatformPrice {
  name: string;
  price: number;
  originalPrice: number;
  url: string;
  seller: string;
  sellerRating: number;
  ethicsScore: number;
  sustainabilityRating: number;
  deliveryDays: number;
  isPrime: boolean;
}
// ... rest of the types remain same
export interface PricePoint {
  date: string;
  price: number;
}

export interface PredictionResult {
  recommendation: 'BUY' | 'WAIT';
  predictedPrice: number;
  confidence: number;
  reasoning: string;
}

export interface EthicalInsight {
  score: number;
  pros: string[];
  cons: string[];
  verdict: string;
}
