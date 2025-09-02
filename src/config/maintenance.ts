// Maintenance Mode Configuration
export const maintenanceConfig = {
  // Set this to true to enable maintenance mode
  isEnabled: false,
  
  // Maintenance message settings
  message: {
    title: "We're Currently Under Maintenance",
    subtitle: "ModsBazaar is getting some awesome upgrades!",
    description: "We're working hard to bring you new features and improvements. Please check back soon!",
    estimatedTime: "Expected completion: 2-3 hours"
  },
  
  // Contact information during maintenance
  contact: {
    discord: "https://discord.gg/GcaakuhbVk",
    showDiscord: true
  },
  
  // Allowed paths during maintenance (admin access)
  allowedPaths: [
    '/admin',
    '/api/maintenance'
  ]
}

// Function to check if maintenance mode is active
export const isMaintenanceMode = (): boolean => {
  return maintenanceConfig.isEnabled
}

// Function to check if a path is allowed during maintenance
export const isPathAllowed = (pathname: string): boolean => {
  if (!isMaintenanceMode()) return true
  
  return maintenanceConfig.allowedPaths.some(path => 
    pathname.startsWith(path)
  )
}
