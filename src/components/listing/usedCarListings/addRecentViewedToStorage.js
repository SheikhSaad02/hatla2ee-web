'use client';

import { useEffect } from 'react';

const AddRecentViewedToStorage = ({ id }) => {
  const storeVisitedCarId = (value) => {
    if (typeof window === 'undefined') return;

    const key = 'car_last_visit';
    const maxItems = 5;

    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const filtered = existing.filter((item) => item !== String(value));
    filtered.unshift(String(value));
    const updated = filtered.slice(0, maxItems);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  useEffect(() => {
    if (!id || typeof window === 'undefined') return;

    const pathname = window.location.pathname;

    const value = pathname.includes('/new-car/') ? `new-${id}` : String(id);

    storeVisitedCarId(value);
  }, [id]);

  return null;
};

export default AddRecentViewedToStorage;
