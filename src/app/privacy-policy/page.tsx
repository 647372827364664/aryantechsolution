import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Calendar, Shield, Lock, Eye, Database, Users, Globe } from "lucide-react";

export default function PrivacyPolicy() {
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
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600 mb-2">How we protect and handle your information</p>
          <div className="flex items-center justify-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            Last updated: August 23, 2025
          </div>
        </div>

        {/* Privacy Content */}
        <div className="space-y-8">
          <Card className="border border-gray-200 shadow-lg bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Eye className="h-5 w-5 text-blue-600" />
                1. Introduction
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none p-6">
              <p className="text-gray-700 leading-relaxed">
                Aryan Tech Solution ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains 
                how your personal information is collected, used, and disclosed by Universal Cloud when you use our platform 
                and services.
              </p>
              <p className="text-gray-700 leading-relaxed">
                This policy applies to all information collected or submitted on Aryan Tech Solution's website, mobile applications, 
                and any related services we offer.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-lg bg-white">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Database className="h-5 w-5 text-green-600" />
                2. Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h4>
              <ul className="text-gray-700 space-y-2">
                <li><strong className="text-gray-900">Account Information:</strong> Name, email address, phone number, billing address</li>
                <li><strong className="text-gray-900">Payment Information:</strong> Credit card details, PayPal information (processed securely by third-party providers)</li>
                <li><strong className="text-gray-900">Profile Information:</strong> User preferences, avatar, and other profile customizations</li>
                <li><strong className="text-gray-900">Communication Data:</strong> Support tickets, chat messages, and email correspondence</li>
              </ul>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-3 mt-6">Technical Information</h4>
              <ul className="text-gray-700 space-y-2">
                <li><strong className="text-gray-900">Usage Data:</strong> How you interact with our services, features used, time spent</li>
                <li><strong className="text-gray-900">Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                <li><strong className="text-gray-900">Server Logs:</strong> Access logs, error logs, and performance metrics</li>
                <li><strong className="text-gray-900">Cookies and Tracking:</strong> Session cookies, preference cookies, and analytics data</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-lg bg-white">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Users className="h-5 w-5 text-purple-600" />
                3. How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Service Provision</h4>
              <ul className="text-gray-700 space-y-2">
                <li>Provide, maintain, and improve our hosting and development services</li>
                <li>Process payments and manage billing</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Monitor and analyze usage patterns to improve our services</li>
              </ul>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-3 mt-6">Communication</h4>
              <ul className="text-gray-700 space-y-2">
                <li>Send service-related notifications and updates</li>
                <li>Respond to customer support requests</li>
                <li>Send promotional content (with your consent)</li>
                <li>Provide important security and legal notices</li>
              </ul>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-3 mt-6">Security and Legal</h4>
              <ul className="text-gray-700 space-y-2">
                <li>Protect against fraud, abuse, and security threats</li>
                <li>Comply with legal obligations and enforce our Terms of Service</li>
                <li>Investigate and prevent prohibited or illegal activities</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-lg bg-white">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Globe className="h-5 w-5 text-orange-600" />
                4. Information Sharing and Disclosure
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">We Do Not Sell Your Personal Information</h4>
              <p className="text-gray-700 leading-relaxed">
                Aryan Tech Solution does not sell, rent, or trade your personal information to third parties for marketing purposes.
              </p>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-3 mt-6">We May Share Information In These Situations:</h4>
              <ul className="text-gray-700 space-y-2">
                <li><strong className="text-gray-900">Service Providers:</strong> Third-party vendors who help us operate our services (payment processors, cloud infrastructure)</li>
                <li><strong className="text-gray-900">Legal Requirements:</strong> When required by law, court order, or government regulation</li>
                <li><strong className="text-gray-900">Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                <li><strong className="text-gray-900">Safety and Security:</strong> To protect the rights, property, or safety of Universal Cloud or others</li>
                <li><strong className="text-gray-900">With Your Consent:</strong> When you explicitly agree to share information</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-lg bg-white">
            <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Lock className="h-5 w-5 text-red-600" />
                5. Data Security
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Security Measures</h4>
              <ul className="text-gray-700 space-y-2">
                <li><strong className="text-gray-900">Encryption:</strong> All data transmitted to and from our servers is encrypted using SSL/TLS</li>
                <li><strong className="text-gray-900">Access Controls:</strong> Strict access controls and authentication for our systems</li>
                <li><strong className="text-gray-900">Regular Audits:</strong> Regular security audits and penetration testing</li>
                <li><strong className="text-gray-900">Data Centers:</strong> Secure, certified data centers with physical security measures</li>
                <li><strong className="text-gray-900">Employee Training:</strong> Regular security training for all employees</li>
              </ul>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-3 mt-6">Data Breach Response</h4>
              <p className="text-gray-700 leading-relaxed">
                In the event of a data breach that affects your personal information, we will notify you within 72 hours 
                and provide details about the incident, the information involved, and steps we're taking to address the issue.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-lg bg-white">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
              <CardTitle className="text-gray-900">6. Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Data Rights</h4>
              <ul className="text-gray-700 space-y-2">
                <li><strong className="text-gray-900">Access:</strong> Request a copy of the personal information we have about you</li>
                <li><strong className="text-gray-900">Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong className="text-gray-900">Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
                <li><strong className="text-gray-900">Portability:</strong> Request transfer of your data to another service provider</li>
                <li><strong className="text-gray-900">Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
              </ul>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-3 mt-6">How to Exercise Your Rights</h4>
              <p className="text-gray-700 leading-relaxed">
                To exercise any of these rights, please contact us at privacy@universalcloud.com or through our support system. 
                We will respond to your request within 30 days.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-lg bg-white">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
              <CardTitle className="text-gray-900">7. Cookies and Tracking Technologies</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Types of Cookies We Use</h4>
              <ul className="text-gray-700 space-y-2">
                <li><strong className="text-gray-900">Essential Cookies:</strong> Required for basic website functionality and security</li>
                <li><strong className="text-gray-900">Performance Cookies:</strong> Help us understand how visitors interact with our website</li>
                <li><strong className="text-gray-900">Functionality Cookies:</strong> Remember your preferences and settings</li>
                <li><strong className="text-gray-900">Analytics Cookies:</strong> Provide insights into website usage and performance</li>
              </ul>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-3 mt-6">Managing Cookies</h4>
              <p className="text-gray-700 leading-relaxed">
                You can control and delete cookies through your browser settings. However, disabling certain cookies may 
                affect the functionality of our services.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-lg bg-white">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50">
              <CardTitle className="text-gray-900">8. Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none p-6">
              <p className="text-gray-700 leading-relaxed mb-6">
                We retain your personal information only as long as necessary to provide our services and fulfill the purposes 
                outlined in this Privacy Policy. When we no longer need your information, we will securely delete or anonymize it.
              </p>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Retention Periods</h4>
              <ul className="text-gray-700 space-y-2">
                <li><strong className="text-gray-900">Account Information:</strong> Retained for the duration of your account plus 2 years</li>
                <li><strong className="text-gray-900">Payment Information:</strong> Retained for 7 years for tax and accounting purposes</li>
                <li><strong className="text-gray-900">Support Communications:</strong> Retained for 3 years</li>
                <li><strong className="text-gray-900">Usage Logs:</strong> Retained for 1 year</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-lg bg-white">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
              <CardTitle className="text-gray-900">9. International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                Aryan Tech Solution  operates globally and may transfer your personal information to countries other than your own. 
                We ensure that all international transfers comply with applicable data protection laws and implement appropriate 
                safeguards.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We use standard contractual clauses approved by relevant authorities and work only with service providers 
                that maintain adequate data protection standards.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-lg bg-white">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50">
              <CardTitle className="text-gray-900">10. Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none p-6">
              <p className="text-gray-700 leading-relaxed">
                Our services are not directed to children under 13 years of age. We do not knowingly collect personal 
                information from children under 13. If we become aware that we have collected personal information from 
                a child under 13, we will take steps to delete such information.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-lg bg-white">
            <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50">
              <CardTitle className="text-gray-900">11. Changes to This Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
                Privacy Policy on this page and updating the "Last Updated" date.
              </p>
              <p className="text-gray-700 leading-relaxed">
                For significant changes, we will provide additional notice, such as sending an email notification or 
                displaying a prominent notice on our website.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-lg bg-white">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50">
              <CardTitle className="text-gray-900">12. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us:
              </p>
              <ul className="text-gray-700 space-y-2">
                <li><strong className="text-gray-900">Email:</strong> raghavlove305@gamil.com</li>
                <li><strong className="text-gray-900">Support:</strong> raghavlove305@gamil.com</li>
                <li><strong className="text-gray-900">Discord:</strong> https://discord.gg/SSVg6QrG28</li>
                <li><strong className="text-gray-900">Mail:</strong> Aryan Tech Solution Privacy Officer, Aryan Tech Solution  Headquarters</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex space-x-6">
              <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                Terms of Service
              </Link>
              <Link href="/careers" className="text-blue-600 hover:text-blue-700 font-medium">
                Careers
              </Link>
              <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-medium">
                Contact Us
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              © 2025 Aryan tech Solution . All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
