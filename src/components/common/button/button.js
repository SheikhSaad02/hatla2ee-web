import { Button as KitButton } from '@/components/ui/button';
import { cn } from '@/utils';
import NextLink from '../nextLink';
import React from 'react';
import { Loader2Icon } from 'lucide-react';

const Button = (props) => {
  const {
    size = 'default',
    variant = 'default',
    className,
    disabled = false,
    icon,
    iconPosition = 'left',
    loading = false,
    children,
    asChild,
    href,
    target,
    ...rest
  } = props;
  const Comp = href ? NextLink : React.Fragment;
  return (
    <KitButton
      size={size}
      variant={variant}
      className={cn('inline-flex cursor-pointer', icon && 'gap-1', className)}
      disabled={disabled || loading}
      href={href}
      asChild={!!href}
      target={href && target}
      {...rest}
    >
      <Comp>
        {loading ? (
          <>
            <Loader2Icon className="animate-spin" />
            {children}
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && <span>{icon}</span>}
            {children}
            {icon && iconPosition === 'right' && <span>{icon}</span>}
          </>
        )}
      </Comp>
    </KitButton>
  );
};

export default Button;
