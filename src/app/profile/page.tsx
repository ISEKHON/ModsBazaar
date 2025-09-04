'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { User, Download, Heart, ShoppingBag, Settings, Star, Calendar, Eye, LogOut, Edit, Mail, Shield, Package, Gamepad2, Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { profileAPI, ModDetails, UserProfile } from '@/services/profile'
import { submissionService, ModSubmission } from '@/services/submissions'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [profileData, setProfileData] = useState<UserProfile | null>(null)
  const [purchasedMods, setPurchasedMods] = useState<ModDetails[]>([])
  const [favoriteMods, setFavoriteMods] = useState<ModDetails[]>([])
  const [downloadHistory, setDownloadHistory] = useState<any[]>([])
  const [submissions, setSubmissions] = useState<ModSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [dataLoading, setDataLoading] = useState(false)
  const [editableUsername, setEditableUsername] = useState('')
  const [editableEmail, setEditableEmail] = useState('')
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const router = useRouter()
  const { user, isAuthenticated, isLoading, logout } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  // Load profile data
  useEffect(() => {
    const loadProfileData = async () => {
      if (!isAuthenticated || !user) return
      
      try {
        setLoading(true)
        
        // Load profile data in parallel
        const [profile, purchased, favorites, downloads] = await Promise.all([
          profileAPI.getProfile(),
          profileAPI.getPurchasedMods(),
          profileAPI.getFavoriteMods(),
          profileAPI.getDownloadHistory()
        ])
        
        setProfileData(profile)
        setPurchasedMods(purchased)
        setFavoriteMods(favorites)
        setDownloadHistory(downloads)
        
        // Initialize editable fields
        setEditableUsername(profile.username || '')
        setEditableEmail(profile.email || '')
      } catch (error) {
        console.error('Failed to load profile data:', error)
        toast.error('Failed to load profile data. Please refresh the page.')
      } finally {
        setLoading(false)
      }
    }

    loadProfileData()
  }, [isAuthenticated, user])

  // Load specific tab data when tab changes
  useEffect(() => {
    const loadTabData = async () => {
      if (!isAuthenticated || !user || loading) return
      
      try {
        setDataLoading(true)
        
        switch (activeTab) {
          case 'purchased':
            if (purchasedMods.length === 0) {
              const purchased = await profileAPI.getPurchasedMods()
              setPurchasedMods(purchased)
            }
            break
          case 'favorites':
            if (favoriteMods.length === 0) {
              const favorites = await profileAPI.getFavoriteMods()
              setFavoriteMods(favorites)
            }
            break
          case 'downloads':
            if (downloadHistory.length === 0) {
              const downloads = await profileAPI.getDownloadHistory()
              setDownloadHistory(downloads)
            }
            break
          case 'submissions':
            if (submissions.length === 0) {
              const { submissions: mySubmissions } = await submissionService.getMySubmissions()
              setSubmissions(mySubmissions)
            }
            break
        }
      } catch (error) {
        console.error('Failed to load tab data:', error)
        toast.error(`Failed to load ${activeTab} data. Please try again.`)
      } finally {
        setDataLoading(false)
      }
    }

    loadTabData()
  }, [activeTab, isAuthenticated, user, loading, purchasedMods.length, favoriteMods.length, downloadHistory.length, submissions.length])

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setDataLoading(true)
      const updatedProfile = await profileAPI.updateProfile({
        username: editableUsername,
        email: editableEmail
      })
      setProfileData(updatedProfile)
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Failed to update profile:', error)
      toast.error('Failed to update profile. Please try again.')
    } finally {
      setDataLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    try {
      setDataLoading(true)
      await profileAPI.changePassword(currentPassword, newPassword)
      toast.success('Password changed successfully!')
      setShowPasswordChange(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      // Reload profile to get updated lastPasswordChange
      const updatedProfile = await profileAPI.getProfile()
      setProfileData(updatedProfile)
    } catch (error) {
      console.error('Failed to change password:', error)
      toast.error('Failed to change password. Please check your current password.')
    } finally {
      setDataLoading(false)
    }
  }

  // Use real profile data or fallback to auth user
  const currentUser = profileData || user

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'purchased', label: 'Purchased', icon: ShoppingBag },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'downloads', label: 'Downloads', icon: Download },
    { id: 'submissions', label: 'My Submissions', icon: Upload },
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
                  {currentUser?.username ? currentUser.username.substring(0, 2).toUpperCase() : 'U'}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold">{currentUser?.username || 'User'}</h1>
                    <span className="px-3 py-1 bg-gradient-to-r from-neon-purple to-neon-pink rounded-full text-sm font-semibold text-white">
                      {currentUser?.role ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1) : 'User'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-muted-foreground mb-4">
                    <Mail className="h-4 w-4" />
                    <span>{currentUser?.email || 'user@example.com'}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neon-blue">{downloadHistory?.length || 0}</div>
                      <div className="text-sm text-muted-foreground">Downloads</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neon-green">{favoriteMods?.length || 0}</div>
                      <div className="text-sm text-muted-foreground">Favorites</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neon-purple">{purchasedMods?.length || 0}</div>
                      <div className="text-sm text-muted-foreground">Owned Mods</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neon-orange">{profileData?.joinedAt ? new Date(profileData.joinedAt).getFullYear() : new Date().getFullYear()}</div>
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
                        onClick={handleLogout}
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
                      
                      {/* Quick Actions */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.1 }}
                          className="bg-gradient-to-r from-neon-green/10 to-neon-blue/10 border border-neon-green/30 rounded-lg p-6 hover:border-neon-green transition-colors cursor-pointer"
                          onClick={() => router.push('/mods')}
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <Gamepad2 className="h-6 w-6 text-neon-green" />
                            <h3 className="text-xl font-bold">Browse Mods</h3>
                          </div>
                          <p className="text-muted-foreground">
                            Discover and download amazing mods for your favorite games
                          </p>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className="bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 border border-neon-blue/30 rounded-lg p-6 hover:border-neon-blue transition-colors cursor-pointer"
                          onClick={() => setActiveTab('downloads')}
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <Package className="h-6 w-6 text-neon-blue" />
                            <h3 className="text-xl font-bold">My Downloads</h3>
                          </div>
                          <p className="text-muted-foreground">
                            View and manage your downloaded mods
                          </p>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                          className="bg-gradient-to-r from-purple-500/10 to-neon-pink/10 border border-purple-500/30 rounded-lg p-6 hover:border-purple-500 transition-colors cursor-pointer"
                          onClick={() => setActiveTab('settings')}
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <Settings className="h-6 w-6 text-purple-500" />
                            <h3 className="text-xl font-bold">Settings</h3>
                          </div>
                          <p className="text-muted-foreground">
                            Customize your profile and preferences
                          </p>
                        </motion.div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 border border-neon-blue/30 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Recent Activity</h3>
                            <Calendar className="h-5 w-5 text-neon-blue" />
                          </div>
                          <div className="space-y-3">
                            <div className="text-sm">
                              <span className="text-muted-foreground">Account created:</span>
                              <span className="ml-2">{profileData?.joinedAt ? new Date(profileData.joinedAt).toLocaleDateString() : 'Today'}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">Last active:</span>
                              <span className="ml-2">{profileData?.lastActive ? new Date(profileData.lastActive).toLocaleDateString() : 'Today'}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">Total downloads:</span>
                              <span className="ml-2">{downloadHistory?.length || 0} mods</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-neon-green/10 to-neon-blue/10 border border-neon-green/30 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Account Info</h3>
                            <Star className="h-5 w-5 text-neon-green" />
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Account Status:</span>
                              <span className="font-semibold text-neon-green">
                                {profileData?.isVerified ? 'Verified' : 'Unverified'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Role:</span>
                              <span className="font-semibold text-neon-purple">
                                {profileData?.role ? profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1) : 'User'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Favorite Mods:</span>
                              <span className="font-semibold">{favoriteMods?.length || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total Spent:</span>
                              <span className="font-semibold text-neon-green">${profileData?.totalSpent?.toFixed(2) || '0.00'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'purchased' && (
                    <div>
                      <h2 className="text-2xl font-bold mb-6">Purchased Mods</h2>
                      {dataLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        </div>
                      ) : purchasedMods.length > 0 ? (
                        <div className="space-y-4">
                          {purchasedMods.map((mod) => (
                            <div key={mod._id} className="bg-gaming-darker p-6 rounded-lg border border-gaming-border">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="text-lg font-semibold mb-2">{mod.name}</h3>
                                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                    <span>Category: {mod.category}</span>
                                    <span>Game: {mod.game}</span>
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
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No purchased mods yet</p>
                          <p className="text-sm">Browse our premium mods to get started!</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'favorites' && (
                    <div>
                      <h2 className="text-2xl font-bold mb-6">Favorite Mods</h2>
                      {dataLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        </div>
                      ) : favoriteMods.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-4">
                          {favoriteMods.map((mod) => (
                            <div key={mod._id} className="bg-gaming-darker p-6 rounded-lg border border-gaming-border">
                              <h3 className="text-lg font-semibold mb-2">{mod.name}</h3>
                              <p className="text-muted-foreground text-sm mb-3">by {mod.author.name}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                  <span className="text-sm">{mod.rating.toFixed(1)}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                  <Download className="h-4 w-4" />
                                  <span>{mod.downloads.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No favorite mods yet</p>
                          <p className="text-sm">Start favoriting mods to see them here!</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'downloads' && (
                    <div>
                      <h2 className="text-2xl font-bold mb-6">Download History</h2>
                      {dataLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        </div>
                      ) : downloadHistory.length > 0 ? (
                        <div className="space-y-4">
                          {downloadHistory.map((download) => (
                            <div key={download._id} className="bg-gaming-darker p-6 rounded-lg border border-gaming-border">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="text-lg font-semibold mb-2">{download.name}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    Downloaded: {new Date(download.downloadedAt).toLocaleDateString()}
                                  </p>
                                  {download.downloadCount > 1 && (
                                    <p className="text-sm text-muted-foreground">
                                      Downloaded {download.downloadCount} times
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center space-x-3">
                                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                    download.type === 'purchased' 
                                      ? 'bg-neon-purple/20 text-neon-purple' 
                                      : download.type === 'unlock'
                                      ? 'bg-neon-orange/20 text-neon-orange'
                                      : 'bg-neon-green/20 text-neon-green'
                                  }`}>
                                    {download.type === 'purchased' ? 'Purchased' : download.type === 'unlock' ? 'Unlocked' : 'Free'}
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
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Download className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No downloads yet</p>
                          <p className="text-sm">Start downloading mods to see them here!</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'submissions' && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">My Submissions</h2>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => router.push('/submit-mod')}
                          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg text-white font-medium hover-glow transition-all duration-300"
                        >
                          <Upload className="h-5 w-5" />
                          <span>Submit New Mod</span>
                        </motion.button>
                      </div>

                      {dataLoading ? (
                        <div className="flex justify-center py-12">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue"></div>
                        </div>
                      ) : submissions.length > 0 ? (
                        <div className="space-y-4">
                          {submissions.map((submission) => {
                            const statusDisplay = submissionService.getStatusDisplay(submission.status)
                            const typeDisplay = submissionService.getTypeDisplay(submission.type)
                            const timeSince = submissionService.getTimeSince(submission.submittedAt)
                            
                            return (
                              <motion.div
                                key={submission._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gaming-darker p-6 rounded-lg border border-gaming-border hover:border-neon-blue/50 transition-colors"
                              >
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                      <h3 className="text-xl font-semibold">{submission.name}</h3>
                                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusDisplay.bgColor} ${statusDisplay.color}`}>
                                        {statusDisplay.text}
                                      </span>
                                      <span className={`px-2 py-1 rounded text-xs font-medium ${typeDisplay.color}`}>
                                        {typeDisplay.icon} {typeDisplay.text}
                                      </span>
                                    </div>
                                    <p className="text-muted-foreground mb-2">{submission.shortDescription}</p>
                                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                      <span>Version {submission.version}</span>
                                      <span>•</span>
                                      <span>{submission.game}</span>
                                      <span>•</span>
                                      <span>{submission.category}</span>
                                      <span>•</span>
                                      <span>Submitted {timeSince}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {submission.status === 'pending' && (
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => router.push(`/submissions/${submission._id}/edit`)}
                                        className="px-4 py-2 bg-gaming-card border border-gaming-border rounded-lg text-sm hover:border-neon-blue transition-colors"
                                      >
                                        <Edit className="h-4 w-4" />
                                      </motion.button>
                                    )}
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => router.push(`/submissions/${submission._id}`)}
                                      className="px-4 py-2 bg-neon-blue/20 border border-neon-blue/30 rounded-lg text-sm text-neon-blue hover:bg-neon-blue/30 transition-colors"
                                    >
                                      View Details
                                    </motion.button>
                                  </div>
                                </div>

                                {submission.status === 'rejected' && submission.rejectionReason && (
                                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                    <div className="flex items-center space-x-2 text-red-400 mb-2">
                                      <Shield className="h-4 w-4" />
                                      <span className="font-medium">Rejection Reason</span>
                                    </div>
                                    <p className="text-sm text-red-300">{submission.rejectionReason}</p>
                                  </div>
                                )}

                                {submission.status === 'published' && submission.publishedModId && (
                                  <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-2 text-green-400">
                                        <Package className="h-4 w-4" />
                                        <span className="font-medium">Published Successfully</span>
                                      </div>
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => router.push(`/mods/${submission.publishedModId?.slug}`)}
                                        className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-sm text-green-400 hover:bg-green-500/30 transition-colors"
                                      >
                                        View Published Mod
                                      </motion.button>
                                    </div>
                                  </div>
                                )}
                              </motion.div>
                            )
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">
                          <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No submissions yet</p>
                          <p className="text-sm mb-6">Submit your first mod to get started!</p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push('/submit-mod')}
                            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg text-white font-medium hover-glow transition-all duration-300"
                          >
                            <Upload className="h-5 w-5" />
                            <span>Submit Your First Mod</span>
                          </motion.button>
                        </div>
                      )}
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
                                value={editableUsername}
                                onChange={(e) => setEditableUsername(e.target.value)}
                                className="w-full px-4 py-3 bg-gaming-card border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
                                placeholder="Enter username"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Email</label>
                              <input
                                type="email"
                                value={editableEmail}
                                onChange={(e) => setEditableEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-gaming-card border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
                                placeholder="Enter email"
                              />
                            </div>
                          </div>
                          
                          <div className="mt-6">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handleSaveProfile}
                              disabled={dataLoading}
                              className="px-6 py-3 bg-gradient-to-r from-neon-green to-neon-blue rounded-lg text-white font-semibold hover-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {dataLoading ? 'Saving...' : 'Save Changes'}
                            </motion.button>
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
                              onClick={() => setShowPasswordChange(!showPasswordChange)}
                              className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg text-white font-semibold hover-glow transition-all duration-300"
                            >
                              {showPasswordChange ? 'Cancel' : 'Change Password'}
                            </motion.button>
                            <div className="text-sm text-muted-foreground">
                              Last password change: {profileData?.lastPasswordChange ? new Date(profileData.lastPasswordChange).toLocaleDateString() : 'Never'}
                            </div>
                            
                            {showPasswordChange && (
                              <div className="mt-4 space-y-4 p-4 bg-gaming-card rounded-lg border border-gaming-border">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Current Password</label>
                                  <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full px-4 py-2 bg-gaming-darker border border-gaming-border rounded-lg text-white focus:border-neon-blue focus:outline-none"
                                    placeholder="Enter current password"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">New Password</label>
                                  <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2 bg-gaming-darker border border-gaming-border rounded-lg text-white focus:border-neon-blue focus:outline-none"
                                    placeholder="Enter new password"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Confirm New Password</label>
                                  <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2 bg-gaming-darker border border-gaming-border rounded-lg text-white focus:border-neon-blue focus:outline-none"
                                    placeholder="Confirm new password"
                                  />
                                </div>
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={handlePasswordChange}
                                  disabled={dataLoading || !currentPassword || !newPassword || !confirmPassword}
                                  className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-colors"
                                >
                                  {dataLoading ? 'Changing Password...' : 'Update Password'}
                                </motion.button>
                              </div>
                            )}
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
