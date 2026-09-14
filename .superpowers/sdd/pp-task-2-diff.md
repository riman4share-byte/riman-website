## Commits
c8ecb22 feat(nav): remove Journal/blog dead-end surface and orphaned keys

## Stat
 src/App.tsx                      |   2 -
 src/components/Footer.tsx        |   1 -
 src/components/Header.tsx        |   2 -
 src/contexts/LanguageContext.tsx |  74 -------------------
 src/lib/seo.ts                   |   5 --
 src/pages/BlogPage.tsx           | 152 ---------------------------------------
 tests/click-verification.spec.js |   3 +-
 7 files changed, 1 insertion(+), 238 deletions(-)

## Diff
diff --git a/src/App.tsx b/src/App.tsx
index 378ae30..04ed032 100644
--- a/src/App.tsx
+++ b/src/App.tsx
@@ -14,21 +14,20 @@ import Layout from './components/Layout';
 
 // Pages - to be created
 import Home from './pages/Index';
 import CollectionPage from './pages/CollectionPage';
 import ProductDetail from './pages/ProductDetail';
 import AboutPage from './pages/AboutPage';
 import ContactPage from './pages/ContactPage';
 import SearchPage from './pages/SearchPage';
 import WishlistPage from './pages/WishlistPage';
 import ProfilePage from './pages/ProfilePage';
-import BlogPage from './pages/BlogPage';
 import FaqPage from './pages/FaqPage';
 import AlterationsPage from './pages/AlterationsPage';
 import PrivacyPage from './pages/PrivacyPage';
 import TermsPage from './pages/TermsPage';
 import Auth from './pages/Auth';
 import Checkout from './pages/Checkout';
 import PaymentSuccess from './pages/PaymentSuccess';
 import PaymentCancel from './pages/PaymentCancel';
 import StyleQuiz from './pages/StyleQuiz';
 import AppointmentPage from './pages/AppointmentPage';
