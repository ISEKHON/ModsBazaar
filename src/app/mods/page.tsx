'use client'

import { motion } from 'framer-motion'
import { Star, Download, Eye, Calendar, Search, Filter, Play } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const allMods = [
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
    author: "ModMaster",
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
    category: "Tools",
    version: "FS22",
    date: "2024-12-10",
    author: "FarmPro",
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
    author: "WeatherWorks",
    hasVideo: false,
    modType: "code"
  },
  {
    id: 4,
    name: "Auto Helper Script",
    description: "Automated farming assistant for repetitive tasks.",
    image: "https://images.unsplash.com/photo-1581594549595-35f6edc7b762?w=400&h=300&fit=crop",
    downloads: 12300,
    rating: 4.6,
    category: "Scripts",
    version: "FS25",
    date: "2024-12-08",
    author: "ScriptGuru",
    hasVideo: true,
    modType: "free"
  },
  {
    id: 5,
    name: "Alpine Valley Map",
    description: "Beautiful mountain farming terrain with challenges.",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=300&fit=crop",
    downloads: 6890,
    rating: 4.5,
    category: "Maps",
    version: "FS25",
    date: "2024-12-05",
    author: "MapCrafter",
    hasVideo: false
  },
  {
    id: 6,
    name: "Premium Tractor Collection",
    description: "High-quality tractors with realistic sounds and physics.",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
    downloads: 18750,
    rating: 4.8,
    category: "Vehicles",
    version: "FS22",
    date: "2024-12-03",
    author: "TractorPro",
    hasVideo: true
  }
]

export default function ModsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl md:text-6xl font-gaming font-bold mb-6">
                <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                  All Mods
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Discover our complete collection of high-quality mods for Farming Simulator 22/25
              </p>
            </motion.div>

            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col md:flex-row gap-4 mb-12"
            >
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search mods..."
                  className="w-full pl-10 pr-4 py-3 bg-gaming-card border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
                />
              </div>
              <select className="px-4 py-3 bg-gaming-card border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors">
                <option>All Categories</option>
                <option>Vehicles</option>
                <option>Tools</option>
                <option>Maps</option>
                <option>Scripts</option>
              </select>
              <select className="px-4 py-3 bg-gaming-card border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors">
                <option>All Versions</option>
                <option>FS25</option>
                <option>FS22</option>
              </select>
            </motion.div>

            {/* Mods Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allMods.map((mod, index) => (
                <Link key={mod.id} href={`/mods/${mod.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
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
                    <p className="text-muted-foreground mb-3 text-sm">
                      {mod.description}
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      by {mod.author}
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

            {/* Load More */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-center mt-12"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 gaming-card neon-border rounded-lg font-semibold text-lg hover-glow transition-all duration-300 text-white"
              >
                Load More Mods
              </motion.button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
