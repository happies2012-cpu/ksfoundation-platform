import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'service' | 'product' | 'subscription';
  description?: string;
  features?: string[];
  image?: string;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  checkoutState: 'idle' | 'processing' | 'success' | 'failed';
  
  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCheckoutState: (state: 'idle' | 'processing' | 'success' | 'failed') => void;
  
  // Computed
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      checkoutState: 'idle',

      addItem: (item: Omit<CartItem, 'quantity'>) => {
        const { items } = get();
        const existingItem = items.find(i => i.id === item.id);

        if (existingItem) {
          set({
            items: items.map(i =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({
            items: [...items, { ...item, quantity: 1 }],
          });
        }
      },

      removeItem: (id: string) => {
        set({
          items: get().items.filter(item => item.id !== id),
        });
      },

      updateQuantity: (id: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set({
          items: get().items.map(item =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [], checkoutState: 'idle' });
      },

      toggleCart: () => {
        set({ isOpen: !get().isOpen });
      },

      setCheckoutState: (state: 'idle' | 'processing' | 'success' | 'failed') => {
        set({ checkoutState: state });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        isOpen: state.isOpen,
      }),
    }
  )
);

