import DrawerWrapper from '@/components/common/drawer';
import Dropdown from '@/components/common/dropdown';
import NextLink from '@/components/common/nextLink';
import Text from '@/components/common/text';
import { Button } from '@/components/ui/button';
import configs from '@/configs';
import { FLAGS } from '@/icons/country-flags';
import { countryPlatformsList } from '@/data/layout';
import { isMobileServer } from '@/utils/serverFunctions';
import { ChevronDown } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import { headers } from 'next/headers';

const CountryDropDown = async () => {
  const isMob = await isMobileServer();
  const locale = await getLocale();
  const t = await getTranslations('layout');
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const Flag = FLAGS[configs.flag];

  const renderCountryDetail = () => {
    return (
      <Button
        variant="tertiary"
        size="sm"
        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-gray-600 text-xs"
      >
        <Flag width={20} height={20} className="cursor-pointer" />
        {configs.country[locale].label}
        <ChevronDown className="w-4 h-4 text-gray-600" />
      </Button>
    );
  };
  return isMob ? (
    <>
      <DrawerWrapper
        fullScreen={false}
        title={t('Select Country')}
        trigger={renderCountryDetail()}
      >
        <div className="flex flex-col gap-6">
          {countryPlatformsList(locale, host).map((item, index) => (
            <NextLink
              href={item.href}
              key={index}
              className="text-sm md:text-base cursor-pointer flex items-center gap-2"
            >
              <item.icon width={20} height={20} />
              {t(item.label)}
            </NextLink>
          ))}
        </div>
      </DrawerWrapper>
    </>
  ) : (
    <Dropdown
      trigger={renderCountryDetail()}
      className={'flex flex-col gap-0 px-2 py-3  rounded-lg'}
    >
      {countryPlatformsList(locale, host).map((item, index) => (
        <NextLink
          key={index}
          href={item.href}
          className={
            'flex items-center justify-start gap-2.5 rounded-sm hover:bg-primary-50  p-2'
          }
        >
          <item.icon className="h-4 w-4" />
          <Text className="text-sm">{t(item.label)}</Text>
        </NextLink>
      ))}
    </Dropdown>
  );
};

export default CountryDropDown;
