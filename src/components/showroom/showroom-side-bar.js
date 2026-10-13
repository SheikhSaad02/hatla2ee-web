'use client';
import Sidebar from '../common/sidebar';
import PriceLinks from './price-links';
import ShowroomsLocationSearch from './showroom-location-search';

const ShowRoomSideBar = ({ isMobile }) => {
  const renderPricesData = () => {
    return <PriceLinks isMobile={isMobile} />;
  };
  return (
    <Sidebar
      className={'px-2 py-2 bg-white'}
      containerClassName="z-10"
      bottomSlot={!isMobile && renderPricesData()}
    >
      <ShowroomsLocationSearch isMobile={isMobile} />
    </Sidebar>
  );
};
export default ShowRoomSideBar;
