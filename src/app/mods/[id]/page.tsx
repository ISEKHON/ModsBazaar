'use client'

import { motion } from 'framer-motion'
import { useState, use } from 'react'
import { Star, Download, Eye, Calendar, Heart, Share2, Flag, User, Tag, Clock, FileText, ImageIcon, ArrowLeft, ExternalLink, Play, Shield, MessageSquare, Unlock } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

// Mock data - in real app, this would come from API based on the ID
const getModById = (id: string) => {
  const mods = [
    {
      id: 1,
      name: "Super Harvester 2025",
      description: "The most advanced harvester with realistic physics and improved efficiency. This mod brings cutting-edge technology to your farming operation with enhanced crop processing, realistic engine sounds, and improved fuel efficiency.",
      fullDescription: `
        The Super Harvester 2025 represents the pinnacle of agricultural technology in Farming Simulator. This comprehensive mod completely overhauls the harvesting experience with:
        
        **Key Features:**
        - Realistic physics engine with weight distribution
        - Advanced crop processing algorithms
        - Dynamic weather response system
        - Fuel efficiency optimization
        - Enhanced visual effects and particle systems
        - Custom sound design with real engine recordings
        
        **Technical Specifications:**
        - Working width: 12.5 meters
        - Tank capacity: 14,000 liters
        - Power requirement: 450 HP minimum
        - Compatible with all base game crops
        
        **Installation Instructions:**
        1. Download the mod file
        2. Extract to your mods folder
        3. Activate in the mod hub
        4. Restart the game
        
        **Known Issues:**
        - Minor texture flickering in rain (will be fixed in v1.1)
        - Console versions may experience slight performance impact
      `,
      images: [
        "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1560493676-04071c5f467c?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=600&fit=crop"
      ],
      youtubeVideo: "dQw4w9WgXcQ", // Optional YouTube video ID (demo video)
      hasVideo: true,
      downloads: 15420,
      rating: 4.9,
      totalRatings: 1247,
      category: "Vehicles",
      version: "FS25",
      date: "2024-12-15",
      author: "ModMaster",
      authorAvatar: "MM",
      modType: "paid", // New field: "free", "paid", "code"
      price: 4.99, // Price for paid mods
      unlockCode: null, // Code for unlock-with-code mods
      fileSize: "125 MB",
      lastUpdated: "2024-12-18",
      changelog: `
        **Version 1.0.2 (Latest)**
        - Fixed texture issues in multiplayer
        - Improved performance on older hardware
        - Added support for precision farming DLC
        
        **Version 1.0.1**
        - Fixed compatibility with other vehicle mods
        - Reduced file size by 20%
        
        **Version 1.0.0**
        - Initial release
      `,
      tags: ["Realistic", "High-Quality", "Multiplayer", "Performance", "Enhanced"],
      requirements: "Farming Simulator 25",
      compatibility: "Windows"
    },
    {
      id: 2,
      name: "Mega Farm Pack",
      description: "Complete farming solution with 50+ vehicles and tools.",
      fullDescription: "Comprehensive farming pack with everything you need for modern agriculture...",
      images: [
        "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop"
      ],
      youtubeVideo: "jNQXAC9IVRw", // Different demo video
      hasVideo: true,
      downloads: 23150,
      rating: 4.8,
      totalRatings: 892,
      category: "Tools",
      version: "FS22",
      date: "2024-12-10",
      author: "FarmPro",
      authorAvatar: "FP",
      modType: "free", // Free mod
      price: null,
      unlockCode: null,
      fileSize: "89 MB",
      lastUpdated: "2024-12-12",
      changelog: "Version 1.5.0 - Added new vehicles and fixed bugs",
      tags: ["Pack", "Vehicles", "Tools", "Complete"],
      requirements: "Farming Simulator 22, 3GB RAM",
      compatibility: "Windows, Mac, PlayStation, Xbox"
    },
    {
      id: 3,
      name: "Realistic Weather System",
      description: "Dynamic weather patterns that affect gameplay and crop yields.",
      fullDescription: "Advanced weather simulation system...",
      images: [
        "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1419833479618-c595710e6ec3?w=800&h=600&fit=crop"
      ],
      hasVideo: false, // No video for this mod
      downloads: 8750,
      rating: 4.7,
      totalRatings: 445,
      category: "Maps",
      version: "FS25",
      date: "2024-12-12",
      author: "WeatherWorks",
      authorAvatar: "WW",
      modType: "code", // Unlock with code
      price: null,
      unlockCode: "WEATHER2025",
      fileSize: "45 MB",
      lastUpdated: "2024-12-14",
      changelog: "Version 2.1.0 - Improved rain effects",
      tags: ["Weather", "Realistic", "Gameplay"],
      requirements: "Farming Simulator 25, 2GB RAM",
      compatibility: "Windows, Mac"
    }
  ]
  
  return mods.find(mod => mod.id === parseInt(id)) || mods[0]
}

