import { fetchAllShowroom } from '@/apis/showroom';
import ShowRoomsListingsWrapper from './show-room-listings';
import { getShowroomListingsRequestPayload } from '@/mappers/showroom';
import { isWebViewServer } from '@/utils/serverFunctions';

const ShowRoomListings = async ({ isMobile, page, locationId, currentTab }) => {
  const isWebView = await isWebViewServer();
  const showroomBasePath =
    currentTab == 'used' ? `showroom` : `showroom-${currentTab}`;

  const showRoomsInitialData = await fetchAllShowroom(
    getShowroomListingsRequestPayload(currentTab, page, locationId),
    showroomBasePath,
    currentTab,
  );
  return (
    <ShowRoomsListingsWrapper
      isMobile={isMobile}
      page={page}
      locationId={locationId}
      currentTab={currentTab}
      initialData={showRoomsInitialData}
      showroomBasePath={showroomBasePath}
      isWebView={isWebView}
    />
  );
};
export default ShowRoomListings;
