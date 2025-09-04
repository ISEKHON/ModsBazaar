'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  ArrowLeft, 
  Search, 
  Filter,
  MoreVertical,
  UserCheck,
  UserX,
  Shield,
  Ban,
  Calendar,
  Mail,
  Star,
  Package,
  Download,
  Eye,
  AlertTriangle
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import api from '@/lib/api'
import { toast } from 'sonner'

interface User {
  _id: string
  username: string
  email: string
  gamerTag?: string
  role: 'user' | 'admin' | 'moderator'
  isVerified: boolean
  isActive: boolean
  isBanned: boolean
  banReason?: string
  bannedAt?: string
  joinedAt: string
  lastActive?: string
  submissionCount: number
  publishedModsCount: number
  totalSpent?: number
  favoriteGame?: 'FS22' | 'FS25' | 'Both'
}

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalResults: number
  hasNext: boolean
  hasPrev: boolean
}

export default function AdminUsers() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showActionModal, setShowActionModal] = useState(false)
  const [actionType, setActionType] = useState<'ban' | 'unban' | 'verify' | 'unverify' | 'promote' | 'demote'>('ban')
  const [actionReason, setActionReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  
  // Filters and pagination
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20'
      })
      
      if (searchTerm) params.append('search', searchTerm)
      if (roleFilter !== 'all') params.append('role', roleFilter)
      if (statusFilter !== 'all') params.append('status', statusFilter)

      const response = await api.get(`/admin/users?${params.toString()}`)
      
      if (response.data.status === 'success') {
        setUsers(response.data.data.users)
        setPagination(response.data.data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchTerm, roleFilter, statusFilter])

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      toast.error('Access denied. Admin privileges required.')
      router.push('/')
      return
    }

    if (user && user.role === 'admin') {
      fetchUsers()
    }
  }, [user, isLoading, router, fetchUsers])

  const handleUserAction = (selectedUser: User, action: typeof actionType) => {
    setSelectedUser(selectedUser)
    setActionType(action)
    setShowActionModal(true)
    setActionReason('')
  }

  const submitAction = async () => {
    if (!selectedUser) return
    
    if ((actionType === 'ban') && !actionReason.trim()) {
      toast.error('Ban reason is required')
      return
    }

    setSubmitting(true)
    try {
      const actionData: any = { action: actionType }
      if (actionReason.trim()) {
        actionData.reason = actionReason.trim()
      }

      const response = await api.patch(`/admin/users/${selectedUser._id}`, actionData)
      
      if (response.data.status === 'success') {
        toast.success(`User ${actionType} successful!`)
        setShowActionModal(false)
        setSelectedUser(null)
        fetchUsers() // Refresh the list
      }
    } catch (error: any) {
      console.error('Failed to perform user action:', error)
      toast.error(error.response?.data?.message || `Failed to ${actionType} user`)
    } finally {
      setSubmitting(false)
    }
  }

  const getUserStatusBadge = (user: User) => {
    if (user.isBanned) {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
          <Ban className="h-3 w-3" />
          <span>Banned</span>
        </span>
      )
    }
    
    if (!user.isActive) {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400">
          <UserX className="h-3 w-3" />
          <span>Inactive</span>
        </span>
      )
    }
    
    if (user.isVerified) {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
          <UserCheck className="h-3 w-3" />
          <span>Verified</span>
        </span>
      )
    }
    
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
        <AlertTriangle className="h-3 w-3" />
        <span>Unverified</span>
      </span>
    )
  }

  const getRoleBadge = (role: string) => {
    const badges = {
      admin: { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: Shield },
      moderator: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: Star },
      user: { bg: 'bg-gray-500/20', text: 'text-gray-400', icon: Users }
    }

    const badge = badges[role as keyof typeof badges] || badges.user
    const Icon = badge.icon

    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="h-3 w-3" />
        <span className="capitalize">{role}</span>
      </span>
    )
  }

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
              <Link href="/admin" className="text-neon-blue hover:text-neon-purple transition-colors">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <Users className="h-8 w-8 text-neon-blue" />
              <h1 className="text-xl font-bold text-white">User Management</h1>
            </div>
            <div className="text-sm text-muted-foreground">
              {pagination?.totalResults || 0} total users
            </div>
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="bg-gaming-darker border border-gaming-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-neon-blue"
                >
                  <option value="all">All Roles</option>
                  <option value="user">Users</option>
                  <option value="moderator">Moderators</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="bg-gaming-darker border border-gaming-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-neon-blue"
                >
                  <option value="all">All Status</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                  <option value="banned">Banned</option>
                </select>
              </div>
            </div>
            
            <div className="relative">
              <Search className="h-5 w-5 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gaming-darker border border-gaming-border rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-neon-blue w-full md:w-80"
              />
            </div>
          </div>
        </motion.div>

        {/* Users List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {users.length > 0 ? (
            users.map((userData, index) => (
              <motion.div
                key={userData._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="gaming-card p-6 rounded-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    {/* User Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">
                        {userData.username.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-white truncate">{userData.username}</h3>
                        {getRoleBadge(userData.role)}
                        {getUserStatusBadge(userData)}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{userData.email}</span>
                        </div>
                        {userData.gamerTag && (
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3" />
                            <span>{userData.gamerTag}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(userData.joinedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
                        <div className="flex items-center space-x-1">
                          <Package className="h-3 w-3" />
                          <span>{userData.submissionCount} submissions</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Download className="h-3 w-3" />
                          <span>{userData.publishedModsCount} published</span>
                        </div>
                        {userData.totalSpent !== undefined && (
                          <div className="flex items-center space-x-1">
                            <span>${userData.totalSpent.toFixed(2)} spent</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    <div className="relative group">
                      <button className="p-2 bg-gaming-darker hover:bg-neon-blue/20 rounded-lg transition-colors">
                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                      </button>
                      
                      {/* Dropdown Menu */}
                      <div className="absolute right-0 mt-2 w-48 bg-gaming-darker border border-gaming-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        <div className="py-1">
                          {!userData.isVerified && (
                            <button
                              onClick={() => handleUserAction(userData, 'verify')}
                              className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gaming-dark transition-colors"
                            >
                              <UserCheck className="h-4 w-4 inline mr-2" />
                              Verify User
                            </button>
                          )}
                          
                          {userData.isVerified && (
                            <button
                              onClick={() => handleUserAction(userData, 'unverify')}
                              className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gaming-dark transition-colors"
                            >
                              <UserX className="h-4 w-4 inline mr-2" />
                              Unverify User
                            </button>
                          )}
                          
                          {userData.role === 'user' && (
                            <button
                              onClick={() => handleUserAction(userData, 'promote')}
                              className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gaming-dark transition-colors"
                            >
                              <Shield className="h-4 w-4 inline mr-2" />
                              Promote to Admin
                            </button>
                          )}
                          
                          {userData.role === 'admin' && userData._id !== user._id && (
                            <button
                              onClick={() => handleUserAction(userData, 'demote')}
                              className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gaming-dark transition-colors"
                            >
                              <Users className="h-4 w-4 inline mr-2" />
                              Demote to User
                            </button>
                          )}
                          
                          <div className="border-t border-gaming-border my-1"></div>
                          
                          {!userData.isBanned ? (
                            <button
                              onClick={() => handleUserAction(userData, 'ban')}
                              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gaming-dark transition-colors"
                              disabled={userData._id === user._id}
                            >
                              <Ban className="h-4 w-4 inline mr-2" />
                              Ban User
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUserAction(userData, 'unban')}
                              className="w-full text-left px-4 py-2 text-sm text-green-400 hover:bg-gaming-dark transition-colors"
                            >
                              <UserCheck className="h-4 w-4 inline mr-2" />
                              Unban User
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ban Info */}
                {userData.isBanned && userData.banReason && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm">
                      <strong>Banned:</strong> {userData.banReason}
                      {userData.bannedAt && (
                        <span className="text-red-300 ml-2">
                          on {new Date(userData.bannedAt).toLocaleDateString()}
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="gaming-card p-12 rounded-xl text-center">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No users found</h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? "Try adjusting your search terms or filters" 
                  : "No users match the current filter"}
              </p>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center space-x-2 mt-8"
          >
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={!pagination.hasPrev}
              className="px-4 py-2 bg-gaming-darker border border-gaming-border rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-neon-blue transition-colors"
            >
              Previous
            </button>
            
            <span className="px-4 py-2 text-muted-foreground">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
              disabled={!pagination.hasNext}
              className="px-4 py-2 bg-gaming-darker border border-gaming-border rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-neon-blue transition-colors"
            >
              Next
            </button>
          </motion.div>
        )}
      </div>

      {/* Action Modal */}
      {showActionModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gaming-dark border border-gaming-border rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold text-white mb-4 capitalize">
              {actionType.replace('_', ' ')} User
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">User: {selectedUser.username}</p>
              <p className="text-sm text-muted-foreground">Email: {selectedUser.email}</p>
            </div>

            {(actionType === 'ban') && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-white mb-2">
                  Ban Reason *
                </label>
                <textarea
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder="Explain why this user is being banned..."
                  rows={3}
                  className="w-full px-3 py-2 bg-gaming-darker border border-gaming-border rounded-lg text-white focus:outline-none focus:border-neon-blue resize-none"
                  required
                />
              </div>
            )}

            <div className="flex space-x-4">
              <button
                onClick={() => setShowActionModal(false)}
                className="flex-1 px-4 py-2 bg-gaming-darker border border-gaming-border rounded-lg text-white hover:border-neon-blue transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitAction}
                disabled={submitting || (actionType === 'ban' && !actionReason.trim())}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  actionType === 'ban'
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-neon-blue hover:bg-neon-purple text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {submitting ? 'Processing...' : `Confirm ${actionType.replace('_', ' ')}`}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
