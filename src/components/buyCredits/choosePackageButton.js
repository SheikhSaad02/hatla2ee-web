'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useUser } from '@/providers/user';
import { getUserPathToRedirect } from '@/utils/general';
import { appPaths } from '@/constants';
import { Button } from '@/components/ui/button';
import { buyCreditsEvents } from '@/services/analyticsService/events';
const PACKAGE_QUERY_PARAM = 'package';

export default function ChoosePackageButton({ pkg, name, className }) {
  const t = useTranslations('buyCredits');
  const locale = useLocale();
  const router = useRouter();
  const { user } = useUser();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);

  const handleClick = async () => {
    setPending(true);
    setError(false);
    try {
      buyCreditsEvents.choose_package(locale, user, pkg.slug);
      const params = new URLSearchParams({ [PACKAGE_QUERY_PARAM]: pkg.slug });
      const checkoutUrl = `${appPaths.checkout}?${params.toString()}`;
      const target = getUserPathToRedirect(checkoutUrl, user, locale);
      await router.push(target);
    } catch {
      setError(true);
      setPending(false);
    }
  };

  return (
    <div>
      <Button
        type="button"
        disabled={pending}
        onClick={handleClick}
        className={className}
      >
        {t('packages.cta', { package: name })}
      </Button>
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {t('packages.chooseError')}
        </p>
      )}
    </div>
  );
}
