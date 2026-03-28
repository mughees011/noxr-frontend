import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CartItem {
  productId: string
  slug?: string
  name: string
  price: number
  size?: string
  color?: string
  quantity: number
  image?: string
  category?: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

// const loadCart = (): CartItem[] => {
//   if (typeof window === 'undefined') return []
//   const saved = localStorage.getItem('cart')
//   return saved ? JSON.parse(saved) : []
// }



const loadCart = (): CartItem[] => {
  if (typeof window === 'undefined') return []

  try {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}


const getCartKey = (item: {
  productId: string
  size?: string
  color?: string
}) => {
  return `${item.productId}_${item.size ?? ''}_${item.color ?? ''}`
}


const saveCart = (items: CartItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(items))
  }
}


const initialState: CartState = {
  items: loadCart(),
  isOpen: false,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // addToCart: (state, action: PayloadAction<CartItem>) => {
    //   const existing = state.items.find(
    //   item =>
    //     item.productId === action.payload.productId &&
    //     item.size === action.payload.size &&
    //     item.color === action.payload.color
    //   )

    //   if (existing) {
    //     existing.quantity += action.payload.quantity
    //   } else {
    //     state.items.push(action.payload)
    //   }
    // },


    addToCart: (state, action: PayloadAction<CartItem>) => {
  const newKey = getCartKey(action.payload)

  const existing = state.items.find(
    item => getCartKey(item) === newKey
  )

  if (existing) {
    existing.quantity += action.payload.quantity
  } else {
    state.items.push(action.payload)
  }

  saveCart(state.items)
},


//     removeItem: (
//   state,
//   action: PayloadAction<{
//     productId: string
//     size?: string
//     color?: string
//   }>
// ) => {
//   if (!action.payload) return

//   state.items = state.items.filter(item => {
//     if (!item) return false

//     return !(
//       item.productId === action.payload.productId &&
//       item.size === action.payload.size &&
//       item.color === action.payload.color
//     )
//   })
// },



removeItem: (
  state,
  action: PayloadAction<{
    productId: string
    size?: string
    color?: string
  }>
) => {
  const keyToRemove = getCartKey(action.payload)

  state.items = state.items.filter(
    item => getCartKey(item) !== keyToRemove
  )

  saveCart(state.items)
},


//     updateQuantity: (
//   state,
//   action: PayloadAction<{
//     productId: string
//     size?: string
//     color?: string
//     quantity: number
//   }>
// ) => {
//   const item = state.items.find(
//     i =>
//       i.productId === action.payload.productId &&
//       i.size === action.payload.size &&
//       i.color === action.payload.color
//   )

//   if (item) {
//     item.quantity = action.payload.quantity
//   }
// },




updateQuantity: (
  state,
  action: PayloadAction<{
    productId: string
    size?: string
    color?: string
    quantity: number
  }>
) => {
  const key = getCartKey(action.payload)

  const item = state.items.find(
    i => getCartKey(i) === key
  )

  if (item) {
    item.quantity = action.payload.quantity
  }

  saveCart(state.items)
},



    // clearCart: state => {
    //   state.items = []
    // },


    clearCart: state => {
  state.items = []
  saveCart([])
},


    openCart: state => {
      state.isOpen = true
    },

    closeCart: state => {
      state.isOpen = false
    },

    toggleCart: state => {
      state.isOpen = !state.isOpen
    },
  },
})

export const {
  addToCart,
  removeItem,
  updateQuantity,
  clearCart,
  openCart,
  closeCart,
  toggleCart,
} = cartSlice.actions

export default cartSlice.reducer