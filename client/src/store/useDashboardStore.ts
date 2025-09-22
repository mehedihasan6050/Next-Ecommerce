import { API_ROUTES } from '@/utils/api';
import axios from 'axios';
import { create } from 'zustand';

interface statisticsSeller {
  totalSales: number;
  totalCustomers: number;
  totalOrders: number;
  pendingOrders: number;
}

interface statisticsAdmin {
  totalOrders: number;
  completedOrders: number;
  totalSales: number;
  totalCustomers: number;
}

interface dashBoardStore {
  isLoading: boolean;
  statisticsSeller: statisticsSeller;
  statisticsAdmin: statisticsAdmin;
  error: string | null;
  dashBoardStatistics: () => Promise<void>;
  dashboardStatsForAdmin: () => Promise<void>;
}

export const useDashboardStore = create<dashBoardStore>((set, get) => ({
  statisticsSeller: {
    totalSales: 0,
    totalCustomers: 0,
    totalOrders: 0,
    pendingOrders: 0,
  },
  statisticsAdmin: {
    totalOrders: 0,
    completedOrders: 0,
    totalSales: 0,
    totalCustomers: 0,
  },
  isLoading: false,
  error: null,
  dashBoardStatistics: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await axios.get(
        `${API_ROUTES.DASHBOARD}/statistics-seller`,
        {
          withCredentials: true,
        }
      );
      set({
        statisticsSeller: response.data,
        isLoading: false,
      });
    } catch (e) {
      set({ error: 'failed to fetch', isLoading: false });
    }
  },
  dashboardStatsForAdmin: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await axios.get(
        `${API_ROUTES.DASHBOARD}/statistics-admin`,
        {
          withCredentials: true,
        }
      );
      set({
        statisticsAdmin: response.data,
        isLoading: false,
      });
    } catch (e) {
      set({ error: 'failed to fetch', isLoading: false });
    }
  },
}));
