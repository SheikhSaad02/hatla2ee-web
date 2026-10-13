'use client';

import { createContext, useContext } from 'react';

const IsMobileContext = createContext(undefined);

export function IsMobileProvider({ isMobile, children }) {
  return (
    <IsMobileContext.Provider value={isMobile}>
      {children}
    </IsMobileContext.Provider>
  );
}

export function useIsMobile() {
  const context = useContext(IsMobileContext);
  return context;
}
