import { parentClasses } from '@/data/listings/used-cars/spriteMapping';
import { usePathname } from '@/i18n/navigation';
import { getLocaleString } from '@/utils/general';
import { useLocale } from 'next-intl';
import { MultilineCarousel } from '../common/carousel/multlineCarousel';
import NextLink from '../common/nextLink';
import OptionCard from '../common/optionCard/optionCard';
import { IMAGES_BASE_URL } from '@/constants';

const ShowRoomMakes = ({ showRoomMakes }) => {
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <>
      <MultilineCarousel
        items={showRoomMakes}
        showArrows={false}
        rows={2}
        threshold={12}
        itemBasis="basis-[33.33%] md:basis-[20%] lg:basis-[16.66%]"
        renderItem={(item, index) => (
          <NextLink
            href={`${pathname}/${item?.slug}`}
            title={getLocaleString(item, 'label', locale)}
            key={index}
          >
            <OptionCard
              label={getLocaleString(item, 'label', locale)}
              src={`${IMAGES_BASE_URL}/${item?.slug}/thumbnail.png`}
              width={100}
              height={100}
              imageClassName="w-auto h-[50px] flex-shrink-0"
            />
          </NextLink>
        )}
        locale={locale}
      />
    </>
  );
};
export default ShowRoomMakes;
