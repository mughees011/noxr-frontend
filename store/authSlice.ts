import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const loadAuthFromStorage = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('noxr-token');
    const userStr = localStorage.getItem('noxr-user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    return {
      token,
      user,
      isAuthenticated: !!token,
    };
  }
  
  return {
    token: null,
    user: null,
    isAuthenticated: false,
  };
};

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    initializeAuth: (state) => {
      const auth = loadAuthFromStorage();
      state.user = auth.user;
      state.token = auth.token;
      state.isAuthenticated = auth.isAuthenticated;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('noxr-token', action.payload.token);
        localStorage.setItem('noxr-user', JSON.stringify(action.payload.user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('noxr-token');
        localStorage.removeItem('noxr-user');
      }
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('noxr-user', JSON.stringify(action.payload));
      }
    },
  },
});

export const { initializeAuth, loginSuccess, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
