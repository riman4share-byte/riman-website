import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import {
  addItemToCart,
  removeItemFromCart,
  updateQuantityInCart,
  calculateSubtotal,
  calculateTotalItems,
  type CartItem,
} from '../lib/cart';
import { analytics } from '../services/analytics';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, intent: 'sale' | 'rent', size?: string, date?: Date) => void;
  removeItem: (id: string, size?: string, intent?: 'sale' | 'rent') => void;
  updateQuantity: (id: string, qty: number, size?: string, intent?: 'sale' | 'rent') => void;
  subtotal: number;
  totalItems: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'riman_cart_v2';
const CART_SCHEMA_VERSION = 2;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Version check: discard stale carts on schema mismatch
        if (parsed && parsed._version === CART_SCHEMA_VERSION && Array.isArray(parsed.items)) {
          return parsed.items;
        }
        // Legacy format (bare array) or version mismatch — discard
        localStorage.removeItem(CART_STORAGE_KEY);
        localStorage.removeItem('riman_cart');
      }
    } catch {
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.removeItem('riman_cart');
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ _version: CART_SCHEMA_VERSION, items }));
  }, [items]);

  const addItem = (product: Product, intent: 'sale' | 'rent', size?: string, date?: Date) => {
    setItems(prev => {
      const next = addItemToCart(prev, product, intent, size, date);
      analytics.addToCart({
        id: product.id,
        name: product.name,
        price: intent === 'rent' ? product.rentalPrice : product.salePrice,
        intent,
      });
      return next;
    });
  };

  const removeItem = (id: string, size?: string, intent?: 'sale' | 'rent') => {
    setItems(prev => removeItemFromCart(prev, id, size, intent));
    analytics.removeFromCart(id);
  };

  const updateQuantity = (id: string, quantity: number, size?: string, intent?: 'sale' | 'rent') => {
    setItems(prev => updateQuantityInCart(prev, id, quantity, size, intent));
  };

  const clearCart = () => setItems([]);

  const subtotal = calculateSubtotal(items);
  const totalItems = calculateTotalItems(items);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, subtotal, totalItems, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
