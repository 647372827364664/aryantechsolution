"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  ChevronRight,
  Filter,
  Grid,
  List
} from "lucide-react";

export default function BlogCategoryPage({ params }: { params: { category: string } }) {
  const categoryName = decodeURIComponent(params.category).replace(/-/g, ' ');
  
  // Mock posts for this category
  const categoryPosts = [
    {
      id: "1",
      title: "Advanced AWS VPC Configuration for Enterprise Applications",
      slug: "aws-vpc-enterprise-config",
      excerpt: "Learn how to design and implement secure, scalable VPC architectures for enterprise-grade applications on AWS.",
      author: {
        name: "Alex Thompson",
        avatar: "/api/placeholder/40/40",
        role: "Cloud Architect"
      },
      publishedAt: "2024-01-15",
      readTime: 8,
      featuredImage: "/api/placeholder/600/400",
      views: 12500,
      likes: 89,
      comments: 23
    },
    {
      id: "2", 
      title: "Kubernetes Multi-Cluster Management Strategies",
      slug: "kubernetes-multi-cluster-management",
      excerpt: "Explore best practices for managing multiple Kubernetes clusters across different environments and regions.",
      author: {
        name: "Sarah Chen",
        avatar: "/api/placeholder/40/40",
        role: "DevOps Engineer"
      },
      publishedAt: "2024-01-12",
      readTime: 10,
      featuredImage: "/api/placeholder/600/400",
      views: 8900,
      likes: 156,
      comments: 45
    },
    {
      id: "3",
      title: "Infrastructure as Code with Terraform: Advanced Patterns",
      slug: "terraform-advanced-patterns",
      excerpt: "Master advanced Terraform patterns including modules, state management, and CI/CD integration for large-scale infrastructure.",
      author: {
        name: "Mike Rodriguez",
        avatar: "/api/placeholder/40/40",
        role: "Infrastructure Engineer"
      },
      publishedAt: "2024-01-10",
      readTime: 12,
      featuredImage: "/api/placeholder/600/400",
      views: 15600,
      likes: 203,
      comments: 67
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link href="/blog">
              <Button variant="ghost" className="text-white hover:bg-white/20 mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Posts
              </Button>
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 capitalize">
              {categoryName}
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              {categoryPosts.length} articles in this category
            </p>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Filter className="mr-2 h-4 w-4" />
                Filter Posts
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="ghost" className="text-white hover:bg-white/20 p-2">
                  <Grid className="h-4 w-4" />
                </Button>
                <Button variant="ghost" className="text-white hover:bg-white/20 p-2">
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryPosts.map((post) => (
                <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0">
                  <div className="relative aspect-video">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Image
                          src={post.author.avatar}
                          alt={post.author.name}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {post.author.name}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {post.readTime} min
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.views.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Link href={`/blog/${post.slug}`} className="block">
                        <Button variant="outline" className="w-full group">
                          Read More
                          <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
