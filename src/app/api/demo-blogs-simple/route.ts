import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  // Demo blog posts that always return
  const demoPosts = [
    {
      id: "demo-1",
      title: "Getting Started with Cloud Infrastructure",
      slug: "getting-started-cloud-infrastructure",
      excerpt: "Learn the fundamentals of cloud infrastructure and how to set up your first cloud environment with best practices and security considerations.",
      content: "# Getting Started with Cloud Infrastructure\n\nCloud infrastructure is the foundation of modern web applications...",
      author: {
        name: "Sarah Johnson",
        role: "Cloud Architect"
      },
      publishedAt: "2024-01-15",
      category: "Cloud Infrastructure",
      tags: ["cloud", "infrastructure", "aws", "tutorial", "beginner"],
      featuredImage: "/api/placeholder/800/400",
      featured: true,
      published: true,
      views: 245,
      likes: 18,
      comments: 5
    },
    {
      id: "demo-2",
      title: "Building Modern Web Applications with Next.js",
      slug: "building-modern-web-apps-nextjs",
      excerpt: "Discover how to build fast, scalable, and SEO-friendly web applications using Next.js, React, and modern development practices.",
      content: "# Building Modern Web Applications with Next.js\n\nNext.js has revolutionized the way we build React applications...",
      author: {
        name: "Alex Chen",
        role: "Full Stack Developer"
      },
      publishedAt: "2024-01-10",
      category: "Web Development",
      tags: ["nextjs", "react", "javascript", "web-development", "frontend"],
      featuredImage: "/api/placeholder/800/400",
      featured: false,
      published: true,
      views: 189,
      likes: 12,
      comments: 3
    },
    {
      id: "demo-3",
      title: "Cybersecurity Best Practices for Small Businesses",
      slug: "cybersecurity-best-practices-small-business",
      excerpt: "Essential security measures every small business should implement to protect against cyber threats and data breaches.",
      content: "# Cybersecurity Best Practices for Small Businesses\n\nIn today's digital landscape, cybersecurity is not just a concern for large corporations...",
      author: {
        name: "Michael Rodriguez",
        role: "Security Specialist"
      },
      publishedAt: "2024-01-05",
      category: "Security",
      tags: ["cybersecurity", "small-business", "security", "data-protection", "best-practices"],
      featuredImage: "/api/placeholder/800/400",
      featured: false,
      published: true,
      views: 156,
      likes: 9,
      comments: 2
    },
    {
      id: "demo-4",
      title: "Mobile App Development Trends in 2024",
      slug: "mobile-app-development-trends-2024",
      excerpt: "Explore the latest trends and technologies shaping mobile app development in 2024, from AI integration to cross-platform solutions.",
      content: "# Mobile App Development Trends in 2024\n\nThe mobile app development landscape continues to evolve rapidly...",
      author: {
        name: "Emma Thompson",
        role: "Mobile Developer"
      },
      publishedAt: "2024-01-01",
      category: "Mobile Development",
      tags: ["mobile-development", "app-development", "trends", "ai", "5g"],
      featuredImage: "/api/placeholder/800/400",
      featured: true,
      published: true,
      views: 312,
      likes: 24,
      comments: 8
    }
  ];

  return NextResponse.json(demoPosts);
}
