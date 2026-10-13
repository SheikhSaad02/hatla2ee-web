'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';

import Accordion from '../common/accordian';
import FilterChips from '../listing/filterChips/filterChips';
import FilterScrollCard from '@/filters/components/filterScrollCard';
import { LocationsService } from '@/services/elasticsearch/location-service';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

const ShowroomsLocationSearch = ({ isMobile }) => {
  const t = useTranslations('common');
  const [filterValue, setFilterValue] = useState(false);
  const [showroomLocations, setShowroomLocations] = useState([]);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const params = useSearchParams();
  const location_id = params?.get('location_id');
  const [loading, setLoading] = useState(false);

  const handleLocationChange = (item) => {
    setFilterValue(item);
    router.push(`${pathname}?location_id=${item?.id}`);
  };

  const fetchLocations = async () => {
    setLoading(true);

    const locations = await LocationsService.fetchAllLocations(76);
    if (locations) {
      setShowroomLocations(locations);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const getLocationItems = () => {
    return [
      {
        id: 1,
        trigger: t('Locations'),
        content: (
          <FilterScrollCard
            isMobile={isMobile}
            onChange={(item) => handleLocationChange(item)}
            linkable={false}
            loading={loading}
            options={showroomLocations}
            value={filterValue}
            placeholder={t('Search Location')}
            title={t('Select Location')}
            suffix={
              <Search
                className="text-[#1A73E8] stroke-[1.5]"
                size={16}
                strokeWidth={1.5}
              />
            }
            resetState={true}
          />
        ),
      },
    ];
  };

  return (
    <>
      {location_id && (
        <FilterChips
          chipsData={[
            { ...showroomLocations?.find((data) => data?.id == location_id) },
          ]}
          onClick={() => {
            setFilterValue(false);
            router.push(pathname);
          }}
          locale={locale}
          pathOnClear={pathname}
          showClearAll={false}
        />
      )}
      <Accordion
        items={getLocationItems()}
        defaultOpen={[getLocationItems()[0]?.id]}
        dropdownOpen={true}
      />
    </>
  );
};
export default ShowroomsLocationSearch;
