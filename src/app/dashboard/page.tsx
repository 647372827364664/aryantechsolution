'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BarChart3,
  TrendingUp,
  DollarSign,
  Server,
  Bell,
  AlertTriangle,
  Package,
  Calendar,
  Activity,
  Settings,
  LogOut,
  RefreshCw,
  Eye,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  CreditCard,
  FileText,
  Plus,
  Filter,
  Search,
  Download,
  MoreVertical,
  ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/providers/AuthProvider';
import { 
  logOut, 
  getUserOrders, 
  getUserAlerts,
  getUserServices,
  getUserProfile,
  markAlertAsRead,
  createUserDocument
} from '@/lib/firebase';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { useCurrency } from '@/lib/currency';

// Enhanced interfaces with better typing
interface Order {
  id: string;
  orderId?: string;
  items: Array<{
    name: string;
    price: number;
    quantity?: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  createdAt: Date | { toDate(): Date } | string;
  userId: string;
  currency?: string;
  paymentMethod?: string;
}

interface Service {
  id: string;
  name: string;
  type: 'vps' | 'domain' | 'minecraft' | 'bot' | 'hosting' | 'custom';
  status: 'active' | 'suspended' | 'pending' | 'expired';
  expiryDate?: Date | { toDate(): Date } | string;
  createdAt: Date | { toDate(): Date } | string;
  price: number;
  renewalPrice?: number;
  features?: string[];
  specs?: {
    cpu?: string;
    ram?: string;
    storage?: string;
    bandwidth?: string;
  };
  uptime?: number;
  lastActivity?: Date | { toDate(): Date } | string;
}

interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'renewal';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date | { toDate(): Date } | string;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  userId: string;
}

interface UserProfile {
  displayName: string;
  email: string;
  phone?: string;
  company?: string;
  avatar?: string;
  preferences?: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
    maintenanceAlerts: boolean;
  };
}

interface DashboardStats {
  totalOrders: number;
  totalSpent: number;
  activeServices: number;
  expiringServices: number;
  unreadAlerts: number;
  monthlySpend: number;
  avgOrderValue: number;
  successRate: number;
}

