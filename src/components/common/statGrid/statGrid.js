import Text from '@/components/common/text';
import { cn } from '@/utils';

export default function StatGrid({ items = [], cols = 2, cellClassName, className }) {
  if (!items.length) return null;

  return (
    <div
      className={cn(
        'grid divide-x divide-gray-200',
        cols === 3 ? 'grid-cols-3' : 'grid-cols-2',
        className,
      )}
    >
      {items.map(({ label, value }) => (
        <div
          key={label}
          className={cn('flex min-w-0 flex-col gap-1 px-4 py-3', cellClassName)}
        >
          <Text as="p" className="text-xs text-gray-500">
            {label}
          </Text>
          <Text as="p" weight="semibold" className="text-sm text-gray-900">
            {value}
          </Text>
        </div>
      ))}
    </div>
  );
}
