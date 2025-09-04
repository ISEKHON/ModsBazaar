'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Star, Download, Play, Unlock, DollarSign, TrendingUp, Flame, Eye, Zap } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/api'

interface PopularMod {
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

export default function PopularMods() {
  const [popularMods, setPopularMods] = useState<PopularMod[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPopularMods = async () => {
      try {
        setLoading(true)
        const response = await api.get('/mods/popular')
        
        if (response.data.status === 'success') {
          setPopularMods(response.data.data.mods || [])
        }
      } catch (error) {
        console.error('Failed to fetch popular mods:', error)
        toast.error('Failed to load popular mods')
      } finally {
        setLoading(false)
      }
    }

    fetchPopularMods()
  }, [])

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="text-2xl md:text-3xl font-gaming font-bold mb-8">
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent flex items-center justify-center gap-2">
              <TrendingUp className="h-8 w-8 text-orange-500" />
              Popular Mods
            </span>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
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
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent flex items-center justify-center gap-3">
              <TrendingUp className="h-10 w-10 text-orange-500" />
              Popular Mods
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trending mods loved by the community
          </p>
          {popularMods.length > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              {popularMods.length} popular mods available
            </p>
          )}
        </motion.div>

        {popularMods.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No popular mods yet</h3>
            <p className="text-muted-foreground mb-6">Check back soon for trending content</p>
            <Link href="/mods">
              <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white font-semibold hover-glow transition-all duration-300">
                Browse All Mods
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularMods.map((mod, index) => (
              <motion.div
                key={mod._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link href={`/mods/${mod.slug}`}>
                  <div className="gaming-card overflow-hidden group-hover:border-orange-500 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-orange-500/20">
                    {/* Mod Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={mod.thumbnail}
                        alt={mod.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Eye className="h-6 w-6 text-white" />
                          </div>
                          <span className="text-white font-semibold">View Details</span>
                        </div>
                      </div>

                      {/* Video indicator */}
                      {mod.videoUrl && (
                        <div className="absolute top-2 right-2">
                          <div className="w-8 h-8 bg-black/70 rounded-full flex items-center justify-center">
                            <Play className="h-4 w-4 text-white fill-current" />
                          </div>
                        </div>
                      )}

                      {/* Popular Badge */}
                      <div className="absolute bottom-2 left-2">
                        {mod.isPopular ? (
                          <span className="px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-xs font-bold text-white flex items-center gap-1">
                            <Flame className="h-3 w-3" />
                            TRENDING
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-bold text-white flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            POPULAR
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-orange-500 transition-colors line-clamp-1">
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

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            mod.game === 'Both' 
                              ? 'bg-neon-purple/20 text-neon-purple' 
                              : mod.game === 'FS25'
                              ? 'bg-neon-green/20 text-neon-green'
                              : 'bg-neon-blue/20 text-neon-blue'
                          }`}>
                            {mod.game}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {mod.category}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          {mod.type === 'paid' && (
                            <>
                              <DollarSign className="h-4 w-4 text-neon-green" />
                              <span className="text-sm font-bold text-neon-green">
                                ${mod.price?.toFixed(2)}
                              </span>
                            </>
                          )}
                          {mod.type === 'unlock' && (
                            <div className="flex items-center space-x-1">
                              <Unlock className="h-4 w-4 text-neon-purple" />
                              <span className="text-xs text-neon-purple font-medium">Code</span>
                            </div>
                          )}
                          {mod.type === 'free' && (
                            <span className="text-sm font-bold text-neon-blue">FREE</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {popularMods.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/mods?sort=popular">
              <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white font-semibold hover-glow transition-all duration-300 transform hover:scale-105">
                View All Popular Mods
              </button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
