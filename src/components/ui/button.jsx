import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/utils';
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary-900 disabled:bg-gray-300 disabled:text-white', //design system colors and disabled state
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/90',
        tertiary: `bg-primary-100 text-primary shadow-inner hover:shadow-[inset_0_0_0_1px_var(--color-primary-500),var(--shadow-btn)] disabled:bg-gray-300 disabled:text-white`,
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background text-gray-400 hover:bg-primary-200 hover:border-primary hover:text-primary dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline disabled:text-gray-600',
        glassy:
          'px-6 py-2 rounded-xl bg-[#6D6D6D66] backdrop-blur-sm text-white',
        primaryLight:
          'bg-primary-200 border-none shadow-[inset_0_0_1px_#0000001F] hover:inset-ring hover:inset-ring-primary-500 text-primary disabled:bg-gray-300 disabled:text-white ',
        grayLight:
          'bg-gray-50 border-none shadow-[inset_0_0_0.83px_#00000024] text-gray-800 hover:bg-gray-100 disabled:bg-gray-50 disabled:text-gray-400 disabled:shadow-none',
        pillActive: 'bg-primary-900 text-white hover:bg-primary-900',
        pillInactive: 'bg-transparent text-gray-600 hover:text-gray-900',
      },
      size: {
        default: 'h-8 md:h-9 px-4 py-2 has-[>svg]:px-3 rounded-md',
        sm: 'h-7 md:h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-4 [&_svg:not([class*="size-"])]:!size-[14px]',
        lg: 'h-9 md:h-10 rounded-md px-6 has-[>svg]:px-4',
        xl: 'h-10 md:h-11 text-sm md:text-base rounded-lg px-6 has-[>svg]:px-4 cursor-pointer',
        xxl: 'h-11 md:h-12 text-sm md:text-lg font-semibold rounded-lg px-3 has-[>svg]:px-4',
        pill: 'rounded-full px-3 py-1.5 text-sm font-semibold sm:px-4 sm:py-2 sm:text-base',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
