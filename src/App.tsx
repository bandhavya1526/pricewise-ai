/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */


import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  ChevronLeft,
  Info,
  ShoppingBag,
  Scale,
  Star,
  Heart,
  ShoppingCart,
  User,
  Truck,
  CheckCircle2,
  BarChart3,
  ChevronRight,
  Filter,
  ArrowUpDown,
  Smartphone,
  Headphones,
  Laptop,
  Footprints
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
//import { MOCK_PRODUCTS } from './mockData';
import { Product, PredictionResult, EthicalInsight, PlatformPrice } from './types';
import { getPricePrediction, getEthicalInsights } from './services/aiService';
import { cn } from './lib/utils';
import samsungBook from "./images/samsung-book.jpg";
import jblSpeaker from "./images/jbl-speaker.jpg";
import noiseWatch from "./images/noise-watch.jpg";
import dellLaptop from "./images/dell-laptop.jpg";
import philipsPowerbank from "./images/philips-powerbank.jpg";
import miPowerbank from "./images/mi-powerbank.jpg";
import sonyTv from "./images/sony-tv.jpg";
import lgFridge from "./images/lg-fridge.jpg";
import whirlpoolFridge from "./images/whirlpool-fridge.jpg";
import macbookAir from "./images/macbook-air.jpg";
const getProductImage = (name: string) => {
  const product = name.toLowerCase();

  if (product.includes("samsung galaxy book")) return samsungBook;
  if (product.includes("jbl")) return jblSpeaker;
  if (product.includes("noise")) return noiseWatch;
  if (product.includes("dell")) return dellLaptop;
  if (product.includes("philips")) return philipsPowerbank;
  if (product.includes("mi power")) return miPowerbank;
  if (product.includes("sony bravia")) return sonyTv;
  if (product.includes("lg")) return lgFridge;
  if (product.includes("whirlpool")) return whirlpoolFridge;
  if (product.includes("macbook")) return macbookAir;

  return dellLaptop;
};
export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [ethicalInsight, setEthicalInsight] = useState<EthicalInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
  fetch("https://pricewise-ai-ngu5.onrender.com")
    .then((res) => res.json())
    .then((data) => {
      const grouped: any = {};

      data.forEach((item: any) => {
        const name = item.Product_Name;

        if (!grouped[name]) {
          grouped[name] = {
            id: item.Product_ID.toString(),
            name: item.Product_Name,
            brand: item.Product_Name.split(" ")[0],
            category: "Electronics",
            rating: item.Rating,
            reviewCount: 1000,
            image: getProductImage(item.Product_Name),
            images: [
              getProductImage(item.Product_Name),
              getProductImage(item.Product_Name)
            ],
            description: item.Product_Name,
            stockStatus: "IN_STOCK",
            specifications: {
              Brand: item.Product_Name.split(" ")[0]
            },
            platforms: [],
            historicalData: [
              { date: "Day1", price: item.Current_Price + 1000 },
              { date: "Day2", price: item.Current_Price + 500 },
              { date: "Day3", price: item.Current_Price }
            ]
          };
        }
        if (
  item.Platform === "Myntra" &&
  (
    item.Product_Name.toLowerCase().includes("book") ||
    item.Product_Name.toLowerCase().includes("macbook") ||
    item.Product_Name.toLowerCase().includes("laptop") ||
    item.Product_Name.toLowerCase().includes("tv") ||
    item.Product_Name.toLowerCase().includes("fridge")
  )
) {
  return;
}
        if (!grouped[name].platforms.some((p:any) => p.name === item.Platform)) {
  grouped[name].platforms.push({
          name: item.Platform,
          price: item.Current_Price,
          originalPrice: item.Current_Price + 3000,
          seller: item.Platform,
          sellerRating: item.Rating,
          deliveryDays: 2,
          ethicsScore: 8,
          isPrime: false,
          url:
            item.Platform === "Amazon"
              ? `https://www.amazon.in/s?k=${encodeURIComponent(item.Product_Name)}`
              : item.Platform === "Flipkart"
              ? `https://www.flipkart.com/search?q=${encodeURIComponent(item.Product_Name)}`
              : item.Platform === "Myntra"
              ? `https://www.myntra.com/${encodeURIComponent(item.Product_Name)}`
              : item.Platform === "Reliance Digital"
              ?  `https://www.google.com/search?q=Reliance+Digital+${encodeURIComponent(item.Product_Name)}`
              : "https://www.google.com"
        });}
      });
    
      setProducts(
  Object.values(grouped).filter(
    (product: any) => product.platforms.length > 0
  )
);
    })
    .catch((error) => console.error("Fetch error:", error));
}, []);
  const categories = [
    { name: 'Electronics', icon: Smartphone, color: 'bg-blue-500' },
    { name: 'Audio', icon: Headphones, color: 'bg-purple-500' },
    { name: 'Computers', icon: Laptop, color: 'bg-indigo-500' },
    { name: 'Footwear', icon: Footprints, color: 'bg-emerald-500' },
    { name: 'Fashion', icon: ShoppingBag, color: 'bg-pink-500' },
    { name: 'Quick Commerce', icon: Truck, color: 'bg-orange-500' },
  ];

