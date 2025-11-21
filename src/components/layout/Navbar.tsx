"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import CurrencySelector from "@/components/ui/CurrencySelector"
import { Menu, X, ChevronDown, ShoppingCart, Heart, User, LogOut } from "lucide-react"
import { useAuth } from "@/components/providers/AuthProvider"
import { signOut } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const { user } = useAuth()

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Store", href: "/store" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ]

  // Fetch cart and wishlist counts
  useEffect(() => {
    if (user) {
      fetchCounts()
    } else {
      setCartCount(0)
      setWishlistCount(0)
    }
  }, [user])

  const fetchCounts = async () => {
    if (!user) return

    try {
      // Fetch cart count
      const cartQuery = query(collection(db, 'cart'), where('userId', '==', user.id))
      const cartSnapshot = await getDocs(cartQuery)
      setCartCount(cartSnapshot.size)

      // Fetch wishlist count
      const wishlistQuery = query(collection(db, 'wishlist'), where('userId', '==', user.id))
      const wishlistSnapshot = await getDocs(wishlistQuery)
      setWishlistCount(wishlistSnapshot.size)
    } catch (error) {
      console.error('Error fetching counts:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      setUserMenuOpen(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <div className="flex items-center">
                <img src="/logo.svg" alt="Aryan Tech Solution" className="h-8 w-8 mr-2" />
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Aryan Tech
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Currency Selector */}
            <CurrencySelector />
            
            {user ? (
              <>
                {/* Cart Icon */}
                <Link href="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* Wishlist Icon */}
                <Link href="/wishlist" className="relative p-2 text-gray-700 hover:text-red-500 transition-colors">
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span>{user.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/cart"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Cart ({cartCount})
                        </Link>
                        <Link
                          href="/wishlist"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Wishlist ({wishlistCount})
                        </Link>
                        {user.role === 'admin' && (
                          <Link
                            href="/admin"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Admin Panel
                          </Link>
                        )}
                        <div className="border-t border-gray-100">
                          <button
                            onClick={handleSignOut}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            <LogOut className="h-4 w-4 inline mr-2" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {user && (
              <>
                <Link
                  href="/cart"
                  className="text-gray-700 hover:text-blue-600 flex items-center px-3 py-2 text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Cart ({cartCount})
                </Link>
                <Link
                  href="/wishlist"
                  className="text-gray-700 hover:text-blue-600 flex items-center px-3 py-2 text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Wishlist ({wishlistCount})
                </Link>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
              </>
            )}
            
            {/* Mobile Currency Selector */}
            <div className="px-3 py-2">
              <CurrencySelector />
            </div>
            
            <div className="border-t pt-3 space-y-2">
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-gray-100 rounded"
                >
                  <LogOut className="h-5 w-5 inline mr-2" />
                  Sign Out
                </button>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                    <Button size="sm" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
