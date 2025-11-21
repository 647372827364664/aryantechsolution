'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Shield } from 'lucide-react';

export default function TestAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleTestLogin = () => {
    setLoading(true);
    // Simulate login delay
    setTimeout(() => {
      // For testing, we'll just redirect to dashboard with test mode
      router.push('/dashboard?test=true');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Test Dashboard</CardTitle>
          <p className="text-gray-600">Access the dashboard in test mode</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Development Mode:</strong> This allows you to test the dashboard without Firebase authentication.
            </p>
          </div>

          <Button
            onClick={handleTestLogin}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Loading...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <User className="h-5 w-5 mr-2" />
                Enter Test Dashboard
              </div>
            )}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              For production use, please use proper authentication
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
