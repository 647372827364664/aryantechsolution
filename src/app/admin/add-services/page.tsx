'use client';

import { useState } from 'react';

export default function AddSampleServicesPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const addServices = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/add-sample-services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMessage('Real services added successfully!');
      } else {
        setMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Add Real Services
        </h1>
        
        <button
          onClick={addServices}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Adding Services...' : 'Add Real Services'}
        </button>
        
        {message && (
          <div className={`mt-4 p-3 rounded ${
            message.includes('Error') 
              ? 'bg-red-100 text-red-700' 
              : 'bg-green-100 text-green-700'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
