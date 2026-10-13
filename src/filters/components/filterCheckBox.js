'use client';
import { CheckboxGroup } from '@/components/common/checkboxGroup';
import { createLocaleStringGetter, toArray } from '@/utils/general';
import { useLocale, useTranslations } from 'next-intl';

export default function FilterCheckBox({
  options = [],
  onChange,
  linkable,
  value,
  getOptionLabel,
  renderItem,
}) {
  const extractedValues = toArray(value).map((item) => item?.slug);
  const getOptionValue = (e) => e?.slug;
  const locale = useLocale();
  const t = createLocaleStringGetter(locale);
  const commonT = useTranslations('common');

  return (
    <CheckboxGroup
      values={extractedValues}
      linkable={linkable}
      options={options}
      getOptionLabel={
        getOptionLabel || ((option) => t(option, 'label', commonT))
      }
      onChange={(value) => {
        onChange(options?.find((e) => getOptionValue(e) == value));
      }}
      getOptionValue={getOptionValue}
      renderItem={renderItem}
    />
  );
}