export default function ModPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('description')
  const [isLiked, setIsLiked] = useState(false)
  const [showUnlockModal, setShowUnlockModal] = useState(false)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [enteredCode, setEnteredCode] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [codeError, setCodeError] = useState('')
  
  const mod = getModById(resolvedParams.id)

  const handleUnlockCode = () => {
    if (enteredCode.trim().toUpperCase() === mod.unlockCode) {
      setIsUnlocked(true)
      setShowUnlockModal(false)
      setCodeError('')
      setEnteredCode('')
    } else {
      setCodeError('Invalid unlock code. Please try again.')
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-16">
        {/* Back Button */}
        <section className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Link href="/mods" className="inline-flex items-center space-x-2 text-neon-blue hover:text-neon-purple transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to All Mods</span>
            </Link>
          </div>
        </section>

        {/* Mod Header */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Media Gallery */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-4"
              >
                {/* Main Media Display */}
                <div className="gaming-card rounded-xl overflow-hidden group">
                  <div className="relative overflow-hidden">
                    {/* YouTube Video or Image Display */}
                    {activeImageIndex === 0 && mod.hasVideo && mod.youtubeVideo ? (
                      <div className="relative w-full h-96">
                        <iframe
                          src={`https://www.youtube.com/embed/${mod.youtubeVideo}?autoplay=0&rel=0&modestbranding=1`}
                          title={`${mod.name} Preview Video`}
                          className="w-full h-full"
                          frameBorder="0"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                      </div>
                    ) : (
                      <div className="relative w-full h-96 overflow-hidden">
                        <img
                          src={mod.images[mod.hasVideo ? activeImageIndex - 1 : activeImageIndex]}
                          alt={mod.name}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                      </div>
                    )}
                    
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        mod.version === 'FS25' 
                          ? 'bg-gradient-to-r from-neon-green to-neon-blue text-white' 
                          : 'bg-gradient-to-r from-neon-purple to-neon-pink text-white'
                      }`}>
                        {mod.version}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-gaming-dark/80 backdrop-blur-sm rounded-full text-sm text-white">
                        {mod.category}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Thumbnail Navigation - Outside the card */}
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {/* Video Thumbnail (if video exists) */}
                  {mod.hasVideo && mod.youtubeVideo && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveImageIndex(0)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 relative ${
                        activeImageIndex === 0 
                          ? 'border-neon-blue shadow-lg shadow-neon-blue/30' 
                          : 'border-gaming-border hover:border-neon-purple'
                      }`}
                    >
                      <img
                        src={`https://img.youtube.com/vi/${mod.youtubeVideo}/mqdefault.jpg`}
                        alt="Video Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                          <Play className="h-3 w-3 text-white fill-current ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute top-1 left-1">
                        <span className="px-1.5 py-0.5 bg-red-600 text-white text-xs rounded font-semibold">
                          VIDEO
                        </span>
                      </div>
                    </motion.button>
                  )}
                  
                  {/* Image Thumbnails */}
                  {mod.images.map((image, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveImageIndex(mod.hasVideo ? index + 1 : index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        activeImageIndex === (mod.hasVideo ? index + 1 : index)
                          ? 'border-neon-blue shadow-lg shadow-neon-blue/30' 
                          : 'border-gaming-border hover:border-neon-purple'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${mod.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 right-1">
                        <span className="w-5 h-5 bg-gaming-dark/80 backdrop-blur-sm rounded-full text-white text-xs flex items-center justify-center font-semibold">
                          {index + 1}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Mod Info */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-4xl font-gaming font-bold mb-4">
                    <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                      {mod.name}
                    </span>
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    {mod.description}
                  </p>
                </div>

                {/* Author & Stats */}
                <div className="gaming-card p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-neon-purple to-neon-blue rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{mod.authorAvatar}</span>
                      </div>
                      <div>
                        <p className="font-semibold">{mod.author}</p>
                        <p className="text-sm text-muted-foreground">Mod Creator</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="text-lg font-bold">{mod.rating}</span>
                        <span className="text-sm text-muted-foreground">({mod.totalRatings})</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neon-blue">{mod.downloads.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Downloads</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neon-green">{mod.fileSize}</div>
                      <div className="text-sm text-muted-foreground">File Size</div>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Released:</span>
                      <span>{new Date(mod.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span>{new Date(mod.lastUpdated).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Compatibility:</span>
                      <span>{mod.compatibility}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Access Type:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        mod.modType === 'free' 
                          ? 'bg-gradient-to-r from-neon-green to-emerald-400 text-white' 
                          : mod.modType === 'paid'
                          ? 'bg-gradient-to-r from-neon-orange to-yellow-400 text-white'
                          : 'bg-gradient-to-r from-neon-purple to-neon-pink text-white'
                      }`}>
                        {mod.modType === 'free' ? 'FREE' : mod.modType === 'paid' ? `$${mod.price}` : 'UNLOCK CODE'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mod Type Info Card */}
                {mod.modType !== 'free' && (
                  <div className={`gaming-card p-4 rounded-xl border-2 ${
                    mod.modType === 'paid' 
                      ? 'border-neon-orange/50 bg-gradient-to-br from-neon-orange/5 to-transparent' 
                      : 'border-neon-purple/50 bg-gradient-to-br from-neon-purple/5 to-transparent'
                  }`}>
                    {mod.modType === 'paid' ? (
                      <div className="text-center">
                        <h4 className="font-bold text-neon-orange mb-2 flex items-center justify-center gap-2">
                          <Download className="h-5 w-5" />
                          Premium Mod
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          This is a premium mod with advanced features and enhanced quality.
                        </p>
                        <p className="text-lg font-bold text-neon-orange">${mod.price}</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <h4 className="font-bold text-neon-purple mb-2 flex items-center justify-center gap-2">
                          <Unlock className="h-5 w-5" />
                          Code Required
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Enter the unlock code to access this exclusive mod.
                        </p>
                        <p className="text-xs text-muted-foreground">Contact us for the unlock code</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {mod.modType === 'free' ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-4 bg-gradient-to-r from-neon-green to-emerald-400 rounded-lg text-white font-bold text-lg hover-glow transition-all duration-300 flex items-center justify-center space-x-3"
                    >
                      <Download className="h-6 w-6" />
                      <span>Download Free</span>
                    </motion.button>
                  ) : mod.modType === 'paid' ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowPurchaseModal(true)}
                      className="flex-1 py-4 bg-gradient-to-r from-neon-orange to-yellow-400 rounded-lg text-white font-bold text-lg hover-glow transition-all duration-300 flex items-center justify-center space-x-3"
                    >
                      <Download className="h-6 w-6" />
                      <span>Buy for ${mod.price}</span>
                    </motion.button>
                  ) : (
                    // Show download button if already unlocked, otherwise show unlock button
                    isUnlocked ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-4 bg-gradient-to-r from-neon-green to-emerald-400 rounded-lg text-white font-bold text-lg hover-glow transition-all duration-300 flex items-center justify-center space-x-3"
                      >
                        <Download className="h-6 w-6" />
                        <span>Download Unlocked</span>
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowUnlockModal(true)}
                        className="flex-1 py-4 bg-gradient-to-r from-neon-purple to-neon-pink rounded-lg text-white font-bold text-lg hover-glow transition-all duration-300 flex items-center justify-center space-x-3"
                      >
                        <Unlock className="h-6 w-6" />
                        <span>Enter Code</span>
                      </motion.button>
                    )
                  )}
                  
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsLiked(!isLiked)}
                      className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                        isLiked 
                          ? 'border-red-500 text-red-500 bg-red-500/10' 
                          : 'border-gaming-border hover:border-neon-blue'
                      }`}
                    >
                      <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-4 rounded-lg border-2 border-gaming-border hover:border-neon-blue transition-all duration-300"
                    >
                      <Share2 className="h-6 w-6" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-4 rounded-lg border-2 border-gaming-border hover:border-red-500 transition-all duration-300"
                    >
                      <Flag className="h-6 w-6" />
                    </motion.button>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {mod.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gaming-card border border-gaming-border rounded-full text-sm hover:border-neon-blue transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Detailed Information Tabs */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="gaming-card rounded-xl overflow-hidden">
              {/* Tab Navigation */}
              <div className="flex border-b border-gaming-border">
                {[
                  { id: 'description', label: 'Description', icon: FileText },
                  { id: 'changelog', label: 'Changelog', icon: Clock },
                  { id: 'requirements', label: 'Requirements', icon: Tag }
                ].map((tab) => {
                  const IconComponent = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-colors ${
                        activeTab === tab.id
                          ? 'text-neon-blue border-b-2 border-neon-blue'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {activeTab === 'description' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="prose prose-invert max-w-none">
                      <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
                        {mod.fullDescription}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'changelog' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
                      {mod.changelog}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'requirements' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <div>
                      <h4 className="text-lg font-semibold mb-3">System Requirements</h4>
                      <p className="text-muted-foreground">{mod.requirements}</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-3">Platform Compatibility</h4>
                      <p className="text-muted-foreground">{mod.compatibility}</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-3">Installation Size</h4>
                      <p className="text-muted-foreground">{mod.fileSize} when extracted</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Related Mods */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">
              <span className="bg-gradient-to-r from-neon-green to-neon-blue bg-clip-text text-transparent">
                Related Mods
              </span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Related mods would be loaded here */}
              <div className="gaming-card p-6 rounded-xl text-center">
                <p className="text-muted-foreground">Loading related mods...</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Unlock Code Modal */}
      {showUnlockModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="gaming-card p-8 rounded-xl max-w-md w-full mx-4"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-neon-purple to-neon-pink rounded-full mx-auto mb-4 flex items-center justify-center">
                <Unlock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Enter Unlock Code</h3>
              <p className="text-muted-foreground">
                Enter the unlock code for "{mod.name}"
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={enteredCode}
                  onChange={(e) => {
                    setEnteredCode(e.target.value.toUpperCase())
                    setCodeError('')
                  }}
                  placeholder="Enter unlock code..."
                  className="w-full px-4 py-3 bg-gaming-darker border border-gaming-border rounded-lg text-center text-lg font-mono tracking-widest focus:outline-none focus:border-neon-purple transition-colors uppercase"
                  maxLength={20}
                />
                {codeError && (
                  <p className="text-red-400 text-sm mt-2 text-center">{codeError}</p>
                )}
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowUnlockModal(false)
                    setEnteredCode('')
                    setCodeError('')
                  }}
                  className="flex-1 py-3 bg-gaming-border rounded-lg text-white font-semibold hover:bg-gaming-border/80 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUnlockCode}
                  disabled={!enteredCode.trim()}
                  className="flex-1 py-3 bg-gradient-to-r from-neon-purple to-neon-pink rounded-lg text-white font-semibold hover-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Unlock
                </motion.button>
              </div>

              <div className="text-center pt-4 border-t border-gaming-border">
                <p className="text-xs text-muted-foreground mb-2">
                  Don't have an unlock code?
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open('https://discord.gg/GcaakuhbVk', '_blank')}
                  className="text-neon-blue hover:text-neon-purple transition-colors text-sm font-semibold"
                >
                  Contact us for access
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="gaming-card p-8 rounded-xl max-w-md w-full mx-4"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-neon-orange to-yellow-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Safe Purchase</h3>
              <p className="text-muted-foreground mb-4">
                Contact our admin team for secure payment
              </p>
              
              <div className="bg-gradient-to-r from-neon-orange/10 to-yellow-400/10 border border-neon-orange/30 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-left">{mod.name}</h4>
                    <p className="text-sm text-muted-foreground text-left">Premium mod</p>
                  </div>
                  <p className="text-2xl font-bold text-neon-orange">${mod.price}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowPurchaseModal(false)}
                className="flex-1 py-3 bg-gaming-border rounded-lg text-white font-semibold hover:bg-gaming-border/80 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  window.open('https://discord.gg/GcaakuhbVk', '_blank')
                  setShowPurchaseModal(false)
                }}
                className="flex-1 py-3 bg-gradient-to-r from-neon-orange to-yellow-400 rounded-lg text-white font-semibold hover-glow transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Contact Admin</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  )
}
