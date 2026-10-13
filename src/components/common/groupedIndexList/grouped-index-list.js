import { ChipWithIcon } from '@/components/common/chip-with-icon/chip-with-icon';
import { getLocaleString } from '@/utils/general';

const GroupedIndexList = (props) => {
  const { data, type, locale } = props || {};

  const getItemHref = (item) => {
    switch (type) {
      case 'make':
        return `/car/${item?.slug}`;
      case 'model':
        return `/car/${item?.make?.slug}/${item?.slug}`;
      case 'city':
        return `/car/city/${item?.slug}`;
      default:
        return `/car/${item?.slug}`;
    }
  };

  const groupedData =
    !!data?.length > 0 &&
    data
      .map((item) => item)
      .sort((a, b) =>
        getLocaleString(a, 'label', locale).localeCompare(
          getLocaleString(b, 'label', locale),
          locale || undefined,
          { sensitivity: 'base' },
        ),
      )
      .reduce((acc, item) => {
        let label = getLocaleString(item, 'label', locale);
        if (!label) return acc;

        label = label.trim();
        const firstChar = label.charAt(0).toUpperCase();

        if (!acc[firstChar]) acc[firstChar] = [];
        acc[firstChar].push({
          ...item,
          label,
        });

        return acc;
      }, {});

  const sortedKeys = Object.keys(groupedData).sort((a, b) =>
    a.localeCompare(b, locale || undefined, { sensitivity: 'base' }),
  );

  return (
    <div className="flex flex-col gap-5 lg:gap-10">
      {sortedKeys.map((key) => {
        const items = groupedData[key];
        return (
          !!items?.length && (
            <div key={key}>
              <h2 className="font-semibold mb-2">{key}</h2>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(165px,1fr))] gap-2">
                {items.map((item, index) => (
                  <ChipWithIcon
                    key={item?.slug || index}
                    href={getItemHref(item)}
                    hrefTitle={item?.hrefTitle || item?.label}
                    label={item?.label?.trim()}
                    img={item?.logo}
                    className="capitalize"
                  />
                ))}
              </div>
            </div>
          )
        );
      })}
    </div>
  );
};

export default GroupedIndexList;
