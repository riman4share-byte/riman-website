## Commits
f80b93e a11y(admin): 11px type floor + AA contrast; drop dead RTL pixel overrides

## Stat
 src/index.css                         |   6 --
 src/pages/admin/AdminAppointments.tsx |  30 +++++-----
 src/pages/admin/AdminCalendar.tsx     |  28 ++++-----
 src/pages/admin/AdminContent.tsx      |  16 ++---
 src/pages/admin/AdminDashboard.tsx    |  34 +++++------
 src/pages/admin/AdminGallery.tsx      |  10 ++--
 src/pages/admin/AdminLayout.tsx       |   8 +--
 src/pages/admin/AdminOrders.tsx       | 106 +++++++++++++++++-----------------
 src/pages/admin/AdminPlaceholder.tsx  |   4 +-
 src/pages/admin/AdminProducts.tsx     |  66 ++++++++++-----------
 src/pages/admin/AdminSettings.tsx     |   2 +-
 11 files changed, 152 insertions(+), 158 deletions(-)

## Diff
diff --git a/src/index.css b/src/index.css
index a1918e1..c379de1 100644
--- a/src/index.css
+++ b/src/index.css
@@ -92,26 +92,20 @@
   [dir="rtl"] .text-lg { font-size: 1.1875rem; }      /* 19px instead of 18px */
   [dir="rtl"] .text-xl { font-size: 1.3125rem; }      /* 21px instead of 20px */
   [dir="rtl"] .text-2xl { font-size: 1.625rem; }      /* 26px instead of 24px */
   [dir="rtl"] .text-3xl { font-size: 2rem; }           /* 32px instead of 30px */
   [dir="rtl"] .text-4xl { font-size: 2.5rem; }
   [dir="rtl"] .text-5xl { font-size: 3.25rem; }
   [dir="rtl"] .text-6xl { font-size: 4rem; }
   [dir="rtl"] .text-7xl { font-size: 5rem; }
   [dir="rtl"] .text-8xl { font-size: 6.5rem; }
   [dir="rtl"] .text-9xl { font-size: 8.5rem; }
-  /* Pixel-based sizes: enlarge by ~25% */
-  [dir="rtl"] .text-\[8px\] { font-size: 11px; }
-  [dir="rtl"] .text-\[9px\] { font-size: 12px; }
-  [dir="rtl"] .text-\[10px\] { font-size: 13px; }
-  [dir="rtl"] .text-\[11px\] { font-size: 14px; }
-  [dir="rtl"] .text-\[12px\] { font-size: 15px; }
   [dir="rtl"] .text-micro { font-size: 14px; }
   [dir="rtl"] .text-caption { font-size: 15px; }
   /* Tracking is meaningless in Arabic and causes rendering issues */
   [dir="rtl"] .tracking-widest { letter-spacing: 0 !important; }
   [dir="rtl"] .tracking-wider { letter-spacing: 0 !important; }
   [dir="rtl"] .tracking-\[0\.3em\] { letter-spacing: 0 !important; }
   [dir="rtl"] .tracking-\[0\.2em\] { letter-spacing: 0 !important; }
   [dir="rtl"] .tracking-\[0\.5em\] { letter-spacing: 0 !important; }
   [dir="rtl"] .tracking-\[0\.4em\] { letter-spacing: 0 !important; }
   [dir="rtl"] .tracking-\[0\.15em\] { letter-spacing: 0 !important; }
