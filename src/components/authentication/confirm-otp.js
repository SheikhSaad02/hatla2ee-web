'use client';

import { useEffect, useState } from 'react';

import { resendOtp } from '@/apis/resend-otp';
import { vaildateOtp } from '@/apis/validate-otp';
import { validateOtpForResetPassword } from '@/apis/validate-otp-for-password-reset';
import Button from '@/components/common/button/button';
import { OtpInput } from '@/components/common/input-otp/input-otp';
import { useRouter } from '@/i18n/navigation';
import { ResendIcon, SmsIcon } from '@/icons/basicSvgs';
import { WhatsappIcon } from '@/icons/socials';
import { showToast } from '@/utils/notification-service';
import { getLocaleString } from '@/utils/general';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useTranslations } from 'use-intl';
import { useUser } from '@/providers/user';
import { loginClickEvents } from '@/services/analyticsService/events';
import AuthbackButtonWithLogo from '../common/auth-back-button/auth-back-button-with-logo';
import AuthWrapper from './auth-wrapper';
import RequireAuth from './require-auth';
import { useRecaptcha } from '@/providers/recaptcha-provider';
import configs from '@/configs';

const RESEND_DELAY = 60;

const WHATSAPP_DELIVERY_CHANNEL = 'whatsapp';

const WHATSAPP_STATUS = {
  IDLE: 'idle',
  SENDING: 'sending',
  SENT: 'sent',
};

