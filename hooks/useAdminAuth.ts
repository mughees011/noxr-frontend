'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export function useAdminAuth() {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      // Skip auth check for login page
      if (pathname === '/admin/login') {
        setIsLoading(false)
        setIsAuthenticated(true)
        return
      }

      // Check for admin token
      const token = localStorage.getItem('noxr_admin_token')
      
      if (!token) {
        // No token - redirect to login
        router.push('/admin/login')
        setIsAuthenticated(false)
        setIsLoading(false)
        return
      }

      // Token exists - user is authenticated
      setIsAuthenticated(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [pathname, router])

  return { isAuthenticated, isLoading }
}