'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star, CheckCircle, Users, Clock, Shield, Phone, Mail, Award, Zap, Globe, HeadphonesIcon, MessageCircle, ArrowRight, Download, Share2, Heart, Bookmark } from 'lucide-react'
import { useCurrency } from '@/lib/currency'

interface Service {
  id: string
  name: string
  description: string
  price: number
  pricing?: string
  features: string[]
  category: string
  rating: number
  reviews: number
  deliveryTime: string
  image?: string
  highlights?: string[]
  techStack?: string[]
  portfolio?: { title: string; description: string; image?: string }[]
  testimonials?: { name: string; role: string; company: string; review: string; rating: number }[]
  faqs?: { question: string; answer: string }[]
}

export default function ServiceDetailPage() {
  const params = useParams()
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { currency, formatPrice, convertFromUSD } = useCurrency()

  useEffect(() => {
    const fetchService = async () => {
      try {
        if (!params.id) return
        
        const serviceDoc = await getDoc(doc(db, 'services', params.id as string))
        
        if (serviceDoc.exists()) {
          const serviceData = serviceDoc.data()
          
          // Extract price from either 'price' field or 'pricing' field
          let extractedPrice = 0
          if (serviceData.price) {
            extractedPrice = typeof serviceData.price === 'number' ? serviceData.price : parseFloat(serviceData.price)
          } else if (serviceData.pricing) {
            // Extract numeric value from pricing string (e.g., "$299" -> 299)
            const priceMatch = serviceData.pricing.match(/\d+(\.\d+)?/)
            extractedPrice = priceMatch ? parseFloat(priceMatch[0]) : 0
          }
          
          setService({
            id: serviceDoc.id,
            ...serviceData,
            price: extractedPrice,
            // Add default data if not present
            highlights: serviceData.highlights || [
              "✨ Premium Quality Service",
              "🚀 Fast Implementation", 
              "🔒 Enterprise Security",
              "📞 24/7 Support"
            ],
            techStack: serviceData.techStack || [
              "Latest Technologies",
              "Scalable Architecture", 
              "Cloud Infrastructure",
              "Security First"
            ],
            portfolio: serviceData.portfolio || [
              {
                title: "E-commerce Platform",
                description: "Built a scalable e-commerce solution handling 10k+ daily transactions",
                image: "/api/placeholder/300/200"
              },
              {
                title: "SaaS Dashboard", 
                description: "Created an intuitive analytics dashboard for business intelligence",
                image: "/api/placeholder/300/200"
              },
              {
                title: "Mobile Application",
                description: "Developed cross-platform mobile app with 50k+ downloads",
                image: "/api/placeholder/300/200"
              }
            ],
            testimonials: serviceData.testimonials || [
              {
                name: "Sarah Johnson",
                role: "CTO",
                company: "TechCorp Inc.",
                review: "Exceptional service quality and outstanding support. They delivered beyond our expectations.",
                rating: 5
              },
              {
                name: "Michael Chen",
                role: "Founder", 
                company: "StartupXYZ",
                review: "Professional team with deep technical expertise. Highly recommend their services.",
                rating: 5
              }
            ],
            faqs: serviceData.faqs || [
              {
                question: "How long does the project take?",
                answer: "Project timelines vary based on complexity. Typically 2-8 weeks for standard projects."
              },
              {
                question: "Do you provide ongoing support?",
                answer: "Yes, we offer 24/7 support and maintenance packages for all our services."
              },
              {
                question: "Can you work with our existing systems?",
                answer: "Absolutely! We specialize in integrations and can work with your current infrastructure."
              },
              {
                question: "What technologies do you use?",
                answer: "We use the latest technologies including React, Node.js, Python, AWS, and more based on project needs."
              }
            ]
          } as Service)
        } else {
          setError('Service not found')
        }
      } catch (err) {
        console.error('Error fetching service:', err)
        setError('Failed to load service')
      } finally {
        setLoading(false)
      }
    }

    fetchService()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service details...</p>
        </div>
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The service you are looking for does not exist.'}</p>
          <Button onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => window.history.back()}
            className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center font-medium transition-colors"
          >
            ← Back to Services
          </button>
          
          {/* Hero Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Service Image */}
                <div className="lg:w-1/3">
                  <div className="aspect-square bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    {service.image ? (
                      <img 
                        src={service.image} 
                        alt={service.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <div className="text-white text-6xl font-bold">
                        {service.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Heart className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                {/* Service Info */}
                <div className="lg:w-2/3">
                  <div className="mb-4">
                    <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium px-4 py-2 rounded-full">
                      {service.category}
                    </span>
                    <span className="ml-3 inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                      ✓ Verified Provider
                    </span>
                  </div>
                  
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-4">
                    {service.name}
                  </h1>
                  
                  <div className="flex items-center gap-6 mb-6">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(service.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {service.rating} ({service.reviews}+ reviews)
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      {service.deliveryTime}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      500+ completed projects
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    {service.description}
                  </p>
                  
                  {/* Highlights */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {service.highlights?.map((highlight, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {highlight}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        {formatPrice(convertFromUSD(service.price))}
                      </span>
                      <span className="text-gray-600 ml-2">starting from</span>
                      <div className="text-sm text-gray-500 mt-1">💰 Best Value Guarantee</div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Live Chat
                      </Button>
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8">
                        Get Started Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Features & Tech Stack */}
          <div className="lg:col-span-2 space-y-6">
            {/* Features */}
            <Card className="p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                What's Included
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Tech Stack */}
            <Card className="p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Zap className="w-6 h-6 text-blue-500 mr-2" />
                Technologies & Tools
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {service.techStack?.map((tech, index) => (
                  <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg text-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-2"></div>
                    <span className="text-sm font-medium text-gray-700">{tech}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Portfolio/Examples */}
            <Card className="p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Award className="w-6 h-6 text-purple-500 mr-2" />
                Recent Work Portfolio
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {service.portfolio?.map((item, index) => (
                  <div key={index} className="group cursor-pointer">
                    <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-3 overflow-hidden">
                      <img 
                        src={item.image || "/api/placeholder/300/200"} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Testimonials */}
            <Card className="p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Users className="w-6 h-6 text-green-500 mr-2" />
                Client Testimonials
              </h2>
              <div className="space-y-4">
                {service.testimonials?.map((testimonial, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</p>
                      </div>
                      <div className="ml-auto flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 italic">"{testimonial.review}"</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* FAQ */}
            <Card className="p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <MessageCircle className="w-6 h-6 text-blue-500 mr-2" />
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {service.faqs?.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Enhanced Contact & Pricing Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card className="p-6 shadow-lg border-2 border-blue-100">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  {formatPrice(convertFromUSD(service.price))}
                </div>
                <p className="text-gray-600">Starting Price</p>
                <div className="bg-green-50 text-green-800 text-sm px-3 py-1 rounded-full mt-2 inline-block">
                  💰 Best Value Guarantee
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Time:</span>
                  <span className="font-medium">{service.deliveryTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Revisions:</span>
                  <span className="font-medium">Unlimited</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Support:</span>
                  <span className="font-medium">24/7 Included</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Money Back:</span>
                  <span className="font-medium text-green-600">30 Days</span>
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white mb-3 h-12 text-lg font-semibold">
                Order Now - {formatPrice(convertFromUSD(service.price))}
              </Button>
              
              <Button variant="outline" className="w-full mb-4">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact for Custom Quote
              </Button>
            </Card>

            {/* Contact Information */}
            <Card className="p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <HeadphonesIcon className="w-5 h-5 mr-2 text-blue-600" />
                Get in Touch
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Phone Support</p>
                    <p className="text-sm text-gray-600">+1 (800) 999-CLOUD</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-gray-600">hello@aryantechsolution.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Live Chat</p>
                    <p className="text-sm text-gray-600">Available 24/7</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Why Choose Us?</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    5+ Years Experience
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    500+ Happy Clients
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    99.9% Satisfaction Rate
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Award Winning Team
                  </div>
                </div>
              </div>
            </Card>

            {/* Trust Badges */}
            <Card className="p-6 shadow-lg text-center">
              <h3 className="font-bold text-gray-900 mb-4">Trusted & Secure</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs font-medium">SSL Secured</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-xs font-medium">Certified Pro</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-xs font-medium">500+ Clients</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <Globe className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs font-medium">Global Service</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Enhanced Process & Guarantees */}
        <div className="space-y-8">
          {/* Our Process */}
          <Card className="p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Our Proven Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: "1", title: "Consultation", desc: "Free consultation to understand your needs", icon: MessageCircle, color: "bg-blue-500" },
                { step: "2", title: "Planning", desc: "Detailed project planning and timeline", icon: Clock, color: "bg-purple-500" },
                { step: "3", title: "Development", desc: "Expert development with regular updates", icon: Zap, color: "bg-green-500" },
                { step: "4", title: "Delivery", desc: "Final testing and project delivery", icon: CheckCircle, color: "bg-orange-500" }
              ].map((process, index) => (
                <div key={index} className="text-center relative">
                  <div className={`${process.color} text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-lg`}>
                    {process.step}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{process.title}</h3>
                  <p className="text-sm text-gray-600">{process.desc}</p>
                  {index < 3 && (
                    <ArrowRight className="hidden md:block absolute top-8 -right-3 w-6 h-6 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Guarantees & Policies */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center shadow-lg border-2 border-green-100">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Money Back Guarantee</h3>
              <p className="text-sm text-gray-600">
                30-day money back guarantee if you're not completely satisfied
              </p>
            </Card>
            
            <Card className="p-6 text-center shadow-lg border-2 border-blue-100">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Expert Team</h3>
              <p className="text-sm text-gray-600">
                Certified professionals with 5+ years of industry experience
              </p>
            </Card>
            
            <Card className="p-6 text-center shadow-lg border-2 border-purple-100">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">On-Time Delivery</h3>
              <p className="text-sm text-gray-600">
                We guarantee on-time delivery or you get 20% off your next order
              </p>
            </Card>
          </div>

          {/* Related Services */}
          <Card className="p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Web Development", price: 299, category: "Development" },
                { name: "Mobile App", price: 599, category: "Mobile" },
                { name: "SEO Optimization", price: 199, category: "Marketing" }
              ].map((related, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="w-full h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-3"></div>
                  <h3 className="font-semibold text-gray-900">{related.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{related.category}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-blue-600">{formatPrice(convertFromUSD(related.price))}</span>
                    <Button size="sm" variant="outline">View Details</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
