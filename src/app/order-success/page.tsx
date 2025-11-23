'use client';

import React, { Suspense } from 'react';
import OrderSuccessContent from './OrderSuccessContent';

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
