import BaseCard from '../baseCard/baseCard';
import { CardContent } from '@/components/ui/card';
import NewListingActions from '@/components/listing/newVehicleListings/newListingActions';
import { cn } from '@/utils';

const NewCarListingActions = ({ item, fullWidth, darkMode }) => {
  return (
    <BaseCard
      className={cn(
        'rounded-xl gap-0 h-max md:gap-4 md:p-4 dark:bg-[#222222E5]',
        darkMode && 'dark',
      )}
    >
      <CardContent>
        <NewListingActions
          item={item}
          fullWidth={fullWidth}
          className={'flex flex-col gap-2'}
        />
      </CardContent>
    </BaseCard>
  );
};

export default NewCarListingActions;
