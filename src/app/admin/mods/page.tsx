'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Package, 
  Eye, 
  Download, 
  Star, 
  Calendar, 
  User, 
  Search, 
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  TrendingUp,
  Award,
  Ban,
  CheckCircle,
  Clock,
  XCircle,
  Flame
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import api from '@/lib/api'
import { toast } from 'sonner'
import { adminService } from '@/services/admin'

interface AdminMod {
  _id: string
  name: string
  slug: string
  type: 'free' | 'paid' | 'unlock'
  price?: number
  thumbnail: string
  downloads: number
  views: number
  rating: number
  game: 'FS22' | 'FS25' | 'Both'
  category: string
  status: 'approved' | 'pending' | 'rejected'
  isFeatured: boolean
  isPopular?: boolean
  author: {
    id: {
      _id: string
      username: string
    }
  }
  createdAt: string
  updatedAt: string
}

export default function AdminMods() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [mods, setMods] = useState<AdminMod[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [gameFilter, setGameFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('newest')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      toast.error('Access denied. Admin privileges required.')
      router.push('/')
      return
    }

    if (user && user.role === 'admin') {
      fetchMods()
    }
  }, [user, isLoading, router])

  const fetchMods = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/mods')
      if (response.data.status === 'success') {
        setMods(response.data.data.mods || [])
      }
    } catch (error) {
      console.error('Failed to fetch admin mods:', error)
      toast.error('Failed to load mods')
    } finally {
      setLoading(false)
    }
  }

  const handleFeatureMod = async (modId: string, featured: boolean) => {
    try {
      setActionLoading(modId)
      if (featured) {
        await adminService.featureMod(modId)
        toast.success('Mod featured successfully')
      } else {
        await adminService.unfeatureMod(modId)
        toast.success('Mod unfeatured successfully')
      }
      await fetchMods()
    } catch (error) {
      console.error('Failed to update mod feature status:', error)
      toast.error('Failed to update feature status')
    } finally {
      setActionLoading(null)
    }
  }

  const handlePopularMod = async (modId: string, popular: boolean) => {
    try {
      setActionLoading(modId)
      if (popular) {
        await adminService.markModPopular(modId)
        toast.success('Mod marked as popular')
      } else {
        await adminService.unmarkModPopular(modId)
        toast.success('Mod unmarked from popular')
      }
      await fetchMods()
    } catch (error) {
      console.error('Failed to update mod popular status:', error)
      toast.error('Failed to update popular status')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteMod = async (modId: string) => {
    if (!confirm('Are you sure you want to delete this mod? This action cannot be undone.')) {
      return
    }

    try {
      setActionLoading(modId)
      await api.delete(`/admin/mods/${modId}`)
      toast.success('Mod deleted successfully')
      await fetchMods()
    } catch (error) {
      console.error('Failed to delete mod:', error)
      toast.error('Failed to delete mod')
    } finally {
      setActionLoading(null)
    }
  }

  const filteredMods = mods.filter(mod => {
    const matchesSearch = mod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mod.author.id.username.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || mod.status === statusFilter
    const matchesGame = gameFilter === 'all' || mod.game === gameFilter

    return matchesSearch && matchesStatus && matchesGame
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'downloads':
        return b.downloads - a.downloads
      case 'rating':
        return b.rating - a.rating
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue"></div>
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gaming-dark">
      {/* Header */}
      <div className="bg-gaming-darker border-b border-gaming-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Package className="h-8 w-8 text-neon-blue" />
              <h1 className="text-xl font-bold text-white">Manage Mods</h1>
            </div>
            <Link 
              href="/admin"
              className="text-neon-blue hover:text-neon-purple transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gaming-card p-6 rounded-xl mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="h-5 w-5 text-muted-foreground absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search mods..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gaming-darker border border-gaming-border rounded-lg text-white placeholder-muted-foreground focus:border-neon-blue focus:outline-none"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-gaming-darker border border-gaming-border rounded-lg text-white focus:border-neon-blue focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Game Filter */}
            <select
              value={gameFilter}
              onChange={(e) => setGameFilter(e.target.value)}
              className="px-4 py-2 bg-gaming-darker border border-gaming-border rounded-lg text-white focus:border-neon-blue focus:outline-none"
            >
              <option value="all">All Games</option>
              <option value="FS22">FS22</option>
              <option value="FS25">FS25</option>
              <option value="Both">Both</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-gaming-darker border border-gaming-border rounded-lg text-white focus:border-neon-blue focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="downloads">Most Downloads</option>
              <option value="rating">Highest Rating</option>
              <option value="name">Name A-Z</option>
            </select>

            {/* Stats */}
            <div className="text-center lg:text-right">
              <p className="text-sm text-muted-foreground">
                Showing {filteredMods.length} of {mods.length} mods
              </p>
            </div>
          </div>
        </motion.div>

        {/* Mods List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {filteredMods.length === 0 ? (
            <div className="gaming-card p-12 rounded-xl text-center">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No mods found</h3>
              <p className="text-muted-foreground">Try adjusting your search filters</p>
            </div>
          ) : (
            filteredMods.map((mod, index) => (
              <motion.div
                key={mod._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="gaming-card p-6 rounded-xl"
              >
                <div className="flex items-start space-x-4">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={mod.thumbnail}
                      alt={mod.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Status Badge */}
                    <div className="absolute top-1 left-1">
                      {mod.status === 'approved' && (
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      )}
                      {mod.status === 'pending' && (
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      )}
                      {mod.status === 'rejected' && (
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-bold text-white truncate">
                            {mod.name}
                          </h3>
                          
                          {/* Badges */}
                          <div className="flex items-center space-x-1">
                            {mod.isFeatured && (
                              <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-bold text-white flex items-center gap-1">
                                <Award className="h-3 w-3" />
                                FEATURED
                              </span>
                            )}
                            {mod.isPopular && (
                              <span className="px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-xs font-bold text-white flex items-center gap-1">
                                <Flame className="h-3 w-3" />
                                POPULAR
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{mod.author.id.username}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(mod.createdAt).toLocaleDateString()}</span>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            mod.game === 'Both' 
                              ? 'bg-neon-purple/20 text-neon-purple' 
                              : mod.game === 'FS25'
                              ? 'bg-neon-green/20 text-neon-green'
                              : 'bg-neon-blue/20 text-neon-blue'
                          }`}>
                            {mod.game}
                          </span>
                        </div>

                        <div className="flex items-center space-x-6 text-sm">
                          <div className="flex items-center space-x-1 text-yellow-400">
                            <Star className="h-4 w-4 fill-current" />
                            <span>{mod.rating.toFixed(1)}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-green-400">
                            <Download className="h-4 w-4" />
                            <span>{mod.downloads.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-blue-400">
                            <Eye className="h-4 w-4" />
                            <span>{mod.views.toLocaleString()}</span>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            mod.type === 'paid' 
                              ? 'bg-green-500/20 text-green-400' 
                              : mod.type === 'unlock'
                              ? 'bg-purple-500/20 text-purple-400'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {mod.type === 'paid' ? `$${mod.price?.toFixed(2)}` :
                             mod.type === 'unlock' ? 'CODE' : 'FREE'}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        {/* Feature Toggle */}
                        <button
                          onClick={() => handleFeatureMod(mod._id, !mod.isFeatured)}
                          disabled={actionLoading === mod._id}
                          className={`p-2 rounded-lg transition-all duration-300 ${
                            mod.isFeatured
                              ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                              : 'bg-gaming-darker text-muted-foreground hover:bg-yellow-500/20 hover:text-yellow-400'
                          }`}
                          title={mod.isFeatured ? 'Unfeature' : 'Feature'}
                        >
                          <Award className="h-4 w-4" />
                        </button>

                        {/* Popular Toggle */}
                        <button
                          onClick={() => handlePopularMod(mod._id, !mod.isPopular)}
                          disabled={actionLoading === mod._id}
                          className={`p-2 rounded-lg transition-all duration-300 ${
                            mod.isPopular
                              ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30'
                              : 'bg-gaming-darker text-muted-foreground hover:bg-orange-500/20 hover:text-orange-400'
                          }`}
                          title={mod.isPopular ? 'Remove from Popular' : 'Mark as Popular'}
                        >
                          <TrendingUp className="h-4 w-4" />
                        </button>

                        {/* View Mod */}
                        <Link href={`/mods/${mod.slug}`}>
                          <button className="p-2 rounded-lg bg-gaming-darker text-muted-foreground hover:bg-neon-blue/20 hover:text-neon-blue transition-all duration-300">
                            <Eye className="h-4 w-4" />
                          </button>
                        </Link>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteMod(mod._id)}
                          disabled={actionLoading === mod._id}
                          className="p-2 rounded-lg bg-gaming-darker text-muted-foreground hover:bg-red-500/20 hover:text-red-400 transition-all duration-300"
                          title="Delete mod"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                        {actionLoading === mod._id && (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-neon-blue"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  )
}
