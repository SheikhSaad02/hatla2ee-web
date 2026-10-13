import React from 'react';
import NextImage from '../nextImage';
import NextLink from '../nextLink';
import { getAsset } from '@/utils/general';
import { newVehiclePlaceholder } from '@/constants';

const ComparisonCarInfoGrid = ({ listings, processedData }) => {
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
    <div className="relative grid grid-cols-2 gap-4 w-full max-w-sm mx-auto">
      {listings.slice(0, 4).map((listing, index) => {
        const carDetails = getCarDetails(listing);
        const carData = processedData[index];
        const title = `${carData?.make || ''} ${carData?.model || ''} ${
          carData?.variant || ''
        }`;

        return (
          <div
            key={index}
            className="flex flex-col gap-3 p-0 items-center text-center"
          >
            <div className="relative">
              <NextImage
                src={carDetails.image}
                alt="Car Image"
                width={200}
                height={140}
                className="object-contain"
              />
            </div>
            <NextLink
              href={carDetails.href}
              title={title}
              className="font-semibold text-primary text-xs"
            >
              {title}
            </NextLink>
          </div>
        );
      })}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute inset-y-4 left-1/2 -translate-x-1/2 w-px bg-gray-300"></div>

        <div className="relative z-10 bg-white border-2 border-primary rounded-full w-8 h-8 flex items-center justify-center">
          <span className="text-primary text-xs font-bold">VS</span>
        </div>
      </div>
    </div>
  );
};

export default ComparisonCarInfoGrid;
