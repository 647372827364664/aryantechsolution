'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  DollarSign,
  Calendar,
  Package,
  CreditCard,
  Printer,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Truck,
  MapPin,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/components/providers/AuthProvider';
import { getUserOrders } from '@/lib/firebase';
import { useCurrency } from '@/lib/currency';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

interface OrderItem {
  name: string;
  price: number;
  quantity?: number;
  image?: string;
}

interface Order {
  id: string;
  orderId?: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  createdAt: Date | { toDate(): Date } | string;
  userId: string;
  currency?: string;
  paymentMethod?: string;
  shippingAddress?: {
    name?: string;
    email?: string;
    address?: string;
    city?: string;
    country?: string;
  };
  notes?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-50 border-green-200 text-green-700';
    case 'processing':
      return 'bg-blue-50 border-blue-200 text-blue-700';
    case 'pending':
      return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    case 'cancelled':
      return 'bg-red-50 border-red-200 text-red-700';
    case 'refunded':
      return 'bg-purple-50 border-purple-200 text-purple-700';
    default:
      return 'bg-gray-50 border-gray-200 text-gray-700';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case 'processing':
      return <Clock className="h-5 w-5 text-blue-600" />;
    case 'pending':
      return <Clock className="h-5 w-5 text-yellow-600" />;
    case 'cancelled':
      return <XCircle className="h-5 w-5 text-red-600" />;
    case 'refunded':
      return <AlertTriangle className="h-5 w-5 text-purple-600" />;
    default:
      return <ShoppingBag className="h-5 w-5 text-gray-600" />;
  }
};

const getStatusTextColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'text-green-700';
    case 'processing':
      return 'text-blue-700';
    case 'pending':
      return 'text-yellow-700';
    case 'cancelled':
      return 'text-red-700';
    case 'refunded':
      return 'text-purple-700';
    default:
      return 'text-gray-700';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Delivered';
    case 'processing':
      return 'On the way';
    case 'pending':
      return 'Pending';
    case 'cancelled':
      return 'Cancelled';
    case 'refunded':
      return 'Refunded';
    default:
      return status;
  }
};

