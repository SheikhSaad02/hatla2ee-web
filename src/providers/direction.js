'use client';
import { getDirection } from '@/utils/general';
import { useLocale } from 'next-intl';
import { Direction } from 'radix-ui';

const DirectionProvider = ({ children }) => {
  const dir = getDirection(useLocale());
  return <Direction.Provider dir={dir}>{children}</Direction.Provider>;
};

export default DirectionProvider;
