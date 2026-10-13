'use client';
import { Checkbox } from '@/components/ui/checkbox';
import Label from '@/components/common/label';
import Text from '@/components/common/text';
import { formatNumberValue } from '@/utils/numbers';

export default function FilterGoodDeal({
  checked = false,
  count = null,
  label,
  onToggle,
  id = 'good-deal-filter',
}) {
  return (
    <div className="flex items-center justify-between gap-2 border-t border-gray-100 pt-3">
      <Label htmlFor={id} className="flex items-center gap-2 cursor-pointer">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={(value) => onToggle?.(!!value)}
        />
        <Text weight="medium" className="text-sm text-gray-800">
          {label}
        </Text>
      </Label>
      {count != null && (
        <Text weight="semibold" className="text-sm text-gray-500">
          {formatNumberValue(count)}
        </Text>
      )}
    </div>
  );
}
