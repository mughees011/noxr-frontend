// import axios from 'axios';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// // Create axios instance
// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });


// const adminApi = axios.create({
//   baseURL: 'http://localhost:5000',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// adminApi.interceptors.request.use(
//   (config) => {
//     if (typeof window !== 'undefined') {
//       const token = localStorage.getItem('noxr_admin_token');
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Add token to requests if it exists
// api.interceptors.request.use(
//   (config) => {
//     if (typeof window !== 'undefined') {
//       const token = localStorage.getItem('noxr_admin_token');
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Auth API
// export const authAPI = {
//   register: (data: { name: string; email: string; password: string }) =>
//     api.post('/auth/register', data),
//   login: (data: { email: string; password: string }) => 
//     api.post('/auth/login', data),
//   getMe: () => api.get('/auth/me'),
//   updateDetails: (data: any) => api.put('/auth/updatedetails', data),
// };

// // Admin API
// export const adminAPI = {
//   login: (data: { email: string; password: string }) =>
//     adminApi.post('/admin/login', data),

//   register: (data: { name: string; email: string; password: string }) =>
//     adminApi.post('/admin/register', data),

//   verify: () =>
//     adminApi.get('/admin/dashboard'),

//   stats: () =>
//     adminApi.get('/admin/stats'),

//   recentOrders: () =>
//     adminApi.get('/admin/recent-orders'),
  
//   lowStock: () =>
//     adminApi.get('/admin/low-stock'),
// };




// // Products API
// export const productsAPI = {
//   getAll: (params?: any) => api.get('/products', { params }),
//   getBySlug: (slug: string) => api.get(`/products/${slug}`),
//   getFeatured: () => api.get('/products/featured/list'),
//   create: (data: any) => api.post('/products', data),
//   update: (id: string, data: any) => api.put(`/products/${id}`, data),
//   delete: (id: string) => api.delete(`/products/${id}`),
// };

// // Orders API
// export const ordersAPI = {
//   create: (data: any) => api.post('/orders', data),
//   getMyOrders: () => api.get('/orders/myorders'),
//   getById: (id: string) => api.get(`/orders/${id}`),
//   createCheckout: (data: any) => api.post('/orders/checkout', data),
//   updateToPaid: (id: string, data: any) => api.put(`/orders/${id}/pay`, data),
//   getAllOrders: () => api.get('/orders'),
//   updateStatus: (id: string, data: any) => api.put(`/orders/${id}/status`, data),
// };

// export default api;









// API URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Helper function for API calls
export const api = {
  // GET request
  get: async (endpoint: string, token?: string) => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers,
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Request failed' }))
      throw new Error(error.message || 'Request failed')
    }

    return res.json()
  },

  // POST request
  post: async (endpoint: string, data?: any, token?: string) => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Request failed' }))
      throw new Error(error.message || 'Request failed')
    }

    return res.json()
  },

  // PUT request
  put: async (endpoint: string, data?: any, token?: string) => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Request failed' }))
      throw new Error(error.message || 'Request failed')
    }

    return res.json()
  },

  // PATCH request
  patch: async (endpoint: string, data?: any, token?: string) => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Request failed' }))
      throw new Error(error.message || 'Request failed')
    }

    return res.json()
  },

  // DELETE request
  delete: async (endpoint: string, token?: string) => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Request failed' }))
      throw new Error(error.message || 'Request failed')
    }

    return res.json()
  },
}

// Export API_URL for direct fetch calls if needed
export { API_URL }