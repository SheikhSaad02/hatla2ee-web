import Text from '../text';
import { cn } from '@/utils';
import { twMerge } from 'tailwind-merge';

const TextWithIcon = ({
  title,
  description,
  icon,
  iconPosition = 'left',
  className,
  iconClassName,
  contentClassName,
  titleClassName,
  descriptionClassName,
  titleDir,
}) => {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      {iconPosition === 'left' && icon && (
        <div className={cn('shrink-0', iconClassName)}>{icon}</div>
      )}

      <div className={cn('flex flex-col w-full', contentClassName)}>
        <Text
          weight="semibold"
          className={twMerge('text-sm rtl:text-right', titleClassName)}
          {...(titleDir && { dir: titleDir })}
        >
          {title}
        </Text>
        {description && (
          <Text
            weight="regular"
            className={twMerge('text-xs rtl:text-right', descriptionClassName)}
          >
            {description}
          </Text>
        )}
      </div>

      {iconPosition === 'right' && icon && (
        <div className={cn('shrink-0', iconClassName)}>{icon}</div>
      )}
    </div>
  );
};

export default TextWithIcon;
