'use client';

import { ChevronLeftIcon, Eye, EyeOff } from 'lucide-react';
import { Link, useRouter } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';

import Alert from '../common/alert/alert';
import AuthWrapper from './auth-wrapper';
import Button from '../common/button/button';
import { IconInfo } from '@/icons';
import Input from '../common/input/input';
import Logo from './logo';
import NextImage from '../common/nextImage';
import RequireAuth from './require-auth';
import { changePassword } from '@/apis/change-password';
import { getLocaleString } from '@/utils/general';
import { showToast } from '@/utils/notification-service';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useUser } from '@/providers/user';
import { loginClickEvents } from '@/services/analyticsService/events';
import BackButton from '../common/backButton';
import AuthbackButtonWithLogo from '../common/auth-back-button/auth-back-button-with-logo';

const ChangePassword = ({ isMobile }) => {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');
  const locale = useLocale();
  const { user } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations('common');

  const clearError = () => {
    setError(null);
  };
  const handleChangePassword = async (e) => {
    e?.preventDefault();
    if (!password || !confirmPassword) {
      setError(t('Please enter the password'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('Your passwords dont match'));
      return;
    }
    const payload = {
      token: token,
      password: password,
      password_confirmation: confirmPassword,
    };
    setLoading(true);
    const response = await changePassword(payload, locale);
    if (response) {
      setLoading(false);
      if (response?.success) {
        loginClickEvents.set_new_password(locale, user);
        router.push('/login?messageKey=changePassword&type=success');
      } else {
        showToast('error', getLocaleString(response?.error, 'message', locale));
      }
    }
  };

  return (
    <RequireAuth params={['token']}>
      <AuthWrapper isMobile={isMobile}>
        <div className="pb-4 md:pb-12 pt-12 md:pt-20 flex items-center justify-center md:px-4">
          <div className=" w-full max-w-lg">
            <div className="flex flex-col items-center justify-center mb-10">
              <AuthbackButtonWithLogo isMobile={isMobile} />
              <h2 className="text-2xl font-semibold text-center mb-0">
                {t('Choose a New Password')}
              </h2>
              <span className="text-center text-sm text-gray-light">
                {t('chooseNewPasswordDescription')}
              </span>
            </div>
            <Alert
              className="mb-8 flex justify-center align-middle gap-0 bg-gray-50 border-none"
              titleClassName="text-gray-light line-clamp-none"
              title={t(
                'This requires all devices to login with the new password',
              )}
              icon={<IconInfo color="#9d9d9d" />}
              variant={'default'}
            />
            <div className="w-full mb-6">
              <Input
                type={showPassword ? 'text' : 'password'}
                id="pass"
                name="pass"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError();
                }}
                placeholder={t('New Password')}
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
              />
            </div>

            <div className="w-full mb-6">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPass"
                name="confirmPass"
                className="login-fields "
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  clearError();
                }}
                placeholder={t('Confirm New Password')}
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
              />
            </div>
            {error && (
              <Alert
                className="mb-8 flex justify-center align-middle gap-0"
                title={error}
                icon={<IconInfo />}
              />
            )}
            <Button
              variant="default"
              className="login-fields md:!text-xl  w-full transition"
              block
              type="submit"
              onClick={handleChangePassword}
              loading={loading}
            >
              {t('Change Password')}
            </Button>
          </div>
        </div>
      </AuthWrapper>
    </RequireAuth>
  );
};
export default ChangePassword;
