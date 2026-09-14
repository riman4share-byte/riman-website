## Commits
74955a9 feat(i18n): Arabic as default language, locale-aware appointment dates

## Stat
 src/contexts/LanguageContext.tsx | 2 +-
 src/pages/AppointmentPage.tsx    | 6 +++---
 2 files changed, 4 insertions(+), 4 deletions(-)

## Diff
diff --git a/src/contexts/LanguageContext.tsx b/src/contexts/LanguageContext.tsx
index d2f2016..b6db128 100644
--- a/src/contexts/LanguageContext.tsx
+++ b/src/contexts/LanguageContext.tsx
@@ -1405,21 +1405,21 @@ const translations: Record<Language, Record<string, string>> = {
     'gallery.admin_featured': '┘à┘à┘è╪▓',
     'gallery.admin_sort': '╪¬╪▒╪¬┘è╪¿ ╪º┘ä╪╣╪▒╪╢',
 
     // Misc
     'section.journal': '┘à╪¼┘ä╪⌐ ╪▒┘è┘à╪º┘å',
   }
 };
 
 export function LanguageProvider({ children }: { children: ReactNode }) {
   const [language, setLanguage] = useState<Language>(() => {
-    return (localStorage.getItem('riman_lang') as Language) || 'en';
+    return (localStorage.getItem('riman_lang') as Language) || 'ar';
   });
 
   useEffect(() => {
     localStorage.setItem('riman_lang', language);
     document.dir = language === 'ar' ? 'rtl' : 'ltr';
   }, [language]);
 
   const isRtl = language === 'ar';
   
   const t = (key: string) => {
diff --git a/src/pages/AppointmentPage.tsx b/src/pages/AppointmentPage.tsx
index c2e3fd3..51c1128 100644
--- a/src/pages/AppointmentPage.tsx
+++ b/src/pages/AppointmentPage.tsx
@@ -27,21 +27,21 @@ const SLOT_PERIOD: Record<string, 'AM' | 'PM'> = {
   '2:00': 'PM', '2:30': 'PM', '3:00': 'PM', '3:30': 'PM',
   '4:00': 'PM', '4:30': 'PM', '5:00': 'PM', '5:30': 'PM',
   '6:00': 'PM', '6:30': 'PM', '7:00': 'PM', '7:30': 'PM',
   '8:00': 'PM',
 };
 
 const formatSlot = (slot: string) => `${slot} ${SLOT_PERIOD[slot]}`;
 
 export default function AppointmentPage() {
   const [step, setStep] = useState(1);
-  const { t } = useLanguage();
+  const { t, isRtl } = useLanguage();
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [isSubmitted, setIsSubmitted] = useState(false);
   const [error, setError] = useState('');
   const [form, setForm] = useState({
     name: '',
     email: '',
     phone: '',
     date: '',
     time: '',
     service_type: '',
@@ -99,21 +99,21 @@ export default function AppointmentPage() {
         >
           <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-8">
             <CheckCircle2 className="w-10 h-10 text-gold" />
           </div>
           <h1 className="font-heading text-4xl font-light text-stone-800 mb-4">{t('appointment.booked')}</h1>
           <div className="w-12 h-px bg-gold mx-auto mb-6" />
           <p className="font-body text-stone-500 leading-relaxed mb-2">
             {t('appointment.thank_you')}, <span className="text-stone-800 font-semibold">{form.name}</span>.
           </p>
           <p className="font-body text-stone-500 leading-relaxed mb-8">
-            {t('appointment.appointment_booked_for')} <span className="text-stone-800 font-semibold">{new Date(form.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span> {t('appointment.at')} <span className="text-stone-800 font-semibold">{form.time}</span>.
+            {t('appointment.appointment_booked_for')} <span className="text-stone-800 font-semibold">{new Date(form.date).toLocaleDateString(isRtl ? 'ar-AE' : 'en-AE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span> {t('appointment.at')} <span className="text-stone-800 font-semibold">{form.time}</span>.
           </p>
           <div className="w-12 h-px bg-gold mx-auto mb-6" />
           <p className="font-body text-sm text-stone-400 mb-10">{t('appointment.confirmation_sent')} {form.email}. {t('appointment.our_team_reach')}</p>
           <Link to="/collection/all" className="btn-luxury">{t('appointment.explore_collection')}</Link>
         </motion.div>
       </div>
     );
   }
 
   return (
@@ -265,21 +265,21 @@ export default function AppointmentPage() {
                     <div>
                       <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-1">{t('appointment.phone_label')}</p>
                       <p className="font-heading text-stone-800">{form.phone}</p>
                     </div>
                     <div>
                       <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-1">{t('appointment.service_label')}</p>
                       <p className="font-heading text-stone-800">{SERVICE_TYPES.find(s => s.value === form.service_type)?.label}</p>
                     </div>
                     <div>
                       <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-1">{t('appointment.date_label')}</p>
-                      <p className="font-heading text-stone-800">{form.date ? new Date(form.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''}</p>
+                      <p className="font-heading text-stone-800">{form.date ? new Date(form.date).toLocaleDateString(isRtl ? 'ar-AE' : 'en-AE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''}</p>
                     </div>
                     <div>
                       <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-1">{t('appointment.time_label')}</p>
                       <p className="font-heading text-stone-800">{form.time}</p>
                     </div>
                   </div>
                   {form.notes && (
                     <div className="mt-6 pt-6 border-t border-stone-200">
                       <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-1">{t('appointment.special_requests')}</p>
                       <p className="font-body text-stone-600 text-sm">{form.notes}</p>
