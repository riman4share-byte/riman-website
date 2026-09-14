### Task 1: Data foundation — `interested_gowns` column, type, service

**Files:**
- Create: `supabase/migrations/20260823100000_appointments_interested_gowns.sql`
- Modify: `src/types.ts` (Appointment interface, lines 36–47)
- Modify: `src/services/appointments.ts:19-45` (createAppointment insert)

**Interfaces:**
- Produces: `GownRef` type in `src/types.ts`: `{ id: string; name: string; size?: string; intent: 'sale' | 'rent' }`
- Produces: `Appointment.interested_gowns?: GownRef[] | null`
- Consumes (later tasks): `createAppointment` accepts and persists `interested_gowns`

- [ ] **Step 1: Write the migration**

```sql
-- appointments.interested_gowns: gowns the client saved before requesting a viewing
alter table public.appointments
  add column if not exists interested_gowns jsonb;

comment on column public.appointments.interested_gowns is
  'Array of {id,name,size,intent} for gowns saved to the client''s selection';
```

- [ ] **Step 2: Extend types**

In `src/types.ts`, above `export interface Appointment` add:

```ts
export interface GownRef {
  id: string;
  name: string;
  size?: string;
  intent: 'sale' | 'rent';
}
```

Inside `interface Appointment` add as the last field:

```ts
  interested_gowns?: GownRef[] | null;
```

- [ ] **Step 3: Persist the column**

In `src/services/appointments.ts` inside the Supabase insert object (line 27), after `notes: appointment.notes,` add:

```ts
        interested_gowns: appointment.interested_gowns ?? null,
```

Also in the local fallback function `createLocalAppointment`, ensure the created object spreads the input (it already persists the whole appointment object — verify, no change needed if so).

- [ ] **Step 4: Typecheck**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/20260823100000_appointments_interested_gowns.sql src/types.ts src/services/appointments.ts
git commit -m "feat(appointments): interested_gowns jsonb column + GownRef type"
```

---


