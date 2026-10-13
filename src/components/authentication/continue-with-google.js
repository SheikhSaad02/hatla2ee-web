'use client';

import { useGoogleLogin } from '@react-oauth/google';
import { useLocale, useTranslations } from 'next-intl';
import Button from '@/components/common/button/button';
import { GoogleIcon } from '@/icons';
import { Separator } from '@/components/ui/separator';
import configs from '@/configs';
import { googleLogin } from '@/apis/google-login';
import { getLocaleString } from '@/utils/general';
import { showToast } from '@/utils/notification-service';
import { useUser } from '@/providers/user';
import { LOGIN_MODES, PAGE_TYPES } from '@/services/analyticsService/constants';
import { loginClickEvents } from '@/services/analyticsService/events';

export default function ContinueWithGoogle({
  analyticsPageType = PAGE_TYPES.LOGIN,
  onFlowComplete,
  isLeadEnforcement = false,
}) {
  const t = useTranslations('login');
  const locale = useLocale();
  const { user, setUser } = useUser();

  const enabled = !!configs.ENABLE_GOOGLE_SIGN_IN;
  const auth = analyticsPageType === PAGE_TYPES.SIGNUP ? 'signup' : 'login';

  const handleGoogleLogin = async (tokenResponse) => {
    const requestPayload = { access_token: tokenResponse?.access_token };
    const response = await googleLogin(requestPayload);
    if (!response) {
      return;
    }

    if (response?.data?.user) {
      const payloadUser = response?.data?.user;
      setUser(payloadUser);
      loginClickEvents[
        isLeadEnforcement
          ? 'login_enforcement_successful'
          : `${auth}_successful`
      ](locale, payloadUser, LOGIN_MODES.GOOGLE);
      onFlowComplete?.();
    } else {
      showToast('error', getLocaleString(response?.error, 'message', locale));
      loginClickEvents[`${auth}_failed`](locale, user);
      onFlowComplete?.();
    }
  };

  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      await handleGoogleLogin(tokenResponse);
    },
    onError: (errorResponse) => {
      console.error('Google login error:', errorResponse);
      showToast('error', t('Google login failed'));
      loginClickEvents[`${auth}_failed`](locale, user);
    },
  });

  if (!enabled) {
    return null;
  }

  return (
    <>
      <div className="flex items-center w-full py-4 md:py-6">
        <Separator className="shrink bg-surface-muted" />
        <span className="mx-4 text-sm text-gray-light">{t('OR')}</span>{' '}
        <Separator className="shrink bg-surface-muted" />
      </div>

      <Button
        onClick={() => {
          loginClickEvents[
            isLeadEnforcement
              ? 'login_enforcement_attempt'
              : 'sso_login_attempt'
          ](
            locale,
            user,
            ...(isLeadEnforcement ? [LOGIN_MODES.GOOGLE] : [analyticsPageType]),
          );
          triggerGoogleLogin();
        }}
        className={
          'flex items-center justify-center w-full h-11 md:h-12  px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-white transition'
        }
        icon={<GoogleIcon />}
        block={'true'}
        type="button"
      >
        {t('Continue with Google')}
      </Button>
    </>
  );
}
