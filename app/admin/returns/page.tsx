'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type ReturnStatus = 'pending' | 'approved' | 'rejected' | 'refunded'
type FilterTab = 'all' | ReturnStatus

interface Return {
  _id: string
  returnId: string
  orderId: string
  customer: { name: string; email: string }
  product: { name: string; image: string }
  reason: string
  condition: string
  customerNotes: string
  refundAmount: number
  dateRequested: string
  dateProcessed: string | null
  status: ReturnStatus
}

export default function ReturnsManagerPage() {
  const router = useRouter()
  const [returns, setReturns] = useState<Return[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const [selectedReturn, setSelectedReturn] = useState<Return | null>(null)

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/returns', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('noxr_admin_token')}`
          }
        })
        const data = await res.json()
        setReturns(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Returns fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReturns()
  }, [])

  const filteredReturns = activeFilter === 'all'
    ? returns
    : returns.filter(r => r.status === activeFilter)

  const handleStatusUpdate = async (returnId: string, status: ReturnStatus) => {
    try {
      await fetch(`http://localhost:5000/api/admin/returns/${returnId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('noxr_admin_token')}`
        },
        body: JSON.stringify({ status, dateProcessed: new Date().toISOString() })
      })

      setReturns(prev => prev.map(r =>
        r._id === returnId ? { ...r, status, dateProcessed: new Date().toISOString() } : r
      ))
      
      if (selectedReturn?._id === returnId) {
        setSelectedReturn(prev => prev ? { ...prev, status, dateProcessed: new Date().toISOString() } : null)
      }

      alert(`Return ${status}`)
    } catch (error) {
      console.error('Status update error:', error)
      alert('Failed to update status')
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F3ED' }}>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 68px)' }}>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          {/* Header */}
          <div style={{ padding: '48px 52px 0' }}>
            <p className="overline mb-3">Customer Service</p>
            <h1
              className="font-display font-light text-[#1A1208]"
              style={{ fontSize: 'clamp(36px, 5vw, 56px)', lineHeight: 1, letterSpacing: '-0.02em', marginBottom: '8px' }}
            >
              Returns & Refunds
            </h1>
            <p className="overline mb-6" style={{ color: 'rgba(26,18,8,0.3)' }}>
              {filteredReturns.length} {filteredReturns.length === 1 ? 'Return' : 'Returns'}
            </p>
          </div>

          {/* Filter Tabs */}
          <div style={{ borderBottom: '0.5px solid rgba(26,18,8,0.08)', padding: '0 52px' }}>
            <div style={{ display: 'flex', gap: '24px' }}>
              {(['all', 'pending', 'approved', 'refunded', 'rejected'] as FilterTab[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className="relative py-4 capitalize font-body font-light"
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    color: activeFilter === tab ? '#1A1208' : 'rgba(26,18,8,0.35)',
                    background: 'none',
                    border: 'none',
                  }}
                >
                  {tab}
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-1px',
                      left: 0,
                      right: 0,
                      height: '1px',
                      backgroundColor: '#1A1208',
                      transform: activeFilter === tab ? 'scaleX(1)' : 'scaleX(0)',
                      transition: 'transform 0.3s ease',
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div style={{ flex: 1, display: 'flex', overflowY: 'auto' }}>
            
            {/* Table Section */}
            <div style={{ flex: selectedReturn ? '0 0 60%' : 1, padding: '32px 52px', overflowX: 'auto' }}>
              <div style={{ border: '0.5px solid rgba(26,18,8,0.08)', backgroundColor: '#fff', minWidth: '800px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F2EDE6', borderBottom: '0.5px solid rgba(26,18,8,0.08)' }}>
                      <th className="text-left p-4 overline" style={{ color: 'rgba(26,18,8,0.4)' }}>Return ID</th>
                      <th className="text-left p-4 overline" style={{ color: 'rgba(26,18,8,0.4)' }}>Order ID</th>
                      <th className="text-left p-4 overline" style={{ color: 'rgba(26,18,8,0.4)' }}>Customer</th>
                      <th className="text-left p-4 overline" style={{ color: 'rgba(26,18,8,0.4)' }}>Product</th>
                      <th className="text-left p-4 overline" style={{ color: 'rgba(26,18,8,0.4)' }}>Reason</th>
                      <th className="text-left p-4 overline" style={{ color: 'rgba(26,18,8,0.4)' }}>Condition</th>
                      <th className="text-left p-4 overline" style={{ color: 'rgba(26,18,8,0.4)' }}>Date</th>
                      <th className="text-left p-4 overline" style={{ color: 'rgba(26,18,8,0.4)' }}>Status</th>
                      <th className="text-right p-4 overline" style={{ color: 'rgba(26,18,8,0.4)' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReturns.map((returnItem, i) => (
                      <ReturnRow
                        key={returnItem._id}
                        returnItem={returnItem}
                        index={i}
                        onView={() => setSelectedReturn(returnItem)}
                        isSelected={selectedReturn?._id === returnItem._id}
                      />
                    ))}
                  </tbody>
                </table>

                {filteredReturns.length === 0 && !loading && (
                  <div className="text-center py-20">
                    <p className="font-body font-light" style={{ fontSize: '13px', color: 'rgba(26,18,8,0.3)' }}>
                      No returns {activeFilter !== 'all' && `with status "${activeFilter}"`}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Side Panel */}
            {selectedReturn && (
              <div
                style={{
                  flex: '0 0 40%',
                  borderLeft: '0.5px solid rgba(26,18,8,0.08)',
                  backgroundColor: '#F2EDE6',
                  padding: '32px 24px',
                  overflowY: 'auto',
                }}
              >
                <ReturnDetailPanel
                  returnItem={selectedReturn}
                  onClose={() => setSelectedReturn(null)}
                  onStatusUpdate={handleStatusUpdate}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ReturnRow({ returnItem, index, onView, isSelected }: { returnItem: Return; index: number; onView: () => void; isSelected: boolean }) {
  const statusColors: Record<ReturnStatus, string> = {
    pending: 'rgba(180,130,50,0.7)',
    approved: 'rgba(107,143,94,0.7)',
    refunded: 'rgba(107,143,94,0.9)',
    rejected: 'rgba(160,80,80,0.7)',
  }

  return (
    <tr
      style={{
        borderBottom: '0.5px solid rgba(26,18,8,0.05)',
        backgroundColor: isSelected ? 'rgba(26,18,8,0.03)' : index % 2 === 0 ? 'transparent' : 'rgba(26,18,8,0.01)',
      }}
    >
      <td className="p-4">
        <span className="font-body font-light" style={{ fontSize: '11px', color: '#1A1208', letterSpacing: '0.05em' }}>
          #{returnItem.returnId}
        </span>
      </td>
      <td className="p-4">
        <span className="font-body font-light" style={{ fontSize: '11px', color: 'rgba(26,18,8,0.5)' }}>
          {returnItem.orderId}
        </span>
      </td>
      <td className="p-4">
        <span className="font-body font-light" style={{ fontSize: '12px', color: 'rgba(26,18,8,0.6)' }}>
          {returnItem.customer.name}
        </span>
      </td>
      <td className="p-4">
        <span className="font-body font-light" style={{ fontSize: '12px', color: 'rgba(26,18,8,0.6)' }}>
          {returnItem.product.name}
        </span>
      </td>
      <td className="p-4">
        <span className="font-body font-light" style={{ fontSize: '11px', color: 'rgba(26,18,8,0.5)' }}>
          {returnItem.reason}
        </span>
      </td>
      <td className="p-4">
        <span className="font-body font-light" style={{ fontSize: '11px', color: 'rgba(26,18,8,0.5)' }}>
          {returnItem.condition}
        </span>
      </td>
      <td className="p-4">
        <span className="font-body font-light" style={{ fontSize: '11px', color: 'rgba(26,18,8,0.5)' }}>
          {new Date(returnItem.dateRequested).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </td>
      <td className="p-4">
        <span
          className="px-2 py-1 font-body font-light capitalize"
          style={{
            fontSize: '9px',
            letterSpacing: '0.1em',
            color: statusColors[returnItem.status],
            border: `0.5px solid ${statusColors[returnItem.status]}`,
            backgroundColor: `${statusColors[returnItem.status]}15`,
          }}
        >
          {returnItem.status}
        </span>
      </td>
      <td className="p-4 text-right">
        <button
          onClick={onView}
          className="btn-ghost"
          style={{ fontSize: '9px', padding: '6px 12px' }}
        >
          View
        </button>
      </td>
    </tr>
  )
}

function ReturnDetailPanel({ returnItem, onClose, onStatusUpdate }: any) {
  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <h3 className="font-display font-light text-[#1A1208]" style={{ fontSize: '24px' }}>
          Return Details
        </h3>
        <button
          onClick={onClose}
          style={{ fontSize: '24px', color: 'rgba(26,18,8,0.3)', background: 'none', border: 'none' }}
        >
          ×
        </button>
      </div>

      {/* Product Image */}
      <div className="mb-6">
        <div
          className="relative bg-[#EDE7DC]"
          style={{ width: '100%', height: '240px' }}
        >
          {returnItem.product.image && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url('${returnItem.product.image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(0.95) saturate(0.85)',
              }}
            />
          )}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-5 mb-8">
        <DetailRow label="Return ID" value={`#${returnItem.returnId}`} />
        <DetailRow label="Order ID" value={returnItem.orderId} />
        <DetailRow label="Customer" value={returnItem.customer.name} />
        <DetailRow label="Product" value={returnItem.product.name} />
        <DetailRow label="Reason" value={returnItem.reason} />
        <DetailRow label="Condition" value={returnItem.condition} />
        <DetailRow label="Refund Amount" value={`PKR ${returnItem.refundAmount.toLocaleString()}`} />
        <DetailRow
          label="Date Requested"
          value={new Date(returnItem.dateRequested).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        />
        {returnItem.dateProcessed && (
          <DetailRow
            label="Date Processed"
            value={new Date(returnItem.dateProcessed).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          />
        )}
      </div>

      {/* Customer Notes */}
      {returnItem.customerNotes && (
        <div className="mb-8">
          <p className="overline mb-3" style={{ color: 'rgba(26,18,8,0.4)' }}>Customer Notes</p>
          <p className="font-body font-light" style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(26,18,8,0.6)' }}>
            {returnItem.customerNotes}
          </p>
        </div>
      )}

      {/* Actions */}
      {returnItem.status === 'pending' && (
        <div className="space-y-3">
          <button
            onClick={() => onStatusUpdate(returnItem._id, 'approved')}
            className="btn-primary w-full text-center"
            style={{ padding: '14px' }}
          >
            <span>Approve Return</span>
          </button>
          <button
            onClick={() => onStatusUpdate(returnItem._id, 'rejected')}
            className="btn-ghost w-full text-center"
            style={{ padding: '14px', color: 'rgba(160,80,80,0.7)', borderColor: 'rgba(160,80,80,0.2)' }}
          >
            Reject Return
          </button>
        </div>
      )}

      {returnItem.status === 'approved' && (
        <button
          onClick={() => onStatusUpdate(returnItem._id, 'refunded')}
          className="btn-primary w-full text-center"
          style={{ padding: '14px' }}
        >
          <span>Mark as Refunded</span>
        </button>
      )}
    </div>
  )
}

function DetailRow({ label, value }: any) {
  return (
    <div className="flex justify-between items-baseline py-2 border-b" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
      <span className="font-body font-light" style={{ fontSize: '11px', color: 'rgba(26,18,8,0.4)' }}>
        {label}
      </span>
      <span className="font-body font-light text-right" style={{ fontSize: '12px', color: 'rgba(26,18,8,0.7)' }}>
        {value}
      </span>
    </div>
  )
}