'use client';
import { getPathname, usePathname } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/utils';
import { figtree, IBM_PLEX } from '@/utils/fonts';
import Button from '../button/button';
import { Globe } from 'lucide-react';

export function LocaleSwitcher({ className }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();

  const queryParams = Object.fromEntries(searchParams.entries());
  const targetLocale = locale === 'ar' ? 'en' : 'ar';
  const shouldRemoveLocalePrefix = pathname === '/' && targetLocale === 'ar';

  const toSwitchUrl = getPathname({
    locale: shouldRemoveLocalePrefix ? '' : targetLocale,
    href: {
      pathname: pathname,
      query: Object.keys(queryParams).length > 0 ? queryParams : undefined,
    },
  });
  const getSwitcherClass = () => {
    return locale == 'en' ? IBM_PLEX?.className : figtree?.className;
  };

  const handleClick = () => {
    if (typeof window !== 'undefined') {
      window.location.replace(toSwitchUrl);
    }
  };

  return (
    <Button
      size="sm"
      className={cn('ltr:pb-1.5', getSwitcherClass(), className)}
      onClick={handleClick}
      icon={<Globe className='ltr:mt-1' />}
    >
      {locale !== 'ar' ? 'عربي' : 'English'}
    </Button>
  );
}
