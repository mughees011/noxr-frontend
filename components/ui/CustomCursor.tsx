// 'use client'

// import { useState, useEffect } from 'react'

// export default function CustomCursor() {
//   const [pos, setPos] = useState({ x: -100, y: -100 })
//   const [large, setLarge] = useState(false)
//   const [visible, setVisible] = useState(false)

//   useEffect(() => {
//     const onMove = (e: MouseEvent) => {
//       setPos({ x: e.clientX, y: e.clientY })
//       setVisible(true)
//     }
//     const onEnterInteractive = () => setLarge(true)
//     const onLeaveInteractive = () => setLarge(false)
//     const onLeaveWindow = () => setVisible(false)

//     window.addEventListener('mousemove', onMove)
//     document.addEventListener('mouseleave', onLeaveWindow)

//     // Attach to all interactive elements
//     const attachListeners = () => {
//       const targets = document.querySelectorAll(
//         'a, button, [role="button"], input, textarea, select, label, [data-cursor-large]'
//       )
//       targets.forEach((el) => {
//         el.addEventListener('mouseenter', onEnterInteractive)
//         el.addEventListener('mouseleave', onLeaveInteractive)
//       })
//     }
//     attachListeners()

//     // Re-attach on DOM changes
//     const observer = new MutationObserver(attachListeners)
//     observer.observe(document.body, { childList: true, subtree: true })

//     return () => {
//       window.removeEventListener('mousemove', onMove)
//       document.removeEventListener('mouseleave', onLeaveWindow)
//       observer.disconnect()
//     }
//   }, [])

//   if (typeof window === 'undefined') return null

//   return (
//     <>
//       {/* Dot */}
//       <div
//         aria-hidden="true"
//         style={{
//           position: 'fixed',
//           left: pos.x,
//           top: pos.y,
//           zIndex: 99999,
//           pointerEvents: 'none',
//           transform: 'translate(-50%, -50%)',
//           width: large ? '48px' : '7px',
//           height: large ? '48px' : '7px',
//           borderRadius: '50%',
//           backgroundColor: large ? 'rgba(26,18,8,0.07)' : '#1A1208',
//           border: large ? '0.5px solid rgba(26,18,8,0.18)' : 'none',
//           opacity: visible ? 1 : 0,
//           transition:
//             'width 0.4s cubic-bezier(0.25,0.46,0.45,0.94), height 0.4s cubic-bezier(0.25,0.46,0.45,0.94), background-color 0.3s ease, opacity 0.3s ease',
//           mixBlendMode: 'multiply',
//         }}
//       />
//     </>
//   )
// }







'use client'

import { useState, useEffect } from 'react'

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false)
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [large, setLarge] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY })
      setVisible(true)
    }

    const onEnterInteractive = () => setLarge(true)
    const onLeaveInteractive = () => setLarge(false)
    const onLeaveWindow = () => setVisible(false)

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeaveWindow)

    const attachListeners = () => {
      const targets = document.querySelectorAll(
        'a, button, [role="button"], input, textarea, select, label, [data-cursor-large]'
      )
      targets.forEach((el) => {
        el.addEventListener('mouseenter', onEnterInteractive)
        el.addEventListener('mouseleave', onLeaveInteractive)
      })
    }

    attachListeners()

    const observer = new MutationObserver(attachListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeaveWindow)
      observer.disconnect()
    }
  }, [])

  if (!mounted) return null

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        zIndex: 99999,
        pointerEvents: 'none',
        transform: 'translate(-50%, -50%)',
        width: large ? '48px' : '7px',
        height: large ? '48px' : '7px',
        borderRadius: '50%',
        backgroundColor: large ? 'rgba(26,18,8,0.07)' : '#1A1208',
        border: large ? '0.5px solid rgba(26,18,8,0.18)' : 'none',
        opacity: visible ? 1 : 0,
        transition:
          'width 0.4s cubic-bezier(0.25,0.46,0.45,0.94), height 0.4s cubic-bezier(0.25,0.46,0.45,0.94), background-color 0.3s ease, opacity 0.3s ease',
        mixBlendMode: 'multiply',
      }}
    />
  )
}