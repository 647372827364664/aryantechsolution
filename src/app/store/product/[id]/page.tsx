'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Star, 
  ShoppingCart, 
  Heart,
  Share2,
  Shield,
  Truck,
  RotateCcw,
  Check,
  Minus,
  Plus,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ThumbsUp,
  Award,
  Clock,
  Users,
  Zap,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory: string;
  images: string[];
  rating: number;
  reviews: number;
  badge?: string;
  features: string[];
  specifications: Record<string, string>;
  inStock: boolean;
  stockQuantity: number;
  deliveryTime: string;
  tags: string[];
  sku: string;
  status: string;
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      // Try to fetch from Firebase first
      const productDoc = await getDoc(doc(db, 'products', productId));
      
      if (productDoc.exists()) {
        const productData = { id: productDoc.id, ...productDoc.data() } as Product;
        setProduct(productData);
        
        // Fetch related products
        const relatedQuery = query(
          collection(db, 'products'),
          where('category', '==', productData.category),
          where('status', '==', 'active'),
          limit(4)
        );
        const relatedSnapshot = await getDocs(relatedQuery);
        const relatedData = relatedSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(p => p.id !== productId) as Product[];
        setRelatedProducts(relatedData);
      } else {
        // Fallback to demo product
        const demoProduct = getDemoProduct(productId);
        if (demoProduct) {
          setProduct(demoProduct);
          setRelatedProducts(getDemoRelatedProducts(demoProduct.category, productId));
        } else {
          router.push('/store');
        }
      }
      
      // Mock reviews data
      setReviews(getMockReviews());
      
    } catch (error) {
      console.error('Error fetching product:', error);
      // Fallback to demo product
      const demoProduct = getDemoProduct(productId);
      if (demoProduct) {
        setProduct(demoProduct);
        setRelatedProducts(getDemoRelatedProducts(demoProduct.category, productId));
        setReviews(getMockReviews());
      } else {
        router.push('/store');
      }
    } finally {
      setLoading(false);
    }
  };

  const getDemoProduct = (id: string): Product | null => {
    const demoProducts: Record<string, Product> = {
      'vps-premium': {
        id: 'vps-premium',
        name: 'Premium VPS Hosting',
        description: `Experience the ultimate in web hosting with our Premium VPS solution. Built on enterprise-grade infrastructure with cutting-edge SSD storage, unlimited bandwidth, and 24/7 expert support.

Our Premium VPS hosting provides the perfect balance of performance, reliability, and value. Whether you're running a high-traffic website, complex web applications, or multiple projects, our VPS gives you the resources and flexibility you need.

Features include full root access, choice of operating systems, scalable resources, and our industry-leading 99.9% uptime guarantee. Plus, with our advanced security measures and automated backups, your data is always protected.

Perfect for developers, businesses, and anyone who demands more from their hosting solution.`,
        shortDescription: 'High-performance VPS with SSD storage, unlimited bandwidth, and 24/7 support',
        price: 29.99,
        originalPrice: 39.99,
        category: 'hosting',
        subcategory: 'vps',
        images: [
          '/api/placeholder/800/600',
          '/api/placeholder/800/600',
          '/api/placeholder/800/600',
          '/api/placeholder/800/600'
        ],
        rating: 4.9,
        reviews: 1247,
        badge: 'Best Seller',
        features: [
          '8GB DDR4 RAM',
          '4 CPU Cores Intel Xeon',
          '200GB NVMe SSD Storage',
          'Unlimited Bandwidth',
          '24/7 Expert Support',
          'Free SSL Certificate',
          'Full Root Access',
          '99.9% Uptime Guarantee',
          'Daily Automated Backups',
          'DDoS Protection'
        ],
        specifications: {
          'RAM': '8GB DDR4',
          'CPU': '4 Cores Intel Xeon E5',
          'Storage': '200GB NVMe SSD',
          'Bandwidth': 'Unlimited',
          'Operating System': 'Ubuntu, CentOS, Debian, Windows',
          'Control Panel': 'cPanel/Plesk Available',
          'Uptime': '99.9% Guaranteed',
          'Setup Time': 'Instant',
          'Backup': 'Daily Automated',
          'Support': '24/7 Expert Support'
        },
        inStock: true,
        stockQuantity: 50,
        deliveryTime: 'Instant Setup',
        tags: ['hosting', 'vps', 'premium', 'ssd', 'unlimited'],
        sku: 'VPS-PREM-001',
        status: 'active'
      },
      'minecraft-server': {
        id: 'minecraft-server',
        name: 'Minecraft Server Hosting',
        description: `Launch your Minecraft world with our optimized server hosting solution. Built specifically for Minecraft with mod support, automatic backups, and DDoS protection.

Our Minecraft servers are optimized for performance with high-frequency CPUs, fast SSD storage, and premium network connectivity. Whether you're hosting a small private server for friends or a large community server, we have the resources to support your gameplay.

Features include one-click mod installation, automatic world backups, custom control panel, and Discord integration. Our expert support team knows Minecraft inside and out and is available 24/7 to help with any issues.

Perfect for communities, content creators, and anyone wanting to host their own Minecraft world.`,
        shortDescription: 'Optimized Minecraft servers with mod support, automatic backups, and DDoS protection',
        price: 9.99,
        category: 'gaming',
        subcategory: 'minecraft',
        images: [
          '/api/placeholder/800/600',
          '/api/placeholder/800/600',
          '/api/placeholder/800/600'
        ],
        rating: 4.9,
        reviews: 2156,
        badge: 'Gamer\'s Choice',
        features: [
          'Support for up to 20 Players',
          'Forge & Fabric Mod Support',
          'Automatic Daily Backups',
          'DDoS Protection',
          'Custom Control Panel',
          'Discord Integration',
          'One-Click Mod Installation',
          'World Management Tools',
          'Player Management',
          'Performance Monitoring'
        ],
        specifications: {
          'Players': 'Up to 20 concurrent',
          'RAM': '4GB Dedicated',
          'Storage': '50GB SSD',
          'CPU': 'High-frequency cores',
          'Mods': 'Forge & Fabric Support',
          'Backups': 'Automatic daily',
          'DDoS Protection': 'Included',
          'Setup Time': '5 minutes',
          'Control Panel': 'Custom Minecraft panel',
          'Support': '24/7 Minecraft experts'
        },
        inStock: true,
        stockQuantity: 25,
        deliveryTime: '5 minutes setup',
        tags: ['minecraft', 'gaming', 'server', 'mods', 'multiplayer'],
        sku: 'MC-SERVER-001',
        status: 'active'
      }
    };
    
    return demoProducts[id] || null;
  };

  const getDemoRelatedProducts = (category: string, excludeId: string): Product[] => {
    // Return demo related products based on category
    const allDemoProducts = [
      getDemoProduct('vps-premium'),
      getDemoProduct('minecraft-server')
    ].filter(p => p && p.id !== excludeId && p.category === category) as Product[];
    
    return allDemoProducts.slice(0, 3);
  };

  const getMockReviews = (): Review[] => [
    {
      id: '1',
      userName: 'Alex Thompson',
      rating: 5,
      comment: 'Excellent service! The setup was instant and the performance has been outstanding. Support team is very responsive.',
      date: '2024-01-15',
      verified: true
    },
    {
      id: '2',
      userName: 'Sarah Johnson',
      rating: 5,
      comment: 'Best hosting I\'ve used. Great value for money and the control panel is very user-friendly.',
      date: '2024-01-10',
      verified: true
    },
    {
      id: '3',
      userName: 'Mike Chen',
      rating: 4,
      comment: 'Solid performance and good uptime. Had one minor issue but support resolved it quickly.',
      date: '2024-01-08',
      verified: true
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  const calculateDiscount = (originalPrice: number, currentPrice: number) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5'
    };
    
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${sizeClasses[size]} ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const addToCart = () => {
    // TODO: Implement cart functionality
    console.log('Adding to cart:', { productId, quantity });
  };

  const addToWishlist = () => {
    // TODO: Implement wishlist functionality
    console.log('Adding to wishlist:', productId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/store">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Store
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/store" className="text-blue-600 hover:text-blue-800">Store</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 capitalize">{product.category}</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 truncate max-w-xs">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-xl border overflow-hidden">
              <img
                src={product.images[selectedImage] || '/api/placeholder/600/600'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Image Navigation */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : product.images.length - 1)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
                    title="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(selectedImage < product.images.length - 1 ? selectedImage + 1 : 0)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
                    title="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col space-y-2">
                {product.badge && (
                  <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {product.badge}
                  </span>
                )}
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    -{calculateDiscount(product.originalPrice, product.price)}% OFF
                  </span>
                )}
              </div>
            </div>
            
            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 bg-white rounded-lg border-2 overflow-hidden ${
                      selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full capitalize">
                  {product.category}
                </span>
                <span className="text-sm text-gray-500">SKU: {product.sku}</span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {renderStars(product.rating, 'lg')}
                  <span className="text-lg font-medium text-gray-900 ml-2">{product.rating}</span>
                </div>
                <span className="text-gray-600">({product.reviews} reviews)</span>
              </div>
              
              <p className="text-gray-600 text-lg leading-relaxed">
                {product.shortDescription}
              </p>
            </div>

            {/* Pricing */}
            <div className="border-t border-b py-6">
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-4xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Truck className="h-4 w-4 text-green-600" />
                  <span className="text-gray-600">Delivery: {product.deliveryTime}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-600">Secure & Protected</span>
                </div>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-50"
                      disabled={quantity <= 1}
                      title="Decrease quantity"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center border-0 focus:ring-0"
                      min="1"
                      max={product.stockQuantity}
                      title="Product quantity"
                      aria-label="Product quantity"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                      className="p-2 hover:bg-gray-50"
                      disabled={quantity >= product.stockQuantity}
                      title="Increase quantity"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.stockQuantity} in stock
                  </span>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={addToCart}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3"
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                
                <Button
                  onClick={addToWishlist}
                  variant="outline"
                  className="px-4 py-3"
                  title="Add to wishlist"
                >
                  <Heart className="h-5 w-5" />
                </Button>
                
                <Button
                  variant="outline"
                  className="px-4 py-3"
                  title="Share product"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Key Features */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Key Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.features.slice(0, 6).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t">
              <div className="text-center">
                <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-900">Secure Payment</p>
                <p className="text-xs text-gray-600">SSL Protected</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-900">30-Day Return</p>
                <p className="text-xs text-gray-600">Money Back</p>
              </div>
              <div className="text-center">
                <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-900">Quality Guarantee</p>
                <p className="text-xs text-gray-600">Premium Service</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                  {tab === 'reviews' && ` (${reviews.length})`}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.description}
                </div>
                
                {product.features.length > 6 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Complete Feature List</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {product.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Specifications</h3>
                  <div className="space-y-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-700">{key}</span>
                        <span className="text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">SKU</span>
                      <span className="text-gray-900">{product.sku}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Category</span>
                      <span className="text-gray-900 capitalize">{product.category}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Subcategory</span>
                      <span className="text-gray-900 capitalize">{product.subcategory}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Availability</span>
                      <span className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-1">
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-2">{product.rating}</div>
                      <div className="flex justify-center mb-2">
                        {renderStars(product.rating, 'lg')}
                      </div>
                      <p className="text-gray-600">Based on {product.reviews} reviews</p>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {review.userName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900">{review.userName}</span>
                                {review.verified && (
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                    Verified Purchase
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                {renderStars(review.rating, 'sm')}
                                <span className="text-sm text-gray-500">{review.date}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                        <div className="flex items-center space-x-4 mt-3">
                          <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700">
                            <ThumbsUp className="h-4 w-4" />
                            <span>Helpful</span>
                          </button>
                          <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700">
                            <MessageCircle className="h-4 w-4" />
                            <span>Reply</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="group hover:shadow-lg transition-shadow border-0">
                  <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                    <img
                      src={relatedProduct.images[0] || '/api/placeholder/400/300'}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      <Link href={`/store/product/${relatedProduct.id}`}>
                        {relatedProduct.name}
                      </Link>
                    </h3>
                    <div className="flex items-center mb-3">
                      {renderStars(relatedProduct.rating, 'sm')}
                      <span className="text-sm text-gray-600 ml-2">
                        ({relatedProduct.reviews})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(relatedProduct.price)}
                      </span>
                      <Link href={`/store/product/${relatedProduct.id}`}>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
