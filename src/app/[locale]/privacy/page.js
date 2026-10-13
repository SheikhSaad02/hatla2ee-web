import PageLayout from '@/components/layout/pageLayout';
import { getPrivacyPolicyData } from '@/components/privacy/privacyData';
import { PageTitle } from '@/components/common/pageTitle/pageTitle';
import Table from '@/components/common/table/table';
import Text from '@/components/common/text';

export async function generateMetadata() {
  return {
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function PrivacyPolicy() {
  const {
    headerData,
    intro,
    toc,
    whoWeAreData,
    personalDataWeCollectData,
    personalDataFromOtherSourcesData,
    howWeUseData,
    whoWeShareDataWithData,
    howWeKeepSecureData,
    howLongWeStoreData,
    yourRightsData,
    marketingCommunicationsData,
    policyOnMinorsData,
    thirdPartyLinksData,
    changesToPolicyData,
    chunks,
  } = await getPrivacyPolicyData();

  return (
    <PageLayout
      route="privacy"
      pageTitle={headerData.title}
      pageTitleWrapperClassName="text-center font-bold underline"
    >
      <>
        <div>
          <Text as="h4" className="text-2xl font-bold text-center mb-1">
            {headerData.subtitle}
          </Text>
          <Text as="h4" className="text-2xl font-bold text-center">
            {headerData.effectiveDate}
          </Text>
        </div>
        {/* Intro Section */}
        <div className="grid grid-cols-1 gap-4 ">
          <h2 className="font-semibold">{intro.heading}</h2>
          <p>{intro.p1}</p>
          <p>{intro.p2}</p>
          <p>{intro.p3}</p>
          <p>{intro.p4}</p>
          <p>{intro.p5}</p>
          <ul className="grid grid-cols-1 gap-4">
            {toc.list.map((item, index) => (
              <li key={index} className="list-disc ms-8">
                {item}
              </li>
            ))}
          </ul>
          <p>{toc.p1}</p>
        </div>

        {/* WHO WE ARE AND HOW TO CONTACT US */}
        <div className="grid grid-cols-1 gap-4 ">
          <h2 className="font-semibold">{whoWeAreData.heading}</h2>
          <h3 className="font-semibold">{whoWeAreData.subheading1}</h3>
          <p>{whoWeAreData.p1}</p>
          <h3 className="font-semibold">{whoWeAreData.subheading2}</h3>
          <p>{chunks.whoWeAre.p2}</p>
        </div>

        {/* PERSONAL DATA WE COLLECT FROM YOU */}
        <div className="grid grid-cols-1 gap-4 ">
          <h2 className="font-semibold">{personalDataWeCollectData.heading}</h2>
          <p>{personalDataWeCollectData.p1}</p>
          <p>{personalDataWeCollectData.p2}</p>
          <Table
            data={personalDataWeCollectData.table.data}
            columns={personalDataWeCollectData.table.columns}
            isTrans
          />

          <h3 className="font-semibold">
            {personalDataWeCollectData.aggregatedData.heading}
          </h3>
          <p>{personalDataWeCollectData.aggregatedData.p1}</p>

          <h3 className="font-semibold">
            {personalDataWeCollectData.specialCategories.heading}
          </h3>
          <p>{personalDataWeCollectData.specialCategories.p1}</p>
          <p>{personalDataWeCollectData.specialCategories.p2}</p>

          <h3 className="font-semibold">
            {personalDataWeCollectData.refusal.heading}
          </h3>
          <p>{personalDataWeCollectData.refusal.p1}</p>
        </div>

        {/* PERSONAL DATA WE COLLECT FROM OTHER SOURCES */}
        <div className="grid grid-cols-1 gap-4 ">
          <h2 className="font-semibold">
            {personalDataFromOtherSourcesData.heading}
          </h2>
          <p>{personalDataFromOtherSourcesData.p1}</p>
          <Table
            data={personalDataFromOtherSourcesData.table.data}
            columns={personalDataFromOtherSourcesData.table.columns}
            isTrans
          />
        </div>

        {/* HOW WE USE YOUR PERSONAL DATA AND WHY */}
        <div className="grid grid-cols-1 gap-4 ">
          <h2 className="font-semibold">{howWeUseData.heading}</h2>
          <p>{howWeUseData.p1}</p>
          <p className="font-semibold">{howWeUseData.p2}</p>
          <p>{howWeUseData.p3}</p>
          <ul className="grid grid-cols-1 gap-4">
            {howWeUseData.legalBases.map((item, index) => (
              <li key={index} className="list-disc ms-8">
                {item}
              </li>
            ))}
          </ul>
          <Table
            data={howWeUseData.table.data}
            columns={howWeUseData.table.columns}
            isTrans
          />
        </div>

        {/* WHO WE SHARE YOUR PERSONAL DATA WITH */}
        <div className="grid grid-cols-1 gap-4 ">
          <h2 className="font-semibold">{whoWeShareDataWithData.heading}</h2>
          <p>{whoWeShareDataWithData.p1}</p>
          <p>{whoWeShareDataWithData.p2}</p>
          <Table
            data={whoWeShareDataWithData.table.data}
            columns={whoWeShareDataWithData.table.columns}
            isTrans
          />
          <h3 className="font-semibold">
            {whoWeShareDataWithData.dataTransfers.heading}
          </h3>
          <p>{whoWeShareDataWithData.dataTransfers.p1}</p>
        </div>

        {/* HOW WE KEEP YOUR PERSONAL DATA SECURE */}
        <div className="grid grid-cols-1 gap-4 ">
          <h2 className="font-semibold">{howWeKeepSecureData.heading}</h2>
          <p>{howWeKeepSecureData.p1}</p>
          <p>{howWeKeepSecureData.p2}</p>
          <p>{howWeKeepSecureData.p3}</p>
          <p>{howWeKeepSecureData.p4}</p>
        </div>

        {/* HOW LONG WE STORE YOUR PERSONAL DATA */}
        <div className="grid grid-cols-1 ">
          <h2 className="font-semibold mb-4">{howLongWeStoreData.heading}</h2>
          <p>{howLongWeStoreData.p1}</p>
          <p>{howLongWeStoreData.p2}</p>
          <p>{howLongWeStoreData.p3}</p>
        </div>

        {/* YOUR RIGHTS IN RELATION TO YOUR PERSONAL DATA */}
        <div className="grid grid-cols-1 gap-4 ">
          <h2 className="font-semibold">{yourRightsData.heading}</h2>
          <h4 className="font-medium">{yourRightsData.subheading1}</h4>
          <p>{yourRightsData.p1}</p>
          <ul className="grid grid-cols-1 gap-4">
            {yourRightsData.rightsList.map((item, index) => (
              <li key={index} className="list-disc ms-8">
                {item.item}
                {item.description}
              </li>
            ))}
          </ul>
          <p>{yourRightsData.p2}</p>
          <h3 className="font-semibold">{yourRightsData.subheading2}</h3>
          <p>{yourRightsData.p3}</p>
          <p>{yourRightsData.p4}</p>
          <p>{yourRightsData.p5}</p>
          <p>{yourRightsData.p6}</p>
          <h4 className="font-medium">{yourRightsData.subheading3}</h4>
          <p>{yourRightsData.p7}</p>
          <p>{yourRightsData.p8}</p>
        </div>

        {/* MARKETING COMMUNICATIONS */}
        <div className="grid grid-cols-1 gap-4 ">
          <h2 className="font-semibold">
            {marketingCommunicationsData.heading}
          </h2>
          <p>{marketingCommunicationsData.p1}</p>
        </div>

        {/* OUR POLICY ON MINORS */}
        <div className="grid grid-cols-1 gap-4 ">
          <h2 className="font-semibold">{policyOnMinorsData.heading}</h2>
          <p>{policyOnMinorsData.p1}</p>
          <p>{policyOnMinorsData.p2}</p>
          <p>{policyOnMinorsData.p3}</p>
        </div>

        {/* THIRD PARTY LINKS */}
        <div className="grid grid-cols-1 gap-4 ">
          <h2 className="font-semibold">{thirdPartyLinksData.heading}</h2>
          <p>{thirdPartyLinksData.p1}</p>
          <ul className="grid grid-cols-1 gap-4">
            {thirdPartyLinksData.List.map((item, index) => (
              <li key={index} className="list-disc ms-8">
                <h4 className="font-medium">{item.item}</h4>
                <p>{item.description}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* CHANGES TO THIS PRIVACY POLICY */}
        <div className="grid grid-cols-1 gap-4 ">
          <h2 className="font-semibold">{changesToPolicyData.heading}</h2>
          <p>{changesToPolicyData.p1}</p>
          <p>{changesToPolicyData.p2}</p>
          <p>{changesToPolicyData.p3}</p>
        </div>
      </>
    </PageLayout>
  );
}
