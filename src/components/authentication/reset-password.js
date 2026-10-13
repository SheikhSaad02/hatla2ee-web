'use client';

import { useRouter } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';

import { verifyUserAccount } from '@/apis/verify-account';
import configs from '@/configs';
import { IconInfo } from '@/icons';
import { getLocaleString } from '@/utils/general';
import { showToast } from '@/utils/notification-service';
import { ChevronLeftIcon } from 'lucide-react';
import { useState } from 'react';
import Alert from '../common/alert/alert';
import BackButton from '../common/backButton';
import Button from '../common/button/button';
import Input from '../common/input/input';
import AuthWrapper from './auth-wrapper';
import Logo from './logo';
import AuthbackButtonWithLogo from '../common/auth-back-button/auth-back-button-with-logo';
import { loginClickEvents } from '@/services/analyticsService/events';
import { useRecaptcha } from '@/providers/recaptcha-provider';
import { useUser } from '@/providers/user';
const ResetPassword = ({ isMobile }) => {
  const t = useTranslations('common');
  const [error, setError] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const loginT = useTranslations('login');
  const signUpT = useTranslations('signUp');
  const locale = useLocale();
  const router = useRouter();
  const { getToken } = useRecaptcha();
  const { user } = useUser();

  const handleChange = (e) => {
    setInputValue(e?.target?.value);
    setError('');
  };
  const verifyAccount = async (e) => {
    e?.preventDefault();
    const isValidEmail = configs.isValidEmail(inputValue);
    const isValidMobile =
      configs?.ENABLE_MOBILE_SIGN_IN &&
      configs?.isValidMobileNumber(inputValue);
    if (!inputValue) {
      setError(t('Please enter an email or mobile number'));
      return;
    }
    if (!isValidEmail && !isValidMobile) {
      setError(
        configs?.ENABLE_MOBILE_SIGN_IN
          ? signUpT('Please enter a valid mobile number or email address')
          : signUpT('Please enter a valid email address'),
      );
      return;
    }

    loginClickEvents.verify_account(locale, user);

    setIsLoading(true);

    const token = await getToken();

    if (configs.isReCaptchaEnabled && !token) {
      setError(t('Recaptcha verification failed'));
      return;
    }

    const payload = isValidEmail
      ? { email: inputValue }
      : { mobile: inputValue };
    const response = await verifyUserAccount(payload, token, locale);
    if (response) {
      setIsLoading(false);
      if (response?.success) {
        loginClickEvents.otp_request_sent(locale, user);
        showToast('success', getLocaleString(response, 'message', locale));
        if (isValidMobile) {
          router.push(
            `/go/confirm-otp?mobile=${inputValue}&user_id=${response?.data?.user_id}&for_password_update=true`,
          );
        }
      } else {
        showToast('error', getLocaleString(response?.error, 'message', locale));
      }
    }
  };

  return (
    <AuthWrapper isMobile={isMobile}>
      <div className=" w-full max-w-lg">
        <div className="flex flex-col items-center justify-center mb-10">
          <AuthbackButtonWithLogo isMobile={isMobile} />
          <div className="text-center space-y-1">
            <h1 className="text-2xl md:text-[32px] font-bold">
              {t('Forgot Password')}
            </h1>
            <span className="text-sm text-gray-light">
              {t('forgotPasswordDescription')}
            </span>
          </div>
        </div>
        {error && (
          <Alert
            className="mb-4 md:mb-8  border-none flex justify-center align-middle gap-0"
            title={error}
            icon={<IconInfo />}
          />
        )}
        <div className="mb-4">
          <Input
            type="text"
            id="identifier"
            name="identifier"
            value={inputValue}
            onChange={handleChange}
            placeholder={
              configs?.ENABLE_MOBILE_SIGN_IN
                ? loginT('Enter your Email or Mobile number')
                : loginT('Enter your email')
            }
            required
            className="login-fields"
          />
        </div>
        <Button
          variant="default"
          className="login-fields md:!text-xl  w-full transition"
          block
          onClick={verifyAccount}
          loading={isLoading}
        >
          {t('Verify Account')}
        </Button>
      </div>
    </AuthWrapper>
  );
};
export default ResetPassword;
