import { appPaths, appSections } from '@/constants';
import { useEffect, useRef, useState } from 'react';

export function useNavIndicator(pathname, navLinksRef) {
  const [activeTab, setActiveTab] = useState(null);
  const [indicatorStyle, setIndicatorStyle] = useState({
    width: 0,
    left: 0,
    opacity: 1,
  });
  const tabRefs = useRef({});
  const timeoutRef = useRef(null);

  const getCurrentActiveTab = () => {
    if (
      pathname.includes('trucks') ||
      pathname.includes('bus') ||
      pathname.includes('motorcycle')
    ) {
      return appSections.VEHICLE_PRICES;
    }
    if (
      pathname.includes('/more') ||
      pathname.includes('/finance-new-car') ||
      pathname.includes('/finance-used-car') ||
      pathname.includes('/car-selection') ||
      pathname.includes('/evaluate') ||
      pathname.includes(appPaths.review) ||
      pathname.includes(appPaths.newCarCompare)
    )
      return appSections.MORE;

    if (
      pathname.includes('/car/price') ||
      pathname.includes('/car/all-prices') ||
      pathname.includes('/used-price') ||
      pathname.includes('/price-change')
    ) {
      return appSections.CAR_PRICES;
    }
    if (pathname.includes(appPaths.electricCars))
      return appSections.ELECTRIC_CARS;
    if (pathname.includes(appPaths.importedCars)) return appSections.IMPORTED;
    if (pathname.includes(appPaths['new-car'])) return appSections.NEW_CARS;

    if (pathname.includes('/car')) return appSections.USED_CARS;
    return null;
  };

  const updateIndicatorStyle = (tabId) => {
    if (!tabId) {
      setIndicatorStyle({
        width: 0,
        left: 0,
        opacity: 1,
      });
      return;
    }
    const tabElement = tabRefs.current[tabId];
    const navRect = navLinksRef.current?.getBoundingClientRect();

    if (tabElement && navRect) {
      const tabRect = tabElement.getBoundingClientRect();
      setIndicatorStyle({
        width: tabRect.width,
        left: tabRect.left - navRect.left,
        opacity: 1,
      });
    }
  };

  const handleMouseEnter = (tabId) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveTab(tabId);
    updateIndicatorStyle(tabId);
  };

  const handleMouseLeave = () => {
    const current = getCurrentActiveTab();
    timeoutRef.current = setTimeout(() => {
      setActiveTab(current);
      updateIndicatorStyle(current);
    }, 150);
  };

  useEffect(() => {
    const current = getCurrentActiveTab();
    setActiveTab(current);
    const timeoutId = setTimeout(() => updateIndicatorStyle(current), 100);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(timeoutRef.current);
    };
  }, [pathname]);

  return {
    activeTab,
    tabRefs,
    indicatorStyle,
    handleMouseEnter,
    handleMouseLeave,
  };
}
