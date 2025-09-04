// Export all API services
export { default as authService } from './auth';
export { default as modsService } from './mods';
export { default as userService } from './user';
export { default as adminService } from './admin';

// Export service instances for direct use
export { authService as auth } from './auth';
export { modsService as mods } from './mods';
export { userService as user } from './user';
export { adminService as admin } from './admin';

// Re-export types for convenience
export * from '@/types/api';
