'use client';

import { createElement, useEffect, useRef, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { cn } from '@/utils';
import { getMapsLoader } from '@/hooks/useGoogleMaps';
import { CHARGING_PIN_SVG, CHARGING_PIN_MUTED_SVG } from '@/icons/basicSvgs';

// Serialize the pin SVG components to data-URIs once (for Google Maps icons).
const svgDataUri = (Component) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    renderToStaticMarkup(createElement(Component)),
  )}`;
const PIN_SELECTED_URL = svgDataUri(CHARGING_PIN_SVG);
const PIN_MUTED_URL = svgDataUri(CHARGING_PIN_MUTED_SVG);

const MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#f3f5f9' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8a94a6' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }, { weight: 2 }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#e6eaf1' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#cfe0f5' }] },
];

const userDotIcon = () => ({
  path: window.google.maps.SymbolPath.CIRCLE,
  scale: 7,
  fillColor: '#2563eb',
  fillOpacity: 1,
  strokeColor: '#fff',
  strokeWeight: 3,
});

// Navy pin when selected, muted blue otherwise; selected renders larger.
const pinIcon = (active) => {
  const ratio = active ? 66 / 43 : 52 / 34;
  const w = active ? 42 : 32;
  return {
    url: active ? PIN_SELECTED_URL : PIN_MUTED_URL,
    scaledSize: new window.google.maps.Size(w, w * ratio),
    anchor: new window.google.maps.Point(w / 2, w * ratio),
  };
};

/** Map canvas: markers, selection recolor/fit, zoom + recenter controls. */
export default function StationMap({
  origin,
  stations,
  selectedId,
  onSelect,
  onMapInteract,
  className,
  showControls = true,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const fittingRef = useRef(false);
  const onInteractRef = useRef(onMapInteract);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    onInteractRef.current = onMapInteract;
  }, [onMapInteract]);

  // Create the map + "you are here" dot once. Uses the library's built-in
  // zoom control (enabled via zoomControl) instead of custom buttons.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const loader = getMapsLoader();
      const { Map } = await loader.importLibrary('maps');
      await loader.importLibrary('marker');
      if (cancelled || !containerRef.current || mapRef.current) return;

      mapRef.current = new Map(containerRef.current, {
        center: origin,
        zoom: 13,
        minZoom: 3,
        maxZoom: 21,
        disableDefaultUI: true,
        zoomControl: showControls,
        clickableIcons: false,
        styles: MAP_STYLE,
      });
      // eslint-disable-next-line deprecation/deprecation -- classic Marker kept to preserve inline map styles
      new window.google.maps.Marker({
        position: origin,
        map: mapRef.current,
        icon: userDotIcon(),
        zIndex: 999,
      });
      mapRef.current.addListener('dragend', () => onInteractRef.current?.());
      mapRef.current.addListener('zoom_changed', () => {
        if (!fittingRef.current) onInteractRef.current?.();
      });
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [origin, showControls]);

  // Rebuild markers when the station list changes.
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    // eslint-disable-next-line deprecation/deprecation -- classic Marker kept to preserve inline map styles
    const { Marker } = window.google.maps;
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = stations.map((s) => {
      const marker = new Marker({
        position: s.pos,
        map: mapRef.current,
        icon: pinIcon(s.id === selectedId),
      });
      marker.addListener('click', () => onSelect?.(s.id));
      return marker;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, stations]);

  // Recolor pins + fit viewport (user + selected, else all).
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(origin);
    markersRef.current.forEach((m, i) => {
      m.setIcon(pinIcon(stations[i]?.id === selectedId));
    });
    const sel = stations.find((s) => s.id === selectedId);
    if (sel) bounds.extend(sel.pos);
    else stations.forEach((s) => bounds.extend(s.pos));
    if (!bounds.isEmpty()) {
      fittingRef.current = true;
      window.google.maps.event.addListenerOnce(mapRef.current, 'idle', () => {
        fittingRef.current = false;
      });
      mapRef.current.fitBounds(bounds, 64);
    }
  }, [ready, selectedId, stations, origin]);

  return (
    <div className={cn('relative bg-[#f3f5f9]', className)}>
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
