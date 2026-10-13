import React from 'react';
import NewVehicleCard from '../common/newVehicleCard/newVehicleCard';
import { appPaths } from '@/constants';
import { getPagesHrefsForCategorySlug } from '@/utils/new-cars/listings';
import { getAsset } from '@/utils/general';
import { newVehiclePlaceholder } from '@/constants';

const NewVehicleListingCard = ({
  item,
  variantLevelDetail,
  categorySlug,
  prioritizeFirstImage = false,
}) => {
  const {
    localizedTitle,
    variantCount,
    prices,
    images,
    make,
    model,
    variant,
    shape,
    imported,
  } = item || {};

  // Build model slug with shape if it exists
  let modelSlug = model?.slug;
  if (shape?.slug) {
    modelSlug = `${model?.slug}-shape-${shape?.slug}`;
  }

  return (
    <NewVehicleCard
      href={`${getPagesHrefsForCategorySlug(categorySlug, 'landing')}/${
        imported?.slug === 'yes' ? `imported/${make?.slug}` : make?.slug
      }/${modelSlug}${variantLevelDetail ? `/${variant.id}` : ''}`}
      title={localizedTitle}
      count={variantCount}
      price={prices}
      img={
        images?.[0]?.medium ||
        getAsset(`/assets/${newVehiclePlaceholder[categorySlug]}`)
      }
      showFinancingDetail={!!variantLevelDetail}
      prioritizeFirstImage={prioritizeFirstImage}
    />
  );
};

export default NewVehicleListingCard;
