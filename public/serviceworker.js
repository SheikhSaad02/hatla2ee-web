/**
 * MoEngage Service Worker
 * This file is required for MoEngage Web Push notifications
 * 
 * IMPORTANT: Replace 'dc_X' with your actual data center (e.g., dc_1, dc_2, dc_3, dc_4, dc_5)
 * Find your data center in MoEngage Dashboard → Settings → App → General
 */

// Import MoEngage service worker script
// Note: Update 'dc_1' to match your data center from NEXT_PUBLIC_MOENGAGE_DATA_CENTER
importScripts('https://cdn.moengage.com/release/dc_1/versions/2/serviceworker_cdn.min.latest.js');
