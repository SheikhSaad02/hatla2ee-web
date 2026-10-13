'use client';

import ScrollCard from '@/components/common/scrollCard/scrollCard';
import Select from '@/components/common/select/select';
import {
  createLocaleStringGetter,
  isMobile as isMobileClient,
} from '@/utils/general';
import { formatNumberValue } from '@/utils/numbers';
import { ChevronRight, Search } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

export default function FilterScrollCard({
  options,
  data,
  onChange,
  linkable,
  value,
  title,
  isMobile,
  isMulti = false,
  showSuffix = true,
  ...rest
}) {
  const isMob = isMobile || isMobileClient();
  const locale = useLocale();
  const t = createLocaleStringGetter(locale);
  const commonT = useTranslations('common');
  const getOptionSuffix = (e) => {
    if (!showSuffix) return '';
    const count = e.doc_count || e.count;
    if (count) {
      return formatNumberValue(count);
    }
  };
  return isMob ? (
    <Select
      value={value}
      defaultOptions={options}
      onSelect={onChange}
      isMulti={isMulti}
      triggerProps={{
        size: isMob && 'small',
        suffix: (
          <ChevronRight
            className="text-default flipX"
            size={isMob ? '14' : 20}
          />
        ),
      }}
      getOptionLabel={(e) => {
        return t(e, 'label', commonT);
      }}
      getOptionValue={(option) => option?.slug}
      title={title}
      getOptionSuffix={getOptionSuffix}
      {...rest}
    />
  ) : (
    <ScrollCard
      linkable={linkable}
      onClick={onChange}
      value={value}
      isMulti={isMulti}
      data={options}
      style={{ maxHeight: 350 }}
      inputsuffix={<Search className="text-primary" size={16} />}
      getOptionLabel={(e) => {
        return t(e, 'label', commonT);
      }}
      getOptionSuffix={getOptionSuffix}
      {...rest}
    />
  );
}
