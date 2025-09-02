'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Gamepad2, Github, Twitter, MessageCircle, Mail, Heart } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  const [isClient, setIsClient] = useState(false)
  const [particles, setParticles] = useState<Array<{id: number, startX: number, endX: number, delay: number, duration: number}>>([])

  useEffect(() => {
    setIsClient(true)
    // Generate particles only on client side to avoid hydration mismatch
    const particlesData = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      startX: Math.random() * 100,
      endX: Math.random() * 100,
      delay: Math.random() * 10,
      duration: Math.random() * 15 + 15
    }))
    setParticles(particlesData)
  }, [])
  const footerLinks = {
    'Quick Links': [
      { name: 'Browse Mods', href: '/mods' },
      { name: 'Categories', href: '/categories' },
      { name: 'Submit Mod', href: '/submit' },
      { name: 'About Us', href: '/about' },
    ],
    'Community': [
      { name: 'Discord Server', href: 'https://discord.gg/GcaakuhbVk' },
      { name: 'YouTube', href: '/youtube' },
    ]
  }

  const socialLinks = [
    { icon: Github, href: '#', color: 'text-gray-400' },
  ]

  return (
    <footer className="relative gaming-darker border-t border-gaming-border">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-r from-neon-purple/10 to-neon-green/10 rounded-full blur-xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Gamepad2 className="h-8 w-8 text-neon-blue" />
                </motion.div>
                <span className="text-2xl font-gaming font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                  ModsBazaar
                </span>
              </div>
              
              <p className="text-muted-foreground max-w-md">
                The ultimate destination for Farming Simulator mods. Lightning-fast downloads, 
                curated content, and a gaming-style experience that puts you first.
              </p>

              <div className="flex space-x-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      whileHover={{ scale: 1.2, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2 gaming-card rounded-lg hover-glow transition-all duration-300 ${social.color}`}
                    >
                      <IconComponent className="h-5 w-5" />
                    </motion.a>
                  )
                })}
              </div>
            </motion.div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links], sectionIndex) => (
            <div key={title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: sectionIndex * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold mb-4 text-neon-blue">{title}</h3>
                <ul className="space-y-2">
                  {links.map((link, index) => (
                    <motion.li 
                      key={index}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        href={link.href}
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-muted-foreground hover:text-neon-blue transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-gaming-border flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-muted-foreground text-sm">
            © 2024 ModsBazaar. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-1 text-sm text-muted-foreground mt-4 md:mt-0">
            <span>Made with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="h-4 w-4 text-red-500 fill-current" />
            </motion.div>
            <span>for the farming community</span>
          </div>
        </motion.div>
      </div>

      {/* Floating particles */}
      {isClient && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-neon-blue rounded-full"
              animate={{
                y: [window.innerHeight, -100],
                x: [particle.startX + '%', particle.endX + '%'],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
              }}
              style={{
                left: particle.startX + '%',
                top: '100%',
              }}
            />
          ))}
        </div>
      )}
    </footer>
  )
}
