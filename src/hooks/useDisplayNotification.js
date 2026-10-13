import { useCallback, useEffect, useRef } from 'react';

import { showToast } from '@/utils/notification-service';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function useDisplayNotifications() {
  const signUpT = useTranslations('signUp');
  const commonT = useTranslations('common');

  const notificationMessages = {
    accountSuccess: signUpT('Your account has been created successfully'),
    otpSuccessForRegister: commonT('User Registered Successfully'),
    changePassword: commonT('Your password has been successfully updated'),
  };

  const params = useSearchParams();
  const messageKey = params.get('messageKey');
  const type = params.get('type');
  const hasDisplayed = useRef(false);

  const displayNotification = useCallback(() => {
    if (
      messageKey &&
      notificationMessages[messageKey] &&
      !hasDisplayed.current
    ) {
      setTimeout(() => {
        showToast(type, notificationMessages[messageKey]);
      }, 500);

      hasDisplayed.current = true;
    }
  }, [messageKey, hasDisplayed]);

  const clearParams = useCallback(() => {
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        const url = new URL(window.location);
        url.searchParams.delete('messageKey');
        url.searchParams.delete('type');
        window.history.replaceState(
          window.history.state,
          '',
          url.pathname + url.search,
        );
      }
    }, 500);
  }, []);

  useEffect(() => {
    if (messageKey && !hasDisplayed.current) {
      displayNotification();
      clearParams();
    }
  }, [messageKey]);
}
