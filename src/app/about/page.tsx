'use client'

import { motion } from 'framer-motion'
import { Users, Target, Zap, Shield, Heart, Award, Download, Star } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const teamMembers = [
  {
    name: "Alex Johnson",
    role: "Founder & Lead Developer",
    description: "Passionate farmer and developer with 10+ years in gaming",
    avatar: "AJ"
  },
  {
    name: "Sarah Chen",
    role: "Community Manager",
    description: "Connecting mod creators with the farming community",
    avatar: "SC"
  },
  {
    name: "Mike Rodriguez",
    role: "Quality Assurance",
    description: "Ensuring every mod meets our high standards",
    avatar: "MR"
  }
]

const stats = [
  { label: "Active Users", value: "24K+", icon: Users },
  { label: "Total Downloads", value: "1.2M+", icon: Download },
  { label: "Average Rating", value: "4.8", icon: Star },
  { label: "Mods Available", value: "625+", icon: Award }
]

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description: "To create the ultimate destination for Farming Simulator mods, connecting creators with passionate farmers worldwide.",
    color: "from-neon-blue to-neon-purple"
  },
  {
    icon: Shield,
    title: "Quality First",
    description: "Every mod is thoroughly tested and reviewed to ensure compatibility, safety, and exceptional user experience.",
    color: "from-neon-purple to-neon-pink"
  },
  {
    icon: Heart,
    title: "Community Driven",
    description: "Built by farmers, for farmers. We listen to our community and continuously improve based on your feedback.",
    color: "from-neon-green to-neon-blue"
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "Embracing cutting-edge technology to deliver lightning-fast downloads and seamless user experiences.",
    color: "from-neon-orange to-neon-purple"
  }
]

export default function AboutPage() {
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
                  About ModsBazaar
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                The premier destination for Farming Simulator mods, built by passionate farmers who understand what the community needs.
              </p>
            </motion.div>

            {/* Story Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="gaming-card p-8 rounded-xl mb-16"
            >
              <h2 className="text-3xl font-bold mb-6 text-center">
                <span className="bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent">
                  Our Story
                </span>
              </h2>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-muted-foreground mb-4">
                    ModsBazaar was born from a simple frustration: finding quality mods for Farming Simulator was difficult, time-consuming, and often unreliable. As passionate farmers ourselves, we knew there had to be a better way.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    In 2024, we set out to create the ultimate mod platform - one that prioritizes quality, community, and user experience above all else. Every feature, every design decision, and every policy is crafted with the farming community in mind.
                  </p>
                  <p className="text-muted-foreground">
                    Today, ModsBazaar serves thousands of farmers worldwide, providing access to premium mods that enhance and transform the farming experience.
                  </p>
                </div>
                <div className="relative">
                  <div className="w-full h-64 bg-gradient-to-br from-gaming-card to-gaming-border rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-r from-neon-green to-neon-blue rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Target className="h-12 w-12 text-white" />
                      </div>
                      <p className="text-sm text-muted-foreground">Building the Future of Farming</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Values Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-12 text-center">
                <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                  Our Values
                </span>
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {values.map((value, index) => {
                  const IconComponent = value.icon
                  return (
                    <motion.div
                      key={value.title}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="gaming-card p-6 rounded-xl hover-glow transition-all duration-300"
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className={`w-12 h-12 rounded-lg bg-gradient-to-r ${value.color} flex items-center justify-center`}
                        >
                          <IconComponent className="h-6 w-6 text-white" />
                        </motion.div>
                        <h3 className="text-xl font-bold">{value.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{value.description}</p>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="gaming-card p-8 rounded-xl mb-16"
            >
              <h2 className="text-3xl font-bold mb-8 text-center">
                <span className="bg-gradient-to-r from-neon-orange to-neon-green bg-clip-text text-transparent">
                  Our Impact
                </span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                      className="text-center"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-16 h-16 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full mx-auto mb-3 flex items-center justify-center"
                      >
                        <IconComponent className="h-8 w-8 text-white" />
                      </motion.div>
                      <div className="text-2xl md:text-3xl font-bold text-neon-blue mb-1">{stat.value}</div>
                      <div className="text-muted-foreground text-sm">{stat.label}</div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* Team Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-12 text-center">
                <span className="bg-gradient-to-r from-neon-pink to-neon-orange bg-clip-text text-transparent">
                  Meet Our Team
                </span>
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.4 + index * 0.2 }}
                    whileHover={{ y: -10, scale: 1.03 }}
                    className="gaming-card p-6 rounded-xl text-center hover-glow transition-all duration-300"
                  >
                    <div className="w-20 h-20 bg-gradient-to-r from-neon-purple to-neon-blue rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">{member.avatar}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                    <p className="text-neon-blue font-semibold mb-3">{member.role}</p>
                    <p className="text-muted-foreground text-sm">{member.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.8 }}
              className="gaming-card p-8 rounded-xl text-center"
            >
              <h2 className="text-3xl font-bold mb-4">
                <span className="bg-gradient-to-r from-neon-green to-neon-purple bg-clip-text text-transparent">
                  Join Our Community
                </span>
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Have questions, suggestions, or want to contribute? We'd love to hear from you! Join our growing community of passionate farmers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg text-white font-semibold hover-glow transition-all duration-300"
                >
                  Contact Us
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 gaming-card neon-border rounded-lg font-semibold hover-glow transition-all duration-300 text-white"
                >
                  Join Discord
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
