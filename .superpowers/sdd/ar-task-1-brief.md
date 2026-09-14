### Task 1: i18n keys + t() fallback chain

**Files:**
- Modify: `src/contexts/LanguageContext.tsx`

**Interfaces:**
- Produces: keys consumed by Tasks 3–4 (tables below); changed `t()` behavior: missing-in-lang key falls back to en block before raw key.

- [ ] **Step 1: Harden the fallback**

Find (end of file, ~line 1521):

```ts
return translations[language][key] || key;
```

Replace with:

```ts
return translations[language][key] || translations.en[key] || key;
```

- [ ] **Step 2: Add English keys**

Insert a new block after the existing `// Calendar` block in the EN section:

```ts
    // Checkout extras
    'checkout.secured_stripe': 'Secured by Stripe',
    'checkout.secure_order_atelier': 'Secure Order — Payment at Atelier',
    'checkout.order_failed': 'Failed to place order. Please try again.',
    'checkout.country_default': 'United Arab Emirates',

    // Payment cancel
    'payment.cancel.title': 'Payment Cancelled',
    'payment.cancel.body': 'No charges were made. Your order has not been placed.',
    'payment.cancel.return_checkout': 'Return to Checkout',
    'payment.cancel.continue_browsing': 'Continue Browsing',

    // Wedding checklist
    'wedding.checklist.eyebrow': 'The Road to I Do',
    'wedding.checklist.title': 'Wedding Planning Checklist',
    'wedding.checklist.m12': '12 Months Before',
    'wedding.checklist.t12': 'Set your wedding date and venue.',
    'wedding.checklist.m11': '11 Months Before',
    'wedding.checklist.t11': 'Book your first Riman Atelier consultation.',
    'wedding.checklist.m9': '9 Months Before',
    'wedding.checklist.t9': 'Finalize your silhouette and fabric selection.',
    'wedding.checklist.m6': '6 Months Before',
    'wedding.checklist.t6': 'First fitting and embroidery details.',
    'wedding.checklist.m3': '3 Months Before',
    'wedding.checklist.t3': 'Accessorize with veils and headpieces.',
    'wedding.checklist.m1': '1 Month Before',
    'wedding.checklist.t1': 'Final fitting and secure collection.',

    // Wedding timeline
    'wedding.timeline.title': 'Wedding Timeline',
    'wedding.timeline.subtitle': 'Planning your journey to I DO',
    'wedding.timeline.return_home': 'Return Home',

    // Newsletter modal
    'newsletter.title': 'The Atelier Circle',
    'newsletter.body': 'Join for exclusive previews of our new bridal collections and private viewings in Sharjah.',
    'newsletter.email_placeholder': 'E-mail Address',
    'newsletter.email_aria': 'Email address',
    'newsletter.cta': 'Join The Society',

    // Cookie banner
    'cookies.heading': 'Privacy & Elegance',
    'cookies.body': 'We use cookies to curate a personalized atelier experience.',
    'cookies.learn': 'Learn details',
    'cookies.accept': 'Accept & Explore',

    // Errors & common
    'errors.tech_title': 'A Technical Moment',
    'errors.tech_body': 'Our digital atelier is experiencing a brief pause. Please refresh the page or return to our home collection.',
    'errors.return_atelier': 'Return to Atelier',
    'common.close': 'Close',
    'common.retry': 'Retry',
    'threed.initializing': 'Initializing 3D Detail',

    // Toasts & fallbacks
    'product.toast_suffix_rental': 'rental booked',
    'product.toast_suffix_added': 'added to your collection',
    'product.fabric_default': 'Luxury Blend',
    'auth.profile_missing_title': 'Profile not found',
    'auth.load_fail_title': 'Could not load account',
    'auth.limited_msg': 'Some features may be limited.',
```

- [ ] **Step 3: Add Arabic keys**

Insert the mirror block after the AR `// Calendar` block:

