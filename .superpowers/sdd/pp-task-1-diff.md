## Commits
39a7927 feat(theme): add text-micro/text-caption type tokens with RTL scaling

## Stat
 src/index.css | 5 +++++
 1 file changed, 5 insertions(+)

## Diff
diff --git a/src/index.css b/src/index.css
index a4a4228..a1918e1 100644
--- a/src/index.css
+++ b/src/index.css
@@ -3,20 +3,23 @@
 
 @theme {
   --font-heading: "Fraunces", serif;
   --font-editorial: "Newsreader", serif;
   --font-body: "Newsreader", serif;
   --font-label: "Archivo", sans-serif;
   --font-arabic: "Cairo", "IBM Plex Sans Arabic", sans-serif;
   --font-arabic-heading: "Amiri", serif;
   --font-jewelry: "Fraunces", serif;
 
+  --text-micro: 11px;
+  --text-caption: 12px;
+
   --color-gold: #A2492B;
   --color-gold-light: #C45A3C;
   --color-gold-dark: #7A3520;
   --color-onyx: #161513;
   --color-bone: #EFEAE2;
   --color-ivory: var(--color-bone);
   --color-champagne: #F6F0E6;
   --color-pearl: #E8E3D9;
   --color-jewelry: linear-gradient(45deg, #7A3520 0%, #A2492B 45%, #C45A3C 50%, #A2492B 55%, #7A3520 100%);
 
@@ -95,20 +98,22 @@
   [dir="rtl"] .text-6xl { font-size: 4rem; }
   [dir="rtl"] .text-7xl { font-size: 5rem; }
   [dir="rtl"] .text-8xl { font-size: 6.5rem; }
   [dir="rtl"] .text-9xl { font-size: 8.5rem; }
   /* Pixel-based sizes: enlarge by ~25% */
   [dir="rtl"] .text-\[8px\] { font-size: 11px; }
   [dir="rtl"] .text-\[9px\] { font-size: 12px; }
   [dir="rtl"] .text-\[10px\] { font-size: 13px; }
   [dir="rtl"] .text-\[11px\] { font-size: 14px; }
   [dir="rtl"] .text-\[12px\] { font-size: 15px; }
+  [dir="rtl"] .text-micro { font-size: 14px; }
+  [dir="rtl"] .text-caption { font-size: 15px; }
   /* Tracking is meaningless in Arabic and causes rendering issues */
   [dir="rtl"] .tracking-widest { letter-spacing: 0 !important; }
   [dir="rtl"] .tracking-wider { letter-spacing: 0 !important; }
   [dir="rtl"] .tracking-\[0\.3em\] { letter-spacing: 0 !important; }
   [dir="rtl"] .tracking-\[0\.2em\] { letter-spacing: 0 !important; }
   [dir="rtl"] .tracking-\[0\.5em\] { letter-spacing: 0 !important; }
   [dir="rtl"] .tracking-\[0\.4em\] { letter-spacing: 0 !important; }
   [dir="rtl"] .tracking-\[0\.15em\] { letter-spacing: 0 !important; }
   [dir="rtl"] .tracking-tight { letter-spacing: 0 !important; }
   [dir="rtl"] .tracking-tighter { letter-spacing: 0 !important; }
