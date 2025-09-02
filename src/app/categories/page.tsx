'use client'

import { motion } from 'framer-motion'
import { Tractor, Wrench, Map, Code } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const categories = [
  {
    name: "Vehicles",
    icon: Tractor,
    count: 245,
    description: "Tractors, harvesters, and farming vehicles for all your agricultural needs",
    color: "from-neon-blue to-neon-purple",
    mods: [
      "Super Harvester 2025",
      "Premium Tractor Collection",
      "Heavy Duty Cultivator",
      "Advanced Seeder Pro"
    ]
  },
  {
    name: "Tools",
    icon: Wrench,
    count: 189,
    description: "Plows, seeders, and farming equipment to enhance your productivity",
    color: "from-neon-purple to-neon-pink",
    mods: [
      "Mega Farm Pack",
      "Professional Plow Set",
      "Smart Irrigation System",
      "Precision Planter"
    ]
  },
  {
    name: "Maps",
    icon: Map,
    count: 67,
    description: "Custom farming locations and terrains with unique challenges",
    color: "from-neon-green to-neon-blue",
    mods: [
      "Alpine Valley Map",
      "Countryside Paradise",
      "Desert Oasis Farm",
      "Mountain Ridge Terrain"
    ]
  },
  {
    name: "Scripts",
    icon: Code,
    count: 124,
    description: "Automation scripts and gameplay enhancements for better farming",
    color: "from-neon-orange to-neon-purple",
    mods: [
      "Auto Helper Script",
      "Farm Manager Pro",
      "Crop Optimizer",
      "Weather Predictor"
    ]
  }
]

export default function CategoriesPage() {
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {categories.map((category, index) => {
                const IconComponent = category.icon
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
                        className={`w-16 h-16 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center`}
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
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-6 text-lg">
                      {category.description}
                    </p>

                    {/* Popular Mods */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                        Popular in this category:
                      </h4>
                      <div className="space-y-2">
                        {category.mods.map((mod, modIndex) => (
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

                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1, delay: index * 0.2 + 0.5 }}
                      className="h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent rounded-full mb-6"
                    />

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 text-center bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold hover-glow transition-all duration-300 rounded-lg"
                    >
                      Explore {category.name}
                    </motion.button>
                  </motion.div>
                )
              })}
            </div>

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
                    <div className="text-3xl font-bold text-neon-blue mb-2">625</div>
                    <div className="text-muted-foreground">Total Mods</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-neon-green mb-2">1.2M</div>
                    <div className="text-muted-foreground">Downloads</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-neon-purple mb-2">24K</div>
                    <div className="text-muted-foreground">Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-neon-orange mb-2">4.8</div>
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
