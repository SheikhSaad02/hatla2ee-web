import { Badge } from '@/components/ui/badge';
import { PumpIcon } from '@/icons/basicSvgs';
import { cn } from '@/utils';

const TAG_CLASS =
  'h-7 w-fit shrink-0 self-start gap-1.5 rounded-md px-3 text-sm';

// Silver, Premium and Turbo reuse the ui/badge.jsx variants; Pump uses the
// Profolio tag UI. Its own file so the product block and the cost box's header
// row render the same tag.
export default function ProductTag({ id, name, className }) {
  if (id === 'silver') {
    return (
      <Badge
        className={cn(
          TAG_CLASS,
          'border-transparent bg-gray-200 text-gray-700 hover:bg-gray-200',
          className,
        )}
      >
        {name}
      </Badge>
    );
  }
  if (id === 'premium') {
    return (
      <Badge variant="secondaryGradient" className={cn(TAG_CLASS, className)}>
        {name}
      </Badge>
    );
  }
  if (id === 'turbo') {
    return (
      <Badge variant="turboGradient" className={cn(TAG_CLASS, className)}>
        {name}
      </Badge>
    );
  }
  if (id === 'pump') {
    return (
      <Badge variant="pump" className={cn(TAG_CLASS, className)}>
        <PumpIcon className="size-[1.2em]" />
        {name}
      </Badge>
    );
  }
  return null;
}
