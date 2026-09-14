# Final review package AR (46540b1..91ada91)
## Commits
91ada91 fix(i18n): localize order-sidebar category values
a64b023 i18n: wire components, checkout, pdp, and toasts
851b9ab i18n: wire payment-cancel and wedding pages to translations
246cf89 test(calendar): date-robust day lookups (year-substring collision)
0e87210 feat(i18n): product value vocabulary (fabric/category/silhouette ar)
927956f i18n: arabic-page residue keys + en-fallback chain
444b416 docs(plan): arabic strings cleanup implementation plan
b2ba841 docs(spec): arabic strings cleanup design

## Stat
 .../plans/2026-08-25-arabic-strings-cleanup.md     | 537 +++++++++++++++++++++
 .../2026-08-25-arabic-strings-cleanup-design.md    |  36 ++
 src/App.tsx                                        |  60 +--
 src/components/AvailabilityCalendar.test.tsx       |   7 +-
 src/components/GlobalErrorBoundary.tsx             |  35 +-
 src/components/GlobalFeatures.test.tsx             |  33 +-
 src/components/GlobalFeatures.tsx                  |  24 +-
 src/components/ProductCard.tsx                     |  46 +-
 src/components/ThreeDViewer.tsx                    |  12 +-
 src/components/salon/EditorialPlate.tsx            |   5 +-
 src/contexts/AuthContext.tsx                       |   6 +-
 src/contexts/LanguageContext.tsx                   | 132 ++++-
 src/lib/productVocab.test.ts                       |  31 ++
 src/lib/productVocab.ts                            |  61 +++
 src/pages/Checkout.tsx                             |  29 +-
 src/pages/PaymentCancel.tsx                        |  10 +-
 src/pages/ProductDetail.tsx                        |  13 +-
 src/pages/WeddingChecklist.tsx                     |  19 +-
 src/pages/WeddingTimeline.tsx                      |  10 +-
 src/pages/WishlistPage.tsx                         | 158 ++++--
 20 files changed, 1092 insertions(+), 172 deletions(-)
