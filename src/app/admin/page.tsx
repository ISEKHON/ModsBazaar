'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings, Wrench, Shield, AlertTriangle, CheckCircle } from 'lucide-react'

export default function AdminPanel() {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false)
  const [adminKey, setAdminKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check current maintenance status
  useEffect(() => {
    fetchMaintenanceStatus()
  }, [])

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
        setIsAuthenticated(true)
      } else {
        setMessage(data.error || 'Failed to toggle maintenance mode')
        setIsAuthenticated(false)
      }
    } catch (error) {
      setMessage('Error occurred while toggling maintenance mode')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gaming-dark py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gaming-card p-8 rounded-xl"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full mx-auto mb-4 flex items-center justify-center">
              <Settings className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                Admin Panel
              </span>
            </h1>
            <p className="text-muted-foreground">Manage website maintenance mode</p>
          </div>

          {/* Current Status */}
          <div className={`p-4 rounded-lg mb-6 ${
            isMaintenanceMode 
              ? 'bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30' 
              : 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30'
          }`}>
            <div className="flex items-center justify-center space-x-2">
              {isMaintenanceMode ? (
                <>
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                  <span className="text-red-400 font-semibold">Maintenance Mode: ACTIVE</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  <span className="text-green-400 font-semibold">Website: ONLINE</span>
                </>
              )}
            </div>
          </div>

          {/* Admin Key Input */}
          <div className="space-y-4 mb-6">
            <label className="block text-sm font-semibold text-muted-foreground">
              Admin Key
            </label>
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Enter admin key..."
              className="w-full px-4 py-3 bg-gaming-darker border border-gaming-border rounded-lg focus:outline-none focus:border-neon-blue transition-colors"
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
          <div className="mt-8 p-4 bg-neon-blue/5 border border-neon-blue/20 rounded-lg">
            <h3 className="font-semibold text-neon-blue mb-2 flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Instructions</span>
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• When maintenance mode is enabled, all users will see the maintenance page</li>
              <li>• Admin panel (/admin) remains accessible during maintenance</li>
              <li>• Use this panel to enable maintenance before updates</li>
              <li>• Admin key: MODSBAZAAR_ADMIN_2024</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
