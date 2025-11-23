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

export default function HomeContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const signedIn = searchParams.get('signed_in');
    if (signedIn === 'true' && user) {
      setShowWelcome(true);
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
      {showWelcome && user && (
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 text-center relative">
          <div className="flex items-center justify-center gap-2">
            <UserCheck className="h-5 w-5" />
            <span className="font-medium">
              Welcome back, {user.name}! You&apos;re successfully signed in as {user.role}.
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
      
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden px-4 sm:px-0">
        <div className="absolute inset-0 opacity-20 sm:opacity-30">
          <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-48 sm:w-96 h-48 sm:h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl animate-blob"></div>
          <div className="absolute top-10 sm:top-20 right-10 sm:right-20 w-48 sm:w-96 h-48 sm:h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-10 sm:bottom-20 left-1/2 w-48 sm:w-96 h-48 sm:h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-pattern"></div>
        </div>

        <div className="absolute inset-0 pointer-events-none hidden sm:block">
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
          <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-purple-500 rounded-full opacity-30 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/6 w-3 h-3 bg-indigo-500 rounded-full opacity-25 animate-bounce animation-delay-4000"></div>
          <div className="absolute bottom-1/4 right-1/3 w-5 h-5 bg-pink-500 rounded-full opacity-20 animate-ping animation-delay-6000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="text-center">
            <div className="inline-flex items-center px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-xs sm:text-sm font-semibold mb-6 sm:mb-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group max-w-full">
              <Rocket className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:rotate-12 transition-transform duration-300 flex-shrink-0" />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
                Founded by entrepreneur Aryan Thakur - Aryan Tech Solution
              </span>
              <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-gray-900 mb-6 sm:mb-8 leading-tight">
              <span className="block animate-fade-in-up">Premium Hosting &</span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-fade-in-up animation-delay-200">
                Tech Solutions
              </span>
              <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-gray-700 mt-2 sm:mt-4 font-bold animate-fade-in-up animation-delay-400">
                for the Next Generation
              </span>
            </h1>

            <p className="text-base sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-5xl mx-auto leading-relaxed animate-fade-in-up animation-delay-600 px-4 sm:px-0">
              Reliable, secure, and scalable hosting solutions with custom development services. 
              Trusted by <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">500+ businesses</span> across India and globally.
              <span className="block mt-2 sm:mt-4 text-sm sm:text-lg text-gray-500">
                🚀 99.9% Uptime • 🔒 Enterprise Security • ⚡ Lightning Fast • 🛠️ 24/7 Support - Aryan Tech Solution
              </span>
            </p>

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
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 p-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-full h-full bg-white rounded-2xl"></div>
                </div>
                
                <CardContent className="pt-8 sm:pt-10 pb-6 sm:pb-8 relative z-20">
                  <div className="flex justify-center mb-6 sm:mb-8">
                    <div className="relative">
                      <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl group-hover:scale-125 transition-all duration-700 shadow-lg group-hover:shadow-2xl group-hover:rotate-3">
                        {feature.icon}
                      </div>
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
                  
                  <div className="mt-4 sm:mt-6 h-2 bg-gray-100 rounded-full overflow-hidden mx-4 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1200 ease-out rounded-full shadow-lg"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                  </div>
                  
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-700 transform scale-0 group-hover:scale-100">
                    <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs animate-spin">
                      ✓
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

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
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="mb-8">
            <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur text-white rounded-full text-sm font-medium mb-8">
              <Rocket className="h-5 w-5 mr-2" />
              Ready to Launch Your Project?
            </div>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-black text-white mb-8 leading-tight">
            Let&apos;s Build Something
            <span className="block text-yellow-300">Amazing Together</span>
          </h2>
          
          <p className="text-xl lg:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
            Join thousands of satisfied clients who trust Aryan Tech Solution for their hosting and development needs. 
            Get started today with our <span className="font-bold text-white">free consultation</span> and see the difference.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto px-10 py-5 text-xl font-semibold bg-white text-blue-600 hover:bg-gray-100 shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                <HeadphonesIcon className="mr-3 h-6 w-6" />
                Get Free Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
