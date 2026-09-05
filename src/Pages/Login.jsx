import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, LogIn, Sparkles, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { supabase } from '../supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    // Distinguish a broken setup from a genuine authorization failure, so a
    // missing table or missing row doesn't read as "you aren't an admin".
    if (profileError || !profile) {
      await supabase.auth.signOut()
      setError(
        profileError?.code === 'PGRST205'
          ? 'Setup incomplete: the profiles table does not exist. Run the database script from the README.'
          : 'No profile row exists for this account. Add one with role set to admin.'
      )
      setLoading(false)
      return
    }

    if (profile.role !== 'admin') {
      await supabase.auth.signOut()
      setError('Access denied. This account is not an admin.')
      setLoading(false)
      return
    }

    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-700" />
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/15 rounded-2xl p-8 space-y-7">

            {/* Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/25">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-indigo-300 text-xs font-medium">Admin Portal</span>
              </div>
              <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
              <p className="text-gray-400 text-sm">Sign in to manage your portfolio</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs text-gray-400 uppercase tracking-wider">
                  Email
                </label>
                <div className="flex items-center bg-white/8 border border-white/15 rounded-xl overflow-hidden focus-within:border-indigo-500/60 transition-colors">
                  <Mail className="w-4 h-4 text-gray-500 ml-4 shrink-0" />
                  <input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full bg-transparent px-3 py-3 text-gray-100 placeholder-gray-500 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="text-xs text-gray-400 uppercase tracking-wider">
                  Password
                </label>
                <div className="flex items-center bg-white/8 border border-white/15 rounded-xl overflow-hidden focus-within:border-indigo-500/60 transition-colors">
                  <Lock className="w-4 h-4 text-gray-500 ml-4 shrink-0" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full bg-transparent px-3 py-3 text-gray-100 placeholder-gray-500 text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="mr-4 shrink-0 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p className="text-xs">{error}</p>
                </div>
              )}

              <button type="submit" disabled={loading} className="relative group/btn w-full mt-1">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4f52c9] to-[#8644c5] rounded-xl opacity-70 blur group-hover/btn:opacity-100 transition duration-300" />
                <div className="relative h-11 bg-[#030014] rounded-xl border border-white/10 flex items-center justify-center gap-2 overflow-hidden">
                  <div className="absolute inset-0 scale-x-0 group-hover/btn:scale-x-100 origin-left transition-transform duration-500 bg-gradient-to-r from-[#4f52c9]/20 to-[#8644c5]/20" />
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="relative text-sm font-medium text-white">Sign In</span>
                      <LogIn className="relative w-4 h-4 text-white group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
