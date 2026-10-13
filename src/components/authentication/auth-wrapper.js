'use client';

import { LocaleSwitcher } from '../common/LocaleSwitcher';
import { ChevronLeftIcon, X } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import BackButton from '../common/backButton';

const AuthWrapper = ({ children, isMobile }) => {
  const router = useRouter();
  const locale = useLocale();

  const renderBackButton = () => {
    return (
      <div
        className={`fixed top-4 ${locale == 'en' ? 'left-4' : 'right-4'} z-50`}
      >
        <BackButton variant="tertiary" className="h-6.5 w-6.5">
          <ChevronLeftIcon />
        </BackButton>
      </div>
    );
  };
  return (
    <div className="min-h-screen flex items-center justify-center md:px-4">
      {isMobile && renderBackButton()}
      <div
        className={`fixed top-4 ${locale == 'en' ? 'right-4' : 'left-4'} z-50`}
      >
        <div className="flex items-center gap-2">
          <LocaleSwitcher
            className={'!bg-blue-50 text-gray-800 h-6.5 pb-1 rtl:pb-0'}
          />

          <button
            onClick={() => router.push('/')}
            aria-label="Close"
            className="closeBtn cursor-pointer relative"
          >
            <X className="h-4 w-4 text-gray-700" />
          </button>
        </div>
      </div>

      {children}
    </div>
  );
};
export default AuthWrapper;
