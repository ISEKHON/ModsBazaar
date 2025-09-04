'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { User, Download, Heart, ShoppingBag, Settings, Star, Calendar, Eye, LogOut, Edit, Mail, Shield, Package, Gamepad2, Upload, X, Trash2, Play, Pause, ExternalLink } from 'lucide-react'
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
  const [userModStats, setUserModStats] = useState<{
    totalDownloads: number;
    averageRating: number;
    totalMods: number;
  }>({ totalDownloads: 0, averageRating: 0, totalMods: 0 })
  const [loading, setLoading] = useState(true)
  const [dataLoading, setDataLoading] = useState(false)
  const [editableUsername, setEditableUsername] = useState('')
  const [editableEmail, setEditableEmail] = useState('')
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState<ModSubmission | null>(null)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingMod, setEditingMod] = useState<ModSubmission | null>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    shortDescription: '',
    version: '',
    game: 'FS22' as 'FS22' | 'FS25' | 'Both',
    category: '',
    tags: [] as string[],
    type: 'free' as 'free' | 'paid' | 'unlock',
    price: 0,
    unlockCode: '',
    requirements: [] as string[],
    dependencies: [] as string[],
    conflicts: [] as string[]
  })
  const router = useRouter()
  const { user, isAuthenticated, isLoading, logout } = useAuth()

  // Function to handle mod deletion
  const handleDeleteMod = async (submission: ModSubmission) => {
    try {
      setDataLoading(true)
      
      // Check if mod is published and get its ID
      let modId = null;
      if (submission.publishedModId) {
        if (typeof submission.publishedModId === 'object' && submission.publishedModId._id) {
          modId = submission.publishedModId._id;
        } else if (typeof submission.publishedModId === 'string') {
          modId = submission.publishedModId;
        }
      }

      if (modId) {
        // Delete the published mod
        await profileAPI.deleteMod(modId);
        toast.success('Mod deleted successfully');
      } else {
        toast.info('Mod was not published, only removing from submissions');
      }

      // Refresh submissions list
      await loadSubmissions();
      
    } catch (error: any) {
      console.error('Error deleting mod:', error);
      toast.error(error.message || 'Failed to delete mod');
    } finally {
      setDataLoading(false);
    }
  }

  // Function to handle mod unpublishing
  const handleUnpublishMod = async (submission: ModSubmission) => {
    try {
      setDataLoading(true)
      
      // Check if mod is published and get its ID
      let modId = null;
      if (submission.publishedModId) {
        if (typeof submission.publishedModId === 'object' && submission.publishedModId._id) {
          modId = submission.publishedModId._id;
        } else if (typeof submission.publishedModId === 'string') {
          modId = submission.publishedModId;
        }
      }

      if (modId) {
        // Unpublish the mod
        await profileAPI.unpublishMod(modId);
        toast.success('Mod unpublished successfully');
        
        // Refresh submissions list
        await loadSubmissions();
      } else {
        toast.info('Mod is not currently published');
      }
      
    } catch (error: any) {
      console.error('Error unpublishing mod:', error);
      toast.error(error.message || 'Failed to unpublish mod');
    } finally {
      setDataLoading(false);
    }
  }

  // Function to handle mod republishing
  const handleRepublishMod = async (submission: ModSubmission) => {
    try {
      setDataLoading(true)
      
      // Check if mod has a published mod ID
      let modId = null;
      if (submission.publishedModId) {
        if (typeof submission.publishedModId === 'object' && submission.publishedModId._id) {
          modId = submission.publishedModId._id;
        } else if (typeof submission.publishedModId === 'string') {
          modId = submission.publishedModId;
        }
      }

      if (modId) {
        // Republish the mod
        await profileAPI.republishMod(modId);
        toast.success('Mod republished successfully');
        
        // Refresh submissions list
        await loadSubmissions();
      } else {
        toast.info('Mod cannot be republished - no published version found');
      }
      
    } catch (error: any) {
      console.error('Error republishing mod:', error);
      toast.error(error.message || 'Failed to republish mod');
    } finally {
      setDataLoading(false);
    }
  }

  // Function to handle mod editing
  const handleEditMod = (submission: ModSubmission) => {
    setEditingMod(submission);
    
    // Pre-populate form with current mod data
    setEditForm({
      name: submission.name,
      description: submission.description,
      shortDescription: submission.shortDescription,
      version: submission.version,
      game: submission.game,
      category: submission.category,
      tags: submission.tags || [],
      type: submission.type,
      price: submission.price || 0,
      unlockCode: submission.unlockCode || '',
      requirements: submission.requirements || [],
      dependencies: submission.dependencies || [],
      conflicts: submission.conflicts || []
    });
    
    setShowEditModal(true);
  }

  // Function to submit mod edits
  const handleSubmitEdit = async () => {
    if (!editingMod || !editingMod.publishedModId) {
      toast.error('No mod selected for editing');
      return;
    }

    try {
      setDataLoading(true);
      
      let modId = null;
      if (typeof editingMod.publishedModId === 'object' && editingMod.publishedModId._id) {
        modId = editingMod.publishedModId._id;
      } else if (typeof editingMod.publishedModId === 'string') {
        modId = editingMod.publishedModId;
      }

      if (modId) {
        await profileAPI.editMod(modId, editForm);
        toast.success('Mod updated successfully');
        setShowEditModal(false);
        setEditingMod(null);
        
        // Refresh submissions list
        await loadSubmissions();
      } else {
        toast.error('Cannot edit mod - invalid mod ID');
      }
      
    } catch (error: any) {
      console.error('Error updating mod:', error);
      toast.error(error.message || 'Failed to update mod');
    } finally {
      setDataLoading(false);
    }
  }

  // Function to load submissions separately
  const loadSubmissions = async () => {
    try {
      const { submissions: mySubmissions } = await submissionService.getMySubmissions()
      setSubmissions(mySubmissions)
    } catch (error) {
      console.error('Failed to load submissions:', error)
      toast.error('Failed to load submissions. Please try again.')
    }
  }

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
        const [profile, purchased, favorites, downloads, modStats] = await Promise.all([
          profileAPI.getProfile(),
          profileAPI.getPurchasedMods(),
          profileAPI.getFavoriteMods(),
          profileAPI.getDownloadHistory(),
          profileAPI.getUserModStats()
        ])
        
        setProfileData(profile)
        setPurchasedMods(purchased)
        setFavoriteMods(favorites)
        setDownloadHistory(downloads)
        setUserModStats(modStats)
        
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
  }, [activeTab, isAuthenticated, user, loading, purchasedMods.length, favoriteMods.length, downloadHistory.length, submissions.length, userModStats.totalMods])

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
                      <div className="text-2xl font-bold text-neon-blue">{userModStats.totalDownloads.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Total Downloads</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neon-green">{userModStats.averageRating > 0 ? userModStats.averageRating.toFixed(1) : '0.0'}</div>
                      <div className="text-sm text-muted-foreground">Avg Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neon-purple">{userModStats.totalMods}</div>
                      <div className="text-sm text-muted-foreground">Uploaded Mods</div>
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
                              <span className="ml-2">{userModStats.totalDownloads.toLocaleString()} across {userModStats.totalMods} mods</span>
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
                              <span className="text-muted-foreground">Purchased Mods:</span>
                              <span className="font-semibold">{purchasedMods?.length || 0}</span>
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
                                <div className="flex-1">
                                  <div className="flex items-center gap-4 mb-2">
                                    {mod.thumbnail && (
                                      <img 
                                        src={mod.thumbnail} 
                                        alt={mod.name}
                                        className="w-16 h-16 object-cover rounded-lg border border-gaming-border"
                                      />
                                    )}
                                    <div>
                                      <h3 className="text-lg font-semibold mb-1">{mod.name}</h3>
                                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                        <span>Category: {mod.category}</span>
                                        <span>Game: {mod.game}</span>
                                        <span>Downloads: {mod.downloads?.toLocaleString()}</span>
                                        {mod.rating > 0 && (
                                          <div className="flex items-center">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                                            <span>{mod.rating.toFixed(1)}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  {mod.description && (
                                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                      {mod.description}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right ml-4">
                                  <div className="text-lg font-bold text-neon-green mb-2">${mod.price}</div>
                                  <div className="space-y-2">
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => window.open(`/mods/${mod.slug}`, '_blank')}
                                      className="w-full px-4 py-2 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg text-white text-sm hover-glow transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                      <Download className="h-4 w-4" />
                                      Download Again
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => window.open(`/mods/${mod.slug}`, '_blank')}
                                      className="w-full px-4 py-2 bg-gaming-border hover:bg-gaming-lighter rounded-lg text-white text-sm transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                      View Details
                                    </motion.button>
                                  </div>
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
                              {mod.author && (
                                <p className="text-muted-foreground text-sm mb-3">by {mod.author.name}</p>
                              )}
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
                          {downloadHistory.map((download, index) => (
                            <div key={`${download._id}-${download.downloadedAt}-${index}`} className="bg-gaming-darker p-6 rounded-lg border border-gaming-border">
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
                                      onClick={() => setSelectedSubmission(submission)}
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
                                  <div className={`mt-4 p-4 border rounded-lg ${
                                    submission.publishedModId && typeof submission.publishedModId === 'object' && submission.publishedModId.isActive !== false
                                      ? 'bg-green-500/10 border-green-500/30'
                                      : 'bg-yellow-500/10 border-yellow-500/30'
                                  }`}>
                                    <div className="flex items-center justify-between">
                                      <div className={`flex items-center space-x-2 ${
                                        submission.publishedModId && typeof submission.publishedModId === 'object' && submission.publishedModId.isActive !== false
                                          ? 'text-green-400'
                                          : 'text-yellow-400'
                                      }`}>
                                        <Package className="h-4 w-4" />
                                        <span className="font-medium">
                                          {submission.publishedModId && typeof submission.publishedModId === 'object' && submission.publishedModId.isActive !== false
                                            ? 'Published & Live'
                                            : 'Published but Unpublished'
                                          }
                                        </span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        {/* View Published Mod Button - always show if published */}
                                        <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                          console.log('Published Mod Data:', submission.publishedModId);
                                          
                                          // Handle both object and string cases
                                          let slug = null;
                                          if (typeof submission.publishedModId === 'object' && submission.publishedModId?.slug) {
                                            slug = submission.publishedModId.slug;
                                          } else if (typeof submission.publishedModId === 'string') {
                                            // If it's just a string ID, we can try to navigate to /mods/id
                                            // but this is not ideal as mods usually use slugs
                                            console.warn('publishedModId is string, needs population');
                                            toast.error('Unable to view published mod - data not properly loaded. Please refresh the page.');
                                            return;
                                          }
                                          
                                          if (slug) {
                                            router.push(`/mods/${slug}`);
                                          } else {
                                            console.error('No slug found for published mod:', submission.publishedModId);
                                            toast.error('Unable to view published mod - missing slug');
                                          }
                                        }}
                                        className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-sm text-green-400 hover:bg-green-500/30 transition-colors"
                                      >
                                        View Published Mod
                                      </motion.button>
                                      
                                      {/* Edit Button */}
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                          handleEditMod(submission);
                                        }}
                                        className="px-3 py-2 bg-neon-blue/20 border border-neon-blue/30 rounded-lg text-sm text-neon-blue hover:bg-neon-blue/30 transition-colors"
                                        disabled={dataLoading}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </motion.button>
                                      
                                      {/* Publish/Unpublish Button - Based on isActive status */}
                                      {submission.publishedModId && typeof submission.publishedModId === 'object' && submission.publishedModId.isActive !== false ? (
                                        // Mod is currently published - show unpublish button
                                        <motion.button
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          onClick={() => {
                                            if (confirm(`Are you sure you want to unpublish "${submission.name}"? This will remove it from public view but keep your submission.`)) {
                                              handleUnpublishMod(submission);
                                            }
                                          }}
                                          className="px-3 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-sm text-yellow-400 hover:bg-yellow-500/30 transition-colors"
                                          disabled={dataLoading}
                                          title="Unpublish mod"
                                        >
                                          <Pause className="h-4 w-4" />
                                        </motion.button>
                                      ) : (
                                        // Mod is unpublished - show republish button
                                        <motion.button
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          onClick={() => {
                                            if (confirm(`Are you sure you want to republish "${submission.name}"? This will make it publicly visible again.`)) {
                                              handleRepublishMod(submission);
                                            }
                                          }}
                                          className="px-3 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-sm text-blue-400 hover:bg-blue-500/30 transition-colors"
                                          disabled={dataLoading}
                                          title="Republish mod"
                                        >
                                          <Play className="h-4 w-4" />
                                        </motion.button>
                                      )}
                                      
                                      {/* Delete Button */}
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                          if (confirm(`Are you sure you want to delete "${submission.name}"? This action cannot be undone.`)) {
                                            handleDeleteMod(submission);
                                          }
                                        }}
                                        className="px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-sm text-red-400 hover:bg-red-500/30 transition-colors"
                                        disabled={dataLoading}
                                        title="Delete mod permanently"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </motion.button>
                                      </div>
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
      
      {/* Submission Details Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gaming-card border border-gaming-border rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Submission Details</h3>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-muted-foreground hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-neon-blue mb-2">{selectedSubmission.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedSubmission.shortDescription}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Type:</span>
                    <span className="ml-2 text-sm">{submissionService.getTypeDisplay(selectedSubmission.type).text}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Game:</span>
                    <span className="ml-2 text-sm">{selectedSubmission.game}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Category:</span>
                    <span className="ml-2 text-sm">{selectedSubmission.category}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Version:</span>
                    <span className="ml-2 text-sm">{selectedSubmission.version}</span>
                  </div>
                </div>
                
                <div>
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${submissionService.getStatusDisplay(selectedSubmission.status).bgColor} ${submissionService.getStatusDisplay(selectedSubmission.status).color}`}>
                    {submissionService.getStatusDisplay(selectedSubmission.status).text}
                  </span>
                </div>
                
                <div>
                  <span className="text-sm text-muted-foreground">Submitted:</span>
                  <span className="ml-2 text-sm">{submissionService.getTimeSince(selectedSubmission.submittedAt)}</span>
                </div>
                
                {selectedSubmission.description && (
                  <div>
                    <h5 className="font-semibold mb-2">Description</h5>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedSubmission.description}</p>
                  </div>
                )}
                
                {selectedSubmission.rejectionReason && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <h5 className="font-semibold text-red-400 mb-2">Rejection Reason</h5>
                    <p className="text-sm text-red-300">{selectedSubmission.rejectionReason}</p>
                  </div>
                )}
                
                {selectedSubmission.reviewNotes && (
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <h5 className="font-semibold text-blue-400 mb-2">Review Notes</h5>
                    <p className="text-sm text-blue-300">{selectedSubmission.reviewNotes}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Mod Modal */}
      {showEditModal && editingMod && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gaming-card border border-gaming-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Edit Mod</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingMod(null);
                  }}
                  className="p-2 hover:bg-gaming-border rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-neon-blue">Basic Information</h4>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Mod Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full px-3 py-2 bg-gaming-border border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
                      placeholder="Enter mod name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Short Description</label>
                    <input
                      type="text"
                      value={editForm.shortDescription}
                      onChange={(e) => setEditForm({...editForm, shortDescription: e.target.value})}
                      className="w-full px-3 py-2 bg-gaming-border border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
                      placeholder="Brief description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Version</label>
                    <input
                      type="text"
                      value={editForm.version}
                      onChange={(e) => setEditForm({...editForm, version: e.target.value})}
                      className="w-full px-3 py-2 bg-gaming-border border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
                      placeholder="e.g., 1.0.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Game</label>
                    <select
                      value={editForm.game}
                      onChange={(e) => setEditForm({...editForm, game: e.target.value as 'FS22' | 'FS25' | 'Both'})}
                      className="w-full px-3 py-2 bg-gaming-border border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
                    >
                      <option value="FS22">Farming Simulator 22</option>
                      <option value="FS25">Farming Simulator 25</option>
                      <option value="Both">Both Games</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                      className="w-full px-3 py-2 bg-gaming-border border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
                    >
                      <option value="">Select Category</option>
                      <option value="Vehicles">Vehicles</option>
                      <option value="Implements">Implements</option>
                      <option value="Maps">Maps</option>
                      <option value="Buildings">Buildings</option>
                      <option value="Animals">Animals</option>
                      <option value="Scripts">Scripts</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-neon-blue">Additional Information</h4>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Type</label>
                    <select
                      value={editForm.type}
                      onChange={(e) => setEditForm({...editForm, type: e.target.value as 'free' | 'paid' | 'unlock'})}
                      className="w-full px-3 py-2 bg-gaming-border border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
                    >
                      <option value="free">Free</option>
                      <option value="paid">Paid</option>
                      <option value="unlock">Unlock Code</option>
                    </select>
                  </div>

                  {editForm.type === 'paid' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Price ($)</label>
                      <input
                        type="number"
                        value={editForm.price}
                        onChange={(e) => setEditForm({...editForm, price: parseFloat(e.target.value) || 0})}
                        className="w-full px-3 py-2 bg-gaming-border border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  )}

                  {editForm.type === 'unlock' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Unlock Code</label>
                      <input
                        type="text"
                        value={editForm.unlockCode}
                        onChange={(e) => setEditForm({...editForm, unlockCode: e.target.value})}
                        className="w-full px-3 py-2 bg-gaming-border border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
                        placeholder="Enter unlock code"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={editForm.tags.join(', ')}
                      onChange={(e) => setEditForm({
                        ...editForm, 
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                      })}
                      className="w-full px-3 py-2 bg-gaming-border border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
                      placeholder="e.g., tractor, farming, vehicle"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Requirements (comma separated)</label>
                    <input
                      type="text"
                      value={editForm.requirements.join(', ')}
                      onChange={(e) => setEditForm({
                        ...editForm, 
                        requirements: e.target.value.split(',').map(req => req.trim()).filter(req => req)
                      })}
                      className="w-full px-3 py-2 bg-gaming-border border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
                      placeholder="e.g., Base Game, DLC Pack"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <label className="block text-sm font-medium mb-2">Full Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  className="w-full px-3 py-2 bg-gaming-border border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
                  rows={6}
                  placeholder="Detailed description of your mod..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingMod(null);
                  }}
                  className="px-6 py-2 bg-gaming-border hover:bg-gaming-border/80 rounded-lg transition-colors"
                  disabled={dataLoading}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmitEdit}
                  className="px-6 py-2 bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-blue/80 hover:to-neon-purple/80 rounded-lg text-white font-medium transition-all duration-300"
                  disabled={dataLoading}
                >
                  {dataLoading ? 'Saving...' : 'Save Changes'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      <Footer />
    </div>
  )
}
