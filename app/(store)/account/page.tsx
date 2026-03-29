'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

type Tab = 'orders' | 'addresses' | 'settings'
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'paid' | 'cancelled'

interface Order {
  id: string
  status: OrderStatus
  total: number
  date: string
  image: string
  items: number
}

export default function AccountDashboardPage() {
  const router = useRouter()
  const [loaded, setLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('orders')
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [addresses, setAddresses] = useState<any[]>([])
  // const [wishlist, setWishlist] = useState<any[]>([])

  useEffect(() => {
  const fetchUser = async () => {
    const token = localStorage.getItem('noxr_user_token')

    if (!token) {
      router.push('/auth/login')
      return
    }

    try {
      const userData = await api.get('/auth/me')
      setUser(userData)
      setAddresses(userData.addresses || [])

      const ordersData = await api.get('/orders/my-orders')

      const formatted = ordersData.map((o: any) => ({
        id: o._id,
        status: o.status,
        total: o.total,
        date: new Date(o.createdAt).toLocaleDateString(),
        image: o.items?.[0]?.image || '',
        items: o.items?.length || 0
      }))

      setOrders(formatted)

      setLoaded(true)

    } catch {
      localStorage.removeItem('noxr_user_token')
      router.push('/auth/login')
    }
  }

  fetchUser()
}, [router])

  const handleLogout = () => {
  localStorage.removeItem('noxr_user_token')
  localStorage.removeItem('noxr_user')
  router.push('/auth/login')
}

  if (!loaded) {
  return <div className="p-10">Loading...</div>
}

  return (
    <div className="min-h-screen bg-[#F7F3ED]">

      {/* Header */}
      <div className="border-b px-5 md:px-[52px] pt-24 md:pt-32 pb-8 md:pb-12" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
        <div
          className="max-w-[1240px] mx-auto"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'none' : 'translateY(20px)',
            transition: 'all 1s ease',
          }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <p className="overline mb-5">Account</p>
              <h1
                className="font-display font-light text-[#1A1208] mb-2"
                style={{
                  fontSize: 'clamp(42px, 10vw, 96px)',
                  lineHeight: 0.9,
                  letterSpacing: '-0.025em',
                }}
              >
                {user?.name?.split(' ')[0]}
              </h1>
              <p className="font-body font-light" style={{ fontSize: '13px', color: 'rgba(26,18,8,0.4)' }}>
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}
              </p>
            </div>
            <button onClick={handleLogout} className="btn-ghost md:mb-2">
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Tabs - horizontal scroll on mobile */}
      <div className="sticky top-[60px] md:top-0 z-30 bg-[#F7F3ED] border-b px-5 md:px-[52px] py-4 overflow-x-auto no-scrollbar" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
        <div className="max-w-[1240px] mx-auto flex gap-6 md:gap-8">
          {[
            { key: 'orders' as Tab, label: 'Orders' },
            { key: 'addresses' as Tab, label: 'Addresses' },
            // { key: 'wishlist' as Tab, label: 'Wishlist' },
            { key: 'settings' as Tab, label: 'Settings' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="relative whitespace-nowrap pb-1 flex-shrink-0"
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: '10px',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: activeTab === tab.key ? '#1A1208' : 'rgba(26,18,8,0.35)',
                fontWeight: 300,
              }}
            >
              {tab.label}
              <span
                style={{
                  position: 'absolute',
                  bottom: '-4px',
                  left: 0,
                  right: 0,
                  height: '0.5px',
                  backgroundColor: '#1A1208',
                  transform: activeTab === tab.key ? 'scaleX(1)' : 'scaleX(0)',
                  transformOrigin: 'left',
                  transition: 'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
                  display: 'block',
                }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 md:px-[52px] py-12 md:py-16 pb-24 md:pb-32">
        <div className="max-w-[1240px] mx-auto">
          {activeTab === 'orders' && <OrdersTab orders={orders} />}
          {activeTab === 'addresses' && <AddressesTab addresses={addresses} />}
          {/* {activeTab === 'wishlist' && <WishlistTab items={wishlist} />} */}
          {activeTab === 'settings' && <SettingsTab user={user} />}
        </div>
      </div>
    </div>
  )
}