@@ -196,21 +195,20 @@ function AnimatedRoutes() {
       <Routes location={location}>
         <Route path="/" element={<Layout />}>
           <Route index element={<PageWrapper><Home /></PageWrapper>} />
           <Route path="collection/:category" element={<PageWrapper><CollectionPage /></PageWrapper>} />
           <Route path="product/:id" element={<PageWrapper><ProductDetail /></PageWrapper>} />
           <Route path="about" element={<PageWrapper><AboutPage /></PageWrapper>} />
           <Route path="contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
           <Route path="search" element={<PageWrapper><SearchPage /></PageWrapper>} />
           <Route path="wishlist" element={<PageWrapper><WishlistPage /></PageWrapper>} />
           <Route path="profile" element={<PageWrapper><ProfilePage /></PageWrapper>} />
-          <Route path="blog" element={<PageWrapper><BlogPage /></PageWrapper>} />
           <Route path="faq" element={<PageWrapper><FaqPage /></PageWrapper>} />
           <Route path="alterations" element={<PageWrapper><AlterationsPage /></PageWrapper>} />
           <Route path="privacy" element={<PageWrapper><PrivacyPage /></PageWrapper>} />
           <Route path="terms" element={<PageWrapper><TermsPage /></PageWrapper>} />
           <Route path="auth" element={<PageWrapper><Auth /></PageWrapper>} />
           <Route path="checkout" element={<PageWrapper><Checkout /></PageWrapper>} />
           <Route path="payment/success" element={<PageWrapper><PaymentSuccess /></PageWrapper>} />
           <Route path="payment/cancel" element={<PageWrapper><PaymentCancel /></PageWrapper>} />
           <Route path="style-quiz" element={<PageWrapper><StyleQuiz /></PageWrapper>} />
           <Route path="appointment" element={<PageWrapper><AppointmentPage /></PageWrapper>} />
diff --git a/src/components/Footer.tsx b/src/components/Footer.tsx
index 6bbab97..0896a56 100644
--- a/src/components/Footer.tsx
+++ b/src/components/Footer.tsx
@@ -117,21 +117,20 @@ export default function Footer() {
             </div>
           </div>
 
           {/* Collections */}
           <div className="md:col-span-2">
             <CollapsibleSection title={t('footer.collections')} defaultOpen={false}>
               <ul className="space-y-3 pb-6 md:pb-0 md:mt-6 flex flex-col items-center md:items-start">
                 <FooterLink to="/collection/bridal">{t('nav.bridal')}</FooterLink>
                 <FooterLink to="/collection/evening">{t('nav.evening')}</FooterLink>
                 <FooterLink to="/collection/rental">{t('nav.rentals')}</FooterLink>
-                <FooterLink to="/blog">{t('nav.blog')}</FooterLink>
                 <FooterLink to="/gallery">{t('nav.gallery')}</FooterLink>
               </ul>
             </CollapsibleSection>
           </div>
 
           {/* Services */}
           <div className="md:col-span-2">
             <CollapsibleSection title={t('footer.services')} defaultOpen={false}>
               <ul className="space-y-3 pb-6 md:pb-0 md:mt-6 flex flex-col items-center md:items-start">
                 <FooterLink to="/alterations">{t('footer.bespoke_fitting')}</FooterLink>
diff --git a/src/components/Header.tsx b/src/components/Header.tsx
index 8c8a81b..c970020 100644
--- a/src/components/Header.tsx
+++ b/src/components/Header.tsx
@@ -7,21 +7,20 @@ import { useLanguage } from '../contexts/LanguageContext';
 import { useCart } from '../contexts/CartContext';
 import { useWishlist } from '../contexts/WishlistContext';
 import { useScrollLock } from '../hooks/useScrollLock';
 import Logo from './Logo';
 
 const navLinks = [
   { label: "Our Story", path: "/about", key: 'nav.about' },
   { label: "Bridal", path: "/collection/bridal", key: 'nav.bridal' },
   { label: "Evening", path: "/collection/evening", key: 'nav.evening' },
   { label: "Rentals", path: "/collection/rental", key: 'nav.rentals' },
-  { label: "Journal", path: "/blog", key: 'nav.blog' },
   { label: "Contact", path: "/contact", key: 'nav.contact' },
   { label: "Private Viewing", path: "/appointment", key: 'nav.private_viewing' },
 ];
 
 export default function Header() {
   const { language, setLanguage, t, isRtl } = useLanguage();
   const { totalItems } = useCart();
   const { wishlist } = useWishlist();
   const wishlistCount = wishlist.length;
   const [isMenuOpen, setIsMenuOpen] = useState(false);
@@ -248,21 +247,20 @@ export default function Header() {
                     ))}
                   </nav>
                 </div>
 
                 {/* Atelier Links */}
                 <div className="mb-5">
                   <p className="text-[10px] tracking-[0.2em] uppercase text-gold font-bold mb-3">{t('header.atelier')}</p>
                   <nav className="flex flex-col gap-1">
                     {[
                       { label: 'Our Story', path: '/about', key: 'nav.about' },
-                      { label: 'Blog', path: '/blog', key: 'nav.blog' },
                       { label: 'Gallery', path: '/gallery', key: 'nav.gallery' },
                       { label: 'Style Quiz', path: '/style-quiz', key: 'nav.style_quiz', icon: Sparkles },
                     ].map((link, idx) => (
                       <motion.div
                         key={link.path}
                         initial={{ opacity: 0, x: isRtl ? 10 : -10 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ delay: 0.2 + idx * 0.03 }}
                       >
                         <Link
diff --git a/src/contexts/LanguageContext.tsx b/src/contexts/LanguageContext.tsx
index 8e7c120..9e648c3 100644
--- a/src/contexts/LanguageContext.tsx
+++ b/src/contexts/LanguageContext.tsx
@@ -18,21 +18,20 @@ const translations: Record<Language, Record<string, string>> = {
     'nav.home': 'Home',
     'nav.bridal': 'Bridal',
     'nav.evening': 'Evening',
     'nav.rentals': 'Rentals',
     'nav.about': 'Our Story',
     'nav.contact': 'Contact',
     'nav.timeline': 'Timeline',
     'nav.style_quiz': 'Style Quiz',
     'nav.jewelry': 'Fine Jewelry',
     'nav.accessories': 'Accessories',
-    'nav.blog': 'Journal',
     'nav.gallery': 'Gallery',
     'nav.alterations': 'Alterations',
     'nav.faq': 'FAQ',
     'nav.appointment': 'Book Now',
 
     // Categories
     'cat.bridal': 'Bridal',
     'cat.evening': 'Evening',
     'cat.rentals': 'Rentals',
     'cat.jewelry': 'Fine Jewelry',
@@ -41,32 +40,20 @@ const translations: Record<Language, Record<string, string>> = {
     'cat.service': 'Premium Service',
     'cat.majestic': 'Majestic Selection',
     'cat.all': 'All Designs',
     'cat.bridal_title': 'Bridal Collection',
     'cat.evening_title': 'Evening Gowns',
     'cat.rental_title': 'Premium Rentals',
     'cat.jewelry_title': 'Majestic Jewelry',
     'cat.accessories_title': 'Accessories',
     'cat.subtitle': 'Exquisite silhouettes and premium fabrics selected for the modern visionary.',
 
-    // Journal / Atelier
-    'journal.title': 'The Riman Journal',
-    'journal.finding': 'Finding Your Silhouette',
-    'journal.guide': 'Royal Geometry & Proportion Guide',
-    'journal.btn': 'Read The Full Guide',
-    'journal.heading': 'Mastering The Legacy Icon',
-    'journal.quote': 'Exquisitely crafted for the modern muse. Each piece is a woven story of elegance and royal substance.',
-    'journal.fabric_title': 'The Fabric of Dreams',
-    'journal.fabric_desc': 'Understanding the drape of Mikado Silk versus the airy lightness of French Tulle.',
-    'journal.artisan_title': 'Artisan Details',
-    'journal.artisan_desc': 'How hand-sewn Swarovski elements catch the light for a radiant glow.',
-
     // Hero
     'hero.title': 'Reverie & Essence',
     'hero.subtitle': "Sharjah's Premier Couture Atelier",
     'hero.discover': 'Discover',
 
     // Salon chapters
     'chapter.atelier': "L'Atelier",
     'chapter.silhouettes': 'Les Silhouettes',
     'chapter.savoir_faire': 'Le Savoir-Faire',
     'invitation.line': 'Continue the conversation ΓÇö request a private viewing.',
@@ -591,41 +578,20 @@ const translations: Record<Language, Record<string, string>> = {
     'quiz.retry': 'Re-Experience',
     'quiz.try_again': 'Try Again',
     'quiz.progress': 'Question',
     'quiz.your_matches': 'Your Perfect Matches',
     'quiz.no_matches': 'Let Us Help You Find The One',
     'quiz.based_on_answers': 'Based on your answers, we think you will love these designs.',
     'quiz.browse_collection': 'Browse our curated collection to find your perfect piece.',
     'quiz.try_different': 'Try different options to discover more styles.',
     'quiz.view_all': 'View Full Collection',
 
-    // Blog
-    'blog.title': 'The Riman Journal',
-    'blog.subtitle': 'Style & Substance',
-    'blog.latest': 'Latest Release',
-    'blog.min_read': 'min read',
-    'blog.read_editorial': 'Read Editorial',
-    'blog.view_journal': 'View Journal',
-    'blog.join_circle': 'Join the Circle',
-    'blog.newsletter_desc': 'Receive exclusive invitations to atelier reveals and seasonal style insights.',
-    'blog.email_placeholder': 'EMAIL ADDRESS',
-    'blog.subscribe': 'Subscribe',
-    'blog.article1_title': 'The Rise of Minimalist Sharjah Couture',
-    'blog.article1_excerpt': 'Exploring the shift towards clean lines and architectural silhouettes in the 2026 bridal season.',
-    'blog.article1_category': 'Trends',
-    'blog.article2_title': 'Gala Ready: The Rental Revolution',
-    'blog.article2_excerpt': 'How premium rental collections are changing the high-fashion landscape for evening wear.',
-    'blog.article2_category': 'Insights',
-    'blog.article3_title': 'Crafting the Noor Kaftan',
-    'blog.article3_excerpt': 'A behind-the-scenes look at the 400 hours of hand-embroidery required for our latest masterpiece.',
-    'blog.article3_category': 'Craftsmanship',
-
     // FAQ
     'faq.category_rental': 'Rental Services',
     'faq.q_rental_1': 'How long is the standard rental period?',
     'faq.a_rental_1': "Our standard 'Premier Hire' period is 7 days. Extensions can be arranged for an additional fee, subject to availability. We recommend booking at least 4 weeks in advance for your desired dates.",
     'faq.q_rental_2': 'Is dry cleaning included in the rental price?',
     'faq.a_rental_2': 'Yes, every Riman rental includes professional eco-friendly dry cleaning both before and after your event. We handle all garment care so you can focus on your celebration.',
     'faq.q_rental_3': 'What happens if I accidentally damage a rental?',
     'faq.a_rental_3': "All rentals include basic 'Couture Insurance' covering minor mishaps. For significant damage, a deduction from your security deposit may apply. We'll always discuss this transparently with you.",
     'faq.category_bespoke': 'Bespoke & Alterations',
     'faq.q_bespoke_1': 'Do I need an appointment for a fitting?',
@@ -735,38 +701,34 @@ const translations: Record<Language, Record<string, string>> = {
     'gallery.load_more': 'Load More',
     'gallery.view_full': 'View Full Gallery',
     'gallery.back': 'Back to Gallery',
     'gallery.no_items': 'No items found in this category',
     'gallery.admin_title': 'Gallery Management',
     'gallery.admin_upload': 'Upload Media',
     'gallery.admin_edit': 'Edit Item',
     'gallery.admin_delete': 'Delete Item',
     'gallery.admin_featured': 'Featured',
     'gallery.admin_sort': 'Sort Order',
-
-    // Misc
-    'section.journal': 'The Riman Journal',
   },
 
   ar: {
     // Navigation
     'nav.home': '╪º┘ä╪▒╪ª┘è╪│┘è╪⌐',
     'nav.bridal': '┘ü╪│╪º╪¬┘è┘å ╪º┘ä╪▓┘ü╪º┘ü',
     'nav.evening': '┘ü╪│╪º╪¬┘è┘å ╪º┘ä╪│┘ç╪▒╪⌐',
     'nav.rentals': '╪º┘ä╪Ñ┘è╪¼╪º╪▒',
     'nav.about': '┘é╪╡╪¬┘å╪º',
     'nav.contact': '╪¬┘ê╪º╪╡┘ä ┘à╪╣┘å╪º',
     'nav.timeline': '╪º┘ä╪¼╪»┘ê┘ä ╪º┘ä╪▓┘à┘å┘è',
     'nav.style_quiz': '╪º╪«╪¬╪¿╪º╪▒ ╪º┘ä╪ú┘å╪º┘é╪⌐',
     'nav.jewelry': '╪º┘ä┘à╪¼┘ê┘ç╪▒╪º╪¬ ╪º┘ä╪▒╪º┘é┘è╪⌐',
     'nav.accessories': '╪º┘ä╪Ñ┘â╪│╪│┘ê╪º╪▒╪º╪¬',
-    'nav.blog': '╪º┘ä┘à╪¼┘ä╪⌐',
     'nav.gallery': '╪º┘ä┘à╪╣╪▒╪╢',
     'nav.alterations': '╪º┘ä╪¬╪╣╪»┘è┘ä╪º╪¬',
     'nav.faq': '╪º┘ä╪ú╪│╪ª┘ä╪⌐ ╪º┘ä╪┤╪º╪ª╪╣╪⌐',
     'nav.appointment': '╪º╪¡╪¼╪▓ ╪º┘ä╪ó┘å',
 
     // Categories
     'cat.bridal': '╪º┘ä╪╣╪▒╪º╪ª╪│',
     'cat.evening': '╪º┘ä╪│┘ç╪▒╪⌐',
     'cat.rentals': '╪º┘ä╪Ñ┘è╪¼╪º╪▒',
     'cat.jewelry': '╪º┘ä┘à╪¼┘ê┘ç╪▒╪º╪¬ ╪º┘ä╪▒╪º┘é┘è╪⌐',
@@ -775,32 +737,20 @@ const translations: Record<Language, Record<string, string>> = {
     'cat.service': '╪«╪»┘à╪⌐ ┘à┘à┘è╪▓╪⌐',
     'cat.majestic': '╪¬╪┤┘â┘è┘ä╪⌐ ┘à┘ç┘è╪¿╪⌐',
     'cat.all': '╪¼┘à┘è╪╣ ╪º┘ä╪¬╪╡╪º┘à┘è┘à',
     'cat.bridal_title': '┘à╪¼┘à┘ê╪╣╪⌐ ╪º┘ä╪╣╪▒╪º╪ª╪│',
     'cat.evening_title': '┘ü╪│╪º╪¬┘è┘å ╪º┘ä╪│┘ç╪▒╪⌐',
     'cat.rental_title': '╪º┘ä╪Ñ┘è╪¼╪º╪▒ ╪º┘ä┘à╪¬┘à┘è╪▓',
     'cat.jewelry_title': '╪º┘ä┘à╪¼┘ê┘ç╪▒╪º╪¬ ╪º┘ä┘à┘ç┘è╪¿╪⌐',
     'cat.accessories_title': '╪º┘ä╪Ñ┘â╪│╪│┘ê╪º╪▒╪º╪¬',
     'cat.subtitle': '╪¬╪╡╪º┘à┘è┘à ╪▒╪º┘é┘è╪⌐ ┘ê╪ú┘é┘à╪┤╪⌐ ┘ü╪º╪«╪▒╪⌐ ┘à╪«╪¬╪º╪▒╪⌐ ╪¿╪╣┘å╪º┘è╪⌐ ┘ä┘ä┘à╪▒╪ú╪⌐ ╪º┘ä╪╣╪╡╪▒┘è╪⌐ ╪º┘ä┘ê╪º╪╣┘è╪⌐.',
 
-    // Journal / Atelier
-    'journal.title': '┘à╪¼┘ä╪⌐ ╪▒┘è┘à╪º┘å',
-    'journal.finding': '╪º┘â╪¬╪┤╪º┘ü ╪╖┘ä╪¬┘â ╪º┘ä┘à╪½╪º┘ä┘è╪⌐',
-    'journal.guide': '╪»┘ä┘è┘ä ╪º┘ä┘ç┘å╪»╪│╪⌐ ╪º┘ä┘à┘ä┘â┘è╪⌐ ┘ê╪º┘ä╪¬┘å╪º╪│╪¿',
-    'journal.btn': '╪º┘é╪▒╪ú ╪º┘ä╪»┘ä┘è┘ä ╪º┘ä┘â╪º┘à┘ä',
-    'journal.heading': '╪Ñ╪¬┘é╪º┘å ╪ú┘è┘é┘ê┘å╪⌐ ╪º┘ä╪Ñ╪▒╪½',
-    'journal.quote': '┘à╪╡┘å┘ê╪╣╪⌐ ╪¿╪Ñ╪¬┘é╪º┘å ┘ä┘ä┘à┘ä┘ç┘à╪⌐ ╪º┘ä╪╣╪╡╪▒┘è╪⌐. ┘â┘ä ┘é╪╖╪╣╪⌐ ┘ç┘è ┘é╪╡╪⌐ ┘à┘å╪│┘ê╪¼╪⌐ ┘à┘å ╪º┘ä╪ú┘å╪º┘é╪⌐ ┘ê╪º┘ä╪¼┘ê┘ç╪▒ ╪º┘ä┘à┘ä┘â┘è.',
-    'journal.fabric_title': '┘å╪│┘è╪¼ ╪º┘ä╪ú╪¡┘ä╪º┘à',
-    'journal.fabric_desc': '┘ü┘ç┘à ╪¬╪»┘ü┘é ╪¡╪▒┘è╪▒ ╪º┘ä┘à┘è┘â╪º╪»┘ê ┘à┘é╪º╪¿┘ä ╪«┘ü╪⌐ ╪º┘ä╪¬┘ê┘ä ╪º┘ä┘ü╪▒┘å╪│┘è.',
-    'journal.artisan_title': '╪¬┘ü╪º╪╡┘è┘ä ╪º┘ä╪¡╪▒┘ü┘è╪⌐',
-    'journal.artisan_desc': '┘â┘è┘ü ╪¬┘ä╪¬┘é╪╖ ╪╣┘å╪º╪╡╪▒ ╪º┘ä╪│┘ê╪º╪▒┘ê┘ü╪│┘â┘è ╪º┘ä┘à╪«┘è╪╖╪⌐ ┘è╪»┘ê┘è╪º┘ï ╪º┘ä╪╢┘ê╪í ┘ä╪¬┘ê┘ç╪¼ ┘à╪┤╪▒┘é.',
-
     // Hero
     'hero.title': '╪¡┘ä┘à┘î ┘ê╪¼┘ê┘ç╪▒',
     'hero.subtitle': '╪»╪º╪▒ ╪º┘ä╪ú╪▓┘è╪º╪í ╪º┘ä╪▒╪º╪ª╪»╪⌐ ┘ü┘è ╪º┘ä╪┤╪º╪▒┘é╪⌐',
     'hero.discover': '╪º┘â╪¬╪┤┘ü',
 
     // Salon chapters
     'chapter.atelier': '╪º┘ä╪ú╪¬┘è┘ä┘è┘ç',
     'chapter.silhouettes': '╪º┘ä┘é╪╡╪º╪¬',
     'chapter.savoir_faire': '╪º┘ä╪¡╪▒┘ü┘è╪⌐',
     'invitation.line': '╪ú┘â┘à┘É┘ä ╪º┘ä╪¡┘ê╪º╪▒ ΓÇö ╪º╪╖┘ä╪¿ ╪▓┘è╪º╪▒╪⌐ ╪«╪º╪╡╪⌐.',
@@ -1325,41 +1275,20 @@ const translations: Record<Language, Record<string, string>> = {
     'quiz.retry': '╪Ñ╪╣╪º╪»╪⌐ ╪º┘ä╪¬╪¼╪▒╪¿╪⌐',
     'quiz.try_again': '╪¡╪º┘ê┘ä ┘à╪▒╪⌐ ╪ú╪«╪▒┘ë',
     'quiz.progress': '╪│╪ñ╪º┘ä',
     'quiz.your_matches': '┘à╪╖╪º╪¿┘é╪º╪¬┘â ╪º┘ä┘à╪½╪º┘ä┘è╪⌐',
     'quiz.no_matches': '╪»╪╣┘å╪º ┘å╪│╪º╪╣╪»┘â ┘ü┘è ╪Ñ┘è╪¼╪º╪» ╪º┘ä┘é╪╖╪╣╪⌐',
     'quiz.based_on_answers': '╪¿┘å╪º╪í┘ï ╪╣┘ä┘ë ╪Ñ╪¼╪º╪¿╪º╪¬┘â╪î ┘å╪╣╪¬┘é╪» ╪ú┘å┘â ╪│╪¬╪¡╪¿ ┘ç╪░┘ç ╪º┘ä╪¬╪╡╪º┘à┘è┘à.',
     'quiz.browse_collection': '╪¬╪╡┘ü╪¡ ┘à╪¼┘à┘ê╪╣╪¬┘å╪º ╪º┘ä┘à╪«╪¬╪º╪▒╪⌐ ┘ä╪Ñ┘è╪¼╪º╪» ┘é╪╖╪╣╪¬┘â ╪º┘ä┘à╪½╪º┘ä┘è╪⌐.',
     'quiz.try_different': '╪¼╪▒┘æ╪¿ ╪«┘è╪º╪▒╪º╪¬ ┘à╪«╪¬┘ä┘ü╪⌐ ┘ä╪º┘â╪¬╪┤╪º┘ü ╪º┘ä┘à╪▓┘è╪» ┘à┘å ╪º┘ä╪ú┘å┘à╪º╪╖.',
     'quiz.view_all': '╪╣╪▒╪╢ ╪º┘ä┘à╪¼┘à┘ê╪╣╪⌐ ╪º┘ä┘â╪º┘à┘ä╪⌐',
 
-    // Blog
-    'blog.title': '┘à╪¼┘ä╪⌐ ╪▒┘è┘à╪º┘å',
-    'blog.subtitle': '╪º┘ä╪ú┘å╪º┘é╪⌐ ┘ê╪º┘ä┘à╪¡╪¬┘ê┘ë',
-    'blog.latest': '╪ú╪¡╪»╪½ ╪Ñ╪╡╪»╪º╪▒',
-    'blog.min_read': '╪»┘é╪º╪ª┘é ┘é╪▒╪º╪í╪⌐',
-    'blog.read_editorial': '╪º┘é╪▒╪ú ╪º┘ä┘à┘é╪º┘ä',
-    'blog.view_journal': '╪╣╪▒╪╢ ╪º┘ä┘à╪¼┘ä╪⌐',
-    'blog.join_circle': '╪º┘å╪╢┘à ┘ä┘ä╪»╪º╪ª╪▒╪⌐',
-    'blog.newsletter_desc': '╪¬┘ä┘é┘ë ╪»╪╣┘ê╪º╪¬ ╪¡╪╡╪▒┘è╪⌐ ┘ä┘â╪┤┘ü ╪º┘ä┘à╪¼┘à┘ê╪╣╪º╪¬ ┘ê╪ú┘ü┘â╪º╪▒ ╪º┘ä┘à┘ê╪╢╪⌐ ╪º┘ä┘à┘ê╪│┘à┘è╪⌐.',
-    'blog.email_placeholder': '╪º┘ä╪¿╪▒┘è╪» ╪º┘ä╪Ñ┘ä┘â╪¬╪▒┘ê┘å┘è',
-    'blog.subscribe': '╪º╪┤╪¬╪▒┘â',
-    'blog.article1_title': '╪╡╪╣┘ê╪» ╪ú╪▓┘è╪º╪í ╪º┘ä╪┤╪º╪▒┘é╪⌐ ╪º┘ä╪¿╪│┘è╪╖╪⌐',
-    'blog.article1_excerpt': '╪º╪│╪¬┘â╪┤╪º┘ü ╪º┘ä╪¬╪¡┘ê┘ä ┘å╪¡┘ê ╪º┘ä╪«╪╖┘ê╪╖ ╪º┘ä┘å╪╕┘è┘ü╪⌐ ┘ê╪º┘ä┘é╪╡╪º╪¬ ╪º┘ä┘à╪╣┘à╪º╪▒┘è╪⌐ ┘ü┘è ┘à┘ê╪│┘à ╪╣╪▒╪º╪ª╪│ ┘ó┘á┘ó┘ª.',
-    'blog.article1_category': '╪º╪¬╪¼╪º┘ç╪º╪¬',
-    'blog.article2_title': '╪¼╪º┘ç╪▓╪⌐ ┘ä┘ä╪¡┘ü┘ä: ╪½┘ê╪▒╪⌐ ╪º┘ä╪Ñ┘è╪¼╪º╪▒',
-    'blog.article2_excerpt': '┘â┘è┘ü ╪¬╪║┘è╪▒ ┘à╪¼┘à┘ê╪╣╪º╪¬ ╪º┘ä╪Ñ┘è╪¼╪º╪▒ ╪º┘ä┘ü╪º╪«╪▒╪⌐ ┘à╪┤┘ç╪» ╪º┘ä╪ú╪▓┘è╪º╪í ╪º┘ä╪▒╪º┘é┘è╪⌐ ┘ä┘ä╪│┘ç╪▒╪⌐.',
-    'blog.article2_category': '╪▒╪ñ┘ë',
-    'blog.article3_title': '╪╡┘å╪º╪╣╪⌐ ┘â┘ü╪¬╪º┘å ┘å┘ê╪▒',
-    'blog.article3_excerpt': '┘å╪╕╪▒╪⌐ ╪«┘ä┘ü ╪º┘ä┘â┘ê╪º┘ä┘è╪│ ╪╣┘ä┘ë ┘ñ┘á┘á ╪│╪º╪╣╪⌐ ┘à┘å ╪º┘ä╪¬╪╖╪▒┘è╪▓ ╪º┘ä┘è╪»┘ê┘è ╪º┘ä┘à╪╖┘ä┘ê╪¿╪⌐ ┘ä latest ╪¬╪¡┘ü╪¬┘å╪º.',
-    'blog.article3_category': '╪º┘ä╪¡╪▒┘ü┘è╪⌐',
-
     // FAQ
     'faq.category_rental': '╪«╪»┘à╪º╪¬ ╪º┘ä╪Ñ┘è╪¼╪º╪▒',
     'faq.q_rental_1': '┘à╪º ┘à╪»╪⌐ ╪º┘ä╪Ñ┘è╪¼╪º╪▒ ╪º┘ä┘à╪╣┘è╪º╪▒┘è╪⌐╪ƒ',
     'faq.a_rental_1': '┘ü╪¬╪▒╪⌐ ╪º┘ä╪Ñ┘è╪¼╪º╪▒ ╪º┘ä┘à╪╣┘è╪º╪▒┘è╪⌐ "╪º┘ä╪¬┘ê╪╕┘è┘ü ╪º┘ä┘à╪¬┘à┘è╪▓" ┘ç┘è 7 ╪ú┘è╪º┘à. ┘è┘à┘â┘å ╪¬╪▒╪¬┘è╪¿ ╪º┘ä╪º┘à╪¬╪»╪º╪»╪º╪¬ ┘à┘é╪º╪¿┘ä ╪▒╪│┘ê┘à ╪Ñ╪╢╪º┘ü┘è╪⌐╪î ╪¡╪│╪¿ ╪º┘ä╪¬┘ê┘ü╪▒. ┘å┘ê╪╡┘è ╪¿╪º┘ä╪¡╪¼╪▓ ┘é╪¿┘ä 4 ╪ú╪│╪º╪¿┘è╪╣ ╪╣┘ä┘ë ╪º┘ä╪ú┘é┘ä.',
     'faq.q_rental_2': '┘ç┘ä ╪º┘ä╪¬╪╕┘è┘ü ╪º┘ä╪¼╪º┘ü ┘à╪┤┘à┘ê┘ä ┘ü┘è ╪│╪╣╪▒ ╪º┘ä╪Ñ┘è╪¼╪º╪▒╪ƒ',
     'faq.a_rental_2': '┘å╪╣┘à╪î ┘â┘ä ╪Ñ┘è╪¼╪º╪▒ ╪▒┘è┘à╪º┘å ┘è╪┤┘à┘ä ╪¬╪╕┘è┘ü╪º┘ï ╪¼╪º┘ü╪º┘ï ┘à┘ç┘å┘è╪º┘ï ╪╡╪»┘è┘é╪º┘ï ┘ä┘ä╪¿┘è╪ª╪⌐ ┘é╪¿┘ä ┘ê╪¿╪╣╪» ╪¡╪»╪½┘â.',
     'faq.q_rental_3': '┘à╪º╪░╪º ┘è╪¡╪»╪½ ╪Ñ╪░╪º ╪¬┘ä┘ü╪¬ ┘é╪╖╪╣╪⌐ ╪º┘ä╪Ñ┘è╪¼╪º╪▒ ╪¿╪º┘ä╪«╪╖╪ú╪ƒ',
     'faq.a_rental_3': '╪¼┘à┘è╪╣ ╪º┘ä╪Ñ┘è╪¼╪º╪▒╪º╪¬ ╪¬╪┤┘à┘ä "╪¬╪ú┘à┘è┘å ╪º┘ä┘â┘ê╪¬┘ê╪▒" ╪º┘ä╪ú╪│╪º╪│┘è ╪º┘ä╪░┘è ┘è╪║╪╖┘è ╪º┘ä╪¡┘ê╪º╪»╪½ ╪º┘ä╪¿╪│┘è╪╖╪⌐.',
     'faq.category_bespoke': '╪º┘ä╪«┘è╪º╪╖╪⌐ ╪º┘ä┘à╪«╪╡╪╡╪⌐ ┘ê╪º┘ä╪¬╪╣╪»┘è┘ä╪º╪¬',
     'faq.q_bespoke_1': '┘ç┘ä ╪ú╪¡╪¬╪º╪¼ ╪Ñ┘ä┘ë ┘à┘ê╪╣╪» ┘ä┘ä┘é┘è╪º╪│╪ƒ',
@@ -1469,23 +1398,20 @@ const translations: Record<Language, Record<string, string>> = {
     'gallery.load_more': '╪º┘ä┘à╪▓┘è╪»',
     'gallery.view_full': '╪╣╪▒╪╢ ╪º┘ä┘à╪╣╪▒╪╢ ┘â╪º┘à┘ä╪º┘ï',
     'gallery.back': '╪º┘ä╪╣┘ê╪»╪⌐ ┘ä┘ä┘à╪╣╪▒╪╢',
     'gallery.no_items': '┘ä╪º ╪¬┘ê╪¼╪» ╪╣┘å╪º╪╡╪▒ ┘ü┘è ┘ç╪░┘ç ╪º┘ä┘ü╪ª╪⌐',
     'gallery.admin_title': '╪Ñ╪»╪º╪▒╪⌐ ╪º┘ä┘à╪╣╪▒╪╢',
     'gallery.admin_upload': '╪▒┘ü╪╣ ┘ê╪│╪º╪ª╪╖',
     'gallery.admin_edit': '╪¬╪╣╪»┘è┘ä ╪º┘ä╪╣┘å╪╡╪▒',
     'gallery.admin_delete': '╪¡╪░┘ü ╪º┘ä╪╣┘å╪╡╪▒',
     'gallery.admin_featured': '┘à┘à┘è╪▓',
     'gallery.admin_sort': '╪¬╪▒╪¬┘è╪¿ ╪º┘ä╪╣╪▒╪╢',
-
-    // Misc
-    'section.journal': '┘à╪¼┘ä╪⌐ ╪▒┘è┘à╪º┘å',
   }
 };
 
 export function LanguageProvider({ children }: { children: ReactNode }) {
   const [language, setLanguage] = useState<Language>(() => {
     return (localStorage.getItem('riman_lang') as Language) || 'ar';
   });
 
   useEffect(() => {
     localStorage.setItem('riman_lang', language);
diff --git a/src/lib/seo.ts b/src/lib/seo.ts
index a72f162..2a693f2 100644
--- a/src/lib/seo.ts
+++ b/src/lib/seo.ts
@@ -43,25 +43,20 @@ export const ROUTE_META: Record<string, RouteMeta> = {
     ogType: 'website',
   },
   '/about': {
     title: 'Our Story | Atelier Riman',
     description: 'Discover the heritage of Atelier Riman ΓÇö Sharjah\'s premier bridal and evening couture house. Where tradition meets contemporary luxury.',
   },
   '/contact': {
     title: 'Contact | Atelier Riman',
     description: 'Visit our Sharjah atelier for a private consultation. Book an appointment to explore our bridal and evening collections with our master stylists.',
   },
-  '/blog': {
-    title: 'Journal | Atelier Riman',
-    description: 'Explore the Atelier Riman journal ΓÇö bridal style guides, fashion insights, and the stories behind our collections.',
-    ogType: 'article',
-  },
   '/faq': {
     title: 'FAQ | Atelier Riman',
     description: 'Find answers to common questions about Atelier Riman\'s bridal and evening wear, including sizing, rentals, alterations, and ordering.',
   },
   '/alterations': {
     title: 'Bespoke Alterations | Atelier Riman',
     description: 'Expert bespoke tailoring and alterations at our Sharjah atelier. From hem adjustments to complete gown restructuring by our master seamstresses.',
   },
   '/gallery': {
     title: 'Gallery | Atelier Riman',
diff --git a/src/pages/BlogPage.tsx b/src/pages/BlogPage.tsx
deleted file mode 100644
index 6803391..0000000
--- a/src/pages/BlogPage.tsx
+++ /dev/null
@@ -1,152 +0,0 @@
-import { motion } from 'motion/react';
-import { ArrowRight, Clock, User, Tag } from 'lucide-react';
-import { useLanguage } from '../contexts/LanguageContext';
-
-export default function BlogPage() {
-  const { t } = useLanguage();
-
-  const articles = [
-    {
-      id: 1,
-      title: t('blog.article1_title'),
-      excerpt: t('blog.article1_excerpt'),
-      image: "/images/journal-featured.jpg",
-      date: "April 15, 2026",
-      author: "Fatma Al-Zahra",
-      category: t('blog.article1_category')
-    },
-    {
-      id: 2,
-      title: t('blog.article2_title'),
-      excerpt: t('blog.article2_excerpt'),
-      image: "/images/journal-rental.jpg",
-      date: "March 28, 2026",
-      author: "Sarah Mansour",
-      category: t('blog.article2_category')
-    },
-    {
-      id: 3,
-      title: t('blog.article3_title'),
-      excerpt: t('blog.article3_excerpt'),
-      image: "/images/journal-craft.jpg",
-      date: "March 10, 2026",
-      author: "Atelier Team",
-      category: t('blog.article3_category')
-    }
-  ];
-  return (
-    <div className="pt-24 bg-ivory min-h-screen">
-      {/* Editorial Header */}
-      <header className="py-24 border-b border-stone-200 bg-ivory">
-        <div className="container mx-auto px-6 text-center">
-          <motion.span 
-            initial={{ opacity: 0 }}
-            animate={{ opacity: 1 }}
-            className="text-[10px] text-gold uppercase tracking-[0.6em] mb-4 block"
-          >
-            {t('blog.title')}
-          </motion.span>
-          <motion.h1 
-            initial={{ opacity: 0, scale: 0.98 }}
-            animate={{ opacity: 1, scale: 1 }}
-            className="font-heading text-5xl md:text-7xl text-stone-800 tracking-tight"
-          >
-            {t('blog.subtitle')}
-          </motion.h1>
-        </div>
-      </header>
-
-      {/* Featured Article */}
-      <section className="py-20 lg:py-32 container mx-auto px-6">
-        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
-          <motion.div 
-            initial={{ opacity: 0, x: -20 }}
-            whileInView={{ opacity: 1, x: 0 }}
-            className="relative group cursor-pointer"
-          >
-            <div className="overflow-hidden">
-               <img src={articles[0].image} alt={articles[0].title} className="w-full aspect-[16/9] object-cover scale-105 group-hover:scale-100 transition-transform duration-1000" />
-            </div>
-            <div className="absolute top-6 left-6 bg-ivory px-4 py-2 text-[10px] uppercase font-bold tracking-widest">
-              {t('blog.latest')}
-            </div>
-          </motion.div>
-          <motion.div
-            initial={{ opacity: 0, x: 20 }}
-            whileInView={{ opacity: 1, x: 0 }}
-          >
-            <span className="text-[10px] text-gold uppercase tracking-widest font-bold mb-4 block">{articles[0].category}</span>
-            <h2 className="font-heading text-4xl text-stone-800 mb-6 leading-tight hover:text-gold transition-colors cursor-pointer">
-              {articles[0].title}
-            </h2>
-            <p className="font-body text-stone-500 mb-8 leading-relaxed italic">
-              "{articles[0].excerpt}"
-            </p>
-            <div className="flex items-center gap-6 mb-10 text-[10px] text-stone-400 uppercase tracking-widest border-y border-stone-100 py-4">
-              <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> 5 {t('blog.min_read')}</span>
-              <span className="flex items-center gap-2"><User className="w-3 h-3" /> By {articles[0].author}</span>
-            </div>
-            <button className="btn-luxury italic !px-12">{t('blog.read_editorial')}</button>
-          </motion.div>
-        </div>
-      </section>
-
-      {/* Grid Articles */}
-      <section className="pb-32 container mx-auto px-6">
-        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
-          {articles.slice(1).map((article) => (
-            <motion.article 
-              key={article.id}
-              initial={{ opacity: 0, y: 20 }}
-              whileInView={{ opacity: 1, y: 0 }}
-              className="group"
-            >
-              <div className="relative aspect-[4/3] overflow-hidden mb-8">
-                <img 
-                  src={article.image} 
-                  alt={article.title} 
-                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
-                  loading="lazy"
-                />
-                <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-stone-900/0 transition-colors" />
-              </div>
-              <div className="flex items-center gap-3 mb-4">
-                 <Tag className="w-3 h-3 text-gold" />
-                 <span className="text-[10px] text-gold font-bold uppercase tracking-widest">{article.category}</span>
-              </div>
-              <h3 className="font-heading text-2xl text-stone-800 mb-4 group-hover:text-gold transition-colors leading-tight">
-                {article.title}
-              </h3>
-              <p className="font-body text-xs text-stone-400 uppercase tracking-wider mb-8 italic">
-                {article.date} ΓÇö By {article.author}
-              </p>
-              <div className="w-full h-px bg-stone-200 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 mb-6" />
-              <button className="flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-black group-hover:gap-6 transition-all">
-                {t('blog.view_journal')} <ArrowRight className="w-4 h-4 text-gold" />
-              </button>
-            </motion.article>
-          ))}
-        </div>
-
-        {/* Newsletter Teaser */}
-        <div className="mt-32 bg-stone-900 p-12 md:p-24 text-center relative overflow-hidden">
-           <div className="absolute inset-0 opacity-10 blur-3xl bg-gold/20" />
-           <div className="relative z-10 max-w-xl mx-auto">
-              <h3 className="font-heading text-3xl text-white mb-6 uppercase tracking-widest">{t('blog.join_circle')}</h3>
-              <p className="font-body text-ivory text-sm mb-10 leading-relaxed uppercase tracking-widest">
-                {t('blog.newsletter_desc')}
-             </p>
-             <div className="flex flex-col sm:flex-row gap-4">
-               <input 
-                type="email" 
-                 placeholder={t('blog.email_placeholder')}
-                className="flex-1 bg-white/5 border border-white/10 p-5 text-[10px] tracking-widest text-white outline-none focus:border-gold transition-colors" 
-              />
-              <button className="btn-luxury !whitespace-nowrap">{t('blog.subscribe')}</button>
-             </div>
-           </div>
-        </div>
-      </section>
-    </div>
-  );
-}
diff --git a/tests/click-verification.spec.js b/tests/click-verification.spec.js
index 38ed81b..f3b3a5c 100644
--- a/tests/click-verification.spec.js
+++ b/tests/click-verification.spec.js
@@ -171,21 +171,21 @@ test.describe('Homepage Category Tiles', () => {
 // ---------------------------------------------------------------------------
 // 7. HOMEPAGE ΓÇö Other CTAs (Journal, Gallery, About, Bespoke)
 // ---------------------------------------------------------------------------
 
 test.describe('Homepage Additional CTAs', () => {
   test.beforeEach(async ({ page }) => {
     await goHome(page);
   });
 
   const ctas = [
-    // NOTE: Journal (/blog), Gallery (/gallery) and View All Products (/collection/all)
+    // NOTE: Gallery (/gallery) and View All Products (/collection/all)
     // were removed from the homepage during the salon rebrand ΓÇö no longer linked from here.
     { name: 'About', path: '/about' },
   ];
 
   for (const { name, path } of ctas) {
     test(`CTA "${name}" navigates to ${path}`, async ({ page }) => {
       // Scroll to find the link (may be below fold)
       const link = page.locator(`a[href="${path}"]`).first();
       await link.scrollIntoViewIfNeeded({ timeout: 8000 });
       await expect(link).toBeVisible({ timeout: 5000 });
@@ -388,21 +388,20 @@ test.describe('Direct Route Navigation', () => {
   const routes = [
     { path: '/', name: 'Homepage' },
     { path: '/collection/bridal', name: 'Bridal Collection' },
     { path: '/collection/evening', name: 'Evening Collection' },
     { path: '/collection/rental', name: 'Rental Collection' },
     { path: '/about', name: 'About' },
     { path: '/contact', name: 'Contact' },
     { path: '/search', name: 'Search' },
     { path: '/wishlist', name: 'Wishlist' },
     { path: '/profile', name: 'Profile' },
-    { path: '/blog', name: 'Blog' },
     { path: '/faq', name: 'FAQ' },
     { path: '/alterations', name: 'Alterations' },
     { path: '/gallery', name: 'Gallery' },
     { path: '/style-quiz', name: 'Style Quiz' },
     { path: '/appointment', name: 'Appointment' },
     { path: '/checkout', name: 'Checkout' },
     { path: '/privacy', name: 'Privacy' },
     { path: '/terms', name: 'Terms' },
   ];
 
