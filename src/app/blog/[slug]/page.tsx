"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Eye,
  Heart,
  Share2,
  Bookmark,
  MessageCircle,
  Tag,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  ChevronRight
} from "lucide-react";
import { getBlogPost } from "@/lib/firebase";

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
    bio?: string;
  };
  publishedAt: string;
  readTime?: number;
  category: string;
  tags: string[];
  featuredImage?: string;
  views?: number;
  likes?: number;
  comments?: number;
  published: boolean;
}

interface BlogPageProps {
  params: {
    slug: string;
  };
}

export default function BlogPostPage({ params }: BlogPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    fetchBlogPost();
  }, [params.slug]);

  const fetchBlogPost = async () => {
    try {
      setLoading(true);
      
      // Try to find by slug or ID
      const blogPost = await getBlogPost(params.slug);
      
      if (!blogPost || (blogPost as any).published === false) {
        notFound();
        return;
      }

      setPost(blogPost as BlogPost);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      notFound();
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const handleShare = async (platform?: string) => {
    const url = window.location.href;
    const title = post?.title || 'Blog Post';
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
    setShowShareMenu(false);
  };

  const renderContent = (content: string) => {
    // Basic markdown-like rendering for line breaks and paragraphs
    return content.split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-4 text-gray-700 leading-relaxed">
        {paragraph.split('\n').map((line, lineIndex) => (
          <React.Fragment key={lineIndex}>
            {line}
            {lineIndex < paragraph.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <Link href="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
              {post.category}
            </span>
            <ChevronRight className="h-3 w-3" />
            <span>{post.title}</span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{post.author.name}</p>
                  <p className="text-sm text-gray-500">{post.author.role || 'Author'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(post.publishedAt)}
                </div>
                {post.readTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {post.readTime} min read
                  </div>
                )}
                {post.views && (
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {post.views} views
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6">
              <div className="flex items-center gap-4">
                <Button
                  variant={liked ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setLiked(!liked)}
                  className="flex items-center gap-2"
                >
                  <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                  {post.likes || 0} {liked && !post.likes ? 1 : ''}
                </Button>
                
                <Button
                  variant={bookmarked ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setBookmarked(!bookmarked)}
                  className="flex items-center gap-2"
                >
                  <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
                  Save
                </Button>
                
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                  
                  {showShareMenu && (
                    <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                      <button
                        onClick={() => handleShare('twitter')}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 w-full"
                      >
                        <Twitter className="h-4 w-4" />
                        Twitter
                      </button>
                      <button
                        onClick={() => handleShare('facebook')}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 w-full"
                      >
                        <Facebook className="h-4 w-4" />
                        Facebook
                      </button>
                      <button
                        onClick={() => handleShare('linkedin')}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 w-full"
                      >
                        <Linkedin className="h-4 w-4" />
                        LinkedIn
                      </button>
                      <button
                        onClick={() => handleShare('copy')}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 w-full"
                      >
                        <Copy className="h-4 w-4" />
                        Copy Link
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {post.comments !== undefined && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <MessageCircle className="h-4 w-4" />
                  {post.comments} comments
                </div>
              )}
            </div>
          </header>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="mb-8">
              <div className="relative w-full h-96 bg-gray-200 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-300 rounded mx-auto mb-2"></div>
                    <p className="text-sm">Featured Image</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Article Content */}
          <article className="prose prose-lg max-w-none">
            <div className="text-lg leading-relaxed">
              {renderContent(post.content)}
            </div>
          </article>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio */}
          {post.author.bio && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Author</h3>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{post.author.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{post.author.role || 'Author'}</p>
                      <p className="text-gray-700">{post.author.bio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Back to Blog */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <Link href="/blog">
              <Button variant="outline" className="flex items-center gap-2 mx-auto">
                <ArrowLeft className="h-4 w-4" />
                Back to All Articles
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
