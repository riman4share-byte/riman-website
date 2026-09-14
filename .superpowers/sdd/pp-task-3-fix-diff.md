## Commits
c6204e8 a11y(nav): lift inactive mobile nav items to stone-600 on ivory

## Diff
diff --git a/src/components/MobileBottomNav.tsx b/src/components/MobileBottomNav.tsx
index 7939999..435f077 100644
--- a/src/components/MobileBottomNav.tsx
+++ b/src/components/MobileBottomNav.tsx
@@ -21,21 +21,21 @@ export default function MobileBottomNav() {
     <nav className="fixed bottom-0 left-0 w-full bg-ivory border-t border-stone-100 z-[100] grid grid-cols-5 md:hidden h-16 safe-area-bottom">
       {navItems.map((item) => {
         const isActive = location.pathname === item.path;
         const Icon = item.icon;
         return (
           <Link 
             key={item.path} 
             to={item.path}
             className={cn(
               "flex flex-col items-center justify-center gap-1 transition-colors relative",
-              isActive ? "text-gold" : "text-stone-400"
+              isActive ? "text-gold" : "text-stone-600"
             )}
           >
             <Icon className="w-5 h-5" />
             <span className="text-micro uppercase tracking-tighter font-black">{item.label}</span>
             {item.badge !== undefined && item.badge > 0 && (
               <span className="absolute top-2 right-4 bg-gold text-white text-micro min-w-4 h-4 px-0.5 flex items-center justify-center rounded-full leading-none font-bold">
                 {item.badge}
               </span>
             )}
           </Link>
