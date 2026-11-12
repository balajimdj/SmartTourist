import { useState } from 'react'

const answers = {
  emergency: 'If you are in immediate danger, call your local emergency number first. Move to a public, well-lit place if it is safe to do so, and use the SOS button in SafeTrek to record an alert for the demo administrator.',
  hospital: 'I cannot access live maps or emergency-service directories. Search your maps app for a nearby hospital, ask a trusted local authority, or call your local emergency number if this is urgent.',
  police: 'For urgent help, call the local police or emergency number for your destination. Emergency numbers differ by country, so confirm the correct number before traveling.',
  restricted: 'A restricted zone in this demo is an example boundary where visitors are advised to avoid entering. It is not an official boundary. Follow local signs and instructions from authorities.',
  sos: 'Tap the red SOS button on the dashboard or Emergency page. The demo creates a local incident with your Tourist ID, timestamp, and the most recent GPS coordinates if available.',
}

const prompts = [['What should I do in an emergency?', 'emergency'], ['Where is the nearest hospital?', 'hospital'], ['How can I contact the police?', 'police'], ['What does a restricted zone mean?', 'restricted'], ['How can I use the SOS button?', 'sos']]

export default function Chatbot() {
  const [messages, setMessages] = useState([{ from: 'bot', text: 'Hi! I can share general travel-safety guidance. I do not have live emergency-service data.' }])
  const [input, setInput] = useState('')
  const reply = (question, key) => {
    const answerKey = key || (question.toLowerCase().includes('hospital') ? 'hospital' : question.toLowerCase().includes('police') ? 'police' : question.toLowerCase().includes('zone') || question.toLowerCase().includes('restricted') ? 'restricted' : question.toLowerCase().includes('sos') ? 'sos' : 'emergency')
    setMessages((items) => [...items, { from: 'user', text: question }, { from: 'bot', text: answers[answerKey] }])
  }
  const submit = (event) => {
    event.preventDefault()
    const question = input.trim()
    if (!question) return
    reply(question)
    setInput('')
  }
  return (
    <div className="page-stack"><div className="page-intro"><div><span className="eyebrow">TRAVEL GUIDANCE</span><h2>Safety assistant</h2><p>Quick, general answers to common traveler safety questions.</p></div></div>
      <section className="chat-layout"><div className="panel chat-panel"><div className="chat-header"><span className="chat-avatar">✦</span><div><strong>SafeTrek assistant</strong><small><i className="status-dot" /> Ready to help</small></div><span className="bot-badge">GUIDANCE BOT</span></div><div className="chat-messages">{messages.map((message, index) => <div key={`${index}-${message.from}`} className={`chat-message ${message.from}`}><span className="chat-message-avatar">{message.from === 'bot' ? '✦' : 'You'}</span><p>{message.text}</p></div>)}</div><div className="suggested-questions"><span>QUICK QUESTIONS</span><div>{prompts.map(([question, key]) => <button key={key} onClick={() => reply(question, key)}>{question}</button>)}</div></div><form className="chat-input" onSubmit={submit}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask a travel safety question…" aria-label="Chat message" /><button className="button button-primary" aria-label="Send message">↑</button></form></div><aside className="panel chatbot-disclaimer"><span className="chain-icon">✦</span><h3>Helpful, not emergency support</h3><p>This keyword-based assistant has no live location, hospital directory or connection to emergency services. Always verify local guidance.</p><strong>For immediate danger, contact local emergency services.</strong></aside></section>
    </div>
  )
}
