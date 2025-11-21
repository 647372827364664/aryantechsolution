"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Search,
  User,
  FileText,
  Plus,
  BookOpen,
  ArrowRight
} from "lucide-react";
import { getBlogPosts } from "@/lib/firebase";
import { useAuth } from "@/components/providers/AuthProvider";

interface BlogPost {
  id: string;
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    role?: string;
  };
  publishedAt: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  featured: boolean;
  published: boolean;
}

const categories = [
  "All Categories",
  "Cloud Infrastructure", 
  "Web Development", 
  "Mobile Development", 
  "Gaming", 
  "Bot Development", 
  "Security",
  "DevOps",
  "AI & Machine Learning"
];

export default function BlogPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if user is admin
  const isAdmin = user?.email === 'raghavlove305@gmail.com' || user?.role === 'admin';

  useEffect(() => {
    fetchBlogPosts();
  }, [selectedCategory]);

  const fetchBlogPosts = async () => {
    setLoading(true);
    try {
      const category = selectedCategory === "All Categories" ? undefined : selectedCategory;
      const fetchedPosts = await getBlogPosts(category, undefined, false);
      
      setBlogPosts(fetchedPosts as BlogPost[]);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      // Show error state instead of demo data
      setBlogPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Simple blog message component
  const EmptyBlogMessage = () => (
    <div className="text-center py-16">
      <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts found</h3>
      <p className="text-gray-500 mb-6">
        {isAdmin ? "Create your first blog post to get started." : "Check back later for new articles and updates."}
      </p>
      {isAdmin && (
        <Link href="/blog/admin">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Create First Post
          </Button>
        </Link>
      )}
    </div>
  );

  // Filter posts based on search and category
  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesSearch = !searchQuery || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === "All Categories" || 
        post.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [blogPosts, searchQuery, selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog & Articles</h1>
            <p className="text-xl text-gray-600">
              Stay updated with the latest insights, tutorials, and industry trends
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Filter by category"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {blogPosts.length === 0 ? (
            <EmptyBlogMessage />
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">No articles found</h3>
              <p className="text-gray-600 mb-8">Try adjusting your search terms or filters.</p>
              <Button onClick={() => { setSearchQuery(""); setSelectedCategory("All Categories"); }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                        {post.category}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">{post.author.name}</p>
                          <p className="text-gray-500">{post.author.role}</p>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <Link href={`/blog/${post.slug || post.id}`}>
                      <Button className="w-full">
                        Read Article
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
