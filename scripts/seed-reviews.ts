import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const reviews = [
  {
    product_id: '17',
    name: 'Fatima Al Mazrouei',
    rating: 5,
    comment: 'The Fleur Éternelle gown made me feel like a princess on my wedding day. The hand-beaded embroidery and the sheer illusion sleeves were absolutely breathtaking. Every guest couldn\'t stop complimenting the detail work. Thank you Riman Atelier for making my dream a reality.',
    status: 'pending',
  },
  {
    product_id: '25',
    name: 'Nour Hassan',
    rating: 5,
    comment: 'I rented the Qamar Couture gown for my wedding and it was worth every dirham. The embroidered silk organza caught the light beautifully on the dance floor. The team was so professional — from the private viewing to the pickup and return. Highly recommend for any bride looking for something truly unique.',
    status: 'pending',
  },
  {
    product_id: '28',
    name: 'Sara Mohammed',
    rating: 5,
    comment: 'The Jamal Yakhtif gown is a true showstopper. The cloud-soft tulle and crystal work made me feel like a queen walking down the aisle. The atelier team was incredibly kind and made sure everything fit perfectly. This is the kind of experience you don\'t find anywhere else in Sharjah.',
    status: 'pending',
  },
  {
    product_id: '29',
    name: 'Aisha Khalid',
    rating: 5,
    comment: 'Perfect for a bride who wants understated elegance. The Sahar Whisper gown in soft tulle was exactly what I envisioned — delicate, flowing, and absolutely stunning. The rental process was seamless and the gown arrived in pristine condition. Thank you for making my day so special.',
    status: 'pending',
  },
  {
    product_id: '18',
    name: 'Layla Ahmed',
    rating: 5,
    comment: 'The Atelier Muse gown is modern royalty at its finest. The duchess satin and crystal-dusted straps were everything I hoped for. The structured corset bodice gave me the confidence I needed on my wedding day. Riman Atelier truly understands what a bride wants.',
    status: 'pending',
  },
  {
    product_id: '26',
    name: 'Mariam Ali',
    rating: 5,
    comment: 'Wafa means devotion and this gown lives up to the name. The pearl-beaded lace and A-line silhouette were elegant in every way. The hand-work on every motif was visible and beautiful. This is couture at its best — I felt like a true Riman bride.',
    status: 'pending',
  },
];

async function seed() {
  const inserted = [];
  for (const r of reviews) {
    const { data, error } = await supabase
      .from('reviews')
      .insert(r)
      .select();

    if (error) {
      console.error(`Error inserting review for product ${r.product_id}:`, error.message);
    } else {
      inserted.push(data);
      console.log(`Inserted review for product ${r.product_id}: ${r.name} (${r.rating} stars)`);
    }
  }
  console.log(`\nSeeded ${inserted.length} reviews out of ${reviews.length}`);
}

seed().catch(console.error);

