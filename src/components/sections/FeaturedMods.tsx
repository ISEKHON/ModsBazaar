'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Download, Eye, Calendar, Play, Award, Flame } from 'lucide-react'
import Link from 'next/link'
import api from '@/lib/api'
import { toast } from 'sonner'

interface FeaturedMod {
  _id: string
  name: string
  slug: string
  shortDescription: string
  type: 'free' | 'paid' | 'unlock'
  price?: number
  thumbnail: string
  downloads: number
  rating: number
  game: 'FS22' | 'FS25' | 'Both'
  category: string
  isPopular?: boolean
  author: {
    id: {
      _id: string
      username: string
    }
  }
  videoUrl?: string
}

export default function FeaturedMods() {
  const [featuredMods, setFeaturedMods] = useState<FeaturedMod[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedMods = async () => {
      try {
        const response = await api.get('/mods/featured')
        
        if (response.data.status === 'success') {
          setFeaturedMods(response.data.data.mods || [])
        }
      } catch (error) {
        console.error('Failed to fetch featured mods:', error)
        toast.error('Failed to load featured mods')
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedMods()
  }, [])

  const formatPrice = (type: string, price?: number) => {
    if (type === 'free') return 'FREE'
    if (type === 'paid' && price) return `$${price.toFixed(2)}`
    if (type === 'unlock') return 'UNLOCK CODE'
    return 'FREE'
  }

  const getPriceColor = (type: string) => {
    if (type === 'free') return 'from-neon-green to-emerald-400'
    if (type === 'paid') return 'from-neon-orange to-yellow-400'
    if (type === 'unlock') return 'from-neon-purple to-neon-pink'
    return 'from-neon-green to-emerald-400'
  }

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-gaming font-bold mb-4">
              <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                Featured Mods
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Handpicked premium mods that will transform your farming experience
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue"></div>
          </div>
        </div>
      </section>
    )
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
            <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
              Featured Mods
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Handpicked premium mods that will transform your farming experience
          </p>
          {featuredMods.length > 0 && (
            <p className="text-lg text-neon-blue mt-4">
              {featuredMods.length} featured mods available
            </p>
          )}
        </motion.div>

        {featuredMods.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gaming-card rounded-full mx-auto mb-4 flex items-center justify-center">
              <Star className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No featured mods yet</h3>
            <p className="text-muted-foreground mb-6">Check back soon for amazing featured content</p>
            <Link href="/mods">
              <button className="px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg text-white font-semibold hover-glow transition-all duration-300">
                Browse All Mods
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredMods.map((mod, index) => (
              <Link key={mod._id} href={`/mods/${mod.slug}`}>
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
                        src={mod.thumbnail}
                        alt={mod.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=300&fit=crop'
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        mod.game === 'FS25' 
                          ? 'bg-gradient-to-r from-neon-green to-neon-blue text-white' 
                          : mod.game === 'FS22'
                          ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white'
                          : 'bg-gradient-to-r from-neon-orange to-yellow-400 text-white'
                      }`}>
                        {mod.game}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-1 bg-gaming-dark/80 backdrop-blur-sm rounded-full text-xs text-white">
                        {mod.category}
                      </span>
                    </div>
                    
                    {/* Video Indicator */}
                    {mod.videoUrl && (
                      <div className="absolute bottom-2 right-2">
                        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                          <Play className="h-4 w-4 text-white fill-current ml-0.5" />
                        </div>
                      </div>
                    )}

                    {/* Dynamic Badge - Featured or Popular */}
                    <div className="absolute bottom-2 left-2">
                      {mod.isPopular ? (
                        <span className="px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-xs font-bold text-white flex items-center gap-1">
                          <Flame className="h-3 w-3" />
                          POPULAR
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full text-xs font-bold text-white flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          FEATURED
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-neon-blue transition-colors line-clamp-1">
                      {mod.name}
                    </h3>
                    <p className="text-muted-foreground mb-4 text-sm line-clamp-2">
                      {mod.shortDescription}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-semibold">
                          {mod.rating.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Download className="h-4 w-4" />
                        <span className="text-sm">{mod.downloads.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Mod Type Badge */}
                    <div className="mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getPriceColor(mod.type)} text-white`}>
                        {formatPrice(mod.type, mod.price)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>By {mod.author.id.username}</span>
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
                      <span>View Details</span>
                    </motion.button>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}

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
