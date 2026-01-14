import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const cyberButtonVariants = cva(
  "inline-flex items-center justify-center gap-3 whitespace-nowrap text-sm font-medium tracking-widest uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-secondary border border-border text-foreground hover:bg-secondary/80 hover:border-glow",
        primary:
          "bg-primary/20 border-2 border-primary text-foreground hover:bg-primary/30 border-glow-lg text-glow-sm",
        ghost:
          "border border-transparent text-foreground hover:border-border hover:bg-secondary/50",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-secondary/30",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 px-4 py-2 text-xs",
        lg: "h-14 px-8 py-4 text-base",
        xl: "h-16 px-12 py-5 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface CyberButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof cyberButtonVariants> {
  asChild?: boolean;
}

const CyberButton = React.forwardRef<HTMLButtonElement, CyberButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(cyberButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

CyberButton.displayName = "CyberButton";

export { CyberButton, cyberButtonVariants };