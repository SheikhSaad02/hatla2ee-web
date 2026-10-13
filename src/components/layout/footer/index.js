import { Facebook, Instagram } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';

import AppBanner from '../appBanner';
import Button from '@/components/common/button/button';
import CountryDropDown from '../countryDropDown';
import Link from 'next/link';
import Text from '@/components/common/text';
import { TwitterIcon, LinkedinIcon, TikTokIcon } from '@/icons/socials';
import { cn } from '@/utils';
import { footerLinks } from '@/data/layout';
import { isMobileServer } from '@/utils/serverFunctions';
import ClickEventTracker from '@/services/analyticsService/clickTracker';
import { getSocialLinks } from '@/constants';
import configs from '@/configs';

export default async function Footer({
  locale: paramsLocale,
  removeBottomPadding = false,
}) {
  const isMob = await isMobileServer();
  const locale = paramsLocale || (await getLocale());
  const t = await getTranslations({ locale, namespace: 'layout' });
  return (
    <>
      <footer
        className={cn(
          'py-4 lg:py-12.5 mb-8 pb-12 sm:pb-0 sm:mb-0',
          removeBottomPadding && 'pb-0',
        )}
      >
        <AppBanner locale={locale} className="mb-10" />

        <div className="container mx-auto px-0">
          <div className="grid mb-6 gap-3 grid-cols-2 lg:flex lg:justify-between">
            {!isMob && (
              <div className="col-span-1 flex flex-row justify-between sm:flex-col sm:justify-start space-y-4">
                <div className="flex flex-col items-start gap-2 sm:gap-4">
                  <div>
                    <p className="text-xs sm:text-xl font-bold">
                      {t('Free Classifieds in {country}', {
                        country: configs.country[locale].label,
                      })}
                    </p>
                    <p className="text-2xs md:text-sm text-gray-700">
                      {t('hatla2eeFooter', { year: new Date().getFullYear() })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 sm:space-x-4">
                  <CountryDropDown />

                  <Button
                    asChild
                    variant="tertiary"
                    size="icon"
                    className="rounded-md size-8"
                    href={getSocialLinks(locale)?.facebook}
                    aria-label="Facebook link"
                  >
                    <Facebook
                      className="size-4 sm:size-4 stroke-0"
                      fill="#8FAAD3"
                    />
                  </Button>
                  <Button
                    asChild
                    variant="tertiary"
                    size="icon"
                    href={getSocialLinks(locale)?.tiktok}
                    className="rounded-md size-8"
                    aria-label="TikTok link"
                  >
                    <TikTokIcon className="size-4 sm:size-4 text-[#8FAAD3]" />
                  </Button>
                  <Button
                    asChild
                    variant="tertiary"
                    size="icon"
                    href={getSocialLinks(locale)?.linkedIn}
                    className="rounded-md size-8"
                    aria-label="LinkedIn link"
                  >
                    <LinkedinIcon className="size-4 sm:size-4 text-[#8FAAD3]" />
                  </Button>
                  <Button
                    asChild
                    variant="tertiary"
                    size="icon"
                    href={getSocialLinks(locale)?.instagram}
                    className="rounded-md size-8"
                    aria-label="Instagram link"
                  >
                    <Instagram className="size-4 sm:size-4 text-[#8FAAD3]" />
                  </Button>
                </div>
              </div>
            )}

            {footerLinks(locale).map((section, sectionIdx) => (
              <div key={sectionIdx} className="col-span-1">
                <Text
                  as="h2"
                  className="text-sm sm:text-sm lg:text-base mb-2 sm:mb-2 "
                  weight="semibold"
                >
                  {t(section.label)}
                </Text>
                <ul className="space-y-1 sm:space-y-3 text-gray-700">
                  {/* Replace with Section list component - Hadeed */}
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="hover:text-primary text-xs lg:text-sm"
                    >
                      <ClickEventTracker
                        label={link.name}
                        gaEvent={'footer_link_click'}
                      >
                        <a href={link.href} title={t(link?.name)}>
                          {t(link.name)}
                        </a>
                      </ClickEventTracker>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {isMob && (
            <div className="col-span-1 flex flex-row justify-between sm:flex-col sm:justify-start space-y-4">
              <div className="w-full flex flex-col items-start gap-2 sm:gap-4">
                <div className="flex flex-col align-middle">
                  <p className="text-xs sm:text-xl font-bold">
                    {t('Free Classifieds in {country}', {
                      country: configs.country[locale].label,
                    })}
                  </p>
                  <p className="text-2xs md:text-sm text-gray-700">
                    {t('hatla2eeFooter', { year: new Date().getFullYear() })}
                  </p>
                </div>
                <div className="flex justify-between items-center w-full">
                  <CountryDropDown />
                  <div className="space-x-4">
                    <Button
                      asChild
                      variant="tertiary"
                      size="sm"
                      className="w-[32px]"
                      href={getSocialLinks(locale)?.facebook}
                      aria-label="Facebook link"
                    >
                      <Facebook
                        className="size-4 sm:size-4 stroke-0"
                        fill="#8FAAD3"
                      />
                    </Button>

                    <Button
                      asChild
                      variant="tertiary"
                      size="sm"
                      className="w-[32px]"
                      href={getSocialLinks(locale)?.tiktok}
                      aria-label="TikTok link"
                    >
                      <TikTokIcon className="size-4 sm:size-4 text-[#8FAAD3]" />
                    </Button>

                    <Button
                      asChild
                      variant="tertiary"
                      size="sm"
                      className="w-[32px]"
                      href={getSocialLinks(locale)?.linkedIn}
                      aria-label="LinkedIn link"
                    >
                      <LinkedinIcon className="size-4 sm:size-4 text-[#8FAAD3]" />
                    </Button>

                    <Button
                      asChild
                      variant="tertiary"
                      size="sm"
                      className="w-[32px]"
                      href={getSocialLinks(locale)?.instagram}
                      aria-label="Instagram link"
                    >
                      <Instagram className="size-4 sm:size-4 text-[#8FAAD3]" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </footer>
    </>
  );
}
