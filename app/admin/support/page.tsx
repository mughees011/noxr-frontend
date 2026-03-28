'use client'

import { useMemo, useEffect, useState, type CSSProperties, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'


type SupportMessage = {
  id: string
  customerName: string
  customerEmail: string
  subject: string
  message: string
  createdAt: string
  status: 'new' | 'replied'
  adminReply?: string
}


export default function AdminSupportPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<SupportMessage[]>([])
  const [selectedMessageId, setSelectedMessageId] = useState('')
  const [replyText, setReplyText] = useState('')

  const selectedMessage = useMemo(
    () => messages.find(message => message.id === selectedMessageId) ?? null,
    [messages, selectedMessageId],
  )

  const handleLogout = () => {
    localStorage.removeItem('noxr_admin_token')
    router.push('/admin/login')
  }

  const handleReplySubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault()

  if (!selectedMessage || !replyText.trim()) return

  await fetch(
    `http://localhost:5000/api/admin/support/${selectedMessage.id}/reply`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('noxr_admin_token')}`
      },
      body: JSON.stringify({ reply: replyText.trim() })
    }
  )

  setMessages(prev =>
    prev.map(message =>
      message.id === selectedMessage.id
        ? { ...message, status: 'replied', adminReply: replyText.trim() }
        : message
    )
  )

  setReplyText('')
}



  useEffect(() => {
  const fetchMessages = async () => {
    const res = await fetch('http://localhost:5000/api/admin/support', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('noxr_admin_token')}`
      }
    })

    const data = await res.json()
    setMessages(data)
  }

  fetchMessages()
}, [])

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F3ED' }}>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>

        <div style={{ flex: 1, padding: '48px 52px' }}>
          <header style={{ marginBottom: '28px' }}>
            <h1 style={pageTitleStyle}>Support Inbox</h1>
            <p style={pageDescriptionStyle}>
              Contact form submissions are listed here. Reply from dashboard to email the customer directly.
            </p>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '18px' }}>
            <section style={panelStyle}>
              <h2 style={sectionTitleStyle}>Incoming Messages</h2>
              <div style={{ display: 'grid' }}>
                {messages.map((message, index) => (
                  <button
                    key={message.id}
                    onClick={() => setSelectedMessageId(message.id)}
                    style={{
                      textAlign: 'left',
                      border: 'none',
                      borderBottom: index === messages.length - 1 ? 'none' : '0.5px solid rgba(26,18,8,0.08)',
                      padding: '14px 2px',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '5px' }}>
                      <p style={messageMetaStyle}>
                        {message.customerName} · {message.id}
                      </p>
                      <span style={message.status === 'new' ? newBadgeStyle : repliedBadgeStyle}>{message.status}</span>
                    </div>
                    <p style={subjectStyle}>{message.subject}</p>
                    <p style={timeStyle}>
                      {new Date(message.createdAt).toLocaleDateString()} · {message.customerEmail}
                    </p>
                  </button>
                ))}
              </div>
            </section>

            <section style={panelStyle}>
              <h2 style={sectionTitleStyle}>Reply Workspace</h2>
              {selectedMessage ? (
                <>
                  <div style={{ marginBottom: '16px' }}>
                    <p style={messageMetaStyle}>
                      {selectedMessage.customerName} · {selectedMessage.customerEmail}
                    </p>
                    <p style={subjectStyle}>{selectedMessage.subject}</p>
                  </div>

                  <div style={messageBodyStyle}>{selectedMessage.message}</div>

                  {selectedMessage.adminReply ? (
                    <div style={existingReplyStyle}>
                      <p style={{ ...timeStyle, marginBottom: '6px' }}>Previous reply sent</p>
                      <p style={{ ...messageMetaStyle, lineHeight: 1.5 }}>{selectedMessage.adminReply}</p>
                    </div>
                  ) : null}

                  <form onSubmit={handleReplySubmit} style={{ display: 'grid', gap: '10px' }}>
                    <label style={fieldLabelStyle}>Admin Reply</label>
                    <textarea
                      value={replyText}
                      onChange={event => setReplyText(event.target.value)}
                      rows={5}
                      placeholder="Write a response to the customer. On submit, this should trigger support-reply email in backend API."
                      style={textareaStyle}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button type="submit" className="btn-primary" style={{ fontSize: '9px' }}>
                        Send Reply
                      </button>
                      <button
                        type="button"
                        className="btn-ghost"
                        style={{ fontSize: '9px' }}
                        onClick={() => setReplyText('')}
                      >
                        Clear
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <p style={pageDescriptionStyle}>Select a message to view details and send reply.</p>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

const panelStyle: CSSProperties = {
  border: '0.5px solid rgba(26,18,8,0.08)',
  backgroundColor: '#F2EDE6',
  padding: '20px',
}

const logoStyle: CSSProperties = {
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: '16px',
  fontWeight: 300,
  letterSpacing: '0.5em',
  color: '#1A1208',
  textDecoration: 'none',
  paddingLeft: '0.5em',
}

const subtitleStyle: CSSProperties = {
  fontFamily: "'Jost', sans-serif",
  fontSize: '8px',
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  color: 'rgba(26,18,8,0.25)',
}

const pageTitleStyle: CSSProperties = {
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: '44px',
  fontWeight: 300,
  letterSpacing: '-0.01em',
  color: '#1A1208',
  marginBottom: '8px',
}

const pageDescriptionStyle: CSSProperties = {
  fontFamily: "'Jost', sans-serif",
  fontSize: '12px',
  fontWeight: 300,
  color: 'rgba(26,18,8,0.4)',
}

const sectionTitleStyle: CSSProperties = {
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: '24px',
  fontWeight: 400,
  color: '#1A1208',
  marginBottom: '12px',
}

const messageMetaStyle: CSSProperties = {
  fontFamily: "'Jost', sans-serif",
  fontSize: '11px',
  color: '#1A1208',
}

const subjectStyle: CSSProperties = {
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: '20px',
  fontWeight: 400,
  color: '#1A1208',
  marginBottom: '4px',
}

const timeStyle: CSSProperties = {
  fontFamily: "'Jost', sans-serif",
  fontSize: '10px',
  color: 'rgba(26,18,8,0.4)',
}

const fieldLabelStyle: CSSProperties = {
  fontFamily: "'Jost', sans-serif",
  fontSize: '9px',
  textTransform: 'uppercase',
  letterSpacing: '0.22em',
  color: 'rgba(26,18,8,0.45)',
}

const textareaStyle: CSSProperties = {
  border: '0.5px solid rgba(26,18,8,0.14)',
  backgroundColor: '#F7F3ED',
  color: '#1A1208',
  fontFamily: "'Jost', sans-serif",
  fontSize: '12px',
  fontWeight: 300,
  padding: '10px',
  outline: 'none',
  resize: 'vertical',
}

const messageBodyStyle: CSSProperties = {
  border: '0.5px solid rgba(26,18,8,0.1)',
  backgroundColor: '#F7F3ED',
  padding: '14px',
  fontFamily: "'Jost', sans-serif",
  fontSize: '12px',
  lineHeight: 1.6,
  color: '#1A1208',
  marginBottom: '14px',
}

const existingReplyStyle: CSSProperties = {
  border: '0.5px solid rgba(107,143,94,0.2)',
  backgroundColor: 'rgba(107,143,94,0.07)',
  padding: '12px',
  marginBottom: '12px',
}

const newBadgeStyle: CSSProperties = {
  fontFamily: "'Jost', sans-serif",
  fontSize: '8px',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  padding: '4px 8px',
  backgroundColor: 'rgba(180,130,50,0.08)',
  color: 'rgba(180,130,50,0.9)',
}

const repliedBadgeStyle: CSSProperties = {
  fontFamily: "'Jost', sans-serif",
  fontSize: '8px',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  padding: '4px 8px',
  backgroundColor: 'rgba(107,143,94,0.08)',
  color: 'rgba(107,143,94,0.9)',
}