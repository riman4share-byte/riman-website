## Commits
c2549ee feat(nav): promote Your Selection, demote bag

## Stat
 src/components/Header.tsx          | 12 ++++++++++--
 src/components/MobileBottomNav.tsx |  6 ++++--
 2 files changed, 14 insertions(+), 4 deletions(-)

## Diff
diff --git a/src/components/Header.tsx b/src/components/Header.tsx
index ce8491b..8c8a81b 100644
--- a/src/components/Header.tsx
+++ b/src/components/Header.tsx
@@ -1,33 +1,36 @@
 import React, { useState, useEffect } from 'react';
 import { Link, useLocation } from 'react-router-dom';
 import { Search, Heart, User, ShoppingBag, Menu, X, Globe, Sparkles, ChevronRight, Calendar, Scissors, HelpCircle, Phone } from 'lucide-react';
 import { motion, AnimatePresence } from 'motion/react';
 import { cn } from '../lib/utils';
 import { useLanguage } from '../contexts/LanguageContext';
 import { useCart } from '../contexts/CartContext';
+import { useWishlist } from '../contexts/WishlistContext';
 import { useScrollLock } from '../hooks/useScrollLock';
 import Logo from './Logo';
 
 const navLinks = [
   { label: "Our Story", path: "/about", key: 'nav.about' },
   { label: "Bridal", path: "/collection/bridal", key: 'nav.bridal' },
   { label: "Evening", path: "/collection/evening", key: 'nav.evening' },
   { label: "Rentals", path: "/collection/rental", key: 'nav.rentals' },
   { label: "Journal", path: "/blog", key: 'nav.blog' },
   { label: "Contact", path: "/contact", key: 'nav.contact' },
   { label: "Private Viewing", path: "/appointment", key: 'nav.private_viewing' },
 ];
 
 export default function Header() {
   const { language, setLanguage, t, isRtl } = useLanguage();
   const { totalItems } = useCart();
+  const { wishlist } = useWishlist();
+  const wishlistCount = wishlist.length;
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [logoPos, setLogoPos] = useState({ x: 0, y: 0 });
 
   const location = useLocation();
   const isHome = location.pathname === '/';
 
   const handleLogoMove = (e: React.MouseEvent) => {
     const rect = e.currentTarget.getBoundingClientRect();
     const x = e.clientX - rect.left - rect.width / 2;
     const y = e.clientY - rect.top - rect.height / 2;
@@ -151,22 +154,27 @@ export default function Header() {
               >
                 {link.key ? t(link.key) : link.label}
               </Link>
             ))}
           </nav>
 
           <div className="flex items-center gap-3 md:gap-4">
             <Link to="/style-quiz" className="hover:text-gold transition-colors" aria-label="Style Quiz">
               <Sparkles className={cn("w-6 h-6", (!isHome) ? "text-stone-800" : "text-white")} />
             </Link>
-            <Link to="/wishlist" className="hidden lg:block hover:text-gold transition-colors" aria-label="Wishlist">
-              <Heart className={cn("w-6 h-6", (!isHome) ? "text-stone-800" : "text-white")} />
+            <Link to="/wishlist" className="hidden lg:block relative group/wishlist hover:text-gold transition-colors" aria-label="Your Selection">
+              <Heart className={cn("w-6 h-6 transition-transform group-hover/wishlist:scale-110", (!isHome) ? "text-stone-800" : "text-white")} />
+              {wishlistCount > 0 && (
+                <span className="absolute -top-1 -right-1 bg-gold text-white text-[9px] w-4 h-4 flex items-center justify-center font-bold shadow-sm">
+                  {wishlistCount}
+                </span>
+              )}
             </Link>
             <Link to="/profile" className="hidden md:block hover:text-gold transition-colors" aria-label="Account">
               <User className={cn("w-6 h-6", (!isHome) ? "text-stone-800" : "text-white")} />
             </Link>
             <Link to="/checkout" className="hidden md:block relative group/cart">
               <ShoppingBag className={cn("w-6 h-6 transition-transform group-hover/cart:scale-110", (!isHome) ? "text-stone-800" : "text-white")} />
               {totalItems > 0 && (
                 <span className="absolute -top-1 -right-1 bg-gold text-white text-[9px] w-4 h-4 flex items-center justify-center font-bold shadow-sm">
                   {totalItems}
                 </span>
diff --git a/src/components/MobileBottomNav.tsx b/src/components/MobileBottomNav.tsx
index 19bcb5e..069f1f0 100644
--- a/src/components/MobileBottomNav.tsx
+++ b/src/components/MobileBottomNav.tsx
@@ -1,24 +1,26 @@
 import { Link, useLocation } from 'react-router-dom';
 import { Home, Search, Heart, User, ShoppingBag } from 'lucide-react';
 import { cn } from '../lib/utils';
 import { useCart } from '../contexts/CartContext';
+import { useWishlist } from '../contexts/WishlistContext';
 
 export default function MobileBottomNav() {
   const location = useLocation();
   const { totalItems } = useCart();
+  const { wishlist } = useWishlist();
 
   const navItems = [
     { label: 'Home', path: '/', icon: Home },
     { label: 'Search', path: '/search', icon: Search },
-    { label: 'Wishlist', path: '/wishlist', icon: Heart },
-    { label: 'Cart', path: '/checkout', icon: ShoppingBag, badge: totalItems },
+    { label: 'Selection', path: '/wishlist', icon: Heart, badge: wishlist.length },
+    { label: 'Bag', path: '/checkout', icon: ShoppingBag, badge: totalItems },
     { label: 'You', path: '/profile', icon: User },
   ];
 
   return (
     <nav className="fixed bottom-0 left-0 w-full bg-ivory border-t border-stone-100 z-[100] grid grid-cols-5 md:hidden h-16 safe-area-bottom">
       {navItems.map((item) => {
         const isActive = location.pathname === item.path;
         const Icon = item.icon;
         return (
           <Link 
