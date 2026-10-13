import NextLink from '../nextLink';
import Text from '../text';
import { cn } from '@/utils';
import { getLocaleStringServer } from '@/utils/serverFunctions';

const ListWithTitle = ({
  title,
  items,
  icon,
  className = '',
  titleClassName,
  listClassName,
  itemClassName,
  labelClassName,
  getOptionLabel = (e) => e.label || e,
}) => {
  const renderItem = (item) =>
    typeof item === 'object' && item.href ? (
      <NextLink
        href={item.href}
        title={item?.hrefTitle || item?.label}
        className={cn('text-sm text-gray-700', labelClassName)}
      >
        {getLocaleStringServer(item, 'label')}
      </NextLink>
    ) : (
      <Text className={cn('text-sm', labelClassName)}>
        {getLocaleStringServer(item, 'label')}
      </Text>
    );

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {title && (
        <Text className={cn('text-base font-semibold', titleClassName)}>
          {title}
        </Text>
      )}
      <div className={cn('flex flex-col gap-2', listClassName)}>
        {items.map((item, index) => (
          <div
            key={index}
            className={cn('flex items-center gap-2', itemClassName)}
          >
            <span className="shrink-0">{icon && icon}</span>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListWithTitle;