diff --git a/src/pages/admin/AdminAppointments.tsx b/src/pages/admin/AdminAppointments.tsx
index 1ae3bdd..fdf639c 100644
--- a/src/pages/admin/AdminAppointments.tsx
+++ b/src/pages/admin/AdminAppointments.tsx
@@ -64,57 +64,57 @@ export default function AdminAppointments() {
 
   if (isLoading) {
     return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-gold animate-spin" /></div>;
   }
 
   return (
     <div>
       <div className="flex items-center justify-between mb-8">
         <div>
           <h1 className="font-heading text-2xl text-stone-800 tracking-wider uppercase">Appointments</h1>
-          <p className="text-stone-500 text-sm mt-1">{appointments.length} total bookings</p>
+          <p className="text-stone-600 text-sm mt-1">{appointments.length} total bookings</p>
         </div>
       </div>
 
       {error && (
           <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
             {error}
             <button onClick={() => setError(null)} className="ml-2 underline">Dismiss</button>
           </div>
         )}
 
       {appointments.length === 0 ? (
         <div className="text-center py-20 bg-ivory border border-stone-100">
           <Calendar className="w-12 h-12 text-stone-300 mx-auto mb-4" />
-          <p className="font-heading text-stone-400">No appointments yet</p>
-          <p className="text-stone-400 text-sm mt-2">Bookings from the appointment page will appear here.</p>
+          <p className="font-heading text-stone-600">No appointments yet</p>
+          <p className="text-stone-600 text-sm mt-2">Bookings from the appointment page will appear here.</p>
         </div>
       ) : (
         <div className="space-y-3">
           {appointments.map(appt => (
             <motion.div
               key={appt.id}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-ivory border border-stone-100 p-5 hover:border-gold/30 transition-colors cursor-pointer"
               onClick={() => setSelectedAppt(appt)}
             >
               <div className="flex items-start justify-between">
                 <div className="flex-1">
                   <div className="flex items-center gap-3 mb-2">
-                    <span className={cn("text-[10px] tracking-widest uppercase font-bold px-3 py-1 border", STATUS_COLORS[appt.status || 'pending'])}>
+                    <span className={cn("text-micro tracking-widest uppercase font-bold px-3 py-1 border", STATUS_COLORS[appt.status || 'pending'])}>
                       {appt.status || 'pending'}
                     </span>
-                    <span className="text-[10px] tracking-widest uppercase text-gold font-bold">{SERVICE_LABELS[appt.service_type] || appt.service_type}</span>
+                    <span className="text-micro tracking-widest uppercase text-gold font-bold">{SERVICE_LABELS[appt.service_type] || appt.service_type}</span>
                   </div>
                   <h3 className="font-heading text-stone-800 text-lg">{appt.name}</h3>
-                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-stone-500">
+                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-stone-600">
                     <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {appt.date}</span>
                     <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {appt.time}</span>
                     <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {appt.email}</span>
                     <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {appt.phone}</span>
                     {(appt.interested_gowns?.length ?? 0) > 0 && (
                       <span className="flex items-start gap-1 basis-full">
                         <Heart className="w-3 h-3 mt-0.5 shrink-0" />
                         <span className="italic">{appt.interested_gowns!.map(g => `${g.name}${g.size ? ` (${g.size})` : ''}`).join(' ┬╖ ')}</span>
                       </span>
                     )}
@@ -136,32 +136,32 @@ export default function AdminAppointments() {
 
       <AnimatePresence>
         {selectedAppt && (
           <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4" onClick={() => setSelectedAppt(null)}>
             <div className="absolute inset-0 bg-onyx/30 backdrop-blur-sm" />
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-ivory p-8 max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
               <button onClick={() => setSelectedAppt(null)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-800" aria-label="Close"><XCircle className="w-5 h-5" /></button>
               <h2 className="font-heading text-xl text-stone-800 tracking-wider uppercase mb-6">Appointment Details</h2>
               <div className="space-y-4 text-sm">
                 <div className="grid grid-cols-2 gap-4">
-                  <div><span className="text-[10px] tracking-widest uppercase text-stone-400 font-bold block mb-1">Client</span><span className="text-stone-800 font-medium">{selectedAppt.name}</span></div>
-                  <div><span className="text-[10px] tracking-widest uppercase text-stone-400 font-bold block mb-1">Service</span><span className="text-stone-800 font-medium">{SERVICE_LABELS[selectedAppt.service_type] || selectedAppt.service_type}</span></div>
-                  <div><span className="text-[10px] tracking-widest uppercase text-stone-400 font-bold block mb-1">Date</span><span className="text-stone-800 font-medium">{selectedAppt.date}</span></div>
-                  <div><span className="text-[10px] tracking-widest uppercase text-stone-400 font-bold block mb-1">Time</span><span className="text-stone-800 font-medium">{selectedAppt.time}</span></div>
-                  <div><span className="text-[10px] tracking-widest uppercase text-stone-400 font-bold block mb-1">Email</span><span className="text-stone-800 font-medium">{selectedAppt.email}</span></div>
-                  <div><span className="text-[10px] tracking-widest uppercase text-stone-400 font-bold block mb-1">Phone</span><span className="text-stone-800 font-medium">{selectedAppt.phone}</span></div>
+                  <div><span className="text-micro tracking-widest uppercase text-stone-600 font-bold block mb-1">Client</span><span className="text-stone-800 font-medium">{selectedAppt.name}</span></div>
+                  <div><span className="text-micro tracking-widest uppercase text-stone-600 font-bold block mb-1">Service</span><span className="text-stone-800 font-medium">{SERVICE_LABELS[selectedAppt.service_type] || selectedAppt.service_type}</span></div>
+                  <div><span className="text-micro tracking-widest uppercase text-stone-600 font-bold block mb-1">Date</span><span className="text-stone-800 font-medium">{selectedAppt.date}</span></div>
+                  <div><span className="text-micro tracking-widest uppercase text-stone-600 font-bold block mb-1">Time</span><span className="text-stone-800 font-medium">{selectedAppt.time}</span></div>
+                  <div><span className="text-micro tracking-widest uppercase text-stone-600 font-bold block mb-1">Email</span><span className="text-stone-800 font-medium">{selectedAppt.email}</span></div>
+                  <div><span className="text-micro tracking-widest uppercase text-stone-600 font-bold block mb-1">Phone</span><span className="text-stone-800 font-medium">{selectedAppt.phone}</span></div>
                 </div>
                 {selectedAppt.notes && (
-                  <div><span className="text-[10px] tracking-widest uppercase text-stone-400 font-bold block mb-1">Notes</span><p className="text-stone-600">{selectedAppt.notes}</p></div>
+                  <div><span className="text-micro tracking-widest uppercase text-stone-600 font-bold block mb-1">Notes</span><p className="text-stone-600">{selectedAppt.notes}</p></div>
                 )}
-                <div><span className="text-[10px] tracking-widest uppercase text-stone-400 font-bold block mb-1">Status</span>
-                  <span className={cn("text-[10px] tracking-widest uppercase font-bold px-3 py-1 border", STATUS_COLORS[selectedAppt.status || 'pending'])}>
+                <div><span className="text-micro tracking-widest uppercase text-stone-600 font-bold block mb-1">Status</span>
+                  <span className={cn("text-micro tracking-widest uppercase font-bold px-3 py-1 border", STATUS_COLORS[selectedAppt.status || 'pending'])}>
                     {selectedAppt.status || 'pending'}
                   </span>
                 </div>
               </div>
               <div className="flex gap-3 mt-6">
                 <button onClick={() => { handleStatusChange(selectedAppt.id!, 'confirmed'); setSelectedAppt(null); }} className="btn-luxury text-xs" aria-label="Confirm appointment">Confirm</button>
                 <button onClick={() => { handleStatusChange(selectedAppt.id!, 'completed'); setSelectedAppt(null); }} className="btn-luxury-outline text-xs" aria-label="Mark appointment completed">Mark Completed</button>
               </div>
             </motion.div>
           </div>
diff --git a/src/pages/admin/AdminCalendar.tsx b/src/pages/admin/AdminCalendar.tsx
index 5097aec..4321ece 100644
--- a/src/pages/admin/AdminCalendar.tsx
+++ b/src/pages/admin/AdminCalendar.tsx
@@ -38,27 +38,27 @@ export default function AdminCalendar() {
       <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         {/* Main Calendar View */}
         <div className="lg:col-span-3 bg-ivory border border-stone-200">
           <div className="p-8 border-b border-stone-100 flex justify-between items-center">
             <h3 className="font-heading text-2xl text-stone-800 tracking-wide uppercase">
               {format(currentMonth, 'MMMM yyyy')}
             </h3>
             <div className="flex gap-2">
               <button onClick={() => navigateMonth(-1)} className="px-3 py-2 border border-stone-200 hover:bg-stone-50 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
               <button onClick={() => navigateMonth(1)} className="px-3 py-2 border border-stone-200 hover:bg-stone-50 transition-colors"><ChevronRight className="w-4 h-4" /></button>
-              <button onClick={() => { setCurrentMonth(new Date()); setSelectedDate(new Date()); }} className="px-4 py-2 text-[10px] tracking-widest uppercase border border-stone-200 hover:bg-stone-50 transition-colors">Today</button>
+              <button onClick={() => { setCurrentMonth(new Date()); setSelectedDate(new Date()); }} className="px-4 py-2 text-micro tracking-widest uppercase border border-stone-200 hover:bg-stone-50 transition-colors">Today</button>
             </div>
           </div>
           
           <div className="grid grid-cols-7 border-b border-stone-100 bg-stone-50">
             {dayLabels.map(label => (
-              <div key={label} className="py-3 text-[10px] font-bold text-stone-400 uppercase tracking-widest text-center border-r border-stone-100 last:border-r-0">
+              <div key={label} className="py-3 text-micro font-bold text-stone-600 uppercase tracking-widest text-center border-r border-stone-100 last:border-r-0">
                 {label}
               </div>
             ))}
           </div>
 
           <div className="grid grid-cols-7 gap-px bg-stone-100">
             {days.map((day, i) => {
               const reservations = mockReservations.filter(res => isSameDay(res.date, day));
               const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
               const isCurrentMonth = isSameMonth(day, monthStart);
@@ -67,87 +67,87 @@ export default function AdminCalendar() {
                 <button
                   key={i}
                   onClick={() => setSelectedDate(day)}
                   className={cn(
                     "min-h-[120px] bg-ivory p-2 transition-all cursor-pointer w-full text-left group",
                     isSelected ? "ring-2 ring-inset ring-gold z-10" : "hover:bg-ivory",
                     !isCurrentMonth && "opacity-30"
                   )}
                 >
                   <span className={cn(
-                    "text-[10px] font-bold px-2 py-1",
-                    isSelected ? "bg-gold text-white" : "text-stone-400 group-hover:text-stone-800"
+                    "text-micro font-bold px-2 py-1",
+                    isSelected ? "bg-gold text-white" : "text-stone-600 group-hover:text-stone-800"
                   )}>
                     {format(day, 'd')}
                   </span>
                   
                   <div className="mt-2 space-y-1">
                     {reservations.map(res => (
-                      <div key={res.id} className="text-[8px] bg-gold/5 border border-gold/10 px-2 py-1 flex items-center justify-between">
+                      <div key={res.id} className="text-micro bg-gold/5 border border-gold/10 px-2 py-1 flex items-center justify-between">
                          <span className="font-bold text-stone-800 truncate">{res.customer}</span>
                          <span className={cn(
                            "px-1",
                            res.service === 'Rental' ? 'text-blue-600' : 'text-gold'
                          )}>ΓùÅ</span>
                       </div>
                     ))}
                   </div>
                 </button>
               );
             })}
           </div>
         </div>
 
         {/* Sidebar Details */}
         <div className="space-y-6">
           <div className="bg-ivory border border-stone-200 p-8">
             <h4 className="font-heading text-lg text-stone-800 uppercase tracking-widest mb-6">Day Agenda</h4>
-            <p className="text-[10px] tracking-widest text-stone-400 uppercase mb-8">{selectedDate ? format(selectedDate, 'EEEE, MMM d') : 'No date selected'}</p>
+            <p className="text-micro tracking-widest text-stone-600 uppercase mb-8">{selectedDate ? format(selectedDate, 'EEEE, MMM d') : 'No date selected'}</p>
             
             <div className="space-y-6">
               {selectionsForDay.length > 0 ? selectionsForDay.map(res => (
                 <div key={res.id} className="p-4 bg-ivory border-l-2 border-gold space-y-3">
-                  <div className="flex items-center gap-2 text-[10px] font-bold text-stone-800 uppercase tracking-widest">
+                  <div className="flex items-center gap-2 text-micro font-bold text-stone-800 uppercase tracking-widest">
                     <User className="w-3 h-3 text-gold" /> {res.customer}
                   </div>
-                  <div className="flex items-center gap-2 text-[9px] text-stone-500 uppercase tracking-widest">
+                  <div className="flex items-center gap-2 text-micro text-stone-600 uppercase tracking-widest">
                     <Clock className="w-3 h-3" /> 10:30 AM - {res.service}
                   </div>
-                  <div className="flex items-center gap-2 text-[9px] text-stone-500 uppercase tracking-widest">
+                  <div className="flex items-center gap-2 text-micro text-stone-600 uppercase tracking-widest">
                     <Package className="w-3 h-3" /> {res.item}
                   </div>
-                  <button onClick={() => setSelectedDate(null)} className="w-full mt-2 py-2 text-[8px] tracking-[0.2em] font-bold uppercase border border-gold/20 text-gold hover:bg-gold hover:text-white transition-all">
+                  <button onClick={() => setSelectedDate(null)} className="w-full mt-2 py-2 text-micro tracking-[0.2em] font-bold uppercase border border-gold/20 text-gold hover:bg-gold hover:text-white transition-all">
                     View Dossier
                   </button>
                 </div>
               )) : (
                 <div className="py-20 text-center">
-                  <p className="text-[10px] text-stone-400 uppercase tracking-widest italic">No bookings on this date</p>
+                  <p className="text-micro text-stone-600 uppercase tracking-widest italic">No bookings on this date</p>
                 </div>
               )}
             </div>
             
             <button onClick={() => navigate('/appointment')} className="w-full mt-8 btn-luxury flex items-center justify-center gap-2">
                <CalendarIcon className="w-4 h-4" /> New Booking
             </button>
           </div>
 
           <div className="bg-stone-900 p-8 text-white">
-            <h4 className="text-[10px] tracking-widest uppercase text-gold mb-4">Capacity Insight</h4>
+            <h4 className="text-micro tracking-widest uppercase text-gold mb-4">Capacity Insight</h4>
             <div className="space-y-4">
               <div>
-                <div className="flex justify-between text-[8px] uppercase tracking-widest mb-2 font-bold">
+                <div className="flex justify-between text-micro uppercase tracking-widest mb-2 font-bold">
                   <span>Atelier Slots</span>
                   <span>80%</span>
                 </div>
                 <div className="h-1 bg-stone-800 overflow-hidden">
                   <div className="h-full bg-gold w-4/5" />
                 </div>
               </div>
-              <p className="text-[9px] text-stone-400 leading-relaxed italic">The Sharjah boutique is nearing capacity for bridal consultations in April.</p>
+              <p className="text-micro text-stone-400 leading-relaxed italic">The Sharjah boutique is nearing capacity for bridal consultations in April.</p>
             </div>
           </div>
         </div>
       </div>
     </div>
   );
 }
diff --git a/src/pages/admin/AdminContent.tsx b/src/pages/admin/AdminContent.tsx
index c57b29d..7edd8df 100644
--- a/src/pages/admin/AdminContent.tsx
+++ b/src/pages/admin/AdminContent.tsx
@@ -44,43 +44,43 @@ export default function AdminContent() {
     } finally {
       setIsSaving(false);
     }
   };
 
   return (
     <div className="space-y-8 animate-fade-in h-[calc(100vh-9rem)] flex flex-col">
       <div className="flex justify-between items-center bg-ivory p-8 border border-stone-200 shrink-0">
         <div>
           <h2 className="font-heading text-2xl text-stone-800 tracking-wide uppercase">Artisan CMS</h2>
-          <p className="text-[10px] tracking-[0.3em] text-stone-400 uppercase mt-1">Curation & Creative Control</p>
+          <p className="text-micro tracking-[0.3em] text-stone-600 uppercase mt-1">Curation & Creative Control</p>
         </div>
         <div className="flex items-center gap-4">
           <AnimatePresence>
             {showSuccess && (
               <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 20 }}
                 className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 border border-green-100"
               >
                 <CheckCircle2 className="w-4 h-4" />
-                <span className="text-[10px] uppercase tracking-widest font-bold">Changes Published</span>
+                <span className="text-micro uppercase tracking-widest font-bold">Changes Published</span>
               </motion.div>
             )}
             {saveError && (
               <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 20 }}
                 className="flex items-center gap-2 text-rose-600 bg-rose-50 px-4 py-2 border border-rose-100"
               >
-                <span className="text-[10px] uppercase tracking-widest font-bold">{saveError}</span>
+                <span className="text-micro uppercase tracking-widest font-bold">{saveError}</span>
               </motion.div>
             )}
           </AnimatePresence>
           <button 
             onClick={handleSave}
             disabled={isSaving}
             className="btn-luxury flex items-center gap-2 disabled:opacity-50"
           >
             {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
             {isSaving ? 'Publishing...' : 'Save & Publish'}
@@ -154,76 +154,76 @@ interface CMSNavLinkProps {
   active: boolean;
   onClick: () => void;
   icon: React.ComponentType<{ className?: string }>;
 }
 
 function CMSNavLink({ label, active, onClick, icon: Icon }: CMSNavLinkProps) {
   return (
     <button 
       onClick={onClick}
       className={cn(
-        "w-full flex items-center justify-between px-4 py-3 text-[10px] tracking-widest uppercase transition-all group",
-        active ? "bg-stone-900 text-white font-bold" : "text-stone-400 hover:text-stone-800 hover:bg-stone-50"
+        "w-full flex items-center justify-between px-4 py-3 text-micro tracking-widest uppercase transition-all group",
+        active ? "bg-stone-900 text-white font-bold" : "text-stone-600 hover:text-stone-800 hover:bg-stone-50"
       )}
     >
       <div className="flex items-center gap-3">
         <Icon className="w-3 h-3" />
         {label}
       </div>
       <ChevronRight className={cn("w-3 h-3 transition-transform", active ? "translate-x-0" : "-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0")} />
     </button>
   );
 }
 
 interface EditorHeaderProps {
   title: string;
   subtitle: string;
 }
 
 function EditorHeader({ title, subtitle }: EditorHeaderProps) {
   return (
     <div className="border-b border-stone-100 pb-4">
       <h4 className="font-heading text-lg text-stone-800 tracking-wide uppercase">{title}</h4>
-      <p className="text-[10px] text-stone-400 uppercase tracking-[0.2em] italic mt-1">{subtitle}</p>
+      <p className="text-micro text-stone-600 uppercase tracking-[0.2em] italic mt-1">{subtitle}</p>
     </div>
   );
 }
 
 interface CMSInputProps {
   label: string;
   name: string;
   defaultValue: string;
 }
 
 function CMSInput({ label, name, defaultValue }: CMSInputProps) {
   return (
     <div className="space-y-2">
-      <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">{label}</label>
+      <label className="text-micro font-black text-stone-600 uppercase tracking-widest">{label}</label>
       <input 
         type="text" 
         name={name}
         defaultValue={defaultValue}
         className="w-full bg-stone-50 border border-stone-100 p-4 text-xs tracking-widest outline-none focus:border-gold transition-colors font-medium text-stone-800"
       />
     </div>
   );
 }
 
 interface CMSTextareaProps {
   label: string;
   name: string;
   defaultValue: string;
 }
 
 function CMSTextarea({ label, name, defaultValue }: CMSTextareaProps) {
   return (
     <div className="space-y-2">
-      <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">{label}</label>
+      <label className="text-micro font-black text-stone-600 uppercase tracking-widest">{label}</label>
       <textarea 
         name={name}
         defaultValue={defaultValue}
         rows={6}
         className="w-full bg-stone-50 border border-stone-100 p-4 text-xs tracking-widest leading-relaxed outline-none focus:border-gold transition-colors font-medium text-stone-800 resize-none shadow-inner"
       />
     </div>
   );
 }
diff --git a/src/pages/admin/AdminDashboard.tsx b/src/pages/admin/AdminDashboard.tsx
index 82416f3..5c30a07 100644
--- a/src/pages/admin/AdminDashboard.tsx
+++ b/src/pages/admin/AdminDashboard.tsx
@@ -91,59 +91,59 @@ export default function AdminDashboard() {
     } finally {
       setIsLoading(false);
     }
   };
 
   if (!isSupabaseConfigured) {
     return (
       <div className="flex flex-col items-center justify-center h-[60vh] text-center">
         <ShoppingCart className="w-12 h-12 text-stone-300 mb-4" />
         <h3 className="font-heading text-xl text-stone-800 uppercase tracking-widest mb-2">Dashboard Requires Backend</h3>
-        <p className="text-sm text-stone-400">Connect Supabase to see real analytics.</p>
+        <p className="text-sm text-stone-600">Connect Supabase to see real analytics.</p>
       </div>
     );
   }
 
   if (isLoading) {
     return (
       <div className="flex items-center justify-center h-[60vh]">
         <Loader2 className="w-8 h-8 text-gold animate-spin" />
       </div>
     );
   }
 
   if (error) {
     return (
       <div className="flex flex-col items-center justify-center h-[60vh] text-center">
         <p className="text-rose-500 text-sm mb-4">{error}</p>
-        <button onClick={loadDashboard} className="btn-luxury text-[10px]">Retry</button>
+        <button onClick={loadDashboard} className="btn-luxury text-micro">Retry</button>
       </div>
     );
   }
 
   const s = stats!;
 
   return (
     <div className="space-y-8 animate-fade-in">
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatCard title="Total Revenue" value={`AED ${s.totalRevenue.toLocaleString()}`} icon={TrendingUp} />
         <StatCard title="Active Rentals" value={`${s.activeRentals} Pieces`} icon={ShoppingCart} />
         <StatCard title="New Clients (30d)" value={String(s.newClients)} icon={Users} />
         <StatCard title="Total Orders" value={String(s.totalOrders)} icon={Calendar} />
       </div>
 
       <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
         <div className="xl:col-span-2 bg-ivory p-8 border border-stone-200">
           <div className="flex justify-between items-center mb-10">
             <div>
               <h3 className="font-heading text-xl text-stone-800 tracking-wide uppercase">Performance Overview</h3>
-              <p className="text-[10px] tracking-widest text-stone-400 uppercase mt-1">Monthly Revenue (Paid Orders)</p>
+              <p className="text-micro tracking-widest text-stone-600 uppercase mt-1">Monthly Revenue (Paid Orders)</p>
             </div>
           </div>
           <div className="h-[350px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={s.monthlyRevenue}>
                 <defs>
                   <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#8B7355" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#8B7355" stopOpacity={0}/>
                   </linearGradient>
@@ -172,53 +172,53 @@ export default function AdminDashboard() {
                   ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
           <div className="space-y-4">
             {s.categoryBreakdown.map((cat) => (
               <div key={cat.name} className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-3 h-3" style={{ backgroundColor: cat.color }} />
-                  <span className="text-[10px] tracking-widest text-stone-600 uppercase font-bold">{cat.name}</span>
+                  <span className="text-micro tracking-widest text-stone-600 uppercase font-bold">{cat.name}</span>
                 </div>
                 <span className="text-xs text-stone-800">{cat.value}%</span>
               </div>
             ))}
           </div>
         </div>
       </div>
 
       <div className="bg-ivory border border-stone-200 overflow-hidden shadow-sm">
         <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
           <div>
             <h3 className="font-heading text-xl text-stone-800 tracking-wide uppercase">Recent Orders</h3>
-            <p className="text-[10px] tracking-widest text-stone-400 uppercase mt-1">Latest order activity</p>
+            <p className="text-micro tracking-widest text-stone-600 uppercase mt-1">Latest order activity</p>
           </div>
-          <Link to="/admin/orders" className="group flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-gold hover:text-stone-800 transition-colors">
+          <Link to="/admin/orders" className="group flex items-center gap-2 text-micro tracking-[0.2em] uppercase text-gold hover:text-stone-800 transition-colors">
             Manage All Orders <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
           </Link>
         </div>
         <div className="overflow-x-auto">
           {s.recentOrders.length === 0 ? (
             <div className="p-12 text-center">
-              <p className="text-stone-400 text-sm">No orders yet.</p>
+              <p className="text-stone-600 text-sm">No orders yet.</p>
             </div>
           ) : (
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-ivory border-b border-stone-100">
-                  <th className="px-8 py-5 text-[10px] tracking-widest text-stone-400 uppercase font-bold">Client</th>
-                  <th className="px-8 py-5 text-[10px] tracking-widest text-stone-400 uppercase font-bold">Items</th>
-                  <th className="px-8 py-5 text-[10px] tracking-widest text-stone-400 uppercase font-bold">Type</th>
-                  <th className="px-8 py-5 text-[10px] tracking-widest text-stone-400 uppercase font-bold">Amount</th>
-                  <th className="px-8 py-5 text-[10px] tracking-widest text-stone-400 uppercase font-bold text-center">Status</th>
+                  <th className="px-8 py-5 text-micro tracking-widest text-stone-600 uppercase font-bold">Client</th>
+                  <th className="px-8 py-5 text-micro tracking-widest text-stone-600 uppercase font-bold">Items</th>
+                  <th className="px-8 py-5 text-micro tracking-widest text-stone-600 uppercase font-bold">Type</th>
+                  <th className="px-8 py-5 text-micro tracking-widest text-stone-600 uppercase font-bold">Amount</th>
+                  <th className="px-8 py-5 text-micro tracking-widest text-stone-600 uppercase font-bold text-center">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-stone-100">
                 {s.recentOrders.map((order) => (
                   <OrderRow key={order.id} order={order} />
                 ))}
               </tbody>
             </table>
           )}
         </div>
@@ -228,21 +228,21 @@ export default function AdminDashboard() {
 }
 
 function StatCard({ title, value, icon: Icon }: { title: string; value: string; icon: React.ComponentType<{ className?: string }> }) {
   return (
     <div className="bg-ivory p-6 border border-stone-200 group hover:border-gold transition-all duration-300">
       <div className="flex justify-between items-start mb-4">
         <div className="p-3 bg-ivory text-gold group-hover:bg-gold group-hover:text-white transition-all duration-500">
           <Icon className="w-5 h-5" />
         </div>
       </div>
-      <p className="text-[10px] tracking-widest text-stone-400 uppercase mb-1">{title}</p>
+      <p className="text-micro tracking-widest text-stone-600 uppercase mb-1">{title}</p>
       <h4 className="text-xl font-heading text-stone-800 tracking-wide">{value}</h4>
     </div>
   );
 }
 
 function OrderRow({ order }: { key?: React.Key; order: Order }) {
   const statusColors: Record<string, string> = {
     completed: 'bg-green-50 text-green-600',
     confirmed: 'bg-green-50 text-green-600',
     processing: 'bg-blue-50 text-blue-600',
@@ -251,30 +251,30 @@ function OrderRow({ order }: { key?: React.Key; order: Order }) {
     cancelled: 'bg-rose-50 text-rose-600',
   };
 
   const itemNames = order.items?.map(i => i.product_name).join(', ') || 'ΓÇö';
   const shortDate = order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
 
   return (
     <tr className="hover:bg-stone-50 transition-colors">
       <td className="px-8 py-5">
         <p className="text-xs font-bold text-stone-800">{order.customer_name || 'Guest'}</p>
-        <p className="text-[8px] text-stone-400 uppercase tracking-widest mt-1">{shortDate}</p>
+        <p className="text-micro text-stone-600 uppercase tracking-widest mt-1">{shortDate}</p>
       </td>
       <td className="px-8 py-5 text-stone-600 text-xs max-w-[200px] truncate">{itemNames}</td>
       <td className="px-8 py-5 translate-y-[2px]">
         <span className={cn(
-          "text-[8px] tracking-[0.2em] uppercase px-2 py-1 border",
-          order.type === 'sale' ? "border-gold text-gold" : "border-stone-300 text-stone-400"
+          "text-micro tracking-[0.2em] uppercase px-2 py-1 border",
+          order.type === 'sale' ? "border-gold text-gold" : "border-stone-300 text-stone-600"
         )}>
           {order.type}
         </span>
       </td>
       <td className="px-8 py-5 text-xs text-stone-800 font-medium">AED {(order.subtotal || 0).toLocaleString()}</td>
       <td className="px-8 py-5 text-center">
-        <span className={cn("inline-block text-[8px] tracking-widest uppercase px-3 py-1 font-bold", statusColors[order.status] || 'bg-stone-100 text-stone-600')}>
+        <span className={cn("inline-block text-micro tracking-widest uppercase px-3 py-1 font-bold", statusColors[order.status] || 'bg-stone-100 text-stone-600')}>
           {order.status}
         </span>
       </td>
     </tr>
   );
 }
diff --git a/src/pages/admin/AdminGallery.tsx b/src/pages/admin/AdminGallery.tsx
index 5b1a077..32e384f 100644
--- a/src/pages/admin/AdminGallery.tsx
+++ b/src/pages/admin/AdminGallery.tsx
@@ -160,21 +160,21 @@ export default function AdminGallery() {
           type="file"
           accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
           onChange={handleUpload}
           className="hidden"
         />
       </div>
 
       <div className="bg-white border border-stone-200 overflow-hidden">
         <table className="w-full">
           <thead>
-            <tr className="border-b border-stone-200 text-[10px] tracking-widest uppercase text-stone-500">
+            <tr className="border-b border-stone-200 text-micro tracking-widest uppercase text-stone-600">
               <th className="text-left p-4 w-16"></th>
               <th className="text-left p-4">Media</th>
               <th className="text-left p-4">Title</th>
               <th className="text-left p-4">Category</th>
               <th className="text-left p-4">Type</th>
               <th className="text-left p-4">Order</th>
               <th className="text-left p-4">Featured</th>
               <th className="text-left p-4">Actions</th>
             </tr>
           </thead>
@@ -207,27 +207,27 @@ export default function AdminGallery() {
                     <select
                       value={editForm.category}
                       onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                       className="border border-stone-200 px-2 py-1 text-xs"
                     >
                       {CATEGORIES.map((c) => (
                         <option key={c.value} value={c.value}>{c.label}</option>
                       ))}
                     </select>
                   ) : (
-                    <span className="inline-block px-2 py-1 bg-stone-100 text-[10px] tracking-widest uppercase">
+                    <span className="inline-block px-2 py-1 bg-stone-100 text-micro tracking-widest uppercase">
                       {item.category.replace('_', ' ')}
                     </span>
                   )}
                 </td>
                 <td className="p-4">
-                  <span className="text-[10px] tracking-widest uppercase">{item.media_type}</span>
+                  <span className="text-micro tracking-widest uppercase">{item.media_type}</span>
                 </td>
                 <td className="p-4">
                   {editingId === item.id ? (
                     <input
                       type="number"
                       value={editForm.sort_order}
                       onChange={(e) => setEditForm({ ...editForm, sort_order: parseInt(e.target.value) || 0 })}
                       className="border border-stone-200 px-2 py-1 text-xs w-16"
                     />
                   ) : (
@@ -237,21 +237,21 @@ export default function AdminGallery() {
                 <td className="p-4">
                   <button onClick={() => handleToggleFeatured(item)} className="text-gold hover:text-gold/70 transition-colors">
                     {item.is_featured ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                   </button>
                 </td>
                 <td className="p-4">
                   <div className="flex items-center gap-2">
                     {editingId === item.id ? (
                       <>
                         <button onClick={handleSave} className="text-xs text-gold hover:text-gold/70 font-bold">Save</button>
-                        <button onClick={() => setEditingId(null)} className="text-xs text-stone-400 hover:text-stone-600">Cancel</button>
+                        <button onClick={() => setEditingId(null)} className="text-xs text-stone-600 hover:text-stone-800">Cancel</button>
                       </>
                     ) : (
                       <>
                         <button onClick={() => handleEdit(item)} className="text-stone-400 hover:text-gold transition-colors">
                           <Edit2 className="w-4 h-4" />
                         </button>
                         <button onClick={() => setDeleteConfirm(item.id)} className="text-stone-400 hover:text-rose-500 transition-colors">
                           <Trash2 className="w-4 h-4" />
                         </button>
                       </>
@@ -274,21 +274,21 @@ export default function AdminGallery() {
             onClick={() => setDeleteConfirm(null)}
           >
             <motion.div
               initial={{ scale: 0.95 }}
               animate={{ scale: 1 }}
               exit={{ scale: 0.95 }}
               className="bg-white p-8 max-w-sm w-full"
               onClick={(e) => e.stopPropagation()}
             >
               <h3 className="font-heading text-lg tracking-widest uppercase mb-4">Delete Item?</h3>
-              <p className="text-stone-500 text-sm mb-6">This action cannot be undone.</p>
+              <p className="text-stone-600 text-sm mb-6">This action cannot be undone.</p>
               <div className="flex gap-4">
                 <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2 border border-stone-200 text-xs tracking-widest uppercase hover:border-gold">
                   Cancel
                 </button>
                 <button onClick={() => deleteConfirm && handleDelete(deleteConfirm)} className="flex-1 px-4 py-2 bg-rose-500 text-white text-xs tracking-widest uppercase hover:bg-rose-600">
                   Delete
                 </button>
               </div>
             </motion.div>
           </motion.div>
diff --git a/src/pages/admin/AdminLayout.tsx b/src/pages/admin/AdminLayout.tsx
index 7b32028..7921eb8 100644
--- a/src/pages/admin/AdminLayout.tsx
+++ b/src/pages/admin/AdminLayout.tsx
@@ -19,21 +19,21 @@ function SidebarContent({ onNav }: { onNav: () => void }) {
   const location = useLocation();
   const { signOut } = useAuth();
   const navigate = useNavigate();
 
   return (
     <>
       <div className="p-6 border-b border-stone-800">
         <Link to="/" onClick={onNav} className="font-heading text-xl tracking-[0.2em] uppercase text-gold block">
           Riman Admin
         </Link>
-        <p className="text-[8px] tracking-[0.3em] text-stone-500 uppercase mt-2">Boutique Management</p>
+        <p className="text-micro tracking-[0.3em] text-stone-500 uppercase mt-2">Boutique Management</p>
       </div>
 
       <nav className="flex-grow py-6 px-4 space-y-1 overflow-y-auto">
         {adminNav.map((item) => {
           const isActive = location.pathname === item.path;
           const Icon = item.icon;
           return (
             <Link
               key={item.path}
               to={item.path}
@@ -111,31 +111,31 @@ export default function AdminLayout() {
               onClick={() => setDesktopSidebarOpen(prev => !prev)}
               className="hidden lg:flex p-2 text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
               aria-label={desktopSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("transition-transform duration-300", desktopSidebarOpen ? "" : "rotate-180")}>
                 <rect width="18" height="18" x="3" y="3" rx="2"/>
                 <path d="M9 3v18"/>
                 <path d="m14 9-3 3 3 3"/>
               </svg>
             </button>
-            <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-stone-400">
+            <div className="flex items-center gap-2 text-micro tracking-widest uppercase text-stone-600">
               <span className="hidden sm:inline">Admin</span>
               <ChevronRight className="w-3 h-3 hidden sm:inline" />
               <span className="text-stone-800 font-bold truncate max-w-[200px]">{adminNav.find(n => n.path === location.pathname)?.label || 'Overview'}</span>
             </div>
           </div>
 
           <div className="flex items-center gap-4 shrink-0">
             <div className="text-right hidden sm:block">
-              <p className="text-[10px] font-bold text-stone-800 uppercase tracking-wider">{user?.name || 'Admin'}</p>
-              <p className="text-[8px] text-stone-400 uppercase tracking-widest">{user?.role === 'admin' ? 'Administrator' : 'Manager'}</p>
+              <p className="text-micro font-bold text-stone-800 uppercase tracking-wider">{user?.name || 'Admin'}</p>
+              <p className="text-micro text-stone-600 uppercase tracking-widest">{user?.role === 'admin' ? 'Administrator' : 'Manager'}</p>
             </div>
             <div className="w-10 h-10 bg-ivory border border-stone-200 flex items-center justify-center text-gold font-heading font-bold text-sm">
               {(user?.name || 'R')[0].toUpperCase()}
             </div>
           </div>
         </header>
 
         <div className="flex-1 p-4 md:p-8">
           <Outlet />
         </div>
diff --git a/src/pages/admin/AdminOrders.tsx b/src/pages/admin/AdminOrders.tsx
index 22c7015..263a236 100644
--- a/src/pages/admin/AdminOrders.tsx
+++ b/src/pages/admin/AdminOrders.tsx
@@ -103,32 +103,32 @@ export default function AdminOrders() {
       o.customer_email?.toLowerCase().includes(search.toLowerCase()) ||
       o.id?.toLowerCase().includes(search.toLowerCase());
     const matchStatus = statusFilter === 'all' || o.status === statusFilter;
     return matchSearch && matchStatus;
   });
 
   if (!isSupabaseConfigured) {
     return (
       <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-ivory border border-stone-200">
         <ShoppingCart className="w-12 h-12 text-stone-300 mb-4" />
-        <h2 className="font-heading text-xl text-stone-400 tracking-widest uppercase mb-2">Orders Require Backend</h2>
-        <p className="text-[10px] tracking-[0.3em] text-stone-400 uppercase italic">Configure Supabase to manage orders</p>
+        <h2 className="font-heading text-xl text-stone-600 tracking-widest uppercase mb-2">Orders Require Backend</h2>
+        <p className="text-micro tracking-[0.3em] text-stone-600 uppercase italic">Configure Supabase to manage orders</p>
       </div>
     );
   }
 
   return (
     <div className="space-y-8 animate-fade-in">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-ivory p-8 border border-stone-200">
         <div>
           <h2 className="font-heading text-2xl text-stone-800 tracking-wide uppercase">Order Management</h2>
-          <p className="text-[10px] tracking-[0.3em] text-stone-400 uppercase mt-1">Track & fulfill customer investments</p>
+          <p className="text-micro tracking-[0.3em] text-stone-600 uppercase mt-1">Track & fulfill customer investments</p>
         </div>
         <button onClick={loadOrders} className="btn-luxury-outline flex items-center gap-2 text-xs">
           <RefreshCw className="w-3 h-3" /> Refresh
         </button>
       </div>
 
       <div className="bg-ivory border border-stone-200 overflow-hidden">
         <div className="p-6 border-b border-stone-100 flex flex-col sm:flex-row items-start sm:items-center gap-4">
           <div className="relative flex-grow max-w-md w-full">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
@@ -139,94 +139,94 @@ export default function AdminOrders() {
               onChange={e => setSearch(e.target.value)}
               className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-100 text-xs tracking-widest outline-none focus:border-gold transition-colors"
             />
           </div>
           <div className="flex gap-2 flex-wrap">
             {['all', ...STATUS_OPTIONS].map(s => (
               <button
                 key={s}
                 onClick={() => setStatusFilter(s)}
                 className={cn(
-                  "text-[9px] tracking-widest uppercase px-3 py-1.5 border transition-colors",
-                  statusFilter === s ? "bg-stone-800 text-white border-stone-800" : "text-stone-400 border-stone-200 hover:border-stone-400"
+                  "text-micro tracking-widest uppercase px-3 py-1.5 border transition-colors",
+                  statusFilter === s ? "bg-stone-800 text-white border-stone-800" : "text-stone-600 border-stone-200 hover:border-stone-400"
                 )}
               >
                 {s === 'all' ? 'All' : s}
               </button>
             ))}
           </div>
         </div>
 
         {isLoading ? (
           <div className="p-12 text-center">
             <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
-            <p className="text-[10px] tracking-widest text-stone-400 uppercase">Loading orders...</p>
+            <p className="text-micro tracking-widest text-stone-600 uppercase">Loading orders...</p>
           </div>
         ) : error ? (
           <div className="p-12 text-center">
             <p className="text-rose-500 text-xs tracking-widest uppercase mb-4">{error}</p>
             <button onClick={loadOrders} className="btn-luxury-outline text-xs">Retry</button>
           </div>
         ) : filteredOrders.length === 0 ? (
           <div className="p-12 text-center">
             <ShoppingCart className="w-10 h-10 text-stone-200 mx-auto mb-4" />
-            <p className="text-[10px] tracking-widest text-stone-400 uppercase">No orders found</p>
+            <p className="text-micro tracking-widest text-stone-600 uppercase">No orders found</p>
           </div>
         ) : (
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-stone-50/50 border-b border-stone-100">
-                  <th className="px-6 py-4 text-[9px] tracking-widest text-stone-400 uppercase font-bold">Order ID</th>
-                  <th className="px-6 py-4 text-[9px] tracking-widest text-stone-400 uppercase font-bold">Date</th>
-                  <th className="px-6 py-4 text-[9px] tracking-widest text-stone-400 uppercase font-bold">Customer</th>
-                  <th className="px-6 py-4 text-[9px] tracking-widest text-stone-400 uppercase font-bold">Type</th>
-                  <th className="px-6 py-4 text-[9px] tracking-widest text-stone-400 uppercase font-bold">Status</th>
-                  <th className="px-6 py-4 text-[9px] tracking-widest text-stone-400 uppercase font-bold">Total</th>
-                  <th className="px-6 py-4 text-[9px] tracking-widest text-stone-400 uppercase font-bold">Payment</th>
-                  <th className="px-6 py-4 text-[9px] tracking-widest text-stone-400 uppercase font-bold">Actions</th>
+                  <th className="px-6 py-4 text-micro tracking-widest text-stone-600 uppercase font-bold">Order ID</th>
+                  <th className="px-6 py-4 text-micro tracking-widest text-stone-600 uppercase font-bold">Date</th>
+                  <th className="px-6 py-4 text-micro tracking-widest text-stone-600 uppercase font-bold">Customer</th>
+                  <th className="px-6 py-4 text-micro tracking-widest text-stone-600 uppercase font-bold">Type</th>
+                  <th className="px-6 py-4 text-micro tracking-widest text-stone-600 uppercase font-bold">Status</th>
+                  <th className="px-6 py-4 text-micro tracking-widest text-stone-600 uppercase font-bold">Total</th>
+                  <th className="px-6 py-4 text-micro tracking-widest text-stone-600 uppercase font-bold">Payment</th>
+                  <th className="px-6 py-4 text-micro tracking-widest text-stone-600 uppercase font-bold">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-stone-100">
                 {filteredOrders.map(order => {
                   const StatusIcon = STATUS_ICONS[order.status] || Clock;
                   return (
                     <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                       <td className="px-6 py-4">
-                        <code className="text-[9px] text-stone-400 font-mono">{order.id?.slice(0, 8)}...</code>
+                        <code className="text-micro text-stone-600 font-mono">{order.id?.slice(0, 8)}...</code>
                       </td>
                       <td className="px-6 py-4">
-                        <span className="text-[10px] text-stone-600">{order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}</span>
+                        <span className="text-micro text-stone-600">{order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}</span>
                       </td>
                       <td className="px-6 py-4">
-                        <p className="text-[11px] font-bold text-stone-800">{order.customer_name || 'Unknown'}</p>
-                        <p className="text-[8px] text-stone-400">{order.customer_email}</p>
+                        <p className="text-micro font-bold text-stone-800">{order.customer_name || 'Unknown'}</p>
+                        <p className="text-micro text-stone-600">{order.customer_email}</p>
                       </td>
                       <td className="px-6 py-4">
-                        <span className="text-[9px] tracking-widest uppercase text-stone-500">{order.type}</span>
+                        <span className="text-micro tracking-widest uppercase text-stone-600">{order.type}</span>
                       </td>
                       <td className="px-6 py-4">
-                        <span className={cn("text-[9px] tracking-widest uppercase font-bold px-2 py-1 border flex items-center gap-1.5 w-fit", STATUS_COLORS[order.status])}>
+                        <span className={cn("text-micro tracking-widest uppercase font-bold px-2 py-1 border flex items-center gap-1.5 w-fit", STATUS_COLORS[order.status])}>
                           <StatusIcon className="w-2.5 h-2.5" />
                           {order.status}
                         </span>
                       </td>
                       <td className="px-6 py-4">
                         <span className="text-xs font-bold text-stone-800">{formatPrice(order.subtotal)}</span>
                       </td>
                       <td className="px-6 py-4">
                         <span className={cn(
-                          "text-[8px] tracking-widest uppercase font-bold px-2 py-1 border flex items-center gap-1 w-fit",
+                          "text-micro tracking-widest uppercase font-bold px-2 py-1 border flex items-center gap-1 w-fit",
                           order.payment_status === 'paid' ? 'text-emerald-600 border-emerald-200 bg-emerald-50' :
                           order.payment_status === 'processing' ? 'text-amber-600 border-amber-200 bg-amber-50' :
                           order.payment_status === 'failed' ? 'text-rose-600 border-rose-200 bg-rose-50' :
-                          'text-stone-400 border-stone-200 bg-stone-50'
+                          'text-stone-600 border-stone-200 bg-stone-50'
                         )}>
                           {order.payment_method === 'card' ? <CreditCard className="w-2 h-2" /> : <Building2 className="w-2 h-2" />}
                           {order.payment_status || 'ΓÇö'}
                         </span>
                       </td>
                       <td className="px-6 py-4">
                         <button
                           onClick={() => {
                             setSelectedOrder(order);
                             setAdminNotes(order.admin_notes || '');
@@ -261,141 +261,141 @@ export default function AdminOrders() {
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="bg-ivory w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-2xl border border-stone-200"
               role="dialog"
               aria-modal="true"
             >
               <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-stone-50/50 sticky top-0 z-10">
                 <div className="flex items-center gap-4">
                   <h3 className="font-heading text-xl text-stone-800 tracking-wide uppercase">Order Details</h3>
-                  <code className="text-[9px] text-stone-400 font-mono bg-stone-100 px-2 py-1">{selectedOrder.id}</code>
+                  <code className="text-micro text-stone-600 font-mono bg-stone-100 px-2 py-1">{selectedOrder.id}</code>
                 </div>
                 <button onClick={() => setSelectedOrder(null)} aria-label="Close" className="text-stone-400 hover:text-stone-800 transition-colors">
                   <X className="w-5 h-5" />
                 </button>
               </div>
 
               <div className="p-8 space-y-8">
                 {/* Customer Info */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
-                    <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Customer</h4>
+                    <h4 className="text-micro font-black text-stone-600 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Customer</h4>
                     <div className="space-y-2 text-xs">
-                      <p><span className="text-stone-400 uppercase text-[9px] tracking-widest block">Name</span><span className="font-bold text-stone-800">{selectedOrder.customer_name || '-'}</span></p>
-                      <p><span className="text-stone-400 uppercase text-[9px] tracking-widest block">Email</span><span className="text-stone-600">{selectedOrder.customer_email || '-'}</span></p>
-                      <p><span className="text-stone-400 uppercase text-[9px] tracking-widest block">Phone</span><span className="text-stone-600">{selectedOrder.customer_phone || '-'}</span></p>
+                      <p><span className="text-stone-600 uppercase text-micro tracking-widest block">Name</span><span className="font-bold text-stone-800">{selectedOrder.customer_name || '-'}</span></p>
+                      <p><span className="text-stone-600 uppercase text-micro tracking-widest block">Email</span><span className="text-stone-600">{selectedOrder.customer_email || '-'}</span></p>
+                      <p><span className="text-stone-600 uppercase text-micro tracking-widest block">Phone</span><span className="text-stone-600">{selectedOrder.customer_phone || '-'}</span></p>
                     </div>
                   </div>
                   <div className="space-y-4">
-                    <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Order Info</h4>
+                    <h4 className="text-micro font-black text-stone-600 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Order Info</h4>
                     <div className="space-y-2 text-xs">
-                      <p><span className="text-stone-400 uppercase text-[9px] tracking-widest block">Date</span><span className="text-stone-800 font-bold">{selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : '-'}</span></p>
-                      <p><span className="text-stone-400 uppercase text-[9px] tracking-widest block">Type</span><span className="text-[10px] tracking-widest uppercase text-stone-600 font-medium">{selectedOrder.type}</span></p>
-                      <p><span className="text-stone-400 uppercase text-[9px] tracking-widest block">Payment Method</span><span className="text-[10px] tracking-widest uppercase text-stone-600 font-medium flex items-center gap-1.5">{selectedOrder.payment_method === 'card' ? <><CreditCard className="w-3 h-3" /> Card</> : <><Building2 className="w-3 h-3" /> Atelier</>}</span></p>
-                      <p><span className="text-stone-400 uppercase text-[9px] tracking-widest block">Payment Status</span><span className={cn("text-[9px] tracking-widest uppercase font-bold", selectedOrder.payment_status === 'paid' ? 'text-emerald-600' : selectedOrder.payment_status === 'failed' ? 'text-rose-600' : 'text-stone-600')}>{selectedOrder.payment_status || 'pending'}</span></p>
-                      <p><span className="text-stone-400 uppercase text-[9px] tracking-widest block">Total</span><span className="text-gold font-heading font-bold">{formatPrice(selectedOrder.subtotal)}</span></p>
+                      <p><span className="text-stone-600 uppercase text-micro tracking-widest block">Date</span><span className="text-stone-800 font-bold">{selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : '-'}</span></p>
+                      <p><span className="text-stone-600 uppercase text-micro tracking-widest block">Type</span><span className="text-micro tracking-widest uppercase text-stone-600 font-medium">{selectedOrder.type}</span></p>
+                      <p><span className="text-stone-600 uppercase text-micro tracking-widest block">Payment Method</span><span className="text-micro tracking-widest uppercase text-stone-600 font-medium flex items-center gap-1.5">{selectedOrder.payment_method === 'card' ? <><CreditCard className="w-3 h-3" /> Card</> : <><Building2 className="w-3 h-3" /> Atelier</>}</span></p>
+                      <p><span className="text-stone-600 uppercase text-micro tracking-widest block">Payment Status</span><span className={cn("text-micro tracking-widest uppercase font-bold", selectedOrder.payment_status === 'paid' ? 'text-emerald-600' : selectedOrder.payment_status === 'failed' ? 'text-rose-600' : 'text-stone-600')}>{selectedOrder.payment_status || 'pending'}</span></p>
+                      <p><span className="text-stone-600 uppercase text-micro tracking-widest block">Total</span><span className="text-gold font-heading font-bold">{formatPrice(selectedOrder.subtotal)}</span></p>
                     </div>
                   </div>
                 </div>
 
                 {/* Status & Notes */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
-                    <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Status</h4>
+                    <h4 className="text-micro font-black text-stone-600 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Status</h4>
                     <div className="flex flex-wrap gap-2">
                       {STATUS_OPTIONS.map(status => {
                         const Icon = STATUS_ICONS[status] || Clock;
                         const isActive = selectedOrder.status === status;
                         return (
                           <button
                             key={status}
                             onClick={() => handleStatusUpdate(selectedOrder.id!, status)}
                             disabled={updating === selectedOrder.id}
                             className={cn(
-                              "text-[9px] tracking-widest uppercase px-3 py-2 border flex items-center gap-1.5 transition-all",
+                              "text-micro tracking-widest uppercase px-3 py-2 border flex items-center gap-1.5 transition-all",
                               isActive
                                 ? "bg-stone-800 text-white border-stone-800"
-                                : "text-stone-400 border-stone-200 hover:border-stone-400 hover:text-stone-600",
+                                : "text-stone-600 border-stone-200 hover:border-stone-400 hover:text-stone-800",
                               updating === selectedOrder.id && "opacity-50 cursor-not-allowed"
                             )}
                           >
                             <Icon className="w-2.5 h-2.5" />
                             {status}
                           </button>
                         );
                       })}
                     </div>
                     {selectedOrder.notes && (
                       <div className="mt-4 p-4 bg-stone-50 border border-stone-100">
-                        <p className="text-[9px] tracking-widest uppercase text-stone-400 font-bold flex items-center gap-1.5 mb-2">
+                        <p className="text-micro tracking-widest uppercase text-stone-600 font-bold flex items-center gap-1.5 mb-2">
                           <MessageSquare className="w-3 h-3" /> Customer Notes
                         </p>
                         <p className="text-xs text-stone-600 italic">{selectedOrder.notes}</p>
                       </div>
                     )}
                   </div>
                   <div className="space-y-4">
-                    <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Admin Notes</h4>
+                    <h4 className="text-micro font-black text-stone-600 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Admin Notes</h4>
                     <textarea
                       value={adminNotes}
                       onChange={e => setAdminNotes(e.target.value)}
                       rows={4}
                       className="w-full bg-stone-50 border border-stone-100 p-4 text-xs tracking-widest outline-none focus:border-gold transition-all resize-none"
                       placeholder="Internal notes about this order..."
                     />
                     <button
                       onClick={() => handleSaveNotes(selectedOrder.id!)}
                       disabled={updating === selectedOrder.id || !adminNotes.trim()}
                       className="btn-luxury text-xs flex items-center gap-2 disabled:opacity-50"
                     >
                       <Save className="w-3 h-3" /> Save Notes
                     </button>
                   </div>
                 </div>
 
                 {/* Items */}
                 <div className="space-y-4">
-                  <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Items ({selectedOrder.items?.length || 0})</h4>
+                  <h4 className="text-micro font-black text-stone-600 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Items ({selectedOrder.items?.length || 0})</h4>
                   <div className="overflow-x-auto">
                     <table className="w-full text-left">
                       <thead>
                         <tr className="bg-stone-50/50 border-b border-stone-100">
-                          <th className="px-4 py-3 text-[8px] tracking-widest text-stone-400 uppercase font-bold">Product</th>
-                          <th className="px-4 py-3 text-[8px] tracking-widest text-stone-400 uppercase font-bold">Type</th>
-                          <th className="px-4 py-3 text-[8px] tracking-widest text-stone-400 uppercase font-bold">Size</th>
-                          <th className="px-4 py-3 text-[8px] tracking-widest text-stone-400 uppercase font-bold">Qty</th>
-                          <th className="px-4 py-3 text-[8px] tracking-widest text-stone-400 uppercase font-bold">Price</th>
-                          <th className="px-4 py-3 text-[8px] tracking-widest text-stone-400 uppercase font-bold">Rental Dates</th>
+                          <th className="px-4 py-3 text-micro tracking-widest text-stone-600 uppercase font-bold">Product</th>
+                          <th className="px-4 py-3 text-micro tracking-widest text-stone-600 uppercase font-bold">Type</th>
+                          <th className="px-4 py-3 text-micro tracking-widest text-stone-600 uppercase font-bold">Size</th>
+                          <th className="px-4 py-3 text-micro tracking-widest text-stone-600 uppercase font-bold">Qty</th>
+                          <th className="px-4 py-3 text-micro tracking-widest text-stone-600 uppercase font-bold">Price</th>
+                          <th className="px-4 py-3 text-micro tracking-widest text-stone-600 uppercase font-bold">Rental Dates</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-stone-100">
                         {selectedOrder.items?.map((item, i) => (
                           <tr key={item.id || i} className="hover:bg-stone-50/50">
                             <td className="px-4 py-3">
-                              <p className="text-[11px] font-bold text-stone-800">{item.product_name}</p>
-                              <code className="text-[8px] text-stone-400 font-mono">{item.product_id}</code>
+                              <p className="text-micro font-bold text-stone-800">{item.product_name}</p>
+                              <code className="text-micro text-stone-600 font-mono">{item.product_id}</code>
                             </td>
                             <td className="px-4 py-3">
-                              <span className="text-[9px] tracking-widest uppercase text-stone-500">{item.product_type}</span>
+                              <span className="text-micro tracking-widest uppercase text-stone-600">{item.product_type}</span>
                             </td>
                             <td className="px-4 py-3">
-                              <span className="text-[10px] text-stone-600">{item.size || '-'}</span>
+                              <span className="text-micro text-stone-600">{item.size || '-'}</span>
                             </td>
                             <td className="px-4 py-3">
-                              <span className="text-[10px] text-stone-600">{item.quantity}</span>
+                              <span className="text-micro text-stone-600">{item.quantity}</span>
                             </td>
                             <td className="px-4 py-3">
-                              <span className="text-[10px] font-bold text-stone-800">{formatPrice(item.unit_price)}</span>
+                              <span className="text-micro font-bold text-stone-800">{formatPrice(item.unit_price)}</span>
                             </td>
                             <td className="px-4 py-3">
-                              <span className="text-[9px] text-stone-500">
+                              <span className="text-micro text-stone-600">
                                 {item.rental_start_date ? `${item.rental_start_date} ΓåÆ ${item.rental_end_date}` : '-'}
                               </span>
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                 </div>
               </div>
diff --git a/src/pages/admin/AdminPlaceholder.tsx b/src/pages/admin/AdminPlaceholder.tsx
index 97dba82..8be6fa4 100644
--- a/src/pages/admin/AdminPlaceholder.tsx
+++ b/src/pages/admin/AdminPlaceholder.tsx
@@ -1,8 +1,8 @@
 export default function AdminPlaceholder({ title }: { title: string }) {
   return (
     <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-ivory border border-dashed border-stone-200">
-      <h2 className="font-heading text-2xl text-stone-300 tracking-widest uppercase mb-4">{title}</h2>
-      <p className="text-[10px] tracking-[0.3em] text-stone-400 uppercase italic">Management Interface Under Development</p>
+      <h2 className="font-heading text-2xl text-stone-500 tracking-widest uppercase mb-4">{title}</h2>
+      <p className="text-micro tracking-[0.3em] text-stone-600 uppercase italic">Management Interface Under Development</p>
     </div>
   );
 }
diff --git a/src/pages/admin/AdminProducts.tsx b/src/pages/admin/AdminProducts.tsx
index 5527b61..c9408c2 100644
--- a/src/pages/admin/AdminProducts.tsx
+++ b/src/pages/admin/AdminProducts.tsx
@@ -65,21 +65,21 @@ export default function AdminProducts() {
   const filteredProducts = products.filter(p => 
     p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     p.category.toLowerCase().includes(searchTerm.toLowerCase())
   );
 
   return (
     <div className="space-y-8 animate-fade-in">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-ivory p-8 border border-stone-200">
         <div>
           <h2 className="font-heading text-2xl text-stone-800 tracking-wide uppercase">Collection Inventory</h2>
-          <p className="text-[10px] tracking-[0.3em] text-stone-400 uppercase mt-1">Manage physical & digital assets</p>
+          <p className="text-micro tracking-[0.3em] text-stone-600 uppercase mt-1">Manage physical & digital assets</p>
         </div>
         <button 
           onClick={() => {
             setEditingProduct(null);
             setProductImages([]);
             setIsFormOpen(true);
           }}
           className="btn-luxury flex items-center gap-2"
         >
           <Plus className="w-4 h-4" /> Add New Design
@@ -97,56 +97,56 @@ export default function AdminProducts() {
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-100 text-xs tracking-widest outline-none focus:border-gold transition-colors"
             />
           </div>
         </div>
 
         <div className="overflow-x-auto">
           <table className="w-full text-left">
             <thead>
               <tr className="bg-stone-50/50 border-b border-stone-100">
-                <th className="px-8 py-4 text-[10px] tracking-widest text-stone-400 uppercase font-bold">Image</th>
-                <th className="px-8 py-4 text-[10px] tracking-widest text-stone-400 uppercase font-bold">Design Details</th>
-                <th className="px-8 py-4 text-[10px] tracking-widest text-stone-400 uppercase font-bold">Category</th>
-                <th className="px-8 py-4 text-[10px] tracking-widest text-stone-400 uppercase font-bold">Tags</th>
-                <th className="px-8 py-4 text-[10px] tracking-widest text-stone-400 uppercase font-bold">Sale/Rent</th>
-                <th className="px-8 py-4 text-[10px] tracking-widest text-stone-400 uppercase font-bold">Management</th>
+                <th className="px-8 py-4 text-micro tracking-widest text-stone-600 uppercase font-bold">Image</th>
+                <th className="px-8 py-4 text-micro tracking-widest text-stone-600 uppercase font-bold">Design Details</th>
+                <th className="px-8 py-4 text-micro tracking-widest text-stone-600 uppercase font-bold">Category</th>
+                <th className="px-8 py-4 text-micro tracking-widest text-stone-600 uppercase font-bold">Tags</th>
+                <th className="px-8 py-4 text-micro tracking-widest text-stone-600 uppercase font-bold">Sale/Rent</th>
+                <th className="px-8 py-4 text-micro tracking-widest text-stone-600 uppercase font-bold">Management</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-stone-100">
               {filteredProducts.map((p) => (
                 <tr key={p.id} className="hover:bg-stone-50/50 transition-colors">
                   <td className="px-8 py-4">
                     <div className="w-16 h-20 bg-stone-100 overflow-hidden border border-stone-200">
                       <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                     </div>
                   </td>
                   <td className="px-8 py-4">
                     <p className="text-xs font-bold text-stone-800 uppercase tracking-widest">{p.name}</p>
-                    <p className="text-[9px] text-stone-400 mt-1 italic">{p.fabric}</p>
+                    <p className="text-micro text-stone-600 mt-1 italic">{p.fabric}</p>
                   </td>
                   <td className="px-8 py-4">
-                    <span className="text-[10px] tracking-widest uppercase text-stone-500 font-medium">{p.category}</span>
+                    <span className="text-micro tracking-widest uppercase text-stone-600 font-medium">{p.category}</span>
                   </td>
                   <td className="px-8 py-4">
                     <div className="flex flex-wrap gap-1">
                       {p.tags?.map(tag => (
-                        <span key={tag} className="text-[8px] bg-stone-100 text-stone-500 px-1.5 py-0.5 tracking-tighter uppercase">
+                        <span key={tag} className="text-micro bg-stone-100 text-stone-600 px-1.5 py-0.5 tracking-tighter uppercase">
                           {tag}
                         </span>
-                      )) || <span className="text-[8px] text-stone-300 italic">No tags</span>}
+                      )) || <span className="text-micro text-stone-500 italic">No tags</span>}
                     </div>
                   </td>
                   <td className="px-8 py-4">
                     <div className="space-y-1">
-                      {p.salePrice && <p className="text-[10px] font-bold text-stone-800">{formatPrice(p.salePrice)}</p>}
-                      {p.rentalPrice && <p className="text-[10px] text-gold uppercase tracking-widest">Rent: {formatPrice(p.rentalPrice)}</p>}
+                      {p.salePrice && <p className="text-micro font-bold text-stone-800">{formatPrice(p.salePrice)}</p>}
+                      {p.rentalPrice && <p className="text-micro text-gold uppercase tracking-widest">Rent: {formatPrice(p.rentalPrice)}</p>}
                     </div>
                   </td>
                   <td className="px-8 py-4">
                     <div className="flex gap-2">
                       <button 
                         onClick={() => {
                           setEditingProduct(p);
                           setProductImages(p.images || []);
                           setIsFormOpen(true);
                         }}
@@ -196,101 +196,101 @@ export default function AdminProducts() {
                 </h3>
                 <button onClick={() => setIsFormOpen(false)} aria-label="Close" className="text-stone-400 hover:text-stone-800 transition-colors">
                   <X className="w-5 h-5" />
                 </button>
               </div>
 
               <form onSubmit={handleSave} className="flex-grow overflow-y-auto p-8 space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {/* Basic Info */}
                   <div className="space-y-6">
-                    <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Artistry Details</h4>
+                    <h4 className="text-micro font-black text-stone-600 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Artistry Details</h4>
                     <InputField label="Piece Name" name="name" defaultValue={editingProduct?.name} required />
                     <div className="flex flex-col gap-2">
-                      <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Description</label>
+                      <label className="text-micro uppercase tracking-widest text-stone-600 font-bold">Description</label>
                       <textarea 
                         name="description" 
                         defaultValue={editingProduct?.description}
                         required
-                        className="w-full bg-stone-50 border border-stone-100 p-4 text-[11px] tracking-widest outline-none focus:border-gold transition-colors resize-none h-32"
+                        className="w-full bg-stone-50 border border-stone-100 p-4 text-micro tracking-widest outline-none focus:border-gold transition-colors resize-none h-32"
                       />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                       <div className="flex flex-col gap-2">
-                        <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Category</label>
-                        <select name="category" defaultValue={editingProduct?.category || 'Bridal Gown'} required className="w-full bg-stone-50 border border-stone-100 p-4 text-[11px] tracking-widest outline-none focus:border-gold cursor-pointer">
+                        <label className="text-micro uppercase tracking-widest text-stone-600 font-bold">Category</label>
+                        <select name="category" defaultValue={editingProduct?.category || 'Bridal Gown'} required className="w-full bg-stone-50 border border-stone-100 p-4 text-micro tracking-widest outline-none focus:border-gold cursor-pointer">
                           <option value="Bridal Gown">Bridal Gown</option>
                           <option value="Evening Dress">Evening Dress</option>
                           <option value="Accessory">Accessory</option>
                           <option value="Fine Jewelry">Fine Jewelry</option>
                         </select>
                       </div>
                       <InputField label="Designer" name="designer" defaultValue={editingProduct?.designer || 'Riman Atelier'} />
                     </div>
                   </div>
 
                   {/* Pricing & Types */}
                   <div className="space-y-6">
-                    <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Investment & Types</h4>
+                    <h4 className="text-micro font-black text-stone-600 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Investment & Types</h4>
                     <div className="grid grid-cols-2 gap-4">
                       <InputField label="Sale Price (AED)" name="salePrice" type="number" defaultValue={editingProduct?.salePrice} />
                       <InputField label="Rental Price (AED)" name="rentalPrice" type="number" defaultValue={editingProduct?.rentalPrice} />
                     </div>
                     <InputField label="Refundable Deposit (AED)" name="securityDeposit" type="number" defaultValue={editingProduct?.securityDeposit} />
                     
                     <div className="flex flex-col gap-2">
-                      <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Service Type</label>
-                      <select name="productType" defaultValue={editingProduct?.productType || 'both'} className="w-full bg-stone-50 border border-stone-100 p-4 text-[11px] tracking-widest outline-none focus:border-gold cursor-pointer">
+                      <label className="text-micro uppercase tracking-widest text-stone-600 font-bold">Service Type</label>
+                      <select name="productType" defaultValue={editingProduct?.productType || 'both'} className="w-full bg-stone-50 border border-stone-100 p-4 text-micro tracking-widest outline-none focus:border-gold cursor-pointer">
                         <option value="both">Sale & Rental</option>
                         <option value="sale">Exclusive Sale</option>
                         <option value="rent">Boutique Rental</option>
                       </select>
                     </div>
 
                     <InputField label="Fabric Composition" name="fabric" defaultValue={editingProduct?.fabric} />
                   </div>
                 </div>
 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-6">
-                     <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Configuration</h4>
+                     <h4 className="text-micro font-black text-stone-600 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Configuration</h4>
                      <InputField label="Available Sizes (comma separated)" name="sizes" defaultValue={editingProduct?.sizes.join(', ') || 'XS, S, M, L, XL'} />
                      <InputField label="Style Tags (comma separated)" name="style" defaultValue={editingProduct?.style.join(', ') || 'Modern, Luxury'} />
                      <InputField label="Product Tags (comma separated)" name="tags" defaultValue={editingProduct?.tags?.join(', ') || ''} placeholder="e.g. Vintage, Hand-stitched, Cathedral" />
                   </div>
                   <div className="space-y-6">
-                     <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Flags</h4>
+                     <h4 className="text-micro font-black text-stone-600 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Flags</h4>
                      <div className="flex items-center gap-8 pt-4">
                         <Checkbox label="Featured Design" name="isFeatured" defaultChecked={editingProduct?.isFeatured} />
                         <Checkbox label="New Arrival" name="isNew" defaultChecked={editingProduct?.isNew} />
                      </div>
                   </div>
                 </div>
 
                 {/* Images */}
                 <div className="space-y-6">
-                  <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Images</h4>
+                  <h4 className="text-micro font-black text-stone-600 uppercase tracking-[0.3em] border-b border-stone-100 pb-2">Images</h4>
                   <div className="flex flex-wrap gap-3">
                     {productImages.map((url, i) => (
                       <div key={i} className="relative group w-20 h-24 bg-stone-100 border border-stone-200 overflow-hidden">
                         <img src={url} alt={`Product image ${i + 1}`} className="w-full h-full object-cover" />
                         <button
                           type="button"
                           onClick={() => setProductImages(prev => prev.filter((_, idx) => idx !== i))}
                           className="absolute top-0.5 right-0.5 w-5 h-5 bg-rose-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                           aria-label="Remove image"
                         >
                           <X className="w-3 h-3" />
                         </button>
                       </div>
                     ))}
-                    <div className="w-20 h-24 border-2 border-dashed border-stone-200 flex flex-col items-center justify-center text-stone-400 gap-1 cursor-pointer hover:border-gold/50 transition-colors relative" onClick={() => document.getElementById('product-image-upload')?.click()}>
+                    <div className="w-20 h-24 border-2 border-dashed border-stone-200 flex flex-col items-center justify-center text-stone-600 gap-1 cursor-pointer hover:border-gold/50 transition-colors relative" onClick={() => document.getElementById('product-image-upload')?.click()}>
                       <Plus className="w-4 h-4" />
                       <span className="text-[7px] tracking-widest uppercase">Upload</span>
                     </div>
                   </div>
                   <input
                     id="product-image-upload"
                     type="file"
                     accept="image/*"
                     className="hidden"
                     onChange={async (e) => {
@@ -307,50 +307,50 @@ export default function AdminProducts() {
                         e.target.value = '';
                       }
                     }}
                   />
                   <div className="flex gap-3">
                     <input
                       type="url"
                       value={imageUrlInput}
                       onChange={e => setImageUrlInput(e.target.value)}
                       placeholder="Paste image URL..."
-                      className="flex-1 bg-stone-50 border border-stone-100 p-3 text-[10px] tracking-widest outline-none focus:border-gold transition-colors"
+                      className="flex-1 bg-stone-50 border border-stone-100 p-3 text-micro tracking-widest outline-none focus:border-gold transition-colors"
                     />
                     <button
                       type="button"
                       onClick={() => {
                         if (imageUrlInput.trim()) {
                           setProductImages(prev => [...prev, imageUrlInput.trim()]);
                           setImageUrlInput('');
                         }
                       }}
                       disabled={!imageUrlInput.trim()}
-                      className="px-4 py-3 bg-stone-800 text-white text-[10px] tracking-widest uppercase hover:bg-gold transition-colors disabled:opacity-40 flex items-center gap-2"
+                      className="px-4 py-3 bg-stone-800 text-white text-micro tracking-widest uppercase hover:bg-gold transition-colors disabled:opacity-40 flex items-center gap-2"
                     >
                       <LinkIcon className="w-3 h-3" /> Add
                     </button>
                   </div>
-                  {isUploading && <p className="text-[9px] text-stone-400 italic">Uploading image...</p>}
+                  {isUploading && <p className="text-micro text-stone-600 italic">Uploading image...</p>}
                 </div>
 
                 <div className="p-8 bg-onyx border-t border-stone-100 flex justify-end gap-4 -mx-8 -mb-8 mt-12">
                    <button 
                     type="button" 
                     onClick={() => setIsFormOpen(false)}
-                    className="px-8 py-3 text-[10px] tracking-widest uppercase text-stone-400 hover:text-white transition-colors"
+                    className="px-8 py-3 text-micro tracking-widest uppercase text-stone-400 hover:text-white transition-colors"
                   >
                     Cancel
                   </button>
                   <button 
                     type="submit" 
-                    className="bg-gold text-white px-10 py-3 text-[10px] tracking-[0.2em] font-bold uppercase hover:bg-gold-dark transition-all flex items-center gap-2"
+                    className="bg-gold text-white px-10 py-3 text-micro tracking-[0.2em] font-bold uppercase hover:bg-gold-dark transition-all flex items-center gap-2"
                   >
                     {isUploading ? (
                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                     ) : (
                       <Save className="w-4 h-4" />
                     )} Finalize Selection
                   </button>
                 </div>
               </form>
             </motion.div>
@@ -366,28 +366,28 @@ interface InputFieldProps {
   name: string;
   type?: string;
   defaultValue?: string | number;
   required?: boolean;
   placeholder?: string;
 }
 
 function InputField({ label, name, type = "text", defaultValue, required, placeholder }: InputFieldProps) {
   return (
     <div className="flex flex-col gap-2">
-      <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">{label}</label>
+      <label className="text-micro uppercase tracking-widest text-stone-600 font-bold">{label}</label>
       <input 
         type={type}
         name={name}
         defaultValue={defaultValue}
         required={required}
         placeholder={placeholder}
-        className="w-full bg-stone-50 border border-stone-100 p-4 text-[11px] tracking-widest outline-none focus:border-gold transition-colors"
+        className="w-full bg-stone-50 border border-stone-100 p-4 text-micro tracking-widest outline-none focus:border-gold transition-colors"
       />
     </div>
   );
 }
 
 interface CheckboxProps {
   label: string;
   name: string;
   defaultChecked?: boolean;
 }
@@ -398,14 +398,14 @@ function Checkbox({ label, name, defaultChecked }: CheckboxProps) {
       <div className="relative">
         <input 
           type="checkbox" 
           name={name} 
           defaultChecked={defaultChecked}
           className="peer sr-only"
         />
         <div className="w-5 h-5 border border-stone-300 bg-white group-hover:border-gold transition-all peer-checked:bg-gold peer-checked:border-gold" />
         <Plus className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
       </div>
-      <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">{label}</span>
+      <span className="text-micro uppercase tracking-widest text-stone-600 font-bold">{label}</span>
     </label>
   );
 }
diff --git a/src/pages/admin/AdminSettings.tsx b/src/pages/admin/AdminSettings.tsx
index ad0576c..a8a749b 100644
--- a/src/pages/admin/AdminSettings.tsx
+++ b/src/pages/admin/AdminSettings.tsx
@@ -1 +1 @@
-import { useState, useEffect } from 'react';import { useToast } from '../../contexts/ToastContext';import { Download, Upload, CheckCircle2, AlertTriangle, Eye, Smartphone, Mail, Globe, Camera, Search, Palette, Code, Shield, ShoppingBag, Gem, RefreshCw, PenTool, Layout as LayoutIcon, Home, BookOpen, Truck, FileText } from 'lucide-react';import { isSupabaseConfigured } from '../../services/supabase';import { useData } from '../../contexts/DataContext';import { useSettings } from '../../contexts/SettingsContext';import { cn } from '../../lib/utils';import { motion } from 'motion/react';export default function AdminSettings() {  const { updateContent } = useData();  const { settings, updateSetting } = useSettings();  const [saved, setSaved] = useState(false);  const [tab, setTab] = useState<'brand' | 'homepage' | 'policies' | 'features' | 'advanced'>('brand');  const [importData, setImportData] = useState('');  const { addToast } = useToast();  useEffect(() => { if (saved) { const t = setTimeout(() => setSaved(false), 2000); return () => clearTimeout(t); } }, [saved]);  const update = async <K extends keyof typeof settings>(section: K, key: string, value: any) => {    await updateSetting(section, key, value);    setSaved(true);  };  const syncToDataContext = async () => {    await updateContent({      hero: { title: settings.homepage.heroTitle, subtitle: settings.homepage.heroSubtitle, cta: settings.homepage.heroCta, bgImage: settings.homepage.heroBgImage },      about: { title: settings.homepage.aboutTitle, description: settings.homepage.aboutDescription },      quote: settings.homepage.brandQuote,    });  };  const handleExport = () => {    const data = JSON.stringify({ settings }, null, 2);    const blob = new Blob([data], { type: 'application/json' });    const url = URL.createObjectURL(blob);    const a = document.createElement('a'); a.href = url; a.download = 'riman-settings-backup.json'; a.click();    URL.revokeObjectURL(url);  };  const handleImport = () => {    try {      const data = JSON.parse(importData);      if (data.settings) {        Object.entries(data.settings).forEach(([section, values]) => {          if (typeof values === 'object' && values !== null) {            Object.entries(values as Record<string, any>).forEach(([key, value]) => {              updateSetting(section as any, key, value);            });          }        });      }      setSaved(true); setImportData('');      addToast({ type: 'success', title: 'Import Complete', message: 'Settings imported successfully.' });    } catch { addToast({ type: 'error', title: 'Import Failed', message: 'Invalid JSON format.' }); }  };  const handleReset = async () => {    const defaults = {      branding: { siteName: 'Atelier Riman', tagline: "Sharjah's Most Majestic Couture", logoText: 'Riman' },      contact: { email: 'hello@rimanfashion.com', phone: '+971 50 123 4567', address: 'Al Zahra St, Sharjah, UAE', hours: 'SatΓÇôThu, 10am ΓÇô 8pm' },      social: { instagram: '@rimanfashion', whatsapp: '+971501234567', facebook: 'rimanfashion', twitter: 'rimanfashion', youtube: 'rimanfashion', tiktok: '@rimanfashion', pinterest: 'rimanfashion' },      homepage: { heroTitle: 'Reverie & Essence', heroSubtitle: "Sharjah's Most Majestic Couture", heroCta: 'Request A Private Viewing', heroBgImage: '/images/hero-default.jpg', aboutTitle: 'The Riman Legacy', aboutDescription: 'Founded in the vibrant cultural landscape of Sharjah.', brandQuote: 'In the heart of Sharjah, we weave dreams into silk.', featuredTitle: 'Featured Designs' },      features: { newsletter: true, whatsappBtn: true, preloader: true, instagramFeed: true, cookieBanner: true, scrollReveal: true, threeDViewer: true },      policies: { rentalPeriodDays: 7, depositAmount: 5000, insuranceText: '7-day hire period includes eco-friendly dry cleaning.', lateReturnFee: 'AED 500 per day', shippingInfo: 'Complimentary delivery within UAE and GCC.', returnPolicy: 'All sales are final.' },      advanced: { metaDescription: "Atelier Riman ΓÇö Sharjah's premier bridal and evening couture.", ogImageUrl: '', keywords: 'bridal gowns, evening dresses, couture, Sharjah, UAE', gaId: '', plausibleDomain: '', fathomSiteId: '', maintenanceMode: false, maintenanceMessage: 'Our atelier is currently being curated.', customHeadCode: '' },    };    for (const [section, values] of Object.entries(defaults)) {      for (const [key, value] of Object.entries(values as Record<string, any>)) {        await updateSetting(section as any, key, value);      }    }    setSaved(true);    addToast({ type: 'info', title: 'Settings Reset', message: 'Restored to factory defaults.' });  };  const inputCls = "w-full bg-stone-50 border border-stone-200 px-4 py-3 text-xs tracking-widest outline-none focus:border-gold transition-colors";  const labelCls = "text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1.5";  const textareaCls = "w-full bg-stone-50 border border-stone-200 px-4 py-3 text-xs outline-none focus:border-gold transition-colors resize-none";  const tabs = [    { id: 'brand' as const, label: 'Branding', icon: <Palette className="w-4 h-4" /> },    { id: 'homepage' as const, label: 'Homepage', icon: <Home className="w-4 h-4" /> },    { id: 'policies' as const, label: 'Policies', icon: <Shield className="w-4 h-4" /> },    { id: 'features' as const, label: 'Features', icon: <LayoutIcon className="w-4 h-4" /> },    { id: 'advanced' as const, label: 'Advanced', icon: <Code className="w-4 h-4" /> },  ];  return (    <div className="space-y-8 max-w-5xl">      <div className="flex items-center justify-between flex-wrap gap-4">        <div>          <h1 className="font-heading text-2xl text-stone-800 tracking-wider uppercase">Control Panel</h1>          <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1 italic">Manage every aspect of the Riman boutique experience</p>        </div>        <div className="flex items-center gap-4">          {saved && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-emerald-600 text-[10px] tracking-widest uppercase font-bold"><CheckCircle2 className="w-4 h-4" /> Saved</motion.div>}          <button onClick={syncToDataContext} className="btn-luxury text-[10px] !py-3 !px-6 flex items-center gap-2"><RefreshCw className="w-3 h-3" /> Publish to Site</button>        </div>      </div>      {/* Tabs */}      <div className="flex gap-1 border-b border-stone-200 overflow-x-auto no-scrollbar">        {tabs.map(t => (          <button key={t.id} onClick={() => setTab(t.id)} className={cn("flex items-center gap-2 px-5 py-3 text-[10px] tracking-[0.2em] uppercase font-bold transition-colors border-b-2 -mb-px shrink-0", tab === t.id ? "border-gold text-gold" : "border-transparent text-stone-400 hover:text-stone-600")}>            {t.icon} {t.label}          </button>        ))}      </div>      {/* Branding */}      {tab === 'brand' && (        <div className="space-y-8">          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><PenTool className="w-4 h-4 text-gold" /> Brand Identity</h3>            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              <div><label className={labelCls}>Site Name</label><input className={inputCls} value={settings.branding.siteName} onChange={e => update('branding', 'siteName', e.target.value)} /></div>              <div><label className={labelCls}>Navigation Logo Text</label><input className={inputCls} value={settings.branding.logoText} onChange={e => update('branding', 'logoText', e.target.value)} /></div>              <div className="md:col-span-2"><label className={labelCls}>Tagline</label><input className={inputCls} value={settings.branding.tagline} onChange={e => update('branding', 'tagline', e.target.value)} /></div>            </div>          </section>          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><Mail className="w-4 h-4 text-gold" /> Contact</h3>            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              <div><label className={labelCls}>Email</label><input className={inputCls} value={settings.contact.email} onChange={e => update('contact', 'email', e.target.value)} /></div>              <div><label className={labelCls}>Phone</label><input className={inputCls} value={settings.contact.phone} onChange={e => update('contact', 'phone', e.target.value)} /></div>              <div className="md:col-span-2"><label className={labelCls}>Address</label><input className={inputCls} value={settings.contact.address} onChange={e => update('contact', 'address', e.target.value)} /></div>              <div><label className={labelCls}>Hours</label><input className={inputCls} value={settings.contact.hours} onChange={e => update('contact', 'hours', e.target.value)} /></div>            </div>          </section>          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><Globe className="w-4 h-4 text-gold" /> Social Links</h3>            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              {([                { key: 'instagram', icon: '≡ƒô╖', placeholder: '@rimanfashion' },                { key: 'facebook', icon: '≡ƒæì', placeholder: 'rimanfashion' },                { key: 'twitter', icon: '≡ƒÉª', placeholder: 'rimanfashion' },                { key: 'youtube', icon: 'Γû╢', placeholder: 'rimanfashion' },                { key: 'tiktok', icon: '≡ƒÄ╡', placeholder: '@rimanfashion' },                { key: 'pinterest', icon: '≡ƒôî', placeholder: 'rimanfashion' },                { key: 'whatsapp', icon: '≡ƒÆ¼', placeholder: '+971501234567' },              ] as const).map(s => (                <div key={s.key}><label className={labelCls}>{s.key.charAt(0).toUpperCase() + s.key.slice(1)}</label><input className={inputCls} value={(settings.social as any)[s.key]} placeholder={s.placeholder} onChange={e => update('social', s.key, e.target.value)} /></div>              ))}            </div>          </section>        </div>      )}      {/* Homepage */}      {tab === 'homepage' && (        <div className="space-y-8">          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><Camera className="w-4 h-4 text-gold" /> Hero Section</h3>            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              <div className="md:col-span-2"><label className={labelCls}>Hero Title</label><input className={inputCls} value={settings.homepage.heroTitle} onChange={e => update('homepage', 'heroTitle', e.target.value)} /></div>              <div><label className={labelCls}>Subtitle</label><input className={inputCls} value={settings.homepage.heroSubtitle} onChange={e => update('homepage', 'heroSubtitle', e.target.value)} /></div>              <div><label className={labelCls}>CTA Button Text</label><input className={inputCls} value={settings.homepage.heroCta} onChange={e => update('homepage', 'heroCta', e.target.value)} /></div>              <div className="md:col-span-2"><label className={labelCls}>Background Image URL</label><input className={inputCls} value={settings.homepage.heroBgImage} onChange={e => update('homepage', 'heroBgImage', e.target.value)} /></div>            </div>          </section>          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><BookOpen className="w-4 h-4 text-gold" /> About & Quote</h3>            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              <div className="md:col-span-2"><label className={labelCls}>About Title</label><input className={inputCls} value={settings.homepage.aboutTitle} onChange={e => update('homepage', 'aboutTitle', e.target.value)} /></div>              <div className="md:col-span-2"><label className={labelCls}>About Description</label><textarea className={textareaCls} rows={4} value={settings.homepage.aboutDescription} onChange={e => update('homepage', 'aboutDescription', e.target.value)} /></div>              <div className="md:col-span-2"><label className={labelCls}>Brand Quote</label><textarea className={textareaCls} rows={3} value={settings.homepage.brandQuote} onChange={e => update('homepage', 'brandQuote', e.target.value)} /></div>              <div><label className={labelCls}>Featured Section Title</label><input className={inputCls} value={settings.homepage.featuredTitle} onChange={e => update('homepage', 'featuredTitle', e.target.value)} /></div>            </div>            <div className="mt-6 p-4 bg-gold/5 border border-gold/20">              <p className="text-[10px] text-stone-500 italic">Changes here take effect after clicking <strong>"Publish to Site"</strong>.</p>            </div>          </section>        </div>      )}      {/* Policies */}      {tab === 'policies' && (        <div className="space-y-8">          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><ShoppingBag className="w-4 h-4 text-gold" /> Rental Policy</h3>            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              <div><label className={labelCls}>Rental Period (days)</label><input className={inputCls} type="number" value={settings.policies.rentalPeriodDays} onChange={e => update('policies', 'rentalPeriodDays', Number(e.target.value))} /></div>              <div><label className={labelCls}>Security Deposit (AED)</label><input className={inputCls} type="number" value={settings.policies.depositAmount} onChange={e => update('policies', 'depositAmount', Number(e.target.value))} /></div>              <div className="md:col-span-2"><label className={labelCls}>Insurance & Cleaning Text</label><textarea className={textareaCls} rows={3} value={settings.policies.insuranceText} onChange={e => update('policies', 'insuranceText', e.target.value)} /></div>              <div className="md:col-span-2"><label className={labelCls}>Late Return Fee</label><input className={inputCls} value={settings.policies.lateReturnFee} onChange={e => update('policies', 'lateReturnFee', e.target.value)} /></div>            </div>          </section>          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><Truck className="w-4 h-4 text-gold" /> Shipping & Returns</h3>            <div className="grid grid-cols-1 gap-6">              <div><label className={labelCls}>Shipping Information</label><textarea className={textareaCls} rows={3} value={settings.policies.shippingInfo} onChange={e => update('policies', 'shippingInfo', e.target.value)} /></div>              <div><label className={labelCls}>Return Policy</label><textarea className={textareaCls} rows={3} value={settings.policies.returnPolicy} onChange={e => update('policies', 'returnPolicy', e.target.value)} /></div>            </div>          </section>        </div>      )}      {/* Features */}      {tab === 'features' && (        <section>          <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6">Site Features</h3>          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">            {[              { key: 'newsletter' as const, label: 'Newsletter Popup', desc: 'Show the Atelier Circle signup popup', icon: <Mail className="w-4 h-4" /> },              { key: 'whatsappBtn' as const, label: 'WhatsApp Button', desc: 'Floating WhatsApp for inquiries', icon: <Smartphone className="w-4 h-4" /> },              { key: 'preloader' as const, label: 'Preloader', desc: 'Emblem animation on first homepage visit', icon: <Eye className="w-4 h-4" /> },              { key: 'instagramFeed' as const, label: 'Instagram Feed', desc: 'Instagram section on homepage', icon: <Camera className="w-4 h-4" /> },              { key: 'cookieBanner' as const, label: 'Cookie Consent', desc: 'GDPR cookie consent banner', icon: <FileText className="w-4 h-4" /> },              { key: 'scrollReveal' as const, label: 'Scroll Animations', desc: 'Fade-in effects as user scrolls', icon: <RefreshCw className="w-4 h-4" /> },              { key: 'threeDViewer' as const, label: '3D Product Viewer', desc: 'Interactive 3D model viewer on products', icon: <Gem className="w-4 h-4" /> },            ].map(f => (              <div key={f.key} className="flex items-center justify-between p-5 bg-ivory border border-stone-100">                <div className="flex items-center gap-3">                  <div className="w-9 h-9 bg-gold/10 text-gold flex items-center justify-center">{f.icon}</div>                  <div><p className="text-xs font-bold text-stone-800 uppercase tracking-widest">{f.label}</p><p className="text-[9px] text-stone-400 italic mt-0.5">{f.desc}</p></div>                </div>                <button onClick={() => update('features', f.key, !settings.features[f.key])} className={cn("relative w-11 h-5 transition-colors duration-300 shrink-0", settings.features[f.key] ? "bg-gold" : "bg-stone-200")} aria-label={`Toggle ${f.label}`}>                  <div className={cn("absolute top-0.5 w-4 h-4 bg-white transition-transform duration-300", settings.features[f.key] ? "translate-x-6" : "translate-x-0.5")} />                </button>              </div>            ))}          </div>        </section>      )}      {/* Advanced */}      {tab === 'advanced' && (        <div className="space-y-8">          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><Search className="w-4 h-4 text-gold" /> SEO</h3>            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              <div className="md:col-span-2"><label className={labelCls}>Default Meta Description</label><textarea className={textareaCls} rows={3} value={settings.advanced.metaDescription} onChange={e => update('advanced', 'metaDescription', e.target.value)} /></div>              <div className="md:col-span-2"><label className={labelCls}>OG Image URL</label><input className={inputCls} value={settings.advanced.ogImageUrl} onChange={e => update('advanced', 'ogImageUrl', e.target.value)} /></div>              <div className="md:col-span-2"><label className={labelCls}>Meta Keywords</label><input className={inputCls} value={settings.advanced.keywords} onChange={e => update('advanced', 'keywords', e.target.value)} /></div>              <div><label className={labelCls}>Google Analytics ID</label><input className={inputCls} value={settings.advanced.gaId} placeholder="G-XXXXXXXXXX" onChange={e => update('advanced', 'gaId', e.target.value)} /></div>              <div><label className={labelCls}>Plausible Domain</label><input className={inputCls} value={settings.advanced.plausibleDomain} placeholder="yourdomain.com" onChange={e => update('advanced', 'plausibleDomain', e.target.value)} /></div>              <div><label className={labelCls}>Fathom Site ID</label><input className={inputCls} value={settings.advanced.fathomSiteId} placeholder="XXXXXXXXX" onChange={e => update('advanced', 'fathomSiteId', e.target.value)} /></div>            </div>          </section>          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-gold" /> Maintenance Mode</h3>            <div className="p-6 bg-ivory border border-stone-100">              <div className="flex items-center justify-between mb-6">                <div><p className="text-xs font-bold text-stone-800 uppercase tracking-widest">Maintenance Mode</p><p className="text-[10px] text-stone-400 italic mt-1">Show a maintenance page to visitors while you make changes</p></div>                <button onClick={() => update('advanced', 'maintenanceMode', !settings.advanced.maintenanceMode)} className={cn("relative w-11 h-5 transition-colors duration-300", settings.advanced.maintenanceMode ? "bg-rose-500" : "bg-stone-200")} aria-label="Toggle maintenance mode">                  <div className={cn("absolute top-0.5 w-4 h-4 bg-white transition-transform duration-300", settings.advanced.maintenanceMode ? "translate-x-6" : "translate-x-0.5")} />                </button>              </div>              <label className={labelCls}>Maintenance Message</label>              <textarea className={textareaCls} rows={3} value={settings.advanced.maintenanceMessage} onChange={e => update('advanced', 'maintenanceMessage', e.target.value)} />            </div>          </section>          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><Code className="w-4 h-4 text-gold" /> Custom Code</h3>            <div><label className={labelCls}>Custom &lt;head&gt; Code</label><textarea className={textareaCls + " font-mono text-[10px]"} rows={6} value={settings.advanced.customHeadCode} placeholder="<!-- Google Tag Manager, custom fonts, meta tags -->&#10;" onChange={e => update('advanced', 'customHeadCode', e.target.value)} /></div>          </section>          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><Download className="w-4 h-4 text-gold" /> Backup & System</h3>            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              <button onClick={handleExport} className="flex items-center gap-3 px-6 py-5 border border-stone-200 bg-ivory hover:border-gold/30 transition-colors text-left">                <Download className="w-5 h-5 text-gold" />                <div><p className="text-xs font-bold text-stone-800 uppercase tracking-widest">Export Data</p><p className="text-[9px] text-stone-400">Download all settings as JSON</p></div>              </button>              <div className="border border-stone-200 bg-ivory p-5">                <div className="flex items-center gap-3 mb-3"><Upload className="w-5 h-5 text-gold" /><p className="text-xs font-bold text-stone-800 uppercase tracking-widest">Import Data</p></div>                <textarea className="w-full bg-stone-50 border border-stone-100 p-3 text-[10px] outline-none focus:border-gold font-mono resize-none h-20" placeholder="Paste exported JSON..." value={importData} onChange={e => setImportData(e.target.value)} />                {importData && <button onClick={handleImport} className="mt-3 btn-luxury text-[10px] !py-3 w-full">Import</button>}              </div>              <div className="p-6 bg-ivory border border-stone-100"><p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Supabase</p>{isSupabaseConfigured ? <span className="inline-flex items-center gap-2 text-[10px] text-emerald-600 font-bold"><div className="w-2 h-2 bg-emerald-500" /> Connected</span> : <span className="inline-flex items-center gap-2 text-[10px] text-stone-400 font-bold"><AlertTriangle className="w-3 h-3" /> Offline</span>}</div>              <button onClick={handleReset} className="flex items-center gap-3 px-6 py-5 border border-rose-200 bg-rose-50/50 hover:bg-rose-50 transition-colors text-left">                <AlertTriangle className="w-5 h-5 text-rose-500" />                <div><p className="text-xs font-bold text-stone-800 uppercase tracking-widest">Factory Reset</p><p className="text-[9px] text-stone-400">Restore all settings to defaults</p></div>              </button>            </div>          </section>        </div>      )}    </div>  );}
\ No newline at end of file
+import { useState, useEffect } from 'react';import { useToast } from '../../contexts/ToastContext';import { Download, Upload, CheckCircle2, AlertTriangle, Eye, Smartphone, Mail, Globe, Camera, Search, Palette, Code, Shield, ShoppingBag, Gem, RefreshCw, PenTool, Layout as LayoutIcon, Home, BookOpen, Truck, FileText } from 'lucide-react';import { isSupabaseConfigured } from '../../services/supabase';import { useData } from '../../contexts/DataContext';import { useSettings } from '../../contexts/SettingsContext';import { cn } from '../../lib/utils';import { motion } from 'motion/react';export default function AdminSettings() {  const { updateContent } = useData();  const { settings, updateSetting } = useSettings();  const [saved, setSaved] = useState(false);  const [tab, setTab] = useState<'brand' | 'homepage' | 'policies' | 'features' | 'advanced'>('brand');  const [importData, setImportData] = useState('');  const { addToast } = useToast();  useEffect(() => { if (saved) { const t = setTimeout(() => setSaved(false), 2000); return () => clearTimeout(t); } }, [saved]);  const update = async <K extends keyof typeof settings>(section: K, key: string, value: any) => {    await updateSetting(section, key, value);    setSaved(true);  };  const syncToDataContext = async () => {    await updateContent({      hero: { title: settings.homepage.heroTitle, subtitle: settings.homepage.heroSubtitle, cta: settings.homepage.heroCta, bgImage: settings.homepage.heroBgImage },      about: { title: settings.homepage.aboutTitle, description: settings.homepage.aboutDescription },      quote: settings.homepage.brandQuote,    });  };  const handleExport = () => {    const data = JSON.stringify({ settings }, null, 2);    const blob = new Blob([data], { type: 'application/json' });    const url = URL.createObjectURL(blob);    const a = document.createElement('a'); a.href = url; a.download = 'riman-settings-backup.json'; a.click();    URL.revokeObjectURL(url);  };  const handleImport = () => {    try {      const data = JSON.parse(importData);      if (data.settings) {        Object.entries(data.settings).forEach(([section, values]) => {          if (typeof values === 'object' && values !== null) {            Object.entries(values as Record<string, any>).forEach(([key, value]) => {              updateSetting(section as any, key, value);            });          }        });      }      setSaved(true); setImportData('');      addToast({ type: 'success', title: 'Import Complete', message: 'Settings imported successfully.' });    } catch { addToast({ type: 'error', title: 'Import Failed', message: 'Invalid JSON format.' }); }  };  const handleReset = async () => {    const defaults = {      branding: { siteName: 'Atelier Riman', tagline: "Sharjah's Most Majestic Couture", logoText: 'Riman' },      contact: { email: 'hello@rimanfashion.com', phone: '+971 50 123 4567', address: 'Al Zahra St, Sharjah, UAE', hours: 'SatΓÇôThu, 10am ΓÇô 8pm' },      social: { instagram: '@rimanfashion', whatsapp: '+971501234567', facebook: 'rimanfashion', twitter: 'rimanfashion', youtube: 'rimanfashion', tiktok: '@rimanfashion', pinterest: 'rimanfashion' },      homepage: { heroTitle: 'Reverie & Essence', heroSubtitle: "Sharjah's Most Majestic Couture", heroCta: 'Request A Private Viewing', heroBgImage: '/images/hero-default.jpg', aboutTitle: 'The Riman Legacy', aboutDescription: 'Founded in the vibrant cultural landscape of Sharjah.', brandQuote: 'In the heart of Sharjah, we weave dreams into silk.', featuredTitle: 'Featured Designs' },      features: { newsletter: true, whatsappBtn: true, preloader: true, instagramFeed: true, cookieBanner: true, scrollReveal: true, threeDViewer: true },      policies: { rentalPeriodDays: 7, depositAmount: 5000, insuranceText: '7-day hire period includes eco-friendly dry cleaning.', lateReturnFee: 'AED 500 per day', shippingInfo: 'Complimentary delivery within UAE and GCC.', returnPolicy: 'All sales are final.' },      advanced: { metaDescription: "Atelier Riman ΓÇö Sharjah's premier bridal and evening couture.", ogImageUrl: '', keywords: 'bridal gowns, evening dresses, couture, Sharjah, UAE', gaId: '', plausibleDomain: '', fathomSiteId: '', maintenanceMode: false, maintenanceMessage: 'Our atelier is currently being curated.', customHeadCode: '' },    };    for (const [section, values] of Object.entries(defaults)) {      for (const [key, value] of Object.entries(values as Record<string, any>)) {        await updateSetting(section as any, key, value);      }    }    setSaved(true);    addToast({ type: 'info', title: 'Settings Reset', message: 'Restored to factory defaults.' });  };  const inputCls = "w-full bg-stone-50 border border-stone-200 px-4 py-3 text-xs tracking-widest outline-none focus:border-gold transition-colors";  const labelCls = "text-micro font-bold text-stone-600 uppercase tracking-widest block mb-1.5";  const textareaCls = "w-full bg-stone-50 border border-stone-200 px-4 py-3 text-xs outline-none focus:border-gold transition-colors resize-none";  const tabs = [    { id: 'brand' as const, label: 'Branding', icon: <Palette className="w-4 h-4" /> },    { id: 'homepage' as const, label: 'Homepage', icon: <Home className="w-4 h-4" /> },    { id: 'policies' as const, label: 'Policies', icon: <Shield className="w-4 h-4" /> },    { id: 'features' as const, label: 'Features', icon: <LayoutIcon className="w-4 h-4" /> },    { id: 'advanced' as const, label: 'Advanced', icon: <Code className="w-4 h-4" /> },  ];  return (    <div className="space-y-8 max-w-5xl">      <div className="flex items-center justify-between flex-wrap gap-4">        <div>          <h1 className="font-heading text-2xl text-stone-800 tracking-wider uppercase">Control Panel</h1>          <p className="text-micro text-stone-600 uppercase tracking-widest mt-1 italic">Manage every aspect of the Riman boutique experience</p>        </div>        <div className="flex items-center gap-4">          {saved && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-emerald-600 text-micro tracking-widest uppercase font-bold"><CheckCircle2 className="w-4 h-4" /> Saved</motion.div>}          <button onClick={syncToDataContext} className="btn-luxury text-micro !py-3 !px-6 flex items-center gap-2"><RefreshCw className="w-3 h-3" /> Publish to Site</button>        </div>      </div>      {/* Tabs */}      <div className="flex gap-1 border-b border-stone-200 overflow-x-auto no-scrollbar">        {tabs.map(t => (          <button key={t.id} onClick={() => setTab(t.id)} className={cn("flex items-center gap-2 px-5 py-3 text-micro tracking-[0.2em] uppercase font-bold transition-colors border-b-2 -mb-px shrink-0", tab === t.id ? "border-gold text-gold" : "border-transparent text-stone-600 hover:text-stone-800")}>            {t.icon} {t.label}          </button>        ))}      </div>      {/* Branding */}      {tab === 'brand' && (        <div className="space-y-8">          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><PenTool className="w-4 h-4 text-gold" /> Brand Identity</h3>            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              <div><label className={labelCls}>Site Name</label><input className={inputCls} value={settings.branding.siteName} onChange={e => update('branding', 'siteName', e.target.value)} /></div>              <div><label className={labelCls}>Navigation Logo Text</label><input className={inputCls} value={settings.branding.logoText} onChange={e => update('branding', 'logoText', e.target.value)} /></div>              <div className="md:col-span-2"><label className={labelCls}>Tagline</label><input className={inputCls} value={settings.branding.tagline} onChange={e => update('branding', 'tagline', e.target.value)} /></div>            </div>          </section>          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><Mail className="w-4 h-4 text-gold" /> Contact</h3>            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              <div><label className={labelCls}>Email</label><input className={inputCls} value={settings.contact.email} onChange={e => update('contact', 'email', e.target.value)} /></div>              <div><label className={labelCls}>Phone</label><input className={inputCls} value={settings.contact.phone} onChange={e => update('contact', 'phone', e.target.value)} /></div>              <div className="md:col-span-2"><label className={labelCls}>Address</label><input className={inputCls} value={settings.contact.address} onChange={e => update('contact', 'address', e.target.value)} /></div>              <div><label className={labelCls}>Hours</label><input className={inputCls} value={settings.contact.hours} onChange={e => update('contact', 'hours', e.target.value)} /></div>            </div>          </section>          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><Globe className="w-4 h-4 text-gold" /> Social Links</h3>            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              {([                { key: 'instagram', icon: '≡ƒô╖', placeholder: '@rimanfashion' },                { key: 'facebook', icon: '≡ƒæì', placeholder: 'rimanfashion' },                { key: 'twitter', icon: '≡ƒÉª', placeholder: 'rimanfashion' },                { key: 'youtube', icon: 'Γû╢', placeholder: 'rimanfashion' },                { key: 'tiktok', icon: '≡ƒÄ╡', placeholder: '@rimanfashion' },                { key: 'pinterest', icon: '≡ƒôî', placeholder: 'rimanfashion' },                { key: 'whatsapp', icon: '≡ƒÆ¼', placeholder: '+971501234567' },              ] as const).map(s => (                <div key={s.key}><label className={labelCls}>{s.key.charAt(0).toUpperCase() + s.key.slice(1)}</label><input className={inputCls} value={(settings.social as any)[s.key]} placeholder={s.placeholder} onChange={e => update('social', s.key, e.target.value)} /></div>              ))}            </div>          </section>        </div>      )}      {/* Homepage */}      {tab === 'homepage' && (        <div className="space-y-8">          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><Camera className="w-4 h-4 text-gold" /> Hero Section</h3>            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              <div className="md:col-span-2"><label className={labelCls}>Hero Title</label><input className={inputCls} value={settings.homepage.heroTitle} onChange={e => update('homepage', 'heroTitle', e.target.value)} /></div>              <div><label className={labelCls}>Subtitle</label><input className={inputCls} value={settings.homepage.heroSubtitle} onChange={e => update('homepage', 'heroSubtitle', e.target.value)} /></div>              <div><label className={labelCls}>CTA Button Text</label><input className={inputCls} value={settings.homepage.heroCta} onChange={e => update('homepage', 'heroCta', e.target.value)} /></div>              <div className="md:col-span-2"><label className={labelCls}>Background Image URL</label><input className={inputCls} value={settings.homepage.heroBgImage} onChange={e => update('homepage', 'heroBgImage', e.target.value)} /></div>            </div>          </section>          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><BookOpen className="w-4 h-4 text-gold" /> About & Quote</h3>            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              <div className="md:col-span-2"><label className={labelCls}>About Title</label><input className={inputCls} value={settings.homepage.aboutTitle} onChange={e => update('homepage', 'aboutTitle', e.target.value)} /></div>              <div className="md:col-span-2"><label className={labelCls}>About Description</label><textarea className={textareaCls} rows={4} value={settings.homepage.aboutDescription} onChange={e => update('homepage', 'aboutDescription', e.target.value)} /></div>              <div className="md:col-span-2"><label className={labelCls}>Brand Quote</label><textarea className={textareaCls} rows={3} value={settings.homepage.brandQuote} onChange={e => update('homepage', 'brandQuote', e.target.value)} /></div>              <div><label className={labelCls}>Featured Section Title</label><input className={inputCls} value={settings.homepage.featuredTitle} onChange={e => update('homepage', 'featuredTitle', e.target.value)} /></div>            </div>            <div className="mt-6 p-4 bg-gold/5 border border-gold/20">              <p className="text-micro text-stone-600 italic">Changes here take effect after clicking <strong>"Publish to Site"</strong>.</p>            </div>          </section>        </div>      )}      {/* Policies */}      {tab === 'policies' && (        <div className="space-y-8">          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><ShoppingBag className="w-4 h-4 text-gold" /> Rental Policy</h3>            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              <div><label className={labelCls}>Rental Period (days)</label><input className={inputCls} type="number" value={settings.policies.rentalPeriodDays} onChange={e => update('policies', 'rentalPeriodDays', Number(e.target.value))} /></div>              <div><label className={labelCls}>Security Deposit (AED)</label><input className={inputCls} type="number" value={settings.policies.depositAmount} onChange={e => update('policies', 'depositAmount', Number(e.target.value))} /></div>              <div className="md:col-span-2"><label className={labelCls}>Insurance & Cleaning Text</label><textarea className={textareaCls} rows={3} value={settings.policies.insuranceText} onChange={e => update('policies', 'insuranceText', e.target.value)} /></div>              <div className="md:col-span-2"><label className={labelCls}>Late Return Fee</label><input className={inputCls} value={settings.policies.lateReturnFee} onChange={e => update('policies', 'lateReturnFee', e.target.value)} /></div>            </div>          </section>          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><Truck className="w-4 h-4 text-gold" /> Shipping & Returns</h3>            <div className="grid grid-cols-1 gap-6">              <div><label className={labelCls}>Shipping Information</label><textarea className={textareaCls} rows={3} value={settings.policies.shippingInfo} onChange={e => update('policies', 'shippingInfo', e.target.value)} /></div>              <div><label className={labelCls}>Return Policy</label><textarea className={textareaCls} rows={3} value={settings.policies.returnPolicy} onChange={e => update('policies', 'returnPolicy', e.target.value)} /></div>            </div>          </section>        </div>      )}      {/* Features */}      {tab === 'features' && (        <section>          <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6">Site Features</h3>          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">            {[              { key: 'newsletter' as const, label: 'Newsletter Popup', desc: 'Show the Atelier Circle signup popup', icon: <Mail className="w-4 h-4" /> },              { key: 'whatsappBtn' as const, label: 'WhatsApp Button', desc: 'Floating WhatsApp for inquiries', icon: <Smartphone className="w-4 h-4" /> },              { key: 'preloader' as const, label: 'Preloader', desc: 'Emblem animation on first homepage visit', icon: <Eye className="w-4 h-4" /> },              { key: 'instagramFeed' as const, label: 'Instagram Feed', desc: 'Instagram section on homepage', icon: <Camera className="w-4 h-4" /> },              { key: 'cookieBanner' as const, label: 'Cookie Consent', desc: 'GDPR cookie consent banner', icon: <FileText className="w-4 h-4" /> },              { key: 'scrollReveal' as const, label: 'Scroll Animations', desc: 'Fade-in effects as user scrolls', icon: <RefreshCw className="w-4 h-4" /> },              { key: 'threeDViewer' as const, label: '3D Product Viewer', desc: 'Interactive 3D model viewer on products', icon: <Gem className="w-4 h-4" /> },            ].map(f => (              <div key={f.key} className="flex items-center justify-between p-5 bg-ivory border border-stone-100">                <div className="flex items-center gap-3">                  <div className="w-9 h-9 bg-gold/10 text-gold flex items-center justify-center">{f.icon}</div>                  <div><p className="text-xs font-bold text-stone-800 uppercase tracking-widest">{f.label}</p><p className="text-micro text-stone-600 italic mt-0.5">{f.desc}</p></div>                </div>                <button onClick={() => update('features', f.key, !settings.features[f.key])} className={cn("relative w-11 h-5 transition-colors duration-300 shrink-0", settings.features[f.key] ? "bg-gold" : "bg-stone-200")} aria-label={`Toggle ${f.label}`}>                  <div className={cn("absolute top-0.5 w-4 h-4 bg-white transition-transform duration-300", settings.features[f.key] ? "translate-x-6" : "translate-x-0.5")} />                </button>              </div>            ))}          </div>        </section>      )}      {/* Advanced */}      {tab === 'advanced' && (        <div className="space-y-8">          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><Search className="w-4 h-4 text-gold" /> SEO</h3>            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              <div className="md:col-span-2"><label className={labelCls}>Default Meta Description</label><textarea className={textareaCls} rows={3} value={settings.advanced.metaDescription} onChange={e => update('advanced', 'metaDescription', e.target.value)} /></div>              <div className="md:col-span-2"><label className={labelCls}>OG Image URL</label><input className={inputCls} value={settings.advanced.ogImageUrl} onChange={e => update('advanced', 'ogImageUrl', e.target.value)} /></div>              <div className="md:col-span-2"><label className={labelCls}>Meta Keywords</label><input className={inputCls} value={settings.advanced.keywords} onChange={e => update('advanced', 'keywords', e.target.value)} /></div>              <div><label className={labelCls}>Google Analytics ID</label><input className={inputCls} value={settings.advanced.gaId} placeholder="G-XXXXXXXXXX" onChange={e => update('advanced', 'gaId', e.target.value)} /></div>              <div><label className={labelCls}>Plausible Domain</label><input className={inputCls} value={settings.advanced.plausibleDomain} placeholder="yourdomain.com" onChange={e => update('advanced', 'plausibleDomain', e.target.value)} /></div>              <div><label className={labelCls}>Fathom Site ID</label><input className={inputCls} value={settings.advanced.fathomSiteId} placeholder="XXXXXXXXX" onChange={e => update('advanced', 'fathomSiteId', e.target.value)} /></div>            </div>          </section>          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-gold" /> Maintenance Mode</h3>            <div className="p-6 bg-ivory border border-stone-100">              <div className="flex items-center justify-between mb-6">                <div><p className="text-xs font-bold text-stone-800 uppercase tracking-widest">Maintenance Mode</p><p className="text-micro text-stone-600 italic mt-1">Show a maintenance page to visitors while you make changes</p></div>                <button onClick={() => update('advanced', 'maintenanceMode', !settings.advanced.maintenanceMode)} className={cn("relative w-11 h-5 transition-colors duration-300", settings.advanced.maintenanceMode ? "bg-rose-500" : "bg-stone-200")} aria-label="Toggle maintenance mode">                  <div className={cn("absolute top-0.5 w-4 h-4 bg-white transition-transform duration-300", settings.advanced.maintenanceMode ? "translate-x-6" : "translate-x-0.5")} />                </button>              </div>              <label className={labelCls}>Maintenance Message</label>              <textarea className={textareaCls} rows={3} value={settings.advanced.maintenanceMessage} onChange={e => update('advanced', 'maintenanceMessage', e.target.value)} />            </div>          </section>          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><Code className="w-4 h-4 text-gold" /> Custom Code</h3>            <div><label className={labelCls}>Custom &lt;head&gt; Code</label><textarea className={textareaCls + " font-mono text-micro"} rows={6} value={settings.advanced.customHeadCode} placeholder="<!-- Google Tag Manager, custom fonts, meta tags -->&#10;" onChange={e => update('advanced', 'customHeadCode', e.target.value)} /></div>          </section>          <section>            <h3 className="font-heading text-lg text-stone-800 tracking-wider uppercase mb-6 flex items-center gap-2"><Download className="w-4 h-4 text-gold" /> Backup & System</h3>            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              <button onClick={handleExport} className="flex items-center gap-3 px-6 py-5 border border-stone-200 bg-ivory hover:border-gold/30 transition-colors text-left">                <Download className="w-5 h-5 text-gold" />                <div><p className="text-xs font-bold text-stone-800 uppercase tracking-widest">Export Data</p><p className="text-micro text-stone-600">Download all settings as JSON</p></div>              </button>              <div className="border border-stone-200 bg-ivory p-5">                <div className="flex items-center gap-3 mb-3"><Upload className="w-5 h-5 text-gold" /><p className="text-xs font-bold text-stone-800 uppercase tracking-widest">Import Data</p></div>                <textarea className="w-full bg-stone-50 border border-stone-100 p-3 text-micro outline-none focus:border-gold font-mono resize-none h-20" placeholder="Paste exported JSON..." value={importData} onChange={e => setImportData(e.target.value)} />                {importData && <button onClick={handleImport} className="mt-3 btn-luxury text-micro !py-3 w-full">Import</button>}              </div>              <div className="p-6 bg-ivory border border-stone-100"><p className="text-micro font-bold text-stone-600 uppercase tracking-widest mb-2">Supabase</p>{isSupabaseConfigured ? <span className="inline-flex items-center gap-2 text-micro text-emerald-600 font-bold"><div className="w-2 h-2 bg-emerald-500" /> Connected</span> : <span className="inline-flex items-center gap-2 text-micro text-stone-600 font-bold"><AlertTriangle className="w-3 h-3" /> Offline</span>}</div>              <button onClick={handleReset} className="flex items-center gap-3 px-6 py-5 border border-rose-200 bg-rose-50/50 hover:bg-rose-50 transition-colors text-left">                <AlertTriangle className="w-5 h-5 text-rose-500" />                <div><p className="text-xs font-bold text-stone-800 uppercase tracking-widest">Factory Reset</p><p className="text-micro text-stone-600">Restore all settings to defaults</p></div>              </button>            </div>          </section>        </div>      )}    </div>  );}
\ No newline at end of file
