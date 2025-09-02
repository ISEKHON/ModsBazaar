'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { User, Download, Heart, ShoppingBag, Settings, Star, Calendar, Eye, LogOut, Edit, Mail, Shield } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview')
  
  // Mock user data
  const user = {
    username: 'FarmingPro2024',
    email: 'farmingpro@example.com',
    avatar: 'FP',
    joinDate: '2024-01-15',
    totalDownloads: 42,
    favoriteCount: 18,
    purchasedCount: 6,
    role: 'Premium User'
  }

  // Mock data
  const purchasedMods = [
    { id: 1, name: 'John Deere 8R Series', price: 9.99, purchaseDate: '2024-08-15', downloads: 3 },
    { id: 2, name: 'Claas Lexion Combine', price: 12.99, purchaseDate: '2024-08-10', downloads: 1 },
    { id: 3, name: 'Premium Tractor Pack', price: 19.99, purchaseDate: '2024-07-28', downloads: 5 }
  ]

  const favoriteMods = [
    { id: 1, name: 'Fendt 1000 Vario', author: 'ModMaster', rating: 4.8, downloads: 15420 },
    { id: 2, name: 'Case IH Magnum', author: 'TractorPro', rating: 4.9, downloads: 12380 },
    { id: 3, name: 'New Holland T7', author: 'FarmTech', rating: 4.7, downloads: 9850 }
  ]

  const downloadHistory = [
    { id: 1, name: 'Massey Ferguson 8S', downloadDate: '2024-09-01', type: 'free' },
    { id: 2, name: 'John Deere 8R Series', downloadDate: '2024-08-15', type: 'purchased' },
    { id: 3, name: 'Claas Arion 600', downloadDate: '2024-08-12', type: 'free' }
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'purchased', label: 'Purchased', icon: ShoppingBag },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'downloads', label: 'Downloads', icon: Download },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-16">
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="gaming-card p-8 rounded-xl mb-8"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="w-24 h-24 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center text-2xl font-bold text-white">
                  {user.avatar}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold">{user.username}</h1>
                    <span className="px-3 py-1 bg-gradient-to-r from-neon-purple to-neon-pink rounded-full text-sm font-semibold text-white">
                      {user.role}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-muted-foreground mb-4">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neon-blue">{user.totalDownloads}</div>
                      <div className="text-sm text-muted-foreground">Downloads</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neon-green">{user.favoriteCount}</div>
                      <div className="text-sm text-muted-foreground">Favorites</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neon-purple">{user.purchasedCount}</div>
                      <div className="text-sm text-muted-foreground">Purchased</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neon-orange">{new Date(user.joinDate).getFullYear()}</div>
                      <div className="text-sm text-muted-foreground">Member Since</div>
                    </div>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gaming-border rounded-lg hover:bg-gaming-border/80 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </motion.button>
              </div>
            </motion.div>

            <div className="grid lg:grid-cols-4 gap-8">
              {/* Sidebar Navigation */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-1"
              >
                <div className="gaming-card p-6 rounded-xl">
                  <nav className="space-y-2">
                    {tabs.map((tab) => {
                      const IconComponent = tab.icon
                      return (
                        <motion.button
                          key={tab.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                            activeTab === tab.id
                              ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white'
                              : 'hover:bg-gaming-border text-muted-foreground hover:text-white'
                          }`}
                        >
                          <IconComponent className="h-5 w-5" />
                          <span>{tab.label}</span>
                        </motion.button>
                      )
                    })}
                    
                    <div className="pt-4 border-t border-gaming-border">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all duration-200"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Sign Out</span>
                      </motion.button>
                    </div>
                  </nav>
                </div>
              </motion.div>

              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="lg:col-span-3"
              >
                <div className="gaming-card p-8 rounded-xl">
                  {activeTab === 'overview' && (
                    <div>
                      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
                      
                      <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 border border-neon-blue/30 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Recent Activity</h3>
                            <Calendar className="h-5 w-5 text-neon-blue" />
                          </div>
                          <div className="space-y-3">
                            <div className="text-sm">
                              <span className="text-muted-foreground">Downloaded:</span>
                              <span className="ml-2">Massey Ferguson 8S</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">Purchased:</span>
                              <span className="ml-2">John Deere 8R Series</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">Favorited:</span>
                              <span className="ml-2">Case IH Magnum</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-neon-green/10 to-neon-blue/10 border border-neon-green/30 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Quick Stats</h3>
                            <Star className="h-5 w-5 text-neon-green" />
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total Spent:</span>
                              <span className="font-semibold text-neon-green">$42.97</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Avg Rating Given:</span>
                              <span className="font-semibold">4.6/5</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Account Status:</span>
                              <span className="font-semibold text-neon-purple">Premium</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'purchased' && (
                    <div>
                      <h2 className="text-2xl font-bold mb-6">Purchased Mods</h2>
                      <div className="space-y-4">
                        {purchasedMods.map((mod) => (
                          <div key={mod.id} className="bg-gaming-darker p-6 rounded-lg border border-gaming-border">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-lg font-semibold mb-2">{mod.name}</h3>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  <span>Purchased: {new Date(mod.purchaseDate).toLocaleDateString()}</span>
                                  <span>Downloads: {mod.downloads}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-neon-green">${mod.price}</div>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="mt-2 px-4 py-2 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg text-white text-sm hover-glow transition-all duration-300"
                                >
                                  Download Again
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'favorites' && (
                    <div>
                      <h2 className="text-2xl font-bold mb-6">Favorite Mods</h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        {favoriteMods.map((mod) => (
                          <div key={mod.id} className="bg-gaming-darker p-6 rounded-lg border border-gaming-border">
                            <h3 className="text-lg font-semibold mb-2">{mod.name}</h3>
                            <p className="text-muted-foreground text-sm mb-3">by {mod.author}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-sm">{mod.rating}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Download className="h-4 w-4" />
                                <span>{mod.downloads.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'downloads' && (
                    <div>
                      <h2 className="text-2xl font-bold mb-6">Download History</h2>
                      <div className="space-y-4">
                        {downloadHistory.map((download) => (
                          <div key={download.id} className="bg-gaming-darker p-6 rounded-lg border border-gaming-border">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-lg font-semibold mb-2">{download.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  Downloaded: {new Date(download.downloadDate).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center space-x-3">
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                  download.type === 'purchased' 
                                    ? 'bg-neon-purple/20 text-neon-purple' 
                                    : 'bg-neon-green/20 text-neon-green'
                                }`}>
                                  {download.type === 'purchased' ? 'Purchased' : 'Free'}
                                </span>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="px-4 py-2 bg-gaming-border rounded-lg hover:bg-gaming-border/80 transition-colors"
                                >
                                  Download Again
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'settings' && (
                    <div>
                      <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                      
                      <div className="space-y-6">
                        <div className="bg-gaming-darker p-6 rounded-lg border border-gaming-border">
                          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                            <User className="h-5 w-5" />
                            <span>Profile Information</span>
                          </h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Username</label>
                              <input
                                type="text"
                                value={user.username}
                                className="w-full px-4 py-3 bg-gaming-card border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Email</label>
                              <input
                                type="email"
                                value={user.email}
                                className="w-full px-4 py-3 bg-gaming-card border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="bg-gaming-darker p-6 rounded-lg border border-gaming-border">
                          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                            <Shield className="h-5 w-5" />
                            <span>Security</span>
                          </h3>
                          <div className="space-y-4">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg text-white font-semibold hover-glow transition-all duration-300"
                            >
                              Change Password
                            </motion.button>
                            <div className="text-sm text-muted-foreground">
                              Last password change: Never
                            </div>
                          </div>
                        </div>

                        <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-lg">
                          <h3 className="text-lg font-semibold mb-4 text-red-400">Danger Zone</h3>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg text-white font-semibold transition-colors"
                          >
                            Delete Account
                          </motion.button>
                          <p className="text-sm text-muted-foreground mt-2">
                            This action cannot be undone. All your data will be permanently deleted.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
