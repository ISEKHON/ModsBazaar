'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Tractor, 
  Wrench, 
  Map, 
  Code, 
  Package, 
  Music, 
  Palette, 
  Settings,
  Loader2
} from 'lucide-react'
import api from '@/lib/api'
import { toast } from 'sonner'

interface CategoryData {
  name: string
  count: number
  avgRating: number
  totalDownloads: number
}

const categoryIcons: { [key: string]: any } = {
  'Vehicles': Tractor,
  'Tools': Wrench,
  'Maps': Map,
  'Scripts': Code,
  'Tractors': Tractor,
  'Harvesters': Tractor,
  'Textures': Palette,
  'Sounds': Music,
  'Other': Package,
  'Mods': Settings
}

const categoryColors: { [key: string]: string } = {
  'Vehicles': 'from-neon-blue to-neon-purple',
  'Tools': 'from-neon-purple to-neon-pink',
  'Maps': 'from-neon-green to-neon-blue',
  'Scripts': 'from-neon-orange to-neon-purple',
  'Tractors': 'from-blue-500 to-purple-500',
  'Harvesters': 'from-green-500 to-blue-500',
  'Textures': 'from-pink-500 to-purple-500',
  'Sounds': 'from-yellow-500 to-orange-500',
  'Other': 'from-gray-500 to-blue-500',
  'Mods': 'from-purple-500 to-pink-500'
}

const categoryDescriptions: { [key: string]: string } = {
  'Vehicles': 'Tractors, harvesters, and farming vehicles',
  'Tools': 'Plows, seeders, and farming equipment',
  'Maps': 'Custom farming locations and terrains',
  'Scripts': 'Automation scripts and gameplay enhancements',
  'Tractors': 'Farming tractors and utility vehicles',
  'Harvesters': 'Combine harvesters and crop equipment',
  'Textures': 'Visual modifications and graphics',
  'Sounds': 'Audio modifications and sound packs',
  'Other': 'Miscellaneous farming modifications',
  'Mods': 'General modifications and enhancements'
}

export default function Categories() {
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await api.get('/mods/categories')
        
        if (response.data.status === 'success') {
          setCategories(response.data.data.categories || [])
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        toast.error('Failed to load categories')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
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
              <span className="bg-gradient-to-r from-neon-green to-neon-blue bg-clip-text text-transparent">
                Browse Categories
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find exactly what you need to enhance your farming experience
            </p>
          </motion.div>

          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-8 w-8 animate-spin text-neon-blue" />
              <span className="text-muted-foreground">Loading categories...</span>
            </div>
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
            <span className="bg-gradient-to-r from-neon-green to-neon-blue bg-clip-text text-transparent">
              Browse Categories
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find exactly what you need to enhance your farming experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {categories.slice(0, 4).map((category, index) => {
            const IconComponent = categoryIcons[category.name] || Package
            const color = categoryColors[category.name] || 'from-neon-blue to-neon-purple'
            const description = categoryDescriptions[category.name] || 'Custom modifications for your farming experience'
            
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.03 }}
                className="gaming-card p-6 rounded-xl hover-glow transition-all duration-300 cursor-pointer group"
              >
                <Link href={`/mods?category=${encodeURIComponent(category.name)}`}>
                  <div className="flex items-center space-x-4 mb-4">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center`}
                    >
                      <IconComponent className="h-6 w-6 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold group-hover:text-neon-blue transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {category.count} mods available
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">
                    {description}
                  </p>

                  {/* Category Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">★</span>
                      <span>{category.avgRating.toFixed(1)} avg</span>
                    </div>
                    <div>
                      <span>{category.totalDownloads.toLocaleString()} downloads</span>
                    </div>
                  </div>

                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                    viewport={{ once: true }}
                    className="h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent rounded-full"
                  />

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-4 py-2 text-center text-neon-blue font-semibold hover:text-white transition-colors group-hover:bg-gradient-to-r group-hover:from-neon-blue group-hover:to-neon-purple rounded-lg"
                  >
                    Explore {category.name}
                  </motion.button>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Show all categories link if there are more than 4 */}
        {categories.length > 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <Link href="/mods">
              <button className="px-8 py-3 bg-gradient-to-r from-neon-green to-neon-blue rounded-lg text-white font-semibold hover-glow transition-all duration-300 transform hover:scale-105">
                View All Categories ({categories.length})
              </button>
            </Link>
          </motion.div>
        )}

        {/* No categories fallback */}
        {categories.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-neon-green to-neon-blue rounded-full mx-auto mb-4 flex items-center justify-center">
              <Package className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No categories available</h3>
            <p className="text-muted-foreground mb-6">Categories will appear here once mods are uploaded</p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="gaming-card p-8 rounded-xl inline-block">
            <h3 className="text-2xl font-bold mb-4">
              Can't find what you're looking for?
            </h3>
            <p className="text-muted-foreground mb-8">
              Submit a request and we'll help you find the perfect mod for your needs
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-neon-green to-neon-blue rounded-lg font-semibold hover-glow transition-all duration-300 text-white shadow-lg"
            >
              Request a Mod
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
