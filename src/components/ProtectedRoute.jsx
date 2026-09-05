import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import LoadingScreen from './LoadingScreen'

export default function ProtectedRoute({ children }) {
  const [allowed, setAllowed] = useState(null)

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return setAllowed(false)

      // The `profiles` RLS policy only lets a user read their own row,
      // so this doubles as the admin role check.
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      setAllowed(profile?.role === 'admin')
    }
    check()
  }, [])

  if (allowed === null) return <LoadingScreen />
  if (!allowed) return <Navigate to="/login" replace />

  return children
}
