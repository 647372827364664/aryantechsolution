import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

export const addSampleProducts = async () => {
  const sampleProducts = [
    {
      name: 'Premium VPS Hosting',
      description: 'High-performance virtual private server with dedicated resources, SSD storage, and 24/7 support. Perfect for growing websites and applications that need reliable performance.',
      shortDescription: 'High-performance VPS with dedicated resources and SSD storage.',
      price: 29.99,
      originalPrice: 39.99,
      category: 'hosting',
      subcategory: 'vps',
      icon: 'Server',
      image: '/api/placeholder/400/300',
      rating: 4.8,
      reviews: 124,
      badge: 'Best Seller',
      features: ['8GB RAM', '4 CPU Cores', '160GB SSD', '24/7 Support', 'Free Backup'],
      specifications: {
        'RAM': '8GB DDR4',
        'CPU': '4 vCPU Cores',
        'Storage': '160GB NVMe SSD',
        'Bandwidth': 'Unlimited',
        'OS': 'Linux/Windows'
      },
      popular: true,
      featured: true,
      inStock: true,
      stockQuantity: 50,
      deliveryTime: 'Instant Setup',
      tags: ['vps', 'hosting', 'premium', 'ssd'],
      sku: 'VPS-PREM-001',
      status: 'active',
      createdAt: new Date()
    },
    {
      name: 'Shared Web Hosting',
      description: 'Affordable shared hosting solution perfect for small websites and blogs. Includes free SSL, daily backups, and one-click WordPress installation.',
      shortDescription: 'Affordable shared hosting with free SSL and daily backups.',
      price: 9.99,
      originalPrice: 14.99,
      category: 'hosting',
      subcategory: 'shared',
      icon: 'Globe',
      image: '/api/placeholder/400/300',
      rating: 4.5,
      reviews: 89,
      features: ['Unlimited Bandwidth', 'Free SSL Certificate', 'Daily Backups', 'One-Click WordPress'],
      specifications: {
        'Storage': '50GB SSD',
        'Bandwidth': 'Unlimited',
        'Domains': '5 Domains',
        'Email': '25 Email Accounts',
        'SSL': 'Free SSL Certificate'
      },
      inStock: true,
      stockQuantity: 100,
      deliveryTime: 'Instant Setup',
      tags: ['shared', 'hosting', 'wordpress', 'ssl'],
      sku: 'HOST-SHAR-001',
      status: 'active',
      createdAt: new Date()
    },
    {
      name: 'Custom Web Development',
      description: 'Professional web development services including responsive design, modern frameworks, and custom functionality. We create stunning websites that convert.',
      shortDescription: 'Professional web development with modern frameworks.',
      price: 299.99,
      category: 'development',
      subcategory: 'web',
      icon: 'Code',
      image: '/api/placeholder/400/300',
      rating: 4.9,
      reviews: 67,
      badge: 'Premium Service',
      features: ['Responsive Design', 'React/Next.js', 'Custom Features', 'SEO Optimized'],
      specifications: {
        'Framework': 'React, Next.js, Vue.js',
        'Design': 'Mobile-first Responsive',
        'SEO': 'Search Engine Optimized',
        'Support': '3 Months Support',
        'Delivery': '2-4 Weeks'
      },
      featured: true,
      inStock: true,
      stockQuantity: 10,
      deliveryTime: '2-4 Weeks',
      tags: ['development', 'web', 'react', 'nextjs'],
      sku: 'DEV-WEB-001',
      status: 'active',
      createdAt: new Date()
    },
    {
      name: 'Discord Bot Development',
      description: 'Custom Discord bot development with advanced features, moderation tools, and server management capabilities. Built with Python/JavaScript.',
      shortDescription: 'Custom Discord bot with advanced features.',
      price: 199.99,
      category: 'development',
      subcategory: 'bot',
      icon: 'Bot',
      image: '/api/placeholder/400/300',
      rating: 4.7,
      reviews: 43,
      features: ['Custom Commands', 'Moderation Tools', 'Server Management', 'Music Bot'],
      specifications: {
        'Language': 'Python/JavaScript',
        'Features': 'Custom Commands & Events',
        'Hosting': '24/7 Bot Hosting',
        'Support': '6 Months Support',
        'Updates': 'Free Minor Updates'
      },
      popular: true,
      inStock: true,
      stockQuantity: 20,
      deliveryTime: '1-2 Weeks',
      tags: ['development', 'discord', 'bot', 'moderation'],
      sku: 'DEV-BOT-001',
      status: 'active',
      createdAt: new Date()
    },
    {
      name: 'Mobile App Development',
      description: 'Native and cross-platform mobile app development for iOS and Android with modern UI/UX design and seamless user experience.',
      shortDescription: 'Native mobile apps for iOS and Android.',
      price: 999.99,
      originalPrice: 1299.99,
      category: 'development',
      subcategory: 'mobile',
      icon: 'Smartphone',
      image: '/api/placeholder/400/300',
      rating: 4.8,
      reviews: 34,
      badge: 'Most Popular',
      features: ['iOS & Android', 'Modern UI/UX', 'API Integration', 'App Store Submission'],
      specifications: {
        'Platforms': 'iOS & Android',
        'Technology': 'React Native/Flutter',
        'Design': 'Custom UI/UX Design',
        'API': 'REST API Integration',
        'Deployment': 'App Store Submission'
      },
      featured: true,
      popular: true,
      inStock: true,
      stockQuantity: 5,
      deliveryTime: '4-8 Weeks',
      tags: ['development', 'mobile', 'ios', 'android'],
      sku: 'DEV-MOB-001',
      status: 'active',
      createdAt: new Date()
    },
    {
      name: 'Domain Registration',
      description: 'Register your perfect domain name with free privacy protection, easy management tools, and competitive pricing for all major extensions.',
      shortDescription: 'Register your domain with free privacy protection.',
      price: 12.99,
      category: 'domains',
      subcategory: 'registration',
      icon: 'Globe',
      image: '/api/placeholder/400/300',
      rating: 4.6,
      reviews: 156,
      features: ['Free Privacy Protection', 'Easy Management', 'Auto-renewal', 'DNS Management'],
      specifications: {
        'Privacy': 'Free WHOIS Protection',
        'DNS': 'Advanced DNS Management',
        'Renewal': 'Auto-renewal Available',
        'Support': 'Domain Transfer Support',
        'Extensions': '.com, .net, .org, .io'
      },
      inStock: true,
      stockQuantity: 1000,
      deliveryTime: 'Instant',
      tags: ['domain', 'registration', 'privacy', 'dns'],
      sku: 'DOM-REG-001',
      status: 'active',
      createdAt: new Date()
    },
    {
      name: 'Minecraft Server Hosting',
      description: 'High-performance Minecraft server hosting with automatic backups, mod support, and DDoS protection. Perfect for gaming communities.',
      shortDescription: 'High-performance Minecraft server with mod support.',
      price: 19.99,
      originalPrice: 24.99,
      category: 'gaming',
      subcategory: 'minecraft',
      icon: 'Gamepad2',
      image: '/api/placeholder/400/300',
      rating: 4.6,
      reviews: 78,
      badge: 'Gaming Special',
      features: ['Mod Support', 'Auto Backups', 'DDoS Protection', 'One-click Modpacks'],
      specifications: {
        'RAM': '4GB - 32GB',
        'CPU': 'High-frequency CPU',
        'Storage': 'Fast NVMe SSD',
        'Mods': 'Forge, Fabric, Bukkit',
        'Players': 'Up to 100 Players'
      },
      popular: true,
      featured: true,
      inStock: true,
      stockQuantity: 30,
      deliveryTime: 'Instant Setup',
      tags: ['gaming', 'minecraft', 'server', 'mods'],
      sku: 'GAM-MIN-001',
      status: 'active',
      createdAt: new Date()
    },
    {
      name: 'SSL Certificate',
      description: 'Secure your website with industry-standard SSL encryption. Supports domain validation and wildcard certificates with 99.9% browser trust.',
      shortDescription: 'Industry-standard SSL encryption for your website.',
      price: 49.99,
      category: 'security',
      subcategory: 'ssl',
      icon: 'Shield',
      image: '/api/placeholder/400/300',
      rating: 4.4,
      reviews: 92,
      features: ['256-bit Encryption', 'Wildcard Support', 'Mobile Compatible', '99.9% Browser Trust'],
      specifications: {
        'Encryption': '256-bit SSL',
        'Validation': 'Domain Validation',
        'Warranty': '$1M Warranty',
        'Compatibility': '99.9% Browser Trust',
        'Support': 'Wildcard Certificates'
      },
      inStock: true,
      stockQuantity: 200,
      deliveryTime: 'Instant',
      tags: ['security', 'ssl', 'encryption', 'certificate'],
      sku: 'SEC-SSL-001',
      status: 'active',
      createdAt: new Date()
    }
  ];

  try {
    const productsRef = collection(db, 'products');
    
    for (const product of sampleProducts) {
      await addDoc(productsRef, product);
      console.log(`Added product: ${product.name}`);
    }
    
    console.log('All sample products added successfully!');
    return true;
  } catch (error) {
    console.error('Error adding sample products:', error);
    return false;
  }
};