function OrdersTab({ orders }: { orders: Order[] }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2
          className="font-display font-light text-[#1A1208]"
          style={{ fontSize: 'clamp(24px, 5vw, 32px)', letterSpacing: '-0.01em' }}
        >
          Order History
        </h2>
        <p className="overline" style={{ color: 'rgba(26,18,8,0.3)' }}>
          {orders.length} orders
        </p>
      </div>

      {/* Mobile: Stack, Desktop: Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {orders.map((order: any, i: number) => (
          <OrderCard key={order.id} order={order} index={i} />
        ))}
      </div>
    </div>
  )
}

function OrderCard({ order, index }: { order: Order; index: number }) {
  const statusColorMap: Record<OrderStatus, string> = {
  pending: 'rgba(26,18,8,0.4)',
  paid: 'rgba(26,18,8,0.45)',
  processing: 'rgba(26,18,8,0.5)',
  shipped: 'rgba(180,130,50,0.7)',
  delivered: 'rgba(107,143,94,0.7)',
  cancelled: 'rgba(160,80,80,0.7)',
}

const statusColor = statusColorMap[order.status]
  return (
    <Link
      href={`/account/orders/${order.id}`}
      className="block p-6 border"
      style={{
        borderColor: 'rgba(26,18,8,0.08)',
        textDecoration: 'none',
        opacity: 1,
        animation: `fadeIn 0.5s ease ${index * 0.1}s backwards`,
      }}
    >
      <div className="flex gap-4 mb-4">
        <div
          className="relative flex-shrink-0 bg-[#EDE7DC]"
          style={{ width: '60px', height: '75px' }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url('${order.image}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.95) saturate(0.85)',
            }}
          />
        </div>
        <div className="flex-1">
          <p className="font-body font-light mb-1" style={{ fontSize: '13px', color: '#1A1208' }}>
            Order {order.id}
          </p>
          <p className="font-body font-light mb-2" style={{ fontSize: '11px', color: 'rgba(26,18,8,0.35)' }}>
            {order.date} · {order.items} {order.items === 1 ? 'item' : 'items'}
          </p>
          <div className="flex items-center gap-2">
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: statusColor,
              }}
            />
            <span className="font-body font-light" style={{ fontSize: '10px', color: statusColor }}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
        <span className="font-body font-light" style={{ fontSize: '12px', color: 'rgba(26,18,8,0.4)' }}>
          Total
        </span>
        <span className="font-display font-light text-[#1A1208]" style={{ fontSize: '18px' }}>
          PKR {order.total.toLocaleString()}
        </span>
      </div>
    </Link>
  )
}

function AddressesTab({ addresses }: any) {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2
          className="font-display font-light text-[#1A1208]"
          style={{ fontSize: 'clamp(24px, 5vw, 32px)', letterSpacing: '-0.01em' }}
        >
          Saved Addresses
        </h2>
        <button
  className="btn-primary"
  onClick={async () => {
    const token = localStorage.getItem('noxr_user_token')

    await api.post('/api/auth/address', {
  name: "Home",
  address: "Test Street 123",
  city: "Karachi",
  province: "Sindh",
  postalCode: "75000",
  phone: "03000000000",
  isDefault: false
})

location.reload()
  }}
>
          <span>Add New</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {addresses.map((address: any, i: number) => (
          <div
            key={address.id}
            className="p-6 border relative"
            style={{
              borderColor: address.isDefault ? '#1A1208' : 'rgba(26,18,8,0.08)',
              backgroundColor: address.isDefault ? 'rgba(26,18,8,0.02)' : 'transparent',
              opacity: 1,
              animation: `fadeIn 0.5s ease ${i * 0.1}s backwards`,
            }}
          >
            {address.isDefault && (
              <div className="absolute top-4 right-4 px-2 py-1" style={{ backgroundColor: '#1A1208' }}>
                <span className="font-body font-light" style={{ fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F7F3ED' }}>
                  Default
                </span>
              </div>
            )}

            <p className="font-display font-light text-[#1A1208] mb-3" style={{ fontSize: '18px' }}>
              {address.name}
            </p>
            <p className="font-body font-light mb-1" style={{ fontSize: '13px', color: 'rgba(26,18,8,0.5)' }}>
              {address.address}
            </p>
            <p className="font-body font-light mb-4" style={{ fontSize: '13px', color: 'rgba(26,18,8,0.5)' }}>
              {address.city}, {address.province} {address.postalCode}
            </p>

            <div className="flex gap-3 pt-4 border-t" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
              <button className="btn-ghost" style={{ fontSize: '9px', padding: '6px 12px' }}>
                Edit
              </button>
              {!address.isDefault && (
                <button className="btn-ghost" style={{ fontSize: '9px', padding: '6px 12px', color: 'rgba(160,80,80,0.7)' }}>
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function WishlistTab({ items }: any) {
  return (
    <div>
      {/* <div className="flex justify-between items-center mb-8">
        <h2
          className="font-display font-light text-[#1A1208]"
          style={{ fontSize: 'clamp(24px, 5vw, 32px)', letterSpacing: '-0.01em' }}
        >
          Wishlist
        </h2>
        <p className="overline" style={{ color: 'rgba(26,18,8,0.3)' }}>
          {items.length} items
        </p>
      </div> */}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {items.map((item: any, i: number) => (
          <div
            key={item._id}
            className="relative"
            style={{
              opacity: 1,
              animation: `fadeIn 0.5s ease ${i * 0.1}s backwards`,
            }}
          >
            <Link href={`/product/${item.productId}`} className="block mb-3" style={{ textDecoration: 'none' }}>
              <div
                className="relative overflow-hidden mb-3 bg-[#EDE7DC]"
                style={{ aspectRatio: '3/4' }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url('${item.image}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.95) saturate(0.85)',
                    opacity: item.inStock ? 1 : 0.5,
                  }}
                />
                {!item.inStock && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[rgba(26,18,8,0.3)]">
                    <span className="overline" style={{ color: '#F7F3ED' }}>
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              <p className="font-body font-light mb-1" style={{ fontSize: '13px', color: '#1A1208' }}>
                {item.name}
              </p>
              <p className="font-body font-light" style={{ fontSize: '12px', color: 'rgba(26,18,8,0.45)' }}>
                PKR {item.price.toLocaleString()}
              </p>
            </Link>

            <button
              className="w-full btn-ghost text-center"
              style={{ fontSize: '9px', padding: '8px' }}
              disabled={!item.inStock}
            >
              {item.inStock ? 'Add to Bag' : 'Notify Me'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function SettingsTab({ user }: any) {
  const [form, setForm] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })

  const update = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await api.put('/auth/update', {
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        phone: form.phone
      })

      alert('Profile updated')
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div className="max-w-[600px]">
      <h2 className="font-display font-light text-[#1A1208] mb-8">
        Account Settings
      </h2>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="First Name" type="text" value={form.firstName} onChange={(v: string) => update('firstName', v)} />
          <FormField label="Last Name" type="text" value={form.lastName} onChange={(v: string) => update('lastName', v)} />
        </div>

        <FormField label="Email" type="email" value={form.email} onChange={(v: string) => update('email', v)} />
        <FormField label="Phone" type="tel" value={form.phone} onChange={(v: string) => update('phone', v)} />

        <button type="submit" className="btn-primary">
          <span>Save Changes</span>
        </button>
      </form>
    </div>
  )
}

function FormField({ label, type, value, onChange }: any) {
  return (
    <div>
      <p className="overline mb-3" style={{ color: 'rgba(26,18,8,0.35)' }}>{label}</p>
      <input
        type={type}
        required
        value={value}
        onChange={e => onChange(e.target.value)}
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


















// 'use client'
// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import { userApi } from '@/lib/api'

// type Tab = 'orders' | 'addresses' | 'settings'
// type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'paid' | 'cancelled'

// interface Order {
//   id: string
//   status: OrderStatus
//   total: number
//   date: string
//   image: string
//   items: number
// }

// export default function AccountDashboardPage() {
//   const router = useRouter()
//   const [loaded, setLoaded] = useState(false)
//   const [activeTab, setActiveTab] = useState<Tab>('orders')
//   const [user, setUser] = useState<any>(null)
//   const [orders, setOrders] = useState<Order[]>([])
//   const [addresses, setAddresses] = useState<any[]>([])

//   useEffect(() => {
//     const fetchUser = async () => {
//       const token = localStorage.getItem('noxr_user_token')
//       if (!token) {
//         router.push('/auth/login')
//         setLoaded(true)
//         return
//       }

//       try {
//         // Fetch user profile
//         const userData = await userApi.get('/api/auth/me')
//         setUser(userData)
//         setAddresses(userData.addresses || [])

//         // Fetch orders
//         const ordersData = await userApi.get('/api/orders/my-orders')
//         const formatted = ordersData.map((o: any) => ({
//           id: o._id,
//           status: o.status,
//           total: o.total,
//           date: new Date(o.createdAt).toLocaleDateString(),
//           image: o.items?.[0]?.image || '',
//           items: o.items?.length || 0,
//         }))
//         setOrders(formatted)
//       } catch (err) {
//         localStorage.removeItem('noxr_user_token')
//         localStorage.removeItem('noxr_user')
//         router.push('/auth/login')
//       } finally {
//         setLoaded(true)
//       }
//     }

//     fetchUser()
//   }, [router])

//   const handleLogout = () => {
//     localStorage.removeItem('noxr_user_token')
//     localStorage.removeItem('noxr_user')
//     router.push('/auth/login')
//   }

//   if (!loaded) {
//     return <div className="p-10">Loading...</div>
//   }

//   return (
//     <div className="min-h-screen bg-[#F7F3ED]">
//       {/* Header */}
//       <div className="border-b px-5 md:px-[52px] pt-24 md:pt-32 pb-8 md:pb-12" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
//         <div
//           className="max-w-[1240px] mx-auto"
//           style={{
//             opacity: loaded ? 1 : 0,
//             transform: loaded ? 'none' : 'translateY(20px)',
//             transition: 'all 1s ease',
//           }}
//         >
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
//             <div>
//               <p className="overline mb-5">Account</p>
//               <h1
//                 className="font-display font-light text-[#1A1208] mb-2"
//                 style={{
//                   fontSize: 'clamp(42px, 10vw, 96px)',
//                   lineHeight: 0.9,
//                   letterSpacing: '-0.025em',
//                 }}
//               >
//                 {user?.name?.split(' ')[0]}
//               </h1>
//               <p className="font-body font-light" style={{ fontSize: '13px', color: 'rgba(26,18,8,0.4)' }}>
//                 Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}
//               </p>
//             </div>
//             <button onClick={handleLogout} className="btn-ghost md:mb-2">
//               Sign Out
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="sticky top-[60px] md:top-0 z-30 bg-[#F7F3ED] border-b px-5 md:px-[52px] py-4 overflow-x-auto no-scrollbar" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
//         <div className="max-w-[1240px] mx-auto flex gap-6 md:gap-8">
//           {[
//             { key: 'orders' as Tab, label: 'Orders' },
//             { key: 'addresses' as Tab, label: 'Addresses' },
//             { key: 'settings' as Tab, label: 'Settings' },
//           ].map(tab => (
//             <button
//               key={tab.key}
//               onClick={() => setActiveTab(tab.key)}
//               className="relative whitespace-nowrap pb-1 flex-shrink-0"
//               style={{
//                 fontFamily: "'Jost', sans-serif",
//                 fontSize: '10px',
//                 letterSpacing: '0.25em',
//                 textTransform: 'uppercase',
//                 color: activeTab === tab.key ? '#1A1208' : 'rgba(26,18,8,0.35)',
//                 fontWeight: 300,
//               }}
//             >
//               {tab.label}
//               <span
//                 style={{
//                   position: 'absolute',
//                   bottom: '-4px',
//                   left: 0,
//                   right: 0,
//                   height: '0.5px',
//                   backgroundColor: '#1A1208',
//                   transform: activeTab === tab.key ? 'scaleX(1)' : 'scaleX(0)',
//                   transformOrigin: 'left',
//                   transition: 'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
//                   display: 'block',
//                 }}
//               />
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Content */}
//       <div className="px-5 md:px-[52px] py-12 md:py-16 pb-24 md:pb-32">
//         <div className="max-w-[1240px] mx-auto">
//           {activeTab === 'orders' && <OrdersTab orders={orders} />}
//           {activeTab === 'addresses' && <AddressesTab addresses={addresses} />}
//           {activeTab === 'settings' && <SettingsTab user={user} />}
//         </div>
//       </div>
//     </div>
//   )
// }

// // ----------------- Tabs -----------------

// function OrdersTab({ orders }: { orders: Order[] }) {
//   return (
//     <div>
//       <div className="flex justify-between items-center mb-8">
//         <h2 className="font-display font-light text-[#1A1208]" style={{ fontSize: 'clamp(24px, 5vw, 32px)', letterSpacing: '-0.01em' }}>
//           Order History
//         </h2>
//         <p className="overline" style={{ color: 'rgba(26,18,8,0.3)' }}>
//           {orders.length} orders
//         </p>
//       </div>
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
//         {orders.map((order, i) => (
//           <OrderCard key={order.id} order={order} index={i} />
//         ))}
//       </div>
//     </div>
//   )
// }

// function OrderCard({ order, index }: { order: Order; index: number }) {
//   const statusColorMap: Record<OrderStatus, string> = {
//     pending: 'rgba(26,18,8,0.4)',
//     paid: 'rgba(26,18,8,0.45)',
//     processing: 'rgba(26,18,8,0.5)',
//     shipped: 'rgba(180,130,50,0.7)',
//     delivered: 'rgba(107,143,94,0.7)',
//     cancelled: 'rgba(160,80,80,0.7)',
//   }
//   const statusColor = statusColorMap[order.status]
//   return (
//     <Link
//       href={`/account/orders/${order.id}`}
//       className="block p-6 border"
//       style={{
//         borderColor: 'rgba(26,18,8,0.08)',
//         textDecoration: 'none',
//         opacity: 1,
//         animation: `fadeIn 0.5s ease ${index * 0.1}s backwards`,
//       }}
//     >
//       <div className="flex gap-4 mb-4">
//         <div className="relative flex-shrink-0 bg-[#EDE7DC]" style={{ width: '60px', height: '75px' }}>
//           <div
//             style={{
//               position: 'absolute',
//               inset: 0,
//               backgroundImage: `url('${order.image}')`,
//               backgroundSize: 'cover',
//               backgroundPosition: 'center',
//               filter: 'brightness(0.95) saturate(0.85)',
//             }}
//           />
//         </div>
//         <div className="flex-1">
//           <p className="font-body font-light mb-1" style={{ fontSize: '13px', color: '#1A1208' }}>
//             Order {order.id}
//           </p>
//           <p className="font-body font-light mb-2" style={{ fontSize: '11px', color: 'rgba(26,18,8,0.35)' }}>
//             {order.date} · {order.items} {order.items === 1 ? 'item' : 'items'}
//           </p>
//           <div className="flex items-center gap-2">
//             <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: statusColor }} />
//             <span className="font-body font-light" style={{ fontSize: '10px', color: statusColor }}>
//               {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
//             </span>
//           </div>
//         </div>
//       </div>
//       <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
//         <span className="font-body font-light" style={{ fontSize: '12px', color: 'rgba(26,18,8,0.4)' }}>
//           Total
//         </span>
//         <span className="font-display font-light text-[#1A1208]" style={{ fontSize: '18px' }}>
//           PKR {order.total.toLocaleString()}
//         </span>
//       </div>
//     </Link>
//   )
// }

// // ----------------- Addresses -----------------

// function AddressesTab({ addresses }: any) {
//   const handleAddAddress = async () => {
//     await userApi.post('/api/auth/address', {
//       name: "Home",
//       address: "Test Street 123",
//       city: "Karachi",
//       province: "Sindh",
//       postalCode: "75000",
//       phone: "03000000000",
//       isDefault: false,
//     })
//     const updatedUser = await userApi.get('/api/auth/me')
//     setAddresses(updatedUser.addresses || [])
//   }

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-8">
//         <h2 className="font-display font-light text-[#1A1208]" style={{ fontSize: 'clamp(24px, 5vw, 32px)', letterSpacing: '-0.01em' }}>
//           Saved Addresses
//         </h2>
//         <button className="btn-primary" onClick={handleAddAddress}>
//           <span>Add New</span>
//         </button>
//       </div>
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
//         {addresses.map((address: any, i: number) => (
//           <div
//             key={address.id}
//             className="p-6 border relative"
//             style={{
//               borderColor: address.isDefault ? '#1A1208' : 'rgba(26,18,8,0.08)',
//               backgroundColor: address.isDefault ? 'rgba(26,18,8,0.02)' : 'transparent',
//               opacity: 1,
//               animation: `fadeIn 0.5s ease ${i * 0.1}s backwards`,
//             }}
//           >
//             {address.isDefault && (
//               <div className="absolute top-4 right-4 px-2 py-1" style={{ backgroundColor: '#1A1208' }}>
//                 <span className="font-body font-light" style={{ fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F7F3ED' }}>
//                   Default
//                 </span>
//               </div>
//             )}
//             <p className="font-display font-light text-[#1A1208] mb-3" style={{ fontSize: '18px' }}>{address.name}</p>
//             <p className="font-body font-light mb-1" style={{ fontSize: '13px', color: 'rgba(26,18,8,0.5)' }}>{address.address}</p>
//             <p className="font-body font-light mb-4" style={{ fontSize: '13px', color: 'rgba(26,18,8,0.5)' }}>
//               {address.city}, {address.province} {address.postalCode}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// // ----------------- Settings -----------------

// function SettingsTab({ user }: any) {
//   const [form, setForm] = useState({
//     firstName: user?.name?.split(' ')[0] || '',
//     lastName: user?.name?.split(' ')[1] || '',
//     email: user?.email || '',
//     phone: user?.phone || '',
//   })

//   const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }))

//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault()
//     await userApi.put('/api/auth/update', {
//       name: `${form.firstName} ${form.lastName}`,
//       email: form.email,
//       phone: form.phone,
//     })
//     alert('Profile updated')
//   }

//   return (
//     <div className="max-w-[600px]">
//       <h2 className="font-display font-light text-[#1A1208] mb-8" style={{ fontSize: 'clamp(24px, 5vw, 32px)', letterSpacing: '-0.01em' }}>
//         Account Settings
//       </h2>

//       <form onSubmit={handleSave} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormField label="First Name" type="text" value={form.firstName} onChange={(v: string) => update('firstName', v)} />
//           <FormField label="Last Name" type="text" value={form.lastName} onChange={(v: string) => update('lastName', v)} />
//         </div>
//         <FormField label="Email" type="email" value={form.email} onChange={(v: string) => update('email', v)} />
//         <FormField label="Phone" type="tel" value={form.phone} onChange={(v: string) => update('phone', v)} />
//         <button type="submit" className="btn-primary"><span>Save Changes</span></button>
//       </form>
//     </div>
//   )
// }

// function FormField({ label, type, value, onChange }: any) {
//   return (
//     <div>
//       <p className="overline mb-3" style={{ color: 'rgba(26,18,8,0.35)' }}>{label}</p>
//       <input
//         type={type}
//         required
//         value={value}
//         onChange={e => onChange(e.target.value)}
//         className="w-full bg-transparent border-b outline-none"
//         style={{ borderColor: 'rgba(26,18,8,0.2)', padding: '12px 0', fontFamily: "'Jost', sans-serif", fontSize: '14px', fontWeight: 300, color: '#1A1208' }}
//         onFocus={e => { e.target.style.borderBottomColor = 'rgba(26,18,8,0.5)' }}
//         onBlur={e => { e.target.style.borderBottomColor = 'rgba(26,18,8,0.2)' }}
//       />
//     </div>
//   )
// }