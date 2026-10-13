import { cn } from '@/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',

        secondary:
          'border-transparent bg-secondary text-secondary-foreground cursor-default',

        secondaryGradient:
          'border-transparent bg-[linear-gradient(278deg,_#F7D319_2%,_#F1D78B_130%)] text-secondary-foreground cursor-default',

        turboGradient:
          'border-none gap-1 px-2 rounded bg-[linear-gradient(95.91deg,#D43234_64.83%,#851D1F_149.65%)] text-white cursor-default',
        primaryGradient:
          'border-transparent bg-[linear-gradient(94.13deg,_#3160A5_18.13%,_#13253F_144.28%)] text-white cursor-default',

        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
        outline: 'text-foreground',
        glassy: 'bg-[#6D6D6D66] backdrop-blur-sm text-white border-none',
        pump:
          'border-transparent gap-1 bg-[rgb(63,186,206)] text-white cursor-default',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Badge({ className, variant, asChild = false, ...props }) {
  const Comp = asChild ? Slot : 'span';
  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
