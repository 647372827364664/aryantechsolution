'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft,
  Package,
  CreditCard,
  Truck,
  Shield,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/components/providers/AuthProvider';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  getDoc
} from 'firebase/firestore';

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  userId: string;
  createdAt: any;
  product?: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    description: string;
    category: string;
    icon: string;
    inStock: boolean;
    deliveryTime: string;
    rating: number;
    reviews: number;
  };
}

export default function CartPage() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchCartItems = async () => {
    if (!user) return;

    try {
      const cartQuery = query(collection(db, 'cart'), where('userId', '==', user.id));
      const cartSnapshot = await getDocs(cartQuery);
      
      const items: CartItem[] = [];
      for (const cartDoc of cartSnapshot.docs) {
        const cartData = cartDoc.data() as Omit<CartItem, 'id'>;
        
        // Fetch product details
        const productDoc = await getDoc(doc(db, 'products', cartData.productId));
        if (productDoc.exists()) {
          items.push({
            id: cartDoc.id,
            ...cartData,
            product: {
              id: productDoc.id,
              ...productDoc.data()
            } as CartItem['product']
          });
        }
      }
      
      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdating(cartItemId);
    try {
      await updateDoc(doc(db, 'cart', cartItemId), {
        quantity: newQuantity
      });
      
      setCartItems(items => 
        items.map(item => 
          item.id === cartItemId 
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity');
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (cartItemId: string) => {
    setUpdating(cartItemId);
    try {
      await deleteDoc(doc(db, 'cart', cartItemId));
      setCartItems(items => items.filter(item => item.id !== cartItemId));
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item');
    } finally {
      setUpdating(null);
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

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 100 ? 0 : 15; // Free shipping over $100
  const total = subtotal + tax + shipping;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
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
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to login to view your cart</p>
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
          <p className="text-gray-600">Loading your cart...</p>
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
                Continue Shopping
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600 mt-1">{cartItems.length} item(s) in your cart</p>
            </div>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet</p>
            <Link href="/store">
              <Button size="lg">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Cart Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      {/* Product Icon */}
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">{getProductIcon(item.product?.icon || 'Package')}</span>
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/store/product/${item.productId}`}>
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                            {item.product?.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-500 capitalize mb-2">{item.product?.category}</p>
                        
                        {/* Rating */}
                        {item.product?.rating && (
                          <div className="flex items-center space-x-1 mb-2">
                            {renderStars(item.product.rating)}
                            <span className="text-xs text-gray-500 ml-1">
                              ({item.product.reviews} reviews)
                            </span>
                          </div>
                        )}
                        
                        {/* Stock Status */}
                        <div className="flex items-center space-x-4 text-sm">
                          <span className={`${item.product?.inStock ? 'text-green-600' : 'text-red-600'}`}>
                            {item.product?.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                          <span className="text-gray-500 flex items-center">
                            <Truck className="h-3 w-3 mr-1" />
                            {item.product?.deliveryTime}
                          </span>
                        </div>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || updating === item.id}
                          className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                          title="Decrease quantity"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center font-medium">
                          {updating === item.id ? '...' : item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={updating === item.id}
                          className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                          title="Increase quantity"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {/* Price */}
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {formatPrice((item.product?.price || 0) * item.quantity)}
                        </div>
                        {item.product?.originalPrice && item.product.originalPrice > item.product.price && (
                          <div className="text-sm text-gray-500 line-through">
                            {formatPrice(item.product.originalPrice * item.quantity)}
                          </div>
                        )}
                      </div>
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={updating === item.id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md disabled:opacity-50"
                        title="Remove item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Price Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? 'Free' : formatPrice(shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">{formatPrice(tax)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  {/* Free Shipping Notice */}
                  {subtotal < 100 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-700">
                        Add {formatPrice(100 - subtotal)} more for free shipping!
                      </p>
                    </div>
                  )}

                  {/* Checkout Button */}
                  <Link href="/checkout">
                    <Button className="w-full" size="lg">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Proceed to Checkout
                    </Button>
                  </Link>

                  {/* Security Notice */}
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <Shield className="h-4 w-4" />
                    <span>Secure checkout</span>
                  </div>

                  {/* Continue Shopping */}
                  <Link href="/store">
                    <Button variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Features */}
              <Card className="mt-6">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Truck className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">Free Shipping</p>
                        <p className="text-xs text-gray-500">On orders over $100</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">Secure Payment</p>
                        <p className="text-xs text-gray-500">SSL encrypted checkout</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Package className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium">Easy Returns</p>
                        <p className="text-xs text-gray-500">30-day return policy</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
