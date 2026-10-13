'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getMapsLoader } from '@/hooks/useGoogleMaps';
import { EV_CHARGING_CENTER, EV_CHARGING_RADIUS_M } from '../data';
import { WIDER_RADIUS_M, toStation } from './stationUtils';

export function useChargingStations() {
  const [origin, setOrigin] = useState(null);
  const [stations, setStations] = useState(null); // null = loading, [] = none
  const [otherStations, setOtherStations] = useState([]);
  const mounted = useRef(true);

  useEffect(
    () => () => {
      mounted.current = false;
    },
    [],
  );

  const search = useCallback(async (from) => {
    try {
      const { Place, SearchNearbyRankPreference } =
        await getMapsLoader().importLibrary('places');

      const searchAt = (radius) =>
        Place.searchNearby({
          fields: [
            'id',
            'displayName',
            'location',
            'formattedAddress',
            'rating',
          ],
          locationRestriction: { center: from, radius },
          includedPrimaryTypes: ['electric_vehicle_charging_station'],
          maxResultCount: 10,
          rankPreference: SearchNearbyRankPreference.DISTANCE,
        });

      const { places } = await searchAt(EV_CHARGING_RADIUS_M);
      if (!mounted.current) return;
      const mapped = (places || []).map((p) => toStation(p, from));

      if (mapped.length === 0) {
        const wider = await searchAt(WIDER_RADIUS_M);
        if (!mounted.current) return;
        setOtherStations((wider.places || []).map((p) => toStation(p, from)));
      } else {
        setOtherStations([]);
      }

      setOrigin(from);
      setStations(mapped);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('EV charging search failed:', e);
      if (mounted.current) {
        setOrigin(from);
        setStations([]);
      }
    }
  }, []);

  const locate = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => search({ lat: p.coords.latitude, lng: p.coords.longitude }),
        () => search(EV_CHARGING_CENTER),
        { timeout: 8000 },
      );
    } else {
      search(EV_CHARGING_CENTER);
    }
  }, [search]);

  useEffect(() => {
    locate();
  }, [locate]);

  return {
    origin,
    stations,
    otherStations,
    loading: stations === null,
    isEmpty: Array.isArray(stations) && stations.length === 0,
    locate,
  };
}
