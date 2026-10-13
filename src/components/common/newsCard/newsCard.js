import { CalendarIcon } from '@/icons';
import { cn } from '@/utils';
import { formatDate } from '@/utils/date';
import Image from 'next/image';
import { Badge } from '../badge/badge';
import NextLink from '../nextLink';
import Text from '../text';
import NextImage from '../nextImage';
import { getAsset } from '@/utils/general';
const { default: BaseCard } = require('../baseCard/baseCard');

const NewsCard = (props) => {
  const {
    href = '#',
    tags,
    title,
    image,
    date,
    className,
    imageAltText,
  } = props;

  return (
    <NextLink
      href={href}
      title={title}
      className="no-underline"
      prefetch={false}
    >
      <BaseCard
        className={cn(
          'card group',
          'flex flex-col p-0 gap-0 bg-black min-h-[280px] lg:min-h-[390px]',
          'bg-cover bg-center bg-no-repeat',
          'hover:shadow-sm',
          className,
        )}
      >
        <div className="relative w-full h-full">
          <NextImage
            src={image || getAsset('/assets/car-placeholder.svg')}
            alt={title}
            width={270}
            height={312}
            className="w-full h-full object-cover"
          />

          {tags?.length > 0 && (
            <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-2">
              {tags?.map((tag, index) => (
                <Badge
                  key={index}
                  className="bg-white hover:bg-white text-black text-xs px-2 py-0.5 shadow-none"
                  asChild={false}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="absolute bottom-0 left-0 w-full p-3 pe-8 flex flex-col gap-2 justify-end bg-gradient-to-t from-black to-transparent z-10 min-h-[108px] transition-transform duration-200 ease-in-out origin-bottom-left rtl:origin-bottom-right group-hover:scale-110">
            <Text
              weight="semibold"
              className="text-white text-xs md:text-sm leading-snug line-clamp-2"
            >
              {title}
            </Text>
            {date && (
              <div className="flex items-center gap-2 text-white text-xs">
                <CalendarIcon
                  className="w-4 h-4"
                  aria-hidden="true"
                  size={14}
                />
                <Text>{formatDate(new Date(date))}</Text>
              </div>
            )}
          </div>
        </div>
      </BaseCard>
    </NextLink>
  );
};

export default NewsCard;
