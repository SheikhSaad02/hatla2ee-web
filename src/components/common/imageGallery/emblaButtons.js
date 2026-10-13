import { ChevronLeft, ChevronRight } from 'lucide-react';
import NextImage from '../nextImage';
import Button from '../button/button';
import { cn } from '@/utils';

const PrevButton = (props) => {
  const { children, disabled, ...restProps } = props;

  return (
    <Button
      className={cn(
        `absolute start-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg bg-black/50 hover:bg-black`,
        disabled && 'hidden',
      )}
      disabled={disabled}
      icon={<ChevronLeft className="!w-6 !h-6 flipX" />}
      {...restProps}
    >
      {children}
    </Button>
  );
};
const NextButton = (props) => {
  const { children, disabled, ...restProps } = props;

  return (
    <Button
      className={cn(
        `absolute end-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg bg-black/50 hover:bg-black`,
        disabled && 'hidden',
      )}
      disabled={disabled}
      icon={<ChevronRight className="!w-6 !h-6 flipX" />}
      {...restProps}
    >
      {children}
    </Button>
  );
};

const Thumb = (props) => {
  const { selected, onClick, image, alt } = props;

  return (
    <div
      className={`relative flex-shrink-0 min-w-0 w-[50px] h-[50px] md:w-[72px] md:h-[72px]`}
    >
      <>
        <NextImage
          src={image}
          alt={alt}
          width={72}
          height={72}
          className={cn(
            'w-full h-full object-cover rounded-md md:rounded-lg cursor-pointer border-2',
            selected ? 'border-secondary' : 'border-transparent',
          )}
          onClick={onClick}
        />
      </>
    </div>
  );
};

export { NextButton, PrevButton, Thumb };
