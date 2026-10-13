import { cn } from '@/utils';
import {
  Tooltip as KitTooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function Tooltip({ children, content, className }) {
  return (
    <KitTooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className={cn('bg-white text-black', className)}>
        {content}
      </TooltipContent>
    </KitTooltip>
  );
}
