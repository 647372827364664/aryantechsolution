"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/providers/AuthProvider";
import { 
  Shield, 
  Zap, 
  Users, 
  Server, 
  Globe, 
  Bot, 
  Code,
  CheckCircle,
  Star,
  ArrowRight,
  Clock,
  Award,
  TrendingUp,
  DollarSign,
  MessageSquare,
  Target,
  HeadphonesIcon,
  Rocket,
  MessageCircle,
  UserCheck
} from "lucide-react";

export default function Home() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const signedIn = searchParams.get('signed_in');
    if (signedIn === 'true' && user) {
      setShowWelcome(true);
      // Hide welcome message after 5 seconds
      const timer = setTimeout(() => setShowWelcome(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, user]);

  const features = [
    {
      icon: <Zap className="h-10 w-10 text-yellow-500" />,
      title: "Lightning Fast",
      description: "High-performance SSD servers with 99.9% uptime guarantee and global CDN"
    },
    {
      icon: <Shield className="h-10 w-10 text-green-500" />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with DDoS protection and automated backups"
    },
    {
      icon: <HeadphonesIcon className="h-10 w-10 text-purple-500" />,
      title: "24/7 Expert Support",
      description: "Round-the-clock technical support from experienced developers"
    },
    {
      icon: <Globe className="h-10 w-10 text-blue-500" />,
      title: "Global Network",
      description: "Worldwide server locations for optimal performance and low latency"
    }
  ];

  const services = [
    {
      icon: <Server className="h-16 w-16 text-blue-600" />,
      title: "VPS Hosting",
      description: "Powerful virtual private servers with full root access and scalable resources",
      features: ["NVMe SSD Storage", "99.9% Uptime SLA", "Full Root Access", "24/7 Monitoring"],
      price: "₹299",
      period: "/month",
      popular: false
    },
    {
      icon: <Globe className="h-16 w-16 text-green-600" />,
      title: "Domain Services",
      description: "Register and manage domains with competitive pricing and free DNS management",
      features: ["Competitive Prices", "Free DNS Management", "Domain Privacy", "Easy Transfer"],
      price: "₹99",
      period: "/year",
      popular: false
    },
    {
      icon: <Bot className="h-16 w-16 text-purple-600" />,
      title: "Bot Development",
      description: "Custom Discord, Telegram, and AI-powered bots for business automation",
      features: ["Discord Bots", "Telegram Bots", "AI Integration", "Custom Features"],
      price: "₹2,999",
      period: "/project",
      popular: true
    },
    {
      icon: <Code className="h-16 w-16 text-orange-600" />,
      title: "Custom Development",
      description: "Full-stack web and mobile applications built with modern technologies",
      features: ["Web Applications", "Mobile Apps", "APIs & Backends", "Database Design"],
      price: "₹9,999",
      period: "/project",
      popular: false
    }
  ];

  const testimonials = [
    {
      name: "Raj Patel",
      role: "Startup Founder",
      company: "TechStartup.in",
      content: "Aryan Tech Solution's VPS hosting has been absolutely rock solid for our growing startup. The support team is incredibly responsive and knowledgeable!",
      rating: 5,
      avatar: "RP"
    },
    {
      name: "Priya Sharma", 
      role: "Discord Community Owner",
      company: "Gaming Hub",
      content: "The custom Discord bot they developed for us has completely transformed our community engagement. Highly recommended for any serious Discord server!",
      rating: 5,
      avatar: "PS"
    },
    {
      name: "Amit Kumar",
      role: "E-commerce Owner",
      company: "ShopIndia.com",
      content: "Fast, reliable hosting with excellent uptime. Our online store has never been more stable. The technical support is outstanding!",
      rating: 5,
      avatar: "AK"
    }
  ];

  const stats = [
    { label: "Happy Clients", value: "500+", icon: <Users className="h-6 w-6" /> },
    { label: "Projects Delivered", value: "1000+", icon: <Award className="h-6 w-6" /> },
    { label: "Uptime Guarantee", value: "99.9%", icon: <Clock className="h-6 w-6" /> },
    { label: "Countries Served", value: "25+", icon: <Globe className="h-6 w-6" /> }
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Welcome Banner for Signed-in Users */}
      {showWelcome && user && (
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 text-center relative">
          <div className="flex items-center justify-center gap-2">
            <UserCheck className="h-5 w-5" />
            <span className="font-medium">
              Welcome back, {user.name}! You're successfully signed in as {user.role}.
            </span>
          </div>
          <button 
            onClick={() => setShowWelcome(false)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200 transition-colors"
          >
            ×
          </button>
        </div>
      )}
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden px-4 sm:px-0">
        {/* Enhanced Background Decoration */}
        <div className="absolute inset-0 opacity-20 sm:opacity-30">
          <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-48 sm:w-96 h-48 sm:h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl animate-blob"></div>
          <div className="absolute top-10 sm:top-20 right-10 sm:right-20 w-48 sm:w-96 h-48 sm:h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-10 sm:bottom-20 left-1/2 w-48 sm:w-96 h-48 sm:h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Geometric patterns */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-pattern"></div>
        </div>

        {/* Floating elements - Hidden on mobile */}
        <div className="absolute inset-0 pointer-events-none hidden sm:block">
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
          <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-purple-500 rounded-full opacity-30 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/6 w-3 h-3 bg-indigo-500 rounded-full opacity-25 animate-bounce animation-delay-4000"></div>
          <div className="absolute bottom-1/4 right-1/3 w-5 h-5 bg-pink-500 rounded-full opacity-20 animate-ping animation-delay-6000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="text-center">
            {/* Enhanced badge with animation */}
            <div className="inline-flex items-center px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-xs sm:text-sm font-semibold mb-6 sm:mb-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group max-w-full">
              <Rocket className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:rotate-12 transition-transform duration-300 flex-shrink-0" />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
                Founded by entrepreneur Aryan Thakur - Aryan Tech Solution
              </span>
              <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
            </div>

            {/* Enhanced main heading */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-gray-900 mb-6 sm:mb-8 leading-tight">
              <span className="block animate-fade-in-up">Premium Hosting &</span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-fade-in-up animation-delay-200">
                Tech Solutions
              </span>
              <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-gray-700 mt-2 sm:mt-4 font-bold animate-fade-in-up animation-delay-400">
                for the Next Generation
              </span>
            </h1>

            {/* Enhanced description */}
            <p className="text-base sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-5xl mx-auto leading-relaxed animate-fade-in-up animation-delay-600 px-4 sm:px-0">
              Reliable, secure, and scalable hosting solutions with custom development services. 
              Trusted by <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">500+ businesses</span> across India and globally.
              <span className="block mt-2 sm:mt-4 text-sm sm:text-lg text-gray-500">
                🚀 99.9% Uptime • 🔒 Enterprise Security • ⚡ Lightning Fast • 🛠️ 24/7 Support - Aryan Tech Solution
              </span>
            </p>

            {/* Enhanced CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-12 animate-fade-in-up animation-delay-800 px-4 sm:px-0">
              <Link href="/store">
                <Button size="lg" className="w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 group">
                  Shop Now
                  <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-semibold border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1 group">
                  <Clock className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-12 transition-transform duration-300" />
                  Explore Services
                </Button>
              </Link>
            </div>

            {/* Discord Community Button */}
            <div className="flex justify-center mb-8 sm:mb-12 animate-fade-in-up animation-delay-900 px-4 sm:px-0">
              <a 
                href="https://discord.gg/SSVg6QrG28" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 group"
              >
                <MessageCircle className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-base sm:text-lg">Join Our Discord Community</span>
                <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-8 lg:space-x-12 text-gray-500 animate-fade-in-up animation-delay-1000 px-4 sm:px-0">
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base">99.9% Uptime SLA</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base">500+ Happy Clients</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base">Enterprise Security</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500 flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base">24/7 Expert Support</span>
              </div>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
              <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6">Trusted by leading companies and developers</p>
              <div className="flex justify-center items-center space-x-4 sm:space-x-8 opacity-60 overflow-x-auto pb-2">
                {["TechCorp", "StartupHub", "DevCommunity", "CloudTech", "InnovateLab"].map((company, index) => (
                  <div key={index} className="text-gray-400 font-semibold text-sm sm:text-lg whitespace-nowrap">
                    {company}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center items-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 text-blue-600 rounded-lg mx-auto mb-3 sm:mb-4">
                  {stat.icon}
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium text-sm sm:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-20">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Why Choose Aryan Tech Solution?
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6 sm:mb-8 px-4">
              Built for <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Performance</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
              We provide cutting-edge technology solutions with unmatched reliability, 
              security, and support that scales with your business from startup to enterprise.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center group relative overflow-hidden h-full border-0 shadow-xl bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105">
                {/* Enhanced gradient background overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                {/* Animated border effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 p-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-full h-full bg-white rounded-2xl"></div>
                </div>
                
                <CardContent className="pt-8 sm:pt-10 pb-6 sm:pb-8 relative z-20">
                  <div className="flex justify-center mb-6 sm:mb-8">
                    <div className="relative">
                      <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl group-hover:scale-125 transition-all duration-700 shadow-lg group-hover:shadow-2xl group-hover:rotate-3">
                        {feature.icon}
                      </div>
                      {/* Enhanced floating particles */}
                      <div className="absolute -top-2 -right-2 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-0 group-hover:scale-100 animate-bounce">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <div className="absolute -bottom-2 -left-2 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 transform scale-0 group-hover:scale-100 animate-pulse"></div>
                      <div className="absolute top-0 left-0 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000 transform scale-0 group-hover:scale-100 animate-ping"></div>
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-500 px-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 text-sm sm:text-base px-2 mb-4">
                    {feature.description}
                  </p>
                  
                  {/* Enhanced progress bar animation with glow effect */}
                  <div className="mt-4 sm:mt-6 h-2 bg-gray-100 rounded-full overflow-hidden mx-4 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1200 ease-out rounded-full shadow-lg"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                  </div>
                  
                  {/* New floating icons */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-700 transform scale-0 group-hover:scale-100">
                    <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs animate-spin">
                      ✓
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Discord Community Section */}
          <div className="mt-16 sm:mt-20 text-center">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 sm:p-8 border border-indigo-100">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                Join Our <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Developer Community</span>
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Connect with fellow developers, get instant support, share your projects, and stay updated with the latest features and announcements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="https://discord.gg/SSVg6QrG28" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
                >
                  <MessageCircle className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  Join Discord Server
                  <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </a>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-indigo-500" />
                    <span>500+ Members</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1 text-purple-500" />
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-16 sm:py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Code className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Our Technology Stack
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
              Built with <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Modern Technologies</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              We use cutting-edge technologies to deliver fast, reliable, and scalable solutions
            </p>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
            {[
              { name: "Next.js", logo: "⚛️", color: "bg-gray-900", hoverColor: "hover:bg-black" },
              { name: "React", logo: "⚛️", color: "bg-blue-500", hoverColor: "hover:bg-blue-600" },
              { name: "Node.js", logo: "🟢", color: "bg-green-600", hoverColor: "hover:bg-green-700" },
              { name: "TypeScript", logo: "📘", color: "bg-blue-600", hoverColor: "hover:bg-blue-700" },
              { name: "Docker", logo: "🐳", color: "bg-blue-400", hoverColor: "hover:bg-blue-500" },
              { name: "AWS", logo: "☁️", color: "bg-orange-500", hoverColor: "hover:bg-orange-600" },
              { name: "MongoDB", logo: "🍃", color: "bg-green-500", hoverColor: "hover:bg-green-600" },
              { name: "Redis", logo: "🔴", color: "bg-red-500", hoverColor: "hover:bg-red-600" },
              { name: "Nginx", logo: "🌐", color: "bg-green-600", hoverColor: "hover:bg-green-700" },
              { name: "Linux", logo: "🐧", color: "bg-gray-800", hoverColor: "hover:bg-gray-900" },
              { name: "MySQL", logo: "🐬", color: "bg-blue-600", hoverColor: "hover:bg-blue-700" },
              { name: "Git", logo: "📚", color: "bg-orange-600", hoverColor: "hover:bg-orange-700" }
            ].map((tech, index) => (
              <Card key={index} className="text-center group hover:scale-110 transition-all duration-500 h-full border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-2xl relative overflow-hidden">
                {/* Background glow effect */}
                <div className={`absolute inset-0 ${tech.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}></div>
                
                {/* Floating particles */}
                <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 animate-ping"></div>
                <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-900 animate-pulse"></div>
                
                <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6 h-full flex flex-col items-center justify-center relative z-10">
                  <div className="relative mb-3">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 ${tech.color} ${tech.hoverColor} rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl mx-auto group-hover:rotate-12 group-hover:scale-125 transition-all duration-500 shadow-lg group-hover:shadow-2xl`}>
                      {tech.logo}
                    </div>
                    {/* Ripple effect */}
                    <div className={`absolute inset-0 ${tech.color} rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-30 group-hover:scale-150 transition-all duration-700 animate-ping`}></div>
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-500 text-xs sm:text-sm text-center">
                    {tech.name}
                  </h3>
                  
                  {/* Progress bar indicator */}
                  <div className="w-full h-1 bg-gray-100 rounded-full mt-3 overflow-hidden">
                    <div className={`h-full ${tech.color} transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out`}></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Solutions Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium mb-6">
              <TrendingUp className="h-4 w-4 mr-2" />
              Industry Solutions
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Serving <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Every Industry</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From startups to enterprises, we provide tailored solutions for various industries
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "E-Commerce",
                description: "Scalable hosting solutions for online stores with high-performance infrastructure",
                icon: "🛒",
                features: ["Fast loading times", "Secure payments", "Inventory management", "Analytics"],
                gradient: "from-green-400 to-blue-500"
              },
              {
                title: "SaaS Applications",
                description: "Cloud infrastructure designed for software-as-a-service platforms",
                icon: "💻",
                features: ["Auto-scaling", "API management", "Database optimization", "Monitoring"],
                gradient: "from-blue-400 to-purple-500"
              },
              {
                title: "Gaming Communities",
                description: "Specialized hosting for gaming servers and community platforms",
                icon: "🎮",
                features: ["Low latency", "DDoS protection", "Plugin support", "24/7 monitoring"],
                gradient: "from-purple-400 to-pink-500"
              },
              {
                title: "Educational Platforms",
                description: "Reliable hosting for online learning and educational institutions",
                icon: "📚",
                features: ["Video streaming", "User management", "Content delivery", "Security"],
                gradient: "from-orange-400 to-red-500"
              },
              {
                title: "Healthcare",
                description: "HIPAA-compliant hosting solutions for healthcare applications",
                icon: "🏥",
                features: ["Data compliance", "Secure storage", "Backup systems", "Encryption"],
                gradient: "from-teal-400 to-blue-500"
              },
              {
                title: "Fintech",
                description: "Secure and compliant hosting for financial technology applications",
                icon: "💰",
                features: ["PCI compliance", "Fraud detection", "Real-time processing", "Audit logs"],
                gradient: "from-yellow-400 to-orange-500"
              }
            ].map((industry, index) => (
              <Card key={index} className="group hover:-translate-y-4 transition-all duration-700 h-full border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:bg-white relative overflow-hidden">
                {/* Enhanced background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${industry.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-700 rounded-2xl`}></div>
                
                {/* Floating background shapes */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000 transform scale-0 group-hover:scale-100 animate-pulse"></div>
                <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1200 transform scale-0 group-hover:scale-100 animate-bounce"></div>
                
                <CardContent className="pt-8 pb-8 h-full flex flex-col relative z-10">
                  <div className="text-center mb-6">
                    <div className="relative inline-block">
                      <div className="text-5xl mb-4 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-700">
                        {industry.icon}
                      </div>
                      {/* Floating ring animation */}
                      <div className={`absolute inset-0 rounded-full border-4 border-gradient-to-r ${industry.gradient} opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-1000 animate-ping`}></div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-500 text-center">
                    {industry.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm flex-grow group-hover:text-gray-700 transition-colors duration-300">
                    {industry.description}
                  </p>
                  <ul className="space-y-3">
                    {industry.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600 group/item transform transition-all duration-300 hover:translate-x-2">
                        <div className="relative mr-3">
                          <CheckCircle className="h-4 w-4 text-green-500 group-hover/item:text-green-600 group-hover/item:scale-125 transition-all duration-300 relative z-10" />
                          <div className="absolute inset-0 bg-green-200 rounded-full opacity-0 group-hover/item:opacity-50 group-hover/item:scale-150 transition-all duration-300"></div>
                        </div>
                        <span className="group-hover/item:font-medium group-hover/item:text-gray-800 transition-all duration-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Enhanced progress indicator */}
                  <div className="mt-6 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${industry.gradient} transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1500 ease-out shadow-lg`}></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
        {/* Background decoration - Hidden on small screens */}
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-bl from-blue-100 to-purple-100 rounded-full opacity-30 transform translate-x-1/2 -translate-y-1/2 hidden sm:block"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-tr from-indigo-100 to-pink-100 rounded-full opacity-30 transform -translate-x-1/2 translate-y-1/2 hidden sm:block"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 sm:mb-20">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Server className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Our Core Services
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6 sm:mb-8 px-4">
              Complete <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Digital Solutions</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
              From infrastructure to custom development, we provide comprehensive 
              solutions for all your digital needs with enterprise-grade quality.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {services.map((service, index) => (
              <Card key={index} className={`relative h-full group transform transition-all duration-700 hover:-translate-y-4 hover:scale-105 border-0 shadow-2xl ${service.popular ? 'ring-4 ring-purple-500/50 scale-100 sm:scale-105 z-10 bg-gradient-to-br from-purple-50 to-pink-50' : 'bg-white/80 backdrop-blur-sm hover:bg-white'}`}>
                {service.popular && (
                  <div className="absolute -top-4 sm:-top-5 left-1/2 transform -translate-x-1/2 z-30">
                    <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold shadow-2xl animate-pulse border-2 border-white">
                      ⭐ Most Popular ⭐
                    </span>
                  </div>
                )}
                
                {/* Enhanced gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl"></div>
                
                {/* Enhanced shine effect with multiple layers */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1200">
                  <div className="absolute inset-0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1200 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>
                  <div className="absolute inset-0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1500 bg-gradient-to-r from-transparent via-blue-300/20 to-transparent skew-x-12 transition-delay-200"></div>
                </div>
                
                {/* Floating background orbs */}
                <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000 transform scale-0 group-hover:scale-100 animate-pulse"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1200 transform scale-0 group-hover:scale-100 animate-bounce"></div>
                
                <CardHeader className="text-center pb-3 sm:pb-4 relative z-20">
                  <div className="flex justify-center mb-4 sm:mb-6">
                    <div className="relative">
                      <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl group-hover:scale-125 transition-all duration-700 shadow-lg group-hover:shadow-2xl group-hover:rotate-6">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
                          {React.cloneElement(service.icon, { 
                            className: "h-8 w-8 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-blue-600 group-hover:text-purple-600 transition-colors duration-500" 
                          })}
                        </div>
                      </div>
                      {/* Enhanced floating particles with different animations */}
                      <div className="absolute -top-2 -right-2 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-ping"></div>
                      <div className="absolute -bottom-2 -left-2 w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 animate-bounce"></div>
                      <div className="absolute top-0 left-0 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000 animate-pulse"></div>
                      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-800 animate-spin"></div>
                    </div>
                  </div>
                  <CardTitle className="text-lg sm:text-xl mb-2 sm:mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-500 px-2">{service.title}</CardTitle>
                  <CardDescription className="text-sm sm:text-base leading-relaxed group-hover:text-gray-700 transition-colors duration-300 px-2">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 relative z-20">
                  <div className="text-center mb-4 sm:mb-6 p-4 sm:p-5 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl group-hover:bg-gradient-to-r group-hover:from-blue-50 group-hover:via-purple-50 group-hover:to-pink-50 transition-all duration-500 border-2 border-transparent group-hover:border-purple-200">
                    <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 inline-block">{service.price}</span>
                    <span className="text-gray-500 ml-1 text-sm sm:text-base group-hover:text-gray-600">{service.period}</span>
                    <div className="mt-2 text-xs text-gray-400 group-hover:text-gray-500">Starting price</div>
                  </div>
                  <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center group/item transform transition-all duration-300 hover:translate-x-2">
                        <div className="relative mr-3">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 group-hover/item:text-green-600 group-hover/item:scale-125 transition-all duration-300 relative z-10" />
                          <div className="absolute inset-0 bg-green-200 rounded-full opacity-0 group-hover/item:opacity-50 group-hover/item:scale-150 transition-all duration-300"></div>
                        </div>
                        <span className="text-gray-600 group-hover/item:text-gray-800 group-hover/item:font-medium transition-all duration-300 text-sm sm:text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full relative overflow-hidden text-sm sm:text-base group/btn ${service.popular ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 shadow-lg' : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white hover:border-transparent'} transition-all duration-500 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105`} variant={service.popular ? "primary" : "outline"}>
                    <span className="relative z-10 flex items-center justify-center group-hover/btn:scale-110 transition-transform duration-300">
                      Get Started 
                      <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover/btn:translate-x-2 group-hover/btn:scale-125 transition-all duration-300" />
                    </span>
                    {/* Button shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Comparison Section */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
              <DollarSign className="h-4 w-4 mr-2" />
              Simple Pricing
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Choose Your <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Perfect Plan</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transparent pricing with no hidden fees. Scale as you grow.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$9.99",
                period: "/month",
                description: "Perfect for small projects and personal websites",
                features: [
                  "1 GB RAM",
                  "20 GB SSD Storage",
                  "1 CPU Core",
                  "Unlimited Bandwidth",
                  "Free SSL Certificate",
                  "24/7 Support"
                ],
                popular: false,
                buttonText: "Get Started"
              },
              {
                name: "Professional",
                price: "$29.99",
                period: "/month",
                description: "Ideal for growing businesses and applications",
                features: [
                  "4 GB RAM",
                  "80 GB SSD Storage",
                  "2 CPU Cores",
                  "Unlimited Bandwidth",
                  "Free SSL Certificate",
                  "Priority Support",
                  "Daily Backups",
                  "CDN Included"
                ],
                popular: true,
                buttonText: "Most Popular"
              },
              {
                name: "Enterprise",
                price: "$99.99",
                period: "/month",
                description: "For high-traffic applications and enterprises",
                features: [
                  "16 GB RAM",
                  "320 GB SSD Storage",
                  "8 CPU Cores",
                  "Unlimited Bandwidth",
                  "Free SSL Certificate",
                  "Dedicated Support",
                  "Hourly Backups",
                  "Advanced CDN",
                  "DDoS Protection",
                  "Custom Solutions"
                ],
                popular: false,
                buttonText: "Contact Sales"
              }
            ].map((plan, index) => (
              <Card key={index} className={`relative group hover:-translate-y-4 transition-all duration-700 h-full flex flex-col border-0 shadow-2xl ${plan.popular ? 'ring-4 ring-purple-500/50 scale-105 bg-gradient-to-br from-purple-50 to-pink-50' : 'bg-white/90 backdrop-blur-sm hover:bg-white'} overflow-hidden`}>
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-20">
                    <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-2xl animate-pulse border-2 border-white">
                      ⭐ Most Popular ⭐
                    </span>
                  </div>
                )}
                
                {/* Enhanced background effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000 transform scale-0 group-hover:scale-100 animate-pulse"></div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                  <div className="absolute inset-0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1200 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
                </div>
                
                <CardContent className="pt-10 pb-8 flex flex-col h-full relative z-10">
                  <div className="text-center mb-8">
                    <div className="relative">
                      <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-500">{plan.name}</h3>
                      {/* Floating crown for popular plan */}
                      {plan.popular && (
                        <div className="absolute -top-2 -right-2 text-2xl animate-bounce">👑</div>
                      )}
                    </div>
                    <div className="mb-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl group-hover:from-blue-50 group-hover:to-purple-50 transition-all duration-500">
                      <span className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 inline-block">{plan.price}</span>
                      <span className="text-gray-600 text-lg group-hover:text-gray-700">{plan.period}</span>
                      <div className="mt-2 text-xs text-gray-400 group-hover:text-gray-500">Billed monthly</div>
                    </div>
                    <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors duration-300">{plan.description}</p>
                  </div>
                  
                  <ul className="space-y-3 mb-8 flex-grow">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-600 text-sm group/item transform transition-all duration-300 hover:translate-x-2">
                        <div className="relative mr-3">
                          <CheckCircle className="h-5 w-5 text-green-500 group-hover/item:text-green-600 group-hover/item:scale-125 transition-all duration-300 relative z-10" />
                          <div className="absolute inset-0 bg-green-200 rounded-full opacity-0 group-hover/item:opacity-50 group-hover/item:scale-150 transition-all duration-300"></div>
                        </div>
                        <span className="group-hover/item:font-medium group-hover/item:text-gray-800 transition-all duration-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button className={`w-full relative overflow-hidden ${plan.popular ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white shadow-lg' : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white hover:border-transparent'} transition-all duration-500 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 group/btn`}>
                    <span className="relative z-10 flex items-center justify-center group-hover/btn:scale-110 transition-transform duration-300">
                      {plan.buttonText}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-2 group-hover/btn:scale-125 transition-all duration-300" />
                    </span>
                    {/* Button shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                  </Button>
                  
                  {/* Bottom progress indicator */}
                  <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${plan.popular ? 'from-purple-500 to-pink-500' : 'from-blue-500 to-purple-500'} transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1500 ease-out`}></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Need a custom solution?</p>
            <Button variant="outline" className="border-gray-300 hover:border-blue-500 hover:text-blue-600">
              Contact our sales team
            </Button>
          </div>
        </div>
      </section>

      {/* Process Workflow Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-6">
              <Zap className="h-4 w-4 mr-2" />
              Our Process
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              How We <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Work Together</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A streamlined process designed to get your project up and running quickly
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Consultation",
                description: "We discuss your requirements and recommend the best solution for your needs",
                icon: MessageSquare,
                color: "bg-blue-500",
                hoverColor: "hover:bg-blue-600"
              },
              {
                step: "02",
                title: "Planning",
                description: "Our team creates a detailed plan and timeline for your project implementation",
                icon: Target,
                color: "bg-green-500",
                hoverColor: "hover:bg-green-600"
              },
              {
                step: "03",
                title: "Development",
                description: "We build and configure your solution using industry best practices",
                icon: Code,
                color: "bg-purple-500",
                hoverColor: "hover:bg-purple-600"
              },
              {
                step: "04",
                title: "Launch",
                description: "Your project goes live with full monitoring and ongoing support",
                icon: Rocket,
                color: "bg-orange-500",
                hoverColor: "hover:bg-orange-600"
              }
            ].map((step, index) => (
              <div key={index} className="relative group">
                <Card className="text-center group-hover:-translate-y-4 transition-all duration-700 border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:bg-white relative overflow-hidden">
                  {/* Background glow effect */}
                  <div className={`absolute inset-0 ${step.color} opacity-0 group-hover:opacity-10 transition-opacity duration-700 rounded-2xl`}></div>
                  
                  {/* Floating particles */}
                  <div className="absolute top-4 right-4 w-3 h-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 animate-ping"></div>
                  <div className="absolute bottom-4 left-4 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-900 animate-pulse"></div>
                  
                  <CardContent className="pt-10 pb-8 relative z-10">
                    <div className="relative mb-8">
                      <div className={`w-20 h-20 ${step.color} ${step.hoverColor} rounded-3xl flex items-center justify-center text-white mx-auto group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-2xl`}>
                        <step.icon className="h-10 w-10" />
                      </div>
                      {/* Step number badge */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold group-hover:scale-125 transition-all duration-300 shadow-lg">
                        {step.step}
                      </div>
                      {/* Ripple effect */}
                      <div className={`absolute inset-0 ${step.color} rounded-3xl opacity-0 group-hover:opacity-30 group-hover:scale-150 transition-all duration-700 animate-ping`}></div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-500">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                      {step.description}
                    </p>
                    
                    {/* Progress indicator */}
                    <div className="mt-6 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${step.color} transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1200 ease-out`}></div>
                    </div>
                  </CardContent>
                </Card>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="relative">
                      <ArrowRight className="h-8 w-8 text-gray-300 group-hover:text-blue-500 group-hover:scale-125 transition-all duration-300" />
                      {/* Animated arrow glow */}
                      <div className="absolute inset-0 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse">
                        <ArrowRight className="h-8 w-8" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-indigo-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full opacity-20 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full opacity-20 transform translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 text-green-800 rounded-full text-sm font-medium mb-6">
              <Star className="h-4 w-4 mr-2" />
              Client Success Stories
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-8">
              Loved by <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Developers</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Don't just take our word for it. Here's what our clients say about 
              their experience with Aryan Tech Solution and how we've helped them succeed.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="h-full group relative overflow-hidden transform transition-all duration-700 hover:-translate-y-4 hover:scale-105 border-0 shadow-2xl bg-white/90 backdrop-blur-sm hover:bg-white">
                {/* Enhanced background gradient with animation */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                
                {/* Floating orbs */}
                <div className="absolute top-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-300/20 to-purple-300/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000 transform scale-0 group-hover:scale-100 animate-pulse"></div>
                <div className="absolute bottom-6 left-6 w-12 h-12 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1200 transform scale-0 group-hover:scale-100 animate-bounce"></div>
                
                {/* Enhanced testimonial number badge */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold opacity-30 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500 shadow-lg">
                  {index + 1}
                </div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                  <div className="absolute inset-0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1200 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>
                </div>
                
                <CardContent className="pt-12 pb-10 relative z-20">
                  {/* Enhanced rating stars with staggered animation */}
                  <div className="flex mb-8 space-x-1 justify-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <div key={i} className="relative">
                        <Star className={`h-6 w-6 text-yellow-400 fill-current group-hover:scale-150 transition-all duration-500 group-hover:rotate-12 delay-${i * 100}`} />
                        <div className="absolute inset-0 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-ping">
                          <Star className="h-6 w-6 fill-current" />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Enhanced quote content with better styling */}
                  <blockquote className="text-gray-700 mb-8 italic leading-relaxed text-lg relative px-6 group-hover:text-gray-800 transition-colors duration-300">
                    <span className="text-6xl text-blue-200 absolute -top-4 -left-2 font-serif group-hover:text-blue-300 group-hover:scale-125 transition-all duration-500">&ldquo;</span>
                    <span className="relative z-10 group-hover:font-medium transition-all duration-300">{testimonial.content}</span>
                    <span className="text-6xl text-blue-200 absolute -bottom-8 -right-2 font-serif group-hover:text-blue-300 group-hover:scale-125 transition-all duration-500">&rdquo;</span>
                  </blockquote>
                  
                  {/* Enhanced author info with better design */}
                  <div className="flex items-center pt-6 border-t border-gray-100 group-hover:border-gray-200">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center font-bold mr-4 shadow-lg group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 text-lg">
                        {testimonial.avatar}
                      </div>
                      {/* Enhanced online indicator with pulse */}
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white flex items-center justify-center group-hover:scale-125 transition-all duration-300">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                      {/* Ripple effect around avatar */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-30 group-hover:scale-150 transition-all duration-700 animate-ping"></div>
                    </div>
                    <div className="group-hover:translate-x-2 transition-transform duration-300">
                      <div className="font-semibold text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">{testimonial.name}</div>
                      <div className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">{testimonial.role}</div>
                      <div className="text-sm text-blue-600 group-hover:text-purple-600 transition-colors duration-300 font-medium">{testimonial.company}</div>
                    </div>
                  </div>
                  
                  {/* New progress indicator */}
                  <div className="mt-6 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1500 ease-out"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Need a custom solution?</p>
            <Button variant="outline" className="border-gray-300 hover:border-blue-500 hover:text-blue-600">
              Contact our sales team
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full animate-ping"></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 bg-white rounded-full animate-pulse animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full animate-bounce animation-delay-4000"></div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="mb-8">
            <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur text-white rounded-full text-sm font-medium mb-8">
              <Rocket className="h-5 w-5 mr-2" />
              Ready to Launch Your Project?
            </div>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-black text-white mb-8 leading-tight">
            Let's Build Something
            <span className="block text-yellow-300">Amazing Together</span>
          </h2>
          
          <p className="text-xl lg:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
            Join thousands of satisfied clients who trust Aryan Tech Solution for their hosting and development needs. 
            Get started today with our <span className="font-bold text-white">free consultation</span> and see the difference.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto px-10 py-5 text-xl font-semibold bg-white text-blue-600 hover:bg-gray-100 shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                <HeadphonesIcon className="mr-3 h-6 w-6" />
                Get Free Consultation
              </Button>
            </Link>
            <a 
              href="https://discord.gg/SSVg6QrG28" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-10 py-5 text-xl font-semibold text-white border-2 border-white hover:bg-white hover:text-purple-600 transition-all duration-300 transform hover:-translate-y-1 group">
                <MessageCircle className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                Join Discord Community
              </Button>
            </a>
          </div>
          
          {/* Enhanced Contact Info */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20">
            <p className="text-blue-100 mb-6 text-lg">Need immediate assistance? We're here to help!</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-white">
              <a href="tel:+918824187767" className="flex items-center justify-center space-x-3 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 group">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">📞</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold">Call Us</div>
                  <div className="text-blue-200">+91 8824187767</div>
                </div>
              </a>
              <a href="https://discord.gg/SSVg6QrG28" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center space-x-3 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 group">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Discord</div>
                  <div className="text-blue-200">Community</div>
                </div>
              </a>
              <a href="https://t.me/aryan_devloper" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center space-x-3 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 group">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">💬</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold">Telegram</div>
                  <div className="text-blue-200">@aryan_devloper</div>
                </div>
              </a>
              <a href="mailto:raghavlove305@gmail.com" className="flex items-center justify-center space-x-3 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 group">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">✉️</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold">Email</div>
                  <div className="text-blue-200">raghavlove305@gmail.com</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
