"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/AuthProvider";
import { createService } from "@/lib/firebase";
import { 
  ArrowLeft,
  Save,
  Plus,
  X,
  Server,
  Bot,
  Code,
  Globe,
  Users,
  Shield,
  Zap,
  Gamepad2,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Eye,
  Trash2,
  CloudUpload,
  FileImage,
  Star,
  DollarSign
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Image from "next/image";

export default function NewService() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [features, setFeatures] = useState<string[]>([""]);
  const [gallery, setGallery] = useState<string[]>([""]);
  const [keywords, setKeywords] = useState<string[]>([""]);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pricing: "",
    category: "hosting",
    status: "active" as "active" | "inactive" | "coming-soon",
    badge: "",
    popular: false,
    icon: "Server",
    link: "",
    price: 0,
    rating: 5,
    reviewCount: 0,
    image: "",
    specifications: {
      cpu: "",
      ram: "",
      storage: "",
      bandwidth: ""
    },
    seo: {
      metaTitle: "",
      metaDescription: ""
    }
  });

  // Check if user is admin
  const isAdmin = user?.email === 'raghavlove305@gmail.com' || user?.role === 'admin';

  const categories = [
    { value: "hosting", label: "Hosting Solutions", icon: <Server className="h-4 w-4" /> },
    { value: "development", label: "Development", icon: <Code className="h-4 w-4" /> },
    { value: "bots", label: "Bot Development", icon: <Bot className="h-4 w-4" /> },
    { value: "domains", label: "Domains & Web", icon: <Globe className="h-4 w-4" /> },
    { value: "gaming", label: "Gaming Solutions", icon: <Gamepad2 className="h-4 w-4" /> },
    { value: "security", label: "Security Services", icon: <Shield className="h-4 w-4" /> },
    { value: "optimization", label: "Performance", icon: <Zap className="h-4 w-4" /> },
    { value: "consulting", label: "Consulting", icon: <Users className="h-4 w-4" /> }
  ];

  const iconOptions = [
    { value: "Server", label: "Server", icon: <Server className="h-5 w-5" /> },
    { value: "Bot", label: "Bot", icon: <Bot className="h-5 w-5" /> },
    { value: "Code", label: "Code", icon: <Code className="h-5 w-5" /> },
    { value: "Globe", label: "Globe", icon: <Globe className="h-5 w-5" /> },
    { value: "Users", label: "Users", icon: <Users className="h-5 w-5" /> },
    { value: "Shield", label: "Shield", icon: <Shield className="h-5 w-5" /> },
    { value: "Zap", label: "Zap", icon: <Zap className="h-5 w-5" /> },
    { value: "Gamepad2", label: "Gaming", icon: <Gamepad2 className="h-5 w-5" /> }
  ];

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-6">You need admin privileges to access this page.</p>
            <Link href="/services">
              <Button>Back to Services</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { 
        ...((prev as any)[parent] || {}),
        [field]: value 
      }
    }));
  };

  // Image upload functionality
  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setUploadingImage(true);
    try {
      // Create a preview URL for the uploaded file
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // For now, we'll use a placeholder URL. In production, you'd upload to Firebase Storage
      const imageUrl = `/api/placeholder/800/600?text=${encodeURIComponent(formData.title || 'Service Image')}`;
      
      setFormData(prev => ({ ...prev, image: imageUrl }));
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      handleImageUpload(file);
    }
  };

  const handleUrlUpload = () => {
    if (!formData.image.trim()) {
      toast.error('Please enter an image URL');
      return;
    }
    
    // Validate URL
    try {
      new URL(formData.image);
      setImagePreview(formData.image);
      toast.success('Image URL added successfully!');
    } catch {
      toast.error('Please enter a valid URL');
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addFeature = () => {
    setFeatures([...features, ""]);
  };

  const removeFeature = (index: number) => {
    if (features.length > 1) {
      setFeatures(features.filter((_, i) => i !== index));
    }
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const addGalleryItem = () => {
    setGallery([...gallery, ""]);
  };

  const removeGalleryItem = (index: number) => {
    if (gallery.length > 1) {
      setGallery(gallery.filter((_, i) => i !== index));
    }
  };

  const updateGalleryItem = (index: number, value: string) => {
    const newGallery = [...gallery];
    newGallery[index] = value;
    setGallery(newGallery);
  };

  const addKeyword = () => {
    setKeywords([...keywords, ""]);
  };

  const removeKeyword = (index: number) => {
    if (keywords.length > 1) {
      setKeywords(keywords.filter((_, i) => i !== index));
    }
  };

  const updateKeyword = (index: number, value: string) => {
    const newKeywords = [...keywords];
    newKeywords[index] = value;
    setKeywords(newKeywords);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      if (!formData.title.trim()) {
        toast.error("Service title is required");
        setLoading(false);
        return;
      }

      if (!formData.description.trim()) {
        toast.error("Service description is required");
        setLoading(false);
        return;
      }

      if (!formData.pricing.trim()) {
        toast.error("Pricing information is required");
        setLoading(false);
        return;
      }

      // Filter out empty features
      const validFeatures = features.filter(feature => feature.trim() !== "");
      
      if (validFeatures.length === 0) {
        toast.error("Please add at least one feature");
        setLoading(false);
        return;
      }

      const serviceData = {
        ...formData,
        name: formData.title, // Ensure name field is set
        features: validFeatures,
        gallery: gallery.filter(item => item.trim() !== ""),
        seo: {
          ...formData.seo,
          keywords: keywords.filter(keyword => keyword.trim() !== "")
        },
        author: user?.name || user?.email || "Admin"
      };

      await createService(serviceData);
      toast.success("Service created successfully!");
      router.push("/services");
    } catch (error) {
      console.error("Error creating service:", error);
      toast.error("Failed to create service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/services">
              <Button variant="outline" size="sm" className="bg-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Services
              </Button>
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Service</h1>
            <p className="text-gray-600">Add a new service to your offerings with enhanced features</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="xl:col-span-3 space-y-8">
              {/* Basic Information */}
              <Card className="shadow-sm border-0 bg-white">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <FileImage className="h-5 w-5 text-blue-600" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Service Title *
                      </label>
                      <Input
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="e.g., Premium VPS Hosting Solutions"
                        required
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        aria-label="Service category"
                      >
                        {categories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe your service in detail..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <DollarSign className="h-4 w-4 inline mr-1" />
                        Pricing Display *
                      </label>
                      <Input
                        name="pricing"
                        value={formData.pricing}
                        onChange={handleInputChange}
                        placeholder="e.g., Starting from ₹299/month"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Price (Number)
                      </label>
                      <Input
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="299"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Star className="h-4 w-4 inline mr-1" />
                        Rating
                      </label>
                      <Input
                        name="rating"
                        type="number"
                        value={formData.rating}
                        onChange={handleInputChange}
                        placeholder="5"
                        min="0"
                        max="5"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Service Link
                      </label>
                      <Input
                        name="link"
                        value={formData.link}
                        onChange={handleInputChange}
                        placeholder="/store/hosting"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Badge (Optional)
                      </label>
                      <Input
                        name="badge"
                        value={formData.badge}
                        onChange={handleInputChange}
                        placeholder="e.g., Most Popular, AI Powered"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Image Upload Section */}
              <Card className="shadow-sm border-0 bg-white">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <ImageIcon className="h-5 w-5 text-purple-600" />
                    Service Image
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Upload Method Selector */}
                  <div className="mb-6">
                    <div className="flex gap-4 mb-4">
                      <button
                        type="button"
                        onClick={() => setUploadMethod('url')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                          uploadMethod === 'url'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <LinkIcon className="h-4 w-4" />
                        URL Upload
                      </button>
                      <button
                        type="button"
                        onClick={() => setUploadMethod('file')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                          uploadMethod === 'file'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Upload className="h-4 w-4" />
                        File Upload
                      </button>
                    </div>

                    {/* URL Upload */}
                    {uploadMethod === 'url' && (
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            name="image"
                            value={formData.image}
                            onChange={handleInputChange}
                            placeholder="https://example.com/image.jpg"
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            onClick={handleUrlUpload}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* File Upload */}
                    {uploadMethod === 'file' && (
                      <div className="space-y-4">
                        <div
                          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <CloudUpload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-lg font-medium text-gray-600 mb-2">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-sm text-gray-500">
                            PNG, JPG, GIF up to 5MB
                          </p>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            aria-label="Upload service image"
                          />
                        </div>
                      </div>
                    )}

                    {/* Image Preview */}
                    {(imagePreview || formData.image) && (
                      <div className="mt-6 relative">
                        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                          <Image
                            src={imagePreview || formData.image}
                            alt="Service preview"
                            fill
                            className="object-cover"
                            onError={() => {
                              setImagePreview('');
                              toast.error('Failed to load image');
                            }}
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                            aria-label="Remove image"
                            title="Remove image"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {uploadingImage && (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-sm text-gray-600 mt-2">Uploading image...</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card className="shadow-sm border-0 bg-white">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Plus className="h-5 w-5 text-green-600" />
                    Service Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                          placeholder={`Feature ${index + 1}`}
                          className="flex-1"
                        />
                        {features.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeFeature(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addFeature}
                      className="w-full border-dashed border-green-300 text-green-600 hover:bg-green-50"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Feature
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Technical Specifications */}
              <Card className="shadow-sm border-0 bg-white">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Server className="h-5 w-5 text-orange-600" />
                    Technical Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CPU
                      </label>
                      <Input
                        value={formData.specifications.cpu}
                        onChange={(e) => handleNestedInputChange('specifications', 'cpu', e.target.value)}
                        placeholder="e.g., 2 vCPU"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        RAM
                      </label>
                      <Input
                        value={formData.specifications.ram}
                        onChange={(e) => handleNestedInputChange('specifications', 'ram', e.target.value)}
                        placeholder="e.g., 4GB DDR4"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Storage
                      </label>
                      <Input
                        value={formData.specifications.storage}
                        onChange={(e) => handleNestedInputChange('specifications', 'storage', e.target.value)}
                        placeholder="e.g., 100GB NVMe SSD"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bandwidth
                      </label>
                      <Input
                        value={formData.specifications.bandwidth}
                        onChange={(e) => handleNestedInputChange('specifications', 'bandwidth', e.target.value)}
                        placeholder="e.g., Unlimited"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SEO Settings */}
              <Card className="shadow-sm border-0 bg-white">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Globe className="h-5 w-5 text-indigo-600" />
                    SEO Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Title
                    </label>
                    <Input
                      value={formData.seo.metaTitle}
                      onChange={(e) => handleNestedInputChange('seo', 'metaTitle', e.target.value)}
                      placeholder="e.g., Best VPS Hosting in India - Universal Cloud"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      value={formData.seo.metaDescription}
                      onChange={(e) => handleNestedInputChange('seo', 'metaDescription', e.target.value)}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Brief description for search engines..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Keywords
                    </label>
                    <div className="space-y-2">
                      {keywords.map((keyword, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={keyword}
                            onChange={(e) => updateKeyword(index, e.target.value)}
                            placeholder={`Keyword ${index + 1}`}
                            className="flex-1"
                          />
                          {keywords.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeKeyword(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addKeyword}
                        className="w-full border-dashed"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Keyword
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="xl:col-span-1 space-y-6">
              {/* Service Settings */}
              <Card className="shadow-sm border-0 bg-white sticky top-4">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                  <CardTitle className="text-lg">Service Settings</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      aria-label="Service status"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="coming-soon">Coming Soon</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon
                    </label>
                    <select
                      name="icon"
                      value={formData.icon}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      aria-label="Service icon"
                    >
                      {iconOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="popular"
                      name="popular"
                      checked={formData.popular}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="popular" className="text-sm text-gray-700">
                      Mark as Popular
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Review Count
                    </label>
                    <Input
                      name="reviewCount"
                      type="number"
                      value={formData.reviewCount}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card className="shadow-sm border-0 bg-white">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Create Service
                        </>
                      )}
                    </Button>
                    
                    <Link href="/services">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
