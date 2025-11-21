'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  X, 
  Plus,
  Image as ImageIcon,
  AlertCircle,
  Link as LinkIcon,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, uploadFile } from '@/lib/firebase';
import { useAuth } from '@/components/providers/AuthProvider';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  category: string;
  subcategory: string;
  images: string[];
  badge: string;
  features: string[];
  specifications: Record<string, string>;
  stockQuantity: number;
  sku: string;
  tags: string[];
  status: 'active' | 'inactive' | 'draft';
  deliveryTime: string;
  shortDescription: string;
}

export default function AddProductPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadingImages, setUploadingImages] = useState<boolean[]>([]);
  const [features, setFeatures] = useState<string[]>(['']);
  const [tags, setTags] = useState<string[]>(['']);
  const [specifications, setSpecifications] = useState<{key: string, value: string}[]>([{key: '', value: ''}]);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    category: '',
    subcategory: '',
    images: [],
    badge: '',
    features: [],
    specifications: {},
    stockQuantity: 0,
    sku: '',
    tags: [],
    status: 'draft',
    deliveryTime: '',
    shortDescription: ''
  });

  // Admin authentication check
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/auth/login');
    }
  }, [user, router]);

  // Admin authentication guard
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold text-gray-800">Access Denied</CardTitle>
            <CardDescription>
              You need admin privileges to add products.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/auth/login">
              <Button className="w-full">
                Login as Admin
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const categories = [
    { id: 'hosting', name: 'Web Hosting', subcategories: ['shared', 'vps', 'dedicated', 'cloud'] },
    { id: 'domains', name: 'Domains', subcategories: ['registration', 'transfer', 'management'] },
    { id: 'development', name: 'Development', subcategories: ['web', 'mobile', 'bots', 'api'] },
    { id: 'gaming', name: 'Gaming', subcategories: ['minecraft', 'discord', 'servers'] },
    { id: 'security', name: 'Security', subcategories: ['ssl', 'backup', 'monitoring'] },
    { id: 'optimization', name: 'Optimization', subcategories: ['seo', 'performance', 'cdn'] },
    { id: 'support', name: 'Support', subcategories: ['priority', 'consultation', 'maintenance'] }
  ];

  const getCurrentSubcategories = () => {
    const category = categories.find(cat => cat.id === formData.category);
    return category ? category.subcategories : [];
  };

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
    handleInputChange('images', newUrls.filter(url => url.trim() !== ''));
  };

  const addImageUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  const removeImageUrl = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
    handleInputChange('images', newUrls.filter(url => url.trim() !== ''));
  };

  // File upload functions
  const handleFileUpload = async (index: number, file: File) => {
    if (!file) return;

    try {
      // Update uploading state
      const newUploadingStates = [...uploadingImages];
      newUploadingStates[index] = true;
      setUploadingImages(newUploadingStates);

      // Generate unique filename
      const timestamp = Date.now();
      const fileName = `products/${timestamp}_${file.name}`;
      
      // Upload file to Firebase Storage
      const downloadURL = await uploadFile(file, fileName);
      
      // Update image URL
      const newUrls = [...imageUrls];
      newUrls[index] = downloadURL;
      setImageUrls(newUrls);
      handleInputChange('images', newUrls.filter(url => url.trim() !== ''));

      // Store file reference
      const newFiles = [...imageFiles];
      newFiles[index] = file;
      setImageFiles(newFiles);

    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      // Reset uploading state
      const newUploadingStates = [...uploadingImages];
      newUploadingStates[index] = false;
      setUploadingImages(newUploadingStates);
    }
  };

  const addImageField = () => {
    setImageUrls([...imageUrls, '']);
    setUploadingImages([...uploadingImages, false]);
  };

  const removeImageField = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newUploadingStates = uploadingImages.filter((_, i) => i !== index);
    
    setImageUrls(newUrls);
    setImageFiles(newFiles);
    setUploadingImages(newUploadingStates);
    handleInputChange('images', newUrls.filter(url => url.trim() !== ''));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
    handleInputChange('features', newFeatures.filter(feature => feature.trim() !== ''));
  };

  const addFeature = () => {
    setFeatures([...features, '']);
  };

  const removeFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures);
    handleInputChange('features', newFeatures.filter(feature => feature.trim() !== ''));
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
    handleInputChange('tags', newTags.filter(tag => tag.trim() !== ''));
  };

  const addTag = () => {
    setTags([...tags, '']);
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    handleInputChange('tags', newTags.filter(tag => tag.trim() !== ''));
  };

  const handleSpecificationChange = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
    
    const specsObject = newSpecs.reduce((acc, spec) => {
      if (spec.key.trim() && spec.value.trim()) {
        acc[spec.key] = spec.value;
      }
      return acc;
    }, {} as Record<string, string>);
    
    handleInputChange('specifications', specsObject);
  };

  const addSpecification = () => {
    setSpecifications([...specifications, {key: '', value: ''}]);
  };

  const removeSpecification = (index: number) => {
    const newSpecs = specifications.filter((_, i) => i !== index);
    setSpecifications(newSpecs);
    
    const specsObject = newSpecs.reduce((acc, spec) => {
      if (spec.key.trim() && spec.value.trim()) {
        acc[spec.key] = spec.value;
      }
      return acc;
    }, {} as Record<string, string>);
    
    handleInputChange('specifications', specsObject);
  };

  const generateSKU = () => {
    const prefix = formData.category.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${randomNum}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate SKU if not provided
      const sku = formData.sku || generateSKU();
      
      const productData = {
        ...formData,
        sku,
        rating: 0,
        reviews: 0,
        inStock: formData.stockQuantity > 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'products'), productData);
      router.push('/admin/products');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin/products">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Products
                </Button>
              </Link>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Add New Product
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button type="submit" form="product-form" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Product'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form id="product-form" onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential product details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU
                  </label>
                  <Input
                    value={formData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    placeholder="Auto-generated if empty"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description *
                </label>
                <Input
                  value={formData.shortDescription}
                  onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                  placeholder="Brief product description for listings"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed product description"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Category & Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Category & Pricing</CardTitle>
              <CardDescription>Product classification and pricing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      handleInputChange('category', e.target.value);
                      handleInputChange('subcategory', ''); // Reset subcategory
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    title="Select product category"
                    aria-label="Select product category"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory
                  </label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) => handleInputChange('subcategory', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!formData.category}
                    title="Select product subcategory"
                    aria-label="Select product subcategory"
                  >
                    <option value="">Select Subcategory</option>
                    {getCurrentSubcategories().map(sub => (
                      <option key={sub} value={sub}>
                        {sub.charAt(0).toUpperCase() + sub.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original Price
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => handleInputChange('originalPrice', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <Input
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => handleInputChange('stockQuantity', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Badge
                  </label>
                  <Input
                    value={formData.badge}
                    onChange={(e) => handleInputChange('badge', e.target.value)}
                    placeholder="e.g., Best Seller, Popular, New"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Time
                  </label>
                  <Input
                    value={formData.deliveryTime}
                    onChange={(e) => handleInputChange('deliveryTime', e.target.value)}
                    placeholder="e.g., Instant, 24 hours, 1-2 weeks"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>Add product images using URL or file upload</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="space-y-3 p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm text-gray-700">Image {index + 1}</h4>
                    {imageUrls.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImageField(index)}
                        title="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  {/* URL Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-600 flex items-center">
                      <LinkIcon className="h-3 w-3 mr-1" />
                      Image URL
                    </label>
                    <Input
                      value={url}
                      onChange={(e) => handleImageUrlChange(index, e.target.value)}
                      placeholder="Enter image URL"
                    />
                  </div>

                  {/* File Upload */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-600 flex items-center">
                      <Upload className="h-3 w-3 mr-1" />
                      Or Upload File
                    </label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(index, file);
                          }
                        }}
                        disabled={uploadingImages[index]}
                        className="flex-1"
                      />
                      {uploadingImages[index] && (
                        <div className="flex items-center text-sm text-blue-600">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                          Uploading...
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Preview */}
                  {url && (
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-600">Preview</label>
                      <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={url}
                          alt={`Product image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addImageField}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Image
              </Button>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Product Features</CardTitle>
              <CardDescription>Key features and benefits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="flex-1">
                    <Input
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder="Enter feature"
                    />
                  </div>
                  {features.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeature(index)}
                      title="Remove feature"
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
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Feature
              </Button>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
              <CardDescription>Detailed technical specifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {specifications.map((spec, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Input
                    value={spec.key}
                    onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                    placeholder="Specification name"
                  />
                  <div className="flex items-center space-x-2">
                    <Input
                      value={spec.value}
                      onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                      placeholder="Specification value"
                    />
                    {specifications.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSpecification(index)}
                        title="Remove specification"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addSpecification}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Specification
              </Button>
            </CardContent>
          </Card>

          {/* Tags & Status */}
          <Card>
            <CardHeader>
              <CardTitle>Tags & Status</CardTitle>
              <CardDescription>Search tags and publication status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="space-y-2">
                  {tags.map((tag, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="flex-1">
                        <Input
                          value={tag}
                          onChange={(e) => handleTagChange(index, e.target.value)}
                          placeholder="Enter tag"
                        />
                      </div>
                      {tags.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTag(index)}
                          title="Remove tag"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTag}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tag
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as 'active' | 'inactive' | 'draft')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  title="Select product status"
                  aria-label="Select product status"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Link href="/admin/products">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Save Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
