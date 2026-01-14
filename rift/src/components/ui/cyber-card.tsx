import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const cyberCardVariants = cva(
  "relative border transition-all duration-300",
  {
    variants: {
      variant: {
        default: "cyber-card border-glow",
        feature: "cyber-card hover:border-glow-lg",
        hero: "cyber-card border-glow-lg",
      },
      padding: {
        default: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
);

export interface CyberCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cyberCardVariants> {}

const CyberCard = React.forwardRef<HTMLDivElement, CyberCardProps>(
  ({ className, variant, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cyberCardVariants({ variant, padding, className }))}
        {...props}
      />
    );
  }
);
CyberCard.displayName = "CyberCard";

const CyberCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-4 mb-4", className)}
    {...props}
  />
));
CyberCardHeader.displayName = "CyberCardHeader";

const CyberCardIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-center w-12 h-12 border border-border bg-secondary/50",
      className
    )}
    {...props}
  />
));
CyberCardIcon.displayName = "CyberCardIcon";

const CyberCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-display text-lg tracking-wider uppercase text-foreground",
      className
    )}
    {...props}
  />
));
CyberCardTitle.displayName = "CyberCardTitle";

const CyberCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-muted-foreground leading-relaxed", className)}
    {...props}
  />
));
CyberCardDescription.displayName = "CyberCardDescription";

export {
  CyberCard,
  CyberCardHeader,
  CyberCardIcon,
  CyberCardTitle,
  CyberCardDescription,
  cyberCardVariants,
};