'use client';

import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

/**
 * Google Maps JS API loader (@googlemaps/js-api-loader v2 functional API).
 * Configure once with setOptions, then callers await importLibrary('maps' |
 * 'marker' | 'places'). Key: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.
 */
let configured = false;

export function getMapsLoader() {
  if (!configured) {
    setOptions({
      key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      v: 'weekly',
    });
    configured = true;
  }
  return { importLibrary };
}
