'use client';
import { usePathname } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { LocaleSwitcher } from '@/components/common/LocaleSwitcher';
import NextImage from '@/components/common/nextImage';
import NextLink from '@/components/common/nextLink';
import { landingPagesPaths } from '@/constants';
import { cn } from '@/utils';
import { getAsset, getLocalizedPathname } from '@/utils/general';
import Container from '../container';

export default function MobileNavbar({}) {
  const pathname = usePathname();
  const isLanding = landingPagesPaths.includes(pathname);
  const t = useTranslations('layout');
  const locale = useLocale();

  const shouldUseWhiteVariant = !isLanding;
  const styles = shouldUseWhiteVariant
    ? navbarVariants.secondary
    : navbarVariants.primary;

  return (
    <header
      className={cn(
        'w-full z-30 relative top-0',
        shouldUseWhiteVariant
          ? 'bg-white shadow-[0_2px_6px_rgba(0,0,0,0.12)]'
          : 'bg-transparent',
        !isLanding && 'hidden',
      )}
    >
      <Container
        className={cn(
          'flex items-center gap-6 max-lg:px-4 xl:rtl:gap-6 xl:gap-12',
          'py-4',
          styles.wrapper,
        )}
        style={{ width: '100%' }}
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
        <div className={cn('ms-auto flex items-center gap-2 xl:gap-4')}>
          <LocaleSwitcher
            className={shouldUseWhiteVariant && '!bg-primary-50 text-gray-800'}
          />
        </div>
      </Container>
    </header>
  );
}

const navbarVariants = {
  primary: {
    wrapper: 'text-white',
    logo: getAsset('/assets/logo-dark-new.svg'),
    chevron: 'text-white',
    hover: 'hover:bg-slate-50/50',
  },
  secondary: {
    wrapper: 'bg-white text-black',
    logo: getAsset('/assets/logo-light-new.svg'),
    chevron: 'text-black',
    hover: 'hover:bg-slate-100',
  },
};
