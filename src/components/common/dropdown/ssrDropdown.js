'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/utils';
import { useLocale } from 'next-intl';

export default function SsrDropdown({
  trigger,
  children,
  align = 'start',
  className,
  triggerClassName,
  contentClassName,
  onOpenChange,
  enableHover = false,
  placement = 'bottom',
  ...rest
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);
  const locale = useLocale();

  const handleToggle = useCallback(
    (forceState) => {
      const newState = forceState ?? !isOpen;
      setIsOpen(newState);
      onOpenChange?.(newState);
    },
    [isOpen, onOpenChange],
  );

  const handleMouseEnter = () => {
    if (!enableHover) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    handleToggle(true);
  };

  const handleMouseLeave = () => {
    if (!enableHover) return;
    timeoutRef.current = setTimeout(() => {
      handleToggle(false);
    }, 150);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        handleToggle(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        handleToggle(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen, handleToggle]);

  return (
    <div
      className={cn('relative inline-block', className)}
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      <div
        onClick={handleToggle}
        className={cn('cursor-pointer', triggerClassName)}
      >
        {trigger}
      </div>
      <div
        className={cn(
          'absolute z-50 w-max min-w-[8rem] overflow-hidden border bg-popover text-popover-foreground rounded-2.5xl shadow-md',
          'mt-1',
          align === 'start' && 'left-0',
          align === 'center' && 'left-1/2 -translate-x-1/2',
          align === 'end' && 'right-0',
          placement === 'top'
            ? `bottom-full mb-1${locale == 'en' ? '' : 'right-0'}`
            : 'mt-4 top-full',
          isOpen
            ? 'opacity-100 visible translate-y-0'
            : 'opacity-0 invisible translate-y-2 pointer-events-none',
          'transition-all duration-200 ease-out',
          contentClassName,
        )}
        role="menu"
      >
        {children}
      </div>
    </div>
  );
}
