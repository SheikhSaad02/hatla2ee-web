'use client';

import React from 'react';
import Button from '@/components/common/button/button';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/utils';

const AddCarButton = ({ onClick, className, isMobile }) => {
  const t = useTranslations('common');

  return (
    <Button
      variant="outline"
      icon={<Plus size={16} />}
      onClick={onClick}
      className={cn(
        'flex text-primary border-primary hover:bg-primary hover:text-white',
        className,
      )}
    >
      <span className="inline">
        {isMobile ? t('Add Car') : t('Add another car to compare')}
      </span>
    </Button>
  );
};

export default AddCarButton;
