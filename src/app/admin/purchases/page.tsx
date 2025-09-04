'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Search, 
  Plus,
  CreditCard,
  Package,
  User,
  Calendar,
  DollarSign,
  Check,
  X,
  AlertCircle,
  Download
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import api from '@/lib/api'
import { toast } from 'sonner'

interface PurchaseRecord {
  _id: string
  userId: string
  modId: string
  user: {
    username: string
    email: string
    gamerTag?: string
  }
  mod: {
    name: string
    slug: string
    price: number
    thumbnail: string
  }
  purchasedAt: string
  paymentMethod: 'manual' | 'paypal' | 'stripe'
  notes?: string
  status: 'completed' | 'pending' | 'refunded'
}

interface User {
  _id: string
  username: string
  email: string
  gamerTag?: string
}

interface Mod {
  _id: string
  name: string
  slug: string
  price: number
  type: 'paid'
}

export default function AdminPurchasesPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [paidMods, setPaidMods] = useState<Mod[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState('')
  const [selectedMod, setSelectedMod] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      toast.error('Access denied. Admin privileges required.')
      router.push('/')
      return
    }

    if (user?.role === 'admin') {
      fetchData()
    }
  }, [user, isLoading, router])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [purchasesRes, usersRes, modsRes] = await Promise.all([
        api.get('/admin/purchases'),
        api.get('/admin/users?limit=1000'), // Get all users for dropdown
        api.get('/mods?type=paid&limit=1000') // Get all paid mods
      ])

      if (purchasesRes.data.status === 'success') {
        setPurchases(purchasesRes.data.data.purchases || [])
      }

      if (usersRes.data.status === 'success') {
        setUsers(usersRes.data.data.users || [])
      }

      if (modsRes.data.status === 'success') {
        setPaidMods(modsRes.data.data.mods.filter((mod: any) => mod.type === 'paid') || [])
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleAddPurchase = async () => {
    if (!selectedUser || !selectedMod) {
      toast.error('Please select both user and mod')
      return
    }

    try {
      setIsSubmitting(true)
      const response = await api.post('/admin/purchases/manual', {
        userId: selectedUser,
        modId: selectedMod,
        notes: notes.trim() || undefined
      })

      if (response.data.status === 'success') {
        toast.success('Purchase recorded successfully')
        setShowAddModal(false)
        setSelectedUser('')
        setSelectedMod('')
        setNotes('')
        fetchData() // Refresh the list
      }
    } catch (error: any) {
      console.error('Failed to add purchase:', error)
      toast.error(error.response?.data?.message || 'Failed to record purchase')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRevokePurchase = async (purchase: any) => {
    if (!confirm(`Are you sure you want to revoke ${purchase.user.username}'s purchase of ${purchase.mod.name}? The user will lose access to download this mod.`)) {
      return
    }

    try {
      const response = await api.delete(`/admin/purchases/${purchase._id}?userId=${purchase.user._id}&modId=${purchase.mod._id}`)
      
      if (response.data.status === 'success') {
        toast.success('Purchase revoked successfully')
        fetchData() // Refresh the list
      }
    } catch (error: any) {
      console.error('Failed to revoke purchase:', error)
      toast.error(error.response?.data?.message || 'Failed to revoke purchase')
    }
  }

  const filteredPurchases = purchases.filter(purchase =>
    purchase.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    purchase.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    purchase.mod.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gaming-dark text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              href="/admin" 
              className="p-2 gaming-card rounded-lg hover:border-neon-blue transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                Purchase Management
              </h1>
              <p className="text-muted-foreground">
                Manage manual purchases and user access to paid mods
              </p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-neon-green to-emerald-400 rounded-lg text-white font-semibold hover-glow transition-all duration-300 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Purchase</span>
          </motion.button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search purchases by user or mod name..."
              className="w-full pl-10 pr-4 py-3 bg-gaming-card border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="gaming-card p-6 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-neon-green/20 rounded-lg flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-neon-green" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total Purchases</p>
                <p className="text-2xl font-bold">{purchases.length}</p>
              </div>
            </div>
          </div>

          <div className="gaming-card p-6 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-neon-blue/20 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-neon-blue" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Paid Mods Available</p>
                <p className="text-2xl font-bold">{paidMods.length}</p>
              </div>
            </div>
          </div>

          <div className="gaming-card p-6 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-neon-purple/20 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-neon-purple" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total Revenue</p>
                <p className="text-2xl font-bold">
                  ${purchases.reduce((sum, p) => sum + (p.mod.price || 0), 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Purchases List */}
        <div className="gaming-card rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gaming-border">
            <h2 className="text-xl font-semibold">Purchase Records</h2>
            <p className="text-muted-foreground">All manual and automated purchase records</p>
          </div>

          {filteredPurchases.length === 0 ? (
            <div className="p-12 text-center">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No purchases found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? 'No purchases match your search criteria.' : 'No purchases have been recorded yet.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gaming-darker">
                  <tr>
                    <th className="text-left p-4 font-semibold">User</th>
                    <th className="text-left p-4 font-semibold">Mod</th>
                    <th className="text-left p-4 font-semibold">Price</th>
                    <th className="text-left p-4 font-semibold">Date</th>
                    <th className="text-left p-4 font-semibold">Method</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                    <th className="text-left p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPurchases.map((purchase) => (
                    <tr key={purchase._id} className="border-b border-gaming-border hover:bg-gaming-darker/50">
                      <td className="p-4">
                        <div>
                          <p className="font-semibold">{purchase.user.username}</p>
                          <p className="text-sm text-muted-foreground">{purchase.user.email}</p>
                          {purchase.user.gamerTag && (
                            <p className="text-xs text-neon-blue">{purchase.user.gamerTag}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={purchase.mod.thumbnail} 
                            alt={purchase.mod.name}
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=300&fit=crop'
                            }}
                          />
                          <div>
                            <p className="font-semibold">{purchase.mod.name}</p>
                            <Link 
                              href={`/mods/${purchase.mod.slug}`}
                              className="text-sm text-neon-blue hover:text-neon-blue/80 transition-colors"
                            >
                              View Mod
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-neon-green font-semibold">${purchase.mod.price.toFixed(2)}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{new Date(purchase.purchasedAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          purchase.paymentMethod === 'manual' 
                            ? 'bg-neon-purple/20 text-neon-purple' 
                            : 'bg-neon-green/20 text-neon-green'
                        }`}>
                          {purchase.paymentMethod.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          {purchase.status === 'completed' ? (
                            <Check className="h-4 w-4 text-neon-green" />
                          ) : purchase.status === 'pending' ? (
                            <AlertCircle className="h-4 w-4 text-neon-orange" />
                          ) : (
                            <X className="h-4 w-4 text-red-400" />
                          )}
                          <span className={`text-sm font-semibold ${
                            purchase.status === 'completed' 
                              ? 'text-neon-green' 
                              : purchase.status === 'pending'
                              ? 'text-neon-orange'
                              : 'text-red-400'
                          }`}>
                            {purchase.status.toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRevokePurchase(purchase)}
                          className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 text-sm font-medium transition-colors"
                        >
                          Revoke
                        </motion.button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Purchase Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-gaming-card rounded-xl p-6 w-full max-w-md border border-gaming-border"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-neon-green to-emerald-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Plus className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Add Manual Purchase</h3>
              <p className="text-muted-foreground">
                Manually record a purchase for a user who paid outside the system
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select User</label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full px-3 py-2 bg-gaming-border border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
                >
                  <option value="">Choose a user...</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.username} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Select Paid Mod</label>
                <select
                  value={selectedMod}
                  onChange={(e) => setSelectedMod(e.target.value)}
                  className="w-full px-3 py-2 bg-gaming-border border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
                >
                  <option value="">Choose a mod...</option>
                  {paidMods.map((mod) => (
                    <option key={mod._id} value={mod._id}>
                      {mod.name} (${mod.price.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-gaming-border border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
                  placeholder="Payment method, transaction ID, etc..."
                  rows={3}
                />
              </div>

              <div className="flex space-x-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowAddModal(false)
                    setSelectedUser('')
                    setSelectedMod('')
                    setNotes('')
                  }}
                  className="flex-1 py-3 bg-gaming-border hover:bg-gaming-border/80 rounded-lg text-white font-semibold transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddPurchase}
                  disabled={!selectedUser || !selectedMod || isSubmitting}
                  className="flex-1 py-3 bg-gradient-to-r from-neon-green to-emerald-400 rounded-lg text-white font-semibold hover-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Adding...' : 'Add Purchase'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
