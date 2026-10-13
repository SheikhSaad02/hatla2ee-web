import { cn } from '@/utils';
import React from 'react';

const Container = ({ children, className = '', style = {}, ...rest }) => {
  return (
    <div className={cn('container', className)} style={{ ...style }} {...rest}>
      {children}
    </div>
  );
};

export default Container;
