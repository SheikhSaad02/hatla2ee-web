import React from 'react';
import Text from './text';
import ListWithTitle from './listWithTitle/listWithTitle';
import { Tabs } from './tabs';

const UsefulLinks = ({ data, heading }) => {
  return (
    <div>
      <Text as="h2" className="sectionHeading">
        {heading}
      </Text>
      <Tabs
        tabsListClassName="w-min border-b-0"
        className="gap-5"
        items={data?.map(({ label, value, items }) => ({
          label,
          value,
          content: (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-5">
              {items?.map((link, index) => (
                <ListWithTitle
                  key={`used-${index}`}
                  items={link.items}
                  title={link.label}
                />
              ))}
            </div>
          ),
        }))}
      />
    </div>
  );
};

export default UsefulLinks;
