'use client';
import { usePathname } from 'next/navigation';
import { createContext, useContext, useState, useEffect } from 'react';

const ComparisonContext = createContext();

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    console.error('useComparison must be used within ComparisonProvider');
  }
  return context;
};

export const ComparisonProvider = ({ children }) => {
  const [list, setList] = useState([]);
  const COMPARE_LOCAL_STORAGE_KEY = 'newCarCompareList';
  const MAX_ITEMS = 4;

  const pathname = usePathname();

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem(COMPARE_LOCAL_STORAGE_KEY));
    setList(list || []);
  }, [pathname]);

  const add = (item, locale, getLocaleString) => {
    if (list.some((car) => car?.id === item?.id)) {
      return false;
    }

    if (list.length >= MAX_ITEMS) {
      return false;
    }

    const newItem = {
      id: item?.id,
      name: getLocaleString(item, 'title', locale) || '',
      img: item?.image,
      url: item?.href ? item?.href : pathname,
      type: item?.type || 'car',
    };

    localStorage.setItem(
      COMPARE_LOCAL_STORAGE_KEY,
      JSON.stringify([...list, newItem]),
    );

    setList((prev) => [...prev, newItem]);
    return true;
  };

  const remove = (itemId) => {
    localStorage.setItem(
      COMPARE_LOCAL_STORAGE_KEY,
      JSON.stringify(list.filter((car) => car?.id !== itemId)),
    );
    setList((prev) => prev.filter((car) => car?.id !== itemId));
  };

  const inComparison = (itemId) => {
    return list.some((car) => car?.id === itemId);
  };

  const value = {
    list,
    add,
    remove,
    inComparison,
    MAX_ITEMS,
  };

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
};
