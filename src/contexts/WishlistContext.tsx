import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { useAuth } from './AuthContext';
import { fetchWishlist, addToWishlistDb, removeFromWishlistDb } from '../services/wishlist';
import { analytics } from '../services/analytics';

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadWishlist();
  }, [user?.id]);

  const loadWishlist = async () => {
    if (user?.id) {
      try {
        const data = await fetchWishlist(user.id);
        setWishlist(data || []);
      } catch {
        loadFromLocal();
      }
    } else {
      loadFromLocal();
    }
    setIsLoading(false);
  };

const WISHLIST_STORAGE_KEY = 'riman_wishlist_v2';
const WISHLIST_SCHEMA_VERSION = 2;

  const loadFromLocal = () => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed._version === WISHLIST_SCHEMA_VERSION && Array.isArray(parsed.items)) {
          setWishlist(parsed.items);
        } else {
          // Legacy or version mismatch — discard
          localStorage.removeItem(WISHLIST_STORAGE_KEY);
          localStorage.removeItem('riman_wishlist');
        }
      }
    } catch {
      localStorage.removeItem(WISHLIST_STORAGE_KEY);
      localStorage.removeItem('riman_wishlist');
    }
  };

  const saveToLocal = (items: Product[]) => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify({ _version: WISHLIST_SCHEMA_VERSION, items }));
  };

  const addToWishlist = (product: Product) => {
    setWishlist(prev => {
      if (prev.find(p => p.id === product.id)) return prev;
      const updated = [...prev, product];
      saveToLocal(updated);
      analytics.addToSelection({ id: product.id, name: product.name, category: product.category }, updated.length);
      return updated;
    });

    if (user?.id) {
      addToWishlistDb(user.id, product.id).catch(() => {});
    }
  };

  const removeFromWishlist = (id: string) => {
    setWishlist(prev => {
      const updated = prev.filter(p => p.id !== id);
      saveToLocal(updated);
      analytics.removeFromSelection(id);
      return updated;
    });

    if (user?.id) {
      removeFromWishlistDb(user.id, id).catch(() => {});
    }
  };

  const isInWishlist = (id: string) => wishlist.some(p => p.id === id);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, isLoading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}