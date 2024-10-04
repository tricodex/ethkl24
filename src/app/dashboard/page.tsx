"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import HEADDashboard from '@/components/head-dashboard'

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'loading') return // Do nothing while loading
    if (!session) {
      router.push('/login') // Redirect to login if not authenticated
    } else {
      // Check if the user is a HEAD owner

      const checkUserRole = async () => {
        // Example: const userRole = await getUserRole(session.user.id)
        const userRole = 'head_admin' // Placeholder
        if (userRole !== 'head_admin') {
          // Redirect to appropriate dashboard based on role
          if (userRole === 'estate_admin') {
            router.push('/estate-admin')
          } else if (userRole === 'resident') {
            router.push('/estate-resident')
          } else {
            // Handle unknown role
            router.push('/unauthorized')
          }
        }
      }
      checkUserRole()
    }
  }, [session, status, router])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    return null // This will prevent the dashboard from flashing before redirect
  }

  return <HEADDashboard />
}