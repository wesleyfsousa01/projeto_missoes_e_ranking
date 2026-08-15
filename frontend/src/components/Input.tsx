import { forwardRef, useState } from "react";
import type { InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = props.type === "password";

    return (
      <div className="flex flex-col gap-1 w-full">
        <label className="text-sm font-medium text-white/80">{label}</label>
        <div className="relative w-full">
          <input
            ref={ref}
            className={cn(
              "w-full px-3 py-2 bg-surface border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors",
              isPassword && "pr-10",
              error
                ? "border-red-500 focus:border-red-500"
                : "border-white/10 focus:border-primary",
              className,
            )}
            {...props}
            type={
              isPassword ? (showPassword ? "text" : "password") : props.type
            }
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
              title={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
        {error && (
          <span className="text-xs text-red-500 font-medium">{error}</span>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";
