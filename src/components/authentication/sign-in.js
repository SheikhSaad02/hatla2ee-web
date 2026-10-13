'use client';

import { ChevronLeftIcon, Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';

import Alert from '../common/alert/alert';
import { BASE_URL } from '@/constants';
import Button from '@/components/common/button/button';
import ContinueWithGoogle from '@/components/authentication/continue-with-google';
import { IconInfo } from '@/icons';
import Input from '@/components/common/input/input';
import Label from '../common/label';
import Logo from './logo';
import NextLink from '@/components/common/nextLink';
import { cn } from '@/utils';
import configs from '@/configs';
import { getLocaleString } from '@/utils/general';
import { signIn } from '@/apis/login';
import { useDisplayNotifications } from '@/hooks/useDisplayNotification';
import { useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'use-intl';
import { useUser } from '@/providers/user';
import {
  LOGIN_MODES,
  PAGE_TYPES,
  WEBSITE_SECTIONS,
} from '@/services/analyticsService/constants';
import { loginClickEvents } from '@/services/analyticsService/events';
import { fetchUserDetail } from '@/apis/user';
import AuthbackButtonWithLogo from '../common/auth-back-button/auth-back-button-with-logo';
import GoogleProvider from '@/providers/google-auth';

const UserSignInForm = ({
  setVisible = () => {},
  isMobile,
  isModal = false,
  isLeadEnforcement = false,
}) => {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [formValues, setFormValues] = useState({
    identifier: '',
    pass: '',
  });
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const redirectUrl = searchParams?.get('redirectUrl');

  const t = useTranslations('login');
  const [isLoading, setIsLoading] = useState(false);
  const locale = useLocale();
  useDisplayNotifications();

  useEffect(() => {
    loginClickEvents.login_open(
      locale,
      user,
      PAGE_TYPES.LOGIN,
      isModal ? WEBSITE_SECTIONS.HOME : WEBSITE_SECTIONS.LOGIN,
    );
  }, []);

  const handleLoginSuccessRedirect = () => {
    if (redirectUrl) {
      router.push(redirectUrl);
    } else {
      setVisible(false);
    }
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    const isValidEmail = configs?.isValidEmail(formValues?.identifier);
    const isValidMobileNumber =
      configs?.ENABLE_MOBILE_SIGN_IN &&
      configs?.isValidMobileNumber(formValues?.identifier);

    if (!isValidEmail && !isValidMobileNumber) {
      setError(
        configs?.ENABLE_MOBILE_SIGN_IN
          ? t('Invalid Email or Mobile Number')
          : t('Invalid Email'),
      );
      setIsLoading(false);
      return;
    }

    if (!formValues?.pass) {
      setError(t('Password is required'));
      setIsLoading(false);
      return;
    }

    const payload = {
      pass: formValues?.pass,
      ...(isValidEmail
        ? { email: formValues?.identifier }
        : { mobile: formValues?.identifier }),
    };
    loginClickEvents[
      isLeadEnforcement ? 'login_enforcement_attempt' : 'login_attempt'
    ](locale, user, LOGIN_MODES.EMAIL);
    const responseData = await signIn(payload, locale);

    if (responseData) {
      setIsLoading(false);
      if (responseData?.data?.user) {
        const userData = await fetchUserDetail();
        if (userData?.error) {
          setError(getLocaleString(userData?.error, 'message', locale));
          loginClickEvents.login_failed(locale, user);
        } else {
          setUser(userData);
          loginClickEvents[
            isLeadEnforcement
              ? 'login_enforcement_successful'
              : 'login_successful'
          ](locale, userData, LOGIN_MODES.EMAIL);
          handleLoginSuccessRedirect();
        }
      } else {
        setError(getLocaleString(responseData?.error, 'message', locale));
        loginClickEvents.login_failed(locale, user);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  return (
    <div className=" w-full max-w-lg">
      <div className="flex flex-col items-center justify-center mb-10">
        <AuthbackButtonWithLogo isMobile={isMobile} />
        <h2 className=" text-2xl md:text-[32px] font-bold text-center mb-0">
          {t('loginTitle')}
        </h2>

        <span className="text-center text-sm text-gray-light">
          {t('loginDescription', { country: configs.country[locale].label })}
        </span>
      </div>

      {error && (
        <Alert
          className="mb-4 md:mb-8  border-none flex justify-center align-middle gap-0"
          title={error}
          icon={<IconInfo />}
        />
      )}

      <form>
        <div className="mb-4">
          <Label className={cn('inline-block mb-2  text-sm md:text-base')}>
            {configs?.ENABLE_MOBILE_SIGN_IN
              ? t('Email or Mobile Number')
              : t('Email')}
          </Label>

          <Input
            type="text"
            id="identifier"
            name="identifier"
            value={formValues?.identifier}
            onChange={handleChange}
            placeholder={
              configs?.ENABLE_MOBILE_SIGN_IN
                ? t('Enter your Email or Mobile number')
                : t('Enter your email')
            }
            required
            errorMsg={error}
            className="login-fields"
          />
        </div>

        <div className="w-full mb-4  md:mb-6">
          <Label className={cn('inline-block mb-2  text-sm md:text-base')}>
            {t('Password')}
          </Label>

          <Input
            type={showPassword ? 'text' : 'password'}
            id="pass"
            name="pass"
            value={formValues?.pass}
            onChange={handleChange}
            placeholder={t('Enter Password')}
            required
            className="login-fields"
            suffix={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="focus:outline-none cursor-pointer"
              >
                {!showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-light transition-transform" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-light transition-transform" />
                )}
              </button>
            }
            errorMsg={error}
          />
          <div className="flex justify-end mt-2">
            <NextLink
              href="/reset-request"
              className="text-sm  text-primary-800 font-semibold hover:underline"
              onClick={() => {
                loginClickEvents.click_forgot_password(
                  locale,
                  user,
                  isModal ? PAGE_TYPES.LOGIN_MODAL : PAGE_TYPES.LOGIN,
                );
              }}
            >
              {t('forgotPassword')}
            </NextLink>
          </div>
        </div>

        <Button
          variant="default"
          className="login-fields md:!text-xl  w-full transition"
          block={'true'}
          loading={isLoading}
          onClick={handleSubmit}
        >
          {t('Login')}
        </Button>

        <ContinueWithGoogle
          analyticsPageType={PAGE_TYPES.LOGIN}
          onFlowComplete={handleLoginSuccessRedirect}
          isLeadEnforcement={isLeadEnforcement}
        />

        <div className="flex flex-row items-center justify-center space-x-1 mt-3">
          <span className="text-gray-600 text-sm font-medium">
            {t("Don't have an account")}
          </span>
          <NextLink
            className={'text-sm font-semibold text-primary-800'}
            href={'/go/apply'}
            title={'Register'}
            onClick={() => {
              if (isLeadEnforcement) {
                loginClickEvents.register_login_enforcement(locale, user);
              }
            }}
          >
            {t('Register Now')}
          </NextLink>
        </div>
      </form>
    </div>
  );
};

const UserSignIn = (props) => {
  return (
    <GoogleProvider>
      <UserSignInForm {...props} />
    </GoogleProvider>
  );
};
export default UserSignIn;
