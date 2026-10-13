'use client';
import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { LocationsService } from '@/services/elasticsearch/location-service';
import { createLocaleStringGetter } from '@/utils/general';
import Select from '../select/select';

export default function LocationSearch({
  triggerProps,
  onSelect = () => {},
  value,
}) {
  const locale = useLocale();
  const t = createLocaleStringGetter(locale);
  const trans = useTranslations('common');
  const [initialOptions, setInitialOptions] = useState([]);

  const handleSelect = (selectedOption) => {
    onSelect(selectedOption);
  };

  useEffect(() => {
    const loadInitialOptions = async () => {
      const options = await LocationsService.fetchAllLocations();
      setInitialOptions(options);
    };
    loadInitialOptions();
  }, []);

  return (
    <>
      <Select
        value={value}
        className="w-full"
        title={trans('Select City')}
        placeholder={trans('Select City')}
        onSelect={handleSelect}
        triggerProps={triggerProps}
        defaultOptions={initialOptions}
        getOptionLabel={(option) => t(option, 'title')}
        getOptionValue={(option) => option?.id}
      />
    </>
  );
}
