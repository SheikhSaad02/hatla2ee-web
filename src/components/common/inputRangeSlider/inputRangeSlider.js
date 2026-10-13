import { Slider as KitSlider } from '@/components/ui/slider';
import Input from '../input/input';
import Price from '../price/price';
import Label from '../label';
import { formatNumberValue } from '@/utils/numbers';

const InputRangeSlider = (props) => {
  const {
    label = 'Loan Amount',
    min = 50000,
    max = 90000000,
    step = 1000,
    value,
    onChange,
    errorMsg,
    boundsAsPrice = true,
    boundsSuffix = '',
    onBlur,
    ...rest
  } = props;

  const parseValue = (val) => Number(String(val ?? '').replace(/,/g, '')) || 0;

  const clamp = (val) => Math.min(Math.max(val, min), max);

  const handleSliderChange = (val) => {
    onChange(val[0]);
  };

  const handleInputChange = (e) => {
    let num = parseInt(e.target.value.replace(/,/g, ''), 10);
    if (Number.isNaN(num)) return onChange('');
    if (num > max) num = max;
    onChange(num);
  };

  // Clamping the lower bound on blur so partially typed values stay editable
  const handleInputBlur = (e) => {
    const num = parseValue(value);
    if (num !== clamp(num)) onChange(clamp(num));
    onBlur?.(e);
  };

  const renderBound = (bound) =>
    boundsAsPrice ? (
      <Price valueClassName="font-normal" value={bound} />
    ) : (
      <span>{`${formatNumberValue(bound)}${boundsSuffix}`}</span>
    );

  return (
    <div className="space-y-3 w-full">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>

        <Input
          value={value}
          onChange={handleInputChange}
          placeholder="Enter amount"
          errorMsg={!!errorMsg}
          containerClassName="max-w-45"
          {...rest}
          onBlur={handleInputBlur}
        />
      </div>

      <div className="flex-1">
        <KitSlider
          value={[clamp(parseValue(value))]}
          min={min}
          max={max}
          step={step}
          onValueChange={handleSliderChange}
          className="mb-3"
        />
        <div className="flex justify-between text-sm text-gray-500">
          {renderBound(min)}
          {renderBound(max)}
        </div>
      </div>
      {errorMsg && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}
    </div>
  );
};

export default InputRangeSlider;
