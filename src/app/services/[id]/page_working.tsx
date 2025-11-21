'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ServiceDetailPage() {
  const params = useParams();
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Service Details
          </h1>
          <p className="text-gray-600 mb-4">
            Service ID: {params.id}
          </p>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Service Information</h2>
            <p className="text-gray-600 mb-6">
              This service detail page is currently being developed. 
              Please check back soon for complete service information.
            </p>
            <Button>
              Contact Support
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
