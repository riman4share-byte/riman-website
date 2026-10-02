import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const DESKTOP_PATH = path.join(process.env.USERPROFILE || '', 'Desktop', 'riman-fashion-screenshots');
const BASE_URL = 'http://localhost:3002';

const routes = [
  { path: '/', name: 'home' },
  { path: '/collections', name: 'collections' },
  { path: '/collection/women', name: 'collection-women' },
  { path: '/journal', name: 'journal' },
  { path: '/about', name: 'about' },
  { path: '/contact', name: 'contact' },
  { path: '/search', name: 'search' },
  { path: '/wishlist', name: 'wishlist' },
  { path: '/profile', name: 'profile' },
  { path: '/faq', name: 'faq' },
  { path: '/alterations', name: 'alterations' },
  { path: '/privacy', name: 'privacy' },
  { path: '/terms', name: 'terms' },
  { path: '/auth', name: 'auth' },
  { path: '/checkout', name: 'checkout' },
  { path: '/style-quiz', name: 'style-quiz' },
  { path: '/appointment', name: 'appointment' },
  { path: '/timeline', name: 'wedding-timeline' },
  { path: '/wedding-checklist', name: 'wedding-checklist' },
  { path: '/gallery', name: 'gallery' },
];

// Create output directory
if (!fs.existsSync(DESKTOP_PATH)) {
  fs.mkdirSync(DESKTOP_PATH, { recursive: true });
  console.log(`Created directory: ${DESKTOP_PATH}`);
}

for (const route of routes) {
  test(`Screenshot: ${route.name}`, async ({ page }) => {
    console.log(`Navigating to ${BASE_URL}${route.path}...`);
    
    try {
      await page.goto(`${BASE_URL}${route.path}`, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      // Wait for any animations to complete
      await page.waitForTimeout(2000);
      
      // Take full page screenshot
      const screenshotPath = path.join(DESKTOP_PATH, `${route.name}.png`);
      await page.screenshot({ 
        path: screenshotPath, 
        fullPage: true 
      });
      
      console.log(`✓ Saved: ${screenshotPath}`);
    } catch (error) {
      console.error(`✗ Failed to screenshot ${route.name}:`, error);
    }
  });
}

// Admin routes (may require authentication)
const adminRoutes = [
  { path: '/admin', name: 'admin-dashboard' },
  { path: '/admin/products', name: 'admin-products' },
  { path: '/admin/orders', name: 'admin-orders' },
  { path: '/admin/bookings', name: 'admin-bookings' },
  { path: '/admin/appointments', name: 'admin-appointments' },
  { path: '/admin/content', name: 'admin-content' },
  { path: '/admin/gallery', name: 'admin-gallery' },
  { path: '/admin/reviews', name: 'admin-reviews' },
  { path: '/admin/settings', name: 'admin-settings' },
];

for (const route of adminRoutes) {
  test(`Screenshot: ${route.name}`, async ({ page }) => {
    console.log(`Navigating to ${BASE_URL}${route.path}...`);
    
    try {
      await page.goto(`${BASE_URL}${route.path}`, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      // Wait for any animations to complete
      await page.waitForTimeout(2000);
      
      // Take full page screenshot
      const screenshotPath = path.join(DESKTOP_PATH, `${route.name}.png`);
      await page.screenshot({ 
        path: screenshotPath, 
        fullPage: true 
      });
      
      console.log(`✓ Saved: ${screenshotPath}`);
    } catch (error) {
      console.error(`✗ Failed to screenshot ${route.name}:`, error);
    }
  });
}