import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebase';

export const realServices = [
  {
    title: 'VPS Hosting',
    name: 'VPS Hosting',
    description: 'High-performance Virtual Private Servers with full root access.',
    category: 'hosting',
    status: 'active',
    features: [
      'Full Root Access & SSH',
      'Guaranteed RAM & CPU',
      'SSD Storage Included',
      '99.9% Uptime SLA',
      '24/7 Expert Support',
      'Free Migration Service'
    ],
    pricing: {
      basic: 9.99,
      standard: 19.99,
      premium: 49.99
    },
    duration: 'Monthly',
    deliveryTime: 'Instant Setup',
    tags: ['hosting', 'vps', 'server'],
    rating: 4.8,
    reviewCount: 156,
    link: '/contact',
    image: '/api/placeholder/400/300'
  },
  {
    title: 'Web Development',
    name: 'Web Development',
    description: 'Professional web development services using modern technologies.',
    category: 'development',
    status: 'active',
    features: [
      'Custom Design & Development',
      'Responsive Mobile Design',
      'Modern Tech Stack',
      'SEO Optimization',
      'Performance Optimization',
      'Security Implementation'
    ],
    pricing: {
      basic: 1499,
      standard: 2999,
      premium: 5999
    },
    duration: 'Project-based',
    deliveryTime: '2-8 weeks',
    tags: ['web', 'development', 'react'],
    rating: 4.9,
    reviewCount: 89,
    link: '/contact',
    image: '/api/placeholder/400/300'
  },
  {
    title: 'Mobile App Development',
    name: 'Mobile App Development',
    description: 'Native and cross-platform mobile applications for iOS and Android.',
    category: 'development',
    status: 'active',
    features: [
      'Native iOS & Android Development',
      'Cross-Platform Solutions',
      'UI/UX Design Included',
      'App Store Submission',
      'Push Notifications',
      'Analytics Integration'
    ],
    pricing: {
      basic: 3999,
      standard: 7999,
      premium: 15999
    },
    duration: 'Project-based',
    deliveryTime: '4-12 weeks',
    tags: ['mobile', 'app', 'ios', 'android'],
    rating: 4.7,
    reviewCount: 67,
    link: '/contact',
    image: '/api/placeholder/400/300'
  },
  {
    title: 'Database Management',
    name: 'Database Management',
    description: 'Professional database design, optimization, and management services.',
    category: 'database',
    status: 'active',
    features: [
      'Database Design & Architecture',
      'Performance Optimization',
      'Data Migration Services',
      'Backup & Recovery Solutions',
      'Security Implementation',
      'Monitoring & Maintenance'
    ],
    pricing: {
      basic: 299,
      standard: 599,
      enterprise: 1299
    },
    duration: 'Monthly',
    deliveryTime: '1-2 weeks setup',
    tags: ['database', 'mysql', 'postgresql'],
    rating: 4.6,
    reviewCount: 134,
    link: '/contact',
    image: '/api/placeholder/400/300'
  }
];

export async function addRealServices() {
  try {
    const servicesRef = collection(db, 'services');
    
    for (const service of realServices) {
      await addDoc(servicesRef, {
        ...service,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    console.log('Real services added successfully!');
    return { success: true, message: 'Real services added successfully!' };
  } catch (error) {
    console.error('Error adding real services:', error);
    return { success: false, message: 'Failed to add real services' };
  }
}
