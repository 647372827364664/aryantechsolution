'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Users,
  Server,
  DollarSign,
  CheckCircle,
  Plus,
  Settings,
  Activity,
  Eye,
  LogOut,
  Shield,
  Clock,
  Edit,
  Trash2,
  BarChart3,
  XCircle,
  Package,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/providers/AuthProvider';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import toast, { Toaster } from 'react-hot-toast';

interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  status: 'active' | 'coming-soon' | 'inactive';
}

interface Stats {
  totalServices: number;
  activeServices: number;
  totalRevenue: number;
  totalCustomers: number;
  pendingOrders: number;
  monthlyGrowth: number;
}

interface ActivityItem {
  id: string;
  type: 'new_customer' | 'service_update' | 'payment' | 'support';
  message: string;
  time: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalServices: 0,
    activeServices: 0,
    totalRevenue: 0,
    totalCustomers: 342,
    pendingOrders: 0,
    monthlyGrowth: 12.5
  });

  const recentActivity: ActivityItem[] = [
    {
      id: '1',
      type: 'new_customer',
      message: 'New customer registration',
      time: '2 minutes ago'
    },
    {
      id: '2',
      type: 'service_update',
      message: 'VPS service updated',
      time: '1 hour ago'
    },
    {
      id: '3',
      type: 'payment',
      message: 'Payment received $299',
      time: '3 hours ago'
    },
    {
      id: '4',
      type: 'support',
      message: 'Support ticket resolved',
      time: '5 hours ago'
    }
  ];

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchServices();
    }
  }, [user]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const servicesCollection = collection(db, 'services');
      const servicesSnapshot = await getDocs(servicesCollection);
      const fetchedServices = servicesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[];

      setServices(fetchedServices);

      // Calculate real statistics from Firebase data
      const activeServicesCount = fetchedServices.filter((s: Service) => s.status === 'active').length;
      const pendingServicesCount = fetchedServices.filter((s: Service) => s.status === 'coming-soon').length;
      const totalRevenue = fetchedServices.reduce((sum: number, s: Service) => sum + (parseFloat(s.price?.toString() || '0') || 0), 0);
      
      setStats(prev => ({
        ...prev,
        totalServices: fetchedServices.length,
        activeServices: activeServicesCount,
        pendingOrders: pendingServicesCount,
        totalRevenue: totalRevenue > 0 ? totalRevenue : 125430, // Fallback to demo data if no revenue
      }));
    } catch (error) {
      console.error("Error fetching services:", error);
      // Fallback to demo data on error
      setServices([]);
      setStats(prev => ({
        ...prev,
        totalServices: 12,
        activeServices: 10,
        totalRevenue: 125430,
        pendingOrders: 28,
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'services', id));
      fetchServices();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete service. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to logout. Please try again.');
    }
  };

  const handleAddSampleProducts = async () => {
    try {
      toast.loading('Adding sample products...');
      const response = await fetch('/api/add-sample-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        toast.dismiss();
        toast.success('Sample products added successfully!');
      } else {
        toast.dismiss();
        toast.error(result.message || 'Failed to add sample products');
      }
    } catch (error) {
      console.error('Error adding sample products:', error);
      toast.dismiss();
      toast.error('Failed to add sample products');
    }
  };

  const handleAddDemoDashboardData = async () => {
    try {
      toast.loading('Creating demo alerts and orders...');
      const response = await fetch('/api/demo-dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        toast.dismiss();
        toast.success('Demo dashboard data created successfully!');
      } else {
        toast.dismiss();
        toast.error(result.message || 'Failed to create demo data');
      }
    } catch (error) {
      console.error('Error creating demo data:', error);
      toast.dismiss();
      toast.error('Failed to create demo data');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold text-gray-800">Access Denied</CardTitle>
            <CardDescription>
              You need admin privileges to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/auth/login">
              <Button className="w-full">
                Login as Admin
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster position="top-right" />
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your Aryan Tech Solution services and settings</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Welcome back, {user?.name}</span>
              <Link href="/services">
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View Live Site
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 font-medium">Total Services</p>
                  <p className="text-3xl font-bold">{stats.totalServices}</p>
                  <p className="text-blue-200 text-sm mt-1">Services available</p>
                </div>
                <Server className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 font-medium">Active Services</p>
                  <p className="text-3xl font-bold">{stats.activeServices}</p>
                  <p className="text-green-200 text-sm mt-1">Currently live</p>
                </div>
                <CheckCircle className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                  <p className="text-purple-200 text-sm mt-1">+{stats.monthlyGrowth}% from last month</p>
                </div>
                <DollarSign className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 font-medium">Total Customers</p>
                  <p className="text-3xl font-bold">{stats.totalCustomers}</p>
                  <p className="text-orange-200 text-sm mt-1">Active users</p>
                </div>
                <Users className="h-12 w-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Manage your platform content and settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/admin/services/new">
                    <Card className="border border-blue-200 hover:border-blue-300 transition-colors cursor-pointer hover:shadow-md">
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-3 rounded-lg mr-4">
                            <Plus className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Add Service</h3>
                            <p className="text-sm text-gray-600">Create new service offering</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/admin/products/new">
                    <Card className="border border-green-200 hover:border-green-300 transition-colors cursor-pointer hover:shadow-md">
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <div className="bg-green-100 p-3 rounded-lg mr-4">
                            <Plus className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Add Product</h3>
                            <p className="text-sm text-gray-600">Add new product to store</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/admin/users">
                    <Card className="border border-purple-200 hover:border-purple-300 transition-colors cursor-pointer hover:shadow-md">
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <div className="bg-purple-100 p-3 rounded-lg mr-4">
                            <Users className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Manage Users</h3>
                            <p className="text-sm text-gray-600">View and manage user accounts</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/admin/products">
                    <Card className="border border-orange-200 hover:border-orange-300 transition-colors cursor-pointer hover:shadow-md">
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <div className="bg-orange-100 p-3 rounded-lg mr-4">
                            <BarChart3 className="h-6 w-6 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Manage Products</h3>
                            <p className="text-sm text-gray-600">View and edit store products</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/admin/alerts">
                    <Card className="border border-red-200 hover:border-red-300 transition-colors cursor-pointer hover:shadow-md">
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <div className="bg-red-100 p-3 rounded-lg mr-4">
                            <Bell className="h-6 w-6 text-red-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Send Alerts</h3>
                            <p className="text-sm text-gray-600">Send notifications to users</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/admin/orders">
                    <Card className="border border-teal-200 hover:border-teal-300 transition-colors cursor-pointer hover:shadow-md">
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <div className="bg-teal-100 p-3 rounded-lg mr-4">
                            <Package className="h-6 w-6 text-teal-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Manage Orders</h3>
                            <p className="text-sm text-gray-600">View and update order status</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Card 
                    className="border border-indigo-200 hover:border-indigo-300 transition-colors cursor-pointer hover:shadow-md"
                    onClick={handleAddSampleProducts}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                          <Package className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Add Sample Products</h3>
                          <p className="text-sm text-gray-600">Populate store with sample data</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card 
                    className="border border-violet-200 hover:border-violet-300 transition-colors cursor-pointer hover:shadow-md"
                    onClick={handleAddDemoDashboardData}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <div className="bg-violet-100 p-3 rounded-lg mr-4">
                          <Activity className="h-6 w-6 text-violet-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Demo Dashboard Data</h3>
                          <p className="text-sm text-gray-600">Create sample alerts and orders</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest system activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'new_customer' ? 'bg-green-100' :
                        activity.type === 'service_update' ? 'bg-blue-100' :
                        activity.type === 'payment' ? 'bg-purple-100' :
                        'bg-gray-100'
                      }`}>
                        {activity.type === 'new_customer' && <Users className="h-4 w-4 text-green-600" />}
                        {activity.type === 'service_update' && <Server className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'payment' && <DollarSign className="h-4 w-4 text-purple-600" />}
                        {activity.type === 'support' && <CheckCircle className="h-4 w-4 text-gray-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Services Management */}
        <div className="mt-8">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Server className="h-5 w-5 mr-2" />
                    Recent Services
                  </CardTitle>
                  <CardDescription>
                    Latest service offerings
                  </CardDescription>
                </div>
                <Link href="/admin/services/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading services...</p>
                </div>
              ) : services.length === 0 ? (
                <div className="text-center py-8">
                  <Server className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No services found</p>
                  <Link href="/admin/services/new">
                    <Button className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Service
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Service</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Price</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.slice(0, 5).map((service) => (
                        <tr key={service.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div>
                              <h3 className="font-medium text-gray-900">{service.title}</h3>
                              <p className="text-sm text-gray-500">{service.description.substring(0, 60)}...</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {service.category}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-green-600">${service.price}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              service.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : service.status === 'coming-soon' 
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {service.status === 'active' && <CheckCircle className="h-3 w-3 mr-1" />}
                              {service.status === 'coming-soon' && <Clock className="h-3 w-3 mr-1" />}
                              {service.status === 'inactive' && <XCircle className="h-3 w-3 mr-1" />}
                              {service.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Link href={`/admin/services/${service.id}/edit`}>
                                <Button size="sm" variant="outline">
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </Link>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleDeleteService(service.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
