import {
  Alert as KitAlert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';

const Alert = (props) => {
  const {
    title,
    description,
    variant = 'destructive',
    className,
    titleClassName,
    icon,
  } = props;
  return (
    <KitAlert variant={variant} className={className}>
      {icon && icon}
      {title && (
        <AlertTitle titleClassName={titleClassName}>{title}</AlertTitle>
      )}
      {description && <AlertDescription>{description}</AlertDescription>}
    </KitAlert>
  );
};

export default Alert;
