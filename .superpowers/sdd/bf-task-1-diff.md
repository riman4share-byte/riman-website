## Commits
f393d42 feat(appointments): interested_gowns jsonb column + GownRef type

## Stat
 src/services/appointments.ts                                      | 1 +
 src/types.ts                                                      | 8 ++++++++
 .../migrations/20260823100000_appointments_interested_gowns.sql   | 6 ++++++
 3 files changed, 15 insertions(+)

## Diff
diff --git a/src/services/appointments.ts b/src/services/appointments.ts
index 6ab9be1..7ea9d73 100644
--- a/src/services/appointments.ts
+++ b/src/services/appointments.ts
@@ -25,20 +25,21 @@ export async function createAppointment(appointment: Omit<Appointment, 'id' | 's
     const { data, error } = await supabase
       .from('appointments')
       .insert({
         name: appointment.name,
         email: appointment.email,
         phone: appointment.phone,
         date: appointment.date,
         time: appointment.time,
         service_type: appointment.service_type,
         notes: appointment.notes,
+        interested_gowns: appointment.interested_gowns ?? null,
         status: 'pending',
       })
       .select()
       .single();
 
     if (error) throw error;
     return data as Appointment;
   } catch (err: any) {
     // Fall back to local storage if Supabase is unreachable (e.g. paused project)
     if (err instanceof TypeError || (err.message && err.message.includes('Failed to fetch'))) {
diff --git a/src/types.ts b/src/types.ts
index e745470..156aa55 100644
--- a/src/types.ts
+++ b/src/types.ts
@@ -26,22 +26,30 @@ export interface Product {
 }
 
 export interface Testimonial {
   id: string;
   authorName: string;
   authorRole: string;
   content: string;
   rating: number;
 }
 
+export interface GownRef {
+  id: string;
+  name: string;
+  size?: string;
+  intent: 'sale' | 'rent';
+}
+
 export interface Appointment {
   id?: string;
   name: string;
   email: string;
   phone: string;
   date: string;
   time: string;
   service_type: string;
   notes?: string;
   status?: string;
   created_at?: string;
+  interested_gowns?: GownRef[] | null;
 }
\ No newline at end of file
diff --git a/supabase/migrations/20260823100000_appointments_interested_gowns.sql b/supabase/migrations/20260823100000_appointments_interested_gowns.sql
new file mode 100644
index 0000000..4f73b41
--- /dev/null
+++ b/supabase/migrations/20260823100000_appointments_interested_gowns.sql
@@ -0,0 +1,6 @@
+-- appointments.interested_gowns: gowns the client saved before requesting a viewing
+alter table public.appointments
+  add column if not exists interested_gowns jsonb;
+
+comment on column public.appointments.interested_gowns is
+  'Array of {id,name,size,intent} for gowns saved to the client''s selection';
