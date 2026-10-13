'use client';

import { RadioGroup } from '@/components/common/radioGroup';
import { useTranslations } from 'next-intl';
export default function FilterRadioOption({
  options,
  linkable,
  onChange,
  value,
}) {
  const getOptionValue = (item) => item?.slug;
  const commonT = useTranslations('common');

  return (
    <RadioGroup
      value={value}
      linkable={linkable}
      options={options}
      onChange={(value) => {
        onChange(
          options?.find((e) => getOptionValue(e) == getOptionValue(value)),
        );
      }}
      getOptionValue={getOptionValue}
      getOptionLabel={(e) => commonT(e?.label)}
      labelClassName="py-1.5"
    />
  );
}
