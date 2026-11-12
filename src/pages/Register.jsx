import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Register({ onRegister }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [error, setError] = useState('')
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const submit = async (event) => {
    event.preventDefault()
    setError('')
    try { await onRegister(form) } catch (failure) { setError(failure.message) }
  }
  return (
    <div className="auth-page">
      <section className="auth-visual"><div className="brand auth-brand"><span className="brand-mark">S</span><span>SafeTrek<small>TOURIST SAFETY</small></span></div><div className="auth-copy"><span className="hero-kicker">YOUR SAFETY, IN YOUR POCKET</span><h1>See more.<br />Worry <em>less.</em></h1><p>Create a traveler profile to access your digital ID and safety tools.</p><div className="visual-stats"><span>✓ <strong>Free traveler ID</strong></span><span>⌖ <strong>Location controls</strong></span></div></div><span className="visual-credit">A little more peace in every new place.</span></section>
      <section className="auth-panel"><div className="auth-form-wrap"><span className="eyebrow">JOIN SAFETREK</span><h2>Create your account</h2><p className="muted">A few details are all you need to get started.</p>
        <form onSubmit={submit} className="form-stack"><label>Full name<input name="name" autoComplete="name" required maxLength="80" value={form.name} onChange={update} placeholder="Your name" /></label><label>Email address<input name="email" type="email" autoComplete="email" required value={form.email} onChange={update} placeholder="you@example.com" /></label><label>Phone number<input name="phone" type="tel" autoComplete="tel" required value={form.phone} onChange={update} placeholder="+1 555 000 0000" /></label><label>Password<input name="password" type="password" autoComplete="new-password" required minLength="6" value={form.password} onChange={update} placeholder="At least 6 characters" /></label>{error && <div className="form-error">{error}</div>}<button className="button button-primary full-button">Create account <span>→</span></button></form>
        <p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p><p className="fine-print">Demo only. Do not use real or sensitive personal information.</p>
      </div></section>
    </div>
  )
}
