import { NextRequest, NextResponse } from 'next/server';
import { getBlogPosts, db } from '@/lib/firebase';

export async function GET() {
  try {
    console.log('API: Testing Firestore connection...');
    
    // Test connection by trying to get blog posts
    const connectionResult = await getBlogPosts();
    console.log('API: Connection test result:', connectionResult);
    
    // Test getting blog posts
    console.log('API: Testing getBlogPosts...');
    const posts = await getBlogPosts();
    console.log('API: Got posts:', posts.length);
    
    return NextResponse.json({ 
      success: true, 
      connectionResult,
      postsCount: posts.length,
      posts: posts.slice(0, 2) // Return first 2 posts for debugging
    });
  } catch (error) {
    console.error('API: Error testing Firebase:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
