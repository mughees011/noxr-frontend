'use client'

import { adminApi } from '@/lib/api'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type FormState = 'idle' | 'loading' | 'error'

export default function AdminLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [showPass, setShowPass] = useState(false)

  useEffect(() => { setTimeout(() => setLoaded(true), 100) }, [])

  const update = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setFormState('loading')
  setErrorMsg('')

  try {
    const res = await adminApi.post('/admin/login', {
      email: form.email,
      password: form.password,
    })

    const { token } = res.data

    localStorage.setItem('noxr_admin_token', token)

    router.push('/admin/dashboard')

  } catch (error: any) {
    setFormState('error')
    setErrorMsg(
      error.response?.data?.message || 'Invalid credentials'
    )
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F7F3ED' }}>
      <div
        style={{
          maxWidth: '420px',
          width: '100%',
          padding: '64px 52px',
          border: '0.5px solid rgba(26,18,8,0.08)',
          backgroundColor: '#F2EDE6',
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'none' : 'translateY(20px)',
          transition: 'all 1.2s cubic-bezier(0.25,0.46,0.45,0.94) 0.1s',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <Link
            href="/"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '20px',
              fontWeight: 300,
              letterSpacing: '0.6em',
              color: '#1A1208',
              textDecoration: 'none',
              display: 'inline-block',
              paddingLeft: '0.6em',
            }}
          >
            NOXR
          </Link>
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '9px',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: 'rgba(26,18,8,0.3)',
              marginTop: '16px',
            }}
          >
            Admin Access
          </p>
        </div>

        {/* Header */}
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '38px',
            fontWeight: 300,
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            color: '#1A1208',
            marginBottom: '40px',
            textAlign: 'center',
          }}
        >
          Sign In
        </h1>

        {/* Error */}
        {formState === 'error' && (
          <div
            style={{
              padding: '12px 16px',
              border: '0.5px solid rgba(160,80,80,0.3)',
              backgroundColor: 'rgba(160,80,80,0.05)',
              marginBottom: '24px',
            }}
          >
            <p
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: '11px',
                color: 'rgba(160,80,80,0.9)',
                letterSpacing: '0.02em',
              }}
            >
              {errorMsg}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <AuthField
            label="Email Address"
            type="email"
            value={form.email}
            placeholder="admin@noxr.pk"
            onChange={v => update('email', v)}
          />

          <div>
            <p
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: '9px',
                letterSpacing: '0.38em',
                textTransform: 'uppercase',
                color: 'rgba(26,18,8,0.35)',
                marginBottom: '12px',
              }}
            >
              Password
            </p>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={form.password}
                onChange={e => update('password', e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '0.5px solid rgba(26,18,8,0.2)',
                  padding: '12px 40px 12px 0',
                  fontFamily: "'Jost', sans-serif",
                  fontSize: '13px',
                  fontWeight: 300,
                  color: '#1A1208',
                  outline: 'none',
                  transition: 'border-color 0.3s ease',
                  letterSpacing: showPass ? '0.02em' : '0.15em',
                }}
                onFocus={e => { e.target.style.borderBottomColor = 'rgba(26,18,8,0.5)' }}
                onBlur={e => { e.target.style.borderBottomColor = 'rgba(26,18,8,0.2)' }}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'none',
                  fontFamily: "'Jost', sans-serif",
                  fontSize: '8px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(26,18,8,0.3)',
                  transition: 'color 0.3s ease',
                }}
              >
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={formState === 'loading'}
            className="btn-primary"
            style={{
              width: '100%',
              textAlign: 'center',
              padding: '17px',
              marginTop: '8px',
              opacity: formState === 'loading' ? 0.6 : 1,
              fontSize: '9px',
            }}
          >
            <span>{formState === 'loading' ? 'Signing In…' : 'Sign In to Dashboard'}</span>
          </button>
        </form>

        {/* Divider */}
        <div style={{ height: '0.5px', backgroundColor: 'rgba(26,18,8,0.08)', margin: '32px 0' }} />

        {/* Back to site */}
        <div style={{ textAlign: 'center' }}>
          <Link
            href="/"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '9px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(26,18,8,0.3)',
              textDecoration: 'none',
              transition: 'color 0.3s ease',
            }}
          >
            ← Back to Store
          </Link>
        </div>

        {/* Demo credentials hint */}
        {/* <div
          style={{
            marginTop: '32px',
            padding: '16px',
            backgroundColor: 'rgba(26,18,8,0.03)',
            border: '0.5px solid rgba(26,18,8,0.06)',
          }}
        >
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '8.5px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(26,18,8,0.25)',
              marginBottom: '8px',
            }}
          >
            Demo Credentials
          </p>
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '11px',
              fontWeight: 300,
              lineHeight: 1.6,
              color: 'rgba(26,18,8,0.4)',
            }}
          >
            Email: admin@noxr.pk<br />
            Password: admin123
          </p>
        </div> */}
      </div>
    </div>
  )
}

function AuthField({
  label,
  type,
  value,
  placeholder,
  onChange,
}: {
  label: string
  type: string
  value: string
  placeholder: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <p
        style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: '9px',
          letterSpacing: '0.38em',
          textTransform: 'uppercase',
          color: 'rgba(26,18,8,0.35)',
          marginBottom: '12px',
        }}
      >
        {label}
      </p>
      <input
        type={type}
        required
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          borderBottom: '0.5px solid rgba(26,18,8,0.2)',
          padding: '12px 0',
          fontFamily: "'Jost', sans-serif",
          fontSize: '13px',
          fontWeight: 300,
          color: '#1A1208',
          outline: 'none',
          transition: 'border-color 0.3s ease',
          letterSpacing: '0.02em',
        }}
        onFocus={e => { e.target.style.borderBottomColor = 'rgba(26,18,8,0.5)' }}
        onBlur={e => { e.target.style.borderBottomColor = 'rgba(26,18,8,0.2)' }}
      />
    </div>
  )
}