import ResetPassword from '@/components/authentication/reset-password';
import { RecaptchaProvider } from '@/providers/recaptcha-provider';
import { isMobileServer } from '@/utils/serverFunctions';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'login' });
  return {
    title: `${t('Reset Password')} : ${t('Hatla2ee')}`,
  };
}

const ResetPasswordPage = async () => {
  const isMobile = await isMobileServer();
  return (
    <RecaptchaProvider eager>
      <ResetPassword isMobile={isMobile} />
    </RecaptchaProvider>
  );
};
export default ResetPasswordPage;
