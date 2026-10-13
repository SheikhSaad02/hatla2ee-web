import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import BaseCard from '../baseCard/baseCard';
import Button from '../button/button';
import Price from '../price/price';
import PriceRange from '../priceRange/priceRange';
import Text from '../text';

export default function PriceCardByModel({
  property = '',
  power = '',
  officialPrice = 0,
  marketPrice = {},
}) {
  const t = useTranslations('common');

  return (
    <BaseCard className="price-card">
      <div className="flex flex-col">
        <Text weight="semibold" className="text-sm text-primary">
          {property}
        </Text>

        <Text weight="regular" className="text-xs text-muted-foreground">
          {power}
        </Text>
      </div>

      <div className="grid grid-cols-2 gap-2 flex-1">
        <div 
        // className="priceBlock"
        >
          <Text className="text-muted-foreground">{t('Official Price')}</Text>
          <Price
            value={officialPrice}
            style="uniform"
            className="text-black font-semibold"
          />
        </div>
        <div 
        // className="priceBlock"
        >
          <Text className="text-muted-foreground">{t('Market Price')}</Text>
          <PriceRange
            min={marketPrice.min}
            max={marketPrice.max}
            className="text-black font-semibold"
          />
        </div>
      </div>

      <Button variant="tertiary" icon={<ChevronRight />} iconPosition="right">
        View
      </Button>
    </BaseCard>
  );
}