```ts
    // Checkout extras
    'checkout.secured_stripe': 'مؤمَّن عبر Stripe',
    'checkout.secure_order_atelier': 'طلب آمن — الدفع في الأتيليه',
    'checkout.order_failed': 'تعذّر إنشاء الطلب. يرجى المحاولة مرة أخرى.',
    'checkout.country_default': 'الإمارات العربية المتحدة',

    // Payment cancel
    'payment.cancel.title': 'تم إلغاء الدفع',
    'payment.cancel.body': 'لم يتم خصم أي مبالغ، ولم يتم إنشاء طلبك.',
    'payment.cancel.return_checkout': 'العودة إلى الحقيبة',
    'payment.cancel.continue_browsing': 'متابعة التصفح',

    // Wedding checklist
    'wedding.checklist.eyebrow': 'الطريق إلى نعم',
    'wedding.checklist.title': 'قائمة التخطيط للزفاف',
    'wedding.checklist.m12': 'قبل 12 شهرًا',
    'wedding.checklist.t12': 'حددي تاريخ الزفاف والمكان.',
    'wedding.checklist.m11': 'قبل 11 شهرًا',
    'wedding.checklist.t11': 'احجزي استشارتك الأولى في أتيليه ريمان.',
    'wedding.checklist.m9': 'قبل 9 أشهر',
    'wedding.checklist.t9': 'حسدي اختيار القصة والقماش.',
    'wedding.checklist.m6': 'قبل 6 أشهر',
    'wedding.checklist.t6': 'أول بروفة وتفاصيل التطريز.',
    'wedding.checklist.m3': 'قبل 3 أشهر',
    'wedding.checklist.t3': 'استكملي الإطلالة بالطرح وإكسسوارات الرأس.',
    'wedding.checklist.m1': 'قبل شهر',
    'wedding.checklist.t1': 'البروفة النهائية واستلام الفستان.',

    // Wedding timeline
    'wedding.timeline.title': 'الجدول الزمني للزفاف',
    'wedding.timeline.subtitle': 'نرسم معكِ الطريق إلى نعم',
    'wedding.timeline.return_home': 'العودة إلى الرئيسية',

    // Newsletter modal
    'newsletter.title': 'دائرة الأتيليه',
    'newsletter.body': 'انضمي للحصول على عروض حصرية لمجموعات الزفاف الجديدة ودعوات المعاينات الخاصة في الشارقة.',
    'newsletter.email_placeholder': 'البريد الإلكتروني',
    'newsletter.email_aria': 'البريد الإلكتروني',
    'newsletter.cta': 'انضمي إلى الجمعية',

    // Cookie banner
    'cookies.heading': 'الخصوصية والأناقة',
    'cookies.body': 'نستخدم ملفات تعريف الارتباط لتوفير تجربة أتيليه مخصصة لكِ.',
    'cookies.learn': 'اعرفي المزيد',
    'cookies.accept': 'الموافقة والاستكشاف',

    // Errors & common
    'errors.tech_title': 'لحظة تقنية',
    'errors.tech_body': 'أتيليهنا الرقمي يمر بوقفة قصيرة. يرجى تحديث الصفحة أو العودة إلى مجموعتنا الرئيسية.',
    'errors.return_atelier': 'العودة إلى الأتيليه',
    'common.close': 'إغلاق',
    'common.retry': 'إعادة المحاولة',
    'threed.initializing': 'جارٍ تحميل التفاصيل ثلاثية الأبعاد',

    // Toasts & fallbacks
    'product.toast_suffix_rental': 'تم حجز الإيجار',
    'product.toast_suffix_added': 'أُضيف إلى مجموعتك',
    'product.fabric_default': 'مزيج فاخر',
    'auth.profile_missing_title': 'لم يتم العثور على الملف الشخصي',
    'auth.load_fail_title': 'تعذر تحميل الحساب',
    'auth.limited_msg': 'قد تكون بعض الميزات محدودة.',
```

- [ ] **Step 4: Verify**

Run: `npm run lint`
Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add src/contexts/LanguageContext.tsx
git commit -m "i18n: arabic-page residue keys + en-fallback chain"
```

---

