import NextLink from '@/components/common/nextLink';
import { PageTitle } from '@/components/common/pageTitle/pageTitle';
import Text from '@/components/common/text';
import PageLayout from '@/components/layout/pageLayout';
import { getTermsData } from '@/components/terms-and-conditions/termsData';

export async function generateMetadata() {
  return {
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function TermsAndConditions() {
  const {
    headerData,
    whoWeAreData,
    descriptionOfServiceData,
    acceptanceOfTermsData,
    platformChangesData,
    platformSuspensionData,
    privacyPolicyData,
    rightToUseData,
    restrictionsData,
    accountCreationData,
    listingsData,
    paidServicesData,
    notResponsibleForListingsData,
    reviewsAndRatingsData,
    uploadingContentData,
    acceptableUsePolicyData,
    processingPaymentsData,
    limitationsAndDisclaimerData,
    breachOfTermsData,
    reportingContentData,
    generalData,
    chunks,
  } = await getTermsData();

  return (
    <PageLayout 
        route="general-condition"
        pageTitle={headerData.title}
        pageTitleWrapperClassName="text-center font-bold underline">
      <>
        <div>
          <Text as="h4" className="text-2xl font-bold text-center mb-1">
            {headerData.subtitle}
          </Text>
          <Text as="h4" className="text-2xl font-bold text-center">
            {headerData.effectiveDate}
          </Text>
        </div>

        <div className="grid grid-cols-1 gap-4 ">
          <h2 className="text-lg font-semibold underline">
            {whoWeAreData.heading}
          </h2>
          <p>{whoWeAreData.p1}</p>
          <p>{chunks.whoWeAre.p2}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 ">
          <h2 className="text-lg font-semibold underline">
            {descriptionOfServiceData.heading}
          </h2>
          <p>{descriptionOfServiceData.p1}</p>
          <ul className="grid grid-cols-1 gap-4">
            {descriptionOfServiceData.list1.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <p>{descriptionOfServiceData.p2}</p>
          <p>{descriptionOfServiceData.p3}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 ">
          <h2 className="text-lg font-semibold underline">
            {acceptanceOfTermsData.heading}
          </h2>
          <p>{acceptanceOfTermsData.p1}</p>
          <p>{acceptanceOfTermsData.p2}</p>
          <p>{acceptanceOfTermsData.p3}</p>
          <p>{acceptanceOfTermsData.p4}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 ">
          <h2 className="text-lg font-semibold underline">
            {platformChangesData.heading}
          </h2>
          <p>{platformChangesData.p1}</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <h2 className="text-lg font-semibold underline">
            {platformSuspensionData.heading}
          </h2>
          <p>{platformSuspensionData.p1}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 ">
          <h2 className="text-lg font-semibold underline">
            {privacyPolicyData.heading}
          </h2>
          <div>
            <p>{chunks.privacyPolicy.p1}</p>
            <p>{privacyPolicyData.p2}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 ">
          <h2 className="text-lg font-semibold underline">
            {rightToUseData.heading}
          </h2>
          <p>{rightToUseData.p1}</p>
          <p>{rightToUseData.p2}</p>
          <p>{rightToUseData.p3}</p>
          <p>{rightToUseData.p4}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 ">
          <h2 className="text-lg font-semibold underline">
            {restrictionsData.heading}
          </h2>
          <p>{restrictionsData.intro}</p>
          <ul className="grid grid-cols-1 gap-4">
            {restrictionsData.list.map((item, index) => (
              <li key={index} className="list-disc ms-8">
                {item}
              </li>
            ))}
          </ul>
          <p>{restrictionsData.p1}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 ">
          <h2 className="text-lg font-semibold underline">
            {accountCreationData.heading}
          </h2>
          <p>{accountCreationData.p1}</p>
          <p>{accountCreationData.p2}</p>
          <p>{chunks.accountCreation.p3}</p>
          <p>{accountCreationData.p4}</p>
          <p>{accountCreationData.p5}</p>
          <p>{chunks.accountCreation.p6}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 ">
          <h2 className="text-lg font-semibold underline">
            {listingsData.heading}
          </h2>
          <p>{listingsData.p1}</p>
          <p>{listingsData.sellerIntro}</p>
          <ul className="grid grid-cols-1 gap-4">
            {listingsData.sellerList.map((item, index) => (
              <li key={index}>
                {index === 2 ? chunks.listings.sellerList[2] : item}
              </li>
            ))}
          </ul>
          <p>{listingsData.buyerIntro}</p>
          <ul className="grid grid-cols-1 gap-4">
            {listingsData.buyerList.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 gap-4 ">
          <h2 className="text-lg font-semibold underline">
            {paidServicesData.heading}
          </h2>
          <p>{paidServicesData.p1}</p>
          <p>{paidServicesData.intro}</p>
          <ul className="grid grid-cols-1 gap-4">
            {paidServicesData.list.map((item, index) => (
              <li key={index} className="list-disc ms-8">
                {item}
              </li>
            ))}
          </ul>
          <p>{paidServicesData.p2}</p>
          <p>{paidServicesData.p3}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 ">
          <h2 className="text-lg font-semibold underline">
            {notResponsibleForListingsData.heading}
          </h2>
          <p>{notResponsibleForListingsData.p1}</p>
          <p>{notResponsibleForListingsData.p2}</p>
          <p>{chunks.notResponsibleForListings.p3}</p>
          <p>{notResponsibleForListingsData.p4}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 ">
          <h2 className="text-lg font-semibold underline">
            {reviewsAndRatingsData.heading}
          </h2>
          <p>{reviewsAndRatingsData.p1}</p>
          <p>{chunks.reviewsAndRatings.intro}</p>
          <ul className="grid grid-cols-1 gap-4">
            {reviewsAndRatingsData.list.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <p>{reviewsAndRatingsData.p2}</p>
          <p>{reviewsAndRatingsData.p3}</p>
          <p>{chunks.reviewsAndRatings.p4}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 ">
          <h2 className="text-lg font-semibold underline">
            {uploadingContentData.heading}
          </h2>
          <p>{uploadingContentData.p1}</p>
          <p>{uploadingContentData.p2}</p>
          <p>{uploadingContentData.p3}</p>
          <p>{uploadingContentData.p4}</p>
          <p>{chunks.uploadingContent.p5}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 ">
          <h2 className="text-lg font-semibold underline">
            {acceptableUsePolicyData.heading}
          </h2>
          <p>{acceptableUsePolicyData.p1}</p>
          <p>{acceptableUsePolicyData.p2}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 ">
          <h2 className="text-lg font-semibold underline">
            {processingPaymentsData.heading}
          </h2>
          <p>{processingPaymentsData.p1}</p>
          <p>{processingPaymentsData.p2}</p>
          <p>{processingPaymentsData.p3}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 ">
          <h2 className="text-lg font-semibold underline">
            {limitationsAndDisclaimerData.heading}
          </h2>
          <p className="font-semibold">{limitationsAndDisclaimerData.p1}</p>
          <p className="font-semibold">{limitationsAndDisclaimerData.p2}</p>
          <p className="font-normal text-sm">
            {limitationsAndDisclaimerData.p3}
          </p>{' '}
          <p className="font-normal text-sm">
            {limitationsAndDisclaimerData.p4}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 ">
          <h2 className="text-lg font-semibold underline">
            {breachOfTermsData.heading}
          </h2>
          <p>{breachOfTermsData.p1}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 ">
          <h2 className="text-lg font-semibold underline">
            {reportingContentData.heading}
          </h2>
          <p>{chunks.reportingContent.p1}</p>
          <p>{chunks.reportingContent.p2}</p>
        </div>

        <div className="grid grid-cols-1 ">
          <h2 className="text-lg font-semibold underline mb-4">
            {generalData.heading}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <p>
              {generalData.linksToThirdPartySites.heading}
              {generalData.linksToThirdPartySites.p1}
              {generalData.linkingRules.heading}
            </p>
            <p>{generalData.linkingRules.p2}</p>
            <p>{chunks.general.contact.p3}</p>
          </div>
          <p>
            {generalData.noVirusLiability.heading}
            {generalData.noVirusLiability.p4}
          </p>
          <p>
            {generalData.forceMajeure.heading}
            {generalData.forceMajeure.p5}
          </p>
          <p>
            {generalData.otherAgreements.heading}
            {generalData.otherAgreements.p6}
          </p>
          <p>
            {generalData.transferOfRights.heading}
            {generalData.transferOfRights.p7}
          </p>
          <p>
            {generalData.thirdPartyRights.heading}
            {generalData.thirdPartyRights.p8}
          </p>
          <p>
            {generalData.delayInEnforcement.heading}
            {generalData.delayInEnforcement.p9}
          </p>
          <p>
            {generalData.severability.heading}
            {generalData.severability.p10}
          </p>
          <p>
            {generalData.territoryAccess.heading}
            {generalData.territoryAccess.p11}
          </p>
          <p>
            {generalData.language.heading}
            {generalData.language.p12}
          </p>
          <p>{chunks.general.disputeResolution.p13}</p>
          <div className="mt-4">
            <p>
              {generalData.indemnity.heading}
              {generalData.indemnity.p14}
            </p>
            <ul>
              {generalData.indemnity.list.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </>
    </PageLayout>
  );
}
