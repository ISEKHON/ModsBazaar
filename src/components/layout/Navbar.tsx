'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, Download, Gamepad2, User, LogIn, LogOut, Settings } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import ThemeToggle from '@/components/ui/ThemeToggle'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { user, isAuthenticated, isLoading, logout } = useAuth()

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Mods', href: '/mods' },
    { name: 'Categories', href: '/categories' },
    { name: 'Submit Mod', href: '/submit-mod' },
    { name: 'About', href: '/about' },
  ]

  const handleLogout = async () => {
    try {
      await logout()
      setShowUserMenu(false)
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-gaming-border shadow-lg"
      style={{ margin: 0, padding: 0, position: 'fixed', top: 0 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <Gamepad2 className="h-8 w-8 text-neon-blue" />
            <span className="text-2xl font-gaming font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
              ModsBazaar
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <motion.div
                  key={item.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={item.href}
                    className="text-foreground hover:text-neon-blue px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover-glow"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            ) : isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-4 py-2 gaming-card border border-gaming-border rounded-lg font-medium hover:border-neon-green transition-colors"
                >
                  <div className="w-6 h-6 bg-gradient-to-r from-neon-green to-neon-blue rounded-full flex items-center justify-center">
                    <User className="h-3 w-3 text-black" />
                  </div>
                  <span>{user.username}</span>
                </motion.button>

                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 gaming-card border border-gaming-border rounded-lg shadow-lg z-50"
                  >
                    <div className="p-2">
                      <Link href="/profile" onClick={() => setShowUserMenu(false)}>
                        <div className="flex items-center space-x-2 px-3 py-2 hover:bg-gaming-darker rounded-lg transition-colors">
                          <User className="h-4 w-4" />
                          <span>Profile</span>
                        </div>
                      </Link>
                      <Link href="/settings" onClick={() => setShowUserMenu(false)}>
                        <div className="flex items-center space-x-2 px-3 py-2 hover:bg-gaming-darker rounded-lg transition-colors">
                          <Settings className="h-4 w-4" />
                          <span>Settings</span>
                        </div>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-4 py-2 gaming-card border border-gaming-border rounded-lg font-medium hover:border-neon-blue transition-colors"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </motion.button>
                </Link>
                
                <Link href="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg text-white font-medium hover-glow"
                  >
                    <User className="h-4 w-4" />
                    <span>Sign Up</span>
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg gaming-card"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden gaming-card border-t border-gaming-border"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-foreground hover:text-neon-blue block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col space-y-2 px-3 py-2">
              <div className="flex items-center space-x-2 mb-2">
                <ThemeToggle />
              </div>
              
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center space-x-2 px-3 py-2 gaming-card border border-gaming-border rounded-lg">
                    <div className="w-6 h-6 bg-gradient-to-r from-neon-green to-neon-blue rounded-full flex items-center justify-center">
                      <User className="h-3 w-3 text-black" />
                    </div>
                    <span className="font-medium">{user.username}</span>
                  </div>
                  <Link href="/profile" onClick={() => setIsOpen(false)}>
                    <button className="w-full flex items-center space-x-2 px-4 py-2 gaming-card border border-gaming-border rounded-lg font-medium hover:border-neon-green transition-colors">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </button>
                  </Link>
                  <Link href="/settings" onClick={() => setIsOpen(false)}>
                    <button className="w-full flex items-center space-x-2 px-4 py-2 gaming-card border border-gaming-border rounded-lg font-medium hover:border-neon-blue transition-colors">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsOpen(false)
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg font-medium transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <button className="w-full flex items-center space-x-2 px-4 py-2 gaming-card border border-gaming-border rounded-lg font-medium hover:border-neon-blue transition-colors">
                      <LogIn className="h-4 w-4" />
                      <span>Sign In</span>
                    </button>
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    <button className="w-full flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg text-white font-medium">
                      <User className="h-4 w-4" />
                      <span>Sign Up</span>
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
