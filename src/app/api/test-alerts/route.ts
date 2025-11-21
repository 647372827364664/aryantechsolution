import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers, sendBulkAlerts } from '@/lib/firebase';

export async function GET() {
  try {
    console.log('Testing Firebase connection...');
    
    // Test 1: Get all users
    const users = await getAllUsers();
    console.log('Users found:', users.length);
    
    // Test 2: Try to send a test alert if users exist
    if (users.length > 0) {
      const testUserIds = users.slice(0, 1).map(user => user.id); // Just test with first user
      
      try {
        await sendBulkAlerts(testUserIds, {
          title: 'Test Alert',
          message: 'This is a test alert from the system diagnostic.',
          type: 'info',
          priority: 'low'
        });
        
        return NextResponse.json({
          success: true,
          message: 'Firebase connection and alert system working',
          usersCount: users.length,
          testAlertSent: true
        });
      } catch (alertError) {
        console.error('Alert sending error:', alertError);
        return NextResponse.json({
          success: false,
          message: 'Firebase connected but alert sending failed',
          usersCount: users.length,
          error: alertError instanceof Error ? alertError.message : 'Unknown error'
        });
      }
    } else {
      return NextResponse.json({
        success: true,
        message: 'Firebase connected but no users found',
        usersCount: 0
      });
    }
    
  } catch (error) {
    console.error('Firebase test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Firebase connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userIds, alertData } = await request.json();
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No user IDs provided'
      });
    }
    
    if (!alertData || !alertData.title || !alertData.message) {
      return NextResponse.json({
        success: false,
        error: 'Alert data incomplete'
      });
    }
    
    const results = await sendBulkAlerts(userIds, alertData);
    
    return NextResponse.json({
      success: true,
      message: `Alert sent to ${userIds.length} users`,
      results: results.length
    });
    
  } catch (error) {
    console.error('Alert sending error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
