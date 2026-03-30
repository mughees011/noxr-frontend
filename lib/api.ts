// const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

// // Helper to get admin token
// const getToken = (isAdmin: boolean) => {
//   if (typeof window === 'undefined') return null;

//   return isAdmin
//     ? localStorage.getItem('noxr_admin_token')
//     : localStorage.getItem('noxr_user_token');
// };

// const getUserToken = () => {
//   if (typeof window === 'undefined') return null;
//   return localStorage.getItem('noxr_user_token');
// };


// // Core request function
// const request = async (
//   endpoint: string,
//   method: string = 'GET',
//   data?: any,
//   isAdmin: boolean = false
// ) => {
//   const token = getToken(isAdmin);

//   const res = await fetch(`${BASE_URL}${endpoint}`, {
//     method,
//     headers: {
//       'Content-Type': 'application/json',
//       ...(token && { Authorization: `Bearer ${token}` }),
//     },
//     ...(data && { body: JSON.stringify(data) }),
//   });

//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(text || 'API Error');
//   }

//   return res.json();
// };

// // ---

// // # 🔹 PUBLIC API

// export const api = {
//   get: (endpoint: string) => request(endpoint, 'GET', null, false),
//   post: (endpoint: string, data?: any) => request(endpoint, 'POST', data, false),
//   put: (endpoint: string, data?: any) => request(endpoint, 'PUT', data, false),
//   delete: (endpoint: string) => request(endpoint, 'DELETE', null, false),
// };

// // ---

// // # 🔹 ADMIN API (AUTO TOKEN)

// export const adminApi = {
//   get: (endpoint: string) => request(endpoint, 'GET', null, true),
//   post: (endpoint: string, data?: any) => request(endpoint, 'POST', data, true),
//   put: (endpoint: string, data?: any) => request(endpoint, 'PUT', data, true),
//   delete: (endpoint: string) => request(endpoint, 'DELETE', null, true),

//   stats: () => request('/api/admin/stats', 'GET', null, true),
//   recentOrders: () => request('/api/admin/recent-orders', 'GET', null, true),
//   lowStock: () => request('/api/admin/low-stock', 'GET', null, true),
// };






const PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
const ADMIN_BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL!;

// Token helper
const getToken = (isAdmin: boolean) => {
  if (typeof window === 'undefined') return null;

  return isAdmin
    ? localStorage.getItem('noxr_admin_token')
    : localStorage.getItem('noxr_user_token');
};

// Core request
const request = async (
  endpoint: string,
  method: string = 'GET',
  data?: any,
  isAdmin: boolean = false
) => {
  const token = getToken(isAdmin);

  const base = isAdmin ? ADMIN_BASE_URL : PUBLIC_BASE_URL;

  const res = await fetch(`${base}${endpoint}`, {
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

// PUBLIC API → already includes /api
export const api = {
  get: (endpoint: string) => request(endpoint, 'GET', null, false),
  post: (endpoint: string, data?: any) => request(endpoint, 'POST', data, false),
  put: (endpoint: string, data?: any) => request(endpoint, 'PUT', data, false),
  delete: (endpoint: string) => request(endpoint, 'DELETE', null, false),
};

// ADMIN API → you control full path
export const adminApi = {
  get: (endpoint: string) => request(endpoint, 'GET', null, true),
  post: (endpoint: string, data?: any) => request(endpoint, 'POST', data, true),
  put: (endpoint: string, data?: any) => request(endpoint, 'PUT', data, true),
  delete: (endpoint: string) => request(endpoint, 'DELETE', null, true),
};