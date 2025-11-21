'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useCurrency, CURRENCIES } from '@/lib/currency';

export default function CurrencySelector() {
  const { currency, changeCurrency, location, getAllCurrencies } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCurrencyChange = (currencyCode: string) => {
    changeCurrency(currencyCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        title={`Current currency: ${currency.name}${location ? ` (${location})` : ''}`}
      >
        <Globe className="h-4 w-4 text-gray-600" />
        <span className="font-medium">{currency.symbol}</span>
        <span className="text-gray-600">{currency.code}</span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-gray-100">
            <h3 className="font-medium text-gray-900">Select Currency</h3>
            {location && (
              <p className="text-xs text-gray-600 mt-1">Detected location: {location}</p>
            )}
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {getAllCurrencies().map((curr) => (
              <button
                key={curr.code}
                onClick={() => handleCurrencyChange(curr.code)}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-lg">{curr.symbol}</span>
                  <div>
                    <div className="font-medium text-gray-900">{curr.code}</div>
                    <div className="text-xs text-gray-600">{curr.name}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    {curr.code === 'USD' ? '1.00' : curr.exchangeRate.toFixed(2)}
                  </span>
                  {currency.code === curr.code && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
          
          <div className="p-3 border-t border-gray-100 text-xs text-gray-500">
            <p>Rates are approximate and for display purposes only.</p>
            <p>All transactions are processed in USD.</p>
          </div>
        </div>
      )}
    </div>
  );
}
