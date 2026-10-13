import { formatNumberValue } from '@/utils/numbers';
import Price from '../price/price';

export default function CustomTooltip({
  active,
  payload,
  label,
  toolTipLabel,
  valueAsPrice = false,
}) {
  if (!active || !payload || !payload.length) return null;

  const item = payload[0]?.payload;

  return (
    <div className="flex align-center bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
      <div
        className="m-1 w-1 bg-primary"
        style={{ backgroundColor: item?.fill }}
      />

      <div className="px-3 py-2">
        <div className="flex text-xs gap-2">
          <div className="text-gray-500">{toolTipLabel || item?.name}</div>
          <div className="font-semibold">
            {valueAsPrice ? (
              <Price value={item?.value} />
            ) : (
              formatNumberValue(item?.value)
            )}
          </div>
        </div>
        <div className="text-sm mt-1">{label}</div>
      </div>
    </div>
  );
}
