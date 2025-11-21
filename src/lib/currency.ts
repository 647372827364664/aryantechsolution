// Currency conversion and localization utilities

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  exchangeRate: number; // Rate to USD
}

export const CURRENCIES: Record<string, Currency> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    exchangeRate: 1.0 // Base currency
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    exchangeRate: 83.12 // 1 USD = 83.12 INR (approximate)
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    exchangeRate: 0.85 // 1 USD = 0.85 EUR (approximate)
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    exchangeRate: 0.73 // 1 USD = 0.73 GBP (approximate)
  },
  CAD: {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
    exchangeRate: 1.36 // 1 USD = 1.36 CAD (approximate)
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    exchangeRate: 1.53 // 1 USD = 1.53 AUD (approximate)
  }
};

// Country to currency mapping
export const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  'US': 'USD',
  'United States': 'USD',
  'USA': 'USD',
  'IN': 'INR',
  'India': 'INR',
  'IND': 'INR',
  'GB': 'GBP',
  'United Kingdom': 'GBP',
  'UK': 'GBP',
  'DE': 'EUR',
  'Germany': 'EUR',
  'FR': 'EUR',
  'France': 'EUR',
  'IT': 'EUR',
  'Italy': 'EUR',
  'ES': 'EUR',
  'Spain': 'EUR',
  'CA': 'CAD',
  'Canada': 'CAD',
  'AU': 'AUD',
  'Australia': 'AUD'
};

export class CurrencyService {
  private static instance: CurrencyService;
  private currentCurrency: Currency = CURRENCIES.USD;
  private userLocation: string | null = null;

  private constructor() {
    this.detectUserLocation();
  }

  public static getInstance(): CurrencyService {
    if (!CurrencyService.instance) {
      CurrencyService.instance = new CurrencyService();
    }
    return CurrencyService.instance;
  }

