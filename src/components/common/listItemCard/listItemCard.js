import { Card, CardContent } from '@/components/ui/card';

import InlineItems from '../inlineItems/inlineItems';
import NextLink from '../nextLink';
import TextWithIcon from '../textWithIcon/textWithIcon';
import { cn } from '@/utils';
import Text from '../text';

export default function ListItemCard({
  href = '#',
  title,
  itemList,
  icon,
  className,
  classNameWrapper,
  InlineItemsClassName,
  onClick,
}) {
  return (
    <NextLink
      href={href}
      className={cn('no-underline', classNameWrapper)}
      onClick={onClick}
    >
      <Card className={cn('py-3 px-4', className)}>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1 min-w-0">
            <Text weight="semibold" className="fs-body">
              {title}
            </Text>
            <InlineItems
              className={cn(InlineItemsClassName, 'text-sm text-gray')}
              items={itemList}
              spaceClass={'gap-0'}
              singleLine
            />
          </div>
          {icon}
        </div>
      </Card>
    </NextLink>
  );
}
