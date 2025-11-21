'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  DollarSign, 
  Clock, 
  User,
  ShoppingBag,
  LogOut,
  Server,
  AlertTriangle,
  Bell,
  RefreshCw,
  CheckCircle,
  XCircle,
  TrendingUp,
  Shield,
  Activity,
  FileText,
  Settings,
  CreditCard,
  Package,
  Calendar,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/providers/AuthProvider';
import { 
  logOut, 
  getUserOrders, 
  getUserAlerts,
  getUserServices,
  getUserDashboardStats,
  getUserProfile,
  updateUserProfile,
  markAlertAsRead,
  createUserDocument,
  db
} from '@/lib/firebase';
import { onSnapshot, collection, query, where, orderBy } from 'firebase/firestore';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { useCurrency } from '@/lib/currency';

interface Order {
  id: string;
  orderId: string;
  orderDate: Date | { toDate(): Date } | string;
  payment: {
    totalAmount: number;
  };
  projectStatus: string;
  items: Array<{
    name: string;
    price: number;
  }>;
  status: string;
  userId: string;
  total?: number;
  createdAt?: Date | { toDate(): Date } | string;
}

interface Service {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'suspended' | 'pending' | 'cancelled';
  expiryDate?: Date | { toDate(): Date } | string;
  price: number;
  features: string[];
  lastActivity?: Date | { toDate(): Date } | string;
  uptime?: number;
  ssl?: boolean;
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
  createdBy?: string;
}

interface UserProfile {
  displayName: string;
  email: string;
  phone?: string;
  company?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
    maintenanceAlerts: boolean;
  };
}

