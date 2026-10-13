import React from 'react';
import NextImage from '../nextImage';
import NextLink from '../nextLink';
import { getAsset } from '@/utils/general';
import { newVehiclePlaceholder } from '@/constants';

const ComparisonCarInfo = ({ processedData, listings, isMobile }) => {
  function getCarDetails(listing) {
    const href = [
      `new-${listing?.listing_category?.slug}`,
      listing?.make?.slug,
      listing?.model?.slug,
      listing?.variant?.id,
    ]
      .filter(Boolean)
      .join('/');

    return {
      image:
        listing?.image_url ||
        getAsset(
          `/assets/${newVehiclePlaceholder[listing.listing_category?.slug]}`,
        ),
      href: `/${href}`,
    };
  }
  return (
    <div className="flex">
      {processedData.map((carData, index) => {
        const carDetails = getCarDetails(listings[index]);
        const title = `${carData?.make || ''} ${carData?.model || ''} ${
          carData?.variant || ''
        }`;

        return (
          <div key={index} className="flex">
            <div
              className={
                'flex flex-col gap-3 p-0 items-center text-center w-[140px] lg:w-[266px] lg:gap-5 lg:p-4'
              }
            >
              <div className="relative flex h-24 lg:h-35">
                <NextImage
                  src={carDetails?.image}
                  alt="Car Image"
                  width={200}
                  height={140}
                  className="object-contain"
                />
              </div>
              <NextLink
                href={carDetails.href}
                title={title}
                className={
                  'font-semibold text-primary text-xs md:text-sm lg:text-base'
                }
              >
                {title}
              </NextLink>
            </div>
            {index < listings.length - 1 && (
              <div className="w-0 border-l mx-3 my-2 lg:mx-3 lg:my-5 grid items-center">
                <span
                  className={
                    'border border-primary rounded-full bg-white font-semibold -translate-x-1/2 rtl:translate-x-1/2 grid place-content-center text-primary  text-xs md:text-sm lg:text-lg h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10'
                  }
                >
                  vs
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ComparisonCarInfo;
