import { CardContent } from '@/components/ui/card';
import BaseCard from '@/components/common/baseCard/baseCard';
import { cn } from '@/utils';
import Text from '@/components/common/text';

export default function CreditsInfoCard({ title, copy, className }) {
  return (
    <BaseCard className={cn('gap-1 p-4', className)}>
      <CardContent className="p-0 rounded-2xl">
        <Text as="h4" weight="semibold" className="text-gray-900">
          {title}
        </Text>
        <Text as="p" className="mt-1 text-sm text-gray-600">
          {copy}
        </Text>
      </CardContent>
    </BaseCard>
  );
}
