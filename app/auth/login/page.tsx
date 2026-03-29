'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'

type FormState = 'idle' | 'loading' | 'error'

export default function LoginPage() {
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

  try {
    setFormState('loading')
    setErrorMsg('')

    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: form.email,
        password: form.password
      })
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Login failed')
    }

    // Save token
    localStorage.setItem('noxr_user_token', data.token)

    // Redirect
    window.location.href = '/account'

  } catch (err: any) {
    setFormState('error')
    setErrorMsg(err.message)
  }
}

  return (
    <div className="min-h-screen bg-[#F7F3ED]">
      
      {/* Desktop: Split 50/50 */}
      {/* Mobile: Form only, small hero banner */}
      
      {/* Mobile banner */}
      <div className="lg:hidden relative overflow-hidden" style={{ height: '40vh', backgroundColor: '#1A1208' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: "url('/auth/login-editorial.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center 20%',
            filter: 'brightness(0.45) saturate(0.7)',
            transform: loaded ? 'scale(1)' : 'scale(1.04)',
            transition: 'transform 2s ease',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(26,18,8,0.9) 0%, rgba(26,18,8,0.1) 60%)',
          }}
        />
        <div className="absolute top-6 left-5">
          <Link
            href="/"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '15px',
              letterSpacing: '0.55em',
              fontWeight: 300,
              color: 'rgba(247,243,237,0.7)',
              textDecoration: 'none',
            }}
          >
            NOXR
          </Link>
        </div>
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden lg:grid lg:grid-cols-2 min-h-screen">
        
        {/* Left - Editorial image */}
        <div className="relative overflow-hidden" style={{ backgroundColor: '#1A1208' }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: "url('/auth/login-editorial.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center 20%',
              filter: 'brightness(0.45) saturate(0.7)',
              transform: loaded ? 'scale(1)' : 'scale(1.04)',
              transition: 'transform 2.2s cubic-bezier(0.25,0.46,0.45,0.94)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(26,18,8,0.9) 0%, rgba(26,18,8,0.1) 60%)',
            }}
          />
          <div style={{ position: 'absolute', top: '52px', left: '52px' }}>
            <Link
              href="/"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '17px',
                letterSpacing: '0.55em',
                fontWeight: 300,
                color: 'rgba(247,243,237,0.7)',
                textDecoration: 'none',
              }}
            >
              NOXR
            </Link>
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: '52px',
              left: '52px',
              right: '52px',
              opacity: loaded ? 1 : 0,
              transition: 'opacity 1.4s ease 0.6s',
            }}
          >
            <blockquote
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '22px',
                fontStyle: 'italic',
                fontWeight: 300,
                lineHeight: 1.4,
                color: 'rgba(247,243,237,0.5)',
                letterSpacing: '-0.01em',
                marginBottom: '16px',
              }}
            >
              "Less — done better — is always more."
            </blockquote>
            <p
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: '9px',
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                color: 'rgba(247,243,237,0.25)',
              }}
            >
              NOXR Studio · Karachi
            </p>
          </div>
        </div>

        {/* Right - Form (desktop only) */}
        <div
          className="flex flex-col justify-center"
          style={{
            backgroundColor: '#F7F3ED',
            padding: '80px 72px',
          }}
        >
          <FormContent
            form={form}
            formState={formState}
            errorMsg={errorMsg}
            showPass={showPass}
            loaded={loaded}
            update={update}
            setShowPass={setShowPass}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>

      {/* Mobile: Form below banner */}
      <div className="lg:hidden px-5 py-12">
        <FormContent
          form={form}
          formState={formState}
          errorMsg={errorMsg}
          showPass={showPass}
          loaded={loaded}
          update={update}
          setShowPass={setShowPass}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}

