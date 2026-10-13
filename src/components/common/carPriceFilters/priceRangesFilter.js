import { PriceRangesFilterClient } from './priceRangesFilterClient';
import { isMobileServer } from '@/utils/serverFunctions';

export async function PriceRangesFilter({ priceRanges = [] }) {
  const isMobile = await isMobileServer();

  return (
    <PriceRangesFilterClient priceRanges={priceRanges} isMobile={isMobile} />
  );
}
