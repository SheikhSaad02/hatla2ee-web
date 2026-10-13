import { mapShowRoomsByAgencyData } from '@/mappers/showroom';
import { ShowRoomService } from '@/services/elasticsearch/showroom';
import ShowRoomTabs from './show-room-tabs';
import ListingNotFound from '@/components/common/errors/listingNotFound';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';

const ShowRoomCars = async ({
  listingDetailData,
  page,
  condition,
  makes,
  makesData,
  showroomSlug,
}) => {
  const getShowRoomCars = async () => {
    // Only apply pagination to the active tab, use page 1 for inactive tab
    const newPage = condition === 'used' ? 1 : Number(page);
    const usedPage = condition === 'used' ? Number(page) : 1;

    const [newData, usedData] = await Promise.all([
      ShowRoomService.getShowRoomCarsByAgency(
        listingDetailData?.slug,
        newPage,
        30,
        'new',
      ),
      ShowRoomService.getShowRoomCarsByAgency(
        listingDetailData?.slug,
        usedPage,
        30,
        'used',
      ),
    ]);

    return mapShowRoomsByAgencyData({
      new: newData,
      used: usedData,
    });
  };
  const t = await getTranslations('common');
  const showRoomCarsData = await getShowRoomCars();
  const showRoomMakes = await ShowRoomService.getShowRoomMakes(
    listingDetailData?.slug,
  );

  const newCarsData = showRoomCarsData.find((item) => item.value === 'new');
  const usedCarsData = showRoomCarsData.find((item) => item.value === 'used');

  const hasCars =
    (newCarsData?.listings?.length ?? 0) > 0 ||
    (usedCarsData?.listings?.length ?? 0) > 0;

  if (makes && makesData && makesData.length === 0) {
    redirect(`/showroom/${showroomSlug}`);
  }

  if (!hasCars) {
    return (
      <ListingNotFound
        description={t('Please try browsing another showroom')}
      />
    );
  }

  return (
    <ShowRoomTabs
      showRoomCarsData={showRoomCarsData}
      listingDetailData={listingDetailData}
      condition={condition}
      showRoomMakes={showRoomMakes}
      showMakes={makes}
      makesData={makesData}
      showroomSlug={showroomSlug}
    />
  );
};
export default ShowRoomCars;
