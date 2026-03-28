'use client'

import { useState, useEffect } from 'react'

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingDiscount, setEditingDiscount] = useState<any>(null)

  useEffect(() => {
    fetchDiscounts()
  }, [])

  const fetchDiscounts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/discounts/admin/all')
      const data = await res.json()
      setDiscounts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this discount code? This cannot be undone.')) return

    await fetch(`http://localhost:5000/api/discounts/${id}`, {
      method: 'DELETE',
    })

    fetchDiscounts()
  }

  const toggleActive = async (discount: any) => {
    await fetch(`http://localhost:5000/api/discounts/${discount._id}/toggle`, {
      method: 'PATCH',
    })

    fetchDiscounts()
  }

  return (
    <div className="min-h-screen bg-[#F7F3ED]">
      <div style={{ flex: 1, padding: '48px 52px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <p className="overline mb-3">Promotions</p>
            <h1 className="font-display font-light text-[#1A1208]" style={{ fontSize: 'clamp(36px, 5vw, 56px)', letterSpacing: '-0.02em', marginBottom: '8px' }}>
              Discount Codes
            </h1>
            <p className="overline" style={{ color: 'rgba(26,18,8,0.3)' }}>
              {discounts.length} {discounts.length === 1 ? 'Code' : 'Codes'}
            </p>
          </div>

          <button onClick={() => { setEditingDiscount(null); setShowModal(true) }} className="btn-primary">
            <span>+ Create Discount</span>
          </button>
        </div>

        {/* Discounts Table */}
        <div className="border" style={{ borderColor: 'rgba(26,18,8,0.08)', backgroundColor: 'white' }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '0.5px solid rgba(26,18,8,0.08)' }}>
                <th className="text-left p-4 overline" style={{ color: 'rgba(26,18,8,0.4)' }}>Code</th>
                <th className="text-left p-4 overline" style={{ color: 'rgba(26,18,8,0.4)' }}>Type</th>
                <th className="text-left p-4 overline" style={{ color: 'rgba(26,18,8,0.4)' }}>Value</th>
                <th className="text-left p-4 overline" style={{ color: 'rgba(26,18,8,0.4)' }}>Used</th>
                <th className="text-left p-4 overline" style={{ color: 'rgba(26,18,8,0.4)' }}>Expiry</th>
                <th className="text-left p-4 overline" style={{ color: 'rgba(26,18,8,0.4)' }}>Status</th>
                <th className="text-left p-4 overline" style={{ color: 'rgba(26,18,8,0.4)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((discount) => (
                <tr key={discount._id} style={{ borderBottom: '0.5px solid rgba(26,18,8,0.08)' }}>
                  <td className="p-4">
                    <p className="font-body font-light" style={{ fontSize: '13px', fontWeight: 500, color: '#1A1208', fontFamily: 'monospace' }}>
                      {discount.code}
                    </p>
                    {discount.description && (
                      <p className="font-body font-light" style={{ fontSize: '11px', color: 'rgba(26,18,8,0.4)' }}>
                        {discount.description}
                      </p>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="font-body font-light" style={{ fontSize: '12px', color: 'rgba(26,18,8,0.6)' }}>
                      {discount.type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-body font-light" style={{ fontSize: '13px', color: '#1A1208', fontWeight: 500 }}>
                      {discount.type === 'percentage' ? `${discount.value}%` : `PKR ${discount.value}`}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-body font-light" style={{ fontSize: '12px', color: 'rgba(26,18,8,0.6)' }}>
                      {discount.usedCount} {discount.maxUses ? `/ ${discount.maxUses}` : ''}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-body font-light" style={{ fontSize: '12px', color: 'rgba(26,18,8,0.6)' }}>
                      {discount.expiryDate 
                        ? new Date(discount.expiryDate).toLocaleDateString()
                        : 'No expiry'
                      }
                    </span>
                  </td>
                  <td className="p-4">
                    <span 
                      className="px-2 py-1 overline"
                      style={{ 
                        backgroundColor: discount.isActive ? 'rgba(107,143,94,0.15)' : 'rgba(180,130,50,0.15)',
                        color: discount.isActive ? '#6B8F5E' : 'rgba(180,130,50,0.9)',
                        fontSize: '8px'
                      }}
                    >
                      {discount.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setEditingDiscount(discount); setShowModal(true) }}
                        className="btn-ghost"
                        style={{ fontSize: '9px', padding: '6px 12px' }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => toggleActive(discount)}
                        className="btn-ghost"
                        style={{ fontSize: '9px', padding: '6px 12px' }}
                      >
                        {discount.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        onClick={() => handleDelete(discount._id)}
                        className="btn-ghost"
                        style={{ fontSize: '9px', padding: '6px 12px', color: 'rgba(160,80,80,0.7)' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {discounts.length === 0 && !loading && (
            <div className="text-center py-20">
              <p className="font-body font-light" style={{ fontSize: '13px', color: 'rgba(26,18,8,0.3)' }}>
                No discount codes yet. Create your first one.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <DiscountModal
          discount={editingDiscount}
          onClose={() => { setShowModal(false); setEditingDiscount(null) }}
          onSave={async (data: any) => {
            const url = editingDiscount 
              ? `http://localhost:5000/api/discounts/${editingDiscount._id}`
              : 'http://localhost:5000/api/discounts'
            
            const method = editingDiscount ? 'PUT' : 'POST'

            const res = await fetch(url, {
              method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            })

            if (res.ok) {
              setShowModal(false)
              setEditingDiscount(null)
              fetchDiscounts()
            } else {
              const error = await res.json()
              alert(error.message || 'Failed to save discount')
            }
          }}
        />
      )}
    </div>
  )
}

function DiscountModal({ discount, onClose, onSave }: any) {
  const [form, setForm] = useState(
    discount ?? {
      code: '',
      description: '',
      type: 'percentage',
      value: 10,
      maxUses: null,
      maxUsesPerCustomer: 1,
      minOrderAmount: 0,
      startDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      isActive: true,
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Convert empty strings to null for optional fields
    const data = {
      ...form,
      maxUses: form.maxUses === '' || form.maxUses === 0 ? null : parseInt(form.maxUses),
      expiryDate: form.expiryDate || null,
    }
    
    onSave(data)
  }

  return (
    <div className="fixed inset-0 bg-[rgba(26,18,8,0.6)] flex items-center justify-center z-50 p-5" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="bg-[#F7F3ED] max-w-[600px] w-full max-h-[90vh] overflow-y-auto p-10 relative">
        <button onClick={onClose} className="absolute top-5 right-5" style={{ fontSize: '24px', color: 'rgba(26,18,8,0.3)' }}>
          ×
        </button>

        <h2 className="font-display font-light text-[#1A1208] mb-8" style={{ fontSize: '32px' }}>
          {discount ? 'Edit Discount' : 'Create Discount'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Basic Info */}
          <div className="pb-6 border-b" style={{ borderColor: 'rgba(26,18,8,0.1)' }}>
            <p className="overline mb-4" style={{ color: 'rgba(26,18,8,0.4)' }}>Basic Information</p>
            
            <div className="space-y-5">
              <FormField
                label="Discount Code"
                value={form.code}
                onChange={(v: string) => setForm({ ...form, code: v.toUpperCase() })}
                placeholder="WELCOME10"
                required
              />

              <div>
                <p className="overline mb-3" style={{ color: 'rgba(26,18,8,0.35)' }}>Description</p>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Welcome discount for new customers"
                  rows={2}
                  className="w-full bg-transparent border p-3 outline-none resize-none"
                  style={{
                    borderColor: 'rgba(26,18,8,0.2)',
                    fontFamily: "'Jost', sans-serif",
                    fontSize: '13px',
                    color: '#1A1208',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Discount Value */}
          <div className="pb-6 border-b" style={{ borderColor: 'rgba(26,18,8,0.1)' }}>
            <p className="overline mb-4" style={{ color: 'rgba(26,18,8,0.4)' }}>Discount Value</p>
            
            <div className="space-y-5">
              <div>
                <p className="overline mb-3" style={{ color: 'rgba(26,18,8,0.35)' }}>
                  Type <span style={{ color: 'rgba(160,80,80,0.6)' }}>*</span>
                </p>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={form.type === 'percentage'}
                      onChange={() => setForm({ ...form, type: 'percentage' })}
                    />
                    <span className="font-body font-light" style={{ fontSize: '12px' }}>Percentage (%)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={form.type === 'fixed'}
                      onChange={() => setForm({ ...form, type: 'fixed' })}
                    />
                    <span className="font-body font-light" style={{ fontSize: '12px' }}>Fixed Amount (PKR)</span>
                  </label>
                </div>
              </div>

              <FormField
                label={form.type === 'percentage' ? 'Discount Percentage' : 'Discount Amount (PKR)'}
                type="number"
                value={form.value.toString()}
                onChange={(v: string) => setForm({ ...form, value: parseFloat(v) || 0 })}
                placeholder={form.type === 'percentage' ? '10' : '500'}
                required
              />
            </div>
          </div>

          {/* Usage Limits */}
          <div className="pb-6 border-b" style={{ borderColor: 'rgba(26,18,8,0.1)' }}>
            <p className="overline mb-4" style={{ color: 'rgba(26,18,8,0.4)' }}>Usage Limits</p>
            
            <div className="space-y-5">
              <FormField
                label="Total Usage Limit (leave empty for unlimited)"
                type="number"
                value={form.maxUses?.toString() || ''}
                onChange={(v: string) => setForm({ ...form, maxUses: v ? parseInt(v) : null })}
                placeholder="100"
              />

              <FormField
                label="Uses Per Customer"
                type="number"
                value={form.maxUsesPerCustomer.toString()}
                onChange={(v: string) => setForm({ ...form, maxUsesPerCustomer: parseInt(v) || 1 })}
                placeholder="1"
                required
              />

              <FormField
                label="Minimum Order Amount (PKR)"
                type="number"
                value={form.minOrderAmount.toString()}
                onChange={(v: string) => setForm({ ...form, minOrderAmount: parseFloat(v) || 0 })}
                placeholder="0"
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="pb-6 border-b" style={{ borderColor: 'rgba(26,18,8,0.1)' }}>
            <p className="overline mb-4" style={{ color: 'rgba(26,18,8,0.4)' }}>Active Period</p>
            
            <div className="space-y-5">
              <FormField
                label="Start Date"
                type="date"
                value={form.startDate}
                onChange={(v: string) => setForm({ ...form, startDate: v })}
                required
              />

              <FormField
                label="Expiry Date (leave empty for no expiry)"
                type="date"
                value={form.expiryDate}
                onChange={(v: string) => setForm({ ...form, expiryDate: v })}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={e => setForm({ ...form, isActive: e.target.checked })}
              />
              <span className="font-body font-light" style={{ fontSize: '12px' }}>
                Active (customers can use this code)
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6">
            <button type="submit" className="btn-primary flex-1">
              <span>{discount ? 'Save Changes' : 'Create Discount'}</span>
            </button>
            <button type="button" onClick={onClose} className="btn-ghost flex-1">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function FormField({ label, value, onChange, placeholder, required, type = 'text' }: any) {
  return (
    <div>
      <p className="overline mb-3" style={{ color: 'rgba(26,18,8,0.35)' }}>
        {label} {required && <span style={{ color: 'rgba(160,80,80,0.6)' }}>*</span>}
      </p>
      <input
        type={type}
        required={required}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        min={type === 'number' ? '0' : undefined}
        step={type === 'number' ? 'any' : undefined}
        className="w-full bg-transparent border-b outline-none"
        style={{
          borderColor: 'rgba(26,18,8,0.2)',
          padding: '12px 0',
          fontFamily: "'Jost', sans-serif",
          fontSize: '14px',
          color: '#1A1208',
        }}
      />
    </div>
  )
}