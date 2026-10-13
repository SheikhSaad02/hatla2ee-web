import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/utils';
import BaseCard from '../baseCard/baseCard';
import NextImage from '../nextImage';
import { getAsset } from '@/utils/general';
const ServiceCard = (props) => {
  const {
    title,
    description,
    image,
    className,
    headerClass,
    titleClassName,
    descriptionClassName,
    imageClass,
    imagePlacement = 'bottom',
    tag,
    style,
  } = props;

  const imageSrc = image || getAsset('/assets/car-placeholder.svg');
  const isImageBackground = imagePlacement === 'background';

  return (
    <BaseCard
      className={cn(
        'rounded-2xl border-none flex flex-col p-0 overflow-hidden gap-0 bg-gray-50 justify-between',
        'hover:shadow-sm transition-shadow duration-300',
        isImageBackground && 'relative',
        className,
      )}
      style={style}
    >
      <CardHeader
        className={cn(
          'p-4 pb-0 h-[40px] lg:h-[100px] gap-1.5 content-start',
          isImageBackground && 'z-10 lg:p-10',
          headerClass,
        )}
      >
        <CardTitle
          className={cn(
            'relative inline-flex items-center gap-2 text-base font-bold lg:text-xl z-10',
            titleClassName,
          )}
        >
          {title}
          {tag}
        </CardTitle>
        <CardDescription
          className={cn(
            'text-xs lg:text-base text-gray-700',
            imagePlacement === 'background' && 'w-[40%]',
            descriptionClassName,
          )}
        >
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className={cn('p-0')}>
        <NextImage
          src={imageSrc}
          alt="Image"
          className={cn('w-full object-cover', imageClass)}
          {...(isImageBackground
            ? { fill: true }
            : {
                width: 250,
                height: 100,
              })}
        />
      </CardContent>
    </BaseCard>
  );
};
export default ServiceCard;
