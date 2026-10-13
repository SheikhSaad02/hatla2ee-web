'use client';
import { useEffect } from 'react';
import { initializeSession } from '@/utils/session';
import { setGA4UserProperties } from '@/services/analyticsService/userProperties';
import { initializeMoEngage, updateMoengageUser } from '@/services/moengageService';
import { useUser } from '@/providers/user';

const AppInitializer = () => {
  const { user } = useUser();

  useEffect(() => {
    initializeSession();

    // Set GA4 user properties early - this ensures chosen_country is attached to session_start
    // Wait a bit for gtag to be available (GA4 loads asynchronously)
    const setUserProps = () => {
      if (window.gtag) {
        setGA4UserProperties();
      } else {
        // Retry after a short delay if gtag isn't ready yet
        setTimeout(setUserProps, 100);
      }
    };
    
    // Try immediately, then retry if needed
    setUserProps();

    // Initialize MoEngage SDK (tenant/country only; no user data yet)
    initializeMoEngage();
  }, []);

  // Set MoEngage user attributes when client-side user fetch completes (user from context)
  useEffect(() => {
    if (user) {
      updateMoengageUser(user);
    }
  }, [user]);

  return null;
};

export default AppInitializer;
