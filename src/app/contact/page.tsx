import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Mail, 
  MessageCircle, 
  Instagram, 
  MapPin,
  Clock,
  Send,
  Users,
  Headphones,
  Zap,
  Shield
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us - Aryan Tech Solution",
  description: "Get in touch with Aryan Tech Solution for hosting solutions, custom development, and tech support. Multiple ways to reach our expert team.",
  keywords: "contact aryan tech solution, tech support, hosting support, aryan thakur contact",
};

export default function Contact() {
  const contactMethods = [
    {
      icon: <MessageCircle className="h-8 w-8 text-purple-600" />,
      title: "Discord Community",
      description: "Join our Discord server for instant support and community interaction",
      value: "Join Server",
      link: "https://discord.gg/SSVg6QrG28",
      badge: "500+ Members",
      bgColor: "from-purple-50 to-indigo-50",
      hoverColor: "from-purple-100 to-indigo-100"
    },
    {
      icon: <Mail className="h-8 w-8 text-green-600" />,
      title: "Email Support",
      description: "Send us an email and we'll respond within 24 hours",
      value: "raghavlove305@gmail.com",
      link: "mailto:raghavlove305@gmail.com",
      badge: "24h Response",
      bgColor: "from-green-50 to-emerald-50",
      hoverColor: "from-green-100 to-emerald-100"
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-blue-500" />,
      title: "Telegram Chat",
      description: "Chat with us on Telegram for quick responses and updates",
      value: "@aryan_devloper",
      link: "https://t.me/aryan_devloper",
      badge: "Instant Reply",
      bgColor: "from-blue-50 to-sky-50",
      hoverColor: "from-blue-100 to-sky-100"
    },
    {
      icon: <Instagram className="h-8 w-8 text-pink-600" />,
      title: "Instagram",
      description: "Follow us for updates, tutorials, and behind-the-scenes content",
      value: "@aryan_devloper",
      link: "https://instagram.com/aryantechsolution",
      badge: "Latest Updates",
      bgColor: "from-pink-50 to-rose-50",
      hoverColor: "from-pink-100 to-rose-100"
    }
  ];

  const businessHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM IST", icon: "💼" },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM IST", icon: "🕐" },
    { day: "Sunday", hours: "Community Support Only", icon: "💬" },
    { day: "Discord 24/7", hours: "Community & Bot Support", icon: "🤖" }
  ];

  const supportFeatures = [
    {
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      title: "Instant Response",
      description: "Get immediate help through our Discord community"
    },
    {
      icon: <Users className="h-6 w-6 text-blue-500" />,
      title: "Community Support",
      description: "Learn from 500+ developers and experts"
    },
    {
      icon: <Shield className="h-6 w-6 text-green-500" />,
      title: "24/7 Monitoring",
      description: "Round-the-clock server and service monitoring"
    },
    {
      icon: <Headphones className="h-6 w-6 text-purple-500" />,
      title: "Expert Help",
      description: "Direct access to experienced developers"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-24 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl animate-blob"></div>
          <div className="absolute top-20 right-20 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-semibold mb-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <MessageCircle className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Join 500+ developers in our Discord community
              </span>
              <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-black text-gray-900 mb-8">
              <span className="block">Get in</span>
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className="text-xl text-gray-800 max-w-4xl mx-auto leading-relaxed">
              Connect with our expert team through multiple channels. Whether you need technical support, 
              want to discuss a project, or join our thriving developer community - we're here to help.
            </p>
            
            {/* Quick stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">500+</div>
                <div className="text-gray-800">Discord Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">24/7</div>
                <div className="text-gray-800">Community Support</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600">&lt; 1h</div>
                <div className="text-gray-800">Response Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Contact Methods */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100 to-purple-100 rounded-full opacity-30 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-100 to-pink-100 rounded-full opacity-30 transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-full text-sm font-medium mb-6">
              <MessageCircle className="h-4 w-4 mr-2" />
              Multiple Ways to Connect
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Choose Your <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Preferred Channel</span>
            </h2>
            <p className="text-xl text-gray-800 max-w-3xl mx-auto leading-relaxed">
              We're available through multiple platforms to provide the best support experience. 
              Join our community or reach out directly - we're here to help!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <Card key={index} className="text-center h-full group relative overflow-hidden border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-700 transform hover:-translate-y-4 hover:scale-105">
                {/* Enhanced background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${method.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl`}></div>
                
                {/* Floating particles */}
                <div className="absolute top-4 right-4 w-3 h-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 animate-ping"></div>
                <div className="absolute bottom-4 left-4 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-900 animate-pulse"></div>
                
                <CardContent className="pt-10 pb-8 relative z-10">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className={`p-5 bg-gradient-to-br ${method.bgColor} rounded-3xl group-hover:scale-125 transition-all duration-700 shadow-lg group-hover:shadow-2xl group-hover:rotate-6`}>
                        {method.icon}
                      </div>
                      {/* Badge */}
                      <div className="absolute -top-2 -right-2 px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-0 group-hover:scale-100">
                        {method.badge}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-500">
                    {method.title}
                  </h3>
                  
                  <p className="text-gray-800 mb-6 text-sm leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
                    {method.description}
                  </p>
                  
                  <a 
                    href={method.link}
                    className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold transform hover:-translate-y-1 group/btn"
                    target={method.link.startsWith('http') ? '_blank' : undefined}
                    rel={method.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    <span className="group-hover/btn:scale-110 transition-transform duration-300">{method.value}</span>
                    <Send className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </a>
                  
                  {/* Progress indicator */}
                  <div className="mt-6 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1200 ease-out"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Support Features */}
          <div className="mt-20">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">
              Why Choose Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Support</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {supportFeatures.map((feature, index) => (
                <div key={index} className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50 group hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-white rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-800">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <Input id="firstName" placeholder="Your first name" />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <Input id="lastName" placeholder="Your last name" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <Input id="email" type="email" placeholder="your.email@example.com" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number (Optional)
                    </label>
                    <Input id="phone" type="tel" placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                      Service Interest
                    </label>
                    <select 
                      id="service" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a service</option>
                      <option value="hosting">VPS Hosting</option>
                      <option value="domains">Domain Registration</option>
                      <option value="bots">Bot Development</option>
                      <option value="development">Custom Development</option>
                      <option value="minecraft">Minecraft Hosting</option>
                      <option value="support">Technical Support</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea 
                      id="message" 
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tell us about your project or requirements..."
                    ></textarea>
                  </div>
                  <Button className="w-full">
                    Send Message <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Business Info */}
            <div className="space-y-8">
              {/* Enhanced Business Hours */}
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center">
                    <div className="p-2 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl mr-3">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">Support Hours</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {businessHours.map((schedule, index) => (
                      <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3 group-hover:scale-125 transition-transform duration-300">{schedule.icon}</span>
                          <span className="font-medium text-gray-900">{schedule.day}</span>
                        </div>
                        <span className="text-gray-800 font-medium">{schedule.hours}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Discord highlight */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                    <div className="flex items-center text-purple-800">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      <span className="font-semibold">Best Response Time: Discord Community</span>
                    </div>
                    <p className="text-sm text-purple-600 mt-1">
                      Join our Discord for instant help from both our team and community members!
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Location */}
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center">
                    <div className="p-2 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl mr-3">
                      <MapPin className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-xl">Global Presence</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-800 mb-6 leading-relaxed">
                    Universal Cloud operates globally with our team based in India, providing 
                    world-class hosting and development services to clients worldwide.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                      <div className="flex items-center mb-2">
                        <span className="text-xl mr-2">🏢</span>
                        <span className="font-semibold text-blue-900">Headquarters</span>
                      </div>
                      <p className="text-blue-700 text-sm">India (IST Timezone)</p>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                      <div className="flex items-center mb-2">
                        <span className="text-xl mr-2">🌐</span>
                        <span className="font-semibold text-green-900">Server Locations</span>
                      </div>
                      <p className="text-green-700 text-sm">Mumbai • Delhi • Bangalore • Singapore • USA</p>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                      <div className="flex items-center mb-2">
                        <span className="text-xl mr-2">👥</span>
                        <span className="font-semibold text-purple-900">Community</span>
                      </div>
                      <p className="text-purple-700 text-sm">Discord server with 500+ developers worldwide</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Quick Actions */}
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Quick Connect</CardTitle>
                  <CardDescription>Choose the fastest way to get help</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <a 
                      href="https://discord.gg/SSVg6QrG28"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl hover:from-purple-100 hover:to-indigo-100 transition-all duration-300 group border-2 border-transparent hover:border-purple-200"
                    >
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-300">
                        <MessageCircle className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-purple-900 block">Join Discord Server</span>
                        <span className="text-sm text-purple-600">500+ members • Instant help</span>
                      </div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </a>
                    
                    <a 
                      href="https://t.me/aryan_devloper"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl hover:from-blue-100 hover:to-sky-100 transition-all duration-300 group border-2 border-transparent hover:border-blue-200"
                    >
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-sky-500 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-300">
                        <MessageCircle className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-blue-900 block">Chat on Telegram</span>
                        <span className="text-sm text-blue-600">Direct message • Quick response</span>
                      </div>
                    </a>
                    
                    <a 
                      href="mailto:raghavlove305@gmail.com"
                      className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-300 group border-2 border-transparent hover:border-green-200"
                    >
                      <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-300">
                        <Mail className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-green-900 block">Send Email</span>
                        <span className="text-sm text-green-600">Detailed inquiries • 24h response</span>
                      </div>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Community Support Section */}
      <section className="py-20 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border-t border-purple-100 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-200 rounded-full opacity-20 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200 rounded-full opacity-20 transform translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-full text-sm font-semibold mb-8 shadow-lg">
              <Users className="h-5 w-5 mr-2" />
              <span>Join Our Thriving Developer Community</span>
            </div>
            
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Need <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Immediate Help?</span>
            </h2>
            
            <p className="text-xl text-gray-800 mb-10 leading-relaxed">
              Join our Discord community for instant support from both our expert team and 
              500+ experienced developers. Get help with server issues, development questions, 
              and technical emergencies 24/7.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-bold text-gray-900 mb-2">Instant Response</h3>
                <p className="text-gray-800 text-sm">Get help within minutes from our active community</p>
              </div>
              <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="font-bold text-gray-900 mb-2">Smart Bots</h3>
                <p className="text-gray-800 text-sm">Automated tools and helpers available 24/7</p>
              </div>
              <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                <div className="text-3xl mb-3">👨‍💻</div>
                <h3 className="font-bold text-gray-900 mb-2">Expert Team</h3>
                <p className="text-gray-800 text-sm">Direct access to our development team</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a href="https://discord.gg/SSVg6QrG28" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 px-8 py-4 text-lg font-bold">
                  <MessageCircle className="mr-3 h-6 w-6" />
                  Join Discord Community
                  <div className="ml-3 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </Button>
              </a>
              
              <a href="https://t.me/aryan_devloper" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400 px-8 py-4 text-lg font-semibold">
                  <MessageCircle className="mr-3 h-5 w-5" />
                  Telegram Support
                </Button>
              </a>
            </div>
            
            <div className="mt-8 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
              <p className="text-amber-800 font-medium">
                🚨 <strong>Critical Server Issues:</strong> Use Discord @here mention or DM our team directly for emergency support
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
