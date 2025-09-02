'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Wrench, Clock, MessageCircle, Gamepad2, Zap } from 'lucide-react'
import { maintenanceConfig } from '@/config/maintenance'

export default function MaintenancePage() {
  const [isClient, setIsClient] = useState(false)
  const [particles, setParticles] = useState<Array<{id: number, startX: number, endX: number, delay: number, duration: number}>>([])

  useEffect(() => {
    setIsClient(true)
    // Generate particles only on client side to avoid hydration mismatch
    const particlesData = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      startX: Math.random() * 100,
      endX: Math.random() * 100,
      delay: Math.random() * 10,
      duration: Math.random() * 10 + 10
    }))
    setParticles(particlesData)
  }, [])

  const handleDiscordClick = () => {
    window.open(maintenanceConfig.contact.discord, '_blank')
  }

  return (
    <div className="min-h-screen bg-gaming-dark flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-neon-purple/20 to-neon-green/20 rounded-full blur-3xl"
        />
      </div>

      {/* Floating particles */}
      {isClient && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-2 h-2 bg-neon-blue rounded-full"
              animate={{
                y: [-100, window.innerHeight + 100],
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
                top: '-100px',
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="gaming-card p-12 rounded-2xl border border-gaming-border"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center space-x-3 mb-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Gamepad2 className="h-12 w-12 text-neon-blue" />
            </motion.div>
            <span className="text-3xl font-gaming font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
              ModsBazaar
            </span>
          </motion.div>

          {/* Maintenance Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-8"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-neon-orange to-yellow-400 rounded-full mx-auto flex items-center justify-center mb-6">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Wrench className="h-12 w-12 text-white" />
              </motion.div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-4xl font-bold mb-4"
          >
            <span className="bg-gradient-to-r from-neon-orange to-yellow-400 bg-clip-text text-transparent">
              {maintenanceConfig.message.title}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-xl text-neon-blue mb-6 font-semibold"
          >
            {maintenanceConfig.message.subtitle}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="text-lg text-muted-foreground mb-8 leading-relaxed"
          >
            {maintenanceConfig.message.description}
          </motion.p>

          {/* Estimated Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="bg-gradient-to-r from-neon-purple/10 to-neon-blue/10 border border-neon-purple/30 rounded-lg p-4 mb-8"
          >
            <div className="flex items-center justify-center space-x-2 text-neon-purple">
              <Clock className="h-5 w-5" />
              <span className="font-semibold">{maintenanceConfig.message.estimatedTime}</span>
            </div>
          </motion.div>

          {/* Discord Contact */}
          {maintenanceConfig.contact.showDiscord && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="space-y-4"
            >
              <p className="text-muted-foreground">
                Need immediate assistance or have questions?
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDiscordClick}
                className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg text-white font-semibold hover-glow transition-all duration-300"
              >
                <MessageCircle className="h-6 w-6" />
                <span>Join Our Discord</span>
              </motion.button>
            </motion.div>
          )}

          {/* Progress Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="mt-12"
          >
            <div className="flex items-center justify-center space-x-2 text-neon-green">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
              >
                <Zap className="h-4 w-4" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              >
                <Zap className="h-4 w-4" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              >
                <Zap className="h-4 w-4" />
              </motion.div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Working on improvements...
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
