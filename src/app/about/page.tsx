import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  User, 
  Target, 
  Eye, 
  Heart, 
  Shield, 
  Lightbulb, 
  Users,
  Award,
  Code,
  Globe,
  Calendar,
  TrendingUp,
  MapPin,
  Coffee,
  Zap,
  Briefcase,
  Star,
  Quote,
  CheckCircle
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us - Aryan Tech Solution",
  description: "Learn about Aryan Tech Solution's mission, vision, and the story behind India's most trusted hosting & tech solutions provider.",
  keywords: "about aryan tech solution, aryan thakur, hosting company, tech solutions, startup story",
};

export default function About() {
  const values = [
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Reliability",
      description: "We ensure 99.9% uptime and consistent performance for all our services"
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-yellow-600" />,
      title: "Innovation",
      description: "Constantly evolving our technology stack to provide cutting-edge solutions"
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "Security",
      description: "Enterprise-grade security measures to protect our clients' data and applications"
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Client-First",
      description: "Every decision we make prioritizes our clients' success and satisfaction"
    }
  ];

  const achievements = [
    {
      icon: <Award className="h-6 w-6 text-blue-600" />,
      title: "500+ Happy Clients",
      description: "Serving businesses across India and globally"
    },
    {
      icon: <Code className="h-6 w-6 text-green-600" />,
      title: "1000+ Projects Delivered",
      description: "Successfully completed hosting and development projects"
    },
    {
      icon: <Globe className="h-6 w-6 text-purple-600" />,
      title: "99.9% Uptime",
      description: "Maintaining excellent service reliability"
    },
    {
      icon: <Users className="h-6 w-6 text-orange-600" />,
      title: "24/7 Support",
      description: "Round-the-clock technical assistance"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-24 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-200 to-purple-200 rounded-full opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-200 to-pink-200 rounded-full opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 bg-white/70 backdrop-blur-sm text-blue-800 rounded-full text-sm font-medium mb-8 shadow-lg">
              <Globe className="h-4 w-4 mr-2" />
              Trusted by 500+ Businesses Worldwide
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-8">
              About <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Aryan Tech Solution</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              The story of how a visionary entrepreneur is revolutionizing 
              India's hosting and tech solutions industry through innovation, 
              reliability, and customer-first approach
            </p>
          </div>
        </div>
      </section>

      {/* Company Story Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
                <TrendingUp className="h-4 w-4 mr-2" />
                Our Journey
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                Building the Future of <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Cloud Solutions</span>
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p className="text-lg">
                  Aryan Tech Solution was born from a simple observation: businesses across India were 
                  struggling to find hosting solutions that combined <strong>enterprise-grade quality</strong> 
                  with <strong>affordable pricing</strong>. The market was divided between expensive 
                  international providers and unreliable local alternatives.
                </p>
                <p>
                  Our founder, <strong>Aryan Thakur</strong>, saw this gap as an opportunity to revolutionize 
                  the industry. As a passionate developer and entrepreneur, he understood the technical 
                  requirements of modern applications and the budget constraints of growing businesses.
                </p>
                <p>
                  What started as a college project to help fellow students host their applications 
                  quickly evolved into something much bigger. Word spread about our reliable services, 
                  exceptional support, and fair pricing. Soon, we were serving startups, SMEs, and 
                  even enterprise clients across multiple industries.
                </p>
                <p>
                  Today, Aryan Tech Solution is more than just a hosting provider. We're a complete 
                  technology partner offering <strong>custom development</strong>, <strong>Discord solutions</strong>, 
                  <strong>bot development</strong>, and <strong>comprehensive tech consulting</strong>. 
                  Our mission remains unchanged: empowering businesses with technology that works.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                  <h4 className="font-bold text-blue-900 mb-2">Our Vision</h4>
                  <p className="text-blue-700 text-sm">To democratize access to premium technology solutions</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                  <h4 className="font-bold text-purple-900 mb-2">Our Mission</h4>
                  <p className="text-purple-700 text-sm">Making enterprise-grade hosting affordable for everyone</p>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-1 rounded-3xl shadow-2xl">
                <div className="bg-white p-8 rounded-3xl h-full">
                  <div className="text-center mb-8">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-2xl shadow-lg mb-6 inline-block">
                      <User className="h-20 w-20 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">Aryan Thakur</h3>
                    <p className="text-xl text-purple-600 font-medium mb-6">Founder & CEO</p>
                    
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl mb-6">
                      <Quote className="h-8 w-8 text-blue-500 mx-auto mb-4" />
                      <p className="text-gray-700 italic text-lg leading-relaxed">
                        "Every business deserves access to premium technology solutions, 
                        regardless of their size or budget. That's the Aryan Tech Solution promise."
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                      <h4 className="font-semibold text-gray-900 mb-2">Core Expertise</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Code className="h-3 w-3 mr-1 text-blue-500" />
                          Full Stack Development
                        </div>
                        <div className="flex items-center">
                          <Globe className="h-3 w-3 mr-1 text-green-500" />
                          Cloud Architecture
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1 text-purple-500" />
                          Business Strategy
                        </div>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1 text-orange-500" />
                          Team Leadership
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
                      <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>📞 +91 8824187767</p>
                        <p>📱 @aryan_devloper</p>
                        <p>💼 Open to partnerships & collaborations</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Mission, Vision, Values */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-white/70 backdrop-blur-sm text-gray-800 rounded-full text-sm font-medium mb-8 shadow-lg">
              <Heart className="h-4 w-4 mr-2" />
              Our Foundation
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              What Drives <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Aryan Tech Solution</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our core principles and values that shape every decision we make
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {/* Mission */}
            <Card className="text-center h-full group hover:-translate-y-2 transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Target className="h-12 w-12 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-gray-900 group-hover:text-blue-600 transition-colors duration-300">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  To provide reliable, affordable, and scalable hosting solutions that empower 
                  businesses and developers to achieve their digital goals without compromise.
                </p>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-center text-sm text-blue-600 font-medium">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Quality First
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vision */}
            <Card className="text-center h-full group hover:-translate-y-2 transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Eye className="h-12 w-12 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-gray-900 group-hover:text-purple-600 transition-colors duration-300">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  To become India's most trusted hosting & custom solutions provider, known for 
                  innovation, reliability, and exceptional customer service.
                </p>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-center text-sm text-purple-600 font-medium">
                    <Star className="h-4 w-4 mr-2" />
                    Innovation Driven
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Why Different */}
            <Card className="text-center h-full group hover:-translate-y-2 transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-r from-pink-500 to-red-500 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Heart className="h-12 w-12 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-gray-900 group-hover:text-pink-600 transition-colors duration-300">Why We're Different</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  We combine Discord community integration, developer hiring services, and 
                  custom app development - all under one roof with personal touch.
                </p>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-center text-sm text-pink-600 font-medium">
                    <Users className="h-4 w-4 mr-2" />
                    Community Focused
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Values */}
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide every decision we make and every service we provide
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center group hover:-translate-y-2 transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <CardContent className="pt-8 pb-6">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl group-hover:scale-110 transition-all duration-300 shadow-lg border">
                      {value.icon}
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    {value.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {value.description}
                  </p>
                  
                  {/* Decorative line */}
                  <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Journey Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <Calendar className="h-4 w-4 mr-2" />
              Our Journey
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              The Aryan Tech Solution Story
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From a college dorm room idea to India's fastest-growing hosting provider
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-0.5 h-full w-0.5 bg-gradient-to-b from-blue-500 to-purple-500"></div>
            
            <div className="space-y-12">
              {[
                {
                  year: "2023",
                  title: "The Beginning",
                  description: "Aryan Thakur starts Aryan Tech Solution with a vision to democratize access to premium hosting solutions in India",
                  icon: Lightbulb,
                  side: "left"
                },
                {
                  year: "2024 Q1",
                  title: "First 100 Clients",
                  description: "Reached 100 satisfied clients through word-of-mouth and exceptional service quality",
                  icon: Users,
                  side: "right"
                },
                {
                  year: "2024 Q2",
                  title: "Service Expansion",
                  description: "Launched custom development services, bot development, and Discord community integration",
                  icon: Code,
                  side: "left"
                },
                {
                  year: "2024 Q3",
                  title: "Major Milestone",
                  description: "Crossed 500+ clients and achieved 99.9% uptime record with enhanced infrastructure",
                  icon: TrendingUp,
                  side: "right"
                },
                {
                  year: "2024 Q4",
                  title: "Present Day",
                  description: "Leading provider with 1000+ projects delivered and expanding team of talented developers",
                  icon: Award,
                  side: "left"
                }
              ].map((milestone, index) => (
                <div key={index} className={`flex items-center ${milestone.side === 'left' ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${milestone.side === 'left' ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <Card className="group hover:-translate-y-2 transition-all duration-300">
                      <CardContent className="pt-6">
                        <div className={`flex items-center mb-4 ${milestone.side === 'left' ? 'justify-end' : 'justify-start'}`}>
                          <div className="bg-blue-100 p-2 rounded-lg mr-3">
                            <milestone.icon className="h-5 w-5 text-blue-600" />
                          </div>
                          <span className="text-sm font-bold text-blue-600">{milestone.year}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                          {milestone.title}
                        </h3>
                        <p className="text-gray-600">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10"></div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team & Culture Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-6">
              <Users className="h-4 w-4 mr-2" />
              Our Team
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              The People Behind Aryan Tech Solution
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A passionate team of developers, designers, and support specialists dedicated to your success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                name: "Aryan Thakur",
                role: "Founder & CEO",
                description: "Visionary leader driving the tech revolution in hosting solutions",
                specialties: ["Full Stack Development", "Cloud Architecture", "Business Strategy"],
                icon: "👨‍💻",
                contact: "+91 8824187767"
              },
              {
                name: "Development Team",
                role: "Core Engineers",
                description: "Experienced developers specializing in modern web technologies",
                specialties: ["React/Next.js", "Node.js", "DevOps", "Mobile Development"],
                icon: "👥",
                contact: "Join our team!"
              },
              {
                name: "Support Team",
                role: "24/7 Customer Success",
                description: "Dedicated support specialists ensuring your success around the clock",
                specialties: ["Technical Support", "Server Management", "Client Success"],
                icon: "🎧",
                contact: "Always available"
              }
            ].map((member, index) => (
              <Card key={index} className="group hover:-translate-y-2 transition-all duration-300">
                <CardContent className="pt-8 text-center">
                  <div className="text-4xl mb-4">{member.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-purple-600 font-medium mb-4">{member.role}</p>
                  <p className="text-gray-600 mb-4">{member.description}</p>
                  <div className="space-y-2 mb-4">
                    {member.specialties.map((specialty, specIndex) => (
                      <span key={specIndex} className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm mr-2 mb-2">
                        {specialty}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">{member.contact}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Company Culture */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Culture</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We believe in creating an environment where innovation thrives and everyone can do their best work
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  icon: Coffee,
                  title: "Work-Life Balance",
                  description: "Flexible hours and remote-friendly environment"
                },
                {
                  icon: Zap,
                  title: "Innovation First",
                  description: "Always exploring new technologies and approaches"
                },
                {
                  icon: Users,
                  title: "Collaborative",
                  description: "Open communication and teamwork across all levels"
                },
                {
                  icon: TrendingUp,
                  title: "Growth Mindset",
                  description: "Continuous learning and professional development"
                }
              ].map((culture, index) => (
                <div key={index} className="text-center">
                  <div className="bg-white p-4 rounded-xl shadow-lg mb-4 w-16 h-16 flex items-center justify-center mx-auto">
                    <culture.icon className="h-8 w-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{culture.title}</h4>
                  <p className="text-sm text-gray-600">{culture.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Client Success Stories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
              <Star className="h-4 w-4 mr-2" />
              Success Stories
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real feedback from businesses that have grown with Aryan Tech Solution
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Rajesh Kumar",
                company: "TechStart Solutions",
                role: "CTO",
                testimonial: "Aryan Tech Solution transformed our hosting experience. The support is incredible and uptime is exactly as promised. Aryan's team goes above and beyond.",
                rating: 5,
                project: "E-commerce Platform Hosting"
              },
              {
                name: "Priya Sharma",
                company: "Digital Marketing Pro",
                role: "Founder",
                testimonial: "As a small business, we needed affordable yet reliable hosting. Aryan Tech Solution delivered exactly that with exceptional customer service that feels personal.",
                rating: 5,
                project: "WordPress Website & Email Hosting"
              },
              {
                name: "Michael Chen",
                company: "Global Gaming Community",
                role: "Community Manager",
                testimonial: "Their Discord bot development and Minecraft server hosting is top-notch. The integration between services is seamless and support is always responsive.",
                rating: 5,
                project: "Gaming Community Infrastructure"
              },
              {
                name: "Aisha Patel",
                company: "EdTech Innovations",
                role: "Technical Lead",
                testimonial: "We needed custom development for our learning platform. The team delivered beyond expectations with clean code and excellent project management.",
                rating: 5,
                project: "Custom Learning Management System"
              },
              {
                name: "David Johnson",
                company: "Startup Accelerator",
                role: "Program Director",
                testimonial: "Aryan Tech Solution handles hosting for 15+ startups in our program. Their scalability and pricing make them perfect for growing businesses.",
                rating: 5,
                project: "Multi-tenant Startup Hosting"
              },
              {
                name: "Sneha Gupta",
                company: "Creative Agency",
                role: "Creative Director",
                testimonial: "From concept to deployment, their web development team understood our vision perfectly. The final product exceeded our expectations.",
                rating: 5,
                project: "Custom Agency Website"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="group hover:-translate-y-2 transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <Quote className="h-8 w-8 text-blue-600 mb-4" />
                  </div>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">"{testimonial.testimonial}"</p>
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                        <p className="text-sm font-medium text-blue-600">{testimonial.company}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Project:</p>
                        <p className="text-sm font-medium text-gray-700">{testimonial.project}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Office & Location */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium mb-6">
                <MapPin className="h-4 w-4 mr-2" />
                Our Presence
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Growing Across India
              </h2>
              <p className="text-gray-600 mb-6">
                While we started in a college dorm, Aryan Tech Solution now serves clients across India and 
                internationally. Our remote-first approach allows us to work with the best talent 
                regardless of location.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4">
                    <Globe className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Headquarters</h4>
                    <p className="text-gray-600">India (Remote-First Company)</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-lg mr-4">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Team Members</h4>
                    <p className="text-gray-600">10+ Remote Professionals</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-purple-100 p-2 rounded-lg mr-4">
                    <Briefcase className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Service Coverage</h4>
                    <p className="text-gray-600">India & Global Clients</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Join Our Remote Team</h3>
                <p className="text-gray-600 mb-6">
                  We're always looking for talented individuals to join our mission of democratizing 
                  premium hosting and tech solutions.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Open Positions</h4>
                    <p className="text-gray-600">Full Stack Developers</p>
                    <p className="text-gray-600">DevOps Engineers</p>
                    <p className="text-gray-600">Support Specialists</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Benefits</h4>
                    <p className="text-gray-600">Remote Work</p>
                    <p className="text-gray-600">Flexible Hours</p>
                    <p className="text-gray-600">Growth Opportunities</p>
                  </div>
                </div>
                <Button className="w-full">
                  View Open Positions
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Achievements
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Milestones that reflect our commitment to excellence and client satisfaction
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <Card key={index} className="text-center h-full hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    {achievement.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {achievement.title}
                  </h3>
                  <p className="text-gray-600">
                    {achievement.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Join Our Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Be part of the Aryan Tech Solution community and experience the difference 
            of working with a team that truly cares about your success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Get Started Today
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-blue-600">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
