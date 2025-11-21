'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  ArrowLeft,
  Package,
  Star,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/providers/AuthProvider';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  deleteDoc,
  getDoc,
  addDoc
} from 'firebase/firestore';

interface WishlistItem {
  id: string;
  productId: string;
  userId: string;
  createdAt: any;
  product?: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    description: string;
    shortDescription: string;
    category: string;
    icon: string;
    inStock: boolean;
    deliveryTime: string;
    rating: number;
    reviews: number;
    badge?: string;
  };
}

export default function WishlistPage() {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      fetchWishlistItems();
      fetchCartItems();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchWishlistItems = async () => {
    if (!user) return;

    try {
      const wishlistQuery = query(collection(db, 'wishlist'), where('userId', '==', user.id));
      const wishlistSnapshot = await getDocs(wishlistQuery);
      
      const items: WishlistItem[] = [];
      for (const wishlistDoc of wishlistSnapshot.docs) {
        const wishlistData = wishlistDoc.data() as Omit<WishlistItem, 'id'>;
        
        // Fetch product details
        const productDoc = await getDoc(doc(db, 'products', wishlistData.productId));
        if (productDoc.exists()) {
          items.push({
            id: wishlistDoc.id,
            ...wishlistData,
            product: {
              id: productDoc.id,
              ...productDoc.data()
            } as WishlistItem['product']
          });
        }
      }
      
      setWishlistItems(items);
    } catch (error) {
      console.error('Error fetching wishlist items:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCartItems = async () => {
    if (!user) return;
    
    try {
      const cartQuery = query(collection(db, 'cart'), where('userId', '==', user.id));
      const cartSnapshot = await getDocs(cartQuery);
      const cartProductIds = cartSnapshot.docs.map(doc => doc.data().productId);
      setCartItems(cartProductIds);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const removeFromWishlist = async (wishlistItemId: string) => {
    setRemoving(wishlistItemId);
    try {
      await deleteDoc(doc(db, 'wishlist', wishlistItemId));
      setWishlistItems(items => items.filter(item => item.id !== wishlistItemId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      alert('Failed to remove item from wishlist');
    } finally {
      setRemoving(null);
    }
  };

  const addToCart = async (productId: string) => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      // Check if item already in cart
      const cartQuery = query(
        collection(db, 'cart'), 
        where('userId', '==', user.id),
        where('productId', '==', productId)
      );
      const cartSnapshot = await getDocs(cartQuery);
      
      if (cartSnapshot.empty) {
        // Add new item to cart
        await addDoc(collection(db, 'cart'), {
          userId: user.id,
          productId: productId,
          quantity: 1,
          createdAt: new Date()
        });
        setCartItems([...cartItems, productId]);
        alert('Product added to cart!');
      } else {
        alert('Product already in cart!');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  const getProductIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      'Server': '🖥️',
      'Globe': '🌐',
      'Code': '💻',
      'Gamepad2': '🎮',
      'Shield': '🛡️',
      'Zap': '⚡',
      'Package': '📦'
    };
    return icons[iconName] || '📦';
  };

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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to login to view your wishlist</p>
          <Link href="/auth/login">
            <Button>Login to Continue</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/store">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Store
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Heart className="h-8 w-8 mr-3 text-red-500" />
                My Wishlist
              </h1>
              <p className="text-gray-600 mt-1">{wishlistItems.length} item(s) in your wishlist</p>
            </div>
          </div>
          {cartItems.length > 0 && (
            <Link href="/cart">
              <Button>
                <ShoppingCart className="h-4 w-4 mr-2" />
                View Cart ({cartItems.length})
              </Button>
            </Link>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">Start browsing and add your favorite products to your wishlist</p>
            <Link href="/store">
              <Button size="lg">
                Explore Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                    <span className="text-4xl">{getProductIcon(item.product?.icon || 'Package')}</span>
                  </div>
                  
                  {/* Product Badges */}
                  <div className="absolute top-3 left-3 flex flex-col space-y-2">
                    {item.product?.badge && (
                      <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {item.product.badge}
                      </span>
                    )}
                    {item.product?.originalPrice && item.product.originalPrice > item.product.price && (
                      <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        -{calculateDiscount(item.product.originalPrice, item.product.price)}% OFF
                      </span>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => removeFromWishlist(item.id)}
                      disabled={removing === item.id}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 text-red-500"
                      title="Remove from wishlist"
                      aria-label="Remove from wishlist"
                    >
                      {removing === item.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                    <Link href={`/store/product/${item.productId}`}>
                      <button 
                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                        title="View product details"
                        aria-label="View product details"
                      >
                        <Eye className="h-4 w-4 text-gray-600" />
                      </button>
                    </Link>
                  </div>
                  
                  {/* Stock Status */}
                  {!item.product?.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-6">
                  {/* Category & Rating */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full capitalize">
                      {item.product?.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      {item.product?.rating && renderStars(item.product.rating)}
                      <span className="text-xs text-gray-600 ml-1">
                        ({item.product?.reviews})
                      </span>
                    </div>
                  </div>
                  
                  {/* Product Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    <Link href={`/store/product/${item.productId}`}>
                      {item.product?.name}
                    </Link>
                  </h3>
                  
                  {/* Product Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {item.product?.shortDescription || item.product?.description}
                  </p>
                  
                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-gray-900">
                        {formatPrice(item.product?.price || 0)}
                      </span>
                      {item.product?.originalPrice && item.product.originalPrice > item.product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(item.product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => addToCart(item.productId)}
                      className={`flex-1 ${
                        cartItems.includes(item.productId) 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                      disabled={!item.product?.inStock}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {cartItems.includes(item.productId) ? 'In Cart' : 'Add to Cart'}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => removeFromWishlist(item.id)}
                      disabled={removing === item.id}
                      className="p-2 text-red-600 hover:bg-red-50"
                      title="Remove from wishlist"
                      aria-label="Remove from wishlist"
                    >
                      <Heart className="h-4 w-4 fill-current" />
                    </Button>
                  </div>
                  
                  {/* Delivery Info */}
                  <div className="mt-3 flex items-center text-xs text-gray-500">
                    <Package className="h-3 w-3 mr-1" />
                    {item.product?.deliveryTime}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {wishlistItems.length > 0 && (
          <div className="mt-12 bg-white rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Ready to purchase?</h3>
            <p className="text-gray-600 mb-6">Move all available items to your cart or continue browsing for more products</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => {
                  wishlistItems.forEach(item => {
                    if (item.product?.inStock && !cartItems.includes(item.productId)) {
                      addToCart(item.productId);
                    }
                  });
                }}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add All to Cart
              </Button>
              <Link href="/store">
                <Button size="lg" variant="outline">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
