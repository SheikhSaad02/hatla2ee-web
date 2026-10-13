import { cn } from '@/utils';

const FilterItemRow = ({
  icon,
  label,
  value,
  className = '',
  labelClassName = '',
  valueClassName = '',
  onClick,
}) => {
  return (
    <div
      className={cn('flex items-center justify-between w-full', className)}
      onClick={onClick}
    >
      <div className={`text-sm text-gray ${labelClassName}`}>
        <span>{label}</span>
      </div>
      <div className="flex gap-3 items-center">
        <span
          className={`text-right text-gray-light text-sm ${valueClassName}`}
        >
          {value}
        </span>
        {icon && <span className="shrink-0">{icon}</span>}
      </div>
    </div>
  );
};

export default FilterItemRow;