const ConfirmOtp = ({ isMobile }) => {
  const locale = useLocale();
  const { user } = useUser();
  const searchParams = useSearchParams();
  const { mobile, user_id } = Object.fromEntries(searchParams.entries());
  const for_password_update = searchParams?.get('for_password_update');
  const [otp, setOtp] = useState('');

  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_DELAY);
  const [resendLoading, setResendLoading] = useState(false);
  const [hasResentOtp, setHasResentOtp] = useState(false);
  const [whatsappStatus, setWhatsappStatus] = useState(WHATSAPP_STATUS.IDLE);
  const router = useRouter();
  const t = useTranslations('common');
  const { getToken } = useRecaptcha();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    loginClickEvents.submit_otp(locale, user);
    const payload = { otp: otp, user_id: user_id };
    const response = for_password_update
      ? await validateOtpForResetPassword(payload)
      : await vaildateOtp(payload);
    if (response) {
      setLoading(false);
      if (response?.success) {
        loginClickEvents.otp_success(locale, user);
        if (for_password_update) {
          showToast('success', t('OTP Verified Successfully'));
          router.push(`/change-password?token=${response?.token}`);
        } else {
          router.push('/login?messageKey=otpSuccessForRegister&type=success');
        }
      } else {
        showToast('error', t('Failed to verify user'));
      }
    }
  };

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  useEffect(() => {
    if (resendTimer === 0 && whatsappStatus === WHATSAPP_STATUS.SENT) {
      setWhatsappStatus(WHATSAPP_STATUS.IDLE);
    }
  }, [resendTimer, whatsappStatus]);

  const handleResendOtp = async () => {
    setResendLoading(true);

    const token = await getToken();
    if (configs.isReCaptchaEnabled && !token) {
      showToast('error', t('Recaptcha verification failed'));
      setResendLoading(false);
      return;
    }
    const response = await resendOtp({ user_id: user_id }, token, locale);
    if (response) {
      setResendLoading(false);
      if (response?.success) {
        loginClickEvents.otp_request_resent(locale, user);
        showToast('success', t('OTP sent successfully'));
        setResendTimer(RESEND_DELAY);
        setHasResentOtp(true);
        setWhatsappStatus(WHATSAPP_STATUS.IDLE);
      } else {
        showToast(
          'error',
          getLocaleString(response?.error, 'message', locale) ||
            t('Failed to resend OTP'),
        );
      }
    }
  };

  const handleSendOtpOnWhatsapp = async () => {
    if (resendTimer > 0 || whatsappStatus === WHATSAPP_STATUS.SENDING) return;

    setWhatsappStatus(WHATSAPP_STATUS.SENDING);

    const token = await getToken();
    if (configs.isReCaptchaEnabled && !token) {
      showToast('error', t('Recaptcha verification failed'));
      setWhatsappStatus(WHATSAPP_STATUS.IDLE);
      return;
    }

    const response = await resendOtp(
      { user_id: user_id, delivery_channel: WHATSAPP_DELIVERY_CHANNEL },
      token,
      locale,
    );

    if (response?.success) {
      setWhatsappStatus(WHATSAPP_STATUS.SENT);
      setResendTimer(RESEND_DELAY);
    } else {
      setWhatsappStatus(WHATSAPP_STATUS.IDLE);
      showToast(
        'error',
        getLocaleString(response?.error, 'message', locale) ||
          t('whatsappOtpFailureMessage'),
      );
    }
  };

  const showResendChannels =
    configs?.ENABLE_WHATSAPP_OTP_FALLBACK && hasResentOtp;

  const isResendDisabled =
    resendTimer > 0 ||
    resendLoading ||
    whatsappStatus === WHATSAPP_STATUS.SENDING;

  return (
    <RequireAuth params={['mobile', 'user_id']}>
      <AuthWrapper isMobile={isMobile}>
        <div className="pb-4 md:pb-12 pt-12 md:pt-20 flex items-center justify-center md:px-4">
          <div className=" w-full max-w-lg">
            <div className="flex flex-col items-center justify-center mb-10">
              <AuthbackButtonWithLogo isMobile={isMobile} />
              <h2 className=" text-2xl md:text-[32px] font-bold text-center mb-1">
                {t('Enter Confirmation Code')}
              </h2>

              <span className="text-center">
                <span className="text-gray-light">
                  {t('Enter the 4-digit code we sent to')}
                </span>{' '}
                {`${mobile}`}
              </span>

              <OtpInput
                value={otp}
                onChange={setOtp}
                length={4}
                containerClassName="py-8"
              />

              {showResendChannels ? (
                <div className="w-full flex flex-col items-center gap-2 mb-4">
                  <div className="flex flex-col items-center gap-0.5">
                    {whatsappStatus === WHATSAPP_STATUS.SENT && (
                      <span className="text-gray-light text-base text-center">
                        {t('Code sent on WhatsApp to')}{' '}
                        <span dir="ltr">{mobile}</span>
                      </span>
                    )}

                    {resendTimer > 0 ? (
                      <span className="text-gray-400 text-base text-center">
                        {t(`Resend code after {resendTimer} seconds`, {
                          resendTimer,
                        })}
                      </span>
                    ) : (
                      <span className="text-gray-light text-base text-center">
                        {t("Still didn't get the code? Resend it by")}
                      </span>
                    )}
                  </div>

                  <div className="w-full flex items-center gap-2">
                    <Button
                      onClick={handleResendOtp}
                      className="flex-1 h-10 md:h-10 px-5 gap-2 rounded-[7px] text-base"
                      variant={'grayLight'}
                      disabled={isResendDisabled}
                      loading={resendLoading}
                      icon={<SmsIcon />}
                    >
                      {t('SMS')}
                    </Button>

                    <Button
                      onClick={handleSendOtpOnWhatsapp}
                      className="flex-1 h-10 md:h-10 px-5 gap-2 rounded-[7px] text-base"
                      variant={'grayLight'}
                      disabled={isResendDisabled}
                      loading={whatsappStatus === WHATSAPP_STATUS.SENDING}
                      icon={<WhatsappIcon className="w-4 h-4" />}
                    >
                      {t('WhatsApp')}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  {resendTimer > 0 ? (
                    <span className="text-gray-400 text-base ">
                      {t(`Resend code after {resendTimer} seconds`, {
                        resendTimer,
                      })}
                    </span>
                  ) : (
                    <Button
                      onClick={handleResendOtp}
                      className="border-none text-base flex items-center gap-1 hover:underline"
                      disabled={resendLoading}
                      variant={'link'}
                      loading={resendLoading}
                      icon={<ResendIcon className="w-4 h-4" color={'#3160a6'} />}
                    >
                      {t('Resend Code')}
                    </Button>
                  )}
                </div>
              )}

              <Button
                className="login-fields w-full"
                block
                disabled={otp?.length !== 4}
                onClick={handleSubmit}
                loading={loading}
              >
                {t('Submit OTP')}
              </Button>
            </div>
          </div>
        </div>
      </AuthWrapper>
    </RequireAuth>
  );
};
export default ConfirmOtp;
