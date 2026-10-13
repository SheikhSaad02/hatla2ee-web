import ChangePassword from '@/components/authentication/change-password';
import { isMobileServer } from '@/utils/serverFunctions';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'login' });
  return {
    title: `${t('Change Password')} : ${t('Hatla2ee')}`,
  };
}

export default async function ChangePasswordPage() {
  const isMobile = await isMobileServer();
  return <ChangePassword isMobile={isMobile} />;
}
