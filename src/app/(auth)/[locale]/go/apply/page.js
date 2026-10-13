import UserSignUp from '@/components/authentication/sign-up';
import RequireLogin from '@/components/authentication/require-login';
import { RecaptchaProvider } from '@/providers/recaptcha-provider';
import { isMobileServer } from '@/utils/serverFunctions';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'login' });
  return {
    title: `${t('Sign Up')} : ${t('Hatla2ee')}`,
  };
}

const SignUpPage = async () => {
  const isMobile = await isMobileServer();

  return (
    <RequireLogin>
      <RecaptchaProvider eager>
        <UserSignUp isMobile={isMobile} />
      </RecaptchaProvider>
    </RequireLogin>
  );
};
export default SignUpPage;
