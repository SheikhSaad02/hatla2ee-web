import { getLocale, getTranslations } from 'next-intl/server';
import NextLink from '../common/nextLink';
import { SUPPORT_EMAIL } from '@/constants';

export const getPrivacyPolicyData = async () => {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'privacyPolicy' });
  const mailredirect = `mailto:${SUPPORT_EMAIL}`;

  const chunks = {
    whoWeAre: {
      p2: t.rich('whoWeAre.p2', {
        email: (chunks) => <NextLink href={mailredirect}>{chunks}</NextLink>,
        _email: SUPPORT_EMAIL,
      }),
    },
  };

  return {
    headerData: t.raw('header'),
    intro: t.raw('intro'),
    toc: t.raw('toc'),
    whoWeAreData: t.raw('whoWeAre'),
    personalDataWeCollectData: t.raw('personalDataWeCollect'),
    personalDataFromOtherSourcesData: t.raw('personalDataFromOtherSources'),
    howWeUseData: t.raw('howWeUseData'),
    whoWeShareDataWithData: t.raw('whoWeShareDataWith'),
    howWeKeepSecureData: t.raw('howWeKeepSecure'),
    howLongWeStoreData: t.raw('howLongWeStore'),
    yourRightsData: t.raw('yourRights'),
    marketingCommunicationsData: t.raw('marketingCommunications'),
    policyOnMinorsData: t.raw('policyOnMinors'),
    thirdPartyLinksData: t.raw('thirdPartyLinks'),
    changesToPolicyData: t.raw('changesToPolicy'),
    chunks,
  };
};
