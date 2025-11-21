'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ShoppingCart, 
  User, 
  MapPin, 
  Mail,
  CreditCard,
  Shield,
  CheckCircle,
  ArrowLeft,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/providers/AuthProvider';
import { useCurrency } from '@/lib/currency';
import { db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  doc, 
  getDoc,
  addDoc 
} from 'firebase/firestore';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

// Interface for checkout form data
interface CheckoutFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  
  // Address Information
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  
  // Service-specific Information
  companyName?: string;
  websiteUrl?: string;
  projectDescription?: string;
  preferredDeliveryTime: string;
  urgency: 'standard' | 'expedited' | 'emergency';
  
  // Additional Requirements
  specialRequirements?: string;
  communicationPreference: 'email' | 'phone' | 'whatsapp' | 'discord';
}

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product?: any;
}

export default function CheckoutPage() {
  const { user, firebaseUser } = useAuth();
  const { currency, formatPrice, convertFromUSD } = useCurrency();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    companyName: '',
    websiteUrl: '',
    projectDescription: '',
    preferredDeliveryTime: '',
    urgency: 'standard',
    specialRequirements: '',
    communicationPreference: 'email'
  });

  useEffect(() => {
    if (!user || !firebaseUser) {
      router.push('/auth/login?redirect=/checkout');
      return;
    }
    
    loadCheckoutData();
  }, [user, firebaseUser]);

  const loadCheckoutData = async () => {
    try {
      setLoading(true);
      
      // Load cart items
      const cartQuery = query(
        collection(db, 'cart'), 
        where('userId', '==', firebaseUser!.uid)
      );
      const cartSnapshot = await getDocs(cartQuery);
      const cartData = cartSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CartItem[];

      if (cartData.length === 0) {
        toast.error('Your cart is empty');
        router.push('/store');
        return;
      }

      // Load product details for cart items
      const productPromises = cartData.map(async (item) => {
        const productDoc = await getDoc(doc(db, 'products', item.productId));
        if (productDoc.exists()) {
          return {
            id: productDoc.id,
            ...productDoc.data()
          };
        }
        return null;
      });

      const productsData = await Promise.all(productPromises);
      const validProducts = productsData.filter(product => product !== null);
      
      setCartItems(cartData);
      setProducts(validProducts);
      
      // Calculate total
      const total = cartData.reduce((sum, item) => {
        const product = validProducts.find(p => p && p.id === item.productId);
        return sum + (product ? (product as any).price * item.quantity : 0);
      }, 0);
      setTotalAmount(total);
      
    } catch (error) {
      console.error('Error loading checkout data:', error);
      toast.error('Failed to load checkout data');
    } finally {
      setLoading(false);
    }
  };

  // Format price with currency conversion
  const formatLocalPrice = (usdPrice: number) => {
    const convertedPrice = convertFromUSD(usdPrice);
    return formatPrice(convertedPrice);
  };

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Personal Information
        return !!(
          formData.firstName && 
          formData.lastName && 
          formData.email && 
          formData.phone && 
          formData.dateOfBirth
        );
      case 2: // Address Information
        return !!(
          formData.address && 
          formData.city && 
          formData.state && 
          formData.postalCode && 
          formData.country
        );
      case 3: // Service Details
        return !!(
          formData.projectDescription && 
          formData.preferredDeliveryTime && 
          formData.urgency
        );
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const proceedToPayment = () => {
    if (validateStep(3)) {
      // Store checkout data in localStorage for payment page
      localStorage.setItem('checkoutData', JSON.stringify({
        formData,
        cartItems,
        products,
        totalAmount
      }));
      router.push('/payment');
    } else {
      toast.error('Please complete all required fields');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600 mt-2">Complete your order for online services</p>
          </div>
          <Link href="/cart">
            <Button variant="outline" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
          </Link>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step < currentStep ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    step
                  )}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <div className="grid grid-cols-4 gap-8 text-sm text-center">
              <span className={currentStep >= 1 ? 'text-blue-600 font-semibold' : 'text-gray-600'}>
                Personal Info
              </span>
              <span className={currentStep >= 2 ? 'text-blue-600 font-semibold' : 'text-gray-600'}>
                Address Details
              </span>
              <span className={currentStep >= 3 ? 'text-blue-600 font-semibold' : 'text-gray-600'}>
                Service Details
              </span>
              <span className={currentStep >= 4 ? 'text-blue-600 font-semibold' : 'text-gray-600'}>
                Review & Payment
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {currentStep === 1 && <User className="h-5 w-5 mr-2" />}
                  {currentStep === 2 && <MapPin className="h-5 w-5 mr-2" />}
                  {currentStep === 3 && <Package className="h-5 w-5 mr-2" />}
                  {currentStep === 4 && <CreditCard className="h-5 w-5 mr-2" />}
                  {currentStep === 1 && 'Personal Information'}
                  {currentStep === 2 && 'Address Information'}
                  {currentStep === 3 && 'Service Details'}
                  {currentStep === 4 && 'Review Your Order'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <Input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          placeholder="Enter your first name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <Input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          placeholder="Enter your last name"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter your email address"
                        className="flex items-center"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth *
                      </label>
                      <Input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700">
                        Continue to Address
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Address Information */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address *
                      </label>
                      <Input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Enter your street address"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <Input
                          type="text"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          placeholder="Enter your city"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State/Province *
                        </label>
                        <Input
                          type="text"
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          placeholder="Enter your state/province"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Postal Code *
                        </label>
                        <Input
                          type="text"
                          value={formData.postalCode}
                          onChange={(e) => handleInputChange('postalCode', e.target.value)}
                          placeholder="Enter postal code"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country *
                        </label>
                        <select
                          value={formData.country}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          title="Select your country"
                          required
                        >
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Australia">Australia</option>
                          <option value="Germany">Germany</option>
                          <option value="France">France</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button onClick={prevStep} variant="outline">
                        Back to Personal Info
                      </Button>
                      <Button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700">
                        Continue to Service Details
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Service Details */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name (Optional)
                      </label>
                      <Input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        placeholder="Enter your company name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Existing Website URL (Optional)
                      </label>
                      <Input
                        type="url"
                        value={formData.websiteUrl}
                        onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                        placeholder="https://example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Description *
                      </label>
                      <textarea
                        value={formData.projectDescription}
                        onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                        placeholder="Describe your project requirements, goals, and specific needs..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Delivery Timeline *
                      </label>
                      <select
                        value={formData.preferredDeliveryTime}
                        onChange={(e) => handleInputChange('preferredDeliveryTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title="Select preferred delivery timeline"
                        required
                      >
                        <option value="">Select timeline</option>
                        <option value="1-3 days">1-3 days (Rush delivery)</option>
                        <option value="1 week">1 week</option>
                        <option value="2 weeks">2 weeks</option>
                        <option value="1 month">1 month</option>
                        <option value="2-3 months">2-3 months</option>
                        <option value="flexible">Flexible timeline</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Urgency *
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { value: 'standard', label: 'Standard', desc: 'Normal priority' },
                          { value: 'expedited', label: 'Expedited', desc: 'Higher priority (+25%)' },
                          { value: 'emergency', label: 'Emergency', desc: 'Immediate attention (+50%)' }
                        ].map((option) => (
                          <label key={option.value} className="cursor-pointer">
                            <input
                              type="radio"
                              name="urgency"
                              value={option.value}
                              checked={formData.urgency === option.value}
                              onChange={(e) => handleInputChange('urgency', e.target.value)}
                              className="sr-only"
                            />
                            <div className={`p-4 border-2 rounded-lg text-center transition-colors ${
                              formData.urgency === option.value
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}>
                              <div className="font-semibold">{option.label}</div>
                              <div className="text-sm text-gray-600">{option.desc}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Communication Method *
                      </label>
                      <select
                        value={formData.communicationPreference}
                        onChange={(e) => handleInputChange('communicationPreference', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title="Select preferred communication method"
                        required
                      >
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="discord">Discord</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Requirements (Optional)
                      </label>
                      <textarea
                        value={formData.specialRequirements}
                        onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                        placeholder="Any special requirements, technologies, or constraints..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                      />
                    </div>

                    <div className="flex justify-between">
                      <Button onClick={prevStep} variant="outline">
                        Back to Address
                      </Button>
                      <Button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700">
                        Review Order
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 4: Review Order */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                      {cartItems.map((item) => {
                        const product = products.find(p => p.id === item.productId);
                        return product ? (
                          <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                            <div>
                              <h4 className="font-medium">{product.name}</h4>
                              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{formatLocalPrice(product.price * item.quantity)}</p>
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                          <p><strong>Email:</strong> {formData.email}</p>
                          <p><strong>Phone:</strong> {formData.phone}</p>
                          <p><strong>Communication:</strong> {formData.communicationPreference}</p>
                        </div>
                        <div>
                          <p><strong>Address:</strong> {formData.address}</p>
                          <p><strong>City:</strong> {formData.city}, {formData.state}</p>
                          <p><strong>Postal Code:</strong> {formData.postalCode}</p>
                          <p><strong>Country:</strong> {formData.country}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button onClick={prevStep} variant="outline">
                        Back to Service Details
                      </Button>
                      <Button onClick={proceedToPayment} className="bg-green-600 hover:bg-green-700">
                        Proceed to Payment
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => {
                  const product = products.find(p => p.id === item.productId);
                  return product ? (
                    <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{product.name}</h4>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold text-blue-600">{formatLocalPrice(product.price)}</p>
                      </div>
                    </div>
                  ) : null;
                })}

                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Subtotal:</span>
                    <span>{formatLocalPrice(totalAmount)}</span>
                  </div>
                  {formData.urgency === 'expedited' && (
                    <div className="flex justify-between text-sm mb-2 text-orange-600">
                      <span>Expedited Fee (+25%):</span>
                      <span>{formatLocalPrice(totalAmount * 0.25)}</span>
                    </div>
                  )}
                  {formData.urgency === 'emergency' && (
                    <div className="flex justify-between text-sm mb-2 text-red-600">
                      <span>Emergency Fee (+50%):</span>
                      <span>{formatLocalPrice(totalAmount * 0.5)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span className="text-blue-600">
                      {formatLocalPrice(totalAmount * (
                        formData.urgency === 'expedited' ? 1.25 : 
                        formData.urgency === 'emergency' ? 1.5 : 1
                      ))}
                    </span>
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center text-green-700">
                    <Shield className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Secure Checkout</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    Your information is protected with SSL encryption
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Toast Notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </div>
  );
}