const formatDate = (date: Date | { toDate(): Date } | string) => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date instanceof Date ? date : date.toDate?.();
    if (!dateObj) return 'N/A';
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'N/A';
  }
};

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { formatPrice } = useCurrency();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/auth/login?redirect=/orders');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const userId = (user as any).uid || user?.email;
        if (!userId) {
          toast.error('User ID not found');
          return;
        }
        const userOrders = await getUserOrders(userId);
        setOrders(userOrders as Order[]);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, authLoading, router]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handlePrint = (orderId: string) => {
    const printWindow = window.open('', '', 'width=800,height=600');
    const order = orders.find(o => o.id === orderId);
    if (printWindow && order) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Order ${order.orderId || orderId}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
              .order-id { font-size: 24px; font-weight: bold; margin: 10px 0; }
              .status { padding: 5px 10px; background: #f0f0f0; border-radius: 4px; display: inline-block; }
              .items { margin: 20px 0; }
              .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
              .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; padding-top: 20px; border-top: 2px solid #333; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Order Receipt</h1>
              <div class="order-id">Order: ${order.orderId || orderId}</div>
              <div class="status">${order.status}</div>
              <div>Date: ${formatDate(order.createdAt)}</div>
            </div>
            <div class="items">
              <h2>Items</h2>
              ${order.items.map(item => `
                <div class="item">
                  <span>${item.name} ${item.quantity ? `x${item.quantity}` : ''}</span>
                  <span>${formatPrice(item.price)}</span>
                </div>
              `).join('')}
            </div>
            <div class="total">
              Total: ${formatPrice(order.totalAmount)}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Link href="/dashboard" className="hover:opacity-70">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">My Purchases</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search orders</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search by order ID or item name..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by status</label>
              <div className="flex flex-wrap gap-2">
                {['all', 'pending', 'processing', 'completed', 'cancelled', 'refunded'].map(status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      statusFilter === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6">
              {orders.length === 0
                ? "You haven't placed any orders yet. Start shopping now!"
                : 'No orders match your search or filter.'}
            </p>
            <Link href="/store">
              <Button className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                {/* Order Header */}
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${getStatusColor(order.status)} border border-current`}>
                        {getStatusIcon(order.status)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            Order #{order.orderId || order.id.substring(0, 8).toUpperCase()}
                          </h3>
                          <span className={`text-sm font-medium ${getStatusTextColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(order.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Package className="h-4 w-4" />
                            {order.items.length} item{order.items.length > 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">{formatPrice(order.totalAmount)}</div>
                      <ChevronDown className={`h-5 w-5 text-gray-400 ml-auto mt-2 transition-transform ${
                        expandedOrder === order.id ? 'rotate-180' : ''
                      }`} />
                    </div>
                  </div>

                  {/* Quick Preview */}
                  {order.items.length > 0 && (
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex-shrink-0">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <Package className="h-8 w-8 text-gray-400" />
                            )}
                          </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">+{order.items.length - 3}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Expanded Details */}
                {expandedOrder === order.id && (
                  <div className="border-t border-gray-200 bg-gray-50">
                    {/* Order Status Timeline */}
                    {(order.status === 'processing' || order.status === 'completed') && (
                      <div className="p-4 border-b border-gray-200 bg-white">
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900 mb-2">Order Status</div>
                            <div className="flex gap-2">
                              <div className="flex flex-col items-center gap-1 flex-1">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                  <CheckCircle className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-xs text-gray-600">Ordered</span>
                              </div>
                              <div className={`flex-1 h-1 my-3 ${order.status === 'processing' || order.status === 'completed' ? 'bg-blue-600' : 'bg-gray-300'}`} />
                              <div className="flex flex-col items-center gap-1 flex-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  order.status === 'processing' || order.status === 'completed'
                                    ? 'bg-blue-600'
                                    : 'bg-gray-300'
                                }`}>
                                  <Truck className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-xs text-gray-600">Shipped</span>
                              </div>
                              <div className={`flex-1 h-1 my-3 ${order.status === 'completed' ? 'bg-blue-600' : 'bg-gray-300'}`} />
                              <div className="flex flex-col items-center gap-1 flex-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  order.status === 'completed' ? 'bg-blue-600' : 'bg-gray-300'
                                }`}>
                                  <CheckCircle className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-xs text-gray-600">Delivered</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Items */}
                    <div className="p-4 border-b border-gray-200 bg-white">
                      <h4 className="font-semibold text-gray-900 mb-4">Items in this order</h4>
                      <div className="space-y-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex gap-4">
                            <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <Package className="h-10 w-10 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{item.name}</h5>
                              {item.quantity && (
                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                              )}
                              <p className="text-sm font-semibold text-gray-900 mt-1">{formatPrice(item.price)}</p>
                            </div>
                            <Button variant="ghost" size="sm" className="gap-2">
                              <Star className="h-4 w-4" />
                              Rate
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    {order.shippingAddress && (
                      <div className="p-4 border-b border-gray-200 bg-white">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          Delivery Address
                        </h4>
                        <div className="text-sm text-gray-700 space-y-1">
                          {order.shippingAddress.name && (
                            <div className="font-medium">{order.shippingAddress.name}</div>
                          )}
                          {order.shippingAddress.address && (
                            <div>{order.shippingAddress.address}</div>
                          )}
                          {order.shippingAddress.city && (
                            <div>
                              {order.shippingAddress.city}
                              {order.shippingAddress.country && `, ${order.shippingAddress.country}`}
                            </div>
                          )}
                          {order.shippingAddress.email && (
                            <div className="text-gray-600">{order.shippingAddress.email}</div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Order Summary */}
                    <div className="p-4 border-b border-gray-200 bg-white">
                      <h4 className="font-semibold text-gray-900 mb-3">Price Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="text-gray-900">{formatPrice(order.totalAmount)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-t border-gray-200 font-semibold">
                          <span className="text-gray-900">Total Amount</span>
                          <span className="text-blue-600">{formatPrice(order.totalAmount)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4 bg-white flex gap-3 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePrint(order.id)}
                        className="gap-2"
                      >
                        <Printer className="h-4 w-4" />
                        Print
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Invoice
                      </Button>
                      {order.status === 'completed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          Reorder
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
