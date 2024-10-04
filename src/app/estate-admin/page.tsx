"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import EstateAdminDashboard from '@/components/estate-admin-dashboard'

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'loading') return // Do nothing while loading
    if (!session) {
      router.push('/login') // Redirect to login if not authenticated
    } else {
      // Determine user role and redirect if necessary
      const checkUserRole = async () => {
        // Example: const userRole = await getUserRole(session.user.id)
        const userRole = 'estate_admin' // Placeholder
        if (userRole === 'estate_admin') {
          router.push('/estate-admin')
        } else if (userRole === 'resident') {
          router.push('/estate-resident')
        }
        // If role is 'head_admin', stay on this page
      }
      checkUserRole()
    }
  }, [session, status, router])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return <EstateAdminDashboard />
}