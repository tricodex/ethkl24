"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import EstateResidentDashboard from '@/components/estate-resident-dashboard'

export default function EstateResidentPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    if (status === 'loading') return // Do nothing while loading
    if (!session) {
      router.push('/login') // Redirect to login if not authenticated
    } else {
      // Check if the user is a resident
      const checkAuthorization = async () => {
        // Example: const isResident = await checkIfUserIsResident(session.user.id)
        const isResident = true // Placeholder
        setIsAuthorized(isResident)
        if (!isResident) {
          router.push('/dashboard') // Redirect to main dashboard if not a resident
        }
      }
      checkAuthorization()
    }
  }, [session, status, router])

  if (status === 'loading' || !isAuthorized) {
    return <div>Loading...</div>
  }

  return <EstateResidentDashboard />
}