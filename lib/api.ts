const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

// Helper to get admin token
const getToken = (isAdmin: boolean) => {
  if (typeof window === 'undefined') return null;

  return isAdmin
    ? localStorage.getItem('noxr_admin_token')
    : localStorage.getItem('noxr_user_token');
};

const getUserToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('noxr_user_token');
};


// Core request function
const request = async (
  endpoint: string,
  method: string = 'GET',
  data?: any,
  isAdmin: boolean = false
) => {
  const token = getToken(isAdmin);

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(data && { body: JSON.stringify(data) }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'API Error');
  }

  return res.json();
};

// ---

// # 🔹 PUBLIC API

export const api = {
  get: (endpoint: string) => request(endpoint, 'GET', null, false),
  post: (endpoint: string, data?: any) => request(endpoint, 'POST', data, false),
  put: (endpoint: string, data?: any) => request(endpoint, 'PUT', data, false),
  delete: (endpoint: string) => request(endpoint, 'DELETE', null, false),
};

// ---

// # 🔹 ADMIN API (AUTO TOKEN)

export const adminApi = {
  get: (endpoint: string) => request(endpoint, 'GET', null, true),
  post: (endpoint: string, data?: any) => request(endpoint, 'POST', data, true),
  
  stats: () => request('/api/admin/stats', 'GET', null, true),
  recentOrders: () => request('/api/admin/orders/recent', 'GET', null, true),
  lowStock: () => request('/api/admin/products/low-stock', 'GET', null, true),
};