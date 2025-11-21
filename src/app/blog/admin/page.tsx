"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/AuthProvider";
import { getBlogPosts, deleteBlogPost, createBlogPost, updateBlogPost } from "@/lib/firebase";
import { 
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  FileText,
  Globe,
  Lock,
  Save,
  X,
  ArrowLeft,
  Calendar,
  Heart,
  MessageCircle,
  BarChart3,
  BookOpen,
  User
} from "lucide-react";
import { toast } from "react-hot-toast";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    role: string;
  };
  category: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  featuredImage: string;
  publishedAt?: any;
  createdAt?: any;
  updatedAt?: any;
  views?: number;
  likes?: number;
  comments?: number;
  readTime?: number;
}

export default function BlogAdminPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [newPost, setNewPost] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    tags: [""],
    featured: false,
    published: false,
    featuredImage: ""
  });

  // Check if user is admin
  const isAdmin = user?.email === 'raghavlove305@gmail.com' || user?.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      fetchPosts();
    }
  }, [isAdmin]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      // Pass true to include unpublished drafts for admin view
      const blogPosts = await getBlogPosts(undefined, undefined, true);
      setPosts(blogPosts as BlogPost[]);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      // Don't show error toast, handle gracefully
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    
    try {
      await deleteBlogPost(postId);
      setPosts(prev => prev.filter(post => post.id !== postId));
      toast.success("Blog post deleted successfully!");
    } catch (error) {
      console.error("Error deleting blog post:", error);
      toast.error("Failed to delete blog post");
    }
  };

  const handleEditPost = (post: BlogPost) => {
    setSelectedPost(post);
    setNewPost({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      tags: post.tags.length > 0 ? post.tags : [""],
      featured: post.featured,
      published: post.published,
      featuredImage: post.featuredImage || ""
    });
    setShowEditModal(true);
  };

  const handlePreviewPost = (post: BlogPost) => {
    setSelectedPost(post);
    setShowPreviewModal(true);
  };

  const handleUpdatePost = async () => {
    if (!selectedPost || !newPost.title.trim() || !newPost.content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const postData = {
        ...newPost,
        author: {
          name: user?.name || user?.email || "Admin",
          role: user?.role || "Admin"
        },
        slug: newPost.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        tags: newPost.tags.filter((tag: string) => tag.trim() !== ""),
        updatedAt: new Date()
      };

      await updateBlogPost(selectedPost.id, postData);
      await fetchPosts();
      setShowEditModal(false);
      resetForm();
      toast.success("Blog post updated successfully!");
    } catch (error) {
      console.error("Error updating blog post:", error);
      toast.error("Failed to update blog post");
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const postData = {
        ...newPost,
        author: {
          name: user?.name || user?.email || "Admin",
          role: user?.role || "Admin"
        },
        slug: newPost.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        tags: newPost.tags.filter((tag: string) => tag.trim() !== "")
      };

      await createBlogPost(postData);
      setShowCreateModal(false);
      resetForm();
      await fetchPosts();
      toast.success("Blog post created successfully!");
    } catch (error) {
      console.error("Error creating blog post:", error);
      toast.error("Failed to create blog post");
    }
  };

  const resetForm = () => {
    setNewPost({
      title: "",
      excerpt: "",
      content: "",
      category: "",
      tags: [""],
      featured: false,
      published: false,
      featuredImage: ""
    });
    setSelectedPost(null);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">You don't have permission to access the blog admin panel.</p>
            <Link href="/blog">
              <Button>Back to Blog</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "published" && post.published) ||
                         (filterStatus === "draft" && !post.published);
    return matchesSearch && matchesStatus;
  });

  const publishedCount = posts.filter(post => post.published).length;
  const draftCount = posts.filter(post => !post.published).length;
  const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);

  const addTag = () => {
    setNewPost(prev => ({ ...prev, tags: [...prev.tags, ""] }));
  };

  const updateTag = (index: number, value: string) => {
    setNewPost(prev => ({
      ...prev,
      tags: prev.tags.map((tag, i) => i === index ? value : tag)
    }));
  };

  const removeTag = (index: number) => {
    setNewPost(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const formatContent = (content: string) => {
    // Convert markdown-like formatting to HTML for preview
    return content
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mb-3">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-medium mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^(.*)$/gim, '<p class="mb-4">$1</p>');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog administration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Link href="/blog">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-600" />
                  Blog Administration
                </h1>
                <p className="text-gray-600 mt-1">Manage your blog posts and content</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button onClick={() => setShowCreateModal(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="mr-2 h-4 w-4" />
                New Post
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Total Posts</p>
                    <p className="text-3xl font-bold text-blue-900">{posts.length}</p>
                  </div>
                  <div className="p-3 bg-blue-200 rounded-full">
                    <FileText className="h-6 w-6 text-blue-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Published</p>
                    <p className="text-3xl font-bold text-green-900">{publishedCount}</p>
                  </div>
                  <div className="p-3 bg-green-200 rounded-full">
                    <Globe className="h-6 w-6 text-green-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-700">Drafts</p>
                    <p className="text-3xl font-bold text-yellow-900">{draftCount}</p>
                  </div>
                  <div className="p-3 bg-yellow-200 rounded-full">
                    <Edit className="h-6 w-6 text-yellow-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700">Total Views</p>
                    <p className="text-3xl font-bold text-purple-900">{totalViews.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-purple-200 rounded-full">
                    <BarChart3 className="h-6 w-6 text-purple-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-4">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as "all" | "published" | "draft")}
                  className="bg-white border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Filter posts by status"
                >
                  <option value="all">All Posts</option>
                  <option value="published">Published</option>
                  <option value="draft">Drafts</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Posts Table */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Blog Posts ({filteredPosts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts found</h3>
                  <p className="text-gray-500 mb-6">
                    {posts.length === 0 
                      ? "Get started by creating your first blog post." 
                      : "Try adjusting your search or filter criteria."
                    }
                  </p>
                  <Button onClick={() => setShowCreateModal(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Post
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Post
                        </th>
                        <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Author
                        </th>
                        <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Stats
                        </th>
                        <th className="text-right px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredPosts.map((post) => (
                        <tr key={post.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                                  <BookOpen className="h-6 w-6 text-blue-600" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                  {post.title}
                                </p>
                                <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                                  {post.excerpt}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                                    {post.category}
                                  </span>
                                  {post.featured && (
                                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-800">
                                      Featured
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium">{post.author.name}</p>
                                <p className="text-gray-500 text-xs">{post.author.role}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              post.published 
                                ? "bg-green-100 text-green-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {post.published ? "Published" : "Draft"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleDateString() : "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {post.views || 0}
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {post.likes || 0}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handlePreviewPost(post)}
                                title="Preview Post"
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditPost(post)}
                                title="Edit Post"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Link href={`/blog/${post.slug}`}>
                                <Button variant="ghost" size="sm" title="View Live Post">
                                  <Globe className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeletePost(post.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                title="Delete Post"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Create New Blog Post</h2>
                <Button variant="ghost" size="sm" onClick={() => { setShowCreateModal(false); resetForm(); }}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <Input
                    value={newPost.title}
                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter post title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <Input
                    value={newPost.category}
                    onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g., Technology, Business"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                <textarea
                  value={newPost.excerpt}
                  onChange={(e) => setNewPost(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief description of the post..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your blog post content..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
                  rows={12}
                />
                <p className="text-xs text-gray-500 mt-1">Supports basic Markdown formatting</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image URL</label>
                <Input
                  value={newPost.featuredImage}
                  onChange={(e) => setNewPost(prev => ({ ...prev, featuredImage: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                {newPost.tags.map((tag, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <Input
                      value={tag}
                      onChange={(e) => updateTag(index, e.target.value)}
                      placeholder="Enter tag..."
                      className="flex-1"
                    />
                    {newPost.tags.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTag(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addTag}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Tag
                </Button>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newPost.featured}
                    onChange={(e) => setNewPost(prev => ({ ...prev, featured: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Featured Post</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newPost.published}
                    onChange={(e) => setNewPost(prev => ({ ...prev, published: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Publish Immediately</span>
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setShowCreateModal(false); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleCreatePost} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Save className="mr-2 h-4 w-4" />
                Create Post
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Post Modal */}
      {showEditModal && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Edit Blog Post</h2>
                <Button variant="ghost" size="sm" onClick={() => { setShowEditModal(false); resetForm(); }}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <Input
                    value={newPost.title}
                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter post title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <Input
                    value={newPost.category}
                    onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g., Technology, Business"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                <textarea
                  value={newPost.excerpt}
                  onChange={(e) => setNewPost(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief description of the post..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your blog post content..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
                  rows={12}
                />
                <p className="text-xs text-gray-500 mt-1">Supports basic Markdown formatting</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image URL</label>
                <Input
                  value={newPost.featuredImage}
                  onChange={(e) => setNewPost(prev => ({ ...prev, featuredImage: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                {newPost.tags.map((tag, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <Input
                      value={tag}
                      onChange={(e) => updateTag(index, e.target.value)}
                      placeholder="Enter tag..."
                      className="flex-1"
                    />
                    {newPost.tags.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTag(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addTag}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Tag
                </Button>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newPost.featured}
                    onChange={(e) => setNewPost(prev => ({ ...prev, featured: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Featured Post</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newPost.published}
                    onChange={(e) => setNewPost(prev => ({ ...prev, published: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Published</span>
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setShowEditModal(false); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleUpdatePost} className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                <Save className="mr-2 h-4 w-4" />
                Update Post
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Post Modal */}
      {showPreviewModal && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Post Preview</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowPreviewModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Preview Header */}
              <div className="mb-6">
                <div className="mb-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    selectedPost.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedPost.published ? 'Published' : 'Draft'}
                  </span>
                  {selectedPost.featured && (
                    <span className="ml-2 inline-flex px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      Featured
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedPost.title}</h1>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <span className="font-medium">{selectedPost.author.name}</span>
                      <span className="text-gray-400 mx-1">•</span>
                      <span>{selectedPost.author.role}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {selectedPost.createdAt ? new Date(selectedPost.createdAt.seconds * 1000).toLocaleDateString() : "N/A"}
                  </div>

                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                    {selectedPost.category}
                  </span>
                </div>

                <p className="text-lg text-gray-600 leading-relaxed">{selectedPost.excerpt}</p>
              </div>

              {/* Featured Image */}
              {selectedPost.featuredImage && (
                <div className="mb-6">
                  <img 
                    src={selectedPost.featuredImage} 
                    alt={selectedPost.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Content */}
              <div className="prose max-w-none">
                <div 
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatContent(selectedPost.content) }}
                />
              </div>

              {/* Tags */}
              {selectedPost.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPost.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {selectedPost.views || 0} views
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {selectedPost.likes || 0} likes
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {selectedPost.comments || 0} comments
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-between">
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowPreviewModal(false);
                    handleEditPost(selectedPost);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Post
                </Button>
                <Link href={`/blog/${selectedPost.slug}`}>
                  <Button variant="outline">
                    <Globe className="mr-2 h-4 w-4" />
                    View Live
                  </Button>
                </Link>
              </div>
              <Button onClick={() => setShowPreviewModal(false)}>
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
