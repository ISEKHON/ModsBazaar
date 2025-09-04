'use client'

import { motion } from 'framer-motion'
import { MessageCircle, Star, Zap, Shield, DollarSign, Gift, ExternalLink, Upload } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function SubmitPage() {
  const handleDiscordClick = () => {
    window.open('https://discord.gg/GcaakuhbVk', '_blank')
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-16">
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl md:text-6xl font-gaming font-bold mb-6">
                <span className="bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent">
                  Get Your Mod Listed
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Want your mod featured on ModsBazaar? Contact our admin team directly on Discord for fast approval and listing.
              </p>
            </motion.div>

            {/* Submit Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid md:grid-cols-2 gap-8 mb-12"
            >
              {/* Online Submission */}
              <div className="gaming-card p-8 rounded-xl border-2 border-neon-blue/30 bg-gradient-to-br from-neon-blue/5 to-transparent">
                <div className="w-16 h-16 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full mb-6 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-neon-blue">Submit Online</h3>
                <p className="text-muted-foreground mb-6">
                  Use our new online submission form to submit your mod directly through the website. Fast, easy, and automated!
                </p>
                
                <ul className="space-y-3 text-sm mb-6">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-neon-blue rounded-full"></div>
                    <span>Direct online submission</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-neon-blue rounded-full"></div>
                    <span>Automated review process</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-neon-blue rounded-full"></div>
                    <span>Real-time status tracking</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-neon-blue rounded-full"></div>
                    <span>Instant notifications</span>
                  </li>
                </ul>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/submit-mod'}
                  className="w-full px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg text-white font-bold hover-glow transition-all duration-300"
                >
                  Submit Mod Online
                </motion.button>
              </div>

              {/* Discord Contact */}
              <div className="gaming-card p-8 rounded-xl border-2 border-neon-green/30 bg-gradient-to-br from-neon-green/5 to-transparent">
                <div className="w-16 h-16 bg-gradient-to-r from-neon-green to-emerald-400 rounded-full mb-6 flex items-center justify-center">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-neon-green">Contact Admin</h3>
                <p className="text-muted-foreground mb-6">
                  Prefer personal assistance? Contact our admin team directly on Discord for manual review and listing.
                </p>
                
                <ul className="space-y-3 text-sm mb-6">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                    <span>Personal assistance</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                    <span>Direct admin contact</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                    <span>Custom requirements</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                    <span>Special cases support</span>
                  </li>
                </ul>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDiscordClick}
                  className="w-full px-6 py-3 bg-gradient-to-r from-neon-green to-emerald-400 rounded-lg text-white font-bold hover-glow transition-all duration-300"
                >
                  Contact on Discord
                </motion.button>
              </div>
            </motion.div>

            {/* Listing Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid md:grid-cols-2 gap-8 mb-12"
            >
              {/* Free Listing */}
              <div className="gaming-card p-8 rounded-xl border-2 border-neon-green/30 bg-gradient-to-br from-neon-green/5 to-transparent">
                <div className="w-16 h-16 bg-gradient-to-r from-neon-green to-emerald-400 rounded-full mb-6 flex items-center justify-center">
                  <Gift className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-neon-green">Free Listing</h3>
                <p className="text-muted-foreground mb-6">
                  Get your mod listed for free! Perfect for sharing your creations with the community and building your reputation.
                </p>
                
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                    <span>Free download for all users</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                    <span>Featured in categories</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                    <span>Community ratings & reviews</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                    <span>Fast approval process</span>
                  </li>
                </ul>
              </div>

              {/* Paid Listing */}
              <div className="gaming-card p-8 rounded-xl border-2 border-neon-orange/30 bg-gradient-to-br from-neon-orange/5 to-transparent">
                <div className="w-16 h-16 bg-gradient-to-r from-neon-orange to-yellow-400 rounded-full mb-6 flex items-center justify-center">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-neon-orange">Premium Listing</h3>
                <p className="text-muted-foreground mb-6">
                  Monetize your high-quality mods! Set your own price and earn from your creative work with secure payment handling.
                </p>
                
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-neon-orange rounded-full"></div>
                    <span>Set your own price</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-neon-orange rounded-full"></div>
                    <span>Secure payment processing</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-neon-orange rounded-full"></div>
                    <span>Priority featured placement</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-neon-orange rounded-full"></div>
                    <span>Revenue sharing</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Requirements & Guidelines */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="gaming-card p-8 rounded-xl mb-12"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="h-8 w-8 text-neon-blue" />
                <h3 className="text-2xl font-bold">Submission Requirements</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-neon-purple">What to Prepare:</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Your mod file (.zip format)</li>
                    <li>• High-quality screenshots (4-6 images)</li>
                    <li>• Detailed description</li>
                    <li>• Compatibility information</li>
                    <li>• Installation instructions</li>
                    <li>• Your contact information</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-neon-green">Quality Standards:</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Compatible with FS22/FS25</li>
                    <li>• No malicious code or viruses</li>
                    <li>• Original content or proper credits</li>
                    <li>• Working functionality</li>
                    <li>• Clear, helpful description</li>
                    <li>• Professional presentation</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Process Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="gaming-card p-8 rounded-xl mb-12"
            >
              <h3 className="text-2xl font-bold mb-8 text-center">
                <span className="bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent">
                  How It Works
                </span>
              </h3>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-xl">
                    1
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Join Discord</h4>
                  <p className="text-muted-foreground text-sm">
                    Click the button above to join our Discord server and find the admin team.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-neon-purple to-neon-pink rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-xl">
                    2
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Share Your Mod</h4>
                  <p className="text-muted-foreground text-sm">
                    Send your mod details, files, and specify if you want free or paid listing.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-neon-pink to-neon-orange rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-xl">
                    3
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Get Listed</h4>
                  <p className="text-muted-foreground text-sm">
                    We'll review and list your mod quickly, usually within 24-48 hours.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="text-center"
            >
              <div className="gaming-card p-8 rounded-xl bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 border border-neon-blue/30">
                <h3 className="text-2xl font-bold mb-4">Ready to Share Your Mod?</h3>
                <p className="text-muted-foreground mb-6">
                  Join thousands of creators in our community and get your mod featured today!
                </p>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDiscordClick}
                  className="inline-flex items-center space-x-3 px-10 py-4 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg text-white font-bold text-xl hover-glow transition-all duration-300"
                >
                  <MessageCircle className="h-7 w-7" />
                  <span>Contact Admin Now</span>
                  <Zap className="h-6 w-6" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
          