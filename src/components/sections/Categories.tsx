'use client'

import { motion } from 'framer-motion'
import { Tractor, Wrench, Map, Code } from 'lucide-react'

const categories = [
  {
    name: "Vehicles",
    icon: Tractor,
    count: 245,
    description: "Tractors, harvesters, and farming vehicles",
    color: "from-neon-blue to-neon-purple"
  },
  {
    name: "Tools",
    icon: Wrench,
    count: 189,
    description: "Plows, seeders, and farming equipment",
    color: "from-neon-purple to-neon-pink"
  },
  {
    name: "Maps",
    icon: Map,
    count: 67,
    description: "Custom farming locations and terrains",
    color: "from-neon-green to-neon-blue"
  },
  {
    name: "Scripts",
    icon: Code,
    count: 124,
    description: "Automation scripts and gameplay enhancements",
    color: "from-neon-orange to-neon-purple"
  }
]

export default function Categories() {
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
          {categories.map((category, index) => {
            const IconComponent = category.icon
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
                <div className="flex items-center space-x-4 mb-4">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center`}
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
                  {category.description}
                </p>

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
              </motion.div>
            )
          })}
        </div>

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
