'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useFeaturedMods, usePopularMods } from '@/hooks/useMods';
import { checkApiHealth } from '@/lib/api';

export default function ApiTestComponent() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { mods: featuredMods, isLoading: featuredLoading } = useFeaturedMods();
  const { mods: popularMods, isLoading: popularLoading } = usePopularMods();
  const [apiHealth, setApiHealth] = useState<boolean | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      const healthy = await checkApiHealth();
      setApiHealth(healthy);
    };
    checkHealth();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">ModsBazaar API Integration Test</h1>
      
      {/* API Health Status */}
      <div className="mb-6 p-4 rounded-lg border">
        <h2 className="text-xl font-semibold mb-2">API Health Status</h2>
        <div className="flex items-center gap-2">
          <div 
            className={`w-3 h-3 rounded-full ${
              apiHealth === null ? 'bg-gray-400' : 
              apiHealth ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span>
            {apiHealth === null ? 'Checking...' : 
             apiHealth ? 'Backend Connected ✅' : 'Backend Disconnected ❌'}
          </span>
        </div>
      </div>

      {/* Authentication Status */}
      <div className="mb-6 p-4 rounded-lg border">
        <h2 className="text-xl font-semibold mb-2">Authentication Status</h2>
        {authLoading ? (
          <p>Loading authentication...</p>
        ) : isAuthenticated ? (
          <div>
            <p className="text-green-600">✅ Authenticated</p>
            <p>User: {user?.username}</p>
            <p>Email: {user?.email}</p>
            <p>Role: {user?.role}</p>
          </div>
        ) : (
          <p className="text-orange-600">⚠️ Not authenticated</p>
        )}
      </div>

      {/* Featured Mods */}
      <div className="mb-6 p-4 rounded-lg border">
        <h2 className="text-xl font-semibold mb-2">Featured Mods</h2>
        {featuredLoading ? (
          <p>Loading featured mods...</p>
        ) : featuredMods.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredMods.map((mod) => (
              <div key={mod._id} className="p-3 border rounded">
                <h3 className="font-medium">{mod.name}</h3>
                <p className="text-sm text-gray-600">{mod.shortDescription}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-blue-100 px-2 py-1 rounded">
                    {mod.category}
                  </span>
                  <span className="text-xs bg-green-100 px-2 py-1 rounded">
                    {mod.type}
                  </span>
                  <span className="text-xs bg-purple-100 px-2 py-1 rounded">
                    {mod.downloads} downloads
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No featured mods found</p>
        )}
      </div>

      {/* Popular Mods */}
      <div className="mb-6 p-4 rounded-lg border">
        <h2 className="text-xl font-semibold mb-2">Popular Mods</h2>
        {popularLoading ? (
          <p>Loading popular mods...</p>
        ) : popularMods.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {popularMods.map((mod) => (
              <div key={mod._id} className="p-3 border rounded">
                <h3 className="font-medium">{mod.name}</h3>
                <p className="text-sm text-gray-600">{mod.shortDescription}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-blue-100 px-2 py-1 rounded">
                    {mod.category}
                  </span>
                  <span className="text-xs bg-orange-100 px-2 py-1 rounded">
                    ⭐ {mod.rating.average.toFixed(1)}
                  </span>
                  <span className="text-xs bg-purple-100 px-2 py-1 rounded">
                    {mod.downloads} downloads
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No popular mods found</p>
        )}
      </div>

      {/* API Endpoints Status */}
      <div className="p-4 rounded-lg border">
        <h2 className="text-xl font-semibold mb-2">Available API Endpoints</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div>
            <h3 className="font-medium mb-2">Authentication</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• POST /api/auth/login</li>
              <li>• POST /api/auth/register</li>
              <li>• POST /api/auth/logout</li>
              <li>• GET /api/auth/me</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Mods</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• GET /api/mods</li>
              <li>• GET /api/mods/featured</li>
              <li>• GET /api/mods/popular</li>
              <li>• GET /api/mods/search/:query</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">User</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• GET /api/user/profile</li>
              <li>• PUT /api/user/profile</li>
              <li>• GET /api/user/favorites</li>
              <li>• GET /api/user/downloads</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Admin</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• GET /api/admin/dashboard/stats</li>
              <li>• GET /api/admin/users</li>
              <li>• GET /api/admin/mods</li>
              <li>• GET /api/admin/analytics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
