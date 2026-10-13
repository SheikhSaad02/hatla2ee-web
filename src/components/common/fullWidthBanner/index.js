import React from 'react';
import Container from '@/components/layout/container';
import { cn } from '@/utils';

const FullWidthBanner = ({ children, className, style, breakout = true }) => {
  return (
    <div
      className={cn(
        breakout ? 'breakout' : 'relative overflow-hidden',
        className,
      )}
      style={style}
    >
      <Container>{children}</Container>
    </div>
  );
};
export default FullWidthBanner;
