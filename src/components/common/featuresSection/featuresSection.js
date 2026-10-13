import { RightArrowFilled } from '@/icons';
import ListWithTitle from '../listWithTitle/listWithTitle';
import Text from '../text';
import { getLocaleStringServer } from '@/utils/serverFunctions';
import ExpandableGrid from '../expandableGrid/expandableGrid';
import { listingJumpLinks } from '@/data/detail';
const FeaturesSection = ({ title, featuresList }) => {
  return (
    <>
      {featuresList?.length > 0 && (
        <div>
          <Text
            id={listingJumpLinks.FEATURES}
            as="h2"
            className="sectionHeading"
          >
            {title}
          </Text>
          <ExpandableGrid>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 ">
              {featuresList?.map((item, index) => (
                <div key={index}>
                  <ListWithTitle
                    key={index}
                    titleClassName="text-sm font-bold"
                    labelClassName="text-sm"
                    items={item.features}
                    title={getLocaleStringServer(item, 'label')}
                    icon={<RightArrowFilled className="rtl:rotate-180" />}
                  />
                </div>
              ))}
            </div>
          </ExpandableGrid>
        </div>
      )}
    </>
  );
};

export default FeaturesSection;
