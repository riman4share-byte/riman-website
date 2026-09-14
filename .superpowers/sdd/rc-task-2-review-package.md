# Review package Task 2 (28cbfdd..db81650)
## Commits
db81650 i18n(calendar): keyboard a11y + next-available strings (en/ar)

## Stat
 src/contexts/LanguageContext.tsx | 16 ++++++++++++++++
 1 file changed, 16 insertions(+)

## Diff (-U10)
diff --git a/src/contexts/LanguageContext.tsx b/src/contexts/LanguageContext.tsx
index 0eeb10f..450b206 100644
--- a/src/contexts/LanguageContext.tsx
+++ b/src/contexts/LanguageContext.tsx
@@ -341,20 +341,28 @@ const translations: Record<Language, Record<string, string>> = {
     'product.available': 'available',
     'product.fully_booked': 'fully booked',
 
     // Calendar
     'calendar.days': 'Sun,Mon,Tue,Wed,Thu,Fri,Sat',
     'calendar.months': 'January,February,March,April,May,June,July,August,September,October,November,December',
     'calendar.available': 'Available',
     'calendar.booked': 'Booked',
     'calendar.prev': 'Previous month',
     'calendar.next': 'Next month',
+    'calendar.nextAvailable': 'Next available date',
+    'calendar.statusAvailable': 'available',
+    'calendar.statusBooked': 'booked',
+    'calendar.statusPast': 'past',
+    'calendar.selectedPrefix': 'Selected:',
+    'calendar.noAvailability': 'No availability in the next 6 months.',
+    'calendar.fallbackNotice': "Availability couldn't be loaded ΓÇö showing approximate data.",
+    'calendar.retry': 'Retry',
 
     // Checkout
     'checkout.empty': 'Your Bag is Empty',
     'checkout.empty_desc': 'Please select pieces from our collection first.',
     'checkout.explore': 'Explore Collection',
     'checkout.step_identity': 'Identity',
     'checkout.step_logistics': 'Logistics',
     'checkout.step_confirm': 'Confirm',
     'checkout.personal_details': 'Personal Details',
     'checkout.delivery_info': 'Delivery Information',
@@ -1079,20 +1087,28 @@ const translations: Record<Language, Record<string, string>> = {
     'product.available': '┘à╪¬╪º╪¡',
     'product.fully_booked': '┘à╪¡╪¼┘ê╪▓ ╪¿╪º┘ä┘â╪º┘à┘ä',
 
     // Calendar
     'calendar.days': '╪ú╪¡╪»,╪º╪½┘å┘è┘å,╪½┘ä╪º╪½╪º╪í,╪ú╪▒╪¿╪╣╪º╪í,╪«┘à┘è╪│,╪¼┘à╪╣╪⌐,╪│╪¿╪¬',
     'calendar.months': '┘è┘å╪º┘è╪▒,┘ü╪¿╪▒╪º┘è╪▒,┘à╪º╪▒╪│,╪ú╪¿╪▒┘è┘ä,┘à╪º┘è┘ê,┘è┘ê┘å┘è┘ê,┘è┘ê┘ä┘è┘ê,╪ú╪║╪│╪╖╪│,╪│╪¿╪¬┘à╪¿╪▒,╪ú┘â╪¬┘ê╪¿╪▒,┘å┘ê┘ü┘à╪¿╪▒,╪»┘è╪│┘à╪¿╪▒',
     'calendar.available': '┘à╪¬╪º╪¡',
     'calendar.booked': '┘à╪¡╪¼┘ê╪▓',
     'calendar.prev': '╪º┘ä╪┤┘ç╪▒ ╪º┘ä╪│╪º╪¿┘é',
     'calendar.next': '╪º┘ä╪┤┘ç╪▒ ╪º┘ä╪¬╪º┘ä┘è',
+    'calendar.nextAvailable': '╪ú┘é╪▒╪¿ ╪¬╪º╪▒┘è╪« ┘à╪¬╪º╪¡',
+    'calendar.statusAvailable': '┘à╪¬╪º╪¡',
+    'calendar.statusBooked': '┘à╪¡╪¼┘ê╪▓',
+    'calendar.statusPast': '┘à╪º╪╢┘ì',
+    'calendar.selectedPrefix': '╪º┘ä┘à╪¡╪»╪»:',
+    'calendar.noAvailability': '┘ä╪º ╪¬┘ê╪¼╪» ┘à┘ê╪º╪╣┘è╪» ┘à╪¬╪º╪¡╪⌐ ╪«┘ä╪º┘ä ╪º┘ä╪ú╪┤┘ç╪▒ ╪º┘ä╪│╪¬╪⌐ ╪º┘ä┘é╪º╪»┘à╪⌐.',
+    'calendar.fallbackNotice': '╪¬╪╣╪░┘æ╪▒ ╪¬╪¡┘à┘è┘ä ╪º┘ä╪¬┘ê┘ü╪▒ ΓÇö ╪¬┘Å╪╣╪▒╪╢ ╪¿┘è╪º┘å╪º╪¬ ╪¬┘é╪▒┘è╪¿┘è╪⌐.',
+    'calendar.retry': '╪Ñ╪╣╪º╪»╪⌐ ╪º┘ä┘à╪¡╪º┘ê┘ä╪⌐',
 
     // Checkout
     'checkout.empty': '╪¡┘é┘è╪¿╪¬┘â ┘ü╪º╪▒╪║╪⌐',
     'checkout.empty_desc': '┘è╪▒╪¼┘ë ╪º╪«╪¬┘è╪º╪▒ ╪º┘ä┘é╪╖╪╣ ┘à┘å ┘à╪¼┘à┘ê╪╣╪¬┘å╪º ╪ú┘ê┘ä╪º┘ï.',
     'checkout.explore': '╪º╪│╪¬┘â╪┤┘ü ╪º┘ä┘à╪¼┘à┘ê╪╣╪⌐',
     'checkout.step_identity': '╪º┘ä┘ç┘ê┘è╪⌐',
     'checkout.step_logistics': '╪º┘ä╪¬┘ê╪╡┘è┘ä',
     'checkout.step_confirm': '╪º┘ä╪¬╪ú┘â┘è╪»',
     'checkout.personal_details': '╪º┘ä╪¿┘è╪º┘å╪º╪¬ ╪º┘ä╪┤╪«╪╡┘è╪⌐',
     'checkout.delivery_info': '┘à╪╣┘ä┘ê┘à╪º╪¬ ╪º┘ä╪¬┘ê╪╡┘è┘ä',
