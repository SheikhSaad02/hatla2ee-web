'use client';
import { useTranslations } from 'next-intl';
import Button from '../button/button';
import { cn } from '@/utils';

const CompareButton = ({ item, size = 'lg', className }) => {
  const t = useTranslations('common');

  return (
    <>
      <Button
        href={item?.href}
        size={size}
        variant={'tertiary'}
        className={cn(
          'group-hover:shadow-[inset_0_0_0_1px_var(--color-primary-500),var(--shadow-btn)]',
          className,
        )}
      >
        {t('Compare')}
      </Button>
    </>
  );
};

export default CompareButton;
