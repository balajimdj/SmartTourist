import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const submit = async (event) => {
    event.preventDefault()
    setError('')
    try { await onLogin(email.trim().toLowerCase(), password) } catch (failure) { setError(failure.message) }
  }
  return (
    <div className="auth-page">
      <section className="auth-visual"><div className="brand auth-brand"><span className="brand-mark">S</span><span>SafeTrek<small>TOURIST SAFETY</small></span></div><div className="auth-copy"><span className="hero-kicker">EXPLORE WITH PEACE OF MIND</span><h1>Every journey<br />deserves a safer<br /><em>story.</em></h1><p>Stay connected to the people and places that make travel feel secure.</p><div className="visual-stats"><span>⌖ <strong>Live location</strong></span><span>◈ <strong>Verified identity</strong></span></div></div><span className="visual-credit">Your safety companion, wherever you go.</span></section>
      <section className="auth-panel"><div className="auth-form-wrap"><span className="eyebrow">WELCOME BACK</span><h2>Sign in to SafeTrek</h2><p className="muted">Use your traveler or administrator account.</p>
        <form onSubmit={submit} className="form-stack"><label>Email address<input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label><label>Password<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" /></label>{error && <div className="form-error">{error}</div>}<button className="button button-primary full-button">Sign in <span>→</span></button></form>
        <div className="demo-box"><strong>Try the demo</strong><span>Traveler: tourist@safety.demo / tourist123</span><span>Admin: admin@safety.demo / admin123</span></div>
        <p className="auth-switch">New to SafeTrek? <Link to="/register">Create an account</Link></p>
        <p className="fine-print">Demo only: credentials are stored in this browser and are not suitable for real accounts.</p>
      </div></section>
    </div>
  )
}
