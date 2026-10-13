import { useTranslations } from 'next-intl';
import ListItemCard from '../listItemCard/listItemCard';
// import { isMobileServer } from '@/utils/serverFunctions';

export default function RecentSearches({
  list = [],
  orientation,
  icon,
  onItemClick,
}) {
  const t = useTranslations('common');

  return (
    <div className="flex lg:flex-col gap-3" aria-label={t('Recent Searches')}>
      {list?.map(({ title, itemList, link, brand, model }, index) => (
        <ListItemCard
          key={index}
          className="min-h-18 justify-center"
          classNameWrapper="min-w-[280px]"
          title={title}
          itemList={itemList}
          iconPosition="right"
          icon={icon}
          href={link}
          singleLine
          onClick={() => onItemClick?.({ brand, model })}
        />
      ))}
    </div>
  );
}
