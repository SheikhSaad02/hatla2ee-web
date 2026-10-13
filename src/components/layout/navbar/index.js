'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';

import AnimatedNavigation from './animatedNavigation';
import Button from '@/components/common/button/button';
import Container from '../container';
import { LocaleSwitcher } from '@/components/common/LocaleSwitcher';
import NextImage from '@/components/common/nextImage';
import NextLink from '@/components/common/nextLink';
import { Plus } from 'lucide-react';
import { UserDropdown } from '../userDropDown';
import { cn } from '@/utils';
import { getAsset, getLocalizedPathname } from '@/utils/general';
import { appPaths, landingPagesPaths } from '@/constants';
import { usePageType } from '@/hooks/usePageType';
import { useSearchBarAnimation } from '@/hooks/useSearchBarAnimation';
import { useUser } from '@/providers/user';
import { homeClickEvents } from '@/services/analyticsService/events';
import { PAGE_SECTIONS } from '@/services/analyticsService/constants';

export default function Navbar({ isMobile }) {
  const pageType = usePageType('home');
  const t = useTranslations('layout');
  const { showSearchBar } = useSearchBarAnimation();
  const locale = useLocale();
  const { user } = useUser();
  const pathname = usePathname();
  const isLanding = landingPagesPaths.includes(pathname);

  const styles = navbarVariants.secondary;

  return (
    <header
      className={cn(
        'w-full z-30 bg-white shadow-[0_2px_6px_rgba(0,0,0,0.12)]',
        isLanding ? 'relative' : 'sticky top-0',
      )}
    >
      <Container
        className={cn(
          'flex items-center gap-6 max-lg:px-4 xl:rtl:gap-6 xl:gap-12',
          showSearchBar ? 'py-[10px]' : 'py-4',
          styles.wrapper,
        )}
        style={{ width: isMobile && '100%' }}
      >
        <NextLink
          href={getLocalizedPathname('/', locale, false)}
          className="flex items-center space-x-2 flex-shrink-0"
          localized={false}
        >
          <NextImage
            src={styles.logo}
            alt={t('Hatla2ee')}
            title={t('Hatla2ee')}
            width={90}
            height={26}
            className="h-[27px] lg:h-[30px] w-auto lg:max-w-[84px]"
            priority
            fetchPriority={'high'}
          />
        </NextLink>
        {!isMobile && (
          <AnimatedNavigation
            isLightVariant={false}
            showSearchBar={showSearchBar}
            user={user}
          />
        )}
        <div
          className={cn(
            'ms-auto flex items-center gap-2 xl:gap-4',
            showSearchBar && 'w-full justify-end',
          )}
        >
          <LocaleSwitcher className="!bg-primary-50 text-gray-800" />

          {!isMobile && (
            <Button
              variant="secondary"
              className="items-center gap-1 cursor-pointer font-bold"
              href={appPaths.postListing}
              size="sm"
              prefetch={false}
              onClick={() =>
                homeClickEvents['click_sell_car']?.(
                  locale,
                  user,
                  pageType || 'home',
                  PAGE_SECTIONS.HEADER,
                )
              }
            >
              <Plus />
              {t('Sell My Car')}
            </Button>
          )}

          {!isMobile && <UserDropdown isLightVariant={false} />}
        </div>
      </Container>
    </header>
  );
}

const navbarVariants = {
  secondary: {
    wrapper: 'bg-white text-black',
    logo: getAsset('/assets/logo-light-new.svg'),
    chevron: 'text-black',
    hover: 'hover:bg-slate-100',
  },
};
