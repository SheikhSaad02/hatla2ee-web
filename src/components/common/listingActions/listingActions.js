import React from 'react';
import ShareListing from '../shareListing/shareListing';
import { WishList } from '../wishlist/wishlist';
import Dropdown from '../dropdown';
import { EllipsisVerticalIcon, Flag } from 'lucide-react';
import Button from '../button/button';
import { getTranslations } from 'next-intl/server';

const ListingActions = async ({
  title,
  specificationList,
  image,
  isMob,
  className,
  showWishlist = true,
  id,
  btnclassName,
}) => {
  const t = await getTranslations('common');

  return (
    <div className={className}>
      <ShareListing
        title={title}
        specificationList={specificationList}
        modalTitle={t('Share this Car')}
        image={image}
        showText={true}
        isMob={isMob}
        buttonVariant={!isMob ? 'outline' : 'glassy'}
        btnclassName={btnclassName}
      />
      {showWishlist && (
        <WishList
          showText={true}
          listingId={id}
          isMob={isMob}
          className={btnclassName}
        />
      )}
    </div>
  );
};

export default ListingActions;
