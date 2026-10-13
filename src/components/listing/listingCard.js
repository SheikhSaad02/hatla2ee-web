import {
  extractImageUrls,
  getListingTitleByLevel,
  getLocaleString,
} from '@/utils/general';
import InfoCard from '../common/infoCard/infoCard';
import { generateListingDetailUrl } from '@/utils/url';
import { getContactPresence } from '@/utils/contactDetails';
import ClickEventTracker from '@/services/analyticsService/clickTracker';
import {
  extractCtaTrackingItem,
  extractFlatCtaTrackingItem,
} from '@/utils/listings';
const ListingCard = ({
  item,
  carPurposeTitle = '',
  locale,
  gaEvent = '',
  pageType = '',
  pageSection = '',
  prioritizeFirstImage = false,
  source,
}) => {
  const {
    listing_id,
    images,
    tags,
    dealerTag,
    dealerLink,
    itemList,
    price,
    listingChips,
    make,
    model,
    year,
    contact_details,
    location,
    exterior_color,
    products_information,
    shape,
    min_installment,
    badges,
  } = item || {};

  const ctaMetrics = {
    source: source || 'search',
    listing_id,
    products_information,
    platform_listing_external_id: item?.platform_listing_external_id,
    ad_image_url: item?.ad_image_url || null,
  };

  const title = getListingTitleByLevel(
    { make, model, year, shape },
    'year',
    locale,
  );
  const href = generateListingDetailUrl(item);
  const locationTitle = location
    ? getLocaleString(location, 'title', locale)
    : '';
  const exteriorLabel = exterior_color
    ? getLocaleString(exterior_color, 'label', locale)
    : '';
  const hrefTitle = carPurposeTitle
    ? `${title} ${carPurposeTitle}`
    : [title, locationTitle, exteriorLabel].filter(Boolean).join(' ');

  const contactInfo = {
    call: contact_details?.phone || contact_details?.mobile,
    whatsapp: contact_details?.whatsapp,
    isVerified: contact_details?.verified,
    listingId: listing_id,
    presence: getContactPresence(contact_details),
  };

  const trackingPayload = extractCtaTrackingItem(item);
  const flatTrackingPayload = extractFlatCtaTrackingItem({ location, ...item });
  const firstImage = extractImageUrls(images)?.[0];
  const limitedImages = extractImageUrls(images).slice(0, 3);
  return (
    <ClickEventTracker
      gaEvent={gaEvent}
      pageType={pageType}
      pageSection={pageSection}
      item={trackingPayload}
    >
      <InfoCard
        href={href}
        images={limitedImages}
        totalImageCount={images?.length}
        tags={tags}
        dealerTag={dealerTag}
        dealerHref={dealerLink}
        title={title}
        hrefTitle={hrefTitle}
        properties={itemList}
        price={price}
        minInstallment={min_installment}
        listingChips={listingChips}
        contactInfo={contactInfo}
        id={listing_id}
        locale={locale}
        contact_details={contact_details}
        className="flex flex-col h-full"
        ctaMetrics={ctaMetrics}
        item={flatTrackingPayload}
        pageType={pageType}
        pageSection={pageSection}
        make={make}
        badges={badges}
        prioritizeFirstImage={prioritizeFirstImage}
      />
    </ClickEventTracker>
  );
};

export default ListingCard;
