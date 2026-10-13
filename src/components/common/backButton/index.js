'use client';

import { useRouter } from '@/i18n/navigation';
import Button from '../button/button';
import { appPaths } from '@/constants';

function BackButton({ className, children, variant }) {
  const router = useRouter();

  const handleback = () => {
    if (typeof window !== undefined && window.history?.length > 1) {
      router.back();
    } else {
      router.push(appPaths.home);
    }
  };

  return (
    <Button className={className} variant={variant} onClick={handleback}>
      {children}
    </Button>
  );
}

export default BackButton;
