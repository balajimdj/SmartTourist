import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import TouristCard from '../components/TouristCard'

export default function DigitalID({ user, isAdmin, tourists, verifyId, addIdToChain }) {
  const [lookup, setLookup] = useState('')
  const [result, setResult] = useState(null)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const selected = isAdmin ? null : user
  const verify = async (event) => {
    event.preventDefault()
    setBusy(true); setMessage(''); setResult(null)
    try {
      const identity = tourists.find((item) => item.id.toLowerCase() === lookup.trim().toLowerCase())
      if (!identity) { setResult({ found: false, valid: false }); return }
      const verified = await verifyId(identity.id)
      setResult({ ...verified, tourist: identity })
    } catch (error) { setMessage(error.message) } finally { setBusy(false) }
  }
  const createChainRecord = async () => {
    setBusy(true); setMessage('')
    try { await addIdToChain(user); setMessage('Identity hash added to the local demonstration chain.') } catch (error) { setMessage(error.message) } finally { setBusy(false) }
  }
  return (
    <div className="page-stack">
      <div className="page-intro"><div><span className="eyebrow">{isAdmin ? 'IDENTITY LOOKUP' : 'YOUR VERIFIED PROFILE'}</span><h2>{isAdmin ? 'Verify a digital ID' : 'Your digital tourist ID'}</h2><p>{isAdmin ? 'Check an ID against the browser-based demonstration chain.' : 'A portable identity card for your trip, with a QR code for quick lookup.'}</p></div></div>
      {selected ? <div className="id-layout"><div className="id-details"><TouristCard tourist={selected} /><div className="panel id-info"><h3>Identity details</h3><div className="detail-list"><div><span>Full name</span><strong>{selected.name}</strong></div><div><span>Tourist ID</span><strong>{selected.id}</strong></div><div><span>Email</span><strong>{selected.email}</strong></div><div><span>Phone</span><strong>{selected.phone}</strong></div><div><span>Issued</span><strong>{new Date(selected.createdAt).toLocaleDateString()}</strong></div></div></div></div>
        <div className="right-stack"><div className="panel qr-panel"><span className="eyebrow">SCAN TO LOOK UP</span><h3>Your identity QR</h3><p>Contains your ID and name for this demo. Avoid sharing it publicly.</p><div className="qr-box"><QRCodeSVG value={JSON.stringify({ touristId: selected.id, name: selected.name, issuer: 'SafeTrek demo' })} size={180} level="M" /></div><strong className="qr-caption">{selected.id}</strong></div><div className="panel chain-panel"><span className="chain-icon">⛓</span><div><h3>Local chain record</h3><p>Add or refresh your identity hash in the simulated blockchain.</p></div><button className="button button-secondary" disabled={busy} onClick={createChainRecord}>{busy ? 'Working…' : 'Add identity hash'}</button><small>Educational simulation only. No public blockchain is used.</small>{message && <div className="inline-message">{message}</div>}</div></div></div>
        : <div className="verify-layout"><div className="panel verify-panel"><span className="eyebrow">CHAIN-BASED LOOKUP</span><h3>Verify traveler identity</h3><p>Enter a Tourist ID to check its stored hash and chain link. Sample ID: <code>TID-DEMO-2048</code></p><form className="verify-form" onSubmit={verify}><input required value={lookup} onChange={(event) => setLookup(event.target.value)} placeholder="TID-DEMO-2048" aria-label="Tourist ID" /><button className="button button-primary" disabled={busy}>{busy ? 'Verifying…' : 'Verify ID'}</button></form>{message && <div className="form-error">{message}</div>}{result && <div className={`verification-result ${result.valid ? 'valid' : 'invalid'}`}><strong>{result.valid ? '✓ Identity verified' : result.found ? '! Record integrity check failed' : '× ID not found in the local chain'}</strong>{result.tourist && <><span>{result.tourist.name} · {result.tourist.id}</span><code>{result.block.hash}</code></>}</div>}</div><div className="panel chain-info"><span className="chain-icon">⛓</span><h3>How this simulation works</h3><p>Each record contains a SHA-256 hash and the previous block’s hash. Editing a record breaks the integrity check.</p><ul><li>Stored only in this browser</li><li>Hashing uses the Web Crypto API</li><li>Not deployed or connected to a real blockchain</li></ul></div></div>}
    </div>
  )
}
