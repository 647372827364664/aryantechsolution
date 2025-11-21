"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/AuthProvider";
import { getService, updateService, deleteService } from "@/lib/firebase";
import { 
  ArrowLeft,
  Save,
  Plus,
  X,
  Trash2,
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
  CloudUpload,
  FileImage,
  Star,
  DollarSign
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface Service {
  id: string;
  title: string;
  name: string;
  description: string;
  features: string[];
  pricing: string;
  category: string;
  status: 'active' | 'inactive' | 'coming-soon';
  badge?: string;
  popular?: boolean;
  icon?: string;
  link?: string;
  price?: number;
  rating?: number;
  reviewCount?: number;
  image?: string;
  gallery?: string[];
  specifications?: {
    cpu?: string;
    ram?: string;
    storage?: string;
    bandwidth?: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export default function EditService() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [service, setService] = useState<Service | null>(null);
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
    { value: "hosting", label: "Hosting Solutions" },
    { value: "development", label: "Development" },
    { value: "bots", label: "Bot Development" },
    { value: "domains", label: "Domains & Web" },
    { value: "gaming", label: "Gaming Solutions" },
    { value: "security", label: "Security Services" },
    { value: "optimization", label: "Performance" },
    { value: "consulting", label: "Consulting" }
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

  useEffect(() => {
    if (params.id && isAdmin) {
      fetchService();
    }
  }, [params.id, isAdmin]);

  const fetchService = async () => {
    setFetchLoading(true);
    try {
      const serviceData = await getService(params.id as string);
      if (serviceData) {
        const service = serviceData as any; // Type assertion for Firebase data
        setService(service as Service);
        setFormData({
          title: service.title || "",
          description: service.description || "",
          pricing: service.pricing || "",
          category: service.category || "hosting",
          status: service.status || "active",
          badge: service.badge || "",
          popular: service.popular || false,
          icon: service.icon || "Server",
          link: service.link || "",
          price: service.price || 0,
          rating: service.rating || 5,
          reviewCount: service.reviewCount || 0,
          image: service.image || "",
          specifications: {
            cpu: service.specifications?.cpu || "",
            ram: service.specifications?.ram || "",
            storage: service.specifications?.storage || "",
            bandwidth: service.specifications?.bandwidth || ""
          },
          seo: {
            metaTitle: service.seo?.metaTitle || "",
            metaDescription: service.seo?.metaDescription || ""
          }
        });
        setFeatures(service.features || [""]);
        setGallery(service.gallery || [""]);
        setKeywords(service.seo?.keywords || [""]);
        setImagePreview(service.image || "");
      } else {
        toast.error("Service not found");
        router.push("/services");
      }
    } catch (error) {
      console.error("Error fetching service:", error);
      toast.error("Failed to load service");
      router.push("/services");
    } finally {
      setFetchLoading(false);
    }
  };

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

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service...</p>
        </div>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filter out empty features
      const validFeatures = features.filter(feature => feature.trim() !== "");
      
      if (validFeatures.length === 0) {
        toast.error("Please add at least one feature");
        setLoading(false);
        return;
      }

      const serviceData = {
        ...formData,
        features: validFeatures
      };

      await updateService(params.id as string, serviceData);
      toast.success("Service updated successfully!");
      router.push("/services");
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error("Failed to update service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this service? This action cannot be undone.")) {
      return;
    }

    setLoading(true);
    try {
      await deleteService(params.id as string);
      toast.success("Service deleted successfully!");
      router.push("/services");
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("Failed to delete service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/services">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Services
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Service</h1>
          <p className="text-gray-600 mt-2">Update service information</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Title *
                    </label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., VPS Hosting Solutions"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe your service..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pricing *
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service Link
                      </label>
                      <Input
                        name="link"
                        value={formData.link}
                        onChange={handleInputChange}
                        placeholder="/store/hosting"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Badge (Optional)
                    </label>
                    <Input
                      name="badge"
                      value={formData.badge}
                      onChange={handleInputChange}
                      placeholder="e.g., Most Popular, AI Powered"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle>Service Features</CardTitle>
                </CardHeader>
                <CardContent>
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
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Service Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Service Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      aria-label="Service category"
                    >
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

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

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="popular"
                      name="popular"
                      checked={formData.popular}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="popular" className="ml-2 block text-sm text-gray-700">
                      Mark as Popular
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Update Service
                        </>
                      )}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={loading}
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Service
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
