'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Settings, Wrench, Shield, AlertTriangle, CheckCircle, ArrowLeft, Server, Users, Database, Mail, Globe } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

export default function AdminSettings() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false)
  const [adminKey, setAdminKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('maintenance')

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      toast.error('Access denied. Admin privileges required.')
      router.push('/')
      return
    }

    if (user && user.role === 'admin') {
      fetchMaintenanceStatus()
    }
  }, [user, isLoading, router])

  const fetchMaintenanceStatus = async () => {
    try {
      const response = await fetch('/api/maintenance')
      const data = await response.json()
      setIsMaintenanceMode(data.maintenanceMode)
    } catch (error) {
      console.error('Failed to fetch maintenance status:', error)
    }
  }

  const handleToggleMaintenance = async () => {
    if (!adminKey) {
      setMessage('Please enter admin key')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enabled: !isMaintenanceMode,
          adminKey: adminKey,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsMaintenanceMode(data.maintenanceMode)
        setMessage(data.message)
        toast.success(data.message)
      } else {
        setMessage(data.error || 'Failed to toggle maintenance mode')
        toast.error(data.error || 'Failed to toggle maintenance mode')
      }
    } catch (error) {
      setMessage('Error occurred while toggling maintenance mode')
      toast.error('Error occurred while toggling maintenance mode')
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue"></div>
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  const settingsTabs = [
    {
      id: 'maintenance',
      label: 'Maintenance',
      icon: Wrench,
      description: 'System maintenance mode'
    },
    {
      id: 'general',
      label: 'General',
      icon: Settings,
      description: 'General site settings'
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      description: 'Security and authentication'
    },
    {
      id: 'email',
      label: 'Email',
      icon: Mail,
      description: 'Email configuration'
    },
    {
      id: 'api',
      label: 'API',
      icon: Server,
      description: 'API settings and limits'
    }
  ]

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
              <Settings className="h-6 w-6 text-neon-blue" />
              <h1 className="text-xl font-bold text-white">Admin Settings</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="gaming-card p-6 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-4">Settings Categories</h3>
              <nav className="space-y-2">
                {settingsTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-300 flex items-center space-x-3 ${
                      activeTab === tab.id
                        ? 'bg-neon-blue/20 border border-neon-blue/50 text-neon-blue'
                        : 'hover:bg-gaming-darker text-muted-foreground hover:text-white'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <div>
                      <div className="font-semibold">{tab.label}</div>
                      <div className="text-xs opacity-75">{tab.description}</div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            {activeTab === 'maintenance' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="gaming-card p-8 rounded-xl"
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Maintenance Mode</h2>
                  <p className="text-muted-foreground">Control website maintenance mode to perform updates safely</p>
                </div>

                {/* Current Status */}
                <div className={`p-6 rounded-lg mb-6 ${
                  isMaintenanceMode 
                    ? 'bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30' 
                    : 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30'
                }`}>
                  <div className="flex items-center justify-center space-x-3">
                    {isMaintenanceMode ? (
                      <>
                        <AlertTriangle className="h-8 w-8 text-red-400" />
                        <div className="text-center">
                          <div className="text-red-400 font-bold text-lg">Maintenance Mode: ACTIVE</div>
                          <div className="text-red-300 text-sm">Users will see the maintenance page</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-8 w-8 text-green-400" />
                        <div className="text-center">
                          <div className="text-green-400 font-bold text-lg">Website: ONLINE</div>
                          <div className="text-green-300 text-sm">All services are operational</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Admin Key Input */}
                <div className="space-y-4 mb-6">
                  <label className="block text-sm font-semibold text-white">
                    Admin Key
                  </label>
                  <input
                    type="password"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    placeholder="Enter admin key..."
                    className="w-full px-4 py-3 bg-gaming-darker border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors text-white"
                  />
                </div>

                {/* Toggle Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleToggleMaintenance}
                  disabled={loading}
                  className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-3 ${
                    isMaintenanceMode
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                      : 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover-glow'}`}
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Settings className="h-5 w-5" />
                      </motion.div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      {isMaintenanceMode ? (
                        <>
                          <CheckCircle className="h-5 w-5" />
                          <span>Disable Maintenance Mode</span>
                        </>
                      ) : (
                        <>
                          <Wrench className="h-5 w-5" />
                          <span>Enable Maintenance Mode</span>
                        </>
                      )}
                    </>
                  )}
                </motion.button>

                {/* Message */}
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 p-4 rounded-lg text-center ${
                      message.includes('error') || message.includes('Unauthorized')
                        ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                        : 'bg-green-500/10 border border-green-500/30 text-green-400'
                    }`}
                  >
                    {message}
                  </motion.div>
                )}

                {/* Instructions */}
                <div className="mt-8 p-6 bg-neon-blue/5 border border-neon-blue/20 rounded-lg">
                  <h3 className="font-semibold text-neon-blue mb-3 flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Maintenance Mode Instructions</span>
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-neon-blue">•</span>
                      <span>When maintenance mode is enabled, all users will see the maintenance page</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-neon-blue">•</span>
                      <span>Admin panel (/admin) remains accessible during maintenance</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-neon-blue">•</span>
                      <span>Use this panel to enable maintenance before performing updates</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-neon-blue">•</span>
                      <span>Admin key: <code className="bg-gaming-darker px-2 py-1 rounded text-neon-green">MODSBAZAAR_ADMIN_2024</code></span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}

            {activeTab === 'general' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="gaming-card p-8 rounded-xl"
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">General Settings</h2>
                  <p className="text-muted-foreground">Configure general site settings and preferences</p>
                </div>

                <div className="text-center py-16">
                  <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">General Settings</h3>
                  <p className="text-muted-foreground">General settings panel coming soon...</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="gaming-card p-8 rounded-xl"
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Security Settings</h2>
                  <p className="text-muted-foreground">Manage security settings and authentication</p>
                </div>

                <div className="text-center py-16">
                  <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Security Settings</h3>
                  <p className="text-muted-foreground">Security configuration panel coming soon...</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'email' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="gaming-card p-8 rounded-xl"
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Email Settings</h2>
                  <p className="text-muted-foreground">Configure email notifications and SMTP settings</p>
                </div>

                <div className="text-center py-16">
                  <Mail className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Email Configuration</h3>
                  <p className="text-muted-foreground">Email settings panel coming soon...</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'api' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="gaming-card p-8 rounded-xl"
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">API Settings</h2>
                  <p className="text-muted-foreground">Configure API rate limits and access controls</p>
                </div>

                <div className="text-center py-16">
                  <Server className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">API Configuration</h3>
                  <p className="text-muted-foreground">API settings panel coming soon...</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
