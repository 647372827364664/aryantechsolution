"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Shield, 
  Edit, 
  Trash2, 
  UserPlus, 
  Search,
  Filter,
  MoreVertical,
  Ban,
  CheckCircle,
  XCircle,
  Settings,
  Tag,
  LogOut,
  ArrowLeft,
  Crown,
  Code,
  User,
  Clock,
  Plus,
  Mail,
  Phone
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { logOut, db, auth } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, query, orderBy, setDoc } from "firebase/firestore";
import Link from "next/link";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'developer' | 'client';
  status: 'active' | 'suspended' | 'pending';
  joinDate: string;
  lastLogin: string;
  developerId?: string;
  tags?: string[];
  phone?: string;
  totalSpent: number;
  activeServices: number;
}

export default function UserManagement() {
  const { user, isFirebaseConfigured } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    developers: 0,
    clients: 0,
    admins: 0,
    suspendedUsers: 0
  });
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Check if user is authorized (admin role)
  useEffect(() => {
    if (user) {
      // Check if user has admin role for production security
      if (user.role === 'admin') {
        console.log('User authorized with admin role:', user.role);
        setIsAuthorized(true);
      } else {
        console.log('User not authorized, redirecting to dashboard...');
        // Redirect non-admin users to dashboard
        router.push('/dashboard');
      }
    } else {
      // Allow demo access when no user is authenticated (for testing)
      console.log('No user found, allowing demo access for testing');
      setIsAuthorized(true);
    }
  }, [user, router, loading]);

  useEffect(() => {
    // Fetch users if authorized OR if Firebase is configured (for debugging)
    if (isAuthorized || isFirebaseConfigured) {
      fetchUsers();
    }
  }, [isFirebaseConfigured, isAuthorized]);

  useEffect(() => {
    // Calculate user statistics
    const stats = {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'active').length,
      developers: users.filter(u => u.role === 'developer').length,
      clients: users.filter(u => u.role === 'client').length,
      admins: users.filter(u => u.role === 'admin').length,
      suspendedUsers: users.filter(u => u.status === 'suspended').length
    };
    setUserStats(stats);
  }, [users]);

  const fetchUsers = async () => {
    console.log('fetchUsers called:', { 
      isFirebaseConfigured, 
      isAuthorized, 
      user: user?.role,
      dbExists: !!db 
    });
    setLoading(true);
    try {
      if (!isFirebaseConfigured) {
        console.log('Using demo mode data');
        // Demo mode - use minimal sample data for demonstration
        setUsers([
          {
            id: 'demo-1',
            name: 'Demo Admin',
            email: 'admin@demo.com',
            role: 'admin',
            status: 'active',
            joinDate: '2024-01-01',
            lastLogin: '2025-08-23',
            totalSpent: 0,
            activeServices: 0
          },
          {
            id: 'demo-2',
            name: 'Demo Developer',
            email: 'dev@demo.com',
            role: 'developer',
            status: 'active',
            joinDate: '2024-02-01',
            lastLogin: '2025-08-22',
            developerId: 'DEV001',
            tags: ['React', 'Node.js'],
            totalSpent: 0,
            activeServices: 0
          },
          {
            id: 'demo-3',
            name: 'Demo Client',
            email: 'client@demo.com',
            role: 'client',
            status: 'active',
            joinDate: '2024-03-01',
            lastLogin: '2025-08-21',
            totalSpent: 299.99,
            activeServices: 2
          }
        ]);
        setLoading(false);
        return;
      }

      // Create a test user if none exist
      console.log('Checking if we need to create test data...');
      const usersRef = collection(db, 'users');
      let querySnapshot = await getDocs(usersRef);
      
      if (querySnapshot.empty) {
        console.log('No users found, creating test user...');
        try {
          // Create test admin user
          await setDoc(doc(db, 'users', 'test-admin'), {
            name: 'Test Admin',
            email: 'admin@test.com',
            role: 'admin',
            status: 'active',
            joinDate: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            totalSpent: 0,
            activeServices: 0
          });
          
          // Create test developer user
          await setDoc(doc(db, 'users', 'test-developer'), {
            name: 'Test Developer',
            email: 'dev@test.com',
            role: 'developer',
            status: 'active',
            joinDate: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            developerId: 'DEV001',
            tags: ['React', 'Node.js'],
            totalSpent: 0,
            activeServices: 0
          });
          
          // Create test client user
          await setDoc(doc(db, 'users', 'test-client'), {
            name: 'Test Client',
            email: 'client@test.com',
            role: 'client',
            status: 'active',
            joinDate: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            totalSpent: 299.99,
            activeServices: 2
          });
          
          console.log('Test users created successfully');
        } catch (createError) {
          console.error('Failed to create test users:', createError);
        }
      }

      // Fetch real users from Firebase
      console.log('Attempting to fetch from Firebase...');
      
      // Try simple fetch first without ordering
      try {
        console.log('Trying simple getDocs...');
        querySnapshot = await getDocs(usersRef);
        console.log('Simple query executed, documents received:', querySnapshot.size);
      } catch (simpleError) {
        console.log('Simple query failed, trying with orderBy:', simpleError);
        const q = query(usersRef, orderBy('joinDate', 'desc'));
        querySnapshot = await getDocs(q);
        console.log('Ordered query executed, documents received:', querySnapshot.size);
      }
      
      const fetchedUsers: UserData[] = [];
      querySnapshot.forEach((doc) => {
        console.log('Processing document:', doc.id, doc.data());
        const data = doc.data();
        fetchedUsers.push({
          id: doc.id,
          name: data.name || data.displayName || 'Unknown User',
          email: data.email || '',
          role: data.role || 'client',
          status: data.status || 'active',
          joinDate: data.joinDate || data.createdAt || new Date().toISOString(),
          lastLogin: data.lastLogin || new Date().toISOString(),
          developerId: data.developerId,
          tags: data.tags || [],
          phone: data.phone,
          totalSpent: data.totalSpent || 0,
          activeServices: data.activeServices || 0
        });
      });
      
      console.log('Processed users:', fetchedUsers.length);
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Set empty array on error in Firebase mode
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'developer' | 'client') => {
    console.log('handleRoleChange called:', { userId, newRole, isFirebaseConfigured });
    console.log('Current user context:', { 
      user: user ? { id: user.id, role: user.role, email: user.email } : null,
      firebaseAuthUser: auth?.currentUser ? { uid: auth.currentUser.uid, email: auth.currentUser.email } : null,
      isAuthorized,
      loading 
    });
    
    if (!isFirebaseConfigured) {
      console.log('Demo mode - updating local state');
      // Demo mode - just update local state
      setUsers(users.map(user => {
        if (user.id === userId) {
          const updatedUser = { ...user, role: newRole };
          
          // Assign developer ID if changing to developer
          if (newRole === 'developer' && !user.developerId) {
            updatedUser.developerId = `DEV${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
            updatedUser.tags = [];
          }
          
          // Remove developer data if changing from developer
          if (newRole !== 'developer') {
            delete updatedUser.developerId;
            delete updatedUser.tags;
          }
          
          return updatedUser;
        }
        return user;
      }));
      return;
    }

    try {
      console.log('Firebase mode - updating user document');
      const userRef = doc(db, 'users', userId);
      const updateData: any = { role: newRole };
      
      console.log('Update data prepared:', updateData);
      
      // Assign developer ID if changing to developer
      if (newRole === 'developer') {
        const currentUser = users.find(u => u.id === userId);
        if (!currentUser?.developerId) {
          updateData.developerId = `DEV${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
          updateData.tags = [];
        }
      }
      
      // Remove developer data if changing from developer
      if (newRole !== 'developer') {
        updateData.developerId = null;
        updateData.tags = null;
      }
      
      console.log('Final update data:', updateData);
      console.log('Attempting to update document...');
      
      await updateDoc(userRef, updateData);
      
      console.log('Document updated successfully');
      
      // Update local state
      setUsers(users.map(user => {
        if (user.id === userId) {
          return { ...user, ...updateData };
        }
        return user;
      }));
    } catch (error: any) {
      console.error('Error updating user role:', error);
      console.error('Error details:', {
        message: error?.message || 'Unknown error',
        code: error?.code || 'Unknown code',
        userId,
        newRole,
        currentUser: user?.id,
        userRole: user?.role
      });
      alert(`Failed to update user role: ${error?.message || 'Unknown error'}`);
    }
  };

  const handleStatusToggle = async (userId: string) => {
    if (!isFirebaseConfigured) {
      // Demo mode - just update local state
      setUsers(users.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            status: user.status === 'active' ? 'suspended' : 'active'
          };
        }
        return user;
      }));
      return;
    }

    try {
      const currentUser = users.find(u => u.id === userId);
      if (!currentUser) return;
      
      const newStatus = currentUser.status === 'active' ? 'suspended' : 'active';
      const userRef = doc(db, 'users', userId);
      
      await updateDoc(userRef, { status: newStatus });
      
      // Update local state
      setUsers(users.map(user => {
        if (user.id === userId) {
          return { ...user, status: newStatus };
        }
        return user;
      }));
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update user status');
    }
  };

  const handleAddTag = async (userId: string, tag: string) => {
    if (!tag.trim()) return;
    
    if (!isFirebaseConfigured) {
      // Demo mode - just update local state
      setUsers(users.map(user => {
        if (user.id === userId && user.role === 'developer') {
          const currentTags = user.tags || [];
          if (!currentTags.includes(tag)) {
            return {
              ...user,
              tags: [...currentTags, tag]
            };
          }
        }
        return user;
      }));
      return;
    }

    try {
      const currentUser = users.find(u => u.id === userId);
      if (!currentUser || currentUser.role !== 'developer') return;
      
      const currentTags = currentUser.tags || [];
      if (currentTags.includes(tag)) return;
      
      const newTags = [...currentTags, tag];
      const userRef = doc(db, 'users', userId);
      
      await updateDoc(userRef, { tags: newTags });
      
      // Update local state
      setUsers(users.map(user => {
        if (user.id === userId) {
          return { ...user, tags: newTags };
        }
        return user;
      }));
    } catch (error) {
      console.error('Error adding tag:', error);
      alert('Failed to add tag');
    }
  };

  const handleRemoveTag = async (userId: string, tagToRemove: string) => {
    if (!isFirebaseConfigured) {
      // Demo mode - just update local state
      setUsers(users.map(user => {
        if (user.id === userId && user.role === 'developer') {
          return {
            ...user,
            tags: (user.tags || []).filter(tag => tag !== tagToRemove)
          };
        }
        return user;
      }));
      return;
    }

    try {
      const currentUser = users.find(u => u.id === userId);
      if (!currentUser || currentUser.role !== 'developer') return;
      
      const newTags = (currentUser.tags || []).filter(tag => tag !== tagToRemove);
      const userRef = doc(db, 'users', userId);
      
      await updateDoc(userRef, { tags: newTags });
      
      // Update local state
      setUsers(users.map(user => {
        if (user.id === userId) {
          return { ...user, tags: newTags };
        }
        return user;
      }));
    } catch (error) {
      console.error('Error removing tag:', error);
      alert('Failed to remove tag');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'developer': return <Code className="h-4 w-4 text-blue-600" />;
      case 'client': return <User className="h-4 w-4 text-green-600" />;
      default: return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>;
      case 'suspended':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Suspended</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  // Show loading/authorization check
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Verifying permissions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                User Management
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">
                  {user?.name || 'Admin'}
                </span>
              </div>
              
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-100">Total Users</p>
                  <p className="text-2xl font-bold">{userStats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-100">Active</p>
                  <p className="text-2xl font-bold">{userStats.activeUsers}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-yellow-100">Admins</p>
                  <p className="text-2xl font-bold">{userStats.admins}</p>
                </div>
                <Crown className="h-8 w-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-100">Developers</p>
                  <p className="text-2xl font-bold">{userStats.developers}</p>
                </div>
                <Code className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-100">Clients</p>
                  <p className="text-2xl font-bold">{userStats.clients}</p>
                </div>
                <User className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-red-100">Suspended</p>
                  <p className="text-2xl font-bold">{userStats.suspendedUsers}</p>
                </div>
                <Ban className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage users, roles, and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Filter by user role"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="developer">Developer</option>
                <option value="client">Client</option>
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Filter by user status"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Developer Info</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((userData) => (
                    <tr key={userData.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {userData.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{userData.name}</div>
                            <div className="text-sm text-gray-500">{userData.email}</div>
                            {userData.phone && (
                              <div className="text-xs text-gray-400">{userData.phone}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(userData.role)}
                          <select
                            value={userData.role}
                            onChange={(e) => handleRoleChange(userData.id, e.target.value as any)}
                            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label={`Change role for ${userData.name}`}
                          >
                            <option value="client">Client</option>
                            <option value="developer">Developer</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(userData.status)}
                          <Button
                            onClick={() => handleStatusToggle(userData.id)}
                            variant="ghost"
                            size="sm"
                            className="text-xs"
                          >
                            {userData.status === 'active' ? <Ban className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                          </Button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {userData.role === 'developer' ? (
                          <div className="space-y-2">
                            <div className="text-sm font-medium text-blue-600">
                              ID: {userData.developerId}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {(userData.tags || []).map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                                >
                                  {tag}
                                  <button
                                    onClick={() => handleRemoveTag(userData.id, tag)}
                                    className="ml-1 text-blue-600 hover:text-blue-800"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                              <Button
                                onClick={() => {
                                  const tag = prompt('Enter tag:');
                                  if (tag) handleAddTag(userData.id, tag);
                                }}
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ) : userData.role === 'client' ? (
                          <div className="text-sm text-gray-600">
                            <div>Spent: ${userData.totalSpent}</div>
                            <div>Services: {userData.activeServices}</div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>Joined: {new Date(userData.joinDate).toLocaleDateString()}</div>
                        <div>Last: {new Date(userData.lastLogin).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
