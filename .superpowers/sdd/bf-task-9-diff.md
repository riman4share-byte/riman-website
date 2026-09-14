## Commits
8b869a3 feat(admin): display requested gowns on appointment cards

## Stat
 src/pages/admin/AdminAppointments.tsx | 8 +++++++-
 1 file changed, 7 insertions(+), 1 deletion(-)

## Diff
diff --git a/src/pages/admin/AdminAppointments.tsx b/src/pages/admin/AdminAppointments.tsx
index b126cb6..1ae3bdd 100644
--- a/src/pages/admin/AdminAppointments.tsx
+++ b/src/pages/admin/AdminAppointments.tsx
@@ -1,12 +1,12 @@
 import { useState, useEffect } from 'react';
-import { Calendar, Clock, Mail, Phone, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
+import { Calendar, Clock, Mail, Phone, Heart, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
 import { motion, AnimatePresence } from 'motion/react';
 import { cn } from '../../lib/utils';
 import { fetchAppointments, updateAppointmentStatus } from '../../services/appointments';
 import { isSupabaseConfigured } from '../../services/supabase';
 import { Appointment } from '../../types';
 
 const SERVICE_LABELS: Record<string, string> = {
   bridal: 'Bridal Consultation',
   evening: 'Evening Wear Styling',
   rental: 'Rental Fitting',
@@ -105,20 +105,26 @@ export default function AdminAppointments() {
                       {appt.status || 'pending'}
                     </span>
                     <span className="text-[10px] tracking-widest uppercase text-gold font-bold">{SERVICE_LABELS[appt.service_type] || appt.service_type}</span>
                   </div>
                   <h3 className="font-heading text-stone-800 text-lg">{appt.name}</h3>
                   <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-stone-500">
                     <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {appt.date}</span>
                     <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {appt.time}</span>
                     <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {appt.email}</span>
                     <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {appt.phone}</span>
+                    {(appt.interested_gowns?.length ?? 0) > 0 && (
+                      <span className="flex items-start gap-1 basis-full">
+                        <Heart className="w-3 h-3 mt-0.5 shrink-0" />
+                        <span className="italic">{appt.interested_gowns!.map(g => `${g.name}${g.size ? ` (${g.size})` : ''}`).join(' ┬╖ ')}</span>
+                      </span>
+                    )}
                   </div>
                 </div>
                 <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                   <button onClick={() => handleStatusChange(appt.id!, 'confirmed')} className="p-2 text-emerald-500 hover:bg-emerald-50 transition-colors" aria-label="Confirm appointment" title="Confirm">
                     <CheckCircle2 className="w-4 h-4" />
                   </button>
                   <button onClick={() => handleStatusChange(appt.id!, 'cancelled')} className="p-2 text-red-400 hover:bg-red-50 transition-colors" aria-label="Cancel appointment" title="Cancel">
                     <XCircle className="w-4 h-4" />
                   </button>
                 </div>
