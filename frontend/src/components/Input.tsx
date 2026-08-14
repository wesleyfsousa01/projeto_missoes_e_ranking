import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "../utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        <label className="text-sm font-medium text-white/80">{label}</label>
        <input
          ref={ref}
          className={cn(
            "px-3 py-2 bg-surface border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors",
            error
              ? "border-red-500 focus:border-red-500"
              : "border-white/10 focus:border-primary",
            className,
          )}
          {...props}
        />
        {error && (
          <span className="text-xs text-red-500 font-medium">{error}</span>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";
