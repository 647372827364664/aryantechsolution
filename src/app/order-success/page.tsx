'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Download, Mail, Phone, Calendar, ArrowRight, Home, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/providers/AuthProvider';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Link from 'next/link';

interface OrderDetails {
  orderId: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  payment: {
    totalAmount: number;
    transactionId: string;
  };
  orderDate: any;
  projectStatus: string;
  items: Array<{
    productName: string;
    quantity: number;
    totalPrice: number;
  }>;
}

export default function OrderSuccessPage() {
  const { user, firebaseUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !firebaseUser) {
      router.push('/auth/login');
      return;
    }

    if (!orderId) {
      router.push('/store');
      return;
    }

    fetchOrderDetails();
  }, [user, firebaseUser, orderId]);

  const fetchOrderDetails = async () => {
    if (!firebaseUser || !orderId) return;

    try {
      const ordersQuery = query(
        collection(db, 'orders'),
        where('userId', '==', firebaseUser?.uid),
        where('orderId', '==', orderId)
      );
      
      const querySnapshot = await getDocs(ordersQuery);
      
      if (!querySnapshot.empty) {
        const orderDoc = querySnapshot.docs[0];
        setOrderDetails(orderDoc.data() as OrderDetails);
      } else {
        console.error('Order not found');
        router.push('/store');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      router.push('/store');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
          <Link href="/store">
            <Button>Return to Store</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (date: any) => {
    if (!date) return '';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-xl text-gray-600 mb-4">
            Thank you for your order, {orderDetails.customerInfo.firstName}!
          </p>
          <p className="text-gray-600">
            Your order has been confirmed and we'll get started on your project right away.
          </p>
        </div>

        {/* Order Summary Card */}
        <Card className="mb-8">
          <CardHeader className="bg-green-50 border-b">
            <CardTitle className="flex items-center text-green-800">
              <Package className="h-5 w-5 mr-2" />
              Order #{orderDetails.orderId}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Order Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span>{formatDate(orderDetails.orderDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-semibold">${orderDetails.payment.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-mono text-xs">{orderDetails.payment.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {orderDetails.projectStatus.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span>{orderDetails.customerInfo.firstName} {orderDetails.customerInfo.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span>{orderDetails.customerInfo.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span>{orderDetails.customerInfo.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
              <div className="space-y-2">
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                    <div>
                      <span className="font-medium">{item.productName}</span>
                      <span className="text-gray-600 ml-2">× {item.quantity}</span>
                    </div>
                    <span className="font-semibold">${item.totalPrice.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's Next */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              What's Next?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-semibold text-blue-600">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Project Assignment</h4>
                  <p className="text-gray-600 text-sm">
                    We'll assign a dedicated developer to your project within 24 hours.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-semibold text-blue-600">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Initial Contact</h4>
                  <p className="text-gray-600 text-sm">
                    Your assigned developer will contact you to discuss project details and timeline.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-semibold text-blue-600">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Project Development</h4>
                  <p className="text-gray-600 text-sm">
                    We'll start working on your project and provide regular updates on progress.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-semibold text-green-600">4</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Delivery & Support</h4>
                  <p className="text-gray-600 text-sm">
                    Your completed project will be delivered with full documentation and ongoing support.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Support */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                <Mail className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-gray-900">Email Support</h4>
                  <p className="text-sm text-gray-600">support@aryantechsolution.com</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                <Phone className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="font-semibold text-gray-900">Phone Support</h4>
                  <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Order Reference:</strong> Please include your order number #{orderDetails.orderId} 
                when contacting support for faster assistance.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard">
            <Button className="w-full sm:w-auto flex items-center">
              <ArrowRight className="h-4 w-4 mr-2" />
              View Dashboard
            </Button>
          </Link>
          
          <Link href="/store">
            <Button variant="outline" className="w-full sm:w-auto flex items-center">
              <Home className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            className="w-full sm:w-auto flex items-center"
            onClick={() => window.print()}
          >
            <Download className="h-4 w-4 mr-2" />
            Print Receipt
          </Button>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            🎉 <strong>Thank you for choosing Aryan Tech Solution!</strong> 
            We're excited to work on your project and deliver exceptional results.
          </p>
        </div>
      </div>
    </div>
  );
}
