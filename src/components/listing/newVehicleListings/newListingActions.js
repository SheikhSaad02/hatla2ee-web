'use client';
import Button from '@/components/common/button/button';
import CompareButton from '@/components/common/compareNewVehicle/compareButton';
import DownloadBrochure from '@/components/common/downloadBrochure/downloadBrochure';
import { cn } from '@/utils';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

const NewListingActions = ({
  item,
  fullWidth,
  className,
  classNameCompare,
  classNameDownload,
  size = 'lg',
}) => {
  const t = useTranslations('common');

  return (
    <div className={cn('gap-2', fullWidth ? 'grid' : 'flex', className)}>
      <CompareButton item={item} size={size} className={classNameCompare} />
      <DownloadBrochure
        pdfURL={item?.brochure_url}
        size={size}
        className={classNameDownload}
      />
    </div>
  );
};

export default NewListingActions;
