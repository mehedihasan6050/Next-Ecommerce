import { API_ROUTES } from '@/utils/api';
import axios from 'axios';
import { create } from 'zustand';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productCategory: string;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
  sellerId: string;
}

export interface Order {
  id: string;
  userId: string;
  addressId: string;
  items: OrderItem[];
  couponId?: string;
  totalPrice: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  paymentMethod: 'CREDIT_CARD';
  paymentStatus: 'PENDING' | 'COMPLETED';
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SellerOrder {
  id: string;
  userId: string;
  addressId: string;
  items: OrderItem[];
  couponId?: string;
  totalPrice: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  paymentMethod: 'CREDIT_CARD';
  paymentStatus: 'PENDING' | 'COMPLETED';
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface OrderStore {
  isLoading: boolean;
  userOrders: Order[];
  sellerOrders: SellerOrder[];
  error: string | null;
  getOrder: (orderId: string) => Promise<Order | null>;
  updateOrderStatus: (
    orderId: string,
    status: Order['status']
  ) => Promise<boolean>;
  getAllOrders: () => Promise<Order[] | null>;
  getOrdersByUserId: () => Promise<Order[] | null>;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  isLoading: true,
  error: null,
  userOrders: [],
  sellerOrders: [],
  updateOrderStatus: async (orderId, status) => {
    set({ isLoading: true, error: null });
    try {
      await axios.put(
        `${API_ROUTES.ORDER}/${orderId}/status`,
        { status },
        { withCredentials: true }
      );
      set(state => ({
        currentOrder:
          state.currentOrder && state.currentOrder.id === orderId
            ? {
                ...state.currentOrder,
                status,
              }
            : state.currentOrder,
        isLoading: false,
        adminOrders: state.adminOrders.map(item =>
          item.id === orderId
            ? {
                ...item,
                status,
              }
            : item
        ),
      }));
      return true;
    } catch (error) {
      set({ error: 'Failed to capture paypal order', isLoading: false });
      return false;
    }
  },
  getAllOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_ROUTES.ORDER}/get-all-orders-for-seller`,
        { withCredentials: true }
      );
      set({ isLoading: false, sellerOrders: response.data });
      return response.data;
    } catch (error) {
      set({ error: 'Failed to fetch all orders for admin', isLoading: false });
      return null;
    }
  },
  getOrdersByUserId: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_ROUTES.ORDER}/get-order-by-user-id`,
        { withCredentials: true }
      );
      set({ isLoading: false, userOrders: response.data });
      return response.data;
    } catch (error) {
      set({ error: 'Failed to fetch all orders for admin', isLoading: false });
      return null;
    }
  },
  getOrder: async orderId => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_ROUTES.ORDER}/get-single-order/${orderId}`,
        { withCredentials: true }
      );
      set({ isLoading: false, currentOrder: response.data });
      return response.data;
    } catch (error) {
      set({ error: 'Failed to fetch all orders for admin', isLoading: false });
      return null;
    }
  },
}));
