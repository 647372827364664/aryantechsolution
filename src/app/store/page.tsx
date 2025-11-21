'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  Star, 
  ShoppingCart, 
  Heart,
  Grid,
  List,
  Server,
  Globe,
  Code,
  Gamepad2,
  Shield,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  Percent,
  Truck,
  Database,
  Monitor,
  Smartphone,
  Bot,
  Verified
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/providers/AuthProvider';
import { useCurrency } from '@/lib/currency';
import toast, { Toaster } from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory: string;
  icon: string;
  image?: string;
  rating: number;
  reviews: number;
  badge?: string;
  features: string[];
  specifications: Record<string, string>;
  popular?: boolean;
  featured?: boolean;
  inStock: boolean;
  stockQuantity: number;
  deliveryTime: string;
  tags: string[];
  sku: string;
  status: string;
  createdAt?: any;
}

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  count: number;
  description: string;
}

export default function StorePage() {
  const { user } = useAuth();
  const { currency, formatPrice, convertFromUSD } = useCurrency();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [loading, setLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);

  // Initialize store data
  useEffect(() => {
    initializeStoreData();
    if (user) {
      fetchCartAndWishlist();
    }
  }, [user]);

  const initializeStoreData = async () => {
    try {
      setLoading(true);
      
      // Fetch products from Firebase
      await fetchProductsFromFirebase();
      
    } catch (error) {
      console.error('Error initializing store data:', error);
      toast.error('Failed to load store data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch products from Firebase
  const fetchProductsFromFirebase = async () => {
    try {
      const productsRef = collection(db, 'products');
      const q = query(productsRef, where('status', '==', 'active'));
      const querySnapshot = await getDocs(q);
      
      const fetchedProducts: Product[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedProducts.push({
          id: doc.id,
          ...data
        } as Product);
      });

      setProducts(fetchedProducts);

      // Calculate categories from products
      const categoryMap = new Map<string, { count: number; products: Product[] }>();
      
      fetchedProducts.forEach(product => {
        if (!categoryMap.has(product.category)) {
          categoryMap.set(product.category, { count: 0, products: [] });
        }
        const cat = categoryMap.get(product.category)!;
        cat.count++;
        cat.products.push(product);
      });

      const calculatedCategories: Category[] = [
        {
          id: 'all',
          name: 'All Products',
          icon: Package,
          count: fetchedProducts.length,
          description: 'All available products'
        },
        {
          id: 'hosting',
          name: 'Web Hosting',
          icon: Server,
          count: categoryMap.get('hosting')?.count || 0,
          description: 'Reliable hosting solutions'
        },
        {
          id: 'development',
          name: 'Development',
          icon: Code,
          count: categoryMap.get('development')?.count || 0,
          description: 'Custom development services'
        },
        {
          id: 'domains',
          name: 'Domains',
          icon: Globe,
          count: categoryMap.get('domains')?.count || 0,
          description: 'Domain registration and management'
        },
        {
          id: 'gaming',
          name: 'Gaming',
          icon: Gamepad2,
          count: categoryMap.get('gaming')?.count || 0,
          description: 'Gaming servers and services'
        },
        {
          id: 'security',
          name: 'Security',
          icon: Shield,
          count: categoryMap.get('security')?.count || 0,
          description: 'Security solutions and certificates'
        }
      ];

      setCategories(calculatedCategories);
      setFeaturedProducts(fetchedProducts.filter(p => p.featured));
      setTrendingProducts(fetchedProducts.filter(p => p.popular));
      
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products from database');
    }
  };

  const fetchCartAndWishlist = async () => {
    if (!user) return;

    try {
      // Fetch cart items
      const cartQuery = query(collection(db, 'cart'), where('userId', '==', user.id));
      const cartSnapshot = await getDocs(cartQuery);
      const cartProductIds = cartSnapshot.docs.map(doc => doc.data().productId);
      setCartItems(cartProductIds);

      // Fetch wishlist items
      const wishlistQuery = query(collection(db, 'wishlist'), where('userId', '==', user.id));
      const wishlistSnapshot = await getDocs(wishlistQuery);
      const wishlistProductIds = wishlistSnapshot.docs.map(doc => doc.data().productId);
      setWishlistItems(wishlistProductIds);
    } catch (error) {
      console.error('Error fetching cart and wishlist:', error);
    }
  };

  // Filter products with useMemo for performance
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // popular
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          if (a.popular && !b.popular) return -1;
          if (!a.popular && b.popular) return 1;
          return b.rating - a.rating;
        });
    }

    return filtered;
  }, [products, selectedCategory, searchTerm, sortBy, priceRange]);

  const addToCart = async (productId: string) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      // Check if already in cart
      const cartQuery = query(
        collection(db, 'cart'),
        where('userId', '==', user.id),
        where('productId', '==', productId)
      );
      const cartSnapshot = await getDocs(cartQuery);

      if (!cartSnapshot.empty) {
        toast.success('Item already in cart!');
        return;
      }

      await addDoc(collection(db, 'cart'), {
        userId: user.id,
        productId,
        quantity: 1,
        addedAt: new Date()
      });

      setCartItems(prev => [...prev, productId]);
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const addToWishlist = async (productId: string) => {
    if (!user) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    try {
      const wishlistQuery = query(
        collection(db, 'wishlist'),
        where('userId', '==', user.id),
        where('productId', '==', productId)
      );
      const wishlistSnapshot = await getDocs(wishlistQuery);

      if (!wishlistSnapshot.empty) {
        // Remove from wishlist
        const docToDelete = wishlistSnapshot.docs[0];
        await deleteDoc(doc(db, 'wishlist', docToDelete.id));
        setWishlistItems(prev => prev.filter(id => id !== productId));
        toast.success('Removed from wishlist!');
      } else {
        // Add to wishlist
        await addDoc(collection(db, 'wishlist'), {
          userId: user.id,
          productId,
          addedAt: new Date()
        });
        setWishlistItems(prev => [...prev, productId]);
        toast.success('Added to wishlist!');
      }
    } catch (error) {
      console.error('Error managing wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  };

  // Format price with currency conversion
  const formatLocalPrice = (usdPrice: number) => {
    const convertedPrice = convertFromUSD(usdPrice);
    return formatPrice(convertedPrice);
  };

  const calculateDiscount = (originalPrice: number, currentPrice: number) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ElementType> = {
      Server, Globe, Code, Gamepad2, Shield, Package, Bot, Smartphone, Database, Monitor
    };
    return iconMap[iconName] || Package;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Store</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover premium hosting solutions, development services, and digital products. 
              All prices shown in {currency.name} ({currency.code}).
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Sort products"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviews</option>
                <option value="name">Name A-Z</option>
              </select>

              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  title="Grid view"
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  title="List view"
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                          selectedCategory === category.id
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <IconComponent className="h-4 w-4" />
                        <span className="flex-1">{category.name}</span>
                        <span className="text-sm text-gray-500">({category.count})</span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                {selectedCategory === 'all' ? 'All Products' : categories.find(c => c.id === selectedCategory)?.name}
              </h2>
              <span className="text-gray-600">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product) => {
                  const IconComponent = getIconComponent(product.icon);
                  return (
                    <Link key={product.id} href={`/store/product/${product.id}`}>
                      <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md cursor-pointer h-full">
                      <div className="relative overflow-hidden">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                            <IconComponent className="h-16 w-16 text-blue-600" />
                          </div>
                        )}
                        
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1">
                          {product.featured && (
                            <span className="bg-blue-600 text-white px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1">
                              <Verified className="h-3 w-3" />
                              Featured
                            </span>
                          )}
                          {product.popular && (
                            <span className="bg-green-600 text-white px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              Popular
                            </span>
                          )}
                          {product.badge && (
                            <span className="bg-purple-600 text-white px-2 py-1 text-xs font-medium rounded-full">
                              {product.badge}
                            </span>
                          )}
                        </div>

                        {/* Discount Badge */}
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded-full flex items-center gap-1">
                            <Percent className="h-3 w-3" />
                            -{calculateDiscount(product.originalPrice, product.price)}% OFF
                          </span>
                        )}
                        
                        {/* Wishlist Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addToWishlist(product.id);
                          }}
                          className={`absolute bottom-3 right-3 p-2 rounded-full transition-all duration-300 ${
                            wishlistItems.includes(product.id)
                              ? 'bg-red-500 text-white shadow-lg'
                              : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-red-50 hover:text-red-600'
                          }`}
                          title={wishlistItems.includes(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                          aria-label={wishlistItems.includes(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                          <Heart className={`h-5 w-5 ${wishlistItems.includes(product.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      <CardContent className="p-6">
                        {/* Rating and Reviews */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1">
                            {renderStars(product.rating)}
                            <span className="text-sm text-gray-600 ml-1">
                              {product.rating} ({product.reviews} reviews)
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-green-600 text-sm">
                            <CheckCircle className="h-4 w-4" />
                            <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                          </div>
                        </div>

                        {/* Product Name */}
                        <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        
                        {/* Short Description */}
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {product.shortDescription || product.description}
                        </p>

                        {/* Features */}
                        {product.features && product.features.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Key Features:</h4>
                            <div className="grid grid-cols-2 gap-1">
                              {product.features.slice(0, 4).map((feature, index) => (
                                <div key={index} className="flex items-center gap-1 text-xs text-gray-600">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  <span className="truncate">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Delivery Info */}
                        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{product.deliveryTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Truck className="h-4 w-4" />
                            <span>Free Support</span>
                          </div>
                        </div>

                        {/* Price and Actions */}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-gray-900">
                                {formatLocalPrice(product.price)}
                              </span>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-lg text-gray-500 line-through">
                                  {formatLocalPrice(product.originalPrice)}
                                </span>
                              )}
                            </div>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="text-sm text-green-600 font-medium">
                                Save {formatLocalPrice(product.originalPrice - product.price)}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addToCart(product.id);
                              }}
                              className={`${
                                cartItems.includes(product.id)
                                  ? 'bg-green-600 hover:bg-green-700'
                                  : 'bg-blue-600 hover:bg-blue-700'
                              } text-white px-4 py-2`}
                              disabled={!product.inStock}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {cartItems.includes(product.id) ? 'In Cart' : 'Add to Cart'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <Package className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">
                  {products.length === 0 
                    ? "No products available in the database. Add some products to get started!"
                    : "Try adjusting your search or filter criteria."
                  }
                </p>
                {products.length === 0 && (
                  <Link href="/admin" className="text-blue-600 hover:text-blue-700 font-medium">
                    Go to Admin Panel to Add Products
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