  // Detect user location and set currency
  private async detectUserLocation() {
    try {
      // Try to get location from browser's geolocation API
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            await this.getLocationFromCoords(latitude, longitude);
          },
          () => {
            // Fallback to IP-based detection
            this.getLocationFromIP();
          }
        );
      } else {
        // Fallback to IP-based detection
        this.getLocationFromIP();
      }
    } catch (error) {
      console.warn('Could not detect user location, defaulting to USD');
    }
  }

  // Get location from coordinates (using reverse geocoding)
  private async getLocationFromCoords(lat: number, lon: number) {
    try {
      // In a real app, you'd use a geocoding service like Google Maps API
      // For demo, we'll simulate based on coordinates
      if (lat >= 8.4 && lat <= 37.6 && lon >= 68.7 && lon <= 97.25) {
        this.setLocationAndCurrency('India');
      } else if (lat >= 24.396308 && lat <= 49.384358 && lon >= -125.0 && lon <= -66.93457) {
        this.setLocationAndCurrency('United States');
      } else {
        this.setLocationAndCurrency('United States'); // Default
      }
    } catch (error) {
      console.warn('Geocoding failed, using IP detection');
      this.getLocationFromIP();
    }
  }

  // Get location from IP address
  private async getLocationFromIP() {
    try {
      // In a real app, you'd use a service like ipapi.co or similar
      // For demo, we'll check the user's timezone
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      if (timezone.includes('Asia/Kolkata') || timezone.includes('Asia/Calcutta')) {
        this.setLocationAndCurrency('India');
      } else if (timezone.includes('America/')) {
        this.setLocationAndCurrency('United States');
      } else if (timezone.includes('Europe/London')) {
        this.setLocationAndCurrency('United Kingdom');
      } else if (timezone.includes('Europe/')) {
        this.setLocationAndCurrency('Germany'); // Default to EUR
      } else {
        this.setLocationAndCurrency('United States'); // Default
      }
    } catch (error) {
      console.warn('IP detection failed, defaulting to USD');
      this.setLocationAndCurrency('United States');
    }
  }

  // Set location and corresponding currency
  private setLocationAndCurrency(location: string) {
    this.userLocation = location;
    const currencyCode = COUNTRY_CURRENCY_MAP[location] || 'USD';
    this.currentCurrency = CURRENCIES[currencyCode];
    
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('userCurrency', currencyCode);
      localStorage.setItem('userLocation', location);
    }
  }

  // Manual currency selection
  public setCurrency(currencyCode: string) {
    if (CURRENCIES[currencyCode]) {
      this.currentCurrency = CURRENCIES[currencyCode];
      if (typeof window !== 'undefined') {
        localStorage.setItem('userCurrency', currencyCode);
      }
    }
  }

  // Get current currency
  public getCurrentCurrency(): Currency {
    // Check localStorage first
    if (typeof window !== 'undefined') {
      const savedCurrency = localStorage.getItem('userCurrency');
      if (savedCurrency && CURRENCIES[savedCurrency]) {
        this.currentCurrency = CURRENCIES[savedCurrency];
      }
    }
    return this.currentCurrency;
  }

  // Convert price from USD to current currency
  public convertFromUSD(usdPrice: number): number {
    const currency = this.getCurrentCurrency();
    return usdPrice * currency.exchangeRate;
  }

  // Convert price from current currency to USD
  public convertToUSD(localPrice: number): number {
    const currency = this.getCurrentCurrency();
    return localPrice / currency.exchangeRate;
  }

  // Convert between any two currencies
  public convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
    const from = CURRENCIES[fromCurrency];
    const to = CURRENCIES[toCurrency];
    
    if (!from || !to) {
      throw new Error('Invalid currency codes');
    }

    // Convert to USD first, then to target currency
    const usdAmount = amount / from.exchangeRate;
    return usdAmount * to.exchangeRate;
  }

  // Format price with currency symbol
  public formatPrice(price?: number | null, currencyCode?: string): string {
    // Handle undefined or null price
    if (price === undefined || price === null) {
      return '$0.00';
    }

    const currency = currencyCode ? CURRENCIES[currencyCode] : this.getCurrentCurrency();
    if (!currency) return `$${price.toFixed(2)}`;

    const formattedPrice = price.toFixed(2);
    
    // Different formatting for different currencies
    switch (currency.code) {
      case 'INR':
        // Indian numbering system with commas
        return `${currency.symbol}${this.formatIndianNumber(price)}`;
      case 'EUR':
        // European format: amount followed by symbol
        return `${formattedPrice} ${currency.symbol}`;
      default:
        // Default format: symbol followed by amount
        return `${currency.symbol}${formattedPrice}`;
    }
  }

  // Format numbers in Indian numbering system
  private formatIndianNumber(num: number): string {
    const numStr = num.toFixed(2);
    const [integer, decimal] = numStr.split('.');
    
    // Add commas in Indian format (last 3 digits, then every 2 digits)
    let result = integer;
    if (integer.length > 3) {
      const lastThree = integer.slice(-3);
      const remaining = integer.slice(0, -3);
      const formatted = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
      result = formatted + ',' + lastThree;
    }
    
    return `${result}.${decimal}`;
  }

  // Get user's location
  public getUserLocation(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userLocation') || this.userLocation;
    }
    return this.userLocation;
  }

  // Get all available currencies
  public getAllCurrencies(): Currency[] {
    return Object.values(CURRENCIES);
  }

  // Check if current currency is specific currency
  public isCurrentCurrency(currencyCode: string): boolean {
    return this.getCurrentCurrency().code === currencyCode;
  }
}

// Export singleton instance
export const currencyService = CurrencyService.getInstance();

// Hook for React components
export function useCurrency() {
  const [currency, setCurrency] = React.useState<Currency>(currencyService.getCurrentCurrency());
  const [location, setLocation] = React.useState<string | null>(currencyService.getUserLocation());

  React.useEffect(() => {
    // Update currency when component mounts
    const currentCurrency = currencyService.getCurrentCurrency();
    setCurrency(currentCurrency);
    setLocation(currencyService.getUserLocation());
  }, []);

  const changeCurrency = (currencyCode: string) => {
    currencyService.setCurrency(currencyCode);
    setCurrency(currencyService.getCurrentCurrency());
  };

  const formatPrice = (price: number, currencyCode?: string) => {
    return currencyService.formatPrice(price, currencyCode);
  };

  const convertFromUSD = (usdPrice: number) => {
    return currencyService.convertFromUSD(usdPrice);
  };

  const convertToUSD = (localPrice: number) => {
    return currencyService.convertToUSD(localPrice);
  };

  return {
    currency,
    location,
    changeCurrency,
    formatPrice,
    convertFromUSD,
    convertToUSD,
    getAllCurrencies: currencyService.getAllCurrencies,
    isCurrentCurrency: currencyService.isCurrentCurrency
  };
}

// Import React for the hook
import React from 'react';
