import { getTranslations } from 'next-intl/server';
import BaseCard from '@/components/common/baseCard/baseCard';
import Text from '@/components/common/text';
import { getPageStats } from './data';
import StatValue from './statValue';

// Always above the fold, so no RevealOnScroll — it would force an otherwise
// server-rendered block to hydrate for nothing. The server always renders the
// final strings (the indexed HTML must never show a "0"); StatValue only
// re-plays a count-up to that same string once its card scrolls into view.
export default async function StatsStrip() {
  const t = await getTranslations('buyCredits');
  const stats = getPageStats();

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <BaseCard
          key={stat.labelKey}
          className="h-[190px] justify-between gap-0 rounded-3xl border-0 bg-surface-lightest p-7 ring-1 ring-gray-200/60 lg:h-[220px] lg:p-8"
        >
          <Text
            as="div"
            weight="medium"
            className="text-5xl tracking-tight text-primary lg:text-6xl"
          >
            <StatValue value={stat.value} />
          </Text>
          <div className="text-base text-gray-800 lg:text-lg">
            {t(stat.labelKey)}
          </div>
        </BaseCard>
      ))}
    </div>
  );
}
