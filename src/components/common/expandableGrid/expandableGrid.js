'use client';

import { useState, useRef, useEffect } from 'react';
import Button from '../button/button';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/utils';

const ExpandableGrid = ({
  children,
  maxHeight = '400px',
  shouldExpandOnDesktop = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToggleButton, setShowToggleButton] = useState(false);
  const gridRef = useRef(null);
  const t = useTranslations('common');

  const heightClasses = {
    '100px': 'max-h-[100px]',
    '150px': 'max-h-[150px]',
    '200px': 'max-h-[200px]',
    '300px': 'max-h-[300px]',
    '400px': 'max-h-[400px]',
    '500px': 'max-h-[500px]',
    '600px': 'max-h-[600px]',
  };

  const maxHeightClass = heightClasses[maxHeight] || null;

  useEffect(() => {
    const checkHeight = () => {
      if (gridRef.current) {
        const gridHeight = gridRef.current.scrollHeight;
        const maxHeightValue = parseInt(maxHeight);
        setShowToggleButton(gridHeight > maxHeightValue);
      }
    };

    checkHeight();

    const handleResize = () => checkHeight();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [children, maxHeight]);

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="relative">
      <div
        ref={gridRef}
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isExpanded ? 'max-h-[2000px]' : maxHeightClass,
          !shouldExpandOnDesktop && 'md:max-h-none',
        )}
        style={!maxHeightClass && !isExpanded ? { maxHeight } : undefined}
      >
        {children}
      </div>

      {showToggleButton && (
        <div
          className={cn(
            'flex justify-center bg-linear-[180deg,transparent_0%,#ffffff_65%]',
            isExpanded ? 'mb-2' : '-mt-[35px] relative z-10 pt-5',
            shouldExpandOnDesktop ? '' : 'md:hidden',
          )}
        >
          <Button onClick={toggleExpanded} variant="link">
            <span>{isExpanded ? t('View Less') : t('View More')}</span>
            <ChevronDown
              className={cn(
                'w-4 h-4 transition-transform duration-200',
                isExpanded && 'rotate-180',
              )}
            />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExpandableGrid;
