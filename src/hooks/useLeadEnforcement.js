'use client';

import { useCallback } from 'react';
import configs from '@/configs';
import { LEAD_ENFORCEMENT } from '@/constants';
import { useUser } from '@/providers/user';
import { isLoggedIn } from '@/utils/general';

const getLeadCount = () => {
  if (typeof window === 'undefined') return 0;
  const count = parseInt(
    localStorage.getItem(LEAD_ENFORCEMENT.STORAGE_KEY),
    10,
  );
  return Number.isNaN(count) || count < 0 ? 0 : count;
};

const incrementLeadCount = () => {
  if (typeof window === 'undefined') return 0;
  const nextCount = getLeadCount() + 1;
  localStorage.setItem(LEAD_ENFORCEMENT.STORAGE_KEY, String(nextCount));
  return nextCount;
};

const isEnforcementActive = (shouldEnforce) =>
  shouldEnforce && configs.ENABLE_LEAD_LOGIN_ENFORCEMENT;

export const useLeadEnforcement = () => {
  const { user, showLoginModal } = useUser();

  const enforceLeadLogin = useCallback(
    (onAllowed, shouldEnforce = false) => {
      if (!isEnforcementActive(shouldEnforce) || isLoggedIn(user)) {
        onAllowed();
        return true;
      }

      if (getLeadCount() >= LEAD_ENFORCEMENT.LIMIT) {
        showLoginModal(true);
        return false;
      }

      incrementLeadCount();
      onAllowed();
      return true;
    },
    [user, showLoginModal],
  );

  return { enforceLeadLogin };
};
