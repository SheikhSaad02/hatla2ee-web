'use client';

import { Link as I18Link } from '@/i18n/navigation';
import Link from 'next/link';
import { setCookie, getCookie } from '@/utils/cookies';
import { COOKIE_NAMES } from '@/constants';

export default function NextLink({
  href,
  children,
  className,
  localized = true,
  onClick,
  ...props
}) {
  const Comp = localized ? I18Link : Link;

  const handleClick = (e) => {
    // Call existing onClick if provided
    if (onClick) {
      onClick(e);
    }

    // // Set cookie if feature is enabled from cookie
    const enableSuspenseToggle =
      getCookie(COOKIE_NAMES.ENABLE_SUSPENSE_TOGGLE) === 'true';
    if (enableSuspenseToggle) {
      setCookie(COOKIE_NAMES.SUSPENSE_NAVIGATION, 'true');
    }
  };

  return (
    <Comp
      href={href}
      className={className}
      onClick={handleClick}
      {...props}
      prefetch={false}
    >
      {children}
    </Comp>
  );
}
