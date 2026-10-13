import NextLink from '@/components/common/nextLink';
import { getTranslations, getLocale } from 'next-intl/server';
import { appPaths, SUPPORT_EMAIL } from '@/constants';

export const getTermsData = async () => {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'terms' });

  const mailredirect = `mailto:${SUPPORT_EMAIL}`;

  const chunks = {
    whoWeAre: {
      p2: t.rich('whoWeAre.p2', {
        contactUs: (chunks) => (
          <NextLink href={appPaths.contactUs} className="text-primary">
            {chunks}
          </NextLink>
        ),
      }),
    },
    privacyPolicy: {
      p1: t.rich('privacyPolicy.p1', {
        privacy: (chunks) => (
          <NextLink href={appPaths.privacy} className="text-primary">
            {chunks}
          </NextLink>
        ),
      }),
    },
    accountCreation: {
      p3: t.rich('accountCreation.p3', {
        email: (chunks) => (
          <NextLink href={mailredirect} className="text-primary">
            {chunks}
          </NextLink>
        ),
        _email: SUPPORT_EMAIL,
        warning: (chunks) => <span className="text-red-500">{chunks}</span>,
      }),
      p6: t.rich('accountCreation.p6', {
        privacy: (chunks) => (
          <NextLink href={appPaths.privacy} className="text-primary">
            {chunks}
          </NextLink>
        ),
      }),
    },
    listings: {
      sellerList: {
        2: t.rich('listings.sellerList.2', {
          privacy: (chunks) => (
            <NextLink
              href={appPaths.privacy}
              className="text-primary underline"
            >
              {chunks}
            </NextLink>
          ),
        }),
      },
    },
    notResponsibleForListings: {
      p3: t.rich('notResponsibleForListings.p3', {
        privacy: (chunks) => (
          <NextLink className="text-primary" href={appPaths.privacy}>
            {chunks}
          </NextLink>
        ),
      }),
    },
    reviewsAndRatings: {
      intro: t.rich('reviewsAndRatings.intro', {
        privacy: (chunks) => (
          <NextLink className="text-primary" href={appPaths.privacy}>
            {chunks}
          </NextLink>
        ),
      }),
      p4: t.rich('reviewsAndRatings.p4', {
        privacy: (chunks) => (
          <NextLink className="text-primary" href={appPaths.privacy}>
            {chunks}
          </NextLink>
        ),
      }),
    },
    uploadingContent: {
      p5: t.rich('uploadingContent.p5', {
        privacy: (chunks) => (
          <NextLink className="text-primary" href={appPaths.privacy}>
            {chunks}
          </NextLink>
        ),
      }),
    },
    reportingContent: {
      p1: t.rich('reportingContent.p1', {
        contactUs: (chunks) => (
          <NextLink className="text-primary" href={appPaths.contactUs}>
            {chunks}
          </NextLink>
        ),
        _email: SUPPORT_EMAIL,
        email: (chunks) => <NextLink href={mailredirect}>{chunks}</NextLink>,
      }),
      p2: t.rich('reportingContent.p2', {
        email: (chunks) => (
          <NextLink className="text-primary" href={mailredirect}>
            {chunks}
          </NextLink>
        ),
        _email: SUPPORT_EMAIL,
      }),
    },
    general: {
      contact: {
        p3: t.rich('general.contact.p3', {
          email: (chunks) => (
            <NextLink className="text-primary" href={mailredirect}>
              {chunks}
            </NextLink>
          ),
          _email: SUPPORT_EMAIL,
        }),
      },
      disputeResolution: {
        p13: t.rich('general.disputeResolution.p13', {
          contactUs: (chunks) => (
            <NextLink className="text-primary" href={appPaths.contactUs}>
              {chunks}
            </NextLink>
          ),
        }),
      },
    },
  };

  return {
    headerData: t.raw('header'),
    whoWeAreData: t.raw('whoWeAre'),
    descriptionOfServiceData: t.raw('descriptionOfService'),
    acceptanceOfTermsData: t.raw('acceptanceOfTerms'),
    platformChangesData: t.raw('platformChanges'),
    platformSuspensionData: t.raw('platformSuspension'),
    privacyPolicyData: t.raw('privacyPolicy'),
    rightToUseData: t.raw('rightToUse'),
    restrictionsData: t.raw('restrictions'),
    accountCreationData: t.raw('accountCreation'),
    listingsData: t.raw('listings'),
    paidServicesData: t.raw('paidServices'),
    notResponsibleForListingsData: t.raw('notResponsibleForListings'),
    reviewsAndRatingsData: t.raw('reviewsAndRatings'),
    uploadingContentData: t.raw('uploadingContent'),
    acceptableUsePolicyData: t.raw('acceptableUsePolicy'),
    processingPaymentsData: t.raw('processingPayments'),
    limitationsAndDisclaimerData: t.raw('limitationsAndDisclaimer'),
    breachOfTermsData: t.raw('breachOfTerms'),
    reportingContentData: t.raw('reportingContent'),
    generalData: t.raw('general'),
    chunks,
  };
};
