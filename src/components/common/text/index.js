// components/Typography.js
import { twMerge } from 'tailwind-merge';

const fontWeights = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
};

const Text = ({
  children,
  weight,
  className = '',
  as = 'span',
  ...props
}) => {
  const Component = as;
  return (
    <Component
      className={twMerge(fontWeights[weight] || '', className)}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Text;
