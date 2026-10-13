import ConfirmOtp from '@/components/authentication/confirm-otp';
import { RecaptchaProvider } from '@/providers/recaptcha-provider';
import { isMobileServer } from '@/utils/serverFunctions';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'login' });
  return {
    title: `${t('Confirm OTP')} : ${t('Hatla2ee')}`,
  };
}

const OtpVerificationPage = async () => {
  const isMobile = await isMobileServer();
  return (
    <RecaptchaProvider eager>
      <ConfirmOtp isMobile={isMobile} />
    </RecaptchaProvider>
  );
};
export default OtpVerificationPage;
