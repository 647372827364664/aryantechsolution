"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { 
  Server, 
  Globe, 
  Bot, 
  Code, 
  Gamepad2,
  CheckCircle,
  ArrowRight,
  Users,
  Shield,
  Zap,
  Clock,
  Award,
  TrendingUp,
  Sparkles,
  Star,
  HeadphonesIcon,
  Search,
  Filter,
  Grid,
  List,
  Plus,
  Edit,
  Trash2,
  Eye,
  SortAsc,
  SortDesc,
  RefreshCw,
  MessageCircle,
  ThumbsUp,
  Target,
  Rocket,
  Database,
  Cloud,
  Cpu,
  HardDrive
} from "lucide-react";
import { getServices, deleteService } from "@/lib/firebase";
import { useAuth } from "@/components/providers/AuthProvider";
import toast from "react-hot-toast";
import { Service } from "@/types";
import { useCurrency } from "@/lib/currency";
import CurrencySelector from "@/components/ui/CurrencySelector";

export default function Services() {
  const { user } = useAuth();
  const { currency, formatPrice, convertFromUSD } = useCurrency();
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("created");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Check if user is admin (you can customize this logic)
  const isAdmin = user?.email === 'raghavlove305@gmail.com' || user?.role === 'admin';

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "hosting", label: "Hosting Solutions" },
    { value: "development", label: "Development" },
    { value: "bots", label: "Bot Development" },
    { value: "domains", label: "Domains & Web" },
    { value: "gaming", label: "Gaming Solutions" },
    { value: "security", label: "Security Services" },
    { value: "optimization", label: "Performance" },
    { value: "consulting", label: "Consulting" }
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "coming-soon", label: "Coming Soon" }
  ];

  // Empty services message component
  const EmptyServicesMessage = () => (
    <div className="col-span-full text-center py-16">
      <div className="max-w-md mx-auto">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
          <Server className="w-12 h-12 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">No Services Available</h3>
        <p className="text-gray-800 mb-6">
          We're currently updating our services catalog. Check back soon for exciting new offerings!
        </p>
        {isAdmin && (
          <Link href="/admin/services/new">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add New Service
            </Button>
          </Link>
        )}
      </div>
    </div>
  );

  useEffect(() => {
    fetchServices();
  }, [selectedCategory, selectedStatus]);

  useEffect(() => {
    filterAndSortServices();
  }, [services, searchTerm, sortBy, sortOrder]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const fetchedServices = await getServices(
        selectedCategory === "all" ? undefined : selectedCategory,
        selectedStatus === "all" ? undefined : selectedStatus
      );
      
      setServices(fetchedServices as Service[]);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to fetch services. Please try again.");
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortServices = () => {
    let filtered = [...services];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(service =>
        (service.title || service.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.features.some(feature => 
          feature.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "title":
          comparison = (a.title || a.name || '').localeCompare(b.title || b.name || '');
          break;
        case "pricing":
          // Extract number from pricing string for comparison
          const priceA = parseInt((a.pricing || '').replace(/[^\d]/g, '')) || 0;
          const priceB = parseInt((b.pricing || '').replace(/[^\d]/g, '')) || 0;
          comparison = priceA - priceB;
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        case "created":
        default:
          // For default services, use the order they appear
          if (!a.createdAt || !b.createdAt) {
            comparison = parseInt(a.id) - parseInt(b.id);
          } else {
            const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
            const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
            comparison = dateA.getTime() - dateB.getTime();
          }
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredServices(filtered);
  };

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: React.ReactElement } = {
      Server: <Server className="h-20 w-20 text-blue-600" />,
      Bot: <Bot className="h-20 w-20 text-purple-600" />,
      Code: <Code className="h-20 w-20 text-green-600" />,
      Globe: <Globe className="h-20 w-20 text-orange-600" />,
      Users: <Users className="h-20 w-20 text-blue-600" />,
      Shield: <Shield className="h-20 w-20 text-green-600" />,
      Zap: <Zap className="h-20 w-20 text-yellow-600" />,
      Gamepad2: <Gamepad2 className="h-20 w-20 text-red-600" />
    };
    return icons[iconName] || <Server className="h-20 w-20 text-blue-600" />;
  };

  const additionalServices = [
    {
      icon: <Users className="h-12 w-12 text-blue-600" />,
      title: "Developer Hiring",
      description: "Access our network of skilled developers for your projects with verified expertise",
      highlights: ["Vetted Developers", "Project Management", "Quality Assurance"],
      link: "/services/developers"
    },
    {
      icon: <Shield className="h-12 w-12 text-green-600" />,
      title: "Security Audits",
      description: "Comprehensive security assessments and penetration testing for your applications",
      highlights: ["Vulnerability Assessment", "Compliance Reports", "Security Hardening"],
      link: "/services/security"
    },
    {
      icon: <Zap className="h-12 w-12 text-yellow-600" />,
      title: "Performance Optimization",
      description: "Speed up your websites and applications with advanced optimization techniques",
      highlights: ["Speed Analysis", "Code Optimization", "CDN Integration"],
      link: "/services/optimization"
    },
    {
      icon: <Gamepad2 className="h-12 w-12 text-red-600" />,
      title: "Gaming Solutions",
      description: "Specialized gaming servers and plugin development for Minecraft and other games",
      highlights: ["Custom Plugins", "Game Servers", "Anti-cheat Systems"],
      link: "/services/gaming"
    }
  ];

  const whyChooseUs = [
    {
      icon: <Award className="h-8 w-8 text-blue-600" />,
      title: "Proven Expertise",
      description: "500+ successful projects delivered with 99.9% client satisfaction rate"
    },
    {
      icon: <HeadphonesIcon className="h-8 w-8 text-green-600" />,
      title: "24/7 Support",
      description: "Round-the-clock technical support from experienced developers and system administrators"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
      title: "Scalable Solutions",
      description: "Infrastructure and applications that grow with your business needs"
    },
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: "Enterprise Security",
      description: "Bank-grade security measures to protect your data and applications"
    },
    {
      icon: <Sparkles className="h-8 w-8 text-yellow-600" />,
      title: "Latest Technology",
      description: "Cutting-edge tools and frameworks for optimal performance and reliability"
    },
    {
      icon: <Users className="h-8 w-8 text-indigo-600" />,
      title: "Expert Team",
      description: "Skilled professionals with years of experience in their respective domains"
    }
  ];

  const processSteps = [
    { 
      step: "1", 
      title: "Consultation", 
      description: "We analyze your requirements and provide expert recommendations tailored to your needs",
      color: "bg-blue-600"
    },
    { 
      step: "2", 
      title: "Planning", 
      description: "Detailed project planning with clear timelines, milestones, and deliverables",
      color: "bg-green-600"
    },
    { 
      step: "3", 
      title: "Development", 
      description: "Professional implementation using best practices and modern development methodologies",
      color: "bg-purple-600"
    },
    { 
      step: "4", 
      title: "Deployment", 
      description: "Seamless deployment with testing, optimization, and go-live support",
      color: "bg-orange-600"
    },
    { 
      step: "5", 
      title: "Support", 
      description: "Ongoing maintenance, monitoring, and 24/7 technical support for peace of mind",
      color: "bg-red-600"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 sm:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-10 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 animate-bounce">
            <Server className="h-8 w-8 text-blue-400 opacity-60" />
          </div>
          <div className="absolute top-32 right-1/4 animate-bounce animation-delay-1000">
            <Code className="h-6 w-6 text-purple-400 opacity-60" />
          </div>
          <div className="absolute bottom-32 left-1/3 animate-bounce animation-delay-2000">
            <Bot className="h-7 w-7 text-green-400 opacity-60" />
          </div>
          <div className="absolute bottom-20 right-1/3 animate-bounce animation-delay-3000">
            <Shield className="h-6 w-6 text-orange-400 opacity-60" />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium mb-8 shadow-lg">
              <Sparkles className="h-4 w-4 mr-2" />
              Comprehensive Tech Solutions for Modern Businesses
              <Rocket className="h-4 w-4 ml-2" />
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Services</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-800 max-w-4xl mx-auto mb-8 leading-relaxed">
              From <span className="font-semibold text-blue-600">enterprise hosting</span> to 
              <span className="font-semibold text-purple-600"> custom development</span>, 
              we provide cutting-edge solutions that scale with your business needs.
            </p>
            
            {/* Currency Selector */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                <span className="text-sm text-gray-600">Currency:</span>
                <CurrencySelector />
              </div>
            </div>
            
            {/* Hero Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">1.2k+</div>
                <div className="text-sm text-gray-800">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">99.9%</div>
                <div className="text-sm text-gray-800">Uptime SLA</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">24/7</div>
                <div className="text-sm text-gray-800">Support</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">500+</div>
                <div className="text-sm text-gray-800">Projects</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="#services">
                <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  Explore Services 
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/services/support" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg border-2 hover:bg-blue-50 border-blue-600 text-blue-600 transition-all duration-300 group">
                  <HeadphonesIcon className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Get Support
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg border-2 hover:bg-gray-50 transition-all duration-300 group">
                  <MessageCircle className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Free Consultation
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-700 mb-6">Trusted by leading companies worldwide</p>
              <div className="flex justify-center items-center space-x-8 opacity-60">
                {["TechCorp", "StartupXYZ", "Enterprise Inc", "Digital Co", "CloudTech"].map((company, index) => (
                  <div key={index} className="text-gray-600 font-semibold">
                    {company}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section id="services" className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-6">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                />
              </div>

              {/* Admin Controls */}
              {isAdmin && (
                <div className="flex gap-3">
                  <Link href="/admin/services/new">
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Service
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={fetchServices}
                    disabled={loading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              )}

              {/* View Toggle */}
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Filter by category"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Filter by status"
                  >
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Sort services by"
                  >
                    <option value="created">Date Created</option>
                    <option value="title">Title</option>
                    <option value="pricing">Price</option>
                    <option value="category">Category</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order
                  </label>
                  <Button
                    variant="outline"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="w-full justify-center"
                  >
                    {sortOrder === "asc" ? (
                      <>
                        <SortAsc className="h-4 w-4 mr-2" />
                        Ascending
                      </>
                    ) : (
                      <>
                        <SortDesc className="h-4 w-4 mr-2" />
                        Descending
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Results Count */}
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>
                {loading ? "Loading..." : `${filteredServices.length} service${filteredServices.length !== 1 ? 's' : ''} found`}
              </span>
              {searchTerm && (
                <span>
                  Search results for "{searchTerm}"
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid/List */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {[...Array(4)].map((_, index) => (
                <Card key={index} className="h-96 animate-pulse">
                  <CardHeader>
                    <div className="h-20 w-20 bg-gray-200 rounded-2xl mx-auto mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-4 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredServices.length === 0 ? (
            services.length === 0 ? (
              <EmptyServicesMessage />
            ) : (
              <div className="text-center py-20">
                <div className="mb-6">
                  <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    No services found
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {searchTerm
                      ? `No services match your search "${searchTerm}". Try adjusting your filters or search terms.`
                      : "No services match your current filters. Try adjusting your filter criteria."}
                  </p>
                </div>
                {(searchTerm || selectedCategory !== "all" || selectedStatus !== "all") && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                      setSelectedStatus("all");
                    }}
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            )
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8" : "space-y-6"}>
              {filteredServices.map((service) => (
                <Card 
                  key={service.id} 
                  className={`group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 ${
                    service.popular ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                  } ${viewMode === "list" ? "flex" : ""}`}
                >
                  {/* Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Enhanced Badge System */}
                  {service.badge && (
                    <div className="absolute top-4 left-4 z-20">
                      <div className={`relative px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-lg backdrop-blur-sm ${
                        service.popular ? 'bg-gradient-to-r from-blue-500/90 to-blue-600/90 border border-blue-400/30' : 
                        service.badge === 'AI Powered' ? 'bg-gradient-to-r from-purple-500/90 to-purple-600/90 border border-purple-400/30' :
                        service.badge === 'Full Stack' ? 'bg-gradient-to-r from-green-500/90 to-green-600/90 border border-green-400/30' :
                        service.badge === 'Enterprise' ? 'bg-gradient-to-r from-indigo-500/90 to-indigo-600/90 border border-indigo-400/30' :
                        service.badge === 'Premium' ? 'bg-gradient-to-r from-amber-500/90 to-amber-600/90 border border-amber-400/30' :
                        'bg-gradient-to-r from-gray-500/90 to-gray-600/90 border border-gray-400/30'
                      } group-hover:scale-105 transition-all duration-300`}>
                        <div className="flex items-center gap-1">
                          {service.badge === 'Popular' && <span>🔥</span>}
                          {service.badge === 'AI Powered' && <span>🤖</span>}
                          {service.badge === 'Full Stack' && <span>⚡</span>}
                          {service.badge === 'Enterprise' && <span>👑</span>}
                          {service.badge === 'Premium' && <span>💎</span>}
                          <span>{service.badge}</span>
                        </div>
                        {/* Glow effect */}
                        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-white/20 to-white/10"></div>
                      </div>
                    </div>
                  )}

                  {/* Admin Controls */}
                  {isAdmin && (
                    <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Link href={`/admin/services/${service.id}/edit`}>
                        <Button variant="outline" size="sm" className="bg-white/90 backdrop-blur-sm hover:bg-blue-50">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-white/90 backdrop-blur-sm hover:bg-red-50"
                        onClick={async () => {
                          if (confirm("Are you sure you want to delete this service? This action cannot be undone.")) {
                            try {
                              await deleteService(service.id);
                              toast.success("Service deleted successfully!");
                              fetchServices(); // Refresh the list
                            } catch (error) {
                              toast.error("Failed to delete service. Please try again.");
                              console.error("Delete error:", error);
                            }
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  )}

                  <CardHeader className={`relative z-10 text-center pb-6 ${viewMode === "list" ? "w-1/3" : ""}`}>
                    {/* Icon with Animation */}
                    <div className="flex justify-center mb-6">
                      <div className="relative p-6 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10">
                          {service.icon ? getIconComponent(service.icon) : <Server className="h-16 w-16 text-blue-600" />}
                        </div>
                        {/* Floating Elements */}
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
                        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse"></div>
                      </div>
                    </div>
                    
                    <CardTitle className="text-2xl font-bold mb-4 group-hover:text-blue-600 transition-colors duration-300">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-lg leading-relaxed text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className={`relative z-10 ${viewMode === "list" ? "w-2/3" : ""}`}>
                    {/* Features with improved styling */}
                    <div className="mb-8">
                      <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Key Features</h4>
                      <ul className="space-y-3">
                        {service.features.slice(0, viewMode === "list" ? 3 : 4).map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start group-hover:translate-x-1 transition-transform duration-300">
                            <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                              <CheckCircle className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-gray-600 leading-relaxed">{feature}</span>
                          </li>
                        ))}
                        {service.features.length > (viewMode === "list" ? 3 : 4) && (
                          <li className="text-sm text-blue-600 font-medium ml-9">
                            +{service.features.length - (viewMode === "list" ? 3 : 4)} more features
                          </li>
                        )}
                      </ul>
                    </div>
                    
                    {/* Pricing and Rating Section */}
                    <div className="border-t border-gray-100 pt-6">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {service.price ? formatPrice(convertFromUSD(service.price)) : 
                             service.pricing ? formatPrice(convertFromUSD(parseFloat(service.pricing.replace(/[^\d.]/g, '')) || 0)) :
                             formatPrice(0)}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {service.status === 'active' ? 'Available Now' : 
                             service.status === 'coming-soon' ? 'Coming Soon' : 'Contact Us'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center justify-end mb-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 transition-colors duration-200 ${
                                  i < Math.floor(service.rating || 4.5) 
                                    ? 'text-yellow-400 fill-current' 
                                    : i < (service.rating || 4.5) 
                                      ? 'text-yellow-400 fill-current opacity-50' 
                                      : 'text-gray-300'
                                }`} 
                              />
                            ))}
                            <span className="ml-2 text-sm font-medium text-gray-700">
                              {(service.rating || 4.5).toFixed(1)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            ({service.reviewCount || Math.floor(Math.random() * 200) + 50} reviews)
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="space-y-3">
                        {service.link && (
                          <Link href={service.link} className="block" target="_blank" rel="noopener noreferrer">
                            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                              <span>Get Started</span>
                              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </Button>
                          </Link>
                        )}
                        
                        <div className="grid grid-cols-2 gap-3">
                          <Link href={`/services/${service.id || service.title?.toLowerCase().replace(/\s+/g, '-')}`}>
                            <Button variant="outline" className="w-full border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300">
                              <Eye className="h-4 w-4 mr-2" />
                              Details
                            </Button>
                          </Link>
                          <Link href="/services/support">
                            <Button variant="outline" className="w-full border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300">
                              <HeadphonesIcon className="h-4 w-4 mr-2" />
                              Support
                            </Button>
                          </Link>
                        </div>
                      </div>

                      {/* Service Status and Category */}
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              service.status === 'active' ? 'bg-green-100 text-green-800' :
                              service.status === 'inactive' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              <div className={`w-2 h-2 rounded-full mr-2 ${
                                service.status === 'active' ? 'bg-green-400' :
                                service.status === 'inactive' ? 'bg-red-400' :
                                'bg-yellow-400'
                              }`}></div>
                              {service.status === 'active' ? 'Active' :
                               service.status === 'inactive' ? 'Inactive' : 'Coming Soon'}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-600 capitalize">{service.category}</span>
                          </div>
                          
                          {/* Quick Stats */}
                          <div className="flex items-center gap-4 text-gray-500">
                            <div className="flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              <span className="text-xs">1.2k+</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              <span className="text-xs">24/7</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Service Statistics */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-blue-100 text-lg">
              Our services power businesses worldwide
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">1,200+</div>
              <div className="text-blue-100">Active Clients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-blue-100">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-100">Expert Support</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-blue-100">Projects Delivered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real feedback from businesses that trust Universal Cloud
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  A
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Alex Johnson</div>
                  <div className="text-gray-600 text-sm">CEO, TechStart Inc.</div>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed">
                "Universal Cloud's VPS hosting has been exceptional. 99.9% uptime, lightning-fast support, and competitive pricing. They've been instrumental in scaling our business."
              </p>
            </Card>

            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  S
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Sarah Chen</div>
                  <div className="text-gray-600 text-sm">CTO, GameCraft Studio</div>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed">
                "Their custom bot development service created the perfect Discord bot for our gaming community. Professional, efficient, and exactly what we needed."
              </p>
            </Card>

            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  M
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Mike Rodriguez</div>
                  <div className="text-gray-600 text-sm">Founder, Digital Solutions</div>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed">
                "The full-stack development team delivered our e-commerce platform ahead of schedule. Clean code, modern design, and excellent communication throughout."
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Service Comparison */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Compare Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect service package for your needs
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
              <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Features</th>
                  <th className="px-6 py-4 text-center font-semibold">VPS Hosting</th>
                  <th className="px-6 py-4 text-center font-semibold">Bot Development</th>
                  <th className="px-6 py-4 text-center font-semibold">Custom Development</th>
                  <th className="px-6 py-4 text-center font-semibold">Domains & Web</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">Starting Price</td>
                  <td className="px-6 py-4 text-center text-green-600 font-semibold">₹299/month</td>
                  <td className="px-6 py-4 text-center text-green-600 font-semibold">₹2,999</td>
                  <td className="px-6 py-4 text-center text-green-600 font-semibold">₹9,999</td>
                  <td className="px-6 py-4 text-center text-green-600 font-semibold">₹99/year</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">24/7 Support</td>
                  <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">Setup Time</td>
                  <td className="px-6 py-4 text-center text-gray-600">Instant</td>
                  <td className="px-6 py-4 text-center text-gray-600">3-7 days</td>
                  <td className="px-6 py-4 text-center text-gray-600">2-8 weeks</td>
                  <td className="px-6 py-4 text-center text-gray-600">Instant</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">Custom Features</td>
                  <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center text-gray-400">Limited</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">Source Code Access</td>
                  <td className="px-6 py-4 text-center text-gray-400">N/A</td>
                  <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center text-gray-400">N/A</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Powered by Modern Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We use cutting-edge technologies to deliver superior performance and reliability
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[
              { name: "React", icon: "⚛️" },
              { name: "Node.js", icon: "🟢" },
              { name: "Docker", icon: "🐳" },
              { name: "AWS", icon: "☁️" },
              { name: "MongoDB", icon: "🍃" },
              { name: "Redis", icon: "🔴" },
              { name: "Kubernetes", icon: "⚙️" },
              { name: "TypeScript", icon: "📘" },
              { name: "Python", icon: "🐍" },
              { name: "Go", icon: "🔵" },
              { name: "PostgreSQL", icon: "🐘" },
              { name: "Nginx", icon: "🌐" }
            ].map((tech, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                  {tech.icon}
                </div>
                <div className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                  {tech.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our services
            </p>
          </div>
          
          <div className="space-y-6">
            {[
              {
                question: "What's included in your hosting packages?",
                answer: "Our hosting packages include NVMe SSD storage, 24/7 support, DDoS protection, automated backups, and 99.9% uptime SLA. All packages come with full root access and custom configurations."
              },
              {
                question: "How long does custom development take?",
                answer: "Development timelines vary based on project complexity. Simple websites take 2-4 weeks, while complex applications can take 2-6 months. We provide detailed timelines during the consultation phase."
              },
              {
                question: "Do you provide ongoing support and maintenance?",
                answer: "Yes! We offer comprehensive support packages including security updates, performance monitoring, bug fixes, and feature enhancements for all our services."
              },
              {
                question: "Can I upgrade or downgrade my service plan?",
                answer: "Absolutely! You can scale your services up or down at any time. We'll help you migrate smoothly with zero downtime and no data loss."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, PayPal, bank transfers, and cryptocurrency payments. We also offer flexible billing cycles including monthly, quarterly, and annual options."
              }
            ].map((faq, index) => (
              <Card key={index} className="p-6 border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Specialized Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Additional services to enhance your digital infrastructure and development workflow
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalServices.map((service, index) => (
              <Card key={index} className="text-center h-full hover:shadow-xl transition-all duration-300 border-0">
                <CardContent className="pt-8">
                  <div className="flex justify-center mb-6">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      {service.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="mb-6">
                    {service.highlights.map((highlight, i) => (
                      <span key={i} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2 mb-2">
                        {highlight}
                      </span>
                    ))}
                  </div>
                  <Link href={service.link}>
                    <Button variant="outline" size="sm" className="hover:bg-blue-50">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Why Choose Aryan Tech Solution?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine technical expertise with exceptional service to deliver solutions that drive results
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((reason, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  {reason.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {reason.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Process */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Our Service Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A streamlined approach to deliver your projects on time and within budget
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {processSteps.map((process, index) => (
              <div key={index} className="text-center relative">
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-gray-300 transform translate-x-4"></div>
                )}
                <div className={`${process.color} text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-lg`}>
                  {process.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {process.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {process.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="absolute top-10 left-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 animate-float">
            <Rocket className="h-8 w-8 text-white/30" />
          </div>
          <div className="absolute top-40 right-1/4 animate-float animation-delay-1000">
            <Target className="h-6 w-6 text-white/30" />
          </div>
          <div className="absolute bottom-32 left-1/3 animate-float animation-delay-2000">
            <Cloud className="h-7 w-7 text-white/30" />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="mb-8">
            <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              Join 1,200+ Satisfied Customers
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
              Don't wait to upgrade your digital infrastructure. Get started with Universal Cloud today 
              and experience the difference that premium hosting and development services can make.
            </p>
          </div>

          {/* CTA Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
            <Card className="p-8 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-blue-200" />
                <h3 className="text-xl font-semibold mb-3">Free Consultation</h3>
                <p className="text-blue-100 mb-6">Get expert advice tailored to your specific needs</p>
                <Link href="/contact">
                  <Button className="w-full bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                    Schedule Call
                  </Button>
                </Link>
              </div>
            </Card>

            <Card className="p-8 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300">
              <div className="text-center">
                <Rocket className="h-12 w-12 mx-auto mb-4 text-purple-200" />
                <h3 className="text-xl font-semibold mb-3">Quick Start</h3>
                <p className="text-blue-100 mb-6">Begin your project immediately with our rapid setup</p>
                <Link href="/store">
                  <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-blue-600 font-semibold">
                    Browse Services
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Main CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Link href="/contact">
              <Button size="lg" className="w-full sm:w-auto px-10 py-4 text-lg bg-white text-blue-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <MessageCircle className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                Get Free Consultation
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-10 py-4 text-lg text-white border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-300 group">
                <Users className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                Create Account
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="border-t border-white/20 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-white mb-2">⚡ Instant Setup</div>
                <p className="text-blue-200 text-sm">Most services activated within minutes</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">🔒 Secure & Reliable</div>
                <p className="text-blue-200 text-sm">Bank-grade security and 99.9% uptime</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">💬 24/7 Support</div>
                <p className="text-blue-200 text-sm">Expert assistance whenever you need it</p>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-blue-100 mb-4 text-lg">Need immediate assistance?</p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-8">
                <a 
                  href="https://t.me/aryan_devloper" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center px-6 py-3 bg-white/20 rounded-full hover:bg-white/30 transition-all duration-300 text-white hover:scale-105"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Telegram: @aryan_devloper
                </a>
                <a 
                  href="mailto:raghavlove305@gmail.com" 
                  className="flex items-center px-6 py-3 bg-white/20 rounded-full hover:bg-white/30 transition-all duration-300 text-white hover:scale-105"
                >
                  <span className="text-lg mr-2">✉️</span>
                  raghavlove305@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Contact Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link href="/contact">
          <Button className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 group">
            <MessageCircle className="h-6 w-6 text-white group-hover:scale-125 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
