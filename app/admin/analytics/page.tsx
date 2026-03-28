'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const LineChart = dynamic(() => import('recharts').then(m => m.LineChart), { ssr: false })
const Line = dynamic(() => import('recharts').then(m => m.Line), { ssr: false })
const BarChart = dynamic(() => import('recharts').then(m => m.BarChart), { ssr: false })
const Bar = dynamic(() => import('recharts').then(m => m.Bar), { ssr: false })
const XAxis = dynamic(() => import('recharts').then(m => m.XAxis), { ssr: false })
const YAxis = dynamic(() => import('recharts').then(m => m.YAxis), { ssr: false })
const CartesianGrid = dynamic(() => import('recharts').then(m => m.CartesianGrid), { ssr: false })
const Tooltip = dynamic(() => import('recharts').then(m => m.Tooltip), { ssr: false })
const ResponsiveContainer = dynamic(() => import('recharts').then(m => m.ResponsiveContainer), { ssr: false })

interface AnalyticsData {
  totalRevenue: number
  revenueThisMonth: number
  conversionRate: number
  averageOrderValue: number
  dailyRevenue: Array<{ date: string; revenue: number }>
  dailyOrders: Array<{ date: string; orders: number }>
  bestSellers: Array<{
    productId: string
    name: string
    unitsSold: number
    revenue: number
    conversionRate: number
  }>
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/admin/analytics?range=${timeRange}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('noxr_admin_token')}`
          }
        })
        const data = await res.json()
        setAnalytics(data)
      } catch (error) {
        console.error('Analytics fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [timeRange])

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F7F3ED' }}>
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 68px)' }}>
          <div className="flex-1 flex items-center justify-center">
            <p className="overline" style={{ color: 'rgba(26,18,8,0.3)' }}>Loading analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  // Mock data if API not ready
  const data = analytics || {
    totalRevenue: 487250,
    revenueThisMonth: 142800,
    conversionRate: 3.2,
    averageOrderValue: 3499,
    dailyRevenue: generateMockDailyData(30, 5000, 15000),
    dailyOrders: generateMockDailyData(30, 5, 20),
    bestSellers: [
      { productId: '1', name: 'Shadow Tee', unitsSold: 142, revenue: 354580, conversionRate: 4.2 },
      { productId: '2', name: 'Core Black', unitsSold: 98, revenue: 215822, conversionRate: 3.8 },
      { productId: '3', name: 'Void Oversized', unitsSold: 76, revenue: 265924, conversionRate: 3.1 },
      { productId: '4', name: 'Archive 001', unitsSold: 64, revenue: 121536, conversionRate: 2.9 },
      { productId: '5', name: 'Eclipse Series', unitsSold: 52, revenue: 181948, conversionRate: 2.4 },
    ],
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F3ED' }}>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 68px)' }}>

        <div style={{ flex: 1, padding: '48px 52px', overflowY: 'auto' }}>
          
          {/* Header */}
          <div className="mb-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="overline mb-3">Insights</p>
                <h1
                  className="font-display font-light text-[#1A1208]"
                  style={{ fontSize: 'clamp(36px, 5vw, 56px)', lineHeight: 1, letterSpacing: '-0.02em' }}
                >
                  Analytics
                </h1>
              </div>

              {/* Time Range Filter */}
              <div className="flex gap-2">
                {(['7d', '30d', '90d'] as const).map(range => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className="px-4 py-2 border font-body font-light"
                    style={{
                      fontSize: '10px',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: timeRange === range ? '#F7F3ED' : 'rgba(26,18,8,0.5)',
                      backgroundColor: timeRange === range ? '#1A1208' : 'transparent',
                      borderColor: timeRange === range ? '#1A1208' : 'rgba(26,18,8,0.15)',
                    }}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Top Stats Row - 4 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            <StatCard
              label="Total Revenue"
              value={`PKR ${data.totalRevenue.toLocaleString()}`}
            />
            <StatCard
              label="Revenue This Month"
              value={`PKR ${data.revenueThisMonth.toLocaleString()}`}
            />
            <StatCard
              label="Conversion Rate"
              value={`${data.conversionRate}%`}
            />
            <StatCard
              label="Average Order Value"
              value={`PKR ${data.averageOrderValue.toLocaleString()}`}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            
            {/* Daily Revenue Chart */}
            <div className="border p-6" style={{ borderColor: 'rgba(26,18,8,0.08)', backgroundColor: '#fff' }}>
              <h3
                className="font-display font-light text-[#1A1208] mb-6"
                style={{ fontSize: '20px' }}
              >
                Daily Revenue
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={data.dailyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,18,8,0.05)" />
                  <XAxis
                    dataKey="date"
                    stroke="rgba(26,18,8,0.3)"
                    style={{ fontSize: '10px' }}
                  />
                  <YAxis
                    stroke="rgba(26,18,8,0.3)"
                    style={{ fontSize: '10px' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#F7F3ED',
                      border: '0.5px solid rgba(26,18,8,0.15)',
                      fontFamily: "'Jost', sans-serif",
                      fontSize: '11px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#1A1208"
                    strokeWidth={1.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Orders Per Day Chart */}
            <div className="border p-6" style={{ borderColor: 'rgba(26,18,8,0.08)', backgroundColor: '#fff' }}>
              <h3
                className="font-display font-light text-[#1A1208] mb-6"
                style={{ fontSize: '20px' }}
              >
                Orders Per Day
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.dailyOrders}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,18,8,0.05)" />
                  <XAxis
                    dataKey="date"
                    stroke="rgba(26,18,8,0.3)"
                    style={{ fontSize: '10px' }}
                  />
                  <YAxis
                    stroke="rgba(26,18,8,0.3)"
                    style={{ fontSize: '10px' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#F7F3ED',
                      border: '0.5px solid rgba(26,18,8,0.15)',
                      fontFamily: "'Jost', sans-serif",
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="orders" fill="#1A1208" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Best Selling Products Table */}
          <div>
            <h3
              className="font-display font-light text-[#1A1208] mb-6"
              style={{ fontSize: '24px' }}
            >
              Best Selling Products
            </h3>

            <div className="border overflow-x-auto" style={{ borderColor: 'rgba(26,18,8,0.08)', backgroundColor: '#fff' }}>
              <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F2EDE6', borderBottom: '0.5px solid rgba(26,18,8,0.08)' }}>
                    <th className="text-left p-4 overline" style={{ color: 'rgba(26,18,8,0.4)' }}>
                      Product
                    </th>
                    <th className="text-left p-4 overline" style={{ color: 'rgba(26,18,8,0.4)' }}>
                      Units Sold
                    </th>
                    <th className="text-left p-4 overline" style={{ color: 'rgba(26,18,8,0.4)' }}>
                      Revenue
                    </th>
                    <th className="text-left p-4 overline" style={{ color: 'rgba(26,18,8,0.4)' }}>
                      Conversion %
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.bestSellers.map((product, i) => (
                    <tr
                      key={product.productId}
                      style={{
                        borderBottom: '0.5px solid rgba(26,18,8,0.05)',
                        backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(26,18,8,0.01)',
                      }}
                    >
                      <td className="p-4">
                        <span className="font-body font-light" style={{ fontSize: '13px', color: '#1A1208' }}>
                          {product.name}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-body font-light" style={{ fontSize: '13px', color: 'rgba(26,18,8,0.6)' }}>
                          {product.unitsSold}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-body font-light" style={{ fontSize: '13px', color: 'rgba(26,18,8,0.6)' }}>
                          PKR {product.revenue.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-body font-light" style={{ fontSize: '13px', color: 'rgba(26,18,8,0.6)' }}>
                          {product.conversionRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border p-6" style={{ borderColor: 'rgba(26,18,8,0.08)', backgroundColor: '#fff' }}>
      <p className="overline mb-3" style={{ color: 'rgba(26,18,8,0.4)' }}>
        {label}
      </p>
      <p
        className="font-display font-light text-[#1A1208]"
        style={{ fontSize: 'clamp(28px, 5vw, 40px)', lineHeight: 1 }}
      >
        {value}
      </p>
    </div>
  )
}

function generateMockDailyData(days: number, min: number, max: number) {
  const data = []
  const today = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const value = Math.floor(Math.random() * (max - min + 1)) + min
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: value,
      orders: Math.floor(value / 1000),
    })
  }
  
  return data
}