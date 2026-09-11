import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { products } from '../src/data/products';

const url = process.env.VITE_SUPABASE_URL || '';
const key = process.env.SYNC_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const adminEmail = process.env.SYNC_ADMIN_EMAIL || '';
const adminPassword = process.env.SYNC_ADMIN_PASSWORD || '';

if (!url || !key) {
  console.error('Missing VITE_SUPABASE_URL and key (SYNC_SERVICE_ROLE_KEY or VITE_SUPABASE_ANON_KEY)');
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

function toDb(p: (typeof products)[number], sortOrder: number) {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    product_type: p.productType,
    sale_price: p.salePrice,
    rental_price: p.rentalPrice,
    security_deposit: p.securityDeposit,
    images: p.images,
    video_url: p.videoUrl ?? null,
    category: p.category,
    style: p.style,
    color: p.color,
    fabric: p.fabric,
    designer: p.designer,
    sizes: p.sizes,
    is_new: p.isNew ?? false,
    is_featured: p.isFeatured ?? false,
    tags: p.tags ?? [],
    glb_url: p.glbUrl ?? null,
    collection_year: p.collectionYear ?? null,
    silhouette: p.silhouette ?? null,
    sort_order: sortOrder,
    updated_at: new Date().toISOString(),
  };
}

async function main() {
  if (adminEmail && adminPassword) {
    const { error: authErr } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });
    if (authErr) {
      console.error('Admin sign-in failed:', authErr.message);
      process.exit(1);
    }
    console.log(`Signed in as ${adminEmail}`);
  } else {
    console.warn('No SYNC_ADMIN_EMAIL / SYNC_ADMIN_PASSWORD set — writes will likely be blocked by RLS.');
  }

  const { data: existing, error: listErr } = await supabase
    .from('products')
    .select('id, name');
  if (listErr) {
    console.error('Failed to list products:', listErr.message);
    process.exit(1);
  }

  const existingIds = new Set((existing || []).map(r => String(r.id)));
  console.log(`DB has ${existingIds.size} products; local file has ${products.length}.`);

  let updated = 0;
  let inserted = 0;
  const failures: string[] = [];

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const row = toDb(p, i + 1);
    if (existingIds.has(p.id)) {
      const { data, error } = await supabase.from('products').update(row).eq('id', p.id).select('id');
      if (error) failures.push(`update ${p.id} (${p.name}): ${error.message}`);
      else if (!data || data.length === 0) failures.push(`update ${p.id} (${p.name}): 0 rows affected (RLS blocked?)`);
      else updated++;
    } else {
      const { error } = await supabase.from('products').insert({ ...row, is_active: true });
      if (error) failures.push(`insert ${p.id} (${p.name}): ${error.message}`);
      else inserted++;
    }
  }

  const localIds = new Set(products.map(p => p.id));
  const orphaned = (existing || []).filter(r => !localIds.has(String(r.id)));

  console.log(`Done. Updated: ${updated}, Inserted: ${inserted}, Failed: ${failures.length}`);
  failures.forEach(f => console.error('  FAIL:', f));
  if (orphaned.length) {
    console.log(`DB rows not in local file (left untouched):`);
    orphaned.forEach(r => console.log(`  ${r.id}: ${r.name}`));
  }
}

main();
