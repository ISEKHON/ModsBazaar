'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Package, 
  Settings, 
  BarChart3,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Download,
  Eye,
  Star
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import api from '@/lib/api'
import { toast } from 'sonner'

interface AdminStats {
  totalUsers: number
  totalMods: number
  pendingSubmissions: number
  totalDownloads: number
  totalViews: number
  averageRating: number
  recentActivity: Array<{
    type: 'submission' | 'approval' | 'rejection' | 'user_registration'
    message: string
    timestamp: string
  }>
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      toast.error('Access denied. Admin privileges required.')
      router.push('/')
      return
    }

    if (user && user.role === 'admin') {
      fetchAdminStats()
    }
  }, [user, isLoading, router])

  const fetchAdminStats = async () => {
    try {
      const response = await api.get('/admin/dashboard/stats')
      if (response.data.status === 'success') {
        setStats(response.data.data)
      }
    } catch (error) {
      console.error('Failed to fetch admin stats:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
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

  const adminMenuItems = [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      description: 'Overview and statistics',
      active: true
    },
    {
      title: 'Submissions',
      href: '/admin/submissions',
      icon: FileText,
      description: 'Review mod submissions',
      badge: stats?.pendingSubmissions || 0
    },
    {
      title: 'Users',
      href: '/admin/users',
      icon: Users,
      description: 'Manage user accounts'
    },
    {
      title: 'Mods',
      href: '/admin/mods',
      icon: Package,
      description: 'Manage published mods'
    },
    {
      title: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      description: 'Site analytics and reports'
    },
    {
      title: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      description: 'System configuration'
    }
  ]

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'from-blue-500 to-purple-500',
      change: '+12% this month'
    },
    {
      title: 'Total Mods',
      value: stats?.totalMods || 0,
      icon: Package,
      color: 'from-green-500 to-emerald-500',
      change: '+8% this month'
    },
    {
      title: 'Pending Reviews',
      value: stats?.pendingSubmissions || 0,
      icon: Clock,
      color: 'from-orange-500 to-red-500',
      urgent: (stats?.pendingSubmissions || 0) > 10
    },
    {
      title: 'Total Downloads',
      value: stats?.totalDownloads || 0,
      icon: Download,
      color: 'from-purple-500 to-pink-500',
      change: '+25% this month'
    },
    {
      title: 'Total Views',
      value: stats?.totalViews || 0,
      icon: Eye,
      color: 'from-cyan-500 to-blue-500',
      change: '+18% this month'
    },
    {
      title: 'Average Rating',
      value: (stats?.averageRating || 0).toFixed(1),
      icon: Star,
      color: 'from-yellow-500 to-orange-500',
      suffix: '★'
    }
  ]

  return (
    <div className="min-h-screen bg-gaming-dark">
      {/* Admin Header */}
      <div className="bg-gaming-darker border-b border-gaming-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-neon-blue" />
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Welcome back, {user.username}</span>
              <Link 
                href="/"
                className="text-neon-blue hover:text-neon-purple transition-colors"
              >
                Back to Site
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
        >
          {adminMenuItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={item.href}>
                <div className={`gaming-card p-6 rounded-xl hover:border-neon-blue/50 transition-all duration-300 group cursor-pointer ${
                  item.active ? 'border-neon-blue/50 bg-neon-blue/5' : ''
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <item.icon className="h-8 w-8 text-neon-blue group-hover:text-neon-purple transition-colors" />
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {statCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`gaming-card p-6 rounded-xl ${card.urgent ? 'border-red-500/50' : ''}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${card.color} flex items-center justify-center`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                {card.urgent && (
                  <AlertCircle className="h-5 w-5 text-red-400" />
                )}
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                {card.suffix && <span className="text-yellow-400">{card.suffix}</span>}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">{card.title}</p>
              {card.change && (
                <div className="flex items-center space-x-1 text-green-400 text-xs">
                  <TrendingUp className="h-3 w-3" />
                  <span>{card.change}</span>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="gaming-card p-6 rounded-xl"
        >
          <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
          
          {stats?.recentActivity && stats.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gaming-darker rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'submission' ? 'bg-blue-500/20 text-blue-400' :
                    activity.type === 'approval' ? 'bg-green-500/20 text-green-400' :
                    activity.type === 'rejection' ? 'bg-red-500/20 text-red-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    {activity.type === 'submission' && <FileText className="h-4 w-4" />}
                    {activity.type === 'approval' && <CheckCircle className="h-4 w-4" />}
                    {activity.type === 'rejection' && <AlertCircle className="h-4 w-4" />}
                    {activity.type === 'user_registration' && <Users className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-white">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gaming-darker rounded-full mx-auto mb-4 flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No recent activity</p>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <Link href="/admin/submissions" className="gaming-card p-4 rounded-lg hover:border-neon-blue/50 transition-all duration-300 text-center group">
            <FileText className="h-8 w-8 text-neon-blue mx-auto mb-2 group-hover:text-neon-purple transition-colors" />
            <p className="text-white font-semibold">Review Submissions</p>
            <p className="text-xs text-muted-foreground mt-1">{stats?.pendingSubmissions || 0} pending</p>
          </Link>
          
          <Link href="/admin/users" className="gaming-card p-4 rounded-lg hover:border-neon-blue/50 transition-all duration-300 text-center group">
            <Users className="h-8 w-8 text-neon-green mx-auto mb-2 group-hover:text-neon-purple transition-colors" />
            <p className="text-white font-semibold">Manage Users</p>
            <p className="text-xs text-muted-foreground mt-1">{stats?.totalUsers || 0} total users</p>
          </Link>
          
          <Link href="/admin/mods" className="gaming-card p-4 rounded-lg hover:border-neon-blue/50 transition-all duration-300 text-center group">
            <Package className="h-8 w-8 text-neon-orange mx-auto mb-2 group-hover:text-neon-purple transition-colors" />
            <p className="text-white font-semibold">Manage Mods</p>
            <p className="text-xs text-muted-foreground mt-1">{stats?.totalMods || 0} published</p>
          </Link>
          
          <Link href="/admin/settings" className="gaming-card p-4 rounded-lg hover:border-neon-blue/50 transition-all duration-300 text-center group">
            <Settings className="h-8 w-8 text-neon-purple mx-auto mb-2 group-hover:text-neon-pink transition-colors" />
            <p className="text-white font-semibold">System Settings</p>
            <p className="text-xs text-muted-foreground mt-1">Configuration</p>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
