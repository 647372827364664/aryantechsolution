import { NextResponse } from 'next/server';
import { 
  createUserAlert, 
  createOrder, 
  getAllUsers 
} from '@/lib/firebase';

export async function POST() {
  try {
    // Get all users to send demo alerts
    const users = await getAllUsers();
    
    if (users.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'No users found to send demo alerts to' 
      });
    }

    const demoAlerts = [];
    const demoOrders = [];
    
    // Create demo alerts for each user
    for (const user of users.slice(0, 3)) { // Limit to first 3 users
      // Welcome alert
      const welcomeAlert = await createUserAlert(user.id, {
        title: 'Welcome to Aryan Tech Solution!',
        message: 'Thank you for joining us. Explore our services and take advantage of our premium cloud solutions.',
        type: 'info',
        priority: 'medium',
        actionUrl: '/services',
        actionText: 'Browse Services'
      });
      demoAlerts.push(welcomeAlert);

      // Service renewal reminder
      const renewalAlert = await createUserAlert(user.id, {
        title: 'Service Renewal Reminder',
        message: 'Your VPS hosting service will expire in 7 days. Renew now to avoid service interruption.',
        type: 'renewal',
        priority: 'high',
        actionUrl: '/dashboard?tab=services',
        actionText: 'Renew Now'
      });
      demoAlerts.push(renewalAlert);

      // System maintenance notice
      const maintenanceAlert = await createUserAlert(user.id, {
        title: 'Scheduled Maintenance',
        message: 'We will perform system maintenance tonight from 2:00 AM to 4:00 AM EST. Services may be temporarily unavailable.',
        type: 'warning',
        priority: 'medium',
        actionUrl: '/services/support',
        actionText: 'Learn More'
      });
      demoAlerts.push(maintenanceAlert);

      // Payment success
      const paymentAlert = await createUserAlert(user.id, {
        title: 'Payment Processed Successfully',
        message: 'Your payment of $29.99 has been processed. Thank you for your business!',
        type: 'success',
        priority: 'low',
        actionUrl: '/dashboard?tab=orders',
        actionText: 'View Receipt'
      });
      demoAlerts.push(paymentAlert);

      // Create demo order
      const demoOrder = await createOrder({
        userId: user.id,
        items: [
          {
            id: 'vps-starter',
            name: 'VPS Starter Plan',
            price: 29.99,
            quantity: 1,
            type: 'service'
          }
        ],
        totalAmount: 29.99,
        currency: 'USD',
        paymentMethod: 'credit_card',
        customerInfo: {
          name: (user as any).displayName || (user as any).email?.split('@')[0] || 'Demo User',
          email: (user as any).email || 'demo@example.com',
          phone: '+1-555-0123'
        }
      });
      demoOrders.push(demoOrder);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Created ${demoAlerts.length} demo alerts and ${demoOrders.length} demo orders`,
      data: {
        alerts: demoAlerts.length,
        orders: demoOrders.length,
        users: users.length
      }
    });

  } catch (error) {
    console.error('Error creating demo data:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to create demo data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
