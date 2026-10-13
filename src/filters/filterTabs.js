import { MultilineCarousel } from '@/components/common/carousel/multlineCarousel';
import { Tabs } from '@/components/common/tabs';
import { triggerSpriteMapping } from '@/data/listings/used-cars/spriteMapping';
import { isMobileServer } from '@/utils/serverFunctions';
import { getDynamicLabel } from '@/utils/used-cars/listings';
import { getLocale, getTranslations } from 'next-intl/server';
import GridSlide from './gridSlide';

const FilterTabs = async ({ tabs, page_type =''}) => {
  if (!tabs?.length) {
    return null;
  }
  const isMobile = await isMobileServer();
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'common' });
  const filteredTabs = tabs?.filter((tab) => !!tab?.items?.length);

  return (
    !!filteredTabs?.length && (
      <Tabs
        // tabsListClassName="flex flex-1 lg:gap-0"
        // triggerClassName="filterTab "
        className="gap-4"
        autoContentHeight={!isMobile}
        tabClickGaEvent="popular_search_tab_click"
        page_type={page_type}
        // className="gap-0 border roundnoed-2xl"
        items={filteredTabs?.map(
          ({
            label,
            label_l1,
            value,
            type,
            items,
            rows,
            threshold,
            itemBasis,
            className,
            labelClassName,
            tabTitle: _tabTitle,
            ...rest
          }) => ({
            label: getDynamicLabel({ label, label_l1, value, locale, t }),
            label_l1,
            value,
            //preffix: triggerSpriteMapping[value],
            content: (
              // <div className="px-3 lg:px-5 py-2 lg:py-4 flex flex-col justify-center">
              <MultilineCarousel
                items={items}
                renderItem={(_item, index) => {
                  return (
                    <GridSlide
                      key={index}
                      index={index}
                      item={_item}
                      type={type}
                      className={className}
                      labelClassName={labelClassName}
                      page_type={page_type}
                      tabLabel={value}
                    />
                  );
                }}
                rows={rows}
                itemBasis={itemBasis}
                threshold={threshold}
                showArrows={false}
                showDots={true}
                {...rest}
              />
              // </div>
            ),
          }),
        )}
      />
    )
  );
};

export default FilterTabs;
