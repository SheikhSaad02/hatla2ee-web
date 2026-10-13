import { redirect } from 'next/navigation';

export const handleSlugRedirect = ({
  locale,
  type = 'car', // 'car', 'new-car', 'new-bus', 'new-motorcycle', 'new-trucks'
  id = null,
  expectedMake,
  expectedModel,
  listingDetailData,
  variantId = null,
  actualMake,
  actualModel,
  actualVehicleType = 'car',
  imported = false,
  exists = null,
}) => {
  if (listingDetailData?.error) {
    if (listingDetailData?.error?.status === 422) {
      redirect(
        `/${locale}/${type}/${expectedMake}${
          expectedModel ? `/${expectedModel}` : ''
        }`,
      );
    }
    return;
  }
  if (!listingDetailData) {
    // If exists is true, redirect to make page
    if (exists === true) {
      redirect(`/${locale}/${type}/${expectedMake}`);
      return;
    }
    // If exists is false, return false to indicate 404 should be shown
    if (exists === false) {
      return false;
    }

    redirect(
      `/${locale}/${type}/${expectedMake}${
        variantId ? `/${expectedModel}` : ''
      }`,
    );
    return;
  }

  const decodedExpectedMake = expectedMake
    ? decodeURIComponent(expectedMake)
    : expectedMake;
  const decodedExpectedModel = expectedModel
    ? decodeURIComponent(expectedModel)
    : expectedModel;
  const decodedActualMake = actualMake
    ? decodeURIComponent(actualMake)
    : actualMake;

  // Build actual model with shape if it exists
  let decodedActualModel = actualModel
    ? decodeURIComponent(actualModel)
    : actualModel;

  if (listingDetailData?.shape?.slug) {
    decodedActualModel = `${decodedActualModel}-shape-${listingDetailData.shape.slug}`;
  }

  const makeMismatch = decodedExpectedMake !== decodedActualMake;
  const modelMismatch = decodedExpectedModel !== decodedActualModel;

  const vehicleTypeMismatch = type !== actualVehicleType;

  // Check if listing is imported but URL doesn't include /imported
  const isImportedListing =
    listingDetailData?.dynamic_fields?.imported?.slug === 'yes';
  const shouldRedirectToImported =
    isImportedListing &&
    listingDetailData?.dynamic_fields?.condition?.slug === 'new' &&
    type === 'car' &&
    !imported;

  if (shouldRedirectToImported) {
    let targetUrl = `/${locale}/new-car/imported/${encodeURIComponent(
      decodedActualMake,
    )}/${encodeURIComponent(decodedActualModel)}`;

    if (id) {
      targetUrl += `/${id}`;
    }

    redirect(targetUrl);
    return;
  }

  if (!!decodedActualMake && !!decodedActualModel && !!actualVehicleType) {
    if (makeMismatch || modelMismatch || vehicleTypeMismatch) {
      let correctType = type;
      if (vehicleTypeMismatch) {
        const vehicleTypeToUrlType = {
          car: 'car',
          'new-car': 'new-car',
          'new-bus': 'new-bus',
          'new-motorcycle': 'new-motorcycle',
          'new-trucks': 'new-trucks',
        };

        correctType =
          vehicleTypeToUrlType[actualVehicleType] || actualVehicleType;
      }

      let targetUrl = `/${locale}/${correctType}${
        imported ? '/imported' : ''
      }/${encodeURIComponent(decodedActualMake)}/${encodeURIComponent(
        decodedActualModel,
      )}`;

      if (correctType === 'car') {
        if (id) {
          targetUrl += `/${id}`;
        }
      }

      if (correctType.startsWith('new-')) {
        if (variantId) {
          targetUrl += `/${variantId}`;
        }
        if (id) {
          targetUrl += `/${id}`;
        }
      }

      redirect(targetUrl);
    }
  }
};
