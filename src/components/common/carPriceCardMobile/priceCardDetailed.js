import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import BaseCard from '../baseCard/baseCard';
import Button from '../button/button';
import NextImage from '../nextImage';
import Price from '../price/price';
import PriceRange from '../priceRange/priceRange';
import Text from '../text';
import TextWithIcon from '../textWithIcon/textWithIcon';
import { getAsset } from '@/utils/general';

export default function PriceCardDetailed({
  overview = {},
  deposit = 0,
  installment = 0,
  officialPrice = 0,
  marketPrice = {},
}) {
  const t = useTranslations('common');

  return (
    <BaseCard className="price-card">
      <TextWithIcon
        title={overview.title}
        description={overview.power}
        icon={
          <NextImage
            src={overview.img || getAsset('/assets/car-placeholder.svg')}
            alt={t('Image')}
            className="h-10 w-10 rounded-sm object-cover"
          />
        }
        className="bg-primary-50 p-3 rounded-sm"
      />

      <div className="flex flex-col p-2 gap-2">
        <div className="grid grid-cols-2 gap-2 flex-1">
          <div
          //  className="priceBlock"
          >
            <Text className="text-muted-foreground">{t('Official Price')}</Text>
            <Price
              value={officialPrice}
              style="uniform"
              className="font-semibold overflow-hidden"
            />
          </div>

          <div
          //  className="priceBlock"
          >
            <Text className="text-muted-foreground">{t('Market Price')}</Text>
            <PriceRange
              min={marketPrice.min}
              max={marketPrice.max}
              className="font-semibold overflow-hidden"
            />
          </div>

          <div
          //  className="priceBlock bg-white"
          >
            <Text className="text-muted-foreground font-normal">
              {t('Min Deposit')}
            </Text>
            <Price
              value={deposit}
              style="uniform"
              className="font-semibold overflow-hidden"
            />
          </div>

          <div
          //  className="priceBlock bg-white"
          >
            <Text className="text-muted-foreground font-normal">
              {t('Min installment')}
            </Text>
            <Price
              value={installment}
              style="uniform"
              className="font-semibold overflow-hidden"
            />
          </div>
        </div>

        <Button variant="tertiary" icon={<Plus />} iconPosition="right">
          Compare
        </Button>
      </div>
    </BaseCard>
  );
}