function FormContent({
  form,
  formState,
  errorMsg,
  showPass,
  loaded,
  update,
  setShowPass,
  handleSubmit,
}: {
  form: { email: string; password: string }
  formState: FormState
  errorMsg: string
  showPass: boolean
  loaded: boolean
  update: (field: string, value: string) => void
  setShowPass: (v: any) => void
  handleSubmit: (e: React.FormEvent) => void
}) {
  return (
    <div
      className="max-w-[380px] mx-auto w-full"
      style={{
        opacity: loaded ? 1 : 0,
        transform: loaded ? 'none' : 'translateY(20px)',
        transition: 'all 1s ease 0.2s',
      }}
    >
      <p className="overline mb-5" style={{ color: 'rgba(26,18,8,0.3)' }}>
        Welcome Back
      </p>
      <h1
        className="font-display font-light text-[#1A1208] mb-10"
        style={{
          fontSize: 'clamp(36px, 8vw, 56px)',
          lineHeight: 0.95,
          letterSpacing: '-0.02em',
        }}
      >
        Sign In
      </h1>

      {formState === 'error' && (
        <div
          className="p-4 mb-6 border"
          style={{
            borderColor: 'rgba(160,80,80,0.3)',
            backgroundColor: 'rgba(160,80,80,0.05)',
          }}
        >
          <p
            className="font-body font-light"
            style={{ fontSize: '11px', color: 'rgba(160,80,80,0.9)' }}
          >
            {errorMsg}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <AuthField
          label="Email Address"
          type="email"
          value={form.email}
          placeholder="your@email.com"
          onChange={v => update('email', v)}
        />

        <div>
          <div className="flex justify-between items-center mb-3">
            <p className="overline" style={{ color: 'rgba(26,18,8,0.35)' }}>
              Password
            </p>
            <Link
              href="/auth/forgot-password"
              className="btn-ghost"
              style={{ fontSize: '9px', padding: '4px 0' }}
            >
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              required
              value={form.password}
              onChange={e => update('password', e.target.value)}
              placeholder="••••••••"
              className="w-full bg-transparent border-b outline-none"
              style={{
                borderColor: 'rgba(26,18,8,0.2)',
                padding: '12px 48px 12px 0',
                fontFamily: "'Jost', sans-serif",
                fontSize: '14px',
                fontWeight: 300,
                color: '#1A1208',
                letterSpacing: showPass ? '0.02em' : '0.15em',
              }}
            />
            <button
              type="button"
              onClick={() => setShowPass((v: boolean) => !v)}
              className="absolute right-0 top-1/2 -translate-y-1/2"
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: '8px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(26,18,8,0.3)',
              }}
            >
              {showPass ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={formState === 'loading'}
          className="btn-primary w-full text-center"
          style={{
            padding: '16px',
            marginTop: '16px',
            opacity: formState === 'loading' ? 0.6 : 1,
          }}
        >
          <span>{formState === 'loading' ? 'Signing In…' : 'Sign In'}</span>
        </button>
      </form>

      <div className="flex items-center gap-4 my-8">
        <div className="flex-1 h-px bg-[rgba(26,18,8,0.1)]" />
        <span className="overline text-[8.5px]" style={{ color: 'rgba(26,18,8,0.25)' }}>or</span>
        <div className="flex-1 h-px bg-[rgba(26,18,8,0.1)]" />
      </div>

      <p
        className="font-body font-light text-center mb-5"
        style={{ fontSize: '12px', color: 'rgba(26,18,8,0.45)' }}
      >
        New to NOXR?{' '}
        <Link
          href="/auth/register"
          style={{
            color: '#1A1208',
            textDecoration: 'none',
            borderBottom: '0.5px solid rgba(26,18,8,0.3)',
            paddingBottom: '1px',
          }}
        >
          Create an account
        </Link>
      </p>

      <div className="text-center">
        <Link
          href="/shop"
          className="overline"
          style={{
            color: 'rgba(26,18,8,0.25)',
            textDecoration: 'none',
          }}
        >
          Continue as Guest →
        </Link>
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
      <p className="overline mb-3" style={{ color: 'rgba(26,18,8,0.35)' }}>
        {label}
      </p>
      <input
        type={type}
        required
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-b outline-none"
        style={{
          borderColor: 'rgba(26,18,8,0.2)',
          padding: '12px 0',
          fontFamily: "'Jost', sans-serif",
          fontSize: '14px',
          fontWeight: 300,
          color: '#1A1208',
          transition: 'border-color 0.3s ease',
        }}
        onFocus={e => { e.target.style.borderBottomColor = 'rgba(26,18,8,0.5)' }}
        onBlur={e => { e.target.style.borderBottomColor = 'rgba(26,18,8,0.2)' }}
      />
    </div>
  )
}