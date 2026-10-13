import BackButton from '../backButton';
import Text from '../text';
import { formatNumberValue } from '@/utils/numbers';
import { ChevronLeftIcon } from 'lucide-react';
import Container from '@/components/layout/container';
import { cn } from '@/utils';
import NextImage from '../nextImage';
import StickyHeader from './stickyHeader';
import { getAsset } from '@/utils/general';
import { isMobileServer } from '@/utils/serverFunctions';
import ListingSearchTrigger from './listingSearchTrigger';

export const PageTitle = async ({
  title,
  count,
  className,
  pageTitleImage,
  showImage = false,
  showSearchBar = false,
}) => {
  const isMob = await isMobileServer();
  return !isMob ? (
    <Text
      as="h1"
      weight="bold"
      className={cn('text-2xl lg:text-3.5xl', className)}
    >
      {title}{' '}
      {count && (
        <span className="text-gray-600">({formatNumberValue(count)})</span>
      )}
    </Text>
  ) : (
    <StickyHeader>
      <Container className="flex items-center justify-between gap-3">
        <div className="flex gap-2 flex-1 items-center">
          <BackButton
            variant="ghost"
            className="bg-gray-50 text-gray-500 w-8 h-auto"
          >
            <ChevronLeftIcon className="w-4 h-4 rounded-xs flipX" />
          </BackButton>
          {showSearchBar ? (
            <>
              <h1 className="sr-only">{title}</h1>
              <div className="flex-1 min-w-0">
                <ListingSearchTrigger title={title} />
              </div>
            </>
          ) : (
            <Text
              as="h1"
              weight="bold"
              className="text-lg text-gray-900 content-center"
            >
              {title}
            </Text>
          )}
        </div>
        {pageTitleImage && (
          <div className="rounded-lg border border-gray-100 overflow-hidden">
            <NextImage
              src={pageTitleImage || getAsset('/assets/showroom-logo.webp')}
              width={32}
              height={32}
              className="rounded-md object-contain "
            />
          </div>
        )}
      </Container>
    </StickyHeader>
  );
};
