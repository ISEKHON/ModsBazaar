'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Target, Zap, Shield, Heart, Award, Download, Star, Crown, UserCheck, Code, TrendingUp } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import api from '@/lib/api'
import { toast } from 'sonner'

interface PlatformStats {
  totalUsers: number
  totalMods: number
  totalDownloads: number
  averageRating: number
  totalReviews: number
  featuredMods: number
  popularMods: number
}

interface Contributor {
  _id: string
  username: string
  email: string
  role: 'user' | 'admin' | 'moderator'
  avatar?: string
  bio?: string
  joinedAt: string
  modsCount: number
  totalDownloads: number
  averageRating: number
}

interface ContributorsData {
  owner: Contributor | null
  admins: Contributor[]
  moderators: Contributor[]
  contributors: Contributor[]
  totalContributors: number
}

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
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [contributors, setContributors] = useState<ContributorsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [statsResponse, contributorsResponse] = await Promise.all([
          api.get('/mods/stats'),
          api.get('/mods/contributors')
        ])

        if (statsResponse.data.status === 'success') {
          setStats(statsResponse.data.data)
        }

        if (contributorsResponse.data.status === 'success') {
          setContributors(contributorsResponse.data.data)
        }
      } catch (error) {
        console.error('Failed to fetch about data:', error)
        toast.error('Failed to load some data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M+`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K+`
    return num.toString()
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return Crown
      case 'moderator':
        return UserCheck
      default:
        return Code
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'from-yellow-500 to-orange-500'
      case 'moderator':
        return 'from-purple-500 to-pink-500'
      default:
        return 'from-blue-500 to-green-500'
    }
  }

  const getRoleTitle = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator'
      case 'moderator':
        return 'Moderator'
      default:
        return 'Contributor'
    }
  }

  const dynamicStats = stats ? [
    { label: "Active Users", value: formatNumber(stats.totalUsers), icon: Users },
    { label: "Total Downloads", value: formatNumber(stats.totalDownloads), icon: Download },
    { label: "Average Rating", value: stats.averageRating.toFixed(1), icon: Star },
    { label: "Mods Available", value: formatNumber(stats.totalMods), icon: Award },
    { label: "Featured Mods", value: stats.featuredMods.toString(), icon: TrendingUp },
    { label: "Total Reviews", value: formatNumber(stats.totalReviews), icon: Heart }
  ] : []
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
              
              {loading ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue"></div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                  {dynamicStats.map((stat, index) => {
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
              )}
            </motion.div>

            {/* Team Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mb-16"
            >
              {loading ? (
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-12">
                    <span className="bg-gradient-to-r from-neon-pink to-neon-orange bg-clip-text text-transparent">
                      Loading Team Data...
                    </span>
                  </h2>
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue"></div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Owner Section */}
                  {contributors?.owner && (
                    <div className="mb-12">
                      <h2 className="text-3xl font-bold mb-8 text-center">
                        <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                          Founder & Owner
                        </span>
                      </h2>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-md mx-auto"
                      >
                        <div className="gaming-card p-8 rounded-xl text-center hover-glow transition-all duration-300 border-2 border-yellow-500/30">
                          <div className="relative mb-6">
                            <div className="w-24 h-24 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mx-auto flex items-center justify-center">
                              <Crown className="h-12 w-12 text-white" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                              <Crown className="h-4 w-4 text-white" />
                            </div>
                          </div>
                          <h3 className="text-2xl font-bold mb-2 text-yellow-400">{contributors.owner.username}</h3>
                          <p className="text-yellow-500 font-semibold mb-4">Owner • Developer • Admin</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Mods Created</p>
                              <p className="font-bold text-white">{contributors.owner.modsCount}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Total Downloads</p>
                              <p className="font-bold text-white">{formatNumber(contributors.owner.totalDownloads)}</p>
                            </div>
                          </div>
                          {contributors.owner.averageRating > 0 && (
                            <div className="mt-4">
                              <p className="text-muted-foreground text-sm">Average Rating</p>
                              <div className="flex items-center justify-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="font-bold text-white">{contributors.owner.averageRating.toFixed(1)}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {/* Admins Section */}
                  {contributors?.admins && contributors.admins.length > 0 && (
                    <div className="mb-12">
                      <h3 className="text-2xl font-bold mb-6 text-center">
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                          Administrators
                        </span>
                      </h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {contributors.admins.map((admin, index) => {
                          const RoleIcon = getRoleIcon(admin.role)
                          return (
                            <motion.div
                              key={admin._id}
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.8, delay: index * 0.1 }}
                              whileHover={{ y: -10, scale: 1.03 }}
                              className="gaming-card p-6 rounded-xl text-center hover-glow transition-all duration-300 border border-purple-500/30"
                            >
                              <div className={`w-16 h-16 bg-gradient-to-r ${getRoleColor(admin.role)} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                                <RoleIcon className="h-8 w-8 text-white" />
                              </div>
                              <h4 className="text-lg font-bold mb-2">{admin.username}</h4>
                              <p className="text-purple-400 font-semibold mb-3">{getRoleTitle(admin.role)}</p>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <p className="text-muted-foreground">Mods</p>
                                  <p className="font-bold">{admin.modsCount}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Downloads</p>
                                  <p className="font-bold">{formatNumber(admin.totalDownloads)}</p>
                                </div>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Top Contributors Section */}
                  {contributors?.contributors && contributors.contributors.length > 0 && (
                    <div className="mb-12">
                      <h3 className="text-2xl font-bold mb-6 text-center">
                        <span className="bg-gradient-to-r from-neon-blue to-neon-green bg-clip-text text-transparent">
                          Top Contributors
                        </span>
                      </h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {contributors.contributors.slice(0, 8).map((contributor, index) => {
                          const RoleIcon = getRoleIcon(contributor.role)
                          return (
                            <motion.div
                              key={contributor._id}
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.8, delay: index * 0.05 }}
                              whileHover={{ y: -5, scale: 1.02 }}
                              className="gaming-card p-4 rounded-xl text-center hover-glow transition-all duration-300"
                            >
                              <div className={`w-12 h-12 bg-gradient-to-r ${getRoleColor(contributor.role)} rounded-full mx-auto mb-3 flex items-center justify-center`}>
                                <RoleIcon className="h-6 w-6 text-white" />
                              </div>
                              <h4 className="font-bold mb-1 text-sm">{contributor.username}</h4>
                              <p className="text-neon-blue text-xs mb-2">{contributor.modsCount} mods</p>
                              <div className="text-xs text-muted-foreground">
                                {formatNumber(contributor.totalDownloads)} downloads
                              </div>
                              {contributor.averageRating > 0 && (
                                <div className="flex items-center justify-center space-x-1 mt-1">
                                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                  <span className="text-xs">{contributor.averageRating.toFixed(1)}</span>
                                </div>
                              )}
                            </motion.div>
                          )
                        })}
                      </div>
                      
                      {contributors.contributors.length > 8 && (
                        <div className="text-center mt-6">
                          <p className="text-muted-foreground">
                            ...and {contributors.contributors.length - 8} more amazing contributors!
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
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
