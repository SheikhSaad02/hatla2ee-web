import { getLocale, getTranslations } from 'next-intl/server';

import { Breadcrumbs } from '@/components/common/breadcrumbs';
import ContactForm from '@/components/contact-us/contactForm';
import FullWidthBanner from '@/components/common/fullWidthBanner';
import NextImage from '@/components/common/nextImage';
import PageLayout from '@/components/layout/pageLayout';
import { PageTitle } from '@/components/common/pageTitle/pageTitle';
import { appPaths, appSections, CONTACT_SALES_FORM_URL } from '@/constants';
import { isMobileServer } from '@/utils/serverFunctions';
import { Card, CardContent } from '@/components/ui/card';
import Text from '@/components/common/text';
import { cn } from '@/utils';
import { getAsset } from '@/utils/general';
import Button from '@/components/common/button/button';
import { ContactSalesIcon } from '@/icons/socials';
import { isSectionEnabled } from '@/configs';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: t('contactUsTitle'),
    description: t('description'),
  };
}

export default async function Contact() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'contactUs' });
  const tHome = await getTranslations({ locale, namespace: 'home' });
  const isMob = await isMobileServer();

  return (
    <PageLayout
      route="contact-us"
      breadCrumbsList={[
        { label: t('Home'), href: appPaths.home },
        { label: t('Contact Us') },
      ]}
      pageTitle={t('Contact Us')}
      pageTitleWrapperClassName="z-1 relative lg:text-white [&_*]:lg:text-white"
    >
      <FullWidthBanner
        className={cn(
          'lg:mt-[-108px] lg:h-[380px] lg:pt-23 lg:text-white',
          !isMob && 'gradient-dark',
        )}
      >
        <div className="flex max-sm:flex-col w-full justify-between items-center gap-2">
          <p className="mt-1 fs-body max-lg:text-gray-light max-lg:py-2">
            {t(
              'Got a question or need help? Our team is here for you Just send us a message, and we’ll get back to you soon!',
            )}
          </p>
          {isSectionEnabled(appSections.SUPPORT) && (
            <Button
              variant="tertiary"
              size="xl"
              className="px-4 font-semibold max-sm:w-full"
              href={CONTACT_SALES_FORM_URL}
              icon={<ContactSalesIcon />}
            >
              {tHome('Contact Sales')}
            </Button>
          )}
        </div>
      </FullWidthBanner>
      <Card className="relative border-none lg:rounded-2xl lg:shadow-xl lg:-mt-68 lg:mb-10">
        <CardContent className="grid md:grid-cols-2 max-lg:gap-5">
          <div className="lg:bg-primary-50 rounded-s-2xl px-5 lg:p-10 content-center">
            <div className="flex flex-col gap-1">
              <NextImage
                src={getAsset('/assets/contact-us-banner.webp')}
                alt="help"
                width={431}
                height={339}
              />

              {!isMob && (
                <>
                  <Text as="h3" className="mt-7 text-xl font-semibold">
                    {t('Need Assistance? We’re Just One Message Away!')}
                  </Text>
                  <p className="text-sm text-gray">
                    {t(
                      'Send us your queries, and we’ll respond promptly with the support you need',
                    )}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:gap-5 lg:px-11 lg:py-14">
            <Text as="h2" className="sectionHeading mb-0">
              {t('Feel free to reach out to us!')}
            </Text>
            <ContactForm isMob={isMob} fieldSize={isMob ? 'small' : 'medium'} />
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
