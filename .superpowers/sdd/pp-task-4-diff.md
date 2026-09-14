## Commits
5cba22d a11y(pages): 11px type floor + AA contrast on light surfaces

## Stat
 src/App.tsx                    |   2 +-
 src/pages/AboutPage.tsx        |  12 +--
 src/pages/AlterationsPage.tsx  |   8 +-
 src/pages/AppointmentPage.tsx  |  62 +++++++--------
 src/pages/Auth.tsx             |  16 ++--
 src/pages/Checkout.tsx         | 114 +++++++++++++--------------
 src/pages/CollectionPage.tsx   |  30 +++----
 src/pages/ContactPage.tsx      |  28 +++----
 src/pages/GalleryPage.tsx      |   8 +-
 src/pages/Index.tsx            |   6 +-
 src/pages/ProductDetail.tsx    | 172 ++++++++++++++++++++---------------------
 src/pages/ProfilePage.tsx      |  28 +++----
 src/pages/SearchPage.tsx       |  16 ++--
 src/pages/StyleQuiz.tsx        |  14 ++--
 src/pages/WeddingChecklist.tsx |   2 +-
 src/pages/WishlistPage.tsx     |  14 ++--
 16 files changed, 266 insertions(+), 266 deletions(-)

## Diff
diff --git a/src/App.tsx b/src/App.tsx
index 04ed032..eaeeef8 100644
--- a/src/App.tsx
+++ b/src/App.tsx
@@ -118,21 +118,21 @@ function MaintenanceGate({ children }: { children: React.ReactNode }) {
 
   if (settings.advanced.maintenanceMode && !isAdmin) {
     return (
       <div className="min-h-screen bg-onyx flex items-center justify-center text-center px-6">
         <div className="max-w-md">
           <h1 className="font-heading text-4xl md:text-5xl text-gold uppercase tracking-widest mb-4">Atelier Riman</h1>
           <div className="w-16 h-px bg-gold mx-auto mb-8" />
           <p className="font-body text-ivory/60 text-sm tracking-widest uppercase mb-2">
             {settings.advanced.maintenanceMessage || 'We are currently updating our atelier.'}
           </p>
-          <p className="font-body text-ivory/30 text-[10px] tracking-widest uppercase mt-6">
+          <p className="font-body text-ivory/30 text-micro tracking-widest uppercase mt-6">
             Please check back soon.
           </p>
         </div>
       </div>
     );
   }
 
   return <>{children}</>;
 }
 
