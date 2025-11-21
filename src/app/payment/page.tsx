'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CreditCard, 
  Lock, 
  Shield, 
  CheckCircle,
  ArrowLeft,
  AlertCircle,
  Calendar,
  User,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/providers/AuthProvider';
import { db } from '@/lib/firebase';
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

interface PaymentFormData {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardholderName: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingZip: string;
  billingCountry: string;
  saveCard: boolean;
}

interface CheckoutData {
  formData: any;
  cartItems: any[];
  products: any[];
  totalAmount: number;
}

export default function PaymentPage() {
  const { user, firebaseUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [paymentForm, setPaymentForm] = useState<PaymentFormData>({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    billingCountry: 'United States',
    saveCard: false
  });
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!user || !firebaseUser) {
      router.push('/auth/login?redirect=/payment');
      return;
    }

    // Load checkout data from localStorage
    const savedCheckoutData = localStorage.getItem('checkoutData');
    if (!savedCheckoutData) {
      toast.error('No checkout data found');
      router.push('/checkout');
      return;
    }

    try {
      const data = JSON.parse(savedCheckoutData);
      setCheckoutData(data);
      
      // Pre-fill billing address if same as shipping
      if (sameAsShipping && data.formData) {
        setPaymentForm(prev => ({
          ...prev,
          cardholderName: `${data.formData.firstName} ${data.formData.lastName}`,
          billingAddress: data.formData.address,
          billingCity: data.formData.city,
          billingState: data.formData.state,
          billingZip: data.formData.postalCode,
          billingCountry: data.formData.country
        }));
      }
    } catch (error) {
      console.error('Error parsing checkout data:', error);
      toast.error('Invalid checkout data');
      router.push('/checkout');
    }
  }, [user, firebaseUser, sameAsShipping]);

  const handleInputChange = (field: keyof PaymentFormData, value: string | boolean) => {
    setPaymentForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.substring(0, 19); // Limit to 16 digits + 3 spaces
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    handleInputChange('cardNumber', formatted);
  };

  const validatePaymentForm = (): boolean => {
    const { cardNumber, expiryMonth, expiryYear, cvv, cardholderName } = paymentForm;
    
    if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
      toast.error('Please enter a valid 16-digit card number');
      return false;
    }
    
    if (!expiryMonth || !expiryYear) {
      toast.error('Please enter card expiry date');
      return false;
    }
    
    if (!cvv || cvv.length < 3) {
      toast.error('Please enter a valid CVV');
      return false;
    }
    
    if (!cardholderName.trim()) {
      toast.error('Please enter cardholder name');
      return false;
    }

    return true;
  };

  const simulatePaymentProcessing = async (): Promise<boolean> => {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulate 95% success rate
    return Math.random() > 0.05;
  };

  const processPayment = async () => {
    if (!validatePaymentForm() || !checkoutData) {
      return;
    }

    setProcessing(true);
    
    try {
      // Simulate payment processing
      toast.loading('Processing payment...', { id: 'payment' });
      
      const paymentSuccess = await simulatePaymentProcessing();
      
      if (!paymentSuccess) {
        toast.error('Payment failed. Please try again.', { id: 'payment' });
        return;
      }

      toast.success('Payment successful!', { id: 'payment' });

      // Calculate final amount with urgency fees
      const finalAmount = checkoutData.totalAmount * (
        checkoutData.formData.urgency === 'expedited' ? 1.25 : 
        checkoutData.formData.urgency === 'emergency' ? 1.5 : 1
      );

      // Create order in Firebase
      const orderData = {
        // Order Information
        userId: firebaseUser?.uid,
        orderId: `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        status: 'confirmed',
        orderDate: new Date(),
        
        // Customer Information
        customerInfo: {
          firstName: checkoutData.formData.firstName,
          lastName: checkoutData.formData.lastName,
          email: checkoutData.formData.email,
          phone: checkoutData.formData.phone,
          dateOfBirth: checkoutData.formData.dateOfBirth,
          communicationPreference: checkoutData.formData.communicationPreference
        },
        
        // Address Information
        shippingAddress: {
          address: checkoutData.formData.address,
          city: checkoutData.formData.city,
          state: checkoutData.formData.state,
          postalCode: checkoutData.formData.postalCode,
          country: checkoutData.formData.country
        },
        
        // Service Details
        serviceDetails: {
          companyName: checkoutData.formData.companyName || '',
          websiteUrl: checkoutData.formData.websiteUrl || '',
          projectDescription: checkoutData.formData.projectDescription,
          preferredDeliveryTime: checkoutData.formData.preferredDeliveryTime,
          urgency: checkoutData.formData.urgency,
          specialRequirements: checkoutData.formData.specialRequirements || ''
        },
        
        // Order Items
        items: checkoutData.cartItems.map(item => {
          const product = checkoutData.products.find(p => p.id === item.productId);
          return {
            productId: item.productId,
            productName: product?.name || 'Unknown Product',
            productCategory: product?.category || 'Unknown',
            quantity: item.quantity,
            unitPrice: product?.price || 0,
            totalPrice: (product?.price || 0) * item.quantity
          };
        }),
        
        // Payment Information
        payment: {
          subtotal: checkoutData.totalAmount,
          urgencyFee: checkoutData.formData.urgency === 'expedited' ? checkoutData.totalAmount * 0.25 : 
                      checkoutData.formData.urgency === 'emergency' ? checkoutData.totalAmount * 0.5 : 0,
          totalAmount: finalAmount,
          currency: 'USD',
          paymentMethod: 'credit_card',
          paymentStatus: 'completed',
          transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          processedAt: new Date()
        },
        
        // Project Management
        projectStatus: 'pending_assignment',
        assignedDeveloper: null,
        estimatedCompletionDate: null,
        actualStartDate: null,
        actualCompletionDate: null,
        
        // Timestamps
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Save order to Firebase
      const orderDoc = await addDoc(collection(db, 'orders'), orderData);
      console.log('Order created with ID:', orderDoc.id);

      // Clear cart items
      const cartQuery = query(
        collection(db, 'cart'), 
        where('userId', '==', firebaseUser?.uid)
      );
      const cartSnapshot = await getDocs(cartQuery);
      
      // Delete all cart items
      const deletePromises = cartSnapshot.docs.map(cartDoc => 
        deleteDoc(doc(db, 'cart', cartDoc.id))
      );
      await Promise.all(deletePromises);

      // Clear localStorage
      localStorage.removeItem('checkoutData');

      // Redirect to success page
      router.push(`/order-success?orderId=${orderData.orderId}`);
      
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Payment processing failed. Please try again.', { id: 'payment' });
    } finally {
      setProcessing(false);
    }
  };

  if (!checkoutData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  const finalAmount = checkoutData.totalAmount * (
    checkoutData.formData.urgency === 'expedited' ? 1.25 : 
    checkoutData.formData.urgency === 'emergency' ? 1.5 : 1
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payment</h1>
            <p className="text-gray-600 mt-2">Complete your secure payment</p>
          </div>
          <Link href="/checkout">
            <Button variant="outline" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Checkout
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Security Notice */}
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center text-green-700">
                  <Shield className="h-5 w-5 mr-2" />
                  <span className="font-semibold">Secure Payment</span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  Your payment information is encrypted and secure. We never store your card details.
                </p>
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number *
                  </label>
                  <Input
                    type="text"
                    value={paymentForm.cardNumber}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="text-lg"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Month *
                    </label>
                    <select
                      value={paymentForm.expiryMonth}
                      onChange={(e) => handleInputChange('expiryMonth', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      title="Expiry month"
                    >
                      <option value="">MM</option>
                      {Array.from({ length: 12 }, (_, i) => {
                        const month = (i + 1).toString().padStart(2, '0');
                        return (
                          <option key={month} value={month}>{month}</option>
                        );
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year *
                    </label>
                    <select
                      value={paymentForm.expiryYear}
                      onChange={(e) => handleInputChange('expiryYear', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      title="Expiry year"
                    >
                      <option value="">YYYY</option>
                      {Array.from({ length: 10 }, (_, i) => {
                        const year = new Date().getFullYear() + i;
                        return (
                          <option key={year} value={year}>{year}</option>
                        );
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV *
                    </label>
                    <Input
                      type="text"
                      value={paymentForm.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').substring(0, 4))}
                      placeholder="123"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name *
                  </label>
                  <Input
                    type="text"
                    value={paymentForm.cardholderName}
                    onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                    placeholder="Name as it appears on card"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Billing Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="sameAsShipping"
                    checked={sameAsShipping}
                    onChange={(e) => setSameAsShipping(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="sameAsShipping" className="text-sm text-gray-700">
                    Same as shipping address
                  </label>
                </div>

                {!sameAsShipping && (
                  <div className="space-y-4">
                    <Input
                      type="text"
                      value={paymentForm.billingAddress}
                      onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                      placeholder="Billing address"
                      required
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        type="text"
                        value={paymentForm.billingCity}
                        onChange={(e) => handleInputChange('billingCity', e.target.value)}
                        placeholder="City"
                        required
                      />
                      <Input
                        type="text"
                        value={paymentForm.billingState}
                        onChange={(e) => handleInputChange('billingState', e.target.value)}
                        placeholder="State"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        type="text"
                        value={paymentForm.billingZip}
                        onChange={(e) => handleInputChange('billingZip', e.target.value)}
                        placeholder="ZIP Code"
                        required
                      />
                      <select
                        value={paymentForm.billingCountry}
                        onChange={(e) => handleInputChange('billingCountry', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title="Billing country"
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Customer Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Customer</h4>
                  <p className="text-sm">{checkoutData.formData.firstName} {checkoutData.formData.lastName}</p>
                  <p className="text-sm text-gray-600">{checkoutData.formData.email}</p>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {checkoutData.cartItems.map((item) => {
                    const product = checkoutData.products.find(p => p.id === item.productId);
                    return product ? (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200">
                        <div>
                          <h4 className="font-medium text-sm">{product.name}</h4>
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">${(product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ) : null;
                  })}
                </div>

                {/* Pricing */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${checkoutData.totalAmount.toFixed(2)}</span>
                  </div>
                  
                  {checkoutData.formData.urgency === 'expedited' && (
                    <div className="flex justify-between text-sm text-orange-600">
                      <span>Expedited Fee (+25%):</span>
                      <span>${(checkoutData.totalAmount * 0.25).toFixed(2)}</span>
                    </div>
                  )}
                  
                  {checkoutData.formData.urgency === 'emergency' && (
                    <div className="flex justify-between text-sm text-red-600">
                      <span>Emergency Fee (+50%):</span>
                      <span>${(checkoutData.totalAmount * 0.5).toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span className="text-blue-600">${finalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Button */}
                <Button 
                  onClick={processPayment}
                  disabled={processing}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold"
                >
                  {processing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Lock className="h-5 w-5 mr-2" />
                      Pay ${finalAmount.toFixed(2)}
                    </div>
                  )}
                </Button>

                {/* Security Icons */}
                <div className="text-center text-xs text-gray-500 pt-4">
                  <div className="flex items-center justify-center space-x-4 mb-2">
                    <Shield className="h-4 w-4" />
                    <span>SSL Secured</span>
                  </div>
                  <p>Your payment information is encrypted and secure</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Toast Notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
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
