import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem as ShadcnDropdownMenuItem,
  DropdownMenuSeparator as ShadcnDropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export const DropdownMenuItem = ShadcnDropdownMenuItem;
export const DropdownMenuSeparator = ShadcnDropdownMenuSeparator;

export default function Dropdown({
  trigger,
  children,
  align = 'start',
  className,
  ...rest
}) {
  return (
    <DropdownMenu {...rest}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={className}>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
