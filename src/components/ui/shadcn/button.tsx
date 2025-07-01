import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const buttonVariants = {
  default: "bg-accent text-white hover:bg-accent/90",
  outline: "border border-accent text-accent bg-white hover:bg-accent/10",
  ghost: "bg-transparent hover:bg-accent/10 text-accent",
  link: "underline text-accent bg-transparent hover:text-accent/80",
};

const sizeVariants = {
  default: "px-4 py-2 text-base rounded",
  sm: "px-3 py-1.5 text-sm rounded-md",
  lg: "px-6 py-3 text-lg rounded-lg",
  icon: "p-2 rounded-full",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "transition-colors font-bold cursor-pointer focus:outline-none focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          buttonVariants[variant],
          sizeVariants[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
