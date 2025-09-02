'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Menu, X, Download, Gamepad2, User, LogIn } from 'lucide-react'
import Link from 'next/link'
import ThemeToggle from '@/components/ui/ThemeToggle'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Mods', href: '/mods' },
    { name: 'Categories', href: '/categories' },
    { name: 'Submit Mod', href: '/submit' },
    { name: 'About', href: '/about' },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 gaming-card border-b border-gaming-border backdrop-blur-lg"
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
              <Link href="/login">
                <button className="w-full flex items-center space-x-2 px-4 py-2 gaming-card border border-gaming-border rounded-lg font-medium hover:border-neon-blue transition-colors">
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </button>
              </Link>
              <Link href="/register">
                <button className="w-full flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg text-white font-medium">
                  <User className="h-4 w-4" />
                  <span>Sign Up</span>
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
