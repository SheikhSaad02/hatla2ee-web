import AuthWrapper from '@/components/authentication/auth-wrapper';
import PageLayout from '@/components/layout/pageLayout';
import UserSignIn from '@/components/authentication/sign-in';
import { isMobileServer } from '@/utils/serverFunctions';
import RequireLogin from '@/components/authentication/require-login';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'login' });
  return {
    title: `${t('Login')} : ${t('Hatla2ee')}`,
  };
}

export default async function SignIn() {
  const isMobile = await isMobileServer();

  return (
    <RequireLogin>
      <AuthWrapper isMobile={isMobile}>
        <UserSignIn isMobile={isMobile} />
      </AuthWrapper>
    </RequireLogin>
  );
}
