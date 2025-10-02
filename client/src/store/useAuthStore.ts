import { API_ROUTES } from '@/utils/api';
import axios from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
  id: string;
  name: string | null;
  email: string;
  role: 'USER' | 'ADMIN' | 'SELLER';
  roleRequest: boolean
};

type requestedUser= {
 id: string,
 email: string,
 roleRequest: boolean,
 name: string,
 role: string
}

type AuthStore = {
  user: User | null;
  isLoading: boolean;
  requestUser: requestedUser[];
  error: string | null;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<string | null>;
  login: (name: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
  roleChange: (id: string) => Promise<boolean>;
  roleRequest: () => Promise<boolean>;
  fetchRequest: () => Promise<void>
};

const axiosInstance = axios.create({
  baseURL: API_ROUTES.AUTH,
  withCredentials: true,
});

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      requestUser: [],
      isLoading: false,
      error: null,
      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post('/register', {
            name,
            email,
            password,
          });

          set({ isLoading: false });
          return response.data.userId;
        } catch (error) {
          set({
            isLoading: false,
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error || 'Registration failed'
              : 'Registration failed',
          });

          return null;
        }
      },
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post('/login', {
            email,
            password,
          });

          set({ isLoading: false, user: response.data.user });

          
    const role = response.data.user.role;
    if (role === "USER") {
      window.location.href = "/";
    } else if (role === "SELLER") {
      window.location.href = "/seller";
    } else if (role === "ADMIN") {
      window.location.href = "/admin";
    }

    return true;
    
        } catch (error) {
          set({
            isLoading: false,
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error || 'Login failed'
              : 'Login failed',
          });
          return false;
        }
      },
      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await axiosInstance.post('/logout');
          set({ user: null, isLoading: false });
        } catch (error) {
          set({
            isLoading: false,
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error || 'Logout failed'
              : 'Logout failed',
          });
        }
      },
      refreshAccessToken: async () => {
        try {
          await axiosInstance.post('/refresh-token');
          return true;
        } catch (e) {
          console.error(e);
          return false;
        }
      },
      roleChange: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          await axiosInstance.patch(`/role-change/${id}`)
          set({ isLoading: false });
          return true
        } catch (error) {
           console.error(error)
           return false
         
        }
      },
      roleRequest: async () => {
        try {
          set({ isLoading: true, error: null });
          await axiosInstance.patch('/role-request')
          set({ isLoading: false });
          return true
        } catch (error) {
          console.error(error)
           return false
         
        }
      },
       fetchRequest: async () => {
        try {
          set({ isLoading: true, error: null });
         const res = await axiosInstance.get('/fetch-request')
        set({requestUser: res.data, isLoading: false });
         
        } catch (error) {
          console.error(error)
          set({error: 'somthng went wrong'}) 
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: state => ({ user: state.user }),
    }
  )
);
