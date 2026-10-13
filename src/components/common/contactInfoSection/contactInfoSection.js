import { Card, CardContent } from '@/components/ui/card';

import NextLink from '../nextLink';
import TextWithIcon from '../textWithIcon/textWithIcon';
import { getTranslations } from 'next-intl/server';
import { isMobileServer } from '@/utils/serverFunctions';
import ClickEventTracker from '@/services/analyticsService/clickTracker';
import { appSections } from '@/constants';
import { isSectionEnabled } from '@/configs';
import tenantData from '@data';

export default async function ContactInfoSection() {
  if (!isSectionEnabled(appSections.SUPPORT)) return <></>;
  const isMob = await isMobileServer();
  const t = await getTranslations('home');

  return (
    <div>
      <h2 className="sectionHeading text-center">{t('needSupportHelp')}</h2>
      <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center justify-between">
        {tenantData.contactData.map((item, index) => (
          <NextLink
            key={index}
            href={item?.href}
            title={item?.title}
            className="w-full"
          >
            <ClickEventTracker
              label={item?.title}
              gaEvent={'support_link_click'}
            >
              <Card
                key={index}
                className="group w-full md:rounded-xl py-4 px-3 md:p-4 transition duration-200 hover:shadow-sm hover:bg-primary-50"
                style={{ '--icon-color': '#F5F9FF' }}
              >
                <CardContent className="group-hover:[--icon-color:#fff]">
                  <TextWithIcon
                    title={t(item.title)}
                    description={
                      item.translate ? t(item.description) : item.description
                    }
                    icon={
                      <item.Icon
                        color="var(--icon-color)"
                        width={isMob ? 28 : 44}
                      />
                    }
                    iconPosition="right"
                    titleClassName="text-sx md:text-lg mb-1"
                    descriptionClassName="text-xs md:text-sm text-gray-600"
                  />
                </CardContent>
              </Card>
            </ClickEventTracker>
          </NextLink>
        ))}
      </div>
    </div>
  );
}
