'use client';

import React from 'react';
import { ArrowDownToLine } from 'lucide-react';
import Button from '../button/button';
import { useTranslations } from 'next-intl';
import { cn } from '@/utils';
import { useIsMobile } from '@/providers/isMobile';

const DownloadBrochure = ({ pdfURL, size = 'lg', className }) => {
  const isMob = useIsMobile() ?? false;
  const t = useTranslations('common');
  if (!pdfURL) return;
  return (
    <Button
      size={size}
      disabled={!pdfURL}
      href={pdfURL}
      variant={'tertiary'}
      icon={<ArrowDownToLine />}
      className={className}
    >
      {isMob ? t('Brochure') : t('Download Brochure')}
    </Button>
  );
};

export default DownloadBrochure;
