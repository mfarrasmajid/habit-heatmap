// src/components/Auth.tsx
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) setError(error.message)
    else setSent(true)
  }

  return (
    <div style={{ maxWidth: 360, margin: '8rem auto', textAlign: 'center' }}>
      <h1>Habit Heatmap</h1>
      <p>Sign in with your email</p>
      <form onSubmit={signIn}>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: 12, marginBottom: 8 }}
        />
        <button style={{ width: '100%', padding: 12 }}>Send magic link</button>
      </form>
      {sent && <p>Check your inbox ✉️</p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
    </div>
  )
}