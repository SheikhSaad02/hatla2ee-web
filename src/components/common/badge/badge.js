'use client';

import { Badge as KitBadge } from '@/components/ui/badge';
import { cn } from '@/utils';
import NextLink from '../nextLink';

export const Badge = ({
  children,
  href = '',
  linkTooltip,
  variant = 'default',
  className = '',
  ...props
}) => {
  return (
    <KitBadge
      asChild={!!href}
      variant={variant}
      className={cn('rounded-md', className)}
      onClick={(e) => {
        e.stopPropagation();
      }}
      {...props}
    >
      {href ? (
        <NextLink
          href={href}
          title={linkTooltip}
          className={cn('no-underline')}
        >
          {children}
        </NextLink>
      ) : (
        children
      )}
    </KitBadge>
  );
};
