import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Calendar, Shield, Users, FileText } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Aryan Tech Solution
            </h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-600 mb-2">Aryan Tech Solution Platform Terms and Conditions</p>
          <div className="flex items-center justify-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            Last updated: August 23, 2025
          </div>
        </div>

        {/* Terms Content */}
        <div className="space-y-8">
          <Card className="border border-gray-200 shadow-lg bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Shield className="h-5 w-5 text-blue-600" />
                1. Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none p-6">
              <p className="text-gray-700 leading-relaxed">
                By accessing and using Aryan Tech Solution services, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
              <p className="text-gray-700 leading-relaxed">
                These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") 
                and Aryan Tech Solution ("we," "us" or "our"), concerning your access to and use of our platform and services.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-lg bg-white">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Users className="h-5 w-5 text-green-600" />
                2. User Accounts and Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Account Registration</h4>
              <ul className="text-gray-700 space-y-2">
                <li>You must provide accurate and complete registration information</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>You must notify us immediately of any unauthorized access to your account</li>
                <li>You are responsible for all activities that occur under your account</li>
              </ul>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-3 mt-6">User Conduct</h4>
              <ul className="text-gray-700 space-y-2">
                <li>You agree not to use our services for any unlawful or prohibited activities</li>
                <li>You will not attempt to gain unauthorized access to our systems or other users' accounts</li>
                <li>You will not upload, transmit, or distribute any malicious software or content</li>
                <li>You will comply with all applicable laws and regulations</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-lg bg-white">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="text-gray-900">3. Services and Features</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Available Services</h4>
              <ul className="text-gray-700 space-y-2">
                <li><strong className="text-gray-900">VPS Hosting:</strong> Virtual private server hosting with various configurations</li>
                <li><strong className="text-gray-900">Domain Registration:</strong> Domain name registration and management services</li>
                <li><strong className="text-gray-900">Discord Bot Hosting:</strong> Specialized hosting for Discord bots and applications</li>
                <li><strong className="text-gray-900">Minecraft Server Hosting:</strong> Game server hosting with custom configurations</li>
                <li><strong className="text-gray-900">Web Development:</strong> Custom web application development services</li>
                <li><strong className="text-gray-900">Mobile App Development:</strong> iOS and Android application development</li>
              </ul>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-3 mt-6">Service Availability</h4>
              <p className="text-gray-700 leading-relaxed">
                We strive to maintain 99.9% uptime for our services. However, we do not guarantee uninterrupted service 
                and reserve the right to perform maintenance and updates as necessary.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Payment Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h4>Billing and Payments</h4>
              <ul>
                <li>All services are billed in advance based on the selected billing cycle</li>
                <li>Payments are due immediately upon invoice generation</li>
                <li>We accept major credit cards, PayPal, and other approved payment methods</li>
                <li>Failed payments may result in service suspension or termination</li>
              </ul>
              
              <h4>Refunds and Cancellations</h4>
              <ul>
                <li>Refund requests must be submitted within 30 days of initial payment</li>
                <li>Services used for more than 7 days are not eligible for full refunds</li>
                <li>Custom development services are non-refundable once work has commenced</li>
                <li>Account cancellations must be requested through our support system</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Privacy and Data Protection</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information 
                when you use our services. By using our services, you agree to the collection and use of information in 
                accordance with our Privacy Policy.
              </p>
              <p>
                We implement appropriate security measures to protect your personal information against unauthorized access, 
                alteration, disclosure, or destruction.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h4>Our Intellectual Property</h4>
              <p>
                The Universal Cloud platform, including its original content, features, and functionality, is owned by 
                Universal Cloud and is protected by international copyright, trademark, patent, trade secret, and other 
                intellectual property laws.
              </p>
              
              <h4>User Content</h4>
              <p>
                You retain ownership of any content you upload or create using our services. However, you grant us a 
                non-exclusive, worldwide, royalty-free license to use, modify, and distribute your content as necessary 
                to provide our services.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                To the maximum extent permitted by applicable law, Universal Cloud shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred 
                directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
              </p>
              <p>
                Our total liability to you for any damages shall not exceed the amount paid by you to Universal Cloud in 
                the twelve (12) months preceding the claim.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Termination</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                We may terminate or suspend your account and access to our services immediately, without prior notice or 
                liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
              <p>
                Upon termination, your right to use the services will cease immediately. If you wish to terminate your 
                account, you may simply discontinue using the services and contact our support team.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-lg bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <FileText className="h-5 w-5 text-blue-600" />
                9. Changes to Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none p-6">
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision 
                is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
              <p>
                Your continued use of our services after any such changes constitutes your acceptance of the new Terms.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-lg bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Users className="h-5 w-5 text-blue-600" />
                10. Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none p-6">
              <p>
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <ul>
                <li>Email: legal@aryantechsolution.com</li>
                <li>Support: support@aryantechsolution.com</li>
                <li>Discord: https://discord.gg/SSVg6QrG28</li>
                <li>Address: Aryan Tech Solution Legal Department</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex space-x-6">
              <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-700 font-medium">
                Privacy Policy
              </Link>
              <Link href="/careers" className="text-blue-600 hover:text-blue-700 font-medium">
                Careers
              </Link>
              <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-medium">
                Contact Us
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              © 2025 Aryan Tech Solution. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
