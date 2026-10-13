// EV charging stations — shared helpers (framework-agnostic, client-safe).

// Wider radius used only to suggest reachable stations when none are nearby.
export const WIDER_RADIUS_M = 50000;

export const directionsUrl = (s) =>
  `https://www.google.com/maps/dir/?api=1&destination=${s.pos.lat},${s.pos.lng}`;

export function haversineKm(a, b) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

/** Map a Places API (New) result → our station shape (distance from `from`). */
export const toStation = (p, from) => {
  const pos = { lat: p.location.lat(), lng: p.location.lng() };
  return {
    id: p.id,
    name: p.displayName,
    area: p.formattedAddress || '',
    rating: p.rating,
    pos,
    distance: `${haversineKm(from, pos).toFixed(1)} km`,
  };
};