export default function ProfessionalDashboard() {
  const { user, firebaseUser } = useAuth();
  const router = useRouter();
  const { formatPrice } = useCurrency();

  // Test mode for development (remove in production)
  const [testMode, setTestMode] = useState(false);

  // State management
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalSpent: 0,
    activeServices: 0,
    expiringServices: 0,
    unreadAlerts: 0,
    monthlySpend: 0,
    avgOrderValue: 0,
    successRate: 0
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'services' | 'alerts'>('overview');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Authentication check
  useEffect(() => {
    // Check for test mode in URL
    const urlParams = new URLSearchParams(window.location.search);
    const isTestMode = urlParams.get('test') === 'true';
    
    if (isTestMode) {
      setTestMode(true);
      generateTestData();
      return;
    }
    
    // Allow test mode bypass for development
    if (testMode) {
      generateTestData();
      return;
    }
    
    if (!user || !firebaseUser) {
      router.push('/auth/login?redirect=/dashboard');
      return;
    }
    initializeDashboard();
  }, [user, firebaseUser, testMode]);

  // Generate test data for development
  const generateTestData = () => {
    setLoading(false);
    
    // Test orders
    const testOrders: Order[] = [
      {
        id: '1',
        orderId: 'ORD-001',
        items: [{ name: 'VPS Hosting', price: 29.99 }],
        totalAmount: 29.99,
        status: 'completed',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        userId: 'test'
      },
      {
        id: '2',
        orderId: 'ORD-002', 
        items: [{ name: 'Domain Registration', price: 12.99 }],
        totalAmount: 12.99,
        status: 'processing',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        userId: 'test'
      }
    ];

    // Test services
    const testServices: Service[] = [
      {
        id: '1',
        name: 'Main VPS Server',
        type: 'vps',
        status: 'active',
        price: 29.99,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        specs: {
          cpu: '2 vCPU',
          ram: '4GB',
          storage: '80GB SSD'
        }
      },
      {
        id: '2',
        name: 'example.com',
        type: 'domain',
        status: 'active',
        price: 12.99,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        expiryDate: new Date(Date.now() + 340 * 24 * 60 * 60 * 1000)
      }
    ];

    // Test alerts
    const testAlerts: Alert[] = [
      {
        id: '1',
        title: 'Server Maintenance Complete',
        message: 'Your VPS server maintenance has been completed successfully.',
        type: 'success',
        priority: 'medium',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false,
        userId: 'test'
      },
      {
        id: '2',
        title: 'Domain Expiring Soon',
        message: 'Your domain example.com will expire in 30 days. Please renew to avoid service interruption.',
        type: 'warning',
        priority: 'high',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        read: false,
        userId: 'test',
        actionUrl: '/domains',
        actionText: 'Renew Domain'
      }
    ];

    setOrders(testOrders);
    setServices(testServices);
    setAlerts(testAlerts);
    setUserProfile({
      displayName: 'Test User',
      email: 'test@example.com',
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        marketingEmails: true,
        maintenanceAlerts: true
      }
    });

    calculateStats(testOrders, testServices, testAlerts);
    toast.success('Test data loaded successfully');
  };

  // Initialize dashboard
  const initializeDashboard = async () => {
    if (!firebaseUser) return;
    
    try {
      setLoading(true);
      
      // Create user document if needed
      await createUserDocument(firebaseUser);
      
      // Fetch all data
      await fetchDashboardData();
      
    } catch (error) {
      console.error('Error initializing dashboard:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    if (!firebaseUser) return;

    try {
      // Fetch data in parallel with individual error handling
      const [ordersResult, servicesResult, alertsResult, profileResult] = await Promise.allSettled([
        getUserOrders(firebaseUser.uid),
        getUserServices(firebaseUser.uid),
        getUserAlerts(firebaseUser.uid, 50),
        getUserProfile(firebaseUser.uid)
      ]);

      // Process orders
      const ordersData = ordersResult.status === 'fulfilled' ? ordersResult.value : [];
      setOrders(ordersData as Order[]);

      // Process services
      const servicesData = servicesResult.status === 'fulfilled' ? servicesResult.value : [];
      setServices(servicesData as Service[]);

      // Process alerts
      const alertsData = alertsResult.status === 'fulfilled' ? alertsResult.value : [];
      setAlerts(alertsData as Alert[]);

      // Process profile
      const profileData = profileResult.status === 'fulfilled' ? profileResult.value : null;
      if (profileData) {
        setUserProfile(profileData as unknown as UserProfile);
      } else {
        // Create basic profile
        setUserProfile({
          displayName: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          preferences: {
            emailNotifications: true,
            smsNotifications: false,
            marketingEmails: true,
            maintenanceAlerts: true
          }
        });
      }

      // Calculate stats
      calculateStats(ordersData, servicesData, alertsData);

      toast.success('Dashboard updated successfully');

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Some data could not be loaded');
    }
  };

  // Calculate dashboard statistics
  const calculateStats = (ordersData: any[], servicesData: any[], alertsData: any[]) => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

    // Filter based on time range
    const getDateFromData = (dateField: any) => {
      if (!dateField) return new Date(0);
      if (dateField instanceof Date) return dateField;
      if (typeof dateField === 'string') return new Date(dateField);
      if (dateField.toDate) return dateField.toDate();
      return new Date(0);
    };

    const rangeDate = timeRange === '7d' ? sevenDaysAgo : 
                     timeRange === '30d' ? thirtyDaysAgo :
                     timeRange === '90d' ? new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000)) :
                     new Date(now.getTime() - (365 * 24 * 60 * 60 * 1000));

    const recentOrders = ordersData.filter(order => 
      getDateFromData(order.createdAt) >= rangeDate
    );

    const totalSpent = recentOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const activeServices = servicesData.filter(service => service.status === 'active').length;
    const expiringServices = servicesData.filter(service => {
      if (!service.expiryDate) return false;
      const expiryDate = getDateFromData(service.expiryDate);
      const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
      return expiryDate <= thirtyDaysFromNow && expiryDate > now;
    }).length;

    const unreadAlerts = alertsData.filter(alert => !alert.read).length;
    const completedOrders = recentOrders.filter(order => order.status === 'completed').length;
    const successRate = recentOrders.length > 0 ? (completedOrders / recentOrders.length) * 100 : 100;

    setStats({
      totalOrders: recentOrders.length,
      totalSpent,
      activeServices,
      expiringServices,
      unreadAlerts,
      monthlySpend: totalSpent,
      avgOrderValue: recentOrders.length > 0 ? totalSpent / recentOrders.length : 0,
      successRate
    });
  };

  // Refresh dashboard
  const refreshDashboard = async () => {
    setRefreshing(true);
    try {
      await fetchDashboardData();
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
      toast.error('Failed to refresh dashboard');
    } finally {
      setRefreshing(false);
    }
  };

  // Mark alert as read
  const handleMarkAlertRead = async (alertId: string) => {
    try {
      await markAlertAsRead(alertId);
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, read: true } : alert
      ));
      toast.success('Alert marked as read');
    } catch (error) {
      console.error('Error marking alert as read:', error);
      toast.error('Failed to mark alert as read');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logOut();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  // Setup demo data
  const setupDemoData = async () => {
    if (!firebaseUser) {
      toast.error('Please log in first');
      return;
    }

    try {
      setLoading(true);
      toast.loading('Setting up demo data...');
      
      const response = await fetch('/api/setup-demo-dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: firebaseUser.uid,
          userEmail: firebaseUser.email 
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.dismiss();
      toast.success('Demo data created! Refreshing dashboard...');
      
      setTimeout(() => {
        fetchDashboardData();
      }, 1000);
      
    } catch (error) {
      console.error('Error setting up demo data:', error);
      toast.dismiss();
      toast.error('Failed to set up demo data');
    } finally {
      setLoading(false);
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
      case 'processing':
        return 'text-yellow-600 bg-yellow-100';
      case 'suspended':
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'expired':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Get alert icon
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'renewal':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  // Format date
  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    const d = date instanceof Date ? date : 
              typeof date === 'string' ? new Date(date) :
              date.toDate ? date.toDate() : new Date();
    return d.toLocaleDateString();
  };

  // Format relative time
  const formatRelativeTime = (date: any) => {
    if (!date) return 'N/A';
    const d = date instanceof Date ? date : 
              typeof date === 'string' ? new Date(date) :
              date.toDate ? date.toDate() : new Date();
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return formatDate(d);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Toaster position="top-right" />
        
        {/* Loading Skeleton */}
        <div className="animate-pulse">
          {/* Header Skeleton */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="h-8 w-32 bg-gray-200 rounded"></div>
              <div className="flex space-x-3">
                <div className="h-10 w-24 bg-gray-200 rounded"></div>
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="h-4 w-20 bg-gray-200 rounded mb-3"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-3">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="h-4 bg-gray-200 rounded w-full"></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="h-6 w-24 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-3">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="h-12 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {userProfile?.displayName || 'User'}!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Test Mode Toggle (Development Only) */}
              {process.env.NODE_ENV === 'development' && (
                <Button
                  onClick={() => setTestMode(!testMode)}
                  variant={testMode ? "primary" : "outline"}
                  size="sm"
                  className={testMode ? "bg-green-600 hover:bg-green-700" : "border-green-200 text-green-700 hover:bg-green-50"}
                >
                  {testMode ? 'Test Mode ON' : 'Enable Test Mode'}
                </Button>
              )}

              {/* Time Range Selector */}
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Select time range for dashboard data"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>

              {/* Demo Data Button */}
              {orders.length === 0 && services.length === 0 && (
                <Button
                  onClick={setupDemoData}
                  variant="outline"
                  size="sm"
                  className="border-green-200 text-green-700 hover:bg-green-50"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Demo Data
                </Button>
              )}

              {/* Refresh Button */}
              <Button
                onClick={refreshDashboard}
                variant="outline"
                size="sm"
                disabled={refreshing}
                className="flex items-center"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>

              {/* Profile Menu */}
              <div className="relative">
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="flex items-center text-red-600 border-red-200 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Orders</p>
                  <p className="text-3xl font-bold">{stats.totalOrders}</p>
                  <p className="text-blue-100 text-xs">Last {timeRange}</p>
                </div>
                <ShoppingBag className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Spent</p>
                  <p className="text-3xl font-bold">{formatPrice(stats.totalSpent)}</p>
                  <p className="text-green-100 text-xs">Avg: {formatPrice(stats.avgOrderValue)}</p>
                </div>
                <DollarSign className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Active Services</p>
                  <p className="text-3xl font-bold">{stats.activeServices}</p>
                  <p className="text-purple-100 text-xs">{stats.expiringServices} expiring soon</p>
                </div>
                <Server className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Alerts</p>
                  <p className="text-3xl font-bold">{stats.unreadAlerts}</p>
                  <p className="text-orange-100 text-xs">Success: {stats.successRate.toFixed(1)}%</p>
                </div>
                <Bell className="h-12 w-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'orders', label: 'Orders', icon: ShoppingBag },
                { id: 'services', label: 'Services', icon: Server },
                { id: 'alerts', label: 'Alerts', icon: Bell }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center py-4 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.label}
                    {tab.id === 'alerts' && stats.unreadAlerts > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                        {stats.unreadAlerts}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Recent Orders</span>
                      <Link href="/orders">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View All
                        </Button>
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {orders.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No orders yet</p>
                        <p className="text-sm">Start by browsing our services</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.slice(0, 5).map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium">Order #{order.orderId || order.id.slice(0, 8)}</p>
                              <p className="text-sm text-gray-500">{formatRelativeTime(order.createdAt)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{formatPrice(order.totalAmount)}</p>
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Active Services */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Active Services</span>
                      <Link href="/services">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Manage
                        </Button>
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {services.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Server className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No services yet</p>
                        <p className="text-sm">Get started with our hosting plans</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {services.slice(0, 5).map((service) => (
                          <div key={service.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium">{service.name}</p>
                              <p className="text-sm text-gray-500">{service.type}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{formatPrice(service.price)}</p>
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                                {service.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">All Orders</h3>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-16">
                    <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-gray-300" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
                    <Link href="/services">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Browse Services
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Order ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Items
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  #{order.orderId || order.id.slice(0, 8)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {formatDate(order.createdAt)}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">
                                  {order.items.map(item => item.name).join(', ')}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {formatPrice(order.totalAmount)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">My Services</h3>
                  <Link href="/services">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Service
                    </Button>
                  </Link>
                </div>

                {services.length === 0 ? (
                  <div className="text-center py-16">
                    <Server className="h-16 w-16 mx-auto mb-6 text-gray-300" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No services yet</h3>
                    <p className="text-gray-500 mb-6">Get started with our hosting services</p>
                    <Link href="/services">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Browse Services
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                      <Card key={service.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{service.name}</CardTitle>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                              {service.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 capitalize">{service.type}</p>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Price</span>
                              <span className="font-medium">{formatPrice(service.price)}</span>
                            </div>
                            {service.expiryDate && (
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Expires</span>
                                <span className="font-medium">{formatDate(service.expiryDate)}</span>
                              </div>
                            )}
                            {service.specs && (
                              <div className="pt-2 border-t">
                                <p className="text-xs text-gray-500 mb-2">Specifications</p>
                                <div className="text-xs space-y-1">
                                  {service.specs.cpu && <p>CPU: {service.specs.cpu}</p>}
                                  {service.specs.ram && <p>RAM: {service.specs.ram}</p>}
                                  {service.specs.storage && <p>Storage: {service.specs.storage}</p>}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-2 mt-4">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Settings className="h-4 w-4 mr-2" />
                              Manage
                            </Button>
                            <Button variant="outline" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Alerts Tab */}
            {activeTab === 'alerts' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Notifications & Alerts</h3>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </div>

                {alerts.length === 0 ? (
                  <div className="text-center py-16">
                    <Bell className="h-16 w-16 mx-auto mb-6 text-gray-300" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No alerts</h3>
                    <p className="text-gray-500">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {alerts.map((alert) => (
                      <Card key={alert.id} className={`${!alert.read ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">
                              {getAlertIcon(alert.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
                                <div className="flex items-center space-x-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    alert.priority === 'high' ? 'bg-red-100 text-red-700' :
                                    alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-green-100 text-green-700'
                                  }`}>
                                    {alert.priority}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {formatRelativeTime(alert.createdAt)}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                              <div className="flex items-center space-x-3 mt-3">
                                {alert.actionUrl && alert.actionText && (
                                  <Link href={alert.actionUrl}>
                                    <Button variant="outline" size="sm">
                                      {alert.actionText}
                                    </Button>
                                  </Link>
                                )}
                                {!alert.read && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleMarkAlertRead(alert.id)}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Mark as Read
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
