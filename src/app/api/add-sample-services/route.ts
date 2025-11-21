import { NextResponse } from 'next/server';
import { addRealServices } from '@/lib/sampleServices';

export async function POST() {
  try {
    const result = await addRealServices();
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Real services added successfully!' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: result.message 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in add-sample-services API:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to add real services' 
    }, { status: 500 });
  }
}
