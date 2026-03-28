// import type { Metadata } from 'next'
// import '../globals.css'
// import Header from '@/components/layout/Header'
// import Footer from '@/components/layout/Footer'
// import ReduxProvider from '@/components/providers/ReduxProvider'
// import CartDrawer from '@/app/(store)/cart/CartDrawer'
// import CustomCursor from '@/components/ui/CustomCursor'

// export const metadata: Metadata = {
//   title: {
//     default: 'NOXR | Premium Minimalist Apparel',
//     template: '%s — NOXR',
//   },
//   description:
//     'NOXR is a premium minimalist lifestyle label focused on structured silhouettes and timeless essentials.',
//   keywords: ['minimalist clothing', 'premium streetwear', 'oversized structured t-shirt', 'luxury essentials',],
//   openGraph: {
//     title: 'NOXR — Minimal Lifestyle Wear',
//     description: 'Premium menswear. Limited runs. No restocks.',
//     siteName: 'NOXR',
//     locale: 'en_US',
//     type: 'website',
//   },
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <head>
//         <link rel="preconnect" href="https://fonts.googleapis.com" />
//         <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
//         <link
//           href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap"
//           rel="stylesheet"
//         />
//       </head>
//       <body className="bg-[#F7F3ED] text-[#1A1208] overflow-x-hidden">
//         <ReduxProvider>
//           <CustomCursor/>
//           <CartDrawer/>
//           <Header/>
//           <main className="pt-[64px]">
//             {children}
//           </main>
//           <Footer/>
//         </ReduxProvider>
//       </body>
//     </html>
//   )
// }





import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
// import CartDrawer from '@/app/(store)/cart/CartDrawer'
import dynamic from 'next/dynamic'

const CartDrawer = dynamic(
  () => import('@/app/(store)/cart/CartDrawer'),
  { ssr: false }
)

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <CartDrawer />
      <Header />
      <main className="pt-[64px]">
        {children}
      </main>
      <Footer />
    </>
  )
}