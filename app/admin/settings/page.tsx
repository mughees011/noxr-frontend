'use client'
import { adminApi } from '@/lib/api'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function AdminSettingsPage() {
  const router = useRouter()
  const [brandLogo, setBrandLogo] = useState<File | null>(null)
  const [favicon, setFavicon] = useState<File | null>(null)
  const [currency, setCurrency] = useState('PKR')
  const [taxRate, setTaxRate] = useState('17')
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('5000')
  const [supportEmail, setSupportEmail] = useState('support@noxr.store')
  const [phone, setPhone] = useState('+92 300 0000000')
  const [warehouseAddress, setWarehouseAddress] = useState('Main Warehouse, Lahore, Pakistan')
  const [instagram, setInstagram] = useState('https://instagram.com/noxr')
  const [tiktok, setTiktok] = useState('https://tiktok.com/@noxr')
  const [twitter, setTwitter] = useState('https://twitter.com/noxr')

  const handleLogout = () => {
    localStorage.removeItem('noxr_admin_token')
    router.push('/admin/login')
  }

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await adminApi.get('/admin/settings')

      setCurrency(data.currency || 'PKR')
      setTaxRate(data.taxRate?.toString() || '0')
      setFreeShippingThreshold(data.freeShippingThreshold?.toString() || '0')
      setSupportEmail(data.supportEmail || '')
      setPhone(data.phone || '')
      setWarehouseAddress(data.warehouseAddress || '')
      setInstagram(data.socialLinks?.instagram || '')
      setTiktok(data.socialLinks?.tiktok || '')
      setTwitter(data.socialLinks?.twitter || '')
    }

    fetchSettings()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
  e.preventDefault()

  try {
    await adminApi.put('/admin/settings', { currency, taxRate: Number(taxRate), freeShippingThreshold: Number(freeShippingThreshold), supportEmail, phone, warehouseAddress, socialLinks: { instagram, tiktok, twitter } })

    alert('Settings saved')
  } catch (error) {
    console.error(error)
    alert('Failed to save settings')
  }
}

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F3ED' }}>
        
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>

        <div style={{ flex: 1, padding: '48px 52px' }}>
          <div style={{ marginBottom: '40px' }}>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '44px',
                fontWeight: 300,
                letterSpacing: '-0.01em',
                color: '#1A1208',
                marginBottom: '8px',
              }}
            >
              Settings
            </h1>
            <p
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: '12px',
                fontWeight: 300,
                color: 'rgba(26,18,8,0.4)',
              }}
            >
              Configure brand, store, and contact preferences.
            </p>
          </div>

          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gap: '20px' }}>
              <SettingsSection title="Brand Settings">
                <InputField label="Logo Upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setBrandLogo(e.target.files?.[0] ?? null)}
                    style={inputStyle}
                  />
                  {brandLogo && <FieldHint>{brandLogo.name}</FieldHint>}
                </InputField>

                <InputField label="Favicon Upload">
                  <input
                    type="file"
                    accept="image/x-icon,image/png"
                    onChange={e => setFavicon(e.target.files?.[0] ?? null)}
                    style={inputStyle}
                  />
                  {favicon && <FieldHint>{favicon.name}</FieldHint>}
                </InputField>
              </SettingsSection>

              <SettingsSection title="Store Settings">
                <InputField label="Currency">
                  <select value={currency} onChange={e => setCurrency(e.target.value)} style={inputStyle}>
                    <option value="PKR">PKR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </InputField>

                <InputField label="Tax Rate %">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={taxRate}
                    onChange={e => setTaxRate(e.target.value)}
                    style={inputStyle}
                  />
                </InputField>

                <InputField label="Free Shipping Threshold">
                  <input
                    type="number"
                    min="0"
                    value={freeShippingThreshold}
                    onChange={e => setFreeShippingThreshold(e.target.value)}
                    style={inputStyle}
                  />
                </InputField>
              </SettingsSection>

              <SettingsSection title="Contact Settings">
                <InputField label="Support Email">
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={e => setSupportEmail(e.target.value)}
                    style={inputStyle}
                  />
                </InputField>

                <InputField label="Phone">
                  <input type="text" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} />
                </InputField>

                <InputField label="Warehouse Address">
                  <textarea
                    value={warehouseAddress}
                    onChange={e => setWarehouseAddress(e.target.value)}
                    style={{ ...inputStyle, minHeight: '88px', resize: 'vertical' }}
                  />
                </InputField>
              </SettingsSection>

              <SettingsSection title="Social Links">
                <InputField label="Instagram">
                  <input
                    type="url"
                    value={instagram}
                    onChange={e => setInstagram(e.target.value)}
                    style={inputStyle}
                  />
                </InputField>

                <InputField label="TikTok">
                  <input type="url" value={tiktok} onChange={e => setTiktok(e.target.value)} style={inputStyle} />
                </InputField>

                <InputField label="Twitter">
                  <input
                    type="url"
                    value={twitter}
                    onChange={e => setTwitter(e.target.value)}
                    style={inputStyle}
                  />
                </InputField>
              </SettingsSection>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn-primary" style={{ padding: '14px 28px' }}>
                <span>Save Settings</span>
            </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      style={{
        border: '0.5px solid rgba(26,18,8,0.08)',
        backgroundColor: '#F2EDE6',
        padding: '24px',
      }}
    >
      <h2
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '24px',
          fontWeight: 400,
          color: '#1A1208',
          marginBottom: '20px',
        }}
      >
        {title}
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px 20px' }}>{children}</div>
    </section>
  )
}

function InputField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <span
        style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: '10px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(26,18,8,0.45)',
        }}
      >
        {label}
      </span>
      {children}
    </label>
  )
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "'Jost', sans-serif",
        fontSize: '10px',
        color: 'rgba(26,18,8,0.35)',
      }}
    >
      {children}
    </p>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '0.5px solid rgba(26,18,8,0.15)',
  backgroundColor: '#F7F3ED',
  padding: '11px 12px',
  fontFamily: "'Jost', sans-serif",
  fontSize: '12px',
  fontWeight: 300,
  color: '#1A1208',
  outline: 'none',
}
