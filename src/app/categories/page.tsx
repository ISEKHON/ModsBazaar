'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Tractor, Wrench, Map, Code, Truck, Paintbrush, Volume2, FileText, Package } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import api from '@/lib/api'
import { toast } from 'sonner'

interface Category {
  name: string
  count: number
  avgRating: number
  totalDownloads: number
  popularMods: string[]
}

interface OverviewStats {
  downloads: number
  views: number
  users: number
  revenue: number
}

// Icon mapping for categories
const categoryIcons: { [key: string]: any } = {
  'Vehicles': Tractor,
  'Tractors': Tractor,
  'Harvesters': Truck,
  'Tools': Wrench,
  'Maps': Map,
  'Textures': Paintbrush,
  'Sounds': Volume2,
  'Scripts': Code,
  'Other': Package,
  'Documentation': FileText
}

// Color themes for categories
const categoryColors: { [key: string]: string } = {
  'Vehicles': 'from-neon-blue to-neon-purple',
  'Tractors': 'from-neon-green to-neon-blue', 
  'Harvesters': 'from-neon-orange to-yellow-400',
  'Tools': 'from-neon-purple to-neon-pink',
  'Maps': 'from-neon-green to-neon-blue',
  'Textures': 'from-pink-500 to-purple-500',
  'Sounds': 'from-blue-500 to-cyan-500',
  'Scripts': 'from-neon-orange to-neon-purple',
  'Other': 'from-gray-500 to-gray-700',
  'Documentation': 'from-yellow-500 to-orange-500'
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [overviewStats, setOverviewStats] = useState<OverviewStats>({
    downloads: 0,
    views: 0,
    users: 0,
    revenue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch categories and overview stats in parallel
        const [categoriesResponse, statsResponse] = await Promise.all([
          api.get('/mods/categories'),
          api.get('/analytics/overview')
        ])
        
        if (categoriesResponse.data.status === 'success') {
          setCategories(categoriesResponse.data.data.categories)
        }
        
        if (statsResponse.data.status === 'success') {
          setOverviewStats(statsResponse.data.data)
        }
      } catch (error) {
        console.error('Failed to fetch categories data:', error)
        toast.error('Failed to load categories')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading categories...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Helper function to get category description
  const getCategoryDescription = (categoryName: string): string => {
    const descriptions: { [key: string]: string } = {
      'Vehicles': 'Tractors, harvesters, and farming vehicles for all your agricultural needs',
      'Tractors': 'Powerful tractors and farming vehicles to handle any agricultural task',
      'Harvesters': 'Combine harvesters and specialized harvesting equipment',
      'Tools': 'Plows, seeders, and farming equipment to enhance your productivity',
      'Maps': 'Custom farming locations and terrains with unique challenges',
      'Textures': 'Visual enhancements and texture packs to beautify your farm',
      'Sounds': 'Audio enhancements and realistic sound effects for immersion',
      'Scripts': 'Automation scripts and gameplay enhancements for better farming',
      'Other': 'Miscellaneous mods that don\'t fit into other categories',
      'Documentation': 'Guides, tutorials, and documentation for mod development'
    }
    return descriptions[categoryName] || `Discover amazing ${categoryName.toLowerCase()} mods for your farm`
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
                <span className="bg-gradient-to-r from-neon-green to-neon-blue bg-clip-text text-transparent">
                  Mod Categories
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Explore our organized collection of mods by category. Find exactly what you need to enhance your farming experience.
              </p>
            </motion.div>

            {/* Categories Grid */}
            {categories.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {categories.map((category, index) => {
                  const IconComponent = categoryIcons[category.name] || Package
                  const colorClass = categoryColors[category.name] || 'from-gray-500 to-gray-700'
                  const description = getCategoryDescription(category.name)
                  
                  return (
                    <motion.div
                      key={category.name}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: index * 0.2 }}
                      whileHover={{ y: -10, scale: 1.02 }}
                      className="gaming-card p-8 rounded-xl hover-glow transition-all duration-300 cursor-pointer group"
                    >
                      <div className="flex items-center space-x-6 mb-6">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className={`w-16 h-16 rounded-lg bg-gradient-to-r ${colorClass} flex items-center justify-center`}
                        >
                          <IconComponent className="h-8 w-8 text-white" />
                        </motion.div>
                        <div>
                          <h2 className="text-3xl font-bold group-hover:text-neon-blue transition-colors">
                            {category.name}
                          </h2>
                          <p className="text-muted-foreground">
                            {category.count} mods available
                          </p>
                          <p className="text-sm text-yellow-400">
                            ⭐ {category.avgRating}/5.0 • {category.totalDownloads.toLocaleString()} downloads
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-6 text-lg">
                        {description}
                      </p>

                      {/* Popular Mods */}
                      {category.popularMods.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                            Popular in this category:
                          </h4>
                          <div className="space-y-2">
                            {category.popularMods.map((mod, modIndex) => (
                              <motion.div
                                key={mod}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.2 + modIndex * 0.1 }}
                                className="flex items-center space-x-2 text-sm"
                              >
                                <div className="w-2 h-2 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full"></div>
                                <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                                  {mod}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1, delay: index * 0.2 + 0.5 }}
                        className="h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent rounded-full mb-6"
                      />

                      <Link href={`/mods?category=${encodeURIComponent(category.name)}`}>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-3 text-center bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold hover-glow transition-all duration-300 rounded-lg"
                        >
                          Explore {category.name}
                        </motion.button>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-gaming-card rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No categories found</h3>
                <p className="text-muted-foreground">Categories will appear here once mods are added to the platform.</p>
              </div>
            )}

            {/* Statistics Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-20"
            >
              <div className="gaming-card p-8 rounded-xl text-center">
                <h3 className="text-3xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent">
                    Community Stats
                  </span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-neon-blue mb-2">
                      {categories.reduce((total, cat) => total + cat.count, 0).toLocaleString()}
                    </div>
                    <div className="text-muted-foreground">Total Mods</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-neon-green mb-2">
                      {overviewStats.downloads > 1000000 
                        ? `${(overviewStats.downloads / 1000000).toFixed(1)}M`
                        : `${(overviewStats.downloads / 1000).toFixed(0)}K`
                      }
                    </div>
                    <div className="text-muted-foreground">Downloads</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-neon-purple mb-2">
                      {overviewStats.users > 1000 
                        ? `${(overviewStats.users / 1000).toFixed(1)}K`
                        : overviewStats.users.toLocaleString()
                      }
                    </div>
                    <div className="text-muted-foreground">Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-neon-orange mb-2">
                      {categories.length > 0 
                        ? (categories.reduce((total, cat) => total + cat.avgRating, 0) / categories.length).toFixed(1)
                        : '0.0'
                      }
                    </div>
                    <div className="text-muted-foreground">Avg Rating</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
