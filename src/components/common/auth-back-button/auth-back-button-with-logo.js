import { ChevronLeftIcon } from 'lucide-react';
import BackButton from '../backButton';
import Logo from '@/components/authentication/logo';
import { usePathname } from '@/i18n/navigation';
import { AUTH_ROUTES } from '@/constants';

const AuthbackButtonWithLogo = ({ isMobile }) => {
  const pathname = usePathname();
  const isValidRoute = AUTH_ROUTES.some((route) => pathname?.includes(route));
  return (
    <div className="relative flex items-center justify-center w-full px-4">
      {!isMobile && isValidRoute && (
        <div className="absolute left-4">
          <BackButton variant="tertiary" className="h-8 w-8">
            <ChevronLeftIcon />
          </BackButton>
        </div>
      )}
      <Logo />
    </div>
  );
};
export default AuthbackButtonWithLogo;
