import React from "react"
import Link from "next/link"
import { Mail, Phone, MessageCircle, Instagram } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <img src="/logo.svg" alt="Aryan Tech Solution" className="h-8 w-8 mr-2" />
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Aryan Tech Solution
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              Premium hosting & tech solutions for the next generation. Reliable, secure, and scalable. Your trusted partner in innovation.
            </p>
            <div className="flex space-x-4">
              <a
                href="tel:+918824187767"
                className="text-gray-300 hover:text-blue-400 transition-colors"
                aria-label="Phone"
              >
                <Phone className="h-5 w-5" />
              </a>
              <a
                href="mailto:raghavlove305@gmail.com"
                className="text-gray-300 hover:text-blue-400 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="https://t.me/aryan_devloper"
                className="text-gray-300 hover:text-blue-400 transition-colors"
                aria-label="Telegram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/aryantechsolution"
                className="text-gray-300 hover:text-blue-400 transition-colors"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services/hosting" className="text-gray-300 hover:text-blue-400 transition-colors">
                  VPS Hosting
                </Link>
              </li>
              <li>
                <Link href="/services/domains" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Domain Registration
                </Link>
              </li>
              <li>
                <Link href="/services/minecraft" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Minecraft Hosting
                </Link>
              </li>
              <li>
                <Link href="/services/bots" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Bot Development
                </Link>
              </li>
              <li>
                <Link href="/services/custom" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Custom Development
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-blue-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/support" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Aryan Tech Solution. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">
              Founded by Aryan Thakur | Trusted by developers worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
