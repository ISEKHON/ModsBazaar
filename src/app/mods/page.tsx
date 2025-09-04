'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Download, Eye, Calendar, Search, Filter, Play } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import api from '@/lib/api'
import { toast } from 'sonner'

interface Mod {
  _id: string
  name: string
  slug: string
  description: string
  shortDescription: string
  type: 'free' | 'paid' | 'unlock'
  price?: number
  thumbnail: string
  downloads: number
  rating: number
  ratingCount: number
  game: 'FS22' | 'FS25' | 'Both'
  category: string
  tags: string[]
  publishedAt: string
  author: {
    name: string
    id: string
  }
  videoUrl?: string
  isFeatured: boolean
}

interface ModsResponse {
  mods: Mod[]
  pagination: {
    currentPage: number
    totalPages: number
    totalMods: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export default function ModsPage() {
  const searchParams = useSearchParams()
  const [mods, setMods] = useState<Mod[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedGame, setSelectedGame] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [sortBy, setSortBy] = useState(() => {
    // Initialize sort from URL params
    return searchParams.get('sort') || 'newest'
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalMods: 0,
    hasNext: false,
    hasPrev: false
  })

  const categories = [
    'All Categories',
    'Vehicles',
    'Tractors',
    'Harvesters', 
    'Tools',
    'Maps',
    'Textures',
    'Sounds',
    'Scripts',
    'Other'
  ]

  const fetchMods = async (page = 1) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12'
      })

      if (searchQuery) params.append('search', searchQuery)
      if (selectedCategory && selectedCategory !== 'All Categories') params.append('category', selectedCategory)
      if (selectedGame && selectedGame !== 'All Versions') params.append('game', selectedGame)
      if (selectedType && selectedType !== 'All Types') params.append('type', selectedType)
      if (sortBy) params.append('sort', sortBy)

      const response = await api.get(`/mods?${params.toString()}`)
      
      if (response.data.status === 'success') {
        const data: ModsResponse = response.data.data
        setMods(data.mods)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch mods:', error)
      toast.error('Failed to load mods')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams({
          page: '1',
          limit: '12'
        })

        if (searchQuery) params.append('search', searchQuery)
        if (selectedCategory && selectedCategory !== 'All Categories') params.append('category', selectedCategory)
        if (selectedGame && selectedGame !== 'All Versions') params.append('game', selectedGame)
        if (selectedType && selectedType !== 'All Types') params.append('type', selectedType)
        if (sortBy) params.append('sort', sortBy)

        const response = await api.get(`/mods?${params.toString()}`)
        
        if (response.data.status === 'success') {
          const data: ModsResponse = response.data.data
          setMods(data.mods)
          setPagination(data.pagination)
        }
      } catch (error) {
        console.error('Failed to fetch mods:', error)
        toast.error('Failed to load mods')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchQuery, selectedCategory, selectedGame, selectedType, sortBy])

  // Handle URL parameters on component mount
  useEffect(() => {
    const sort = searchParams.get('sort')
    if (sort && sort !== sortBy) {
      setSortBy(sort)
    }
  }, [searchParams, sortBy])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchMods(1)
  }

  const handlePageChange = (page: number) => {
    fetchMods(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
              <p className="text-lg text-neon-blue mt-4">
                {pagination.totalMods} mods available
              </p>
            </motion.div>

            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-12"
            >
              <form onSubmit={handleSearch} className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search mods..."
                    className="w-full pl-10 pr-4 py-3 bg-gaming-card border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
                  />
                </div>
              </form>
              
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-gaming-card border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <select 
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="px-4 py-3 bg-gaming-card border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
              >
                <option value="">All Versions</option>
                <option value="FS25">FS25</option>
                <option value="FS22">FS22</option>
                <option value="Both">Both</option>
              </select>
              
              <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-3 bg-gaming-card border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
              >
                <option value="">All Types</option>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
                <option value="unlock">Unlock Code</option>
              </select>
              
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-gaming-card border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="downloads">Most Downloaded</option>
              </select>
            </motion.div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue"></div>
              </div>
            )}

            {/* Mods Grid */}
            {!loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mods.map((mod, index) => (
                  <Link key={mod._id} href={`/mods/${mod.slug}`}>
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

                        {/* Featured Badge */}
                        {mod.isFeatured && (
                          <div className="absolute bottom-2 left-2">
                            <span className="px-2 py-1 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full text-xs font-bold text-white">
                              FEATURED
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-neon-blue transition-colors line-clamp-1">
                          {mod.name}
                        </h3>
                        <p className="text-muted-foreground mb-3 text-sm line-clamp-2">
                          {mod.shortDescription}
                        </p>
                        <p className="text-xs text-muted-foreground mb-4">
                          by {mod.author.name}
                        </p>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-semibold">
                              {mod.rating.toFixed(1)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({mod.ratingCount})
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
                            <span>{new Date(mod.publishedAt).toLocaleDateString()}</span>
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

            {/* No Results */}
            {!loading && mods.length === 0 && (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-gaming-card rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No mods found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search criteria</p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('')
                    setSelectedGame('')
                    setSelectedType('')
                    setSortBy('newest')
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg text-white font-semibold hover-glow transition-all duration-300"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {!loading && mods.length > 0 && pagination.totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex justify-center items-center space-x-2 mt-12"
              >
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="px-4 py-2 gaming-card rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-neon-blue/50"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const page = i + Math.max(1, pagination.currentPage - 2)
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                        page === pagination.currentPage
                          ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white'
                          : 'gaming-card hover:border-neon-blue/50'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
                
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="px-4 py-2 gaming-card rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-neon-blue/50"
                >
                  Next
                </button>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