const filteredProducts = useMemo(() => {
  return products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      !selectedCategory || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });
}, [products, searchTerm, selectedCategory]);

  const handleProductSelect = async (product: Product) => {
    setSelectedProduct(product);
    setLoading(true);
    setSelectedPlatform(product.platforms[0].name);
    setActiveImage(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    try {
      const [pred, ethics] = await Promise.all([
        getPricePrediction(product),
        getEthicalInsights(product, product.platforms[0].name)
      ]);
      setPrediction(pred);
      setEthicalInsight(ethics);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleWatchlist = (id: string) => {
    setWatchlist(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handlePlatformChange = async (platformName: string) => {
    if (!selectedProduct) return;
    setSelectedPlatform(platformName);
    setLoading(true);
    try {
      const ethics = await getEthicalInsights(selectedProduct, platformName);
      setEthicalInsight(ethics);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isFakeDiscount = (platform: PlatformPrice, historicalData: any[]) => {
    const avgPrice = historicalData.reduce((acc, curr) => acc + curr.price, 0) / historicalData.length;
    return platform.price > avgPrice && platform.price < platform.originalPrice;
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-white">
      {/* Top Banner */}
      <div className="bg-[#1A1A1A] text-white py-2 px-6 text-[10px] font-bold uppercase tracking-[0.2em] text-center">
        Free priority shipping on all AI-verified ethical sellers
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-black/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-8">

          <div className="flex-1 max-w-xl relative group hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-black transition-colors" size={16} />
            <input 
              type="text"
              placeholder="Search for products, brands or ethical scores..."
              className="w-full pl-12 pr-4 py-3 bg-black/5 border-none rounded-2xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-5">
            <button className="relative p-2 hover:bg-black/5 rounded-full transition-colors">
              <Heart size={20} />
              {watchlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-black text-white text-[8px] font-bold flex items-center justify-center rounded-full">
                  {watchlist.length}
                </span>
              )}
            </button>
            <button className="p-2 hover:bg-black/5 rounded-full transition-colors hidden sm:block">
              <ShoppingCart size={20} />
            </button>
           
            
          </div>
        </div>

       
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {!selectedProduct ? (
            <motion.div 
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-16"
            >
              {/* Hero Section */}
              <section className="relative h-[500px] rounded-[40px] overflow-hidden bg-[#1A1A1A] text-white p-12 flex flex-col justify-center">
                <div className="absolute inset-0 opacity-40">
                  <img src="https://picsum.photos/seed/tech-hero/1920/1080" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="relative z-10 max-w-2xl space-y-8">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    <BarChart3 size={14} /> AI-Powered Market Intelligence
                  </div>
                  <h2 className="text-6xl font-serif font-black leading-[1.1]">
                    The Future of <br /> <span className="italic text-white/60">Conscious Shopping.</span>
                  </h2>
                  <p className="text-lg text-white/60 font-medium">
                    We analyze millions of data points to predict price drops and verify seller ethics, so you can shop with confidence.
                  </p>                 
                </div>
              </section>                                 
              {/* Product Grid */}
              <section className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-serif font-black">
                      {selectedCategory ? `${selectedCategory} Intelligence` : 'Featured Intelligence'}
                    </h3>
                    <p className="text-sm text-black/40 font-medium">
                      {selectedCategory ? `Showing best ${selectedCategory.toLowerCase()} deals` : 'Hand-picked products with high prediction accuracy'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                  
                    <button className="p-3 border border-black/5 rounded-2xl hover:bg-black/5 transition-colors">
                      <Filter size={18} />
                    </button>
                    <button className="p-3 border border-black/5 rounded-2xl hover:bg-black/5 transition-colors">
                      <ArrowUpDown size={18} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredProducts.map((product) => {
                    const bestPrice =
  product.platforms.length > 0
    ? Math.min(...product.platforms.map(p => p.price))
    : 0;
                    const isWatched = watchlist.includes(product.id);
                    return (
                      <motion.div 
                        key={product.id}
                        whileHover={{ y: -8 }}
                        className="bg-white rounded-[32px] overflow-hidden border border-black/5 shadow-sm hover:shadow-2xl transition-all group flex flex-col"
                      >
                        <div className="aspect-[4/5] relative overflow-hidden bg-[#F8F9FA] cursor-pointer" onClick={() => handleProductSelect(product)}>
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            referrerPolicy="no-referrer"
                          />
                          <button 
                            className={cn(
                              "absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all",
                              isWatched ? "bg-black text-white" : "bg-white/80 text-black hover:bg-white"
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWatchlist(product.id);
                            }}
                          >
                            <Heart size={18} fill={isWatched ? "currentColor" : "none"} />
                          </button>
                          {product.stockStatus === 'LOW_STOCK' && (
                            <div className="absolute bottom-5 left-5 bg-amber-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                              Low Stock
                            </div>
                          )}
                          <div className="absolute bottom-5 right-5 bg-black/80 backdrop-blur text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                            {product.category}
                          </div>
                        </div>
                        <div className="p-6 space-y-4 flex-1 flex flex-col">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] font-black uppercase tracking-widest text-black/30">{product.brand}</p>
                              <div className="flex items-center gap-1 text-amber-500">
                                <Star size={12} fill="currentColor" />
                                <span className="text-[10px] font-bold text-black">{product.rating}</span>
                              </div>
                            </div>
                            <h4 className="text-lg font-serif font-black leading-tight group-hover:text-black/60 transition-colors cursor-pointer" onClick={() => handleProductSelect(product)}>
                              {product.name}
                            </h4>
                          </div>
                          <div className="flex items-end justify-between pt-4 border-t border-black/5">
                            <div>
                              <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest">Best Price</p>
                              <p className="text-xl font-black">₹{bestPrice.toLocaleString()}</p>
                            </div>
                            <button 
                              onClick={() => handleProductSelect(product)}
                              className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center hover:scale-110 transition-transform"
                            >
                              <ArrowRight size={18} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div 
              key="detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Breadcrumbs */}
              <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black/30">
                <button onClick={() => setSelectedProduct(null)} className="hover:text-black transition-colors">Home</button>
                <ChevronRight size={12} />
                <span className="hover:text-black transition-colors">{selectedProduct.category}</span>
                <ChevronRight size={12} />
                <span className="text-black">{selectedProduct.name}</span>
              </nav>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Image Gallery */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="aspect-square rounded-[40px] overflow-hidden bg-white border border-black/5 shadow-sm">
                    <img 
                      src={selectedProduct.images[activeImage] || selectedProduct.image} 
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {[selectedProduct.image, ...selectedProduct.images].map((img, i) => (
                      <button 
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={cn(
                          "w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0",
                          activeImage === i ? "border-black scale-95" : "border-transparent opacity-60 hover:opacity-100"
                        )}
                      >
                        <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>

                  {/* Detailed Specs */}
                  <div className="bg-white p-10 rounded-[40px] border border-black/5 shadow-sm space-y-8">
                    <h5 className="text-xl font-serif font-black">Technical Specifications</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                        <div key={key} className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-black/30">{key}</p>
                          <p className="text-sm font-bold">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Product Info & AI Insights */}
                <div className="lg:col-span-5 space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-black/30">{selectedProduct.brand}</p>
                        <div className="flex items-center gap-1 text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < Math.floor(selectedProduct.rating) ? "currentColor" : "none"} />
                          ))}
                          <span className="text-xs font-bold text-black ml-1">{selectedProduct.rating} ({selectedProduct.reviewCount.toLocaleString()} reviews)</span>
                        </div>
                      </div>
                      <h2 className="text-4xl font-serif font-black leading-tight">{selectedProduct.name}</h2>
                      <p className="text-sm text-black/50 leading-relaxed font-medium">
                        {selectedProduct.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle2 size={14} /> {selectedProduct.stockStatus.replace('_', ' ')}
                      </div>
                      <div className="px-4 py-2 bg-black/5 text-black/60 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Truck size={14} /> Free Delivery
                      </div>
                    </div>
                  </div>

                  {/* AI Prediction Section */}
                  <div className="bg-[#1A1A1A] text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                    
                    <div className="relative z-10 space-y-8">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                            <BarChart3 size={16} />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Market Prediction</span>
                        </div>
                        <div className="bg-white/10 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                          High Accuracy
                        </div>
                      </div>

                      {loading ? (
                        <div className="py-12 flex flex-col items-center gap-4">
                          <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          <p className="text-xs font-bold uppercase tracking-widest opacity-40 animate-pulse">Processing Market Data...</p>
                        </div>
                      ) : prediction ? (
                        <div className="space-y-8">
                          <div className="flex items-center gap-6">
                            <div className={cn(
                              "w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg",
                              prediction.recommendation === 'BUY' ? "bg-emerald-500" : "bg-amber-500"
                            )}>
                              {prediction.recommendation === 'BUY' ? <TrendingDown size={40} /> : <TrendingUp size={40} />}
                            </div>
                            <div>
                              <h4 className="text-4xl font-serif font-black">
                                {prediction.recommendation === 'BUY' ? 'Buy Now' : 'Wait'}
                              </h4>
                              <p className="text-sm font-bold opacity-60 uppercase tracking-widest">
                                Target: ₹{prediction.predictedPrice.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm leading-relaxed opacity-80 font-medium italic">
                            "{prediction.reasoning}"
                          </p>
                          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">AI Confidence</span>
                            <div className="flex items-center gap-3">
                              <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${prediction.confidence * 100}%` }}
                                  transition={{ duration: 1.5, ease: "easeOut" }}
                                  className="h-full bg-white" 
                                />
                              </div>
                              <span className="text-xs font-black">{(prediction.confidence * 100).toFixed(0)}%</span>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Platform Comparison */}
                  <div className="bg-white p-8 rounded-[40px] border border-black/5 shadow-sm space-y-8">
                    <h5 className="text-xl font-serif font-black">Platform Comparison</h5>
                    <div className="space-y-4">
                      {selectedProduct.platforms.map((p) => (
                        <div 
                          key={p.name}
                          onClick={() => handlePlatformChange(p.name)}
                          className={cn(
                            "p-6 rounded-3xl border-2 transition-all cursor-pointer group relative overflow-hidden",
                            selectedPlatform === p.name 
                              ? "border-black bg-black/5" 
                              : "border-black/5 hover:border-black/20"
                          )}
                        >
                          <div className="flex items-center justify-between relative z-10">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-black">{p.name}</span>
                                {p.isPrime && (
                                  <span className="bg-blue-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Prime</span>
                                )}
                              </div>
                              <p className="text-[10px] font-bold text-black/40">Seller: {p.seller} • {p.sellerRating}★</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-black">₹{p.price.toLocaleString()}</p>
                              <p className="text-[10px] font-bold text-black/30 line-through">₹{p.originalPrice.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="mt-4 flex items-center justify-between text-[9px] font-black uppercase tracking-widest relative z-10">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1 text-emerald-600">
                                <Truck size={12} /> {p.deliveryDays === 1 ? 'Tomorrow' : `In ${p.deliveryDays} days`}
                              </span>
                              <span className="flex items-center gap-1 text-black/40">
                                <ShieldCheck size={12} /> Ethical Score: {p.ethicsScore}/10
                              </span>
                            </div>
                            <ArrowRight size={14} className={cn(
                              "transition-transform",
                              selectedPlatform === p.name ? "translate-x-0" : "translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                            )} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ethical Insight Card */}
                  <AnimatePresence mode="wait">
                    {ethicalInsight && (
                      <motion.div 
                        key={selectedPlatform}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-8 rounded-[40px] border border-black/5 shadow-sm space-y-8"
                      >
                        <div className="flex items-center justify-between">
                          <h5 className="text-xl font-serif font-black">Ethical Audit</h5>
                          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <ShieldCheck size={24} />
                          </div>
                        </div>

                        <div className="space-y-8">
                          <div className="flex items-center gap-8">
                            <div className="relative w-24 h-24">
                              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="16" fill="none" className="stroke-black/5" strokeWidth="3" />
                                <motion.circle 
                                  cx="18" cy="18" r="16" fill="none" 
                                  className="stroke-black" 
                                  strokeWidth="3" 
                                  strokeDasharray="100 100"
                                  initial={{ strokeDashoffset: 100 }}
                                  animate={{ strokeDashoffset: 100 - (ethicalInsight.score * 10) }}
                                  transition={{ duration: 1.5, ease: "easeOut" }}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-3xl font-black">{ethicalInsight.score}</span>
                              </div>
                            </div>
                            <div className="flex-1 space-y-2">
                              <p className="text-[10px] font-black uppercase tracking-widest text-black/30">Sustainability Verdict</p>
                              <p className="text-sm font-bold leading-tight">{ethicalInsight.verdict}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Positive Indicators</p>
                              <ul className="space-y-3">
                                {ethicalInsight.pros.map((pro, i) => (
                                  <li key={i} className="text-xs font-bold flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                    {pro}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="space-y-4">
                              <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">Risk Factors</p>
                              <ul className="space-y-3">
                                {ethicalInsight.cons.map((con, i) => (
                                  <li key={i} className="text-xs font-bold flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                    {con}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        const platform = selectedProduct.platforms.find(p => p.name === selectedPlatform);
                        if (platform?.url) window.open(platform.url, '_blank');
                      }}
                      className="flex-1 bg-black text-white py-5 rounded-3xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10 group"
                    >
                      <ShoppingBag size={18} />
                      Purchase on {selectedPlatform}
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={() => toggleWatchlist(selectedProduct.id)}
                      className={cn(
                        "w-20 rounded-3xl flex items-center justify-center transition-all border-2",
                        watchlist.includes(selectedProduct.id) 
                          ? "bg-black border-black text-white" 
                          : "bg-white border-black/5 text-black hover:border-black/20"
                      )}
                    >
                      <Heart size={24} fill={watchlist.includes(selectedProduct.id) ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Price History Chart (Moved to bottom for better flow) */}
              <div className="bg-white p-12 rounded-[40px] border border-black/5 shadow-sm space-y-10">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-serif font-black">Market Volatility Index</h3>
                    <p className="text-sm text-black/40 font-medium">Historical price movement across all tracked platforms</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-black" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Market Price</span>
                    </div>
                  </div>
                </div>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedProduct.historicalData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000008" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 700, fill: '#00000040' }}
                        dy={20}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 700, fill: '#00000040' }}
                        tickFormatter={(val) => `₹${val/1000}k`}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '20px' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 800, color: '#000' }}
                        labelStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#00000040', marginBottom: '8px' }}
                        formatter={(value: number) => [`₹${value.toLocaleString()}`, 'PRICE']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#000" 
                        strokeWidth={4} 
                        dot={{ r: 6, fill: '#000', strokeWidth: 3, stroke: '#fff' }}
                        activeDot={{ r: 8, strokeWidth: 0 }}
                        animationDuration={2000}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-black/5 mt-24">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16">
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-[#1A1A1A] rounded-xl flex items-center justify-center text-white">
                  <Scale size={20} />
                </div>
                <h1 className="text-2xl font-serif font-black tracking-tight">PriceWise</h1>
              </div>
              <p className="text-sm text-black/40 font-medium leading-relaxed max-w-sm">
                The world's first AI-driven price comparator that prioritizes ethical consumption and data transparency. Built for the conscious consumer.
              </p>
              <div className="flex gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-pointer">
                    <div className="w-4 h-4 bg-current rounded-sm opacity-20" />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <h6 className="text-[10px] font-black uppercase tracking-[0.2em]">Platform</h6>
              <ul className="text-xs font-bold text-black/40 space-y-4">
                <li><a href="#" className="hover:text-black transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Ethical Index</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Market Trends</a></li>
                <li><a href="#" className="hover:text-black transition-colors">API Access</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h6 className="text-[10px] font-black uppercase tracking-[0.2em]">Company</h6>
              <ul className="text-xs font-bold text-black/40 space-y-4">
                <li><a href="#" className="hover:text-black transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Sustainability</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Press Kit</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h6 className="text-[10px] font-black uppercase tracking-[0.2em]">Support</h6>
              <ul className="text-xs font-bold text-black/40 space-y-4">
                <li><a href="#" className="hover:text-black transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Terms of Use</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-20 mt-20 border-t border-black/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-black/20">
              <p>© 2024 PriceWise AI. All rights reserved.</p>
              <p>Built by CVR CSE (AI & ML) Team</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 border border-black/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-black/40">
                English (US)
              </div>
              <div className="px-4 py-2 border border-black/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-black/40">
                INR (₹)
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
