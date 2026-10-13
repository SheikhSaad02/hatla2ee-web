import { Card } from '@/components/ui/card';
import { cn } from '@/utils';

const BaseCard = ({ children, className, ...rest }) => {
  return (
    <Card className={cn(className)} {...rest}>
      {children}
    </Card>
  );
};

export default BaseCard;
