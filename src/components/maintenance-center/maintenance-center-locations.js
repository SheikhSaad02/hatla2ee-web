'use client';

import { appPaths } from '@/constants';
import { parentClasses } from '@/data/listings/used-cars/spriteMapping';
import { getLocaleString } from '@/utils/general';
import { useLocale, useTranslations } from 'next-intl';
import MaintenanceCard from '../common/MaintainanceCard/Maintenance';
import MantainenanceCenterBrands from './maintenance-brands';

const MaintenanceCenterLocations = ({ data, isMobile }) => {
  const getTransformedBrands = () => {
    const authorizedBrands = [];
    const specializedBrands = [];

    if (Array.isArray(data?.makes)) {
      data?.makes.forEach((item) => {
        const updatedItem = {
          ...item,
          href: `${appPaths.maintenanceCenter}/brand/${item?.slug}`,
        };

        if (!!item?.certified) {
          authorizedBrands.push(updatedItem);
        } else {
          specializedBrands.push(updatedItem);
        }
      });
    }

    return { authorizedBrands, specializedBrands };
  };
  const { authorizedBrands, specializedBrands } = getTransformedBrands();
  const t = useTranslations('common');
  const locale = useLocale();
  const branchesData = data?.branches;
  const getBranchLink = (data) => {
    return `${appPaths.maintenanceCenter}/${data?.slug}/${data?.id}`;
  };

  return (
    <>
      {authorizedBrands?.length > 0 && (
        <MantainenanceCenterBrands
          brandsData={authorizedBrands}
          title={'Maintenances Center Authorized in brands'}
          isMobile={isMobile}
          titleClass="text-lg md:text-3xl font-semibold mb-4"
        />
      )}
      {specializedBrands?.length > 0 && (
        <MantainenanceCenterBrands
          brandsData={specializedBrands}
          title={'Maintenances Center Specialized in brands'}
          titleClass="text-lg md:text-3xl font-semibold mb-4"
          isMobile={isMobile}
        />
      )}

      {data && (
        <div>
          <h2 className="sectionHeading">{t('Branch Address')}</h2>
          <MaintenanceCard
            title={getLocaleString(data?.location, 'name', locale)}
            phones={data?.phones}
            location={getLocaleString(data, 'address', locale)}
            contactAction={{ call: data?.phones }}
            latitude={data?.lat}
            longitude={data?.long}
          />
        </div>
      )}

      {branchesData?.length > 0 && (
        <div>
          <h2 className="sectionHeading">{t('Other Branches')}</h2>

          {branchesData?.map((branch, index) => (
            <MaintenanceCard
              key={index}
              title={getLocaleString(branch, 'name', locale)}
              phones={data?.phones}
              location={getLocaleString(branch, 'address', locale)}
              className="mb-3"
              contactAction={{ call: branch?.phones }}
              latitude={branch?.lat}
              longitude={branch?.long}
              href={getBranchLink(branch)}
            />
          ))}
        </div>
      )}
    </>
  );
};
export default MaintenanceCenterLocations;
