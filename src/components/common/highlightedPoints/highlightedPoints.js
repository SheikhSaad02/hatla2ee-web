import React from 'react';
import Text from '../text';
import ListWithTitle from '../listWithTitle/listWithTitle';
import { RightArrowFilled } from '@/icons';

const HighlightedPoints = ({ items, title }) => {
  if (!items?.length) return null;

  return (
    <div>
      <Text
        id="highlighted-points"
        as="h2"
        className="sectionHeading"
      >
        {title}
      </Text>
      <ListWithTitle
        labelClassName="text-sm"
        listClassName="grid md:grid-cols-2 lg:grid-cols-4 md:gap-5"
        items={items}
        icon={<RightArrowFilled className="rtl:rotate-180" />}
      />
    </div>
  );
};
export default HighlightedPoints;
