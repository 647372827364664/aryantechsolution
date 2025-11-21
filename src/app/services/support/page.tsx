import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Search,
  Headphones,
  FileText,
  Users,
  Zap,
  Shield,
  Server,
  Code,
  Globe,
  Database,
  Monitor
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Service Support - Aryan Tech Solution",
  description: "Get expert support for all Aryan Tech Solution services. Technical assistance, troubleshooting, and customer service available 24/7.",
  keywords: "aryan tech solution support, technical support, hosting support, service help, customer service",
};

export default function ServiceSupport() {
  const supportCategories = [
    {
      icon: <Server className="h-8 w-8 text-blue-600" />,
      title: "Hosting Services",
      description: "VPS, shared hosting, and cloud infrastructure support",
      services: ["VPS Management", "Domain Setup", "SSL Installation", "Server Migration"],
      link: "/services/support/hosting"
    },
    {
      icon: <Code className="h-8 w-8 text-purple-600" />,
      title: "Development Services",
      description: "Custom development and application support",
      services: ["Web Development", "Mobile Apps", "API Integration", "Custom Solutions"],
      link: "/services/support/development"
    },
    {
      icon: <Globe className="h-8 w-8 text-green-600" />,
      title: "Website Services",
      description: "Website design, maintenance, and optimization",
      services: ["Website Design", "SEO Optimization", "Performance Tuning", "Content Management"],
      link: "/services/support/website"
    },
    {
      icon: <Database className="h-8 w-8 text-orange-600" />,
      title: "Database Services",
      description: "Database management and optimization support",
      services: ["Database Setup", "Performance Optimization", "Backup Solutions", "Migration"],
      link: "/services/support/database"
    },
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: "Security Services",
      description: "Security audits, monitoring, and protection",
      services: ["Security Audits", "Monitoring Setup", "Firewall Configuration", "Malware Removal"],
      link: "/services/support/security"
    },
    {
      icon: <Monitor className="h-8 w-8 text-indigo-600" />,
      title: "Monitoring Services",
      description: "System monitoring and performance tracking",
      services: ["Uptime Monitoring", "Performance Analytics", "Alert Setup", "Reporting"],
      link: "/services/support/monitoring"
    }
  ];

  const supportChannels = [
    {
      icon: <MessageCircle className="h-6 w-6 text-purple-600" />,
      title: "Discord Community",
      description: "Join our active Discord server for instant community support",
      response: "< 5 minutes",
      link: "https://discord.gg/SSVg6QrG28",
      badge: "24/7 Active"
    },
    {
      icon: <Mail className="h-6 w-6 text-blue-600" />,
      title: "Email Support",
      description: "Send detailed support requests via email",
      response: "< 2 hours",
      link: "mailto:raghavlove305@gmail.com",
      badge: "Priority Support"
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-green-600" />,
      title: "Telegram Chat",
      description: "Quick support via Telegram messaging",
      response: "< 30 minutes",
      link: "https://t.me/aryan_devloper",
      badge: "Direct Access"
    }
  ];

  const faqItems = [
    {
      question: "How quickly can I get support for my services?",
      answer: "We provide 24/7 support through multiple channels. Discord community offers instant help, while email support typically responds within 2 hours."
    },
    {
      question: "Is technical support included with all services?",
      answer: "Yes, all our services include comprehensive technical support. Premium support plans are available for enhanced response times and dedicated assistance."
    },
    {
      question: "Can you help with service migration from other providers?",
      answer: "Absolutely! We offer free migration assistance for all hosting and development services. Our team will handle the entire process to ensure zero downtime."
    },
    {
      question: "Do you provide emergency support for critical issues?",
      answer: "Yes, we offer emergency support for critical issues 24/7. Contact us immediately through Discord or Telegram for urgent matters."
    },
    {
      question: "What's included in your service maintenance?",
      answer: "Our service maintenance includes regular updates, security patches, performance optimization, backup management, and proactive monitoring."
    },
    {
      question: "Can I upgrade or modify my existing services?",
      answer: "Yes, all our services are scalable. You can upgrade resources, add features, or modify configurations at any time through our support team."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-semibold mb-8 shadow-lg">
              <Headphones className="h-5 w-5 mr-2" />
              24/7 Expert Support Available
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-black text-gray-900 mb-8">
              Service <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Support</span>
            </h1>
            
            <p className="text-xl text-gray-800 max-w-4xl mx-auto leading-relaxed mb-12">
              Get expert assistance for all your Aryan Tech Solution services. From technical troubleshooting 
              to service optimization, our dedicated support team is here to help you succeed.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">24/7</div>
                <div className="text-gray-800 text-sm">Support Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">&lt; 2h</div>
                <div className="text-gray-800 text-sm">Email Response</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">500+</div>
                <div className="text-gray-800 text-sm">Community Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">99.9%</div>
                <div className="text-gray-800 text-sm">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Support by <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Service Category</span>
            </h2>
            <p className="text-xl text-gray-800 max-w-3xl mx-auto">
              Find specialized support for each of our service categories. Our experts are ready to help with any technical challenges.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {supportCategories.map((category, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                    {category.title}
                  </CardTitle>
                  <CardDescription className="text-gray-800">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-6">
                    {category.services.map((service, serviceIndex) => (
                      <div key={serviceIndex} className="flex items-center gap-2 text-sm text-gray-800">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>
                  <Link href={category.link}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Get Support
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Multiple Ways to <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Get Help</span>
            </h2>
            <p className="text-xl text-gray-800 max-w-3xl mx-auto">
              Choose your preferred support channel based on urgency and communication style.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {supportChannels.map((channel, index) => (
              <Card key={index} className="text-center group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="pt-8 pb-8">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      {channel.icon}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full text-xs font-semibold mb-3">
                      {channel.badge}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{channel.title}</h3>
                    <p className="text-gray-800 mb-4">{channel.description}</p>
                    <div className="text-sm text-blue-600 font-semibold">
                      Response Time: {channel.response}
                    </div>
                  </div>
                  
                  <a href={channel.link} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Contact Support
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Frequently Asked <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Questions</span>
            </h2>
            <p className="text-xl text-gray-800">
              Quick answers to common support questions
            </p>
          </div>
          
          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <Card key={index} className="border-l-4 border-blue-600 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    {item.question}
                  </h3>
                  <p className="text-gray-800 leading-relaxed pl-8">
                    {item.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black text-white mb-6">
            Still Need Help?
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Our expert support team is standing by to help you with any service-related questions or technical challenges.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a href="https://discord.gg/SSVg6QrG28" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <MessageCircle className="h-5 w-5 mr-2" />
                Join Discord Community
              </Button>
            </a>
            <a href="mailto:raghavlove305@gmail.com">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <Mail className="h-5 w-5 mr-2" />
                Email Support Team
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
