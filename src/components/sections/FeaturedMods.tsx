'use client'

import { motion } from 'framer-motion'
import { Star, Download, Eye, Calendar, Play } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const featuredMods = [
  {
    id: 1,
    name: "Super Harvester 2025",
    description: "The most advanced harvester with realistic physics and improved efficiency.",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=300&fit=crop",
    downloads: 15420,
    rating: 4.9,
    category: "Vehicles",
    version: "FS25",
    date: "2024-12-15",
    hasVideo: true,
    modType: "paid",
    price: 4.99
  },
  {
    id: 2,
    name: "Mega Farm Pack",
    description: "Complete farming solution with 50+ vehicles and tools.",
    image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&h=300&fit=crop",
    downloads: 23150,
    rating: 4.8,
    category: "Pack",
    version: "FS22",
    date: "2024-12-10",
    hasVideo: true,
    modType: "free"
  },
  {
    id: 3,
    name: "Realistic Weather System",
    description: "Dynamic weather patterns that affect gameplay and crop yields.",
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop",
    downloads: 8750,
    rating: 4.7,
    category: "Maps",
    version: "FS25",
    date: "2024-12-12",
    hasVideo: false,
    modType: "code"
  }
]

export default function FeaturedMods() {
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
            <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
              Featured Mods
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Handpicked premium mods that will transform your farming experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredMods.map((mod, index) => (
            <Link key={mod.id} href={`/mods/${mod.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="gaming-card rounded-xl overflow-hidden hover-glow transition-all duration-300 group cursor-pointer"
              >
              <div className="relative overflow-hidden">
                <div className="relative w-full h-48 overflow-hidden">
                  <img
                    src={mod.image}
                    alt={mod.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    mod.version === 'FS25' 
                      ? 'bg-gradient-to-r from-neon-green to-neon-blue text-white' 
                      : 'bg-gradient-to-r from-neon-purple to-neon-pink text-white'
                  }`}>
                    {mod.version}
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 bg-gaming-dark/80 backdrop-blur-sm rounded-full text-xs text-white">
                    {mod.category}
                  </span>
                </div>
                
                {/* Video Indicator */}
                {mod.hasVideo && (
                  <div className="absolute bottom-2 right-2">
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                      <Play className="h-4 w-4 text-white fill-current ml-0.5" />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-neon-blue transition-colors">
                  {mod.name}
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  {mod.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold">{mod.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Download className="h-4 w-4" />
                    <span className="text-sm">{mod.downloads.toLocaleString()}</span>
                  </div>
                </div>

                {/* Mod Type Badge */}
                <div className="mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    mod.modType === 'free' 
                      ? 'bg-gradient-to-r from-neon-green to-emerald-400 text-white' 
                      : mod.modType === 'paid'
                      ? 'bg-gradient-to-r from-neon-orange to-yellow-400 text-white'
                      : 'bg-gradient-to-r from-neon-purple to-neon-pink text-white'
                  }`}>
                    {mod.modType === 'free' ? 'FREE' : mod.modType === 'paid' ? `$${mod.price}` : 'UNLOCK CODE'}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(mod.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-3 w-3" />
                    <span>View Details</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg text-white font-semibold hover-glow transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Now</span>
                </motion.button>
              </div>
            </motion.div>
            </Link>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/mods">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 gaming-card neon-border rounded-lg font-semibold text-lg hover-glow transition-all duration-300 text-white"
            >
              View All Mods
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
