import { NextRequest, NextResponse } from 'next/server';
import { addSampleProducts } from '@/lib/sampleProducts';

export async function POST(request: NextRequest) {
  try {
    const success = await addSampleProducts();
    
    if (success) {
      return NextResponse.json({ 
        message: 'Sample products added successfully!',
        success: true 
      });
    } else {
      return NextResponse.json({ 
        message: 'Failed to add sample products',
        success: false 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in add-sample-products API:', error);
    return NextResponse.json({ 
      message: 'Internal server error',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
