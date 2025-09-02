'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Upload, Send, FileText, Image, Package, CheckCircle } from 'lucide-react'

export default function SubmissionSection() {
  const [formData, setFormData] = useState({
    modName: '',
    description: '',
    category: '',
    version: '',
    email: '',
    discordTag: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-gaming font-bold mb-4">
            <span className="bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent">
              Submit Your Mod
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Share your amazing creations with the farming community. We'll review and feature the best mods.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Submission Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="gaming-card p-8 rounded-xl"
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center space-x-3">
              <Upload className="h-6 w-6 text-neon-blue" />
              <span>Submit Your Mod</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Mod Name</label>
                <input
                  type="text"
                  name="modName"
                  value={formData.modName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gaming-card border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
                  placeholder="Enter your mod name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-gaming-card border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors resize-none"
                  placeholder="Describe your mod and its features"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gaming-card border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="vehicles">Vehicles</option>
                    <option value="tools">Tools</option>
                    <option value="maps">Maps</option>
                    <option value="packs">Packs</option>
                    <option value="tractors">Tractors</option>
                    <option value="crops">Crops</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Game Version</label>
                  <select
                    name="version"
                    value={formData.version}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gaming-card border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
                    required
                  >
                    <option value="">Select Version</option>
                    <option value="fs25">FS25</option>
                    <option value="fs22">FS22</option>
                    <option value="both">Both FS22 & FS25</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gaming-card border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Discord Tag (Optional)</label>
                <input
                  type="text"
                  name="discordTag"
                  value={formData.discordTag}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gaming-card border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
                  placeholder="username#1234"
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitted}
                className="w-full py-4 bg-gradient-to-r from-neon-purple to-neon-pink rounded-lg text-white font-semibold hover-glow transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isSubmitted ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span>Submitted Successfully!</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Submit Mod</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Submission Guidelines */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="gaming-card p-6 rounded-xl">
              <h4 className="text-xl font-bold mb-4 flex items-center space-x-3">
                <FileText className="h-5 w-5 text-neon-green" />
                <span>Submission Guidelines</span>
              </h4>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-neon-blue rounded-full mt-2 flex-shrink-0" />
                  <span>Ensure your mod is original or properly credited</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-neon-blue rounded-full mt-2 flex-shrink-0" />
                  <span>Include clear screenshots and descriptions</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-neon-blue rounded-full mt-2 flex-shrink-0" />
                  <span>Test your mod thoroughly before submission</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-neon-blue rounded-full mt-2 flex-shrink-0" />
                  <span>Provide accurate version compatibility information</span>
                </li>
              </ul>
            </div>

            <div className="gaming-card p-6 rounded-xl">
              <h4 className="text-xl font-bold mb-4 flex items-center space-x-3">
                <Package className="h-5 w-5 text-neon-purple" />
                <span>What to Include</span>
              </h4>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start space-x-3">
                  <Image className="h-4 w-4 text-neon-green mt-1 flex-shrink-0" />
                  <span>High-quality screenshots (at least 3)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <FileText className="h-4 w-4 text-neon-green mt-1 flex-shrink-0" />
                  <span>Detailed mod description and features</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Package className="h-4 w-4 text-neon-green mt-1 flex-shrink-0" />
                  <span>Compressed mod file (.zip format)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-neon-green mt-1 flex-shrink-0" />
                  <span>Installation instructions if needed</span>
                </li>
              </ul>
            </div>

            <div className="gaming-card p-6 rounded-xl neon-border">
              <h4 className="text-xl font-bold mb-4 text-neon-blue">Review Process</h4>
              <p className="text-muted-foreground mb-4">
                Our team reviews all submissions within 24-48 hours. We'll contact you via email with the status update.
              </p>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse" />
                <span className="text-neon-green">Fast approval for quality mods</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
