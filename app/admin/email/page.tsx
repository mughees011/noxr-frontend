'use client'
import { useMemo, useState, useEffect, type CSSProperties, type ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { adminApi } from '@/lib/api'

type EmailTemplate = {
  templateId: string
  name: string
  subject: string
  bodyHtml: string
  branding: string
  footer: string
  buttonText: string
}

type AudienceSegment = 'all' | 'repeat' | 'inactive_60' | 'collection_buyers'

type Campaign = {
  _id: string
  subject: string
  previewText: string
  audience: AudienceSegment
  schedule: string
  status: 'draft' | 'scheduled' | 'sent'
}

type EmailLog = {
  id: string
  recipient: string
  status: 'delivered' | 'bounced'
  date: string
  template: string
}

export default function AdminEmailsPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [logs, setLogs] = useState<EmailLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [campaignForm, setCampaignForm] = useState({
    subject: '',
    previewText: '',
    audience: 'all' as AudienceSegment,
    schedule: '',
  })

  const selectedTemplate = useMemo(
    () => templates.find(template => template.templateId === selectedTemplateId) ?? templates[0] ?? null,
    [templates, selectedTemplateId],
  )

  const [metrics, setMetrics] = useState({
    openRate: 0,
    clickRate: 0,
    conversionRate: 0,
    campaignRevenue: 0,
    deliveryRate: 0,
    bounceRate: 0
  })

const saveTemplate = async () => {
  try {
    const res = await adminApi.get(`/admin/emails/template/${selectedTemplate?.templateId}`)

    if (res.status === 401) {
      localStorage.removeItem('noxr_admin_token')
      router.push('/admin/login')
      return
    }

    if (!res.ok) throw new Error()

    alert('Template saved')
  } catch {
    alert('Failed to save template')
  }
}

  const handleLogout = () => {
    localStorage.removeItem('noxr_admin_token')
    router.push('/admin/login')
  }

  const updateTemplate = (field: keyof EmailTemplate, value: string) => {
    if (!selectedTemplate) return

    setTemplates(prev => prev.map(template => (template.templateId === selectedTemplate.templateId ? { ...template, [field]: value } : template)))
  }

  const createCampaign = async () => {
  const res = await adminApi.post('/admin/emails/campaign')

  const data = await res.json()
  setCampaigns(prev => [data, ...prev])
}

  const sendNow = async (campaignId: string) => {
  try {
    const res = await adminApi.post(`/admin/emails/campaign/${campaignId}/send`)

    if (res.status === 401) {
      localStorage.removeItem('noxr_admin_token')
      router.push('/admin/login')
      return
    }

    if (!res.ok) throw new Error()

    setCampaigns(prev =>
      prev.map(c =>
        c._id === campaignId ? { ...c, status: 'sent' } : c
      )
    )
  } catch {
    alert('Failed to send campaign')
  }
}

  useEffect(() => {
  const fetchEmailData = async () => {
    try {
      const res = await adminApi.get('/admin/emails')

      if (res.status === 401) {
        localStorage.removeItem('noxr_admin_token')
        router.push('/admin/login')
        return
      }

      if (!res.ok) throw new Error()

      const data = await res.json()

      setTemplates(data.templates || [])
      setCampaigns(data.campaigns || [])
      setLogs(data.logs || [])

      if (data.metrics) {
        setMetrics(data.metrics)
      }

      if (data.templates?.length > 0) {
        setSelectedTemplateId(data.templates[0].templateId)
      }

    } catch {
      setError('Failed to load email data')
    } finally {
      setLoading(false)
    }
  }

  fetchEmailData()
}, [])

if (loading) return <div>Loading...</div>
if (error) return <div>{error}</div>


  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F3ED' }}>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>

        <main style={{ flex: 1, padding: '48px 52px' }}>
          <header style={{ marginBottom: '24px' }}>
            <h1 style={pageTitleStyle}>Email Strategy</h1>
            <p style={descriptionStyle}>Manage templates, run campaigns, inspect logs, and track performance metrics.</p>
          </header>

          <section style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '18px', marginBottom: '18px' }}>
            <Card>
              <h2 style={sectionTitleStyle}>Email Templates Manager</h2>
              <p style={{ ...descriptionStyle, marginBottom: '12px' }}>Automated email library</p>
              <div style={{ display: 'grid' }}>
                {templates.map((template, index) => {
                  const active = selectedTemplate?.templateId === template.templateId
                  return (
                    <button
                      key={template.templateId}
                      onClick={() => setSelectedTemplateId(template.templateId)}
                      style={{
                        border: 'none',
                        borderBottom: index === templates.length - 1 ? 'none' : '0.5px solid rgba(26,18,8,0.08)',
                        backgroundColor: active ? 'rgba(26,18,8,0.04)' : 'transparent',
                        textAlign: 'left',
                        padding: '12px 10px',
                        cursor: 'pointer',
                        fontFamily: "'Jost', sans-serif",
                        fontSize: '11px',
                        color: '#1A1208',
                      }}
                    >
                      {template.name}
                    </button>
                  )
                })}
              </div>
            </Card>

            <Card>
              <h2 style={sectionTitleStyle}>Edit Template</h2>
              {selectedTemplate ? (
                <div style={{ display: 'grid', gap: '10px' }}>
                  <Field label="Subject line">
                    <input value={selectedTemplate.subject} onChange={e => updateTemplate('subject', e.target.value)} style={inputStyle} />
                  </Field>
                  <Field label="Body HTML">
                    <textarea
                      value={selectedTemplate.bodyHtml}
                      onChange={e => updateTemplate('bodyHtml', e.target.value)}
                      rows={4}
                      style={textareaStyle}
                    />
                  </Field>
                  <Field label="Branding">
                    <input value={selectedTemplate.branding} onChange={e => updateTemplate('branding', e.target.value)} style={inputStyle} />
                  </Field>
                  <Field label="Footer">
                    <input value={selectedTemplate.footer} onChange={e => updateTemplate('footer', e.target.value)} style={inputStyle} />
                  </Field>
                  <Field label="Button text">
                    <input
                      value={selectedTemplate.buttonText}
                      onChange={e => updateTemplate('buttonText', e.target.value)}
                      style={inputStyle}
                    />
                  </Field>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-primary" style={{ fontSize: '9px' }} onClick={saveTemplate}>
                      Save Template
                    </button>
                    <button className="btn-ghost" style={{ fontSize: '9px' }}>
                      Preview
                    </button>
                  </div>
                </div>
              ) : null}
            </Card>
          </section>

          <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '18px' }}>
            <Card>
              <h2 style={sectionTitleStyle}>Broadcast Campaigns</h2>
              <p style={{ ...descriptionStyle, marginBottom: '12px' }}>Create campaigns to turn email into a growth engine.</p>

              <div style={{ display: 'grid', gap: '10px', marginBottom: '14px' }}>
                <Field label="Subject">
                  <input
                    value={campaignForm.subject}
                    onChange={e => setCampaignForm(prev => ({ ...prev, subject: e.target.value }))}
                    style={inputStyle}
                  />
                </Field>
                <Field label="Preview text">
                  <input
                    value={campaignForm.previewText}
                    onChange={e => setCampaignForm(prev => ({ ...prev, previewText: e.target.value }))}
                    style={inputStyle}
                  />
                </Field>
                <Field label="Audience segment">
                  <select
                    value={campaignForm.audience}
                    onChange={e => setCampaignForm(prev => ({ ...prev, audience: e.target.value as AudienceSegment }))}
                    style={inputStyle}
                  >
                    <option value="all">All customers</option>
                    <option value="repeat">Repeat buyers</option>
                    <option value="inactive_60">No purchase 60 days</option>
                    <option value="collection_buyers">Specific collection buyers</option>
                  </select>
                </Field>
                <Field label="Schedule">
                  <input
                    type="datetime-local"
                    value={campaignForm.schedule}
                    onChange={e => setCampaignForm(prev => ({ ...prev, schedule: e.target.value }))}
                    style={inputStyle}
                  />
                </Field>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={createCampaign} className="btn-primary" style={{ fontSize: '9px' }}>
                    Create Campaign
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '8px' }}>
                {campaigns.map(campaign => (
                  <div key={campaign._id} style={listRowStyle}>
                    <div>
                      <p style={smallTextStyle}>{campaign.subject}</p>
                      <p style={mutedTextStyle}>
                        {campaign.previewText} · {audienceLabel(campaign.audience)}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={statusStyle(campaign.status)}>{campaign.status}</span>
                      <button onClick={() => sendNow(campaign._id)} className="btn-ghost" style={{ fontSize: '9px' }}>
                        Send now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h2 style={sectionTitleStyle}>Email Logs</h2>
              <p style={{ ...descriptionStyle, marginBottom: '12px' }}>Visibility into what was sent and how it performed.</p>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Email sent', 'Recipient', 'Status', 'Date', 'Template used'].map(head => (
                      <th key={head} style={tableHeaderStyle}>
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logs.map(log => (
                    <tr key={log.id}>
                      <td style={tableCellStyle}>{log.id}</td>
                      <td style={tableCellStyle}>{log.recipient}</td>
                      <td style={tableCellStyle}>
                        <span style={statusStyle(log.status)}>{log.status}</span>
                      </td>
                      <td style={tableCellStyle}>{formatDate(log.date)}</td>
                      <td style={tableCellStyle}>{log.template}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </section>

          <Card>
            <h2 style={sectionTitleStyle}>Metrics Section</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '10px' }}>
              <MetricCard label="Open rate" value={`${metrics.openRate}%`} />
              <MetricCard label="Click rate" value={`${metrics.clickRate}%`} />
              <MetricCard label="Conversion rate" value={`${metrics.conversionRate}%`} />
              <MetricCard label="Revenue from campaigns" value={`PKR ${metrics.campaignRevenue.toLocaleString()}`} />
            </div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
              <p style={mutedTextStyle}>Delivery rate: {metrics.deliveryRate}%</p>
              <p style={mutedTextStyle}>Bounce rate: {metrics.bounceRate}%</p>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}

function Card({ children }: { children: ReactNode }) {
  return <section style={cardStyle}>{children}</section>
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label style={{ display: 'grid', gap: '6px' }}>
      <span style={fieldLabelStyle}>{label}</span>
      {children}
    </label>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={metricCardStyle}>
      <p style={fieldLabelStyle}>{label}</p>
      <p style={{ ...sectionTitleStyle, fontSize: '28px' }}>{value}</p>
    </div>
  )
}

function audienceLabel(audience: AudienceSegment) {
  if (audience === 'repeat') return 'Repeat buyers'
  if (audience === 'inactive_60') return 'No purchase 60 days'
  if (audience === 'collection_buyers') return 'Collection buyers'
  return 'All customers'
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function statusStyle(status: string): CSSProperties {
  if (status === 'delivered' || status === 'sent') {
    return badgeStyle('rgba(107,143,94,0.08)', 'rgba(107,143,94,0.9)')
  }
  if (status === 'bounced') {
    return badgeStyle('rgba(160,80,80,0.08)', 'rgba(160,80,80,0.9)')
  }
  if (status === 'scheduled') {
    return badgeStyle('rgba(122,92,142,0.08)', 'rgba(122,92,142,0.9)')
  }
  return badgeStyle('rgba(26,18,8,0.06)', 'rgba(26,18,8,0.7)')
}

function badgeStyle(backgroundColor: string, color: string): CSSProperties {
  return {
    fontFamily: "'Jost', sans-serif",
    fontSize: '8px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    padding: '4px 8px',
    backgroundColor,
    color,
  }
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

const sectionTitleStyle: CSSProperties = {
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: '24px',
  fontWeight: 400,
  color: '#1A1208',
  marginBottom: '2px',
}

const descriptionStyle: CSSProperties = {
  fontFamily: "'Jost', sans-serif",
  fontSize: '12px',
  fontWeight: 300,
  color: 'rgba(26,18,8,0.4)',
}

const smallTextStyle: CSSProperties = {
  fontFamily: "'Jost', sans-serif",
  fontSize: '11px',
  color: '#1A1208',
}

const mutedTextStyle: CSSProperties = {
  fontFamily: "'Jost', sans-serif",
  fontSize: '10px',
  color: 'rgba(26,18,8,0.45)',
}

const cardStyle: CSSProperties = {
  border: '0.5px solid rgba(26,18,8,0.08)',
  backgroundColor: '#F2EDE6',
  padding: '20px',
}

const metricCardStyle: CSSProperties = {
  border: '0.5px solid rgba(26,18,8,0.1)',
  backgroundColor: '#F7F3ED',
  padding: '14px',
}

const fieldLabelStyle: CSSProperties = {
  fontFamily: "'Jost', sans-serif",
  fontSize: '8px',
  textTransform: 'uppercase',
  letterSpacing: '0.22em',
  color: 'rgba(26,18,8,0.45)',
}

const inputStyle: CSSProperties = {
  height: '36px',
  border: '0.5px solid rgba(26,18,8,0.14)',
  backgroundColor: '#F7F3ED',
  color: '#1A1208',
  fontFamily: "'Jost', sans-serif",
  fontSize: '12px',
  fontWeight: 300,
  padding: '0 10px',
  outline: 'none',
}

const textareaStyle: CSSProperties = {
  ...inputStyle,
  height: 'auto',
  minHeight: '100px',
  padding: '10px',
  resize: 'vertical',
}

const listRowStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '10px',
  paddingBottom: '8px',
  borderBottom: '0.5px solid rgba(26,18,8,0.06)',
}

const tableHeaderStyle: CSSProperties = {
  textAlign: 'left',
  fontFamily: "'Jost', sans-serif",
  fontSize: '8px',
  textTransform: 'uppercase',
  letterSpacing: '0.22em',
  color: 'rgba(26,18,8,0.45)',
  padding: '10px 6px',
  borderBottom: '0.5px solid rgba(26,18,8,0.08)',
  whiteSpace: 'nowrap',
}

const tableCellStyle: CSSProperties = {
  fontFamily: "'Jost', sans-serif",
  fontSize: '11px',
  color: '#1A1208',
  padding: '10px 6px',
  borderBottom: '0.5px solid rgba(26,18,8,0.06)',
  whiteSpace: 'nowrap',
}