import { NextRequest, NextResponse } from 'next/server'
import { writeFileSync, readFileSync } from 'fs'
import { join } from 'path'

// API route to toggle maintenance mode
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { enabled, adminKey } = body

    // Simple admin authentication (you should use a more secure method)
    if (adminKey !== 'MODSBAZAAR_ADMIN_2024') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Path to the maintenance config file
    const configPath = join(process.cwd(), 'src/config/maintenance.ts')
    
    // Read current config
    let configContent = readFileSync(configPath, 'utf8')
    
    // Update the isEnabled value
    configContent = configContent.replace(
      /isEnabled:\s*(true|false)/,
      `isEnabled: ${enabled}`
    )
    
    // Write back to file
    writeFileSync(configPath, configContent)

    return NextResponse.json({ 
      success: true, 
      maintenanceMode: enabled,
      message: enabled ? 'Maintenance mode enabled' : 'Maintenance mode disabled'
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update maintenance mode' }, { status: 500 })
  }
}

// Get current maintenance status
export async function GET() {
  try {
    const configPath = join(process.cwd(), 'src/config/maintenance.ts')
    const configContent = readFileSync(configPath, 'utf8')
    
    // Extract isEnabled value
    const match = configContent.match(/isEnabled:\s*(true|false)/)
    const isEnabled = match ? match[1] === 'true' : false

    return NextResponse.json({ 
      maintenanceMode: isEnabled 
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get maintenance status' }, { status: 500 })
  }
}
