'use client';

import { ChevronLeftIcon, Eye, EyeOff } from 'lucide-react';
import { Link, useRouter } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';

import Alert from '../common/alert/alert';
import AuthWrapper from '@/components/authentication/auth-wrapper';
import Button from '@/components/common/button/button';
import ContinueWithGoogle from '@/components/authentication/continue-with-google';
import EmailSuccessIllustration from './email-success-illustration';
import { IconInfo } from '@/icons';
import Input from '@/components/common/input/input';
import Label from '../common/label';
import Logo from './logo';
import NextImage from '@/components/common/nextImage';
import NextLink from '@/components/common/nextLink';
import { cn } from '@/utils';
import configs from '@/configs';
import { getLocaleString } from '@/utils/general';
import { signUp } from '@/apis/sign-up';
import { useState, useEffect } from 'react';
import BackButton from '../common/backButton';
import AuthbackButtonWithLogo from '../common/auth-back-button/auth-back-button-with-logo';
import { appPaths } from '@/constants';
import { useRecaptcha } from '@/providers/recaptcha-provider';
import { loginClickEvents } from '@/services/analyticsService/events';
import { LOGIN_MODES, PAGE_TYPES } from '@/services/analyticsService/constants';
import { useUser } from '@/providers/user';
import GoogleProvider from '@/providers/google-auth';

const UserSignUpForm = ({ isMobile }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailSuccessIllustration, showEmailSuccessIllustration] =
    useState(false);
  const router = useRouter();
  const t = useTranslations('signUp');
  const locale = useLocale();
  const { getToken } = useRecaptcha();
  const { user } = useUser();
  useEffect(() => {
    loginClickEvents.click_signup(locale, user);
  }, []);
  const clearError = () => {
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const isValidMobile =
      configs?.ENABLE_MOBILE_SIGN_IN &&
      configs?.isValidMobileNumber(identifier);
    const isEmail = configs.isValidEmail(identifier);

    if (!isValidMobile && !isEmail) {
      setError(
        configs?.ENABLE_MOBILE_SIGN_IN
          ? t('Please enter a valid mobile number or email address')
          : t('Please enter a valid email address'),
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(t('Passwords do not match'));
      return;
    }

    const token = await getToken();

    if (configs.isReCaptchaEnabled && !token) {
      setError(t('Recaptcha verification failed'));
      return;
    }

    loginClickEvents.signup_attempt(locale, user);

    const payload = {
      ...(isEmail ? { email: identifier } : { mobile: identifier }),
      pass: password,
    };

    setLoading(true);
    const response = await signUp(payload, token, locale);
    if (response) {
      setLoading(false);
      if (response?.user) {
        loginClickEvents.signup_successful(locale, user, LOGIN_MODES.EMAIL);
        if (isValidMobile) {
          router.push(
            `/go/confirm-otp?mobile=${identifier}&user_id=${response?.user?.id}`,
          );
        } else {
          showEmailSuccessIllustration(true);
        }
      } else if (response?.error) {
        loginClickEvents.signup_failed(locale, user);
        setError(getLocaleString(response?.error, 'message', locale));
      }
    }
  };

  return (
    <AuthWrapper isMobile={isMobile}>
      {emailSuccessIllustration ? (
        <EmailSuccessIllustration />
      ) : (
        <div className=" w-full max-w-lg">
          <div className="flex flex-col items-center justify-center mb-10">
            <AuthbackButtonWithLogo isMobile={isMobile} />
            <h2 className=" text-2xl md:text-[32px] font-bold text-center mb-0">
              {t('Start Your Car Journey Today')}
            </h2>

            <span className="text-center text-sm text-gray-light">
              {t('Register to browse, list and connect on Hatla2ee')}
            </span>
          </div>

          {error && (
            <Alert
              className="mb-4 md:mb-8 border-none flex justify-center align-middle gap-0"
              title={error}
              icon={<IconInfo className="shrink-0" />}
            />
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label className={cn('inline-block mb-2  text-sm md:text-base')}>
                {configs?.ENABLE_MOBILE_SIGN_IN
                  ? t('Mobile Number or Email')
                  : t('Email')}
              </Label>
              <Input
                name="identifier"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  clearError();
                }}
                placeholder={
                  configs?.ENABLE_MOBILE_SIGN_IN
                    ? t('Enter your mobile number or email')
                    : t('Enter your email')
                }
                required
                className="login-fields "
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
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError();
                }}
                placeholder={t('Enter New Password')}
                required
                className="login-fields "
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
                //className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="w-full mb-6">
              <Label className={cn('inline-block mb-2  text-sm md:text-base')}>
                {t('Confirm Password')}
              </Label>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPass"
                name="confirmPass"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  clearError();
                }}
                placeholder={t('Confirm Password')}
                required
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="focus:outline-none cursor-pointer"
                  >
                    {!showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-light transition-transform" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-light transition-transform" />
                    )}
                  </button>
                }
                className="login-fields "
              />
            </div>

            <Button
              variant="default"
              className="login-fields md:!text-xl  w-full transition mb-3"
              block
              type="submit"
              loading={loading}
            >
              {t('Register')}
            </Button>
            <div className="flex flex-col items-center justify-center ">
              <span className="text-sm text-gray-light text-center">
                {t(
                  'By clicking Register you acknowledge that you read, and agree to our',
                )}
              </span>
              <div className="flex flex-row items-center justify-center space-x-1 ">
                <NextLink
                  className={'text-sm  text-primary-800'}
                  href={'/general-condition'}
                  title={t('Terms & conditions')}
                >
                  {t('Terms & conditions')}
                </NextLink>
                <span className="text-gray-light">{t('and')}</span>
                <NextLink
                  className={'text-sm  text-primary-800'}
                  href={'/privacy'}
                  title={t('Privacy Policy')}
                >
                  {t('Privacy Policy')}
                </NextLink>
              </div>
            </div>

            <ContinueWithGoogle analyticsPageType={PAGE_TYPES.SIGNUP} />
            <div className="flex flex-row items-center justify-center space-x-1 mt-3">
              <span className="text-gray-dim text-sm font-medium">
                {t('Already have an account')}
              </span>
              <NextLink
                className={'text-sm font-semibold text-primary-800'}
                href={'/login'}
                title={t('Login')}
              >
                {t('Login')}
              </NextLink>
            </div>
          </form>
        </div>
      )}
    </AuthWrapper>
  );
};

const UserSignUp = (props) => {
  return (
    <GoogleProvider>
      <UserSignUpForm {...props} />
    </GoogleProvider>
  );
};

export default UserSignUp;
