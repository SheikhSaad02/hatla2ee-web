import { Spinner as KitSpinner } from '@/components/ui/spinner';

const Spinner = ({ variant, ...props }) => {
  return <KitSpinner variant={variant} {...props} />;
};

export default Spinner;
