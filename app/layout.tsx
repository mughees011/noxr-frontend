import type { Metadata } from 'next'
import './globals.css'
import ReduxProvider from '@/components/providers/ReduxProvider'

// import CustomCursor from '@/components/ui/CustomCursor'
import dynamic from 'next/dynamic'

const CustomCursor = dynamic(
  () => import('@/components/ui/CustomCursor'),
  { ssr: false }
)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#F7F3ED] text-[#1A1208] overflow-x-hidden">
        <ReduxProvider>
          <CustomCursor/>
          {children}
        </ReduxProvider>
      </body>
    </html>
  )
}