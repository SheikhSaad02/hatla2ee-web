import Price from '@/components/common/price/price';
import { CalendarIcon, InfoIcon } from '@/icons';
import { cn } from '@/utils';
import { formatDate } from '@/utils/date';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';

const PriceChange = ({ value, dateOfChange, tooltip }) => {
  const isPriceUp = value > 0;
  const colorClass = isPriceUp ? 'text-red-600' : 'text-green-600';
  const bgColorClass = isPriceUp ? 'bg-red-100' : 'bg-green-100';

  return (
    <div className="flex flex-row justify-between md:flex-col gap-1">
      <div className="flex items-center gap-1 md:gap-2">
        <span className={`${colorClass} text-xs md:text-sm`}>
          {isPriceUp ? '+' : ''}
          <Price value={value} style="uniform" />
        </span>
        <div className={cn(colorClass, bgColorClass, 'rounded-sm p-0.5 lg:p-1 flipX')}>
          {isPriceUp ? (
            <TrendingUpIcon className="size-3" strokeWidth={3} />
          ) : (
            <TrendingDownIcon className="size-3" strokeWidth={3} />
          )}
        </div>
      </div>

      {dateOfChange && (
        <div className="flex items-center gap-1 text-xs text-gray-light">
          <CalendarIcon alt="Calendar" size={16} className="text-gray-400" />
          <span>{formatDate(new Date(dateOfChange))}</span>
          <div className="relative group">
            {tooltip && (
              <>
                <InfoIcon alt="Info" className="w-4 h-3 cursor-pointer" />

                <div className="absolute left-0 top-full mt-1 w-fit bg-white text-2xs p-2 rounded border hidden group-hover:block z-10">
                  {tooltip}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceChange;