export default function DashboardPage() {
  const { user, firebaseUser } = useAuth();
  const { formatPrice, convertFromUSD } = useCurrency();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'error'>('connecting');
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'orders' | 'alerts' | 'profile'>('overview');
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [unsubscribers, setUnsubscribers] = useState<(() => void)[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    activeServices: 0,
    expiringServices: 0,
    unreadAlerts: 0,
    monthlySpend: 0
  });

  useEffect(() => {
    if (!user || !firebaseUser) {
      router.push('/auth/login?redirect=/dashboard');
      return;
    }

    // Simple initialization and data fetch
    initializeDashboard();
  }, [user, firebaseUser]);

  // Simplified dashboard initialization
  const initializeDashboard = async () => {
    if (!firebaseUser) return;
    
    try {
      setLoading(true);
      setConnectionStatus('connecting');
      
      // Initialize user document if needed
      await createUserDocument(firebaseUser);
      
      // Fetch initial data with timeout protection
      await Promise.race([
        fetchAllData(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Dashboard loading timeout')), 15000)
        )
      ]);
      
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Error initializing dashboard:', error);
      setConnectionStatus('error');
      if (error instanceof Error && error.message?.includes('timeout')) {
        toast.error('Dashboard is taking longer than expected. Please try refreshing.');
      } else {
        toast.error('Failed to load dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  // Initialize user data in Firebase if it doesn't exist
  const initializeUserData = async () => {
    if (!firebaseUser) return;
    
    try {
      await createUserDocument(firebaseUser);
    } catch (error) {
      console.error('Error initializing user data:', error);
    }
  };

  // Set up real-time listeners for live data updates
  const setupRealTimeListeners = () => {
    if (!firebaseUser || !db) return;

    const newUnsubscribers: (() => void)[] = [];

    try {
      // Listen to user orders
      const ordersQuery = query(
        collection(db, 'orders'),
        where('userId', '==', firebaseUser.uid),
        orderBy('createdAt', 'desc')
      );
      
      const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
        const ordersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(ordersData as Order[]);
        setLastRefresh(new Date());
      });
      newUnsubscribers.push(unsubscribeOrders);

      // Listen to user services
      const servicesQuery = query(
        collection(db, 'userServices'),
        where('userId', '==', firebaseUser.uid)
      );
      
      const unsubscribeServices = onSnapshot(servicesQuery, (snapshot) => {
        const servicesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setServices(servicesData as Service[]);
        setLastRefresh(new Date());
      });
      newUnsubscribers.push(unsubscribeServices);

      // Listen to user alerts
      const alertsQuery = query(
        collection(db, 'userAlerts'),
        where('userId', '==', firebaseUser.uid),
        orderBy('createdAt', 'desc')
      );
      
      const unsubscribeAlerts = onSnapshot(alertsQuery, (snapshot) => {
        const alertsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAlerts(alertsData as Alert[]);
        setLastRefresh(new Date());
      });
      newUnsubscribers.push(unsubscribeAlerts);

      setUnsubscribers(newUnsubscribers);
      setConnectionStatus('connected');
      toast.success('Real-time dashboard connected');

      // Calculate stats whenever data changes
      calculateStats();

    } catch (error) {
      console.error('Error setting up real-time listeners:', error);
      setConnectionStatus('error');
      toast.error('Failed to connect real-time updates');
      // Fallback to regular fetch
      fetchAllData();
    }
  };

  // Calculate dashboard stats from current data
  const calculateStats = () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum: number, order: Order) => {
      const amount = order.payment?.totalAmount || (order as any).total || 0;
      return sum + amount;
    }, 0);
    
    const monthlySpend = orders
      .filter((order: Order) => {
        const orderDate = order.orderDate instanceof Date ? order.orderDate :
                         (order.orderDate as any)?.toDate ? (order.orderDate as any).toDate() :
                         typeof order.orderDate === 'string' ? new Date(order.orderDate) : new Date();
        return orderDate >= thirtyDaysAgo;
      })
      .reduce((sum: number, order: Order) => {
        const amount = order.payment?.totalAmount || (order as any).total || 0;
        return sum + amount;
      }, 0);

    const activeServices = services.filter((s: Service) => s.status === 'active').length;
    const expiringServices = services.filter((s: Service) => {
      if (!s.expiryDate && !(s as any).expiresAt) return false;
      const expiry = s.expiryDate instanceof Date ? s.expiryDate :
                    (s.expiryDate as any)?.toDate ? (s.expiryDate as any).toDate() :
                    (s as any).expiresAt?.toDate ? (s as any).expiresAt.toDate() :
                    new Date((s as any).expiresAt || s.expiryDate);
      return expiry <= new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
    }).length;

    const unreadAlerts = alerts.filter((a: Alert) => !a.read).length;

    setStats({
      totalOrders,
      totalSpent,
      activeServices,
      expiringServices,
      unreadAlerts,
      monthlySpend
    });
  };

  // Demo data setup function
  const setupDemoData = async () => {
    if (!firebaseUser) return;
    
    try {
      setLoading(true);
      toast.loading('Setting up demo data...');
      
      const response = await fetch('/api/setup-demo-dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: firebaseUser.uid })
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Demo data created successfully!');
        // Refresh the dashboard
        await fetchAllData();
      } else {
        toast.error('Failed to create demo data');
      }
    } catch (error) {
      console.error('Error setting up demo data:', error);
      toast.error('Failed to create demo data');
    } finally {
      setLoading(false);
    }
  };

  // Export dashboard data as JSON
  const exportDashboardData = () => {
    const dashboardData = {
      userProfile,
      stats,
      orders,
      services,
      alerts,
      exportedAt: new Date().toISOString(),
      exportedBy: firebaseUser?.email || 'Unknown'
    };

    const dataStr = JSON.stringify(dashboardData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Dashboard data exported successfully');
  };

  const fetchAllData = async () => {
    if (!firebaseUser) {
      setLoading(false);
      return;
    }

    try {
      // Don't set loading to true if already loading to prevent infinite loops
      if (!loading) {
        setLoading(true);
      }
      
      console.log('Fetching dashboard data for user:', firebaseUser.uid);
      
      // Fetch all data with timeout protection and better error handling
      const fetchWithTimeout = (promise: Promise<any>, timeout = 15000) => {
        return Promise.race([
          promise,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), timeout)
          )
        ]);
      };

      // Fetch data with individual error handling
      const [ordersResult, servicesResult, alertsResult, userProfileResult] = await Promise.allSettled([
        fetchWithTimeout(getUserOrders(firebaseUser.uid)),
        fetchWithTimeout(getUserServices(firebaseUser.uid)),
        fetchWithTimeout(getUserAlerts(firebaseUser.uid, 20)),
        fetchWithTimeout(getUserProfile(firebaseUser.uid))
      ]);

      // Process orders
      const ordersData = ordersResult.status === 'fulfilled' ? ordersResult.value : [];
      console.log('Orders data:', ordersData);
      setOrders(ordersData as Order[]);

      // Process services
      const servicesData = servicesResult.status === 'fulfilled' ? servicesResult.value : [];
      console.log('Services data:', servicesData);
      setServices(servicesData as Service[]);

      // Process alerts
      const alertsData = alertsResult.status === 'fulfilled' ? alertsResult.value : [];
      console.log('Alerts data:', alertsData);
      setAlerts(alertsData as Alert[]);
      
      // Handle user profile with fallback
      let userProfileData = null;
      if (userProfileResult.status === 'fulfilled') {
        userProfileData = userProfileResult.value;
      }
      
      if (userProfileData && typeof userProfileData === 'object' && 'displayName' in userProfileData && 'email' in userProfileData) {
        setUserProfile(userProfileData as unknown as UserProfile);
      } else {
        // Create a basic profile from Firebase user data
        const basicProfile: UserProfile = {
          displayName: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          preferences: {
            emailNotifications: true,
            smsNotifications: false,
            marketingEmails: true,
            maintenanceAlerts: true
          }
        };
        setUserProfile(basicProfile);
      }
      
      // Calculate stats from fetched data
      calculateStatsFromData(ordersData, servicesData, alertsData);
      
      setConnectionStatus('connected');
      setLastRefresh(new Date());

      // Show success toast if data was fetched
      const totalItems = ordersData.length + servicesData.length + alertsData.length;
      if (totalItems > 0) {
        toast.success(`Dashboard loaded with ${totalItems} items`);
      } else {
        toast.success('Dashboard loaded successfully');
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setConnectionStatus('error');
      
      // Set empty fallback data
      setOrders([]);
      setServices([]);
      setAlerts([]);
      setStats({
        totalOrders: 0,
        totalSpent: 0,
        activeServices: 0,
        expiringServices: 0,
        unreadAlerts: 0,
        monthlySpend: 0
      });

      toast.error('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats from data without causing re-renders
  const calculateStatsFromData = (ordersData: any[], servicesData: any[], alertsData: any[]) => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    const totalOrders = ordersData.length;
    const totalSpent = ordersData.reduce((sum: number, order: any) => {
      const amount = order.payment?.totalAmount || order.total || 0;
      return sum + amount;
    }, 0);
    
    const monthlySpend = ordersData
      .filter((order: any) => {
        const orderDate = order.orderDate instanceof Date ? order.orderDate :
                         (order.orderDate as any)?.toDate ? (order.orderDate as any).toDate() :
                         typeof order.orderDate === 'string' ? new Date(order.orderDate) : new Date();
        return orderDate >= thirtyDaysAgo;
      })
      .reduce((sum: number, order: any) => {
        const amount = order.payment?.totalAmount || order.total || 0;
        return sum + amount;
      }, 0);

    const activeServices = servicesData.filter((s: any) => s.status === 'active').length;
    const expiringServices = servicesData.filter((s: any) => {
      if (!s.expiryDate && !s.expiresAt) return false;
      const expiry = s.expiryDate instanceof Date ? s.expiryDate :
                    (s.expiryDate as any)?.toDate ? (s.expiryDate as any).toDate() :
                    s.expiresAt?.toDate ? s.expiresAt.toDate() :
                    new Date(s.expiresAt || s.expiryDate);
      return expiry <= new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
    }).length;

    const unreadAlerts = alertsData.filter((a: any) => !a.read).length;

    setStats({
      totalOrders,
      totalSpent,
      activeServices,
      expiringServices,
      unreadAlerts,
      monthlySpend
    });
  };

  // Handle alert actions
  const handleMarkAsRead = async (alertId: string) => {
    try {
      await markAlertAsRead(alertId);
      // Update local state
      setAlerts(prev => prev.map(alert =>
        alert.id === alertId ? { ...alert, read: true } : alert
      ));
      toast.success('Alert marked as read');
    } catch (error) {
      console.error('Error marking alert as read:', error);
      toast.error('Failed to mark alert as read');
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (profileData: UserProfile) => {
    if (!firebaseUser) return;
    
    try {
      await updateUserProfile(firebaseUser.uid, profileData);
      setUserProfile({ ...userProfile, ...profileData } as UserProfile);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  // Refresh all data
  const refreshDashboard = async () => {
    if (!firebaseUser) return;
    
    setLoading(true);
    try {
      await fetchAllData();
      toast.success('Dashboard refreshed');
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
      toast.error('Failed to refresh dashboard');
    }
  };

  // Retry dashboard initialization
  const retryInitialization = async () => {
    if (!firebaseUser) return;
    
    setLoading(true);
    setConnectionStatus('connecting');
    toast.loading('Retrying dashboard initialization...');
    
    try {
      await initializeDashboard();
      toast.dismiss();
      toast.success('Dashboard loaded successfully');
    } catch (error) {
      console.error('Error retrying initialization:', error);
      toast.dismiss();
      toast.error('Failed to retry. Please refresh the page.');
    }
  };

  // Format date helper function
  const formatDate = (date: Date | { toDate(): Date } | string | undefined): string => {
    if (!date) return 'Unknown';
    
    try {
      let dateObj: Date;
      if (typeof date === 'string') {
        dateObj = new Date(date);
      } else if (date && typeof date === 'object' && 'toDate' in date) {
        dateObj = date.toDate();
      } else {
        dateObj = date as Date;
      }
      
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        
        {/* Header Skeleton */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Skeleton */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
                  <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>

            {/* Main Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow animate-pulse">
                  <div className="p-6">
                    <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-3">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="h-4 bg-gray-200 rounded w-full"></div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (connectionStatus === 'error') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              </div>
            </div>
          </div>
        </header>

        {/* Error Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load Dashboard</h3>
              <p className="text-gray-500 mb-6">
                We're having trouble connecting to your dashboard. This could be due to a network issue or temporary server problem.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={retryInitialization}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Real-time Toggle */}
              <Button
                variant={realTimeEnabled ? "secondary" : "outline"}
                size="sm"
                onClick={() => setRealTimeEnabled(!realTimeEnabled)}
                className="flex items-center gap-2"
              >
                <Activity className={`h-4 w-4 ${realTimeEnabled ? 'text-white' : 'text-blue-600'}`} />
                {realTimeEnabled ? 'Live' : 'Static'}
              </Button>

              {/* Demo Data Button (show only if no data) */}
              {orders.length === 0 && services.length === 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={setupDemoData}
                  disabled={loading}
                  className="flex items-center gap-2 border-green-200 text-green-600 hover:bg-green-50"
                >
                  <Package className="h-4 w-4" />
                  Demo Data
                </Button>
              )}
              
              {/* Connection Status Indicator */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-green-500' :
                  connectionStatus === 'connecting' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`} />
                <span className="text-xs text-gray-600">
                  {connectionStatus === 'connected' ? (realTimeEnabled ? 'Live' : 'Connected') :
                   connectionStatus === 'connecting' ? 'Connecting...' :
                   'Connection Error'}
                </span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={refreshDashboard}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Refreshing...' : 'Refresh'}
              </Button>

              {/* Demo Data Button (show if no data exists) */}
              {orders.length === 0 && services.length === 0 && alerts.length === 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={setupDemoData}
                  disabled={loading}
                  className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50"
                >
                  <Package className="h-4 w-4" />
                  Setup Demo Data
                </Button>
              )}

              {/* Export Data Button */}
              {(orders.length > 0 || services.length > 0) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportDashboardData}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Export
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Welcome back, {userProfile?.displayName || firebaseUser?.displayName || 'User'}!
              </h2>
              <p className="text-gray-600 mt-2">
                Here's what's happening with your account today.
              </p>
            </div>
            <div className="text-right text-sm text-gray-500">
              <p>Last updated:</p>
              <p className="font-medium">
                {lastRefresh.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-blue-600 group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                Lifetime orders
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600 group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPrice(convertFromUSD(stats.totalSpent))}
              </div>
              <p className="text-xs text-muted-foreground">
                Lifetime spending
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Services</CardTitle>
              <Server className="h-4 w-4 text-blue-600 group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeServices}</div>
              <p className="text-xs text-muted-foreground">
                Currently running
              </p>
            </CardContent>
          </Card>

          <Card className={`hover:shadow-lg transition-all duration-200 cursor-pointer group ${stats.expiringServices > 0 ? 'border-orange-200 bg-orange-50' : ''}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
              <AlertTriangle className={`h-4 w-4 group-hover:scale-110 transition-transform ${stats.expiringServices > 0 ? 'text-orange-600' : 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.expiringServices > 0 ? 'text-orange-600' : ''}`}>{stats.expiringServices}</div>
              <p className="text-xs text-muted-foreground">
                Next 30 days
              </p>
            </CardContent>
          </Card>

          <Card className={`hover:shadow-lg transition-all duration-200 cursor-pointer group ${stats.unreadAlerts > 0 ? 'border-red-200 bg-red-50' : ''}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread Alerts</CardTitle>
              <Bell className={`h-4 w-4 group-hover:scale-110 transition-transform ${stats.unreadAlerts > 0 ? 'text-red-600' : 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.unreadAlerts > 0 ? 'text-red-600' : ''}`}>{stats.unreadAlerts}</div>
              <p className="text-xs text-muted-foreground">
                Need attention
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600 group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPrice(convertFromUSD(stats.monthlySpend))}
              </div>
              <p className="text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/services">
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-dashed border-2 border-blue-200 hover:border-blue-400">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <Package className="h-8 w-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-blue-600">Browse Services</span>
                </CardContent>
              </Card>
            </Link>

            <Link href="/store">
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-dashed border-2 border-green-200 hover:border-green-400">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <ShoppingBag className="h-8 w-8 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-green-600">Visit Store</span>
                </CardContent>
              </Card>
            </Link>

            <button
              onClick={() => setActiveTab('profile')}
              className="w-full"
            >
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-dashed border-2 border-purple-200 hover:border-purple-400">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <Settings className="h-8 w-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-purple-600">Account Settings</span>
                </CardContent>
              </Card>
            </button>

            <Link href="/contact">
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-dashed border-2 border-orange-200 hover:border-orange-400">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <User className="h-8 w-8 text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-orange-600">Contact Support</span>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { key: 'overview', label: 'Overview', icon: TrendingUp },
              { key: 'services', label: 'Services', icon: Server },
              { key: 'orders', label: 'Orders', icon: ShoppingBag },
              { key: 'alerts', label: 'Alerts', icon: Bell },
              { key: 'profile', label: 'Profile', icon: User }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`${
                  activeTab === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium flex items-center gap-2`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Activity Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Combine and sort recent items */}
                    {[
                      ...orders.slice(0, 3).map(order => ({
                        type: 'order',
                        title: `Order #${order.orderId || order.id.slice(0, 8)}`,
                        description: `${order.items?.length || 0} items`,
                        amount: formatPrice(convertFromUSD(order.payment?.totalAmount || (order as any).total || 0)),
                        date: order.orderDate || (order as any).createdAt,
                        status: order.status,
                        icon: ShoppingBag,
                        color: 'blue'
                      })),
                      ...alerts.slice(0, 2).map(alert => ({
                        type: 'alert',
                        title: alert.title,
                        description: alert.message,
                        amount: undefined as string | undefined,
                        date: alert.createdAt,
                        status: alert.read ? 'read' : 'unread',
                        icon: Bell,
                        color: alert.read ? 'gray' : 'red'
                      }))
                    ]
                    .sort((a, b) => {
                      const dateA = a.date instanceof Date ? a.date :
                                   (a.date as any)?.toDate ? (a.date as any).toDate() :
                                   new Date(a.date);
                      const dateB = b.date instanceof Date ? b.date :
                                   (b.date as any)?.toDate ? (b.date as any).toDate() :
                                   new Date(b.date);
                      return dateB.getTime() - dateA.getTime();
                    })
                    .slice(0, 5)
                    .map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className={`p-2 rounded-full ${
                          activity.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                          activity.color === 'red' ? 'bg-red-100 text-red-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          <activity.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900">{activity.title}</p>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(activity.date)}
                          </p>
                        </div>
                        {activity.amount && (
                          <div className="text-right">
                            <p className="font-medium text-gray-900">{activity.amount}</p>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {orders.length === 0 && alerts.length === 0 && (
                      <div className="text-center py-6">
                        <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No recent activity</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Service Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    Service Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {services.length > 0 ? (
                      services.slice(0, 4).map((service, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              service.status === 'active' ? 'bg-green-500' :
                              service.status === 'pending' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`} />
                            <div>
                              <p className="font-medium text-gray-900">{service.name}</p>
                              <p className="text-sm text-gray-600">{service.type}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              service.status === 'active' 
                                ? 'bg-green-100 text-green-800'
                                : service.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {service.status}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <Server className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No services yet</p>
                        <Link href="/services">
                          <Button className="mt-4">Browse Services</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-medium">Order #{order.orderId || order.id}</p>
                          <p className="text-sm text-gray-600">{formatDate(order.orderDate || order.createdAt)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatPrice(convertFromUSD(order.payment?.totalAmount || order.total || 0))}
                          </p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === 'completed' || order.projectStatus === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'pending' || order.projectStatus === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {order.status || order.projectStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                    {orders.length > 5 && (
                      <Button
                        variant="outline"
                        onClick={() => setActiveTab('orders')}
                        className="w-full"
                      >
                        View All Orders
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No orders yet</p>
                    <Link href="/services">
                      <Button className="mt-4">Browse Services</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Services */}
            <Card>
              <CardHeader>
                <CardTitle>Active Services</CardTitle>
              </CardHeader>
              <CardContent>
                {services.length > 0 ? (
                  <div className="space-y-4">
                    {services.filter(s => s.status === 'active').slice(0, 3).map((service) => (
                      <div key={service.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-gray-600">{service.type}</p>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {service.status}
                          </span>
                          {service.expiryDate && (
                            <p className="text-sm text-gray-600 mt-1">
                              Expires: {formatDate(service.expiryDate)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab('services')}
                      className="w-full"
                    >
                      View All Services
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Server className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No active services</p>
                    <Link href="/services">
                      <Button className="mt-4">Browse Services</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'services' && (
          <Card>
            <CardHeader>
              <CardTitle>Your Services</CardTitle>
            </CardHeader>
            <CardContent>
              {services.length > 0 ? (
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{service.name}</h3>
                          <p className="text-gray-600">{service.type}</p>
                          {service.features && service.features.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm font-medium text-gray-700">Features:</p>
                              <ul className="text-sm text-gray-600 mt-1">
                                {service.features.slice(0, 3).map((feature, index) => (
                                  <li key={index}>• {feature}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            service.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : service.status === 'suspended'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {service.status}
                          </span>
                          <p className="text-sm text-gray-600 mt-2">
                            {formatPrice(convertFromUSD(service.price))}
                          </p>
                          {service.expiryDate && (
                            <p className="text-sm text-gray-600">
                              Expires: {formatDate(service.expiryDate)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Server className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No services yet</h3>
                  <p className="text-gray-600 mb-4">Get started by browsing our services</p>
                  <Link href="/services">
                    <Button>Browse Services</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'orders' && (
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">Order #{order.orderId || order.id}</h3>
                          <p className="text-gray-600">{formatDate(order.orderDate || order.createdAt)}</p>
                          {order.items && order.items.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm font-medium text-gray-700">Items:</p>
                              <ul className="text-sm text-gray-600 mt-1">
                                {order.items.map((item, index) => (
                                  <li key={index}>
                                    {item.name} - {formatPrice(convertFromUSD(item.price))}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-medium">
                            {formatPrice(convertFromUSD(order.payment?.totalAmount || order.total || 0))}
                          </p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === 'completed' || order.projectStatus === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'pending' || order.projectStatus === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {order.status || order.projectStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-600 mb-4">Start shopping to see your orders here</p>
                  <Link href="/services">
                    <Button>Browse Services</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'alerts' && (
          <Card>
            <CardHeader>
              <CardTitle>Alerts & Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              {alerts.length > 0 ? (
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert.id} className={`border rounded-lg p-4 ${
                      !alert.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                    }`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {alert.type === 'warning' && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                            {alert.type === 'error' && <XCircle className="h-4 w-4 text-red-500" />}
                            {alert.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                            {alert.type === 'info' && <Bell className="h-4 w-4 text-blue-500" />}
                            {alert.type === 'renewal' && <Clock className="h-4 w-4 text-purple-500" />}
                            <h3 className="font-medium">{alert.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              alert.priority === 'high' 
                                ? 'bg-red-100 text-red-800'
                                : alert.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {alert.priority}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">{alert.message}</p>
                          <p className="text-sm text-gray-500">{formatDate(alert.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!alert.read && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkAsRead(alert.id)}
                            >
                              Mark as Read
                            </Button>
                          )}
                          {alert.actionUrl && (
                            <Link href={alert.actionUrl}>
                              <Button size="sm">
                                {alert.actionText || 'View'}
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts</h3>
                  <p className="text-gray-600">You&apos;re all caught up!</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'profile' && userProfile && (
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                        Display Name
                      </label>
                      <input
                        id="displayName"
                        type="text"
                        value={userProfile.displayName}
                        onChange={(e) => setUserProfile({ ...userProfile, displayName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={userProfile.email}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={userProfile.phone || ''}
                        onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                        Company
                      </label>
                      <input
                        id="company"
                        type="text"
                        value={userProfile.company || ''}
                        onChange={(e) => setUserProfile({ ...userProfile, company: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                  <div className="space-y-3">
                    {[
                      { key: 'emailNotifications', label: 'Email Notifications' },
                      { key: 'smsNotifications', label: 'SMS Notifications' },
                      { key: 'marketingEmails', label: 'Marketing Emails' },
                      { key: 'maintenanceAlerts', label: 'Maintenance Alerts' }
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center" htmlFor={key}>
                        <input
                          id={key}
                          type="checkbox"
                          checked={userProfile.preferences[key as keyof typeof userProfile.preferences]}
                          onChange={(e) => setUserProfile({
                            ...userProfile,
                            preferences: {
                              ...userProfile.preferences,
                              [key]: e.target.checked
                            }
                          })}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Button onClick={() => handleProfileUpdate(userProfile)}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
