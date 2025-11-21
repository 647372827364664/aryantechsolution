import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dimensions: string[] }> }
) {
  const { dimensions } = await params;
  const dims = dimensions || ['400', '300'];
  const width = parseInt(dims[0]) || 400;
  const height = parseInt(dims[1]) || 300;

  // Create a simple SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <rect x="20%" y="20%" width="60%" height="60%" fill="#e5e7eb" rx="8"/>
      <circle cx="35%" cy="40%" r="5%" fill="#d1d5db"/>
      <rect x="45%" y="35%" width="35%" height="4%" fill="#d1d5db" rx="2"/>
      <rect x="45%" y="45%" width="25%" height="3%" fill="#d1d5db" rx="1"/>
      <text x="50%" y="75%" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#9ca3af">
        ${width} × ${height}
      </text>
    </svg>
  `;

  return new NextResponse(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
