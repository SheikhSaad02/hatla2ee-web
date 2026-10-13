import configs from '@/configs';
import DirectionProvider from '@/providers/direction';
import { UserProvider } from '@/providers/user';
import { FavoritesProvider } from '@/providers/favorites';
import { RecaptchaProvider } from '@/providers/recaptcha-provider';
import { getCookieValue } from '@/utils/serverFunctions';
import { NextIntlClientProvider } from 'next-intl';
import { Toaster } from '../ui/sonner';
import { getMessages } from 'next-intl/server';

export default async function CoreLayout({ locale, children }) {
  const userToken = await getCookieValue(configs?.authToken);
  const messages = await getMessages({ locale });
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <DirectionProvider>
        <UserProvider initialUser={userToken ? userToken : null}>
          <FavoritesProvider>
            <RecaptchaProvider>
              {children}
              <Toaster />
            </RecaptchaProvider>
          </FavoritesProvider>
        </UserProvider>
      </DirectionProvider>
    </NextIntlClientProvider>
  );
}
