// 'use client'

// import { Provider } from 'react-redux'
// import { store } from '@/store'

// export default function ReduxProvider({ children }: { children: React.ReactNode }) {
//   return <Provider store={store}>{children}</Provider>
// }






'use client'

import { Provider } from 'react-redux'
import { store } from '@/store'
import { useEffect, useState } from 'react'

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <Provider store={store}>{children}</Provider>
}