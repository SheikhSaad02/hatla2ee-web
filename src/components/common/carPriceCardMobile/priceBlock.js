import Price from '../price/price';
import PriceRange from '../priceRange/priceRange';
import Text from '../text';

export const PriceBlock = ({ label, price, isRange = false }) => {
  return (
    <div className="priceBlock">
      <Text className="text-gray-light">{label}</Text>
      {!isRange ? (
        <Price
          value={price}
          style="uniform"
          className="text-black font-semibold"
        />
      ) : (
        <PriceRange
          min={price?.min}
          max={price?.max}
          className="text-black font-semibold"
        />
      )}
    </div>
  );
};
