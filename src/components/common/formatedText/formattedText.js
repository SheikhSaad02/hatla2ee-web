import React from 'react';
import Text from '../text';
import { decodeHTMLEntities } from '@/utils/general';

const FormattedText = ({ text }) => {
  if (!text) return null;
  const decodedText = decodeHTMLEntities(text);

  return (
    <>
      <Text
        as="div"
        id="description"
        className="whitespace-pre-wrap font-normal md:font-medium space-y-4 leading-relaxed"
      >
        {decodedText}
      </Text>
    </>
  );
};

export default FormattedText;
