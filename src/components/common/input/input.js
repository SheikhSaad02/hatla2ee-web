// components/ui/custom-input.tsx
import { Input as KitInput } from '@/components/ui/input';
import { cn } from '@/utils';
import { forwardRef } from 'react';
import Label from '../label';
import Button from '../button/button';
import { X } from 'lucide-react';

const sizeVariants = {
  xsmall: 'h-9 text-sm px-3',
  small: 'h-10 text-sm px-3',
  medium: 'h-11 text-base px-3',
  large: 'h-14 text-base px-3 ',
};

const Input = forwardRef(
  (
    {
      containerClassName,
      className,
      inputClassName,
      inputTitle,
      inputTitleClassName,
      inputDescription = true,
      prefix,
      suffix,
      size = 'medium',
      errorMsg,
      showError = false,
      labelExtra,
      onClear,
      ...props
    },
    ref,
  ) => {
    return (
      <>
        <div
          ref={ref}
          className={cn('relative flex flex-col ', containerClassName)}
        >
          {(inputTitle || labelExtra) && (
            <div className="flex gap-1 mb-2">
              {inputTitle && (
                <Label className={cn('gap-1 fs-body', inputTitleClassName)}>
                  {inputTitle}
                </Label>
              )}
              {labelExtra && labelExtra}
            </div>
          )}

          <div
            className={cn(
              'flex items-center border bg-white rounded-lg group',
              'focus-within:shadow-sm',
              'focus-within:border-primary-600',
              errorMsg && 'border-destructive',
              sizeVariants[size],
              className,
            )}
          >
            {prefix && <div className="flex items-center pe-2">{prefix}</div>}

            <KitInput
              className={cn(
                'focus-visible:ring-0 border-0 flex-1 bg-transparent',
                inputClassName,
              )}
              {...props}
            />

            {onClear && props.value ? (
              <Button
                variant="link"
                type="button"
                // size="sm"
                className="p-0"
                icon={<X />}
                onClick={() => {
                  onClear();
                }}
              />
            ) : (
              suffix && <div className="flex items-center ">{suffix}</div>
            )}
          </div>
          {errorMsg && showError && (
            <p className="text-red-500 text-sm mt-1">{errorMsg}</p>
          )}

          {!errorMsg && inputDescription && inputDescription}
        </div>
      </>
    );
  },
);

Input.displayName = 'Input';

export default Input;
