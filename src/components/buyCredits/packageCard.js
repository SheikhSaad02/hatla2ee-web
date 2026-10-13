'use client';

import { useLocale, useTranslations } from 'next-intl';
import NextImage from '@/components/common/nextImage';
import { Badge } from '@/components/ui/badge';
import { getAsset, getLocaleString } from '@/utils/general';
import { formatNumberValue } from '@/utils/numbers';
import { cn } from '@/utils';
import ChoosePackageButton from './choosePackageButton';
import { getPackageCardTheme } from './packageCardTheme';
import { Check } from 'lucide-react';
import Text from '@/components/common/text';

export default function PackageCard({ pkg, dark = false }) {
  const t = useTranslations('buyCredits');
  const locale = useLocale();
  const theme = getPackageCardTheme(dark);
  const name = getLocaleString(pkg, 'name', locale) || pkg.slug;
  const taglineKey = `packages.${pkg.slug}Tagline`;
  const tagline = t.has(taglineKey) ? t(taglineKey) : null;
  const rowClass = cn(
    'flex items-start gap-2.5 text-sm',
    dark ? 'text-white/75' : 'text-gray-700',
  );

  return (
    <div
      className={cn(
        'flex h-full flex-col rounded-3xl p-3 transition-colors duration-500',
        pkg.recommended ? theme.cardRec : theme.card,
      )}
    >
      <div
        className={cn(
          'rounded-2xl p-7 transition-colors duration-500',
          pkg.recommended ? theme.headerTintRec : theme.headerTint,
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <Text
              as="h3"
              className={cn(
                'text-2xl font-semibold tracking-tight',
                theme.title,
              )}
            >
              {name}
            </Text>
            {tagline && (
              <Text as="p" className={cn('mt-1 text-sm', theme.body)}>
                {tagline}
              </Text>
            )}
          </div>
          {pkg.icon && (
            <NextImage
              src={getAsset(pkg.icon)}
              alt=""
              width={48}
              height={48}
              className="size-12 shrink-0"
            />
          )}
        </div>

        <div className="mt-6">
          <div
            className={cn(
              'text-xl font-semibold line-through decoration-2',
              theme.strike,
            )}
          >
            {t('packages.egp')} {formatNumberValue(pkg.total)}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <span
              className={cn(
                'text-[44px] font-semibold leading-none tracking-tight',
                theme.title,
              )}
            >
              {t('packages.egp')} {formatNumberValue(pkg.price)}
            </span>
            <Badge
              variant="secondary"
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm font-semibold',
                pkg.recommended
                  ? 'bg-emerald-500 text-white'
                  : dark
                    ? 'bg-emerald-400/15 text-emerald-200 ring-1 ring-inset ring-emerald-400/40'
                    : 'bg-emerald-100 text-emerald-700',
              )}
            >
              {t('packages.savedBadge', { percent: pkg.discount })}
            </Badge>
          </div>
          <div className="mt-4 flex items-start gap-2.5">
            <NextImage
              src={getAsset('/assets/buy-credits/credits-coin.webp')}
              alt=""
              width={40}
              height={40}
              className="size-10 shrink-0 object-contain"
            />
            <div>
              <Text as="p" className={cn('text-sm font-semibold', theme.title)}>
                {t('packages.creditsAmount', {
                  total: formatNumberValue(pkg.credits),
                })}
              </Text>
              <Text as="p" className={cn('mt-0.5 text-[13px]', theme.body)}>
                {t('packages.ratePerCredit', { rate: pkg.ratePerCredit })}
              </Text>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-6">
        <ul className="space-y-2.5">
          {pkg.options.map((option) => (
            <li key={option.key} className={rowClass}>
              <Check
                className={cn('mt-0.5 size-4 shrink-0', theme.check)}
                strokeWidth={3}
              />
              <span>
                <strong className="font-semibold">
                  {getLocaleString(option, 'value', locale)}
                </strong>{' '}
                {getLocaleString(option, 'name', locale)}
              </span>
            </li>
          ))}
          {pkg.validityDays && (
            <li className={rowClass}>
              <Check
                className={cn('mt-0.5 size-4 shrink-0', theme.check)}
                strokeWidth={3}
              />
              <span>{t('packages.validity', { days: pkg.validityDays })}</span>
            </li>
          )}
        </ul>
        <div className="mt-auto pt-8">
          <ChoosePackageButton
            pkg={pkg}
            name={name}
            className={cn(
              'h-auto w-full cursor-pointer rounded-xl py-3.5 text-base font-semibold transition-colors md:h-auto',
              pkg.recommended ? theme.brand : theme.ghost,
            )}
          />
        </div>
      </div>
    </div>
  );
}
