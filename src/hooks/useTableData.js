import NextImage from '@/components/common/nextImage';
import NextLink from '@/components/common/nextLink';
import { PlusIcon } from 'lucide-react';
import { getLocaleString, mapFeaturesToStrings } from '@/utils/general';
import { translations } from '@/data/tFunctionTranslation';

/**
 * Transforms raw data into Table-ready format with component mappings.
 * Output: { field: { component, props, children } }
 * example { power: "1600cc Turbo" } → { power: { component: 'Text', children: '1600cc Turbo' } }
 */

const ICON_MAPPING = {
  addIcon: PlusIcon,
};

const getIconComponent = (iconName, iconProps = {}) => {
  if (!iconName || typeof iconName !== 'string') return null;

  const IconComponent = ICON_MAPPING[iconName];

  if (!IconComponent) {
    console.log(`Icon "${iconName}" not found in ICON_MAPPING`);
    return null;
  }

  return <IconComponent {...iconProps} />;
};

const getPropsByComponent = (component, item, key, locale) => {
  const propGetters = {
    ImageWithContent: (item, key) => ({
      href: item?.[key]?.href,
      hrefTitle: getLocaleString(item?.[key], 'hrefTitle', locale),
      title: getLocaleString(item?.[key], 'title', locale),
      description: mapFeaturesToStrings(item?.[key]?.features, locale),
      imgSrc: item?.[key]?.image,
      imageProps: { wrapperClassName: 'w-[52px] h-[52px]' },
    }),
    PriceChange: (item, key) => ({
      ...item?.[key],
    }),
    PriceRange: (item, key) => ({
      min: item?.[key]?.min,
      max: item?.[key]?.max,
      showFallbackMsg: false,
      className: 'font-semibold',
    }),
    Price: (item, key) => ({
      value: item?.[key],
      style: 'uniform',
    }),
    Text: (item, key) => ({
      children: item[key],
    }),
    Button: (item, key) => ({
      children: item[key]?.children,
      ...item?.[key],
      icon: getIconComponent(item[key]?.icon, item[key]?.iconProps),
    }),
    CompareButton: (item, key) => ({
      children: item[key]?.children,
      ...item?.[key],
    }),
    Link: (item, key) => {
      const value = item[key];
      if (!value) return {};

      const localizedText = getLocaleString(value, 'text', locale);
      const localizedhrefTitle = getLocaleString(value, 'hrefTitle', locale);

      const { hrefTitle, hrefTitle_l1, children, ...rest } = value;

      return {
        ...rest,
        title: localizedhrefTitle || localizedText,
        children: (
          <>
            {localizedText}
            {children}
          </>
        ),
      };
    },
    LinkWithIcon: (item, key) => {
      const value = item[key];
      if (!value) return {};

      const { text, hrefTitle = '', children, ...rest } = value;
      return {
        ...rest,
        hrefTitle: hrefTitle || text,
        title: hrefTitle || text,
        icon: <NextImage src={item?.[key]?.image} width={52} height={52} />,
        children: (
          <>
            {text}
            {children}
          </>
        ),
      };
    },
    Default: (item, key) => ({
      value: item[key],
    }),
  };

  const getProps = propGetters[component] || propGetters.Default;
  return getProps(item, key);
};

export const useTableData = (data = [], columns = [], locale = 'en') => {
  const hasValidData = (value) => {
    if (!value) return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return Object.keys(value).length > 0;
    return true;
  };

  return data.map((item, rowIndex) => {
    let emptyFlag;
    const row = { key: item?.id || rowIndex };

    columns.forEach((col) => {
      const { key, component } = col;

      const rawValue = item?.[key];

      if (!hasValidData(rawValue)) {
        row[key] = {
          component: '',
          props: {},
          children: null,
          isEmpty: true,
          fallbackText: col?.fallbackText,
        };
        emptyFlag = true;
        return;
      }

      // As if no component is defined we should return raw values directly
      if (!component) {
        row[key] = rawValue;
        return;
      }

      const props = getPropsByComponent(component, item, key, locale);

      row[key] = {
        component,
        props,
        children: props?.children,
      };
    });

    if (emptyFlag) {
      row.className =
        'rtl:bg-gradient-to-l bg-gradient-to-r from-white to-[#FFFAFA]';
    }
    return row;
  });
};
