import { getLocaleString, getPriceLinks } from '@/utils/general';
import { useLocale, useTranslations } from 'next-intl';
import Button from '../common/button/button';

const PriceLinks = ({ isMobile }) => {
  const t = useTranslations('usedCarsListings');
  const locale = useLocale();
  return (
    <div className="flex flex-col gap-2 mt-2">
      {getPriceLinks(t)?.map((link) => (
        <Button
          size={'lg'}
          key={link.key}
          variant={'primaryLight'}
          href={link.link}
        >
          {getLocaleString(link, 'label', locale)}
        </Button>
      ))}
    </div>
  );
};
export default PriceLinks;