diff --git a/src/pages/AboutPage.tsx b/src/pages/AboutPage.tsx
index d292f86..bb11c22 100644
--- a/src/pages/AboutPage.tsx
+++ b/src/pages/AboutPage.tsx
@@ -16,21 +16,21 @@ export default function AboutPage() {
             alt="Atelier Craftsman"
             className="w-full h-full object-cover brightness-[0.7]"
           />
           <div className="absolute inset-0 bg-stone-900/40" />
         </div>
         
         <div className="container mx-auto px-6 relative z-10 text-center">
           <motion.span 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
-            className="text-[10px] text-white/70 uppercase tracking-[0.5em] mb-6 block"
+            className="text-micro text-white/70 uppercase tracking-[0.5em] mb-6 block"
           >
             {t('about.hero_subtitle')}
           </motion.span>
           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="font-heading text-6xl md:text-8xl text-white tracking-tighter mb-8"
           >
             {t('about.hero_title').split(' ').map((word, i) => i === 2 ? <span key={i} className="italic font-serif">{word}</span> : word + ' ')}
@@ -72,21 +72,21 @@ export default function AboutPage() {
               src="/assets/rimanfashion_3638158883472325906_1739454936_2_2025-05-22.jpg"
               alt="Couture Details"
               className="w-full aspect-[4/5] object-cover"
               loading="lazy"
             />
             <div className="absolute -bottom-10 -left-10 bg-ivory p-10 hidden md:block border border-stone-100 max-w-xs">
               <Quote className="text-gold w-8 h-8 mb-4" />
               <p className="font-body text-stone-800 italic text-sm mb-4">
                 "{t('about.quote')}"
               </p>
-              <span className="text-[10px] uppercase tracking-widest text-stone-400">{t('about.quote_author')}</span>
+              <span className="text-micro uppercase tracking-widest text-stone-600">{t('about.quote_author')}</span>
             </div>
           </motion.div>
         </div>
       </section>
 
       {/* Pillars of Excellence */}
       <section className="bg-stone-900 py-32 text-ivory overflow-hidden relative">
         <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
           <div className="absolute top-20 left-1/4 w-96 h-96 border border-ivory/20 rounded-full" />
           <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] border border-ivory/20 rounded-full" />
@@ -116,21 +116,21 @@ export default function AboutPage() {
             />
           </div>
         </div>
       </section>
 
       {/* The Design Team Section */}
       <section className="section-padding bg-ivory">
         <ScrollReveal>
           <div className="container mx-auto">
             <div className="flex flex-col items-center text-center mb-16">
-              <h2 className="heading-editorial text-stone-400 text-sm mb-4">{t('about.visionaries')}</h2>
+              <h2 className="heading-editorial text-stone-600 text-sm mb-4">{t('about.visionaries')}</h2>
               <h3 className="font-heading text-4xl text-stone-800 tracking-wide">{t('about.collective')}</h3>
               <div className="divider-gold mt-6" />
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
               <TeamMember
                 name="Sarah Mansour"
                 role={t('about.role_founder')}
                 image="/assets/rimanfashion_3542687554351211237_227867687_1_2025-01-10.jpg"
               />
@@ -149,26 +149,26 @@ export default function AboutPage() {
         </ScrollReveal>
       </section>
 
       {/* Aesthetic Mosaic */}
       <section className="py-32 bg-ivory">
         <div className="container mx-auto px-6">
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
             <img src="/assets/rimanfashion_3542687554351211237_227867687_2_2025-01-10.jpg" className="w-full aspect-square object-cover" alt="Riman atelier beadwork detail" loading="lazy" />
             <div className="bg-ivory flex flex-col justify-center p-8 text-center border border-stone-50">
                <h4 className="font-heading text-3xl text-gold mb-2">10k+</h4>
-                <p className="text-[10px] text-stone-400 uppercase tracking-widest">{t('about.stat_beads')}</p>
+                <p className="text-micro text-stone-600 uppercase tracking-widest">{t('about.stat_beads')}</p>
             </div>
             <img src="/assets/rimanfashion_3638158883472325906_1739454936_2_2025-05-22.jpg" className="w-full aspect-square object-cover" alt="Riman couture runway collection" loading="lazy" />
             <div className="bg-stone-900 text-ivory flex flex-col justify-center p-8 text-center">
                <h4 className="font-heading text-3xl text-gold mb-2">120</h4>
-                <p className="text-[10px] text-ivory/40 uppercase tracking-widest">{t('about.stat_runways')}</p>
+                <p className="text-micro text-ivory/40 uppercase tracking-widest">{t('about.stat_runways')}</p>
             </div>
           </div>
         </div>
       </section>
     </div>
   );
 }
 
 function TeamMember({ name, role, image }: { name: string, role: string, image: string }) {
   return (
@@ -178,21 +178,21 @@ function TeamMember({ name, role, image }: { name: string, role: string, image:
           src={image} 
           alt={name} 
           className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 filter grayscale group-hover:grayscale-0" 
           loading="lazy"
         />
         <div className="absolute inset-0 bg-onyx/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
           <span className="w-12 h-px bg-gold" />
         </div>
       </div>
       <h4 className="font-heading text-lg text-stone-800 mb-1">{name}</h4>
-      <p className="text-[10px] tracking-widest text-gold uppercase">{role}</p>
+      <p className="text-micro tracking-widest text-gold uppercase">{role}</p>
     </div>
   );
 }
 
 function Pillar({ icon: Icon, title, desc }: any) {
   return (
     <div className="text-center group">
       <div className="w-16 h-16 rounded-full border border-stone-700 flex items-center justify-center mx-auto mb-8 group-hover:border-gold group-hover:bg-gold/5 transition-all duration-500">
         <Icon className="w-6 h-6 text-gold" />
       </div>
diff --git a/src/pages/AlterationsPage.tsx b/src/pages/AlterationsPage.tsx
index 6ef9721..c2134e7 100644
--- a/src/pages/AlterationsPage.tsx
+++ b/src/pages/AlterationsPage.tsx
@@ -19,21 +19,21 @@ export default function AlterationsPage() {
       {/* Hero */}
       <section className="bg-ivory py-32 border-b border-gold/10">
         <div className="container mx-auto px-6 text-center max-w-4xl">
           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="font-heading text-5xl md:text-7xl text-stone-800 tracking-tight mb-8"
           >
             {t('alt.hero_title')}
           </motion.h1>
-          <p className="font-body text-stone-500 text-sm md:text-base tracking-widest uppercase mb-12 max-w-2xl mx-auto leading-relaxed">
+          <p className="font-body text-stone-600 text-sm md:text-base tracking-widest uppercase mb-12 max-w-2xl mx-auto leading-relaxed">
             {t('alt.hero_desc')}
           </p>
           <div className="flex flex-wrap justify-center gap-6">
             <Link to="/contact" className="btn-luxury px-12 italic">{t('alt.book_fitting')}</Link>
           </div>
         </div>
       </section>
 
       {/* Services Grid */}
       <section className="section-padding container mx-auto">
@@ -90,32 +90,32 @@ export default function AlterationsPage() {
 <img 
              src="/images/alterations-detail.jpg" 
              alt="Tailoring details" 
              className="w-full h-full object-cover min-h-[400px]"
              loading="lazy"
            />
           <div className="p-12 md:p-20 flex flex-col justify-center">
             <h3 className="font-heading text-3xl md:text-4xl text-stone-800 mb-8 leading-tight">
               {t('alt.cta_heading')}
             </h3>
-            <p className="font-body text-stone-500 mb-10 text-sm leading-loose">
+            <p className="font-body text-stone-600 mb-10 text-sm leading-loose">
               {t('alt.cta_desc')}
             </p>
             <div className="space-y-4">
               <div className="flex items-center gap-4 text-xs tracking-widest text-stone-800 uppercase font-bold">
                  <Calendar className="w-4 h-4 text-gold" /> {t('alt.available')}
               </div>
               <div className="flex items-center gap-4 text-xs tracking-widest text-stone-800 uppercase font-bold">
                  <Ruler className="w-4 h-4 text-gold" /> {t('alt.guarantee')}
               </div>
             </div>
-            <Link to="/contact" className="mt-12 group flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] text-gold font-black transition-all hover:gap-6">
+            <Link to="/contact" className="mt-12 group flex items-center gap-4 text-micro uppercase tracking-[0.4em] text-gold font-black transition-all hover:gap-6">
               {t('alt.inquire')} <ArrowRight className="w-4 h-4" />
             </Link>
           </div>
         </div>
       </section>
 
       {/* Appointment Booking Section */}
       <section className="border-t border-stone-100">
         <AppointmentPage />
       </section>
@@ -123,14 +123,14 @@ export default function AlterationsPage() {
   );
 }
 
 function ServiceCard({ icon: Icon, title, desc }: any) {
   return (
     <div className="bg-ivory p-12 border border-stone-100 hover:border-gold/30 transition-all duration-500 group">
       <div className="w-12 h-12 bg-ivory text-gold flex items-center justify-center mb-8 rounded-sm group-hover:bg-gold group-hover:text-white transition-colors">
         <Icon className="w-5 h-5" />
       </div>
       <h3 className="font-heading text-xl mb-4 tracking-widest uppercase text-stone-800">{title}</h3>
-      <p className="font-body text-xs text-stone-400 leading-relaxed uppercase tracking-wider">{desc}</p>
+      <p className="font-body text-xs text-stone-600 leading-relaxed uppercase tracking-wider">{desc}</p>
     </div>
   );
 }
diff --git a/src/pages/AppointmentPage.tsx b/src/pages/AppointmentPage.tsx
index 04a7502..00fb36e 100644
--- a/src/pages/AppointmentPage.tsx
+++ b/src/pages/AppointmentPage.tsx
@@ -105,28 +105,28 @@ export default function AppointmentPage() {
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-center max-w-lg mx-auto px-6"
         >
           <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-8">
             <CheckCircle2 className="w-10 h-10 text-gold" />
           </div>
           <h1 className="font-heading text-4xl font-light text-stone-800 mb-4">{t('appointment.booked')}</h1>
           <div className="w-12 h-px bg-gold mx-auto mb-6" />
-          <p className="font-body text-stone-500 leading-relaxed mb-2">
+          <p className="font-body text-stone-600 leading-relaxed mb-2">
             {t('appointment.thank_you')}, <span className="text-stone-800 font-semibold">{form.name}</span>.
           </p>
-          <p className="font-body text-stone-500 leading-relaxed mb-8">
+          <p className="font-body text-stone-600 leading-relaxed mb-8">
             {t('appointment.appointment_booked_for')} <span className="text-stone-800 font-semibold">{new Date(form.date).toLocaleDateString(isRtl ? 'ar-AE' : 'en-AE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span> {t('appointment.at')} <span className="text-stone-800 font-semibold">{form.time}</span>.
           </p>
           <div className="w-12 h-px bg-gold mx-auto mb-6" />
-          <p className="font-body text-sm text-stone-400 mb-10">{t('appointment.confirmation_sent')} {form.email}. {t('appointment.our_team_reach')}</p>
+          <p className="font-body text-sm text-stone-600 mb-10">{t('appointment.confirmation_sent')} {form.email}. {t('appointment.our_team_reach')}</p>
           <a
             href={buildWhatsAppUrl(
               incomingGowns.length
                 ? `${t('appointment.booked')} ΓÇö ${form.name}, ${form.date} ${form.time}. ${t('appointment.your_gowns')}: ${gownNames.join(', ')}`
                 : `${t('appointment.booked')} ΓÇö ${form.name}, ${form.date} ${form.time}`
             )}
             target="_blank"
             rel="noopener noreferrer"
             className="btn-luxury-outline inline-block mt-4 px-10"
           >
@@ -134,193 +134,193 @@ export default function AppointmentPage() {
           </a>
           <Link to="/collection/all" className="btn-luxury">{t('appointment.explore_collection')}</Link>
         </motion.div>
       </div>
     );
   }
 
   return (
     <div className="pt-24 min-h-screen bg-champagne">
       <div className="container mx-auto px-6 py-16 max-w-4xl">
-        <nav className="flex gap-2 text-xs tracking-[0.2em] uppercase text-stone-400 mb-8">
+        <nav className="flex gap-2 text-xs tracking-[0.2em] uppercase text-stone-600 mb-8">
           <Link to="/" className="hover:text-gold transition-colors">{t('nav.home')}</Link>
           <span>/</span>
           <span className="text-stone-800 font-medium">{t('cta.appointment')}</span>
         </nav>
 
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
           <div className="text-center mb-12">
             <div className="flex items-center justify-center gap-3 mb-4">
               <span className="w-8 h-px bg-gold" />
               <Sparkles className="w-4 h-4 text-gold" />
               <span className="w-8 h-px bg-gold" />
             </div>
             <h1 className="font-heading text-4xl md:text-5xl font-light text-stone-800 mb-4">{t('appointment.heading')}</h1>
-            <p className="font-body text-stone-500 max-w-xl mx-auto leading-relaxed">
+            <p className="font-body text-stone-600 max-w-xl mx-auto leading-relaxed">
               {t('appointment.desc')}
             </p>
           </div>
 
           {/* Progress Steps */}
           <div className="flex items-center justify-center gap-4 mb-12">
             {[1, 2, 3].map(s => (
               <button key={s} onClick={() => { if (s < step) setStep(s); }} className="flex items-center gap-3">
-                <div className={step >= s ? "w-10 h-10 bg-gold text-white flex items-center justify-center text-xs font-bold transition-all" : "w-10 h-10 border border-stone-200 text-stone-400 flex items-center justify-center text-xs font-bold"}>
+                <div className={step >= s ? "w-10 h-10 bg-gold text-white flex items-center justify-center text-xs font-bold transition-all" : "w-10 h-10 border border-stone-200 text-stone-600 flex items-center justify-center text-xs font-bold"}>
                   {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                 </div>
-                <span className={step >= s ? "text-xs tracking-widest uppercase font-bold text-stone-800 hidden md:block" : "text-xs tracking-widest uppercase text-stone-400 hidden md:block"}>
+                <span className={step >= s ? "text-xs tracking-widest uppercase font-bold text-stone-800 hidden md:block" : "text-xs tracking-widest uppercase text-stone-600 hidden md:block"}>
                   {s === 1 ? t('appointment.step_details') : s === 2 ? t('appointment.step_schedule') : t('appointment.step_confirm')}
                 </span>
                 {s < 3 && <div className={step > s ? "w-12 h-px bg-gold hidden md:block" : "w-12 h-px bg-stone-200 hidden md:block"} />}
               </button>
             ))}
           </div>
 
           <AnimatePresence mode="wait">
             {step === 1 && (
               <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-ivory p-8 md:p-12 border border-stone-100">
                 <div className="mb-8">
                   <h2 className="font-heading text-2xl font-light text-stone-800">{t('appointment.your_details')}</h2>
                   <div className="w-8 h-px bg-gold mt-3" />
                 </div>
                 {incomingGowns.length > 0 && (
                   <div className="mb-6 p-4 border border-gold/30 bg-gold/[0.04]">
-                    <p className="text-[10px] tracking-widest uppercase text-stone-800 font-bold mb-2">{t('appointment.your_gowns')}</p>
+                    <p className="text-micro tracking-widest uppercase text-stone-800 font-bold mb-2">{t('appointment.your_gowns')}</p>
                     <ul className="space-y-1">
                       {incomingGowns.map((g, i) => (
                         <li key={`${g.id}-${i}`} className="text-xs text-stone-600 italic">{g.name}{g.size ? ` ┬╖ ${g.size}` : ''}</li>
                       ))}
                     </ul>
                   </div>
                 )}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
-                    <label className="block text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-2">{t('appointment.full_name')}</label>
+                    <label className="block text-micro tracking-[0.3em] uppercase text-stone-600 font-bold mb-2">{t('appointment.full_name')}</label>
                     <div className="relative">
-                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
-                      <input type="text" value={form.name} onChange={e => updateForm('name', e.target.value)} placeholder="Your full name" className="w-full pl-11 bg-transparent border-0 border-b border-stone-300 focus:border-gold focus:ring-0 rounded-none py-3 outline-none transition-colors duration-500 text-stone-800 placeholder:text-stone-500" />
+                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
+                      <input type="text" value={form.name} onChange={e => updateForm('name', e.target.value)} placeholder="Your full name" className="w-full pl-11 bg-transparent border-0 border-b border-stone-300 focus:border-gold focus:ring-0 rounded-none py-3 outline-none transition-colors duration-500 text-stone-800 placeholder:text-stone-600" />
                     </div>
                   </div>
                   <div>
-                    <label className="block text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-2">{t('appointment.email')}</label>
+                    <label className="block text-micro tracking-[0.3em] uppercase text-stone-600 font-bold mb-2">{t('appointment.email')}</label>
                     <div className="relative">
-                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
-                      <input type="email" value={form.email} onChange={e => updateForm('email', e.target.value)} placeholder="your@email.com" className="w-full pl-11 bg-transparent border-0 border-b border-stone-300 focus:border-gold focus:ring-0 rounded-none py-3 outline-none transition-colors duration-500 text-stone-800 placeholder:text-stone-500" />
+                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
+                      <input type="email" value={form.email} onChange={e => updateForm('email', e.target.value)} placeholder="your@email.com" className="w-full pl-11 bg-transparent border-0 border-b border-stone-300 focus:border-gold focus:ring-0 rounded-none py-3 outline-none transition-colors duration-500 text-stone-800 placeholder:text-stone-600" />
                     </div>
                   </div>
                   <div>
-                    <label className="block text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-2">{t('appointment.phone')}</label>
+                    <label className="block text-micro tracking-[0.3em] uppercase text-stone-600 font-bold mb-2">{t('appointment.phone')}</label>
                     <div className="relative">
-                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
-                      <input type="tel" value={form.phone} onChange={e => updateForm('phone', e.target.value)} placeholder="+971 50 000 0000" className="w-full pl-11 bg-transparent border-0 border-b border-stone-300 focus:border-gold focus:ring-0 rounded-none py-3 outline-none transition-colors duration-500 text-stone-800 placeholder:text-stone-500" />
+                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
+                      <input type="tel" value={form.phone} onChange={e => updateForm('phone', e.target.value)} placeholder="+971 50 000 0000" className="w-full pl-11 bg-transparent border-0 border-b border-stone-300 focus:border-gold focus:ring-0 rounded-none py-3 outline-none transition-colors duration-500 text-stone-800 placeholder:text-stone-600" />
                     </div>
                   </div>
                   <div>
-                    <label className="block text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-2">{t('appointment.service_type')}</label>
-                    <select value={form.service_type} onChange={e => updateForm('service_type', e.target.value)} className="w-full bg-transparent border-0 border-b border-stone-300 focus:border-gold focus:ring-0 rounded-none py-3 outline-none transition-colors duration-500 text-stone-800 placeholder:text-stone-500">
+                    <label className="block text-micro tracking-[0.3em] uppercase text-stone-600 font-bold mb-2">{t('appointment.service_type')}</label>
+                    <select value={form.service_type} onChange={e => updateForm('service_type', e.target.value)} className="w-full bg-transparent border-0 border-b border-stone-300 focus:border-gold focus:ring-0 rounded-none py-3 outline-none transition-colors duration-500 text-stone-800 placeholder:text-stone-600">
                       <option value="">{t('appointment.select_service')}</option>
                       {SERVICE_TYPES.map(s => (
                         <option key={s.value} value={s.value}>{s.icon} {s.label}</option>
                       ))}
                     </select>
                   </div>
                 </div>
                 {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                 <button onClick={() => { if (form.name && form.email && form.phone && form.service_type) { setError(''); setStep(2); } else setError(t('appointment.fill_all')); }} className="btn-luxury mt-8 w-full md:w-auto">{t('appointment.continue_scheduling')}</button>
               </motion.div>
             )}
 
             {step === 2 && (
               <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-ivory p-8 md:p-12 border border-stone-100">
                 <div className="mb-8">
                   <h2 className="font-heading text-2xl font-light text-stone-800">{t('appointment.choose_datetime')}</h2>
                   <div className="w-8 h-px bg-gold mt-3" />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div>
-                    <label className="block text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-4">
+                    <label className="block text-micro tracking-[0.3em] uppercase text-stone-600 font-bold mb-4">
                       <Calendar className="w-4 h-4 inline mr-2" />
                       {t('appointment.select_date')}
                     </label>
-                    <input type="date" value={form.date} onChange={e => updateForm('date', e.target.value)} min={today} className="w-full bg-transparent border-0 border-b border-stone-300 focus:border-gold focus:ring-0 rounded-none py-3 outline-none transition-colors duration-500 text-stone-800 placeholder:text-stone-500" />
+                    <input type="date" value={form.date} onChange={e => updateForm('date', e.target.value)} min={today} className="w-full bg-transparent border-0 border-b border-stone-300 focus:border-gold focus:ring-0 rounded-none py-3 outline-none transition-colors duration-500 text-stone-800 placeholder:text-stone-600" />
                   </div>
                   <div>
-                    <label className="block text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-4">
+                    <label className="block text-micro tracking-[0.3em] uppercase text-stone-600 font-bold mb-4">
                       <Clock className="w-4 h-4 inline mr-2" />
                       {t('appointment.select_time')}
                     </label>
                     <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                       {TIME_SLOTS.map(slot => (
                         <button
                           key={slot}
                           onClick={() => updateForm('time', formatSlot(slot))}
                           className={form.time === formatSlot(slot)
                             ? "py-3 text-xs tracking-widest font-bold bg-gold text-white border border-gold transition-all"
                             : "py-3 text-xs tracking-widest border border-stone-200 text-stone-600 hover:border-gold hover:text-gold transition-all"}
                         >
                           {formatSlot(slot)}
                         </button>
                       ))}
                     </div>
                   </div>
                 </div>
                 <div className="mt-6">
-                  <label className="block text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-2">
+                  <label className="block text-micro tracking-[0.3em] uppercase text-stone-600 font-bold mb-2">
                     <MessageSquare className="w-4 h-4 inline mr-2" />
                     {t('appointment.special_requests')}
                   </label>
-                  <textarea value={form.notes} onChange={e => updateForm('notes', e.target.value)} rows={3} placeholder={t('appointment.notes_placeholder')} className="w-full bg-transparent border-0 border-b border-stone-300 focus:border-gold focus:ring-0 rounded-none py-3 outline-none transition-colors duration-500 text-stone-800 placeholder:text-stone-500" />
+                  <textarea value={form.notes} onChange={e => updateForm('notes', e.target.value)} rows={3} placeholder={t('appointment.notes_placeholder')} className="w-full bg-transparent border-0 border-b border-stone-300 focus:border-gold focus:ring-0 rounded-none py-3 outline-none transition-colors duration-500 text-stone-800 placeholder:text-stone-600" />
                 </div>
                 {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                 <div className="flex gap-4 mt-8">
                   <button onClick={() => setStep(1)} className="btn-luxury-outline">{t('appointment.back')}</button>
                   <button onClick={() => { if (form.date && form.time) { setError(''); setStep(3); } else setError(t('appointment.select_date_time')); }} className="btn-luxury">{t('appointment.review_booking')}</button>
                 </div>
               </motion.div>
             )}
 
             {step === 3 && (
               <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-ivory p-8 md:p-12 border border-stone-100">
                 <div className="mb-8">
                   <h2 className="font-heading text-2xl font-light text-stone-800">{t('appointment.review_confirm')}</h2>
                   <div className="w-8 h-px bg-gold mt-3" />
                 </div>
                 <div className="bg-ivory p-8 border border-stone-100 mb-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
-                      <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-1">{t('appointment.name')}</p>
+                      <p className="text-micro tracking-[0.3em] uppercase text-stone-600 font-bold mb-1">{t('appointment.name')}</p>
                       <p className="font-heading text-stone-800">{form.name}</p>
                     </div>
                     <div>
-                      <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-1">{t('appointment.email_label')}</p>
+                      <p className="text-micro tracking-[0.3em] uppercase text-stone-600 font-bold mb-1">{t('appointment.email_label')}</p>
                       <p className="font-heading text-stone-800">{form.email}</p>
                     </div>
                     <div>
-                      <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-1">{t('appointment.phone_label')}</p>
+                      <p className="text-micro tracking-[0.3em] uppercase text-stone-600 font-bold mb-1">{t('appointment.phone_label')}</p>
                       <p className="font-heading text-stone-800">{form.phone}</p>
                     </div>
                     <div>
-                      <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-1">{t('appointment.service_label')}</p>
+                      <p className="text-micro tracking-[0.3em] uppercase text-stone-600 font-bold mb-1">{t('appointment.service_label')}</p>
                       <p className="font-heading text-stone-800">{SERVICE_TYPES.find(s => s.value === form.service_type)?.label}</p>
                     </div>
                     <div>
-                      <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-1">{t('appointment.date_label')}</p>
+                      <p className="text-micro tracking-[0.3em] uppercase text-stone-600 font-bold mb-1">{t('appointment.date_label')}</p>
                       <p className="font-heading text-stone-800">{form.date ? new Date(form.date).toLocaleDateString(isRtl ? 'ar-AE' : 'en-AE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''}</p>
                     </div>
                     <div>
-                      <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-1">{t('appointment.time_label')}</p>
+                      <p className="text-micro tracking-[0.3em] uppercase text-stone-600 font-bold mb-1">{t('appointment.time_label')}</p>
                       <p className="font-heading text-stone-800">{form.time}</p>
                     </div>
                   </div>
                   {form.notes && (
                     <div className="mt-6 pt-6 border-t border-stone-200">
-                      <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-1">{t('appointment.special_requests')}</p>
+                      <p className="text-micro tracking-[0.3em] uppercase text-stone-600 font-bold mb-1">{t('appointment.special_requests')}</p>
                       <p className="font-body text-stone-600 text-sm">{form.notes}</p>
                     </div>
                   )}
                 </div>
                 {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                 <div className="flex gap-4">
                   <button onClick={() => setStep(2)} className="btn-luxury-outline">{t('appointment.back')}</button>
                   <button onClick={handleSubmit} disabled={isSubmitting} className="btn-luxury flex items-center justify-center gap-2 flex-1">
                     {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> {t('appointment.confirming')}</> : t('appointment.confirm_booking')}
                   </button>
diff --git a/src/pages/Auth.tsx b/src/pages/Auth.tsx
index 7ea996d..e0f8f84 100644
--- a/src/pages/Auth.tsx
+++ b/src/pages/Auth.tsx
@@ -70,119 +70,119 @@ export default function Auth() {
         className="max-w-md w-full bg-ivory p-10 md:p-12 border border-stone-100 relative overflow-hidden"
       >
         <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl -translate-y-1/2 translate-x-1/2" />
 
         <div className="text-center mb-10 relative z-10 flex flex-col items-center">
           <Logo variant="gold" className="w-20 mb-6" />
           <h1 className="font-heading text-3xl text-stone-800 tracking-wider uppercase mb-3">
             {isLogin ? t('auth.signin') : t('auth.signup')}
           </h1>
           <div className="w-12 h-px bg-gold mb-3" />
-          <p className="font-body text-stone-400 text-[10px] tracking-[0.2em] uppercase">
+          <p className="font-body text-stone-600 text-micro tracking-[0.2em] uppercase">
             {isLogin ? t('auth.welcome_back') : t('auth.join')}
           </p>
         </div>
 
         <AnimatePresence mode="wait">
           {success ? (
             <motion.div
               key="success"
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="text-center py-10"
             >
               <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                 <CheckCircle2 className="w-8 h-8" />
               </div>
               <h3 className="font-heading text-xl text-stone-800 mb-2 uppercase tracking-widest">{t('auth.authenticated')}</h3>
               <div className="w-12 h-px bg-gold mx-auto mb-3" />
-              <p className="text-stone-400 text-[10px] tracking-widest uppercase">{t('auth.redirecting')}</p>
+              <p className="text-stone-600 text-micro tracking-widest uppercase">{t('auth.redirecting')}</p>
             </motion.div>
           ) : (
             <motion.form
               key="form"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onSubmit={handleSubmit}
               className="space-y-6 relative z-10"
             >
               {!isLogin && (
                 <div className="space-y-2">
-                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
+                  <label className="text-micro font-bold text-stone-600 uppercase tracking-widest flex items-center gap-2">
                     <User className="w-3 h-3 text-gold" /> {t('auth.full_name')}
                   </label>
                   <input
                     type="text"
                     required
                     value={formData.name}
                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                     className="w-full bg-stone-50 border-stone-100 p-4 text-xs tracking-widest outline-none focus:bg-ivory focus:border-gold transition-all"
                     placeholder={t('auth.name_placeholder')}
                   />
                 </div>
               )}
 
               <div className="space-y-2">
-                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
+                <label className="text-micro font-bold text-stone-600 uppercase tracking-widest flex items-center gap-2">
                   <Mail className="w-3 h-3 text-gold" /> {t('auth.email')}
                 </label>
                 <input
                   type="email"
                   required
                   value={formData.email}
                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                   className="w-full bg-stone-50 border-stone-100 p-4 text-xs tracking-widest outline-none focus:bg-ivory focus:border-gold transition-all"
                   placeholder={t('auth.email_placeholder')}
                 />
               </div>
 
               <div className="space-y-2">
-                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
+                <label className="text-micro font-bold text-stone-600 uppercase tracking-widest flex items-center gap-2">
                   <Lock className="w-3 h-3 text-gold" /> {t('auth.password')}
                 </label>
                 <input
                   type="password"
                   required
                   minLength={6}
                   value={formData.password}
                   onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                   className="w-full bg-stone-50 border-stone-100 p-4 text-xs tracking-widest outline-none focus:bg-ivory focus:border-gold transition-all"
                   placeholder={t('auth.password_placeholder')}
                 />
               </div>
 
-              {displayError && <p className="text-[10px] text-rose-500 uppercase tracking-widest text-center">{displayError}</p>}
+              {displayError && <p className="text-micro text-rose-500 uppercase tracking-widest text-center">{displayError}</p>}
 
               <button type="submit" className="w-full btn-luxury group flex items-center justify-center gap-3 !py-5">
                 {isLogin ? t('auth.enter_atelier') : t('auth.create_profile')}
                 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </button>
 
               <div className="pt-6 border-t border-stone-100 text-center space-y-4">
                 <button
                   type="button"
                   onClick={() => { setIsLogin(!isLogin); setLocalError(''); }}
-                  className="text-[10px] text-stone-400 uppercase tracking-[0.2em] hover:text-gold transition-colors block w-full"
+                  className="text-micro text-stone-600 uppercase tracking-[0.2em] hover:text-gold transition-colors block w-full"
                 >
                   {isLogin ? t('auth.no_account') : t('auth.has_account')}
                 </button>
 
                 <button
                   type="button"
                   onClick={() => {
                     localStorage.clear();
                     sessionStorage.clear();
                     navigate('/auth', { replace: true });
                     window.location.reload();
                   }}
-                  className="text-[8px] text-stone-300 uppercase tracking-[0.3em] hover:text-rose-400 transition-colors"
+                  className="text-micro text-stone-500 uppercase tracking-[0.3em] hover:text-rose-400 transition-colors"
                 >
                   {t('auth.clear_session')}
                 </button>
               </div>
             </motion.form>
           )}
         </AnimatePresence>
       </motion.div>
     </div>
   );
diff --git a/src/pages/Checkout.tsx b/src/pages/Checkout.tsx
index 6dfc984..621e04f 100644
--- a/src/pages/Checkout.tsx
+++ b/src/pages/Checkout.tsx
@@ -255,57 +255,57 @@ export default function Checkout() {
     } finally {
       setIsProcessing(false);
     }
   };
 
   if (items.length === 0 && !orderComplete) {
     return (
       <div className="pt-8 pb-20 px-6 min-h-[60vh] flex flex-col items-center justify-center text-center bg-ivory">
         <h1 className="font-heading text-4xl text-stone-800 uppercase mb-4">{t('checkout.empty')}</h1>
         <div className="w-12 h-px bg-gold mx-auto mb-6" />
-        <p className="font-body text-stone-500 text-sm tracking-widest uppercase mb-12 italic">{t('checkout.empty_desc')}</p>
+        <p className="font-body text-stone-600 text-sm tracking-widest uppercase mb-12 italic">{t('checkout.empty_desc')}</p>
         <Link to="/search" className="btn-luxury px-12">{t('checkout.explore')}</Link>
       </div>
     );
   }
 
   if (orderComplete) {
     return (
       <div className="pt-8 pb-20 px-6 min-h-screen flex flex-col items-center justify-center text-center bg-ivory">
         <motion.div
           initial={{ scale: 0.5, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center text-gold mb-8"
         >
           <Check className="w-12 h-12" />
         </motion.div>
         <h1 className="font-heading text-4xl md:text-6xl text-stone-800 uppercase mb-4">{t('checkout.order_received')}</h1>
         <div className="w-12 h-px bg-gold mx-auto mb-6" />
-        <p className="font-body text-stone-500 text-sm tracking-widest uppercase mb-4">{t('checkout.order_preparing')}</p>
-        <p className="font-body text-stone-400 text-xs mb-4 uppercase italic">{t('checkout.confirmation_email')} {formData.email}</p>
-        <p className="font-body text-stone-400 text-xs mb-12 uppercase tracking-widest max-w-md">{t('checkout.contact_24h')}</p>
+        <p className="font-body text-stone-600 text-sm tracking-widest uppercase mb-4">{t('checkout.order_preparing')}</p>
+        <p className="font-body text-stone-600 text-xs mb-4 uppercase italic">{t('checkout.confirmation_email')} {formData.email}</p>
+        <p className="font-body text-stone-600 text-xs mb-12 uppercase tracking-widest max-w-md">{t('checkout.contact_24h')}</p>
         <div className="flex flex-col sm:flex-row gap-4">
           <Link to="/profile" className="btn-luxury px-12 italic">{t('checkout.view_dashboard')}</Link>
           <Link to="/search" className="btn-luxury-outline px-12">{t('checkout.back_to_shop')}</Link>
         </div>
       </div>
     );
   }
 
   return (
     <div className="bg-ivory min-h-screen">
       {/* Minimal top bar (replaces header on checkout) */}
       <div className="sticky top-0 z-40 bg-ivory/95 backdrop-blur-sm border-b border-stone-100">
         <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
-          <Link to="/search" className="flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-colors">
+          <Link to="/search" className="flex items-center gap-2 text-stone-600 hover:text-stone-800 transition-colors">
             <ArrowLeft className={cn("w-4 h-4", isRtl && "rotate-180")} />
-            <span className="text-[10px] tracking-[0.2em] uppercase font-bold hidden sm:inline">{t('checkout.back_to_shop')}</span>
+            <span className="text-micro tracking-[0.2em] uppercase font-bold hidden sm:inline">{t('checkout.back_to_shop')}</span>
           </Link>
           <Link to="/" className="font-heading text-sm tracking-[0.3em] uppercase text-stone-800">Atelier Riman</Link>
           <div className="w-20" />
         </div>
       </div>
 
       <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
         {/* Trust signals */}
         <div className="flex items-center justify-center gap-6 md:gap-10 mb-8 md:mb-12 flex-wrap">
           <TrustBadge icon={<Lock className="w-3.5 h-3.5" />} label={t('checkout.secure_payment')} />
@@ -450,82 +450,82 @@ export default function Checkout() {
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: isRtl ? -20 : 20 }}
                     className="space-y-8"
                   >
                     <SectionHeading title={t('checkout.review')} />
 
                     {/* Details summary */}
                     <div className="bg-ivory/50 p-5 border border-gold/10 space-y-4">
                       <div className="flex items-center justify-between">
                         <h3 className="font-heading text-xs tracking-[0.2em] uppercase text-stone-600">{t('checkout.your_details')}</h3>
-                        <button onClick={() => setStep(1)} className="text-[10px] tracking-widest uppercase text-gold font-bold hover:text-gold-dark transition-colors">
+                        <button onClick={() => setStep(1)} className="text-micro tracking-widest uppercase text-gold font-bold hover:text-gold-dark transition-colors">
                           {t('checkout.previous')}
                         </button>
                       </div>
-                      <div className="grid grid-cols-2 gap-4 text-[11px] tracking-wider uppercase">
+                      <div className="grid grid-cols-2 gap-4 text-micro tracking-wider uppercase">
                         <div>
-                          <span className="text-stone-400 block mb-0.5">{t('checkout.name_label')}</span>
+                          <span className="text-stone-600 block mb-0.5">{t('checkout.name_label')}</span>
                           <span className="text-stone-800 font-medium">{formData.firstName} {formData.lastName}</span>
                         </div>
                         <div>
-                          <span className="text-stone-400 block mb-0.5">{t('checkout.email')}</span>
+                          <span className="text-stone-600 block mb-0.5">{t('checkout.email')}</span>
                           <span className="text-stone-800 font-medium">{formData.email}</span>
                         </div>
                         <div>
-                          <span className="text-stone-400 block mb-0.5">{t('checkout.address')}</span>
+                          <span className="text-stone-600 block mb-0.5">{t('checkout.address')}</span>
                           <span className="text-stone-800 font-medium">{formData.address}</span>
                         </div>
                         <div>
-                          <span className="text-stone-400 block mb-0.5">{t('checkout.city')}</span>
+                          <span className="text-stone-600 block mb-0.5">{t('checkout.city')}</span>
                           <span className="text-stone-800 font-medium">{formData.city}, {formData.country}</span>
                         </div>
                       </div>
                     </div>
 
                     {/* Items */}
                     <div className="space-y-3">
                       <h3 className="font-heading text-xs tracking-[0.2em] uppercase text-stone-600">{t('checkout.your_selections')}</h3>
                       {items.map((item) => (
                         <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4 items-center p-3 border border-stone-100">
                           <div className="w-14 h-18 bg-stone-100 flex-shrink-0 overflow-hidden">
                             <img src={item.images?.[0]} className="w-full h-full object-cover" alt={item.name} />
                           </div>
                           <div className="flex-1 min-w-0">
-                            <p className="text-[10px] text-stone-400 uppercase tracking-widest">{item.category}</p>
+                            <p className="text-micro text-stone-600 uppercase tracking-widest">{item.category}</p>
                             <p className="text-xs uppercase tracking-wider font-bold truncate">{item.name}</p>
-                            {item.selectedSize && <p className="text-[9px] text-stone-400 uppercase">{t('checkout.size')}: {item.selectedSize}</p>}
-                            {item.selectedDate && <p className="text-[9px] text-gold uppercase">{t('checkout.date')}: {new Date(item.selectedDate).toLocaleDateString()}</p>}
+                            {item.selectedSize && <p className="text-micro text-stone-600 uppercase">{t('checkout.size')}: {item.selectedSize}</p>}
+                            {item.selectedDate && <p className="text-micro text-gold uppercase">{t('checkout.date')}: {new Date(item.selectedDate).toLocaleDateString()}</p>}
                           </div>
                           <p className="text-xs text-gold font-medium">{formatPrice((item.rentalPrice || item.salePrice || 0) * item.quantity)}</p>
                         </div>
                       ))}
                     </div>
 
                     {/* Pricing (visible on mobile, hidden on desktop where sidebar shows it) */}
                     <div className="lg:hidden space-y-2 pt-4 border-t border-stone-100">
-                      <div className="flex justify-between text-[10px] tracking-widest uppercase text-stone-400">
+                      <div className="flex justify-between text-micro tracking-widest uppercase text-stone-600">
                         <span>{t('checkout.subtotal')}</span>
                         <span>{formatPrice(subtotal)}</span>
                       </div>
-                      <div className="flex justify-between text-[10px] tracking-widest uppercase text-stone-400">
+                      <div className="flex justify-between text-micro tracking-widest uppercase text-stone-600">
                         <span>{t('checkout.delivery')}</span>
                         <span>{t('checkout.complimentary')}</span>
                       </div>
                       <div className="flex justify-between font-heading text-xl pt-4 border-t border-stone-100 mt-4">
                         <span className="uppercase text-sm tracking-widest pt-1">{t('checkout.total')}</span>
                         <span className="text-gold">{formatPrice(subtotal)}</span>
                       </div>
                     </div>
 
                     {/* Order notes */}
                     <div className="space-y-3">
-                      <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold flex items-center gap-2">
+                      <label className="text-micro uppercase tracking-widest text-stone-600 font-bold flex items-center gap-2">
                         <MessageSquare className="w-3 h-3 text-gold" /> {t('checkout.order_notes')}
                       </label>
                       <textarea
                         value={orderNotes}
                         onChange={(e) => setOrderNotes(e.target.value)}
                         rows={3}
                         className="w-full bg-stone-50 border border-stone-100 p-4 text-xs tracking-widest outline-none focus:border-gold transition-all resize-none"
                         placeholder={t('checkout.notes_placeholder')}
                       />
                     </div>
@@ -534,69 +534,69 @@ export default function Checkout() {
                     <div className="space-y-4">
                       <h3 className="font-heading text-xs tracking-[0.2em] uppercase text-stone-600">{t('checkout.payment_method')}</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                         <button
                           type="button"
                           onClick={() => setPaymentMethod('atelier')}
                           className={cn(
                             "flex items-center gap-4 p-4 border text-left transition-all",
                             paymentMethod === 'atelier'
                               ? "bg-gold/5 border-gold/30 text-stone-800"
-                              : "bg-ivory border-stone-100 text-stone-400 hover:border-stone-300"
+                              : "bg-ivory border-stone-100 text-stone-600 hover:border-stone-300"
                           )}
                         >
-                          <Building2 className={cn("w-5 h-5 shrink-0", paymentMethod === 'atelier' ? 'text-gold' : 'text-stone-300')} />
+                          <Building2 className={cn("w-5 h-5 shrink-0", paymentMethod === 'atelier' ? 'text-gold' : 'text-stone-500')} />
                           <div>
-                            <p className="text-[10px] tracking-widest uppercase font-bold">{t('checkout.pay_atelier')}</p>
-                            <p className="text-[9px] text-stone-400 mt-0.5 tracking-wide">{t('checkout.pay_atelier_desc')}</p>
+                            <p className="text-micro tracking-widest uppercase font-bold">{t('checkout.pay_atelier')}</p>
+                            <p className="text-micro text-stone-600 mt-0.5 tracking-wide">{t('checkout.pay_atelier_desc')}</p>
                           </div>
                         </button>
                         <button
                           type="button"
                           onClick={() => setPaymentMethod('card')}
                           className={cn(
                             "flex items-center gap-4 p-4 border text-left transition-all",
                             paymentMethod === 'card'
                               ? "bg-gold/5 border-gold/30 text-stone-800"
-                              : "bg-ivory border-stone-100 text-stone-400 hover:border-stone-300"
+                              : "bg-ivory border-stone-100 text-stone-600 hover:border-stone-300"
                           )}
                         >
-                          <CreditCard className={cn("w-5 h-5 shrink-0", paymentMethod === 'card' ? 'text-gold' : 'text-stone-300')} />
+                          <CreditCard className={cn("w-5 h-5 shrink-0", paymentMethod === 'card' ? 'text-gold' : 'text-stone-500')} />
                           <div>
-                            <p className="text-[10px] tracking-widest uppercase font-bold">{t('checkout.pay_online')}</p>
-                            <p className="text-[9px] text-stone-400 mt-0.5 tracking-wide">{t('checkout.pay_online_desc')}</p>
+                            <p className="text-micro tracking-widest uppercase font-bold">{t('checkout.pay_online')}</p>
+                            <p className="text-micro text-stone-600 mt-0.5 tracking-wide">{t('checkout.pay_online_desc')}</p>
                           </div>
                         </button>
                       </div>
                     </div>
 
                     {/* Payment info box */}
                     <div className={cn("p-4 border flex items-start gap-3", paymentMethod === 'card' ? 'bg-emerald-50/50 border-emerald-200/50' : 'bg-gold/5 border-gold/10')}>
                       {paymentMethod === 'card' ? <CreditCard className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" /> : <Truck className="w-5 h-5 text-gold shrink-0 mt-0.5" />}
                       <div>
-                        <p className="text-[10px] tracking-widest text-stone-600 uppercase font-bold">
+                        <p className="text-micro tracking-widest text-stone-600 uppercase font-bold">
                           {paymentMethod === 'card' ? t('checkout.secure_online') : t('checkout.instore_payment')}
                         </p>
-                        <p className="text-[10px] text-stone-400 mt-1">
+                        <p className="text-micro text-stone-600 mt-1">
                           {paymentMethod === 'card'
                             ? t('checkout.secure_online_desc')
                             : t('checkout.instore_desc')}
                         </p>
                       </div>
                     </div>
 
                     {/* WhatsApp help */}
                     <a
                       href={`https://wa.me/${WHATSAPP_NUMBER}`}
                       target="_blank"
                       rel="noreferrer"
-                      className="flex items-center justify-center gap-2 py-3 border border-stone-200 text-[10px] tracking-[0.2em] uppercase text-stone-500 font-bold hover:border-gold/30 hover:text-gold transition-all"
+                      className="flex items-center justify-center gap-2 py-3 border border-stone-200 text-micro tracking-[0.2em] uppercase text-stone-600 font-bold hover:border-gold/30 hover:text-gold transition-all"
                     >
                       <MessageCircle className="w-3.5 h-3.5" />
                       {t('checkout.whatsapp_support')}
                     </a>
 
                     {/* Actions */}
                     <div className="flex gap-4">
                       <button onClick={prevStep} className="flex-1 btn-luxury-outline py-5 flex items-center justify-center gap-3">
                         <ArrowLeft className={cn("w-4 h-4", isRtl && "rotate-180")} /> {t('checkout.previous')}
                       </button>
@@ -607,26 +607,26 @@ export default function Checkout() {
                       >
                         {isProcessing ? (
                           <div className="w-5 h-5 border-2 border-ivory border-t-transparent rounded-full animate-spin" />
                         ) : (
                           <>{t('checkout.confirm_order')} <ShieldCheck className="w-4 h-4" /></>
                         )}
                       </button>
                     </div>
                     {submitError && (
                       <div className="p-4 border border-rose-200 bg-rose-50/50 text-center">
-                        <p className="text-rose-600 text-[10px] tracking-widest uppercase font-bold mb-2">{submitError}</p>
+                        <p className="text-rose-600 text-micro tracking-widest uppercase font-bold mb-2">{submitError}</p>
                         <a
                           href={`https://wa.me/${WHATSAPP_NUMBER}`}
                           target="_blank"
                           rel="noreferrer"
-                          className="text-[10px] tracking-widest uppercase text-gold font-bold hover:text-gold-dark transition-colors"
+                          className="text-micro tracking-widest uppercase text-gold font-bold hover:text-gold-dark transition-colors"
                         >
                           {t('checkout.whatsapp_support')} &rarr;
                         </a>
                       </div>
                     )}
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>
           </div>
@@ -634,24 +634,24 @@ export default function Checkout() {
           {/* Sidebar (desktop) / Mobile summary bar */}
           <div className="lg:col-span-5 order-1 lg:order-2">
             {/* Mobile: collapsible summary */}
             <div className="lg:hidden mb-6">
               <button
                 onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
                 className="w-full bg-onyx text-white p-4 flex items-center justify-between"
               >
                 <div className="flex items-center gap-3">
                   <div className="w-1 h-5 bg-gold" />
-                  <span className="text-[10px] tracking-[0.2em] uppercase font-bold">
+                  <span className="text-micro tracking-[0.2em] uppercase font-bold">
                     {t('checkout.order_summary')}
                   </span>
-                  <span className="text-[10px] text-stone-400">
+                  <span className="text-micro text-stone-400">
                     ({t('checkout.items_count').replace('{count}', String(items.length))})
                   </span>
                 </div>
                 <div className="flex items-center gap-3">
                   <span className="text-gold text-sm font-heading">{formatPrice(subtotal)}</span>
                   {mobileSummaryOpen ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                 </div>
               </button>
               <AnimatePresence>
                 {mobileSummaryOpen && (
@@ -661,36 +661,36 @@ export default function Checkout() {
                     exit={{ height: 0, opacity: 0 }}
                     className="overflow-hidden bg-onyx"
                   >
                     <div className="p-4 space-y-4 border-t border-stone-800">
                       {items.map((item) => (
                         <div key={`${item.id}-${item.selectedSize}`} className="flex gap-3 items-center">
                           <div className="w-12 h-16 bg-stone-800 flex-shrink-0 overflow-hidden">
                             <img src={item.images?.[0]} className="w-full h-full object-cover grayscale-[0.3]" alt={item.name} />
                           </div>
                           <div className="flex-1 min-w-0">
-                            <p className="text-[9px] text-stone-500 uppercase tracking-widest">{item.category}</p>
-                            <p className="text-[11px] uppercase tracking-wider font-bold truncate text-white">{item.name}</p>
+                            <p className="text-micro text-stone-500 uppercase tracking-widest">{item.category}</p>
+                            <p className="text-micro uppercase tracking-wider font-bold truncate text-white">{item.name}</p>
                             <div className="flex flex-wrap gap-1.5 mt-1">
-                              {item.selectedSize && <span className="text-[9px] border border-stone-700 px-1.5 py-0.5 text-stone-400">{item.selectedSize}</span>}
-                              {item.selectedDate && <span className="text-[9px] border border-gold/30 px-1.5 py-0.5 text-gold">{new Date(item.selectedDate).toLocaleDateString()}</span>}
+                              {item.selectedSize && <span className="text-micro border border-stone-700 px-1.5 py-0.5 text-stone-400">{item.selectedSize}</span>}
+                              {item.selectedDate && <span className="text-micro border border-gold/30 px-1.5 py-0.5 text-gold">{new Date(item.selectedDate).toLocaleDateString()}</span>}
                             </div>
                           </div>
-                          <p className="text-[11px] text-gold font-medium">{formatPrice((item.rentalPrice || item.salePrice || 0) * item.quantity)}</p>
+                          <p className="text-micro text-gold font-medium">{formatPrice((item.rentalPrice || item.salePrice || 0) * item.quantity)}</p>
                         </div>
                       ))}
                       <div className="space-y-2 pt-3 border-t border-stone-800">
-                        <div className="flex justify-between text-[9px] tracking-widest uppercase text-stone-400">
+                        <div className="flex justify-between text-micro tracking-widest uppercase text-stone-400">
                           <span>{t('checkout.subtotal')}</span>
                           <span>{formatPrice(subtotal)}</span>
                         </div>
-                        <div className="flex justify-between text-[9px] tracking-widest uppercase text-stone-400">
+                        <div className="flex justify-between text-micro tracking-widest uppercase text-stone-400">
                           <span>{t('checkout.delivery')}</span>
                           <span>{t('checkout.complimentary')}</span>
                         </div>
                         <div className="flex justify-between font-heading text-lg pt-3 border-t border-stone-800">
                           <span className="uppercase text-xs tracking-widest">{t('checkout.total')}</span>
                           <span className="text-gold">{formatPrice(subtotal)}</span>
                         </div>
                       </div>
                     </div>
                   </motion.div>
@@ -715,46 +715,46 @@ export default function Checkout() {
   );
 }
 
 /* ΓöÇΓöÇΓöÇ Sub-components ΓöÇΓöÇΓöÇ */
 
 function StepStep({ num, label, active, completed }: { num: number; label: string; active: boolean; completed: boolean }) {
   return (
     <div className="flex items-center gap-2.5">
       <div className={cn(
         "w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs transition-all duration-300 font-bold shrink-0",
-        completed ? "bg-gold border-gold text-white" : active ? "bg-gold/10 border-gold text-gold" : "border-stone-200 text-stone-300"
+        completed ? "bg-gold border-gold text-white" : active ? "bg-gold/10 border-gold text-gold" : "border-stone-200 text-stone-500"
       )}>
         {completed ? <Check className="w-4 h-4" /> : num}
       </div>
       <span className={cn(
-        "text-[10px] tracking-[0.15em] uppercase font-bold transition-colors hidden sm:inline",
-        active ? "text-stone-800" : "text-stone-300"
+        "text-micro tracking-[0.15em] uppercase font-bold transition-colors hidden sm:inline",
+        active ? "text-stone-800" : "text-stone-500"
       )}>{label}</span>
     </div>
   );
 }
 
 function SectionHeading({ title }: { title: string }) {
   return (
     <div className="border-b border-stone-50 pb-4">
       <h2 className="font-heading text-xl md:text-2xl tracking-widest uppercase text-stone-800">{title}</h2>
       <div className="w-8 h-px bg-gold mt-3" />
     </div>
   );
 }
 
 function TrustBadge({ icon, label }: { icon: ReactNode; label: string }) {
   return (
-    <div className="flex items-center gap-2 text-stone-400">
+    <div className="flex items-center gap-2 text-stone-600">
       <div className="text-gold">{icon}</div>
-      <span className="text-[9px] tracking-[0.2em] uppercase font-bold">{label}</span>
+      <span className="text-micro tracking-[0.2em] uppercase font-bold">{label}</span>
     </div>
   );
 }
 
 function OrderSidebar({ items, subtotal, paymentMethod, removeItem, t }: {
   items: any[];
   subtotal: number;
   paymentMethod: string;
   removeItem: (id: string, size?: string, intent?: 'sale' | 'rent') => void;
   t: (key: string) => string;
@@ -771,64 +771,64 @@ function OrderSidebar({ items, subtotal, paymentMethod, removeItem, t }: {
             <motion.div
               key={`${item.id}-${item.selectedSize}`}
               layout
               exit={{ opacity: 0, x: 20 }}
               className="flex gap-3 group relative items-center"
             >
               <div className="w-14 h-18 bg-stone-800 flex-shrink-0 overflow-hidden">
                 <img src={item.images?.[0]} className="w-full h-full object-cover grayscale-[0.3]" alt={item.name} />
               </div>
               <div className="flex-1 min-w-0">
-                <p className="text-[9px] text-stone-500 uppercase tracking-widest mb-0.5">{item.category}</p>
-                <h4 className="text-[11px] uppercase tracking-wider font-bold mb-1 truncate">{item.name}</h4>
+                <p className="text-micro text-stone-500 uppercase tracking-widest mb-0.5">{item.category}</p>
+                <h4 className="text-micro uppercase tracking-wider font-bold mb-1 truncate">{item.name}</h4>
                 <div className="flex flex-wrap gap-1.5 mb-1.5">
-                  {item.selectedSize && <span className="text-[9px] border border-stone-700 px-1.5 py-0.5 text-stone-400">{t('checkout.size')}: {item.selectedSize}</span>}
-                  {item.selectedDate && <span className="text-[9px] border border-gold/30 px-1.5 py-0.5 text-gold"><Calendar className="w-2 h-2 inline mr-0.5" />{new Date(item.selectedDate).toLocaleDateString()}</span>}
+                  {item.selectedSize && <span className="text-micro border border-stone-700 px-1.5 py-0.5 text-stone-400">{t('checkout.size')}: {item.selectedSize}</span>}
+                  {item.selectedDate && <span className="text-micro border border-gold/30 px-1.5 py-0.5 text-gold"><Calendar className="w-2 h-2 inline mr-0.5" />{new Date(item.selectedDate).toLocaleDateString()}</span>}
                 </div>
                 <div className="flex justify-between items-center">
-                  <p className="text-[11px] text-gold font-medium">{formatPrice((item.rentalPrice || item.salePrice || 0) * item.quantity)}</p>
-                  {item.quantity > 1 && <span className="text-[9px] text-stone-500">{t('checkout.qty')}: {item.quantity}</span>}
+                  <p className="text-micro text-gold font-medium">{formatPrice((item.rentalPrice || item.salePrice || 0) * item.quantity)}</p>
+                  {item.quantity > 1 && <span className="text-micro text-stone-500">{t('checkout.qty')}: {item.quantity}</span>}
                 </div>
               </div>
               <button
                 onClick={() => removeItem(item.id, item.selectedSize, item.intent)}
                 className="absolute -top-2 -right-2 w-5 h-5 bg-stone-800 text-stone-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:text-rose-400 transition-all"
               >
                 <X className="w-3 h-3" />
               </button>
             </motion.div>
           ))}
         </AnimatePresence>
       </div>
 
       <div className="space-y-3 border-t border-stone-800 pt-6">
-        <div className="flex justify-between text-[10px] tracking-widest uppercase text-stone-400">
+        <div className="flex justify-between text-micro tracking-widest uppercase text-stone-400">
           <span>{t('checkout.subtotal')}</span>
           <span>{formatPrice(subtotal)}</span>
         </div>
-        <div className="flex justify-between text-[10px] tracking-widest uppercase text-stone-400">
+        <div className="flex justify-between text-micro tracking-widest uppercase text-stone-400">
           <span>{t('checkout.delivery')}</span>
           <span>{t('checkout.complimentary')}</span>
         </div>
-        <div className="flex justify-between text-[10px] tracking-widest uppercase text-stone-400">
+        <div className="flex justify-between text-micro tracking-widest uppercase text-stone-400">
           <span>{t('checkout.vat')}</span>
           <span>{t('checkout.included')}</span>
         </div>
         <div className="flex justify-between font-heading text-lg pt-4 border-t border-stone-800 mt-3">
           <span className="uppercase text-xs tracking-widest">{t('checkout.total')}</span>
           <span className="text-gold">{formatPrice(subtotal)}</span>
         </div>
       </div>
 
       <div className="mt-8 flex items-center gap-3 p-3 border border-white/5 bg-white/5">
         <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
-        <p className="text-[9px] tracking-widest leading-relaxed text-stone-400 uppercase">
+        <p className="text-micro tracking-widest leading-relaxed text-stone-400 uppercase">
           {paymentMethod === 'card' ? 'Secured by Stripe' : 'Secure Order ΓÇö Payment at Atelier'}
         </p>
       </div>
     </div>
   );
 }
 
 function Input({ label, value, onChange, onBlur, placeholder, className, disabled, type = "text", error, autoComplete }: {
   label: string;
   value: string;
@@ -837,22 +837,22 @@ function Input({ label, value, onChange, onBlur, placeholder, className, disable
   placeholder?: string;
   className?: string;
   disabled?: boolean;
   type?: string;
   error?: string;
   autoComplete?: string;
 }) {
   return (
     <div className={cn("flex flex-col gap-2", className)}>
       <div className="flex justify-between items-center">
-        <label className="text-[11px] tracking-widest uppercase font-bold text-stone-400 block">{label}</label>
-        {error && <span className="text-[9px] text-rose-500 uppercase tracking-widest font-bold">{error}</span>}
+        <label className="text-micro tracking-widest uppercase font-bold text-stone-600 block">{label}</label>
+        {error && <span className="text-micro text-rose-500 uppercase tracking-widest font-bold">{error}</span>}
       </div>
       <input
         type={type}
         value={value}
         onChange={(e) => onChange(e.target.value)}
         onBlur={onBlur}
         placeholder={placeholder}
         disabled={disabled}
         autoComplete={autoComplete}
         className={cn(
diff --git a/src/pages/CollectionPage.tsx b/src/pages/CollectionPage.tsx
index 2f04350..99bdcee 100644
--- a/src/pages/CollectionPage.tsx
+++ b/src/pages/CollectionPage.tsx
@@ -98,70 +98,70 @@ export default function CollectionPage() {
 
   const categoryTitle = category === 'bridal' ? t('cat.bridal_title')
     : category === 'evening' ? t('cat.evening_title')
     : category === 'rental' ? t('cat.rental_title')
     : t('cat.all');
 
   return (
     <div id="collection-page" className="pt-24 min-h-screen bg-ivory">
       <header className="section-padding !py-12 bg-ivory border-b border-stone-100">
         <div className="container mx-auto">
-          <nav className="flex gap-2 text-xs tracking-widest uppercase text-stone-400 mb-4">
+          <nav className="flex gap-2 text-xs tracking-widest uppercase text-stone-600 mb-4">
             <Link to="/" className="hover:text-gold transition-colors">{t('nav.home')}</Link>
             <span>/</span>
             <span className="text-stone-800 font-medium">{t('cat.collection')}</span>
           </nav>
           <h1 className="font-heading text-4xl md:text-5xl text-stone-800 tracking-wider uppercase mb-4 leading-tight">{categoryTitle}</h1>
-          <p className="text-stone-500 font-body text-base tracking-wide max-w-2xl italic leading-relaxed">
+          <p className="text-stone-600 font-body text-base tracking-wide max-w-2xl italic leading-relaxed">
             {t('cat.subtitle')}
           </p>
         </div>
       </header>
 
       <div className="z-40 bg-ivory/80 backdrop-blur-md border-b border-stone-100">
         <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
         <div className="container mx-auto px-6 py-4">
           <div className="flex items-center justify-between gap-4">
             <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
               <div className="flex items-center gap-2">
                 {YEARS.map(year => (
                   <button
                     key={year}
                     onClick={() => setSelectedYear(selectedYear === year ? null : year)}
                     className={cn(
-                      "px-4 py-2 text-[10px] tracking-widest uppercase font-bold transition-all border",
-                      selectedYear === year ? "border-gold text-gold" : "border-stone-200 text-stone-500 hover:border-gold hover:text-gold"
+                      "px-4 py-2 text-micro tracking-widest uppercase font-bold transition-all border",
+                      selectedYear === year ? "border-gold text-gold" : "border-stone-200 text-stone-600 hover:border-gold hover:text-gold"
                     )}
                   >
                     {year}
                   </button>
                 ))}
               </div>
 
               <div className="hidden md:flex items-center gap-2 border-l border-stone-200 pl-6">
                 {SILHOUETTES.map(sil => (
                   <button
                     key={sil.value}
                     onClick={() => setSelectedSilhouette(sil.value === selectedSilhouette ? '' : sil.value)}
                     className={cn(
-                      "px-3 py-2 text-[10px] tracking-widest uppercase font-bold transition-all whitespace-nowrap",
-                      selectedSilhouette === sil.value ? "text-gold border-b-2 border-gold" : "text-stone-400 hover:text-gold"
+                      "px-3 py-2 text-micro tracking-widest uppercase font-bold transition-all whitespace-nowrap",
+                      selectedSilhouette === sil.value ? "text-gold border-b-2 border-gold" : "text-stone-600 hover:text-gold"
                     )}
                   >
                     {sil.label}
                   </button>
                 ))}
               </div>
             </div>
 
             <div className="flex items-center gap-4 flex-shrink-0">
-              <button onClick={() => setShowFilters(!showFilters)} className={cn("p-2 transition-colors", showFilters ? "text-gold" : "text-stone-400 hover:text-gold")}>
+              <button onClick={() => setShowFilters(!showFilters)} className={cn("p-2 transition-colors", showFilters ? "text-gold" : "text-stone-600 hover:text-gold")}>
                 <SlidersHorizontal className="w-5 h-5" />
               </button>
 
               <div className="relative">
                 <button 
                   onClick={() => setShowSortMenu(!showSortMenu)}
                   onBlur={() => setTimeout(() => setShowSortMenu(false), 200)}
                   className="flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase text-stone-800 font-bold cursor-pointer"
                 >
                   {t('collection.sort')} <ChevronDown className={cn("w-4 h-4 transition-transform", showSortMenu && "rotate-180")} />
@@ -200,21 +200,21 @@ export default function CollectionPage() {
           <AnimatePresence>
             {showFilters && (
               <motion.div
                 initial={{ height: 0, opacity: 0 }}
                 animate={{ height: 'auto', opacity: 1 }}
                 exit={{ height: 0, opacity: 0 }}
                 className="overflow-hidden"
               >
                 <div className="pt-4 pb-2 border-t border-stone-100 mt-4">
                   <div className="flex items-center gap-4">
-                    <span className="text-xs tracking-widest uppercase text-stone-400 font-bold">{t('collection.colors')}</span>
+                    <span className="text-xs tracking-widest uppercase text-stone-600 font-bold">{t('collection.colors')}</span>
                     <div className="flex items-center gap-2.5 flex-wrap">
                       {allAvailableColors.map(color => (
                         <button
                           key={color}
                           onClick={() => toggleColor(color)}
                           title={color}
                           className={cn(
                             "w-8 h-8 rounded-full border border-stone-200 transition-all duration-300 relative",
                             selectedColors.includes(color) ? "ring-2 ring-gold ring-offset-2 scale-110" : "hover:scale-110"
                           )}
@@ -223,65 +223,65 @@ export default function CollectionPage() {
                           {selectedColors.includes(color) && (
                             <div className="absolute inset-0 flex items-center justify-center">
                               <div className={cn("w-2 h-2 rounded-full", color === 'White' || color === 'Ivory' || color === 'Soft White' ? "bg-stone-800" : "bg-white")} />
                             </div>
                           )}
                         </button>
                       ))}
                     </div>
                   </div>
                   <div className="md:hidden mt-4">
-                    <span className="text-xs tracking-widest uppercase text-stone-400 font-bold block mb-2">{t('collection.silhouette')}</span>
+                    <span className="text-xs tracking-widest uppercase text-stone-600 font-bold block mb-2">{t('collection.silhouette')}</span>
                     <div className="flex flex-wrap gap-2">
                       {SILHOUETTES.map(sil => (
                         <button
                           key={sil.value}
                           onClick={() => setSelectedSilhouette(sil.value === selectedSilhouette ? '' : sil.value)}
                           className={cn(
-                            "px-3 py-2 text-[10px] tracking-widest uppercase font-bold transition-all border",
-                            selectedSilhouette === sil.value ? "bg-onyx text-white border-onyx" : "border-stone-200 text-stone-500 hover:border-gold"
+                            "px-3 py-2 text-micro tracking-widest uppercase font-bold transition-all border",
+                            selectedSilhouette === sil.value ? "bg-onyx text-white border-onyx" : "border-stone-200 text-stone-600 hover:border-gold"
                           )}
                         >
                           {sil.label}
                         </button>
                       ))}
                     </div>
                   </div>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
 
           {hasActiveFilters && (
             <div className="flex items-center gap-4 mt-3 pt-3 border-t border-stone-100">
-              <span className="text-[10px] tracking-widest uppercase text-stone-500">{filteredProducts.length} {t('collection.results')}</span>
-              <button onClick={clearFilters} className="text-[10px] tracking-[0.2em] uppercase text-gold hover:text-stone-800 transition-colors font-bold">{t('collection.clear_all')}</button>
+              <span className="text-micro tracking-widest uppercase text-stone-600">{filteredProducts.length} {t('collection.results')}</span>
+              <button onClick={clearFilters} className="text-micro tracking-[0.2em] uppercase text-gold hover:text-stone-800 transition-colors font-bold">{t('collection.clear_all')}</button>
             </div>
           )}
         </div>
       </div>
 
       <div className="container mx-auto px-6 py-12">
         {isLoading ? (
           <ProductGridSkeleton />
         ) : (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
           {filteredProducts.length > 0 ? (
             filteredProducts.map(product => (
               <ProductCard key={product.id} product={product} />
             ))
           ) : (
             <div className="col-span-full py-24 text-center">
               <div className="max-w-md mx-auto mb-10">
                 <div className="w-16 h-px bg-gold mx-auto mb-8" />
-                <p className="heading-editorial text-stone-400 text-2xl italic mb-4">{t('collection.empty_heading')}</p>
-                <p className="font-body text-xs text-stone-400 tracking-[0.2em] uppercase leading-relaxed">
+                <p className="heading-editorial text-stone-600 text-2xl italic mb-4">{t('collection.empty_heading')}</p>
+                <p className="font-body text-xs text-stone-600 tracking-[0.2em] uppercase leading-relaxed">
                   {t('collection.empty_desc')}
                 </p>
                 <div className="w-16 h-px bg-gold mx-auto mt-8" />
               </div>
               <Link to="/collection/all" className="btn-luxury">{t('collection.view_all')}</Link>
             </div>
           )}
         </div>
         )}
       </div>
diff --git a/src/pages/ContactPage.tsx b/src/pages/ContactPage.tsx
index 00c7ff5..19320a3 100644
--- a/src/pages/ContactPage.tsx
+++ b/src/pages/ContactPage.tsx
@@ -55,21 +55,21 @@ export default function ContactPage() {
 
   return (
     <div className="pt-24 min-h-screen bg-ivory">
       <header className="section-padding !py-20 text-center bg-ivory border-b border-stone-100">
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
         >
           <h1 className="font-heading text-5xl md:text-6xl text-stone-800 tracking-widest uppercase mb-4">{t('nav.contact')}</h1>
-          <p className="font-body text-stone-500 text-sm tracking-[0.2em] uppercase">{t('footer.consultation')}</p>
+          <p className="font-body text-stone-600 text-sm tracking-[0.2em] uppercase">{t('footer.consultation')}</p>
         </motion.div>
       </header>
 
       <section className="section-padding container mx-auto">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
           <div className="space-y-12">
             <div>
               <h2 className="font-heading text-3xl mb-8 tracking-wide">{t('footer.atelier_location')}</h2>
               <p className="font-body text-stone-600 mb-10 leading-relaxed text-lg italic">
                 {t('contact.narrative')}
@@ -86,115 +86,115 @@ export default function ContactPage() {
                 icon={<Phone className="w-5 h-5" />}
                 title={t('contact.contact_details')}
                 content={t('contact.phone_email')}
               />
               <ContactInfoItem 
                 icon={<Clock className="w-5 h-5" />}
                 title={t('contact.hours')}
                 content={t('contact.hours_detail')}
               />
               <div className="bg-stone-50 p-6 border border-stone-100 flex flex-col justify-center">
-                <p className="font-body text-[10px] text-stone-400 uppercase tracking-widest mb-2 italic">{t('contact.special_note')}</p>
+                <p className="font-body text-micro text-stone-600 uppercase tracking-widest mb-2 italic">{t('contact.special_note')}</p>
                 <p className="font-body text-xs text-stone-600 leading-relaxed">{t('contact.special_note_desc')}</p>
               </div>
             </div>
           </div>
 
           <div className="bg-ivory p-8 md:p-12 relative overflow-hidden ring-1 ring-stone-100">
             <AnimatePresence mode="wait">
               <motion.div
                 key="form-container"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
               >
                 <h2 className="font-heading text-3xl mb-8 tracking-wide">{t('contact.request_consultation')}</h2>
                   <form className="space-y-6 relative z-10" onSubmit={handleSubmit(onSubmit)}>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="flex flex-col gap-2">
-                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{t('form.name')}</label>
+                        <label className="text-micro font-bold text-stone-600 uppercase tracking-widest">{t('form.name')}</label>
                         <input 
                           {...register('name')}
                           disabled={isSubmitted}
                           className={cn(
                             "bg-stone-50 border border-stone-100 focus:bg-ivory focus:border-gold outline-none p-4 text-sm transition-all",
                             errors.name && "border-red-300",
                             isSubmitted && "opacity-50 cursor-not-allowed"
                           )} 
                           placeholder="Sarah Al-Maktoum" 
                         />
-                        {errors.name && <span className="text-red-500 text-[10px] tracking-widest uppercase">{errors.name.message}</span>}
+                        {errors.name && <span className="text-red-500 text-micro tracking-widest uppercase">{errors.name.message}</span>}
                       </div>
                       <div className="flex flex-col gap-2">
-                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{t('form.email')}</label>
+                        <label className="text-micro font-bold text-stone-600 uppercase tracking-widest">{t('form.email')}</label>
                         <input 
                           {...register('email')}
                           type="email" 
                           disabled={isSubmitted}
                           className={cn(
                             "bg-stone-50 border border-stone-100 focus:bg-ivory focus:border-gold outline-none p-4 text-sm transition-all",
                             errors.email && "border-red-300",
                             isSubmitted && "opacity-50 cursor-not-allowed"
                           )}
                           placeholder="sarah@example.com" 
                         />
-                        {errors.email && <span className="text-red-500 text-[10px] tracking-widest uppercase">{errors.email.message}</span>}
+                        {errors.email && <span className="text-red-500 text-micro tracking-widest uppercase">{errors.email.message}</span>}
                       </div>
                     </div>
                     <div className="flex flex-col gap-2">
-                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{t('nav.contact')}</label>
+                      <label className="text-micro font-bold text-stone-600 uppercase tracking-widest">{t('nav.contact')}</label>
                       <input 
                         {...register('phone')}
                         type="tel" 
                         disabled={isSubmitted}
                         className={cn(
                           "bg-stone-50 border border-stone-100 focus:bg-ivory focus:border-gold outline-none p-4 text-sm transition-all",
                           errors.phone && "border-red-300",
                           isSubmitted && "opacity-50 cursor-not-allowed"
                         )}
                         placeholder="+971 -- --- ----" 
                       />
-                      {errors.phone && <span className="text-red-500 text-[10px] tracking-widest uppercase">{errors.phone.message}</span>}
+                      {errors.phone && <span className="text-red-500 text-micro tracking-widest uppercase">{errors.phone.message}</span>}
                     </div>
                     <div className="flex flex-col gap-2">
-                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{t('contact.inquiry_type')}</label>
+                      <label className="text-micro font-bold text-stone-600 uppercase tracking-widest">{t('contact.inquiry_type')}</label>
                       <div className="relative">
                         <select 
                           {...register('type')}
                           disabled={isSubmitted}
                           className={cn(
                             "w-full bg-stone-50 border border-stone-100 focus:bg-ivory focus:border-gold outline-none p-4 text-sm transition-all appearance-none cursor-pointer",
                             isSubmitted && "opacity-50 cursor-not-allowed"
                           )}
                         >
                           <option value="Bridal Consultation">{t('contact.bridal_consultation')}</option>
                           <option value="Evening Wear Inquiry">{t('contact.evening_inquiry')}</option>
                           <option value="Rental Booking">{t('contact.rental_booking')}</option>
                           <option value="Bespoke Alterations">{t('contact.bespoke_alterations')}</option>
                         </select>
-                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90 text-stone-400 pointer-events-none" />
+                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90 text-stone-600 pointer-events-none" />
                       </div>
                     </div>
                     <div className="flex flex-col gap-2">
-                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{t('contact.vision_prefs')}</label>
+                      <label className="text-micro font-bold text-stone-600 uppercase tracking-widest">{t('contact.vision_prefs')}</label>
                       <textarea 
                         {...register('message')}
                         rows={4} 
                         disabled={isSubmitted}
                         className={cn(
                           "bg-stone-50 border border-stone-100 focus:bg-ivory focus:border-gold outline-none p-4 text-sm transition-all resize-none",
                           errors.message && "border-red-300",
                           isSubmitted && "opacity-50 cursor-not-allowed"
                         )}
                         placeholder={t('contact.vision_placeholder')}
                       ></textarea>
-                      {errors.message && <span className="text-red-500 text-[10px] tracking-widest uppercase">{errors.message.message}</span>}
+                      {errors.message && <span className="text-red-500 text-micro tracking-widest uppercase">{errors.message.message}</span>}
                     </div>
 
                     <div className="pt-4">
                       <AnimatePresence mode="wait">
                         {!isSubmitted ? (
                           <motion.button 
                             key="submit-btn"
                             type="submit" 
                             disabled={isSubmitting}
                             initial={{ opacity: 0 }}
@@ -212,21 +212,21 @@ export default function ContactPage() {
                           </motion.button>
                         ) : (
                           <motion.div 
                             key="success-message"
                             initial={{ opacity: 0, y: 10 }}
                             animate={{ opacity: 1, y: 0 }}
                             className="space-y-4"
                           >
                             <div className="flex items-center justify-center gap-2 text-gold py-2">
                               <CheckCircle2 className="w-5 h-5" />
-                              <span className="font-body text-[10px] font-bold tracking-[0.3em] uppercase">{t('contact.success_title')}</span>
+                              <span className="font-body text-micro font-bold tracking-[0.3em] uppercase">{t('contact.success_title')}</span>
                             </div>
                             <button 
                               type="button"
                               onClick={handleReset}
                               className="w-full btn-luxury !py-5 flex items-center justify-center gap-3 bg-stone-800"
                             >
                               {t('contact.write_another')}
                             </button>
                           </motion.div>
                         )}
@@ -261,18 +261,18 @@ export default function ContactPage() {
   );
 }
 
 function ContactInfoItem({ icon, title, content }: { icon: React.ReactNode, title: string, content: React.ReactNode }) {
   return (
     <div className="flex gap-6 group">
       <div className="w-12 h-12 bg-ivory border border-stone-100 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all duration-500 rounded-sm shrink-0">
         {icon}
       </div>
       <div>
-        <h4 className="font-body text-[10px] tracking-[0.3em] uppercase text-stone-400 mb-2 font-bold">{title}</h4>
+        <h4 className="font-body text-micro tracking-[0.3em] uppercase text-stone-600 mb-2 font-bold">{title}</h4>
         <div className="font-body text-sm text-stone-800 leading-relaxed italic">
           {content}
         </div>
       </div>
     </div>
   );
 }
diff --git a/src/pages/GalleryPage.tsx b/src/pages/GalleryPage.tsx
index 89be448..d1f9442 100644
--- a/src/pages/GalleryPage.tsx
+++ b/src/pages/GalleryPage.tsx
@@ -27,57 +27,57 @@ export default function GalleryPage() {
     setActiveCategory(category);
   }, []);
 
   return (
     <div className="pt-32 pb-20 bg-ivory min-h-screen">
       <div className="container mx-auto px-6">
         <div className="text-center mb-16">
           <motion.h2
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
-            className="heading-editorial text-gold text-[10px] mb-4 uppercase tracking-[0.4em]"
+            className="heading-editorial text-gold text-micro mb-4 uppercase tracking-[0.4em]"
           >
             {t('gallery.title')}
           </motion.h2>
           <motion.h1
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="font-heading text-4xl md:text-6xl text-stone-800 tracking-wider mb-6"
           >
             {t('gallery.subtitle')}
           </motion.h1>
           <div className="w-16 h-px bg-gold mx-auto mb-8" />
-          <p className="text-stone-500 text-sm tracking-wide max-w-xl mx-auto">
+          <p className="text-stone-600 text-sm tracking-wide max-w-xl mx-auto">
             {t('gallery.description')}
           </p>
         </div>
 
         <GalleryFilters
           activeCategory={activeCategory}
           onCategoryChange={handleCategoryChange}
           className="mb-16"
         />
 
         {isLoading && items.length === 0 ? (
           <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
             {Array.from({ length: 9 }).map((_, i) => (
               <div key={i} className="break-inside-avoid mb-4 bg-stone-100 animate-pulse" style={{ height: `${200 + (i % 3) * 100}px` }} />
             ))}
           </div>
         ) : error ? (
           <div className="text-center py-20">
-            <p className="text-stone-500 text-sm">{error}</p>
+            <p className="text-stone-600 text-sm">{error}</p>
           </div>
         ) : items.length === 0 ? (
           <div className="text-center py-20">
-            <p className="text-stone-500 text-sm">{t('gallery.no_items')}</p>
+            <p className="text-stone-600 text-sm">{t('gallery.no_items')}</p>
           </div>
         ) : (
           <>
             <GalleryGrid items={items} onItemClick={handleItemClick} />
 
             {hasMore && (
               <div className="text-center mt-16">
                 <button
                   onClick={loadMore}
                   className="btn-luxury-outline"
diff --git a/src/pages/Index.tsx b/src/pages/Index.tsx
index 55e894a..28e7ccb 100644
--- a/src/pages/Index.tsx
+++ b/src/pages/Index.tsx
@@ -36,21 +36,21 @@ export default function Index() {
           preload="metadata"
           ref={(el) => { if (el) el.playbackRate = 0.7; }}
           aria-label="Riman Fashion couture atelier showcase"
         />
         <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60" aria-hidden="true" />
         <CalligraphicAccent
           word="╪ú┘å╪º┘é╪⌐"
           className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[clamp(10rem,30vw,28rem)]"
         />
         <div className="relative z-10 text-center px-6 max-w-5xl mx-auto animate-fade-in">
-          <p className="font-label text-[11px] md:text-xs tracking-[0.35em] uppercase text-white/90 mb-8">
+          <p className="font-label text-micro md:text-xs tracking-[0.35em] uppercase text-white/90 mb-8">
             {t('hero.subtitle')}
           </p>
           <h1 className="font-heading text-white font-light leading-[0.95] text-[clamp(3.5rem,11vw,9rem)] mb-12">
             {t('hero.title').split('&').map((part, i, arr) => (
               <span key={i}>
                 {part}
                 {i < arr.length - 1 && <em className="font-editorial italic text-gold">&</em>}
               </span>
             ))}
           </h1>
@@ -59,21 +59,21 @@ export default function Index() {
               {t('cta.viewing')}
             </Link>
             <a
               href="#atelier"
               className="font-label text-xs tracking-[0.25em] uppercase text-white/80 hover:text-gold transition-colors duration-700 border-b border-white/30 hover:border-gold pb-1"
             >
               {t('cta.explore')}
             </a>
           </div>
         </div>
-        <span className="absolute bottom-8 left-1/2 -translate-x-1/2 font-label text-[10px] tracking-[0.3em] uppercase text-white/60">
+        <span className="absolute bottom-8 left-1/2 -translate-x-1/2 font-label text-micro tracking-[0.3em] uppercase text-white/60">
           {t('hero.discover')}
         </span>
       </section>
 
       {/* CHAPTER I ΓÇö L'ATELIER */}
       <section id="atelier" className="bg-bone py-24 md:py-36 px-6 md:px-12 lg:px-20">
         <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-10 md:gap-16">
           <div className="md:col-span-4">
             <div className="md:sticky md:top-40">
               <ChapterLabel numeral="I" titleKey="chapter.atelier" />
@@ -176,21 +176,21 @@ export default function Index() {
               </p>
               <footer className="mt-6 font-label text-xs tracking-[0.25em] uppercase text-gold">
                 {quote.authorName} ΓÇö {quote.authorRole}
               </footer>
             </blockquote>
           )}
           <div className="mt-12 flex flex-col items-center gap-6">
             <Link to="/appointment" className="btn-luxury" aria-label={t('cta.viewing')}>
               {t('cta.viewing')}
             </Link>
-            <p className="font-label text-[11px] tracking-[0.3em] uppercase text-stone-500">
+            <p className="font-label text-micro tracking-[0.3em] uppercase text-stone-600">
               {t('invitation.contact_line')}
             </p>
           </div>
         </div>
       </section>
 
       {/* Recurring booking thread */}
       <InvitationRule className="bg-champagne border-t border-gold/15" />
     </main>
   );
diff --git a/src/pages/ProductDetail.tsx b/src/pages/ProductDetail.tsx
index 1b2a001..9e440ea 100644
--- a/src/pages/ProductDetail.tsx
+++ b/src/pages/ProductDetail.tsx
@@ -143,21 +143,21 @@ export default function ProductDetail() {
       }];
       navigate('/appointment', { state: { gowns } });
     }
   };
 
   return (
     <>
       <div id="product-detail-page" className="pt-24 bg-ivory min-h-screen pb-24 lg:pb-12">
         <div className="container mx-auto px-5 py-10">
           {/* Breadcrumbs */}
-          <nav className="flex gap-2 text-xs tracking-[0.2em] uppercase text-stone-400 mb-10">
+          <nav className="flex gap-2 text-xs tracking-[0.2em] uppercase text-stone-600 mb-10">
             <Link to="/" className="hover:text-gold transition-colors">{t('nav.home')}</Link>
             <ChevronRight className="w-3 h-3" />
             <Link to={`/collection/${categoryToSlug(product.category)}`} className="hover:text-gold transition-colors">{product.category}</Link>
             <ChevronRight className="w-3 h-3" />
             <span className="text-stone-800 font-medium">{product.name}</span>
           </nav>
 
           <div className="grid grid-cols-1 lg:grid-cols-[48fr_52fr] gap-10 lg:gap-14 mb-20">
             {/* Gallery */}
             <div className="space-y-3">
@@ -204,61 +204,61 @@ export default function ProductDetail() {
                         className="w-full h-full object-cover pointer-events-none"
                       />
                       <div className={cn("absolute top-5 left-5 p-2 bg-ivory/80 text-stone-800 rounded-full transition-opacity duration-300 pointer-events-none z-10", isZoomed ? "opacity-100" : "opacity-0")}>
                         <Search className="w-4 h-4" />
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
 
                 {/* Image Counter Badge */}
-                <div className="absolute bottom-5 left-5 z-20 bg-ivory/90 backdrop-blur-sm px-3 py-1.5 text-[10px] tracking-widest uppercase text-stone-700 font-bold">
+                <div className="absolute bottom-5 left-5 z-20 bg-ivory/90 backdrop-blur-sm px-3 py-1.5 text-micro tracking-widest uppercase text-stone-700 font-bold">
                   {currentImageIndex + 1} / {totalAssets}
                 </div>
 
                 {/* Nav Arrows */}
                 {totalAssets > 1 && (
                   <>
                     <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-ivory/80 text-stone-800 hover:bg-gold hover:text-white transition-all z-20" aria-label="Previous image">
                       <ChevronLeft className="w-4 h-4" />
                     </button>
                     <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-ivory/80 text-stone-800 hover:bg-gold hover:text-white transition-all z-20" aria-label="Next image">
                       <ChevronRight className="w-4 h-4" />
                     </button>
                   </>
                 )}
 
                 {/* Perspective Toggle */}
                 {product.glbUrl && (
                   <div className="absolute top-5 right-5 z-30 flex gap-2">
-                    <button onClick={() => setIs3DMode(false)} className={cn("p-2.5 transition-all backdrop-blur border", !is3DMode ? "bg-gold text-white border-gold" : "bg-ivory/80 text-stone-500 border-stone-100 hover:border-stone-300")} title={t('product.classic_view')}>
+                    <button onClick={() => setIs3DMode(false)} className={cn("p-2.5 transition-all backdrop-blur border", !is3DMode ? "bg-gold text-white border-gold" : "bg-ivory/80 text-stone-600 border-stone-100 hover:border-stone-300")} title={t('product.classic_view')}>
                       <Search className="w-3.5 h-3.5" />
                     </button>
                     {threeDViewerEnabled && (
-                      <button onClick={() => setIs3DMode(true)} className={cn("p-2.5 transition-all backdrop-blur border", is3DMode ? "bg-gold text-white border-gold scale-105" : "bg-ivory/80 text-stone-500 border-stone-100 hover:border-stone-300")} title={t('product.view_3d')}>
+                      <button onClick={() => setIs3DMode(true)} className={cn("p-2.5 transition-all backdrop-blur border", is3DMode ? "bg-gold text-white border-gold scale-105" : "bg-ivory/80 text-stone-600 border-stone-100 hover:border-stone-300")} title={t('product.view_3d')}>
                         <Box className="w-3.5 h-3.5" />
                       </button>
                     )}
                   </div>
                 )}
 
                 {/* Share Menu */}
                 <div className="absolute bottom-5 right-5 z-20 flex gap-2">
                   <button onClick={() => setShowShareMenu(!showShareMenu)} className="p-2.5 bg-ivory/90 text-stone-800 hover:bg-gold hover:text-white transition-all" aria-label="Share this product">
                     <Share2 className="w-3.5 h-3.5" />
                   </button>
                   {showShareMenu && (
                     <div className="absolute bottom-12 right-0 bg-ivory border border-stone-100 p-2 w-44">
-                      <a href={`https://wa.me/?text=${encodeURIComponent(`Check out ${product.name} at Riman Fashion: ${window.location.origin}/product/${product.id}`)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2.5 text-[10px] tracking-wider uppercase text-stone-700 hover:bg-pearl transition-colors">
+                      <a href={`https://wa.me/?text=${encodeURIComponent(`Check out ${product.name} at Riman Fashion: ${window.location.origin}/product/${product.id}`)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2.5 text-micro tracking-wider uppercase text-stone-700 hover:bg-pearl transition-colors">
                         WhatsApp
                       </a>
-                      <button onClick={() => { navigator.clipboard.writeText(window.location.href); setShowShareMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-[10px] tracking-wider uppercase text-stone-700 hover:bg-pearl transition-colors">
+                      <button onClick={() => { navigator.clipboard.writeText(window.location.href); setShowShareMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-micro tracking-wider uppercase text-stone-700 hover:bg-pearl transition-colors">
                         {t('product.copy_link')}
                       </button>
                     </div>
                   )}
                 </div>
               </div>
 
               {/* Thumbnails */}
               <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                 {product.videoUrl && (
@@ -276,110 +276,110 @@ export default function ProductDetail() {
                       <img src={img} className="w-full h-full object-cover" alt={`${product.name} thumbnail ${i + 1}`} />
                     </button>
                   );
                 })}
               </div>
 
               {/* Quick Specs Bar */}
               <div className="grid grid-cols-3 gap-3 pt-3 border-t border-stone-100">
                 <div className="flex flex-col items-center gap-1.5 py-3">
                   <Gem className="w-4 h-4 text-gold" />
-                  <span className="text-[9px] text-stone-400 uppercase tracking-widest font-bold">{t('product.fabric')}</span>
-                  <span className="text-[10px] text-stone-700 font-medium tracking-wide">{product.fabric || 'Luxury Blend'}</span>
+                  <span className="text-micro text-stone-600 uppercase tracking-widest font-bold">{t('product.fabric')}</span>
+                  <span className="text-micro text-stone-700 font-medium tracking-wide">{product.fabric || 'Luxury Blend'}</span>
                 </div>
                 <div className="flex flex-col items-center gap-1.5 py-3 border-x border-stone-100">
                   <Sparkles className="w-4 h-4 text-gold" />
-                  <span className="text-[9px] text-stone-400 uppercase tracking-widest font-bold">{t('product.silhouette')}</span>
-                  <span className="text-[10px] text-stone-700 font-medium tracking-wide">{product.category}</span>
+                  <span className="text-micro text-stone-600 uppercase tracking-widest font-bold">{t('product.silhouette')}</span>
+                  <span className="text-micro text-stone-700 font-medium tracking-wide">{product.category}</span>
                 </div>
                 <div className="flex flex-col items-center gap-1.5 py-3">
                   <Wind className="w-4 h-4 text-gold" />
-                  <span className="text-[9px] text-stone-400 uppercase tracking-widest font-bold">{t('product.color')}</span>
-                  <span className="text-[10px] text-stone-700 font-medium tracking-wide">{product.style[0] || 'Signature'}</span>
+                  <span className="text-micro text-stone-600 uppercase tracking-widest font-bold">{t('product.color')}</span>
+                  <span className="text-micro text-stone-700 font-medium tracking-wide">{product.style[0] || 'Signature'}</span>
                 </div>
               </div>
             </div>
 
             {/* Info ΓÇö Sticky on Desktop */}
             <div className="flex flex-col lg:sticky lg:top-28 lg:self-start">
               <header className="mb-8">
-                <span className="text-[10px] tracking-[0.3em] uppercase text-gold block mb-2 font-bold">{product.designer || 'Riman Atelier'}</span>
+                <span className="text-micro tracking-[0.3em] uppercase text-gold block mb-2 font-bold">{product.designer || 'Riman Atelier'}</span>
                 <h1 className="font-heading text-3xl md:text-4xl text-stone-800 tracking-wider mb-3 leading-tight">{product.name}</h1>
                 <div className="flex gap-3">
-                  {product.isNew && <span className="text-gold text-[10px] uppercase tracking-widest border border-gold/30 px-3 py-1 font-bold">{t('product.limited_edition')}</span>}
-                  <span className="text-stone-400 text-[10px] uppercase tracking-widest border border-stone-200 px-3 py-1 font-medium">SKU: RF-{product.id.padStart(4, '0')}</span>
+                  {product.isNew && <span className="text-gold text-micro uppercase tracking-widest border border-gold/30 px-3 py-1 font-bold">{t('product.limited_edition')}</span>}
+                  <span className="text-stone-600 text-micro uppercase tracking-widest border border-stone-200 px-3 py-1 font-medium">SKU: RF-{product.id.padStart(4, '0')}</span>
                 </div>
               </header>
 
               {/* Editorial Quote */}
               <div className="mb-8 pl-5 border-l-2 border-gold/40">
-                <p className="font-editorial italic text-sm text-stone-500 leading-relaxed">
+                <p className="font-editorial italic text-sm text-stone-600 leading-relaxed">
                   "A study in refined elegance ΓÇö where artisanal precision meets contemporary silhouette, crafted for the woman who commands quiet luxury."
                 </p>
               </div>
 
               {/* Pricing */}
               <div className="mb-8 p-5 bg-gold/5 border border-gold/20 flex flex-col gap-4">
                 {isSale && (
                   <div className="flex justify-between items-baseline">
-                    <span className="font-body text-[10px] tracking-widest uppercase text-stone-500 font-medium">{t('product.purchase_value')}</span>
-                    <span className="font-heading text-3xl text-stone-800"><span className="text-sm font-body text-stone-500 uppercase tracking-widest me-2">{t('pricing.from')}</span>{formatPrice(product.salePrice || 0)}</span>
+                    <span className="font-body text-micro tracking-widest uppercase text-stone-600 font-medium">{t('product.purchase_value')}</span>
+                    <span className="font-heading text-3xl text-stone-800"><span className="text-sm font-body text-stone-600 uppercase tracking-widest me-2">{t('pricing.from')}</span>{formatPrice(product.salePrice || 0)}</span>
                   </div>
                 )}
                 {isRent && (
                   <div className="flex justify-between items-baseline pt-4 border-t border-stone-200/60">
                     <div>
-                      <span className="font-body text-[10px] tracking-widest uppercase text-stone-500 block font-medium">{t('product.rental_7day')}</span>
-                      <span className="text-[10px] text-stone-400 uppercase tracking-wider italic">({t('product.rental_includes')})</span>
+                      <span className="font-body text-micro tracking-widest uppercase text-stone-600 block font-medium">{t('product.rental_7day')}</span>
+                      <span className="text-micro text-stone-600 uppercase tracking-wider italic">({t('product.rental_includes')})</span>
                     </div>
                     <div className="text-right">
-                      <span className="font-heading text-3xl text-gold"><span className="text-sm font-body text-stone-500 uppercase tracking-widest me-2">{t('pricing.from')}</span>{formatPrice(product.rentalPrice || 0)}</span>
-                      <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">{t('product.refundable_deposit')}</p>
+                      <span className="font-heading text-3xl text-gold"><span className="text-sm font-body text-stone-600 uppercase tracking-widest me-2">{t('pricing.from')}</span>{formatPrice(product.rentalPrice || 0)}</span>
+                      <p className="text-micro text-stone-600 uppercase tracking-widest mt-1">{t('product.refundable_deposit')}</p>
                     </div>
                   </div>
                 )}
-                <p className="font-body text-[11px] text-stone-400 italic mt-2 leading-relaxed">{t('pricing.consultation_note')}</p>
+                <p className="font-body text-micro text-stone-600 italic mt-2 leading-relaxed">{t('pricing.consultation_note')}</p>
               </div>
 
               <p className="font-body text-sm text-stone-600 leading-relaxed tracking-wide mb-8">
                 {product.description}
                 <br /><br />
                 {t('product.description_intro')} {product.fabric || 'silk blend'}, the {product.name} {t('product.description_mid')} {product.style.join(' and ')} {t('product.description_outro')}
               </p>
 
               {/* Selection */}
               <div className="space-y-6 mb-10">
                 {isRent && (
                   <div className="p-5 bg-stone-50 border border-stone-200">
                     <div className="flex justify-between items-center mb-3">
-                      <span className="font-body text-[10px] tracking-[0.2em] uppercase text-stone-800">{t('product.rental_availability')}</span>
-                      <span className="text-[9px] text-gold uppercase tracking-widest font-bold">{t('product.fast_booking')}</span>
+                      <span className="font-body text-micro tracking-[0.2em] uppercase text-stone-800">{t('product.rental_availability')}</span>
+                      <span className="text-micro text-gold uppercase tracking-widest font-bold">{t('product.fast_booking')}</span>
                     </div>
                     <AvailabilityCalendar productId={product.id} selectedDate={bookingDate} onDateSelect={setBookingDate} />
-                    <p className="text-[9px] text-stone-400 leading-relaxed italic text-center mt-3">
+                    <p className="text-micro text-stone-600 leading-relaxed italic text-center mt-3">
                       {bookingDate ? `${t('product.selected_date')}: ${bookingDate.toLocaleDateString()}` : t('product.select_date_hint')}
                     </p>
                   </div>
                 )}
 
                 <div>
                   <div className="flex justify-between items-center mb-3">
-                    <span className="font-body text-[10px] tracking-[0.2em] uppercase text-stone-800">{t('product.select_size_label')}</span>
-                    <button onClick={() => setShowSizeGuide(true)} className="flex items-center gap-2 text-[10px] tracking-widest text-gold uppercase hover:underline">
+                    <span className="font-body text-micro tracking-[0.2em] uppercase text-stone-800">{t('product.select_size_label')}</span>
+                    <button onClick={() => setShowSizeGuide(true)} className="flex items-center gap-2 text-micro tracking-widest text-gold uppercase hover:underline">
                       <Ruler className="w-3 h-3" /> {t('product.size_guide')}
                     </button>
                   </div>
                   <div className="flex flex-wrap gap-2.5">
                     {['XS', 'S', 'M', 'L', 'XL'].map((size) => {
                       const isAvailable = product.sizes.includes(size);
                       return (
-                        <button key={size} disabled={!isAvailable} onClick={() => setSelectedSize(size)} className={cn("w-11 h-11 flex items-center justify-center border text-[10px] tracking-widest transition-all", !isAvailable ? "border-stone-100 text-stone-200 cursor-not-allowed" : selectedSize === size ? "border-gold bg-gold text-white" : "border-stone-200 text-stone-600 hover:border-gold")}>
+                        <button key={size} disabled={!isAvailable} onClick={() => setSelectedSize(size)} className={cn("w-11 h-11 flex items-center justify-center border text-micro tracking-widest transition-all", !isAvailable ? "border-stone-100 text-stone-200 cursor-not-allowed" : selectedSize === size ? "border-gold bg-gold text-white" : "border-stone-200 text-stone-600 hover:border-gold")}>
                           {size}
                         </button>
                       );
                     })}
                   </div>
                 </div>
 
                 <div className="flex flex-col sm:flex-row gap-3">
                   <div className="flex-1 flex flex-col gap-2">
                     <button onClick={reserveViewing} className="w-full btn-luxury flex items-center justify-center gap-3">
@@ -390,165 +390,165 @@ export default function ProductDetail() {
                       {isAddingToCart ? (
                         <Loader2 className="w-4 h-4 animate-spin" />
                       ) : (
                         <>
                           <ShoppingBag className="w-3.5 h-3.5" />
                           {isRent ? t('product.book_rental') : t('product.add_to_collection')}
                         </>
                       )}
                     </button>
                     {errorMsg && (
-                      <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-rose-500 uppercase tracking-widest text-center font-bold">
+                      <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-micro text-rose-500 uppercase tracking-widest text-center font-bold">
                         {errorMsg}
                       </motion.p>
                     )}
                   </div>
-                  <button onClick={(e) => { e.preventDefault(); if (saved) { removeFromWishlist(product.id); } else { addToWishlist(product); } }} className={cn("w-12 h-12 flex items-center justify-center border transition-all", saved ? "border-rose-200 text-rose-500 bg-rose-50" : "border-stone-200 text-stone-500 hover:text-rose-500 hover:border-rose-200")} aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}>
+                  <button onClick={(e) => { e.preventDefault(); if (saved) { removeFromWishlist(product.id); } else { addToWishlist(product); } }} className={cn("w-12 h-12 flex items-center justify-center border transition-all", saved ? "border-rose-200 text-rose-500 bg-rose-50" : "border-stone-200 text-stone-600 hover:text-rose-500 hover:border-rose-200")} aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}>
                     <Heart className={cn("w-4 h-4", saved && "fill-current")} />
                   </button>
                 </div>
               </div>
 
               {/* Trust Badges ΓÇö 3-column grid */}
               <div className="grid grid-cols-3 gap-4 py-8 border-t border-b border-stone-100 mb-10 bg-gold/[0.03]">
                 <div className="flex flex-col items-center text-center gap-2">
                   <ShieldCheck className="w-5 h-5 text-gold" />
-                  <span className="text-[9px] font-bold text-stone-800 tracking-wider leading-tight">{t('product.couture_care')}</span>
-                  <span className="text-[8px] text-stone-400 uppercase tracking-widest font-bold">{t('product.cleaning_included')}</span>
+                  <span className="text-micro font-bold text-stone-800 tracking-wider leading-tight">{t('product.couture_care')}</span>
+                  <span className="text-micro text-stone-600 uppercase tracking-widest font-bold">{t('product.cleaning_included')}</span>
                 </div>
                 <div className="flex flex-col items-center text-center gap-2 border-x border-stone-100">
                   <Truck className="w-5 h-5 text-gold" />
-                  <span className="text-[9px] font-bold text-stone-800 tracking-wider leading-tight">{t('product.secure_delivery')}</span>
-                  <span className="text-[8px] text-stone-400 uppercase tracking-widest font-bold">{t('product.uae_gcc')}</span>
+                  <span className="text-micro font-bold text-stone-800 tracking-wider leading-tight">{t('product.secure_delivery')}</span>
+                  <span className="text-micro text-stone-600 uppercase tracking-widest font-bold">{t('product.uae_gcc')}</span>
                 </div>
                 <div className="flex flex-col items-center text-center gap-2">
                   <Ruler className="w-5 h-5 text-gold" />
-                  <span className="text-[9px] font-bold text-stone-800 tracking-wider leading-tight">{t('product.bespoke_fit')}</span>
-                  <span className="text-[8px] text-stone-400 uppercase tracking-widest font-bold">{t('product.custom_tailoring')}</span>
+                  <span className="text-micro font-bold text-stone-800 tracking-wider leading-tight">{t('product.bespoke_fit')}</span>
+                  <span className="text-micro text-stone-600 uppercase tracking-widest font-bold">{t('product.custom_tailoring')}</span>
                 </div>
               </div>
 
               {/* Specifications Accordion */}
               <div className="border border-stone-100 mb-4">
                 <button onClick={() => setShowDetails(!showDetails)} className="w-full flex items-center justify-between p-5 bg-ivory hover:bg-ivory transition-colors">
-                  <span className="font-body text-[10px] font-bold tracking-widest uppercase text-stone-800">{t('product.specifications')}</span>
-                  <ChevronDown className={cn("w-4 h-4 text-stone-400 transition-transform duration-300", showDetails && "rotate-180")} />
+                  <span className="font-body text-micro font-bold tracking-widest uppercase text-stone-800">{t('product.specifications')}</span>
+                  <ChevronDown className={cn("w-4 h-4 text-stone-600 transition-transform duration-300", showDetails && "rotate-180")} />
                 </button>
                 <AnimatePresence>
                   {showDetails && (
                     <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                       <div className="border-t border-stone-100">
                         <div className="flex justify-between py-3.5 px-5 bg-ivory">
-                          <span className="text-[10px] text-gold uppercase tracking-widest font-bold">{t('product.fabric')}</span>
+                          <span className="text-micro text-gold uppercase tracking-widest font-bold">{t('product.fabric')}</span>
                           <span className="text-xs text-stone-800 font-medium tracking-wide">{product.fabric || 'Luxury Blend'}</span>
                         </div>
                         <div className="flex justify-between py-3.5 px-5 bg-stone-50/50">
-                          <span className="text-[10px] text-gold uppercase tracking-widest font-bold">{t('product.designer')}</span>
+                          <span className="text-micro text-gold uppercase tracking-widest font-bold">{t('product.designer')}</span>
                           <span className="text-xs text-stone-800 font-medium tracking-wide">{product.designer || 'Riman Atelier'}</span>
                         </div>
                         <div className="py-3.5 px-5 bg-ivory">
-                          <span className="text-[10px] text-gold uppercase tracking-widest font-bold block mb-2">{t('product.style_elements')}</span>
+                          <span className="text-micro text-gold uppercase tracking-widest font-bold block mb-2">{t('product.style_elements')}</span>
                           <div className="flex flex-wrap gap-2">
                             {product.style.map((tag, i) => (
-                              <span key={i} className="text-[10px] px-3 py-1 bg-stone-50 border border-stone-100 text-stone-500 uppercase tracking-[0.15em] font-medium">{tag}</span>
+                              <span key={i} className="text-micro px-3 py-1 bg-stone-50 border border-stone-100 text-stone-600 uppercase tracking-[0.15em] font-medium">{tag}</span>
                             ))}
                             {product.category && (
-                              <span className="text-[10px] px-3 py-1 bg-gold/5 border border-gold/10 text-gold uppercase tracking-[0.15em] font-bold">{product.category}</span>
+                              <span className="text-micro px-3 py-1 bg-gold/5 border border-gold/10 text-gold uppercase tracking-[0.15em] font-bold">{product.category}</span>
                             )}
                           </div>
                         </div>
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
 
               {/* Care Instructions Accordion */}
               <div className="border border-stone-100 mb-4">
                 <button onClick={() => setShowCare(!showCare)} className="w-full flex items-center justify-between p-5 bg-ivory hover:bg-ivory transition-colors">
-                  <span className="font-body text-[10px] font-bold tracking-widest uppercase text-stone-800">{t('product.care_instructions')}</span>
-                  <ChevronDown className={cn("w-4 h-4 text-stone-400 transition-transform duration-300", showCare && "rotate-180")} />
+                  <span className="font-body text-micro font-bold tracking-widest uppercase text-stone-800">{t('product.care_instructions')}</span>
+                  <ChevronDown className={cn("w-4 h-4 text-stone-600 transition-transform duration-300", showCare && "rotate-180")} />
                 </button>
                 <AnimatePresence>
                   {showCare && (
                     <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                       <div className="p-5 pt-0 space-y-3">
                         <div className="flex gap-4">
                           <div className="w-px h-auto bg-gold/30 shrink-0" />
                           <div>
-                            <h5 className="font-body text-[10px] font-bold tracking-widest uppercase mb-1">{t('product.care_dry_clean')}</h5>
-                            <p className="text-[11px] text-stone-500 leading-relaxed italic">{t('product.care_dry_clean_desc')}</p>
+                            <h5 className="font-body text-micro font-bold tracking-widest uppercase mb-1">{t('product.care_dry_clean')}</h5>
+                            <p className="text-micro text-stone-600 leading-relaxed italic">{t('product.care_dry_clean_desc')}</p>
                           </div>
                         </div>
                         <div className="flex gap-4">
                           <div className="w-px h-auto bg-gold/30 shrink-0" />
                           <div>
-                            <h5 className="font-body text-[10px] font-bold tracking-widest uppercase mb-1">{t('product.care_store')}</h5>
-                            <p className="text-[11px] text-stone-500 leading-relaxed italic">{t('product.care_store_desc')}</p>
+                            <h5 className="font-body text-micro font-bold tracking-widest uppercase mb-1">{t('product.care_store')}</h5>
+                            <p className="text-micro text-stone-600 leading-relaxed italic">{t('product.care_store_desc')}</p>
                           </div>
                         </div>
                         <div className="flex gap-4">
                           <div className="w-px h-auto bg-gold/30 shrink-0" />
                           <div>
-                            <h5 className="font-body text-[10px] font-bold tracking-widest uppercase mb-1">{t('product.care_handle')}</h5>
-                            <p className="text-[11px] text-stone-500 leading-relaxed italic">{t('product.care_handle_desc')}</p>
+                            <h5 className="font-body text-micro font-bold tracking-widest uppercase mb-1">{t('product.care_handle')}</h5>
+                            <p className="text-micro text-stone-600 leading-relaxed italic">{t('product.care_handle_desc')}</p>
                           </div>
                         </div>
                         <div className="flex gap-4">
                           <div className="w-px h-auto bg-gold/30 shrink-0" />
                           <div>
-                            <h5 className="font-body text-[10px] font-bold tracking-widest uppercase mb-1">{t('product.care_steam')}</h5>
-                            <p className="text-[11px] text-stone-500 leading-relaxed italic">{t('product.care_steam_desc')}</p>
+                            <h5 className="font-body text-micro font-bold tracking-widest uppercase mb-1">{t('product.care_steam')}</h5>
+                            <p className="text-micro text-stone-600 leading-relaxed italic">{t('product.care_steam_desc')}</p>
                           </div>
                         </div>
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
 
               {/* Ask a Stylist CTA */}
               <Link to="/appointment" className="block p-5 bg-gold/5 border border-gold/20 hover:border-gold/40 transition-all mb-4 group">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-gold/10 flex items-center justify-center shrink-0">
                     <MessageCircle className="w-5 h-5 text-gold" />
                   </div>
                   <div>
                     <h4 className="font-heading text-xs tracking-[0.15em] uppercase text-stone-800 mb-1 group-hover:text-gold transition-colors">{t('product.ask_stylist')}</h4>
-                    <p className="text-[10px] text-stone-500 tracking-wide">{t('product.ask_stylist_desc')}</p>
+                    <p className="text-micro text-stone-600 tracking-wide">{t('product.ask_stylist_desc')}</p>
                   </div>
                   <ChevronRight className="w-4 h-4 text-gold ml-auto group-hover:translate-x-1 transition-transform" />
                 </div>
               </Link>
 
               {/* Artistry & Essence ΓÇö collapsible */}
               <div className="border border-stone-100">
                 <button onClick={() => setShowDetails(!showDetails)} className="w-full flex items-center justify-between p-5 bg-ivory hover:bg-ivory transition-colors">
-                  <span className="font-body text-[10px] font-bold tracking-widest uppercase text-stone-800">{t('product.artistry_essence')}</span>
-                  <ChevronDown className={cn("w-4 h-4 text-stone-400 transition-transform duration-300", showDetails && "rotate-180")} />
+                  <span className="font-body text-micro font-bold tracking-widest uppercase text-stone-800">{t('product.artistry_essence')}</span>
+                  <ChevronDown className={cn("w-4 h-4 text-stone-600 transition-transform duration-300", showDetails && "rotate-180")} />
                 </button>
                 <AnimatePresence>
                   {showDetails && (
                     <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                       <div className="p-5 pt-0 space-y-5">
                         <div className="flex gap-4">
                           <div className="w-px h-auto bg-gold/30 shrink-0" />
                           <div>
-                            <h5 className="font-body text-[10px] font-bold tracking-widest uppercase mb-1">{t('product.fitting_title')}</h5>
-                            <p className="text-[11px] text-stone-500 leading-relaxed italic">{t('product.fitting_desc')}</p>
+                            <h5 className="font-body text-micro font-bold tracking-widest uppercase mb-1">{t('product.fitting_title')}</h5>
+                            <p className="text-micro text-stone-600 leading-relaxed italic">{t('product.fitting_desc')}</p>
                           </div>
                         </div>
                         <div className="flex gap-4">
                           <div className="w-px h-auto bg-gold/30 shrink-0" />
                           <div>
-                            <h5 className="font-body text-[10px] font-bold tracking-widest uppercase mb-1">{t('product.texture_title')}</h5>
-                            <p className="text-[11px] text-stone-500 leading-relaxed italic">{t('product.texture_desc')}</p>
+                            <h5 className="font-body text-micro font-bold tracking-widest uppercase mb-1">{t('product.texture_title')}</h5>
+                            <p className="text-micro text-stone-600 leading-relaxed italic">{t('product.texture_desc')}</p>
                           </div>
                         </div>
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
             </div>
           </div>
 
@@ -556,129 +556,129 @@ export default function ProductDetail() {
           <section className="pt-16 border-t border-stone-100 mb-20">
             <button onClick={() => setShowReviews(!showReviews)} className="w-full flex items-center justify-between mb-10 group">
               <h3 className="font-heading text-2xl md:text-3xl text-stone-800 tracking-wide uppercase">{t('product.client_reflections')}</h3>
               <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                   <div className="flex">
                     {[1, 2, 3, 4, 5].map((star) => (
                       <Star key={star} className={cn("w-4 h-4", star <= 4.5 ? "text-gold fill-gold" : "text-stone-200")} />
                     ))}
                   </div>
-                  <span className="text-xs text-stone-500 font-bold tracking-widest">(4.8)</span>
+                  <span className="text-xs text-stone-600 font-bold tracking-widest">(4.8)</span>
                 </div>
-                <ChevronDown className={cn("w-5 h-5 text-stone-400 transition-transform duration-300", showReviews && "rotate-180")} />
+                <ChevronDown className={cn("w-5 h-5 text-stone-600 transition-transform duration-300", showReviews && "rotate-180")} />
               </div>
             </button>
             <AnimatePresence>
               {showReviews && (
                 <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-4">
                     <div className="lg:col-span-2">
                       <div className="space-y-8">
                         {reviews.map((review) => (
                           <div key={review.id} className="pb-8 border-b border-stone-50 last:border-0">
                             <div className="flex justify-between items-start mb-3">
                               <div>
-                                <p className="text-[10px] font-bold text-stone-800 uppercase tracking-widest mb-1">{review.name}</p>
+                                <p className="text-micro font-bold text-stone-800 uppercase tracking-widest mb-1">{review.name}</p>
                                 <div className="flex gap-1 mb-2">
                                   {[1, 2, 3, 4, 5].map((star) => (
                                     <Star key={star} className={cn("w-3 h-3", star <= review.rating ? "text-gold fill-gold" : "text-stone-200")} />
                                   ))}
                                 </div>
                               </div>
-                              <span className="text-[9px] text-stone-400 uppercase tracking-widest">{review.date}</span>
+                              <span className="text-micro text-stone-600 uppercase tracking-widest">{review.date}</span>
                             </div>
                             <p className="text-sm text-stone-600 leading-relaxed italic">"{review.comment}"</p>
                           </div>
                         ))}
                       </div>
                     </div>
 
                     {/* Review Submission Form */}
                     <div className="bg-pearl p-8 border border-stone-100 min-h-[400px] flex flex-col">
                       <h4 className="font-heading text-lg text-stone-800 tracking-widest uppercase mb-6">{t('product.leave_reflection')}</h4>
                       <AnimatePresence mode="wait">
                         {reviewSuccess ? (
                           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                             <CheckCircle2 className="w-12 h-12 text-green-500" />
-                            <p className="text-[10px] tracking-widest text-stone-600 uppercase font-bold">{t('product.reflection_curated')}</p>
-                            <button onClick={() => setReviewSuccess(false)} className="text-[9px] text-gold uppercase tracking-widest border-b border-gold/30 pb-1">{t('product.write_another')}</button>
+                            <p className="text-micro tracking-widest text-stone-600 uppercase font-bold">{t('product.reflection_curated')}</p>
+                            <button onClick={() => setReviewSuccess(false)} className="text-micro text-gold uppercase tracking-widest border-b border-gold/30 pb-1">{t('product.write_another')}</button>
                           </motion.div>
                         ) : (
                           <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6" onSubmit={(e) => {
                             e.preventDefault();
                             if (!newReview.name || !newReview.comment) return;
                             const review: Review = { id: Date.now().toString(), ...newReview, date: 'Just now' };
                             setReviews([review, ...reviews]);
                             setNewReview({ name: '', rating: 5, comment: '' });
                             setReviewSuccess(true);
                           }}>
                             <div>
-                              <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">{t('product.rating')}</label>
+                              <label className="block text-micro font-bold text-stone-600 uppercase tracking-widest mb-2">{t('product.rating')}</label>
                               <div className="flex gap-2">
                                 {[1, 2, 3, 4, 5].map((star) => (
                                   <button key={star} type="button" onClick={() => setNewReview({ ...newReview, rating: star })} className="transition-transform hover:scale-110">
                                     <Star className={cn("w-7 h-7", star <= newReview.rating ? "text-gold fill-gold" : "text-stone-200")} />
                                   </button>
                                 ))}
                               </div>
                             </div>
                             <div>
-                              <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">{t('product.your_name')}</label>
+                              <label className="block text-micro font-bold text-stone-600 uppercase tracking-widest mb-2">{t('product.your_name')}</label>
                               <input type="text" value={newReview.name} onChange={(e) => setNewReview({ ...newReview, name: e.target.value })} className="w-full px-5 py-4 bg-ivory border border-stone-100 text-xs tracking-widest outline-none focus:border-gold transition-colors" placeholder={t('product.enter_name')} />
                             </div>
                             <div>
-                              <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">{t('product.your_reflection')}</label>
+                              <label className="block text-micro font-bold text-stone-600 uppercase tracking-widest mb-2">{t('product.your_reflection')}</label>
                               <textarea rows={4} value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} className="w-full px-5 py-4 bg-ivory border border-stone-100 text-xs tracking-widest outline-none focus:border-gold transition-colors resize-none" placeholder={t('product.share_experience')}></textarea>
                             </div>
                             <button type="submit" className="w-full btn-luxury">{t('product.submit_review')}</button>
                           </motion.form>
                         )}
                       </AnimatePresence>
                     </div>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
           </section>
 
           {/* Related Products */}
           {relatedProducts.length > 0 && (
             <section className="pt-16 border-t border-stone-100">
               <div className="flex flex-col items-center text-center mb-12">
-                <h2 className="heading-editorial text-stone-400 text-sm mb-3">{t('product.complementary_picks')}</h2>
+                <h2 className="heading-editorial text-stone-600 text-sm mb-3">{t('product.complementary_picks')}</h2>
                 <h3 className="font-heading text-3xl text-stone-800 tracking-wide">{t('product.curated_for_you')}</h3>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                 {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
               </div>
             </section>
           )}
         </div>
 
         {/* Mobile Sticky Bottom Bar */}
         <div className="fixed bottom-0 left-0 right-0 z-50 bg-ivory border-t border-stone-200 p-4 flex items-center gap-4 lg:hidden">
           <div className="flex-1 min-w-0">
-            <p className="font-heading text-[11px] tracking-wider uppercase text-stone-800 truncate">{product.name}</p>
-            <p className="font-heading text-sm text-gold"><span className="text-[10px] font-body text-stone-400 uppercase tracking-wider me-1">{t('pricing.from')}</span>{formatPrice(isSale ? (product.salePrice || 0) : (isRent ? (product.rentalPrice || 0) : 0))}</p>
+            <p className="font-heading text-micro tracking-wider uppercase text-stone-800 truncate">{product.name}</p>
+            <p className="font-heading text-sm text-gold"><span className="text-micro font-body text-stone-600 uppercase tracking-wider me-1">{t('pricing.from')}</span>{formatPrice(isSale ? (product.salePrice || 0) : (isRent ? (product.rentalPrice || 0) : 0))}</p>
           </div>
           <div className="flex flex-col gap-1.5 shrink-0">
-            <button onClick={reserveViewing} className="btn-luxury !py-2.5 !px-5 text-[10px] flex items-center justify-center gap-2 whitespace-nowrap">
+            <button onClick={reserveViewing} className="btn-luxury !py-2.5 !px-5 text-micro flex items-center justify-center gap-2 whitespace-nowrap">
               <Sparkles className="w-3.5 h-3.5" />
               {t('product.reserve_viewing')}
             </button>
-            <button onClick={handleAddToCart} disabled={isAddingToCart} className="btn-luxury-outline !py-2.5 !px-5 text-[10px] flex items-center justify-center gap-2 whitespace-nowrap">
+            <button onClick={handleAddToCart} disabled={isAddingToCart} className="btn-luxury-outline !py-2.5 !px-5 text-micro flex items-center justify-center gap-2 whitespace-nowrap">
               {isAddingToCart ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShoppingBag className="w-3.5 h-3.5" />}
               {isRent ? t('product.book_rental') : t('product.add_to_collection')}
             </button>
           </div>
-          <button onClick={(e) => { e.preventDefault(); if (saved) { removeFromWishlist(product.id); } else { addToWishlist(product); } }} className={cn("w-10 h-10 flex items-center justify-center border transition-all shrink-0", saved ? "border-rose-200 text-rose-500 bg-rose-50" : "border-stone-200 text-stone-500")} aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}>
+          <button onClick={(e) => { e.preventDefault(); if (saved) { removeFromWishlist(product.id); } else { addToWishlist(product); } }} className={cn("w-10 h-10 flex items-center justify-center border transition-all shrink-0", saved ? "border-rose-200 text-rose-500 bg-rose-50" : "border-stone-200 text-stone-600")} aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}>
             <Heart className={cn("w-4 h-4", saved && "fill-current")} />
           </button>
         </div>
 
         {/* Reservation Confirmation Modal */}
         <AnimatePresence>
           {showConfirmation && bookingDate && (
             <BookingConfirmationModal product={product} date={bookingDate} onClose={() => setShowConfirmation(false)} />
           )}
         </AnimatePresence>
@@ -699,65 +699,65 @@ function BookingConfirmationModal({ product, date, onClose }: { product: Product
       exit={{ opacity: 0 }}
       className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-stone-900/40 backdrop-blur-sm"
     >
       <motion.div
         initial={{ opacity: 0, scale: 0.95, y: 20 }}
         animate={{ opacity: 1, scale: 1, y: 0 }}
         className="bg-ivory max-w-lg w-full p-8 md:p-12 relative border border-stone-200 max-h-[90vh] overflow-y-auto"
         role="dialog"
         aria-modal="true"
       >
-        <button onClick={onClose} className="sticky top-0 float-right p-2 text-stone-400 hover:text-stone-800 transition-colors">
+        <button onClick={onClose} className="sticky top-0 float-right p-2 text-stone-600 hover:text-stone-800 transition-colors">
           <X className="w-5 h-5" />
         </button>
 
         <div className="text-center">
           <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
             <CheckCircle2 className="w-10 h-10" />
           </div>
 
           <h3 className="font-heading text-3xl text-stone-800 mb-2 uppercase tracking-widest">{t('product.reservation_secured')}</h3>
           <div className="w-12 h-px bg-gold mx-auto my-4" />
-          <p className="text-stone-400 text-[10px] tracking-widest uppercase mb-10">{t('product.atelier_moment_booked')}</p>
+          <p className="text-stone-600 text-micro tracking-widest uppercase mb-10">{t('product.atelier_moment_booked')}</p>
 
           <div className="bg-stone-50 p-6 mb-10 text-left space-y-4">
             <div className="flex justify-between items-center text-xs pb-4 border-b border-stone-100">
-              <span className="text-stone-400 uppercase tracking-widest">{t('product.selection')}</span>
+              <span className="text-stone-600 uppercase tracking-widest">{t('product.selection')}</span>
               <span className="font-bold text-stone-800">{product.name}</span>
             </div>
             <div className="flex justify-between items-center text-xs pb-4 border-b border-stone-100">
-              <span className="text-stone-400 uppercase tracking-widest">{t('product.period_starts')}</span>
+              <span className="text-stone-600 uppercase tracking-widest">{t('product.period_starts')}</span>
               <div className="flex items-center gap-2 font-bold text-stone-800">
                 <Calendar className="w-3 h-3 text-gold" />
                 {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
               </div>
             </div>
           </div>
 
           <div className="text-left space-y-6 mb-10">
             <div className="flex gap-3">
               <Info className="w-4 h-4 text-gold shrink-0 mt-0.5" />
               <div>
-                <p className="text-[10px] font-bold text-stone-800 uppercase tracking-widest mb-1">{t('product.rental_policy')}</p>
-                <p className="text-xs text-stone-500 leading-relaxed italic">{t('product.rental_policy_desc')}</p>
+                <p className="text-micro font-bold text-stone-800 uppercase tracking-widest mb-1">{t('product.rental_policy')}</p>
+                <p className="text-xs text-stone-600 leading-relaxed italic">{t('product.rental_policy_desc')}</p>
               </div>
             </div>
             <div className="flex gap-3">
               <ShieldCheck className="w-4 h-4 text-gold shrink-0 mt-0.5" />
               <div>
-                <p className="text-[10px] font-bold text-stone-800 uppercase tracking-widest mb-1">{t('product.security_deposit')}</p>
-                <p className="text-xs text-stone-500 leading-relaxed italic">{t('product.security_deposit_desc')} {formatPrice(product.securityDeposit || 5000)} {t('product.will_be_held')}</p>
+                <p className="text-micro font-bold text-stone-800 uppercase tracking-widest mb-1">{t('product.security_deposit')}</p>
+                <p className="text-xs text-stone-600 leading-relaxed italic">{t('product.security_deposit_desc')} {formatPrice(product.securityDeposit || 5000)} {t('product.will_be_held')}</p>
               </div>
             </div>
           </div>
 
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
-            <button onClick={onClose} className="btn-luxury-outline w-full !py-4 text-[10px]">{t('product.continue_exploring')}</button>
-            <Link to="/checkout" className="btn-luxury w-full !py-4 text-[10px] flex items-center justify-center gap-2">
+            <button onClick={onClose} className="btn-luxury-outline w-full !py-4 text-micro">{t('product.continue_exploring')}</button>
+            <Link to="/checkout" className="btn-luxury w-full !py-4 text-micro flex items-center justify-center gap-2">
               <ShoppingBag className="w-4 h-4" /> {t('product.go_to_checkout')}
             </Link>
           </div>
         </div>
       </motion.div>
     </motion.div>
   );
 }
\ No newline at end of file
diff --git a/src/pages/ProfilePage.tsx b/src/pages/ProfilePage.tsx
index 2497ea8..fa2aa22 100644
--- a/src/pages/ProfilePage.tsx
+++ b/src/pages/ProfilePage.tsx
@@ -49,45 +49,45 @@ export default function ProfilePage() {
           <aside className="w-full lg:w-80">
             <div className="bg-ivory p-8 border border-stone-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 blur-2xl -translate-y-1/2 translate-x-1/2" />
                
                <div className="flex items-center gap-4 mb-10 relative z-10">
                  <div className="w-16 h-16 bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
                    <User className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="font-heading text-lg text-stone-800 tracking-wide">{user.name}</h2>
-                    <p className="text-[10px] text-stone-400 uppercase tracking-widest">{user.role} {t('profile.member')}</p>
+                    <p className="text-micro text-stone-600 uppercase tracking-widest">{user.role} {t('profile.member')}</p>
                  </div>
                </div>
 
                <nav className="space-y-1 relative z-10">
                    <ProfileLink icon={ShoppingBag} label={t('profile.orders')} active onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
                    <Link to="/wishlist"><ProfileLink icon={Heart} label={t('wishlist.title')} /></Link>
                    <Link to="/appointment"><ProfileLink icon={Calendar} label={t('profile.appointments')} /></Link>
                    <ProfileLink icon={Settings} label={t('profile.preferences')} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
                  <button 
                     onClick={async () => { await signOut(); navigate('/'); }}
-                   className="w-full flex items-center gap-4 p-4 text-[10px] text-stone-400 uppercase tracking-[0.2em] hover:text-rose-500 hover:bg-rose-50/30 transition-all text-left mt-8 border-t border-stone-50 pt-8"
+                   className="w-full flex items-center gap-4 p-4 text-micro text-stone-600 uppercase tracking-[0.2em] hover:text-rose-500 hover:bg-rose-50/30 transition-all text-left mt-8 border-t border-stone-50 pt-8"
                  >
                     <LogOut className="w-4 h-4" /> {t('profile.sign_out')}
                  </button>
                </nav>
             </div>
           </aside>
 
           {/* Main Content */}
           <main className="flex-1 space-y-12">
             <header>
                <h1 className="font-heading text-4xl text-stone-800 tracking-wider uppercase mb-3">{t('profile.dashboard')}</h1>
                <div className="w-12 h-px bg-gold mb-3" />
-               <p className="font-body text-stone-400 text-[10px] tracking-[0.2em] uppercase italic">{t('profile.welcome')}</p>
+               <p className="font-body text-stone-600 text-micro tracking-[0.2em] uppercase italic">{t('profile.welcome')}</p>
             </header>
 
             {/* Quick Stats */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <StatBox label={t('profile.total_investments')} value={isSupabaseConfigured ? formatPrice(totalInvested) : 'ΓÇö'} />
               <StatBox label={t('profile.active_rentals')} value={isSupabaseConfigured ? String(activeRentals) : 'ΓÇö'} />
               <StatBox label={t('profile.orders_placed')} value={isSupabaseConfigured ? String(orders.length) : 'ΓÇö'} />
             </div>
 
             {/* Recent Orders */}
@@ -101,79 +101,79 @@ export default function ProfilePage() {
                    {[1, 2, 3].map(i => (
                      <div key={i} className="bg-stone-50 p-6 border border-stone-100 animate-pulse">
                        <div className="h-4 w-40 bg-stone-200 mb-3" />
                        <div className="h-3 w-60 bg-stone-100" />
                      </div>
                    ))}
                  </div>
                ) : !isSupabaseConfigured ? (
                  <div className="bg-ivory p-12 text-center border border-stone-100">
                    <Package className="w-10 h-10 text-stone-200 mx-auto mb-4" />
-                    <p className="text-[10px] tracking-widest text-stone-400 uppercase">{t('profile.backend_not_connected')}</p>
+                    <p className="text-micro tracking-widest text-stone-600 uppercase">{t('profile.backend_not_connected')}</p>
                  </div>
                ) : recentOrders.length === 0 ? (
                  <div className="bg-ivory p-12 text-center border border-stone-100">
                    <Package className="w-10 h-10 text-stone-200 mx-auto mb-4" />
-                    <p className="text-[10px] tracking-widest text-stone-400 uppercase mb-6">{t('profile.no_orders')}</p>
-                    <Link to="/collection/bridal" className="text-[10px] text-gold uppercase tracking-[0.3em] font-bold underline underline-offset-4">{t('profile.explore_new')}</Link>
+                    <p className="text-micro tracking-widest text-stone-600 uppercase mb-6">{t('profile.no_orders')}</p>
+                    <Link to="/collection/bridal" className="text-micro text-gold uppercase tracking-[0.3em] font-bold underline underline-offset-4">{t('profile.explore_new')}</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map(order => (
                      <div key={order.id} className="bg-ivory p-6 border border-stone-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-gold/20 transition-colors">
                        <div>
-                         <h4 className="text-[11px] font-bold text-stone-800 uppercase tracking-widest mb-1">
+                         <h4 className="text-micro font-bold text-stone-800 uppercase tracking-widest mb-1">
                             {order.type === 'rental' ? t('profile.rental_booking') : order.type === 'mixed' ? t('profile.combined_order') : t('profile.purchase_order')} ΓÇö {order.id?.slice(0, 8)}
                          </h4>
-                         <p className="text-[12px] text-stone-500 italic mb-1">{order.items?.map(i => i.product_name).join(', ') || 'Order items'}</p>
-                         <p className="text-[9px] text-stone-300 uppercase tracking-widest">{order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}</p>
+                         <p className="text-caption text-stone-600 italic mb-1">{order.items?.map(i => i.product_name).join(', ') || 'Order items'}</p>
+                         <p className="text-micro text-stone-500 uppercase tracking-widest">{order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-gold font-heading text-sm font-bold">{formatPrice(order.subtotal)}</span>
                          <span className={cn(
-                           "px-3 py-1 text-[9px] font-bold uppercase tracking-widest border",
+                           "px-3 py-1 text-micro font-bold uppercase tracking-widest border",
                            order.status === 'cancelled' ? 'text-rose-400 border-rose-100 bg-rose-50/30' :
                            order.status === 'completed' || order.status === 'delivered' ? 'text-emerald-600 border-emerald-100 bg-emerald-50/30' :
                            'text-gold border-gold/10 bg-ivory'
                          )}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {recentOrders.length > 0 && (
-                 <Link to="/collection/bridal" className="inline-flex items-center gap-3 text-[10px] text-gold uppercase tracking-[0.3em] font-bold mt-8 hover:gap-5 transition-all">
+                 <Link to="/collection/bridal" className="inline-flex items-center gap-3 text-micro text-gold uppercase tracking-[0.3em] font-bold mt-8 hover:gap-5 transition-all">
                     {t('profile.explore_new')} <ChevronRight className="w-3 h-3" />
                  </Link>
                )}
             </section>
           </main>
         </div>
       </div>
     </div>
   );
 }
 
 function ProfileLink({ icon: Icon, label, active, onClick }: any) {
   return (
     <button
       onClick={onClick}
       className={cn(
-        "w-full flex items-center gap-4 p-4 text-[10px] uppercase tracking-[0.2em] transition-all text-left border-l-2",
-        active ? "bg-gold/5 text-gold font-bold border-gold" : "text-stone-400 hover:text-stone-800 hover:bg-stone-50 border-transparent"
+        "w-full flex items-center gap-4 p-4 text-micro uppercase tracking-[0.2em] transition-all text-left border-l-2",
+        active ? "bg-gold/5 text-gold font-bold border-gold" : "text-stone-600 hover:text-stone-800 hover:bg-stone-50 border-transparent"
       )}
     >
       <Icon className="w-4 h-4" /> {label}
     </button>
   );
 }
 
 function StatBox({ label, value }: any) {
   return (
     <div className="bg-ivory p-8 border border-stone-100">
-      <p className="text-[9px] text-stone-400 uppercase tracking-widest mb-2">{label}</p>
+      <p className="text-micro text-stone-600 uppercase tracking-widest mb-2">{label}</p>
       <p className="font-heading text-2xl text-stone-800 tracking-wide">{value}</p>
     </div>
   );
 }
diff --git a/src/pages/SearchPage.tsx b/src/pages/SearchPage.tsx
index 5fd8cd4..02b83cd 100644
--- a/src/pages/SearchPage.tsx
+++ b/src/pages/SearchPage.tsx
@@ -28,66 +28,66 @@ export default function SearchPage() {
     });
   }, [query, activeCategory, products]);
 
   return (
     <div className="pt-24 bg-ivory min-h-screen">
       {/* Search Header */}
       <section className="bg-ivory py-20 border-b border-stone-100 z-40">
         <div className="container mx-auto px-6">
           <div className="max-w-4xl mx-auto">
              <div className="relative group">
-                <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-gold transition-colors" />
+                <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500 group-focus-within:text-gold transition-colors" />
                 <input 
                   type="text" 
                   value={query}
                   onChange={(e) => setQuery(e.target.value)}
                   placeholder={t('search.placeholder')}
                   className="w-full bg-stone-50 border-stone-100 p-8 pl-16 text-sm tracking-[0.2em] uppercase outline-none focus:bg-ivory focus:border-gold transition-all"
                   autoFocus
                 />
                 {query && (
                   <button 
                     onClick={() => setQuery('')}
-                    className="absolute right-6 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-800"
+                    className="absolute right-6 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-800"
                     aria-label="Clear search"
                   >
                     <X className="w-5 h-5" />
                   </button>
                 )}
              </div>
 
              {/* Categories */}
 <div className="flex flex-wrap justify-center gap-4 mt-8">
                 {categories.map((cat) => (
                   <button
                     key={cat}
                     onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                     className={cn(
-                      "px-6 py-2 text-[10px] tracking-[0.2em] uppercase transition-all border",
-                      activeCategory === cat ? "bg-onyx text-white border-onyx" : "bg-ivory text-stone-400 border-stone-100 hover:border-gold"
+                      "px-6 py-2 text-micro tracking-[0.2em] uppercase transition-all border",
+                      activeCategory === cat ? "bg-onyx text-white border-onyx" : "bg-ivory text-stone-600 border-stone-100 hover:border-gold"
                     )}
                   >
                     {categoryLabel(cat)}
                   </button>
                 ))}
               </div>
           </div>
         </div>
       </section>
 
       {/* Results */}
       <section className="section-padding container mx-auto px-6">
         <div className="flex justify-between items-center mb-12 border-b border-stone-200 pb-6">
            <h2 className="font-heading text-lg text-stone-800 tracking-widest uppercase">
-             {t('search.results')} <span className="text-stone-300 font-normal ml-2">({filteredProducts.length})</span>
+             {t('search.results')} <span className="text-stone-500 font-normal ml-2">({filteredProducts.length})</span>
            </h2>
-           <button className="flex items-center gap-2 text-[10px] text-stone-400 tracking-widest uppercase hover:text-gold transition-colors">
+           <button className="flex items-center gap-2 text-micro text-stone-600 tracking-widest uppercase hover:text-gold transition-colors">
               <SlidersHorizontal className="w-3 h-3" /> {t('search.advanced_filters')}
            </button>
         </div>
 
         <AnimatePresence mode="popLayout">
            {filteredProducts.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-16"
              >
@@ -102,25 +102,25 @@ export default function SearchPage() {
                  </motion.div>
                ))}
              </motion.div>
            ) : (
               <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="text-center py-20"
               >
                  <div className="w-20 h-20 bg-stone-50 flex items-center justify-center mx-auto mb-8 border border-stone-100">
-                   <SearchIcon className="w-8 h-8 text-stone-300" />
+                   <SearchIcon className="w-8 h-8 text-stone-500" />
                  </div>
                   <h3 className="font-heading text-2xl text-stone-800 mb-4 tracking-widest uppercase">{t('search.empty_heading')}</h3>
                  <div className="w-12 h-px bg-gold mx-auto mb-4" />
-                  <p className="font-body text-stone-400 text-xs uppercase tracking-widest mb-10 max-w-md mx-auto leading-relaxed italic">
+                   <p className="font-body text-stone-600 text-xs uppercase tracking-widest mb-10 max-w-md mx-auto leading-relaxed italic">
                     {t('search.empty_desc')}
                   </p>
                  <button
                    onClick={() => {setQuery(''); setActiveCategory(null);}}
                    className="btn-luxury px-12"
                  >
                     {t('search.clear')}
                  </button>
               </motion.div>
            )}
diff --git a/src/pages/StyleQuiz.tsx b/src/pages/StyleQuiz.tsx
index 5bf699f..844aaba 100644
--- a/src/pages/StyleQuiz.tsx
+++ b/src/pages/StyleQuiz.tsx
@@ -126,21 +126,21 @@ export default function StyleQuiz() {
 
   return (
     <div className="pt-32 pb-20 min-h-screen bg-ivory flex flex-col items-center px-6">
       <div className="max-w-2xl w-full">
         <header className="text-center mb-16">
           <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
           >
             <h1 className="font-heading text-4xl md:text-5xl text-stone-800 tracking-widest uppercase mb-4">{t('quiz.title')}</h1>
-            <p className="font-body text-stone-500 text-[10px] tracking-[0.4em] uppercase">{t('quiz.subtitle')}</p>
+            <p className="font-body text-stone-600 text-micro tracking-[0.4em] uppercase">{t('quiz.subtitle')}</p>
             <div className="w-16 h-px bg-gold mx-auto mt-6" />
           </motion.div>
         </header>
 
         {/* Progress Bar */}
         {!finished && (
           <div className="h-1 bg-stone-100 mb-8">
             <motion.div
               animate={{ width: `${progress}%` }}
               transition={{ duration: 0.4 }}
@@ -153,78 +153,78 @@ export default function StyleQuiz() {
           <AnimatePresence mode="wait">
             {!finished ? (
               <motion.div
                 key={step}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="w-full"
               >
                 <div className="mb-8 flex items-center justify-between">
-                   <span className="text-[10px] tracking-widest text-gold font-bold uppercase">{t('quiz.progress')} {step + 1} / {questions.length}</span>
+                   <span className="text-micro tracking-widest text-gold font-bold uppercase">{t('quiz.progress')} {step + 1} / {questions.length}</span>
                    {step > 0 && (
                      <button 
                        onClick={() => setStep(step - 1)}
-                       className="text-stone-400 hover:text-stone-800 transition-colors"
+                       className="text-stone-600 hover:text-stone-800 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                    )}
                 </div>
                 
                 <h3 className="font-heading text-2xl md:text-3xl text-stone-800 mb-10 tracking-wide">
                   {questions[step].question}
                 </h3>
 
                 <div className="grid grid-cols-1 gap-4">
                   {questions[step].options.map((option) => (
                     <button
                       key={option}
                       onClick={() => handleAnswer(option)}
                       className="group flex items-center justify-between p-6 border border-stone-100 bg-stone-50/50 hover:bg-ivory hover:border-gold hover:shadow-xl hover:shadow-gold/5 transition-all duration-300 text-left"
                     >
                       <span className="font-body text-sm text-stone-700 group-hover:text-stone-900 group-hover:pl-2 transition-all duration-300">{option}</span>
-                      <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-gold transition-colors" />
+                      <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-gold transition-colors" />
                     </button>
                   ))}
                 </div>
               </motion.div>
             ) : (
               <motion.div
                 key="results"
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="w-full"
               >
                 <div className="text-center mb-12">
-                  <span className="text-[10px] tracking-[0.5em] uppercase text-gold font-bold">{t('quiz.your_aesthetic')}</span>
+                  <span className="text-micro tracking-[0.5em] uppercase text-gold font-bold">{t('quiz.your_aesthetic')}</span>
                   <h2 className="font-heading text-3xl md:text-4xl text-stone-800 mt-3 mb-4">
                     {recommendations.length > 0 ? t('quiz.your_matches') : t('quiz.no_matches')}
                   </h2>
                   <div className="w-16 h-px bg-gold mx-auto mb-5" />
-                  <p className="font-body text-sm text-stone-500">
+                  <p className="font-body text-sm text-stone-600">
                     {recommendations.length > 0 
                       ? t('quiz.based_on_answers')
                       : t('quiz.browse_collection')
                     }
                   </p>
                 </div>
 
                 {recommendations.length > 0 ? (
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
                     {recommendations.map((product) => (
                       <ProductCard key={product.id} product={product} />
                     ))}
                   </div>
                 ) : (
                   <div className="text-center py-10">
-                    <p className="font-body text-stone-500 italic">{t('quiz.try_different')}</p>
+                    <p className="font-body text-stone-600 italic">{t('quiz.try_different')}</p>
                   </div>
                 )}
 
                 <div className="flex flex-col sm:flex-row gap-4 justify-center">
                   <Link to="/collection/all" className="btn-luxury flex items-center gap-2 justify-center">
                     <Eye className="w-4 h-4" />
                     {t('quiz.view_all')}
                   </Link>
                   <button 
                     onClick={resetQuiz}
diff --git a/src/pages/WeddingChecklist.tsx b/src/pages/WeddingChecklist.tsx
index 07141a1..6e0a613 100644
--- a/src/pages/WeddingChecklist.tsx
+++ b/src/pages/WeddingChecklist.tsx
@@ -4,21 +4,21 @@ export default function WeddingChecklist() {
     { month: "11 Months Before", task: "Book your first Riman Atelier consultation." },
     { month: "9 Months Before", task: "Finalize your silhouette and fabric selection." },
     { month: "6 Months Before", task: "First fitting and embroidery details." },
     { month: "3 Months Before", task: "Accessorize with veils and headpieces." },
     { month: "1 Month Before", task: "Final fitting and secure collection." },
   ];
 
   return (
     <div className="pt-32 pb-20 container mx-auto px-6 max-w-4xl">
       <div className="text-center mb-20">
-        <h2 className="heading-editorial text-gold text-[10px] mb-4">The Road to I Do</h2>
+        <h2 className="heading-editorial text-gold text-micro mb-4">The Road to I Do</h2>
         <h1 className="font-heading text-4xl md:text-5xl text-stone-800 tracking-wider mb-6">Wedding Planning Checklist</h1>
         <div className="divider-gold" />
       </div>
 
       <div className="space-y-12">
         {steps.map((s, i) => (
           <div key={i} className="flex gap-8 group">
             <div className="text-right w-1/4 shrink-0">
               <span className="font-heading text-2xl text-gold/40 group-hover:text-gold transition-colors">{s.month}</span>
             </div>
diff --git a/src/pages/WishlistPage.tsx b/src/pages/WishlistPage.tsx
index 2444cbb..ee24a10 100644
--- a/src/pages/WishlistPage.tsx
+++ b/src/pages/WishlistPage.tsx
@@ -19,22 +19,22 @@ export default function WishlistPage() {
     addItem(product, 'sale', defaultSize);
     setAddedId(product.id);
     setTimeout(() => setAddedId(null), 2000);
   };
 
   return (
     <div className="pt-32 pb-20 bg-ivory min-h-screen">
       <div className="container mx-auto px-6">
         <header className="text-center mb-20">
            <h1 className="font-heading text-4xl md:text-6xl text-stone-800 tracking-wider uppercase mb-4">{t('selection.title')}</h1>
-           <p className="font-body text-stone-400 text-[10px] tracking-[0.2em] uppercase italic">{t('selection.subtitle')}</p>
-           <p className="font-body text-stone-400 text-[10px] tracking-[0.2em] uppercase italic">{wishlist.length} {t('selection.count')}</p>
+           <p className="font-body text-stone-600 text-micro tracking-[0.2em] uppercase italic">{t('selection.subtitle')}</p>
+           <p className="font-body text-stone-600 text-micro tracking-[0.2em] uppercase italic">{wishlist.length} {t('selection.count')}</p>
         </header>
 
         {isLoading ? (
           <div className="flex items-center justify-center py-32">
             <Loader2 className="w-8 h-8 text-gold animate-spin" />
           </div>
         ) : wishlist.length > 0 ? (
           <>
           <div className="flex justify-center mb-12">
             <button
@@ -54,44 +54,44 @@ export default function WishlistPage() {
                 <motion.div 
                   key={product.id}
                   layout
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.9 }}
                   className="bg-ivory border border-stone-100 group relative"
                 >
                   <button 
                     onClick={() => removeFromWishlist(product.id)}
-                    className="absolute top-4 right-4 z-10 w-8 h-8 bg-ivory/80 backdrop-blur-sm flex items-center justify-center text-stone-400 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
+                    className="absolute top-4 right-4 z-10 w-8 h-8 bg-ivory/80 backdrop-blur-sm flex items-center justify-center text-stone-600 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
                   >
                     <X className="w-4 h-4" />
                   </button>
 
                   <Link to={`/product/${product.id}`} className="block overflow-hidden aspect-[4/5]">
                     <img 
                       src={product.images[0]} 
                       alt={product.name} 
                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                       loading="lazy"
                     />
                   </Link>
 
                   <div className="p-8 text-center border-t border-stone-50">
-                    <span className="text-[10px] text-stone-300 uppercase tracking-widest mb-2 block">{product.category}</span>
+                    <span className="text-micro text-stone-500 uppercase tracking-widest mb-2 block">{product.category}</span>
                     <h3 className="font-heading text-lg text-stone-800 mb-4 tracking-wide group-hover:text-gold transition-colors">{product.name}</h3>
 <p className="font-body text-sm text-gold mb-8">{formatPrice(product.salePrice || product.rentalPrice || 0)}</p>
 
                      <div className="flex gap-2">
-                        <Link to={`/product/${product.id}`} className="flex-1 btn-luxury !py-3 !px-4 text-[10px]">{t('selection.view')}</Link>
+                        <Link to={`/product/${product.id}`} className="flex-1 btn-luxury !py-3 !px-4 text-micro">{t('selection.view')}</Link>
                         <button
                           onClick={() => handleMoveToBag(product)}
-                          className="flex-1 btn-luxury-outline !py-3 !px-4 text-[10px] flex items-center justify-center gap-2"
+                          className="flex-1 btn-luxury-outline !py-3 !px-4 text-micro flex items-center justify-center gap-2"
                         >
                           {addedId === product.id ? (
                             <><CheckCircle2 className="w-3.5 h-3.5" /> {t('product.added')}</>
                           ) : (
                             <><ShoppingBag className="w-3.5 h-3.5" /> {t('selection.add_to_bag')}</>
                           )}
                         </button>
                      </div>
                   </div>
                 </motion.div>
@@ -108,20 +108,20 @@ export default function WishlistPage() {
               className="btn-luxury px-12 w-full sm:w-auto"
             >
               {t('selection.request_viewing')}
             </button>
           </div>
           </>
         ) : (
           <div className="text-center py-32 bg-ivory border border-stone-100">
 <Heart className="w-16 h-16 text-stone-100 mx-auto mb-8" />
               <h3 className="font-heading text-2xl text-stone-800 mb-4 tracking-widest uppercase">{t('selection.empty')}</h3>
-              <p className="font-body text-stone-400 text-xs uppercase tracking-widest mb-10 italic">{t('selection.empty_desc')}</p>
+              <p className="font-body text-stone-600 text-xs uppercase tracking-widest mb-10 italic">{t('selection.empty_desc')}</p>
               <Link to="/search" className="btn-luxury px-12 group flex items-center gap-3 mx-auto w-fit">
                 {t('selection.explore')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </Link>
           </div>
         )}
       </div>
     </div>
   );
 }
