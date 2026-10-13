import { fetchListingComparison } from '@/apis/listing';
import CarouselSection from '../carouselSection/carouselSection';
import Text from '../text';
import ComparisonCard from './comparisonCard';
import { PAGE_SECTIONS } from '@/services/analyticsService/constants';
const CompareCarousel = async ({ title, makeSlug, modelSlug }) => {
  const result = await fetchListingComparison(makeSlug, modelSlug);
  const comparisons = result?.data;

  if (!comparisons?.length) {
    return null;
  }

  return (
    <div>
      <Text as="h2" className="sectionHeading">
        {title}
      </Text>

      <CarouselSection pageSection={PAGE_SECTIONS.COMPARE_MODELS}>
        {comparisons?.map((item) => (
          <ComparisonCard
            key={item?.id}
            listingsData={item?.listings_data}
            id={item?.id}
          />
        ))}
      </CarouselSection>
    </div>
  );
};

export default CompareCarousel;
