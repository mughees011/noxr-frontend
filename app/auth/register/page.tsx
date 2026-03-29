'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' })
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [agreed, setAgreed] = useState(false)

  useEffect(() => { setTimeout(() => setLoaded(true), 100) }, [])

  const update = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!agreed) {
    setErrorMsg('You must agree to the terms.')
    setFormState('error')
    return
  }

  if (form.password !== form.confirm) {
    setErrorMsg('Passwords do not match.')
    setFormState('error')
    return
  }

  if (form.password.length < 8) {
    setErrorMsg('Password must be at least 8 characters.')
    setFormState('error')
    return
  }

  try {
    setFormState('loading')
    setErrorMsg('')

    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        password: form.password,
        role: 'user'
      })
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Registration failed')
    }

    // Save token if backend returns it
    if (data.token) {
      localStorage.setItem('noxr_user_token', data.token)
    }

    setFormState('success')

  } catch (err: any) {
    setErrorMsg(err.message)
    setFormState('error')
  }
}


if (formState === 'success') {
  return <SuccessState name={form.firstName} />
}


  return (
    <div className="min-h-screen bg-[#F7F3ED]">
      
      {/* Mobile banner */}
      <div className="lg:hidden relative overflow-hidden" style={{ height: '40vh', backgroundColor: '#1A1208' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: "url('/auth/register-editorial.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
            filter: 'brightness(0.4) saturate(0.65)',
            transform: loaded ? 'scale(1)' : 'scale(1.04)',
            transition: 'transform 2s ease',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,18,8,0.9) 0%, rgba(26,18,8,0.1) 65%)' }} />
        <div className="absolute top-6 left-5">
          <Link href="/" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '15px', letterSpacing: '0.55em', fontWeight: 300, color: 'rgba(247,243,237,0.7)', textDecoration: 'none' }}>
            NOXR
          </Link>
        </div>
        <div className="absolute bottom-6 left-5 right-5" style={{ opacity: loaded ? 1 : 0, transition: 'opacity 1.2s ease 0.4s' }}>
          <p className="overline mb-3" style={{ color: 'rgba(247,243,237,0.25)' }}>Members receive</p>
          {['Early access', 'Order tracking', 'Easy returns'].map(b => (
            <div key={b} className="flex items-center gap-3 mb-2">
              <span style={{ width: '14px', height: '0.5px', backgroundColor: 'rgba(247,243,237,0.2)' }} />
              <span className="font-body font-light" style={{ fontSize: '11px', color: 'rgba(247,243,237,0.4)' }}>{b}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden lg:grid lg:grid-cols-2 min-h-screen">
        
        {/* Left - Editorial */}
        <div className="relative overflow-hidden" style={{ backgroundColor: '#1A1208' }}>
          <div
            style={{
              position: 'absolute', inset: 0,
              backgroundImage: "url('/auth/register-editorial.jpg')",
              backgroundSize: 'cover', backgroundPosition: 'center 30%',
              filter: 'brightness(0.4) saturate(0.65)',
              transform: loaded ? 'scale(1)' : 'scale(1.04)',
              transition: 'transform 2.2s cubic-bezier(0.25,0.46,0.45,0.94)',
            }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,18,8,0.9) 0%, rgba(26,18,8,0.08) 65%)' }} />
          <div style={{ position: 'absolute', top: '52px', left: '52px' }}>
            <Link href="/" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '17px', letterSpacing: '0.55em', fontWeight: 300, color: 'rgba(247,243,237,0.7)', textDecoration: 'none' }}>
              NOXR
            </Link>
          </div>
          <div style={{ position: 'absolute', bottom: '52px', left: '52px', right: '52px', opacity: loaded ? 1 : 0, transition: 'opacity 1.4s ease 0.6s' }}>
            <p className="overline mb-4" style={{ color: 'rgba(247,243,237,0.25)' }}>Members receive</p>
            {['Early access to new drops', 'Order tracking & history', 'Seamless returns'].map(b => (
              <div key={b} className="flex items-center gap-3 mb-3">
                <span style={{ width: '16px', height: '0.5px', backgroundColor: 'rgba(247,243,237,0.2)', flexShrink: 0 }} />
                <span className="font-body font-light" style={{ fontSize: '11.5px', color: 'rgba(247,243,237,0.4)' }}>{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Form (desktop) */}
        <div className="flex flex-col justify-center" style={{ backgroundColor: '#F7F3ED', padding: '80px 72px', overflowY: 'auto' }}>
          <FormContent
            form={form}
            formState={formState}
            errorMsg={errorMsg}
            showPass={showPass}
            agreed={agreed}
            loaded={loaded}
            update={update}
            setShowPass={setShowPass}
            setAgreed={setAgreed}
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
          agreed={agreed}
          loaded={loaded}
          update={update}
          setShowPass={setShowPass}
          setAgreed={setAgreed}
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
  agreed,
  loaded,
  update,
  setShowPass,
  setAgreed,
  handleSubmit,
}: any) {
  return (
    <div
      className="max-w-[400px] mx-auto w-full"
      style={{
        opacity: loaded ? 1 : 0,
        transform: loaded ? 'none' : 'translateY(20px)',
        transition: 'all 1s ease 0.2s',
      }}
    >
      <p className="overline mb-5" style={{ color: 'rgba(26,18,8,0.3)' }}>Join NOXR</p>
      <h1
        className="font-display font-light text-[#1A1208] mb-10"
        style={{
          fontSize: 'clamp(36px, 8vw, 56px)',
          lineHeight: 0.95,
          letterSpacing: '-0.02em',
        }}
      >
        Create Account
      </h1>

      {formState === 'error' && (
        <div className="p-4 mb-6 border" style={{ borderColor: 'rgba(160,80,80,0.3)', backgroundColor: 'rgba(160,80,80,0.05)' }}>
          <p className="font-body font-light" style={{ fontSize: '11px', color: 'rgba(160,80,80,0.9)' }}>{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Name row: 1 col mobile, 2 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AuthField label="First Name" type="text" value={form.firstName} placeholder="Ali" onChange={(v: string) => update('firstName', v)} />
          <AuthField label="Last Name" type="text" value={form.lastName} placeholder="Khan" onChange={(v: string) => update('lastName', v)} />
        </div>

        <AuthField label="Email Address" type="email" value={form.email} placeholder="your@email.com" onChange={(v: string) => update('email', v)} />

        {/* Password */}
        <div>
          <p className="overline mb-3" style={{ color: 'rgba(26,18,8,0.35)' }}>Password</p>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              required
              minLength={8}
              value={form.password}
              onChange={e => update('password', e.target.value)}
              placeholder="Min. 8 characters"
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

          {/* Password strength */}
          {form.password.length > 0 && (
            <div className="mt-2 flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: '2px',
                    backgroundColor: i < getPasswordStrength(form.password)
                      ? getStrengthColor(form.password)
                      : 'rgba(26,18,8,0.08)',
                    transition: 'background-color 0.3s ease',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <AuthField label="Confirm Password" type="password" value={form.confirm} placeholder="Repeat password" onChange={(v: string) => update('confirm', v)} />

        {/* Agreement checkbox */}
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => setAgreed((v: boolean) => !v)}
            className="flex-shrink-0 mt-1"
            style={{
              width: '18px',
              height: '18px',
              border: `0.5px solid ${agreed ? '#1A1208' : 'rgba(26,18,8,0.25)'}`,
              backgroundColor: agreed ? '#1A1208' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
            }}
          >
            {agreed && <span style={{ color: '#F7F3ED', fontSize: '10px' }}>✓</span>}
          </button>
          <p className="font-body font-light" style={{ fontSize: '11px', lineHeight: 1.6, color: 'rgba(26,18,8,0.4)' }}>
            I agree to NOXR's{' '}
            <Link href="/terms" style={{ color: '#1A1208', textDecoration: 'none', borderBottom: '0.5px solid rgba(26,18,8,0.3)' }}>
              Terms
            </Link>
            {' '}and{' '}
            <Link href="/privacy" style={{ color: '#1A1208', textDecoration: 'none', borderBottom: '0.5px solid rgba(26,18,8,0.3)' }}>
              Privacy Policy
            </Link>
          </p>
        </div>

        <button
          type="submit"
          disabled={formState === 'loading' || !agreed}
          className="btn-primary w-full text-center"
          style={{
            padding: '16px',
            marginTop: '8px',
            opacity: formState === 'loading' || !agreed ? 0.5 : 1,
          }}
        >
          <span>{formState === 'loading' ? 'Creating Account…' : 'Create Account'}</span>
        </button>
      </form>

      <div className="flex items-center gap-4 my-8">
        <div className="flex-1 h-px bg-[rgba(26,18,8,0.1)]" />
        <span className="overline text-[8.5px]" style={{ color: 'rgba(26,18,8,0.25)' }}>or</span>
        <div className="flex-1 h-px bg-[rgba(26,18,8,0.1)]" />
      </div>

      <p className="font-body font-light text-center" style={{ fontSize: '12px', color: 'rgba(26,18,8,0.45)' }}>
        Already have an account?{' '}
        <Link href="/auth/login" style={{ color: '#1A1208', textDecoration: 'none', borderBottom: '0.5px solid rgba(26,18,8,0.3)' }}>
          Sign in
        </Link>
      </p>
    </div>
  )
}

function SuccessState({ name }: { name: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F3ED] px-5">
      <div className="text-left max-w-[400px]">
        <div className="font-display font-light text-[#1A1208] mb-6" style={{ fontSize: '56px' }}>✓</div>
        <h2
          className="font-display font-light text-[#1A1208] mb-4"
          style={{ fontSize: 'clamp(36px, 8vw, 44px)', letterSpacing: '-0.01em', lineHeight: 1 }}
        >
          Welcome,<br /><em className="italic">{name}.</em>
        </h2>
        <p className="font-body font-light mb-10" style={{ fontSize: '14px', lineHeight: 1.8, color: 'rgba(26,18,8,0.45)' }}>
          Your account has been created. You now have early access to new drops.
        </p>
        <Link href="/shop" className="btn-primary">
          <span>Start Shopping</span>
        </Link>
      </div>
    </div>
  )
}

function AuthField({ label, type, value, placeholder, onChange }: any) {
  return (
    <div>
      <p className="overline mb-3" style={{ color: 'rgba(26,18,8,0.35)' }}>{label}</p>
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
        }}
        onFocus={e => { e.target.style.borderBottomColor = 'rgba(26,18,8,0.5)' }}
        onBlur={e => { e.target.style.borderBottomColor = 'rgba(26,18,8,0.2)' }}
      />
    </div>
  )
}

function getPasswordStrength(pw: string): number {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score
}

function getStrengthColor(pw: string): string {
  const s = getPasswordStrength(pw)
  if (s <= 1) return 'rgba(160,80,80,0.7)'
  if (s === 2) return 'rgba(180,130,50,0.7)'
  if (s === 3) return 'rgba(107,143,94,0.6)'
  return 'rgba(107,143,94,0.9)'
}