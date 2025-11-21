import { NextRequest, NextResponse } from 'next/server';
import { 
  addDoc, 
  collection, 
  serverTimestamp,
  doc,
  setDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Create sample orders
    const sampleOrders = [
      {
        userId,
        orderId: 'ORD-001',
        items: [
          { name: 'VPS Hosting - Premium', price: 29.99, quantity: 1 },
          { name: 'Domain Registration', price: 12.99, quantity: 1 }
        ],
        payment: { totalAmount: 42.98 },
        status: 'completed',
        projectStatus: 'completed',
        createdAt: serverTimestamp(),
        orderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      },
      {
        userId,
        orderId: 'ORD-002',
        items: [
          { name: 'Web Development', price: 499.99, quantity: 1 }
        ],
        payment: { totalAmount: 499.99 },
        status: 'in-progress',
        projectStatus: 'in-progress',
        createdAt: serverTimestamp(),
        orderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        userId,
        orderId: 'ORD-003',
        items: [
          { name: 'Discord Bot Development', price: 149.99, quantity: 1 }
        ],
        payment: { totalAmount: 149.99 },
        status: 'pending',
        projectStatus: 'pending',
        createdAt: serverTimestamp(),
        orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      }
    ];

    // Create sample user services
    const sampleServices = [
      {
        userId,
        name: 'VPS Server - Premium',
        type: 'hosting',
        status: 'active',
        createdAt: serverTimestamp(),
        expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
        price: 29.99,
        features: ['8GB RAM', '4 CPU Cores', '200GB SSD', '10TB Transfer']
      },
      {
        userId,
        name: 'aryantechsolution.com',
        type: 'domain',
        status: 'active',
        createdAt: serverTimestamp(),
        expiresAt: new Date(Date.now() + 340 * 24 * 60 * 60 * 1000), // ~11 months
        price: 12.99,
        features: ['DNS Management', 'WHOIS Privacy', 'Email Forwarding']
      },
      {
        userId,
        name: 'Minecraft Server - Basic',
        type: 'gaming',
        status: 'pending',
        createdAt: serverTimestamp(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        price: 19.99,
        features: ['4GB RAM', '20 Player Slots', 'Plugin Support']
      }
    ];

    // Create sample alerts
    const sampleAlerts = [
      {
        userId,
        title: 'VPS Server Expiring Soon',
        message: 'Your VPS server will expire in 25 days. Please renew to avoid service interruption.',
        type: 'warning',
        read: false,
        createdAt: serverTimestamp(),
        category: 'expiration'
      },
      {
        userId,
        title: 'Web Development Project Update',
        message: 'Your web development project is 60% complete. Expected completion in 5 days.',
        type: 'info',
        read: false,
        createdAt: serverTimestamp(),
        category: 'project-update'
      },
      {
        userId,
        title: 'New Feature Available',
        message: 'Real-time dashboard monitoring is now available! Toggle live updates in your dashboard.',
        type: 'success',
        read: true,
        createdAt: serverTimestamp(),
        category: 'feature'
      },
      {
        userId,
        title: 'Payment Confirmed',
        message: 'Payment of $42.98 has been confirmed for Order #ORD-001.',
        type: 'success',
        read: true,
        createdAt: serverTimestamp(),
        category: 'payment'
      }
    ];

    // Add user profile
    const userProfile = {
      displayName: 'Demo User',
      email: 'demo@example.com',
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        marketingEmails: true,
        maintenanceAlerts: true,
        currency: 'USD',
        theme: 'light'
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Insert data into Firebase
    const orderPromises = sampleOrders.map(order => 
      addDoc(collection(db, 'orders'), order)
    );

    const servicePromises = sampleServices.map(service => 
      addDoc(collection(db, 'userServices'), service)
    );

    const alertPromises = sampleAlerts.map(alert => 
      addDoc(collection(db, 'userAlerts'), alert)
    );

    const profilePromise = setDoc(doc(db, 'users', userId), userProfile);

    // Wait for all data to be inserted
    await Promise.all([
      ...orderPromises,
      ...servicePromises,
      ...alertPromises,
      profilePromise
    ]);

    return NextResponse.json({ 
      success: true, 
      message: 'Demo dashboard data created successfully',
      data: {
        orders: sampleOrders.length,
        services: sampleServices.length,
        alerts: sampleAlerts.length,
        profile: 1
      }
    });

  } catch (error) {
    console.error('Error creating demo dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to create demo data' },
      { status: 500 }
    );
  }
}
