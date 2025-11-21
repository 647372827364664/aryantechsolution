'use client';

import React from 'react';

export default function CurrencyProviderWrapper({ children }: { children: React.ReactNode }) {
  // Currency functionality is handled by the useCurrency hook
  // This wrapper is kept for future provider implementation if needed
  return (
    <>
      {children}
    </>
  );
}
