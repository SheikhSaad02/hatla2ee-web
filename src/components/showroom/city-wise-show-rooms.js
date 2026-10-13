import { fetchCityWiseShowrooms } from '@/apis/showrooms';
import BaseCard from '@/components/common/baseCard/baseCard';
import ShowroomCard from '@/components/common/showroomCard/showroomCard';
import Text from '@/components/common/text';
import { getLocaleStringServer } from '@/utils/serverFunctions';
import { getLocale, getTranslations } from 'next-intl/server';
import { CardContent } from '../ui/card';
import FallBack from './fallback';

const CityWiseShowrooms = async (props) => {
  const { makeLabel, makeSlug } = props || {};
  const showRoomsData = await fetchCityWiseShowrooms(makeSlug);
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'common' });

  return !showRoomsData?.length ? (
    <FallBack
      title={'No Showroom Available'}
      titleLabel={'Showrooms'}
      makeLabel={makeLabel}
      type={'showroom'}
    />
  ) : (
    <section id="showroom" className="flex flex-col gap-4">
      <h2 className="sectionHeading mb-0">
        {makeLabel} {t('Showrooms')}
      </h2>
      <div className="flex flex-col gap-4">
        {showRoomsData?.map((item, index) => {
          return (
            <BaseCard
              key={index}
              className=" bg-gradient-to-b from-blue-50 to-white"
            >
              <CardContent className="p-4 lg:p-5 bg-[url(/assets/showroomsMap.webp)] bg-no-repeat bg-[length:270px_101px] bg-top-right rounded-xl">
                <Text
                  as="h3"
                  bold
                  className="text-lg lg:text-xl font-semibold mb-4"
                >
                  {getLocaleStringServer(item, 'city_title')}
                </Text>

                <div className="grid grid-cols-[repeat(auto-fill,minmax(282px,1fr))] gap-3">
                  {item?.showRooms?.map((showroom, index) => {
                    return <ShowroomCard key={index} {...showroom} />;
                  })}
                </div>
              </CardContent>
            </BaseCard>
          );
        })}
      </div>
    </section>
  );
};

export default CityWiseShowrooms;
