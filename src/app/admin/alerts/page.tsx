'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Send, 
  Users, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  Clock,
  Search,
  User,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  getAllUsers, 
  sendBulkAlerts
} from '@/lib/firebase';
import toast, { Toaster } from 'react-hot-toast';

interface User {
  id: string;
  displayName: string;
  email: string;
  createdAt: Date | { toDate(): Date } | string;
  lastLogin?: Date | { toDate(): Date } | string;
}

interface AlertForm {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'renewal';
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  actionText?: string;
  targetUsers: string[];
}

export default function AdminAlertsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [alertForm, setAlertForm] = useState<AlertForm>({
    title: '',
    message: '',
    type: 'info',
    priority: 'medium',
    actionUrl: '',
    actionText: '',
    targetUsers: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await getAllUsers();
      setUsers(usersData as User[]);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserSelect = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    setSelectedUsers(filteredUsers.map(user => user.id));
  };

  const clearSelection = () => {
    setSelectedUsers([]);
  };

  const sendAlert = async () => {
    // Validation with detailed feedback
    if (!alertForm.title.trim()) {
      toast.error('Please enter an alert title');
      return;
    }
    
    if (!alertForm.message.trim()) {
      toast.error('Please enter an alert message');
      return;
    }

    if (selectedUsers.length === 0) {
      toast.error('Please select at least one user to send the alert to');
      return;
    }

    // Additional validation
    if (alertForm.title.length > 100) {
      toast.error('Alert title must be 100 characters or less');
      return;
    }

    if (alertForm.message.length > 500) {
      toast.error('Alert message must be 500 characters or less');
      return;
    }

    try {
      setSending(true);
      
      // Show loading toast
      const loadingToast = toast.loading(`Sending alert to ${selectedUsers.length} user${selectedUsers.length > 1 ? 's' : ''}...`);
      
      const alertData: any = {
        title: alertForm.title.trim(),
        message: alertForm.message.trim(),
        type: alertForm.type,
        priority: alertForm.priority
      };

      // Only add optional fields if they have values
      const trimmedUrl = alertForm.actionUrl?.trim();
      const trimmedText = alertForm.actionText?.trim();
      if (trimmedUrl) {
        alertData.actionUrl = trimmedUrl;
      }
      if (trimmedText) {
        alertData.actionText = trimmedText;
      }

      console.log('Sending alert to users:', selectedUsers);
      console.log('Alert data:', alertData);

      await sendBulkAlerts(selectedUsers, alertData);
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success(`🎉 Alert successfully sent to ${selectedUsers.length} user${selectedUsers.length > 1 ? 's' : ''}!`, {
        duration: 4000
      });
      
      // Reset form with confirmation
      setAlertForm({
        title: '',
        message: '',
        type: 'info',
        priority: 'medium',
        actionUrl: '',
        actionText: '',
        targetUsers: []
      });
      setSelectedUsers([]);
      
      // Optional: Refresh users list to update any status
      setTimeout(() => {
        loadUsers();
      }, 1000);
      
    } catch (error) {
      console.error('Error sending alert:', error);
      
      // More specific error messages
      if (error instanceof Error) {
        if (error.message.includes('permission')) {
          toast.error('Permission denied. Please check your admin privileges.');
        } else if (error.message.includes('network')) {
          toast.error('Network error. Please check your connection and try again.');
        } else {
          toast.error(`Failed to send alert: ${error.message}`);
        }
      } else {
        toast.error('An unexpected error occurred while sending the alert');
      }
    } finally {
      setSending(false);
    }
  };

  const getAlertTypeIcon = (type: string) => {
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

  const quickAlertTemplates = [
    {
      title: 'Service Renewal Reminder',
      message: 'Your service will expire in 7 days. Please renew to avoid interruption.',
      type: 'renewal' as const,
      priority: 'high' as const,
      actionUrl: '/dashboard?tab=services',
      actionText: 'Renew Now'
    },
    {
      title: 'System Maintenance Notice',
      message: 'Scheduled maintenance will occur tonight from 2 AM to 4 AM EST.',
      type: 'warning' as const,
      priority: 'medium' as const
    },
    {
      title: 'Payment Successful',
      message: 'Your payment has been processed successfully. Thank you!',
      type: 'success' as const,
      priority: 'low' as const
    },
    {
      title: 'Security Alert',
      message: 'Unusual login activity detected. Please review your account.',
      type: 'error' as const,
      priority: 'high' as const,
      actionUrl: '/dashboard?tab=profile',
      actionText: 'Review Account'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Alert Center</h1>
          <p className="text-gray-600 mt-2">Send notifications and alerts to users</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Alert Composer */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Send className="h-5 w-5 mr-2" />
                  Compose Alert
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quick Templates */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Quick Templates
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {quickAlertTemplates.map((template, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setAlertForm({
                            ...alertForm,
                            ...template
                          });
                          toast.success(`Template "${template.title}" loaded`);
                        }}
                        className="p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center mb-2">
                          {getAlertTypeIcon(template.type)}
                          <span className="ml-2 font-semibold text-sm text-gray-800">{template.title}</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {template.message.length > 80 
                            ? template.message.substring(0, 80) + '...' 
                            : template.message
                          }
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            template.priority === 'high' ? 'bg-red-100 text-red-700' :
                            template.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {template.priority.toUpperCase()}
                          </span>
                          <span className="text-xs text-blue-600 font-medium">Click to use →</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Alert Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alert Type
                    </label>
                    <select
                      value={alertForm.type}
                      onChange={(e) => setAlertForm({
                        ...alertForm,
                        type: e.target.value as 'info' | 'warning' | 'success' | 'error' | 'renewal'
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      title="Select alert type"
                    >
                      <option value="info">Information</option>
                      <option value="warning">Warning</option>
                      <option value="success">Success</option>
                      <option value="error">Error</option>
                      <option value="renewal">Renewal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={alertForm.priority}
                      onChange={(e) => setAlertForm({
                        ...alertForm,
                        priority: e.target.value as 'low' | 'medium' | 'high'
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      title="Select priority level"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alert Title *
                  </label>
                  <input
                    type="text"
                    value={alertForm.title}
                    onChange={(e) => setAlertForm({
                      ...alertForm,
                      title: e.target.value
                    })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                      alertForm.title.trim() 
                        ? 'border-green-300 focus:ring-green-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Enter alert title..."
                    maxLength={100}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">
                      {alertForm.title.trim() ? '✓ Title looks good' : 'Title is required'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {alertForm.title.length}/100
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={alertForm.message}
                    onChange={(e) => setAlertForm({
                      ...alertForm,
                      message: e.target.value
                    })}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                      alertForm.message.trim() 
                        ? 'border-green-300 focus:ring-green-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Enter alert message..."
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">
                      {alertForm.message.trim() ? '✓ Message looks good' : 'Message is required'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {alertForm.message.length}/500
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Action URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={alertForm.actionUrl}
                      onChange={(e) => setAlertForm({
                        ...alertForm,
                        actionUrl: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="/dashboard, /services/123, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Action Button Text
                    </label>
                    <input
                      type="text"
                      value={alertForm.actionText}
                      onChange={(e) => setAlertForm({
                        ...alertForm,
                        actionText: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="View Details, Renew Now, etc."
                    />
                  </div>
                </div>

                {/* Alert Preview */}
                {(alertForm.title.trim() || alertForm.message.trim()) && (
                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Alert Preview
                    </label>
                    <div className={`p-4 rounded-lg border-l-4 ${
                      alertForm.type === 'error' ? 'bg-red-50 border-red-400' :
                      alertForm.type === 'warning' ? 'bg-orange-50 border-orange-400' :
                      alertForm.type === 'success' ? 'bg-green-50 border-green-400' :
                      alertForm.type === 'renewal' ? 'bg-blue-50 border-blue-400' :
                      'bg-blue-50 border-blue-400'
                    }`}>
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          {getAlertTypeIcon(alertForm.type)}
                        </div>
                        <div className="ml-3 flex-1">
                          <h4 className="text-sm font-semibold text-gray-900">
                            {alertForm.title || 'Alert Title'}
                          </h4>
                          <p className="text-sm text-gray-700 mt-1">
                            {alertForm.message || 'Alert message will appear here...'}
                          </p>
                          {alertForm.actionUrl && alertForm.actionText && (
                            <div className="mt-3">
                              <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors">
                                {alertForm.actionText}
                              </button>
                            </div>
                          )}
                          <div className="mt-2 flex items-center text-xs text-gray-500">
                            <span className={`px-2 py-1 rounded-full ${
                              alertForm.priority === 'high' ? 'bg-red-100 text-red-700' :
                              alertForm.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {alertForm.priority.toUpperCase()} PRIORITY
                            </span>
                            <span className="ml-2">Will be sent to {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Send Button */}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {selectedUsers.length > 0 ? (
                        <span className="font-medium text-green-600">
                          ✓ {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
                        </span>
                      ) : (
                        <span className="text-orange-600">
                          ⚠ No users selected
                        </span>
                      )}
                    </div>
                    <Button
                      onClick={sendAlert}
                      disabled={sending || selectedUsers.length === 0 || !alertForm.title.trim() || !alertForm.message.trim()}
                      className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                        sending || selectedUsers.length === 0 || !alertForm.title.trim() || !alertForm.message.trim()
                          ? 'bg-gray-400 cursor-not-allowed text-gray-600' 
                          : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                      }`}
                    >
                      {sending ? (
                        <div className="flex items-center">
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          <span>Sending Alert...</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Send className="h-4 w-4 mr-2" />
                          <span>Send Alert to {selectedUsers.length || 0} Users</span>
                        </div>
                      )}
                    </Button>
                  </div>
                  {!alertForm.title.trim() || !alertForm.message.trim() ? (
                    <p className="text-xs text-red-500 mt-2">
                      * Please fill in both title and message
                    </p>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Selector */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Select Users
                  </div>
                  <span className="text-sm font-normal text-gray-500">
                    {selectedUsers.length} selected
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Search and Actions */}
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Search users..."
                    />
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      onClick={selectAllUsers}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Select All ({filteredUsers.length})
                    </Button>
                    <Button
                      onClick={clearSelection}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Clear ({selectedUsers.length})
                    </Button>
                    <Button
                      onClick={loadUsers}
                      variant="outline"
                      size="sm"
                      className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all duration-200"
                      disabled={loading}
                    >
                      {loading ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {/* Users List */}
                  <div className="max-h-96 overflow-y-auto space-y-2 border rounded-lg p-2 bg-gray-50">
                    {loading ? (
                      <div className="text-center py-8">
                        <RefreshCw className="h-8 w-8 animate-spin mx-auto text-blue-500 mb-2" />
                        <p className="text-gray-500">Loading users...</p>
                      </div>
                    ) : filteredUsers.length === 0 ? (
                      <div className="text-center py-8">
                        <User className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500">No users found</p>
                        {searchTerm && (
                          <p className="text-xs text-gray-400 mt-1">
                            Try adjusting your search term
                          </p>
                        )}
                      </div>
                    ) : (
                      filteredUsers.map((user) => (
                        <label
                          key={user.id}
                          className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                            selectedUsers.includes(user.id)
                              ? 'bg-blue-50 border-blue-300 shadow-md'
                              : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleUserSelect(user.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                          />
                          <div className="ml-3 flex-1 min-w-0">
                            <div className="flex items-center">
                              <User className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {user.displayName || 'No Name'}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500 truncate mt-1">
                              {user.email}
                            </p>
                            {user.lastLogin && (
                              <p className="text-xs text-gray-400 mt-1">
                                Last login: {new Date(
                                  typeof user.lastLogin === 'string' 
                                    ? user.lastLogin 
                                    : user.lastLogin instanceof Date 
                                      ? user.lastLogin 
                                      : user.lastLogin.toDate()
                                ).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          {selectedUsers.includes(user.id) && (
                            <CheckCircle className="h-5 w-5 text-blue-500 ml-2" />
                          )}
                        </label>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
