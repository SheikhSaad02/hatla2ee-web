'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Button from '@/components/common/button/button';
import NextImage from '@/components/common/nextImage';
import Price from '@/components/common/price/price';
import Text from '@/components/common/text';
import { appLinks } from '@/constants';
import { useUser } from '@/providers/user';
import { continueInAppEvents } from '@/services/analyticsService/events';
import { cn } from '@/utils';
import { getAsset, openAppOrStore } from '@/utils/general';
import { IconLockFill } from '@/icons/basicSvgs';
import { ArrowDown, ArrowUp } from 'lucide-react';

const PRICE_TRENDS_CAMPAIGN = 'price_trends';
const DURATION_TABS = [
  { id: '6M', label: '6M' },
  { id: '1Yr', label: '1Yr' },
];
// Static teaser values, actual trends are only available in the app
const TEASER_MIN_PRICE = 302000;
const TEASER_MAX_PRICE = 802000;

const PriceTrends = ({ title }) => {
  const t = useTranslations('common');
  const locale = useLocale();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState(DURATION_TABS[0].id);
  const { AppleStore, GooglePlay } = appLinks('mweb', PRICE_TRENDS_CAMPAIGN);

  const onUnlock = () => {
    continueInAppEvents.click(locale, user);
    openAppOrStore({
      appleStoreLink: AppleStore,
      googlePlayLink: GooglePlay,
    });
  };

  const renderTeaserPrice = (label, value, icon) => (
    <div className="flex flex-col gap-1 flex-1">
      <div className="flex items-center gap-1 text-gray-600">
        {icon}
        <Text className="text-xs">{label}</Text>
      </div>
      <Price
        className="text-sm blur-[1.5px] select-none"
        valueClassName="font-medium text-gray-600"
        currencyClassName="font-medium text-gray-600"
        value={value}
      />
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="sectionHeading mb-0">{title}</h2>
        <div className="flex items-center gap-1 rounded-lg bg-[#EDF4FF] p-1">
          {DURATION_TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-semibold text-gray-600',
                activeTab === id && 'bg-primary text-white',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-4 rounded-xl border border-[#F0F0F0] bg-white p-4 shadow-[0px_4px_12px_rgba(15,15,15,0.04)]">
        {renderTeaserPrice(
          t('Min Price'),
          TEASER_MIN_PRICE,
          <ArrowDown className="size-4 shrink-0 text-primary" aria-hidden />,
        )}
        <span className="w-px self-stretch bg-[#F0F0F0]" aria-hidden />
        {renderTeaserPrice(
          t('Max Price'),
          TEASER_MAX_PRICE,
          <ArrowUp className="size-4 shrink-0 text-primary" aria-hidden />,
        )}
      </div>

      <div className="relative">
        <NextImage
          src={getAsset('/assets/priceTrendsGraph.webp')}
          alt={title}
          width={343}
          height={280}
          className="w-full object-contain"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-9.5 min-w-[209px] items-center overflow-hidden rounded-lg shadow-[0px_2px_14px_rgba(0,0,0,0.16)]">
            <span className="flex h-full w-9.5 shrink-0 items-center justify-center bg-white">
              <IconLockFill className="text-primary" aria-hidden />
            </span>
            <Button
              variant="default"
              onClick={onUnlock}
              className="h-full flex-1 rounded-none px-4 text-[13px] whitespace-nowrap text-white"
            >
              {t('Download the App to Unlock')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceTrends;
