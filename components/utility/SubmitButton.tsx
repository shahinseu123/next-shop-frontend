// components/ui/SubmitButton.tsx
"use client";

import { ReactNode } from "react";
import { Loader2, CheckCircle } from "lucide-react";

interface SubmitButtonProps {
  loading?: boolean;
  success?: boolean;
  disabled?: boolean;
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "danger" | "success";
  icon?: ReactNode;
  successMessage?: string;
}

export function SubmitButton({
  loading = false,
  success = false,
  disabled = false,
  children,
  onClick,
  type = "submit",
  fullWidth = true,
  size = "md",
  variant = "primary",
  icon,
  successMessage = "Success!",
}: SubmitButtonProps) {
  // Size classes
  const sizeClasses = {
    sm: "py-1.5 px-3 text-xs",
    md: "py-2.5 px-4 text-sm",
    lg: "py-3 px-6 text-base",
  };

  // Variant classes
  const variantClasses = {
    primary: loading || success || disabled
      ? "bg-indigo-400 cursor-not-allowed"
      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-200 hover:scale-[1.02] active:scale-98",
    secondary: loading || success || disabled
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-gradient-to-r from-gray-600 to-gray-700 hover:shadow-lg hover:shadow-gray-200 hover:scale-[1.02] active:scale-98",
    danger: loading || success || disabled
      ? "bg-red-400 cursor-not-allowed"
      : "bg-gradient-to-r from-red-600 to-red-700 hover:shadow-lg hover:shadow-red-200 hover:scale-[1.02] active:scale-98",
    success: loading || success || disabled
      ? "bg-green-400 cursor-not-allowed"
      : "bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg hover:shadow-green-200 hover:scale-[1.02] active:scale-98",
  };

  // Width classes
  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || success || disabled}
      className={`relative ${widthClass} ${sizeClasses[size]} rounded-xl font-medium transition-all duration-300 overflow-hidden group ${variantClasses[variant]}`}
    >
      <div className="flex items-center justify-center gap-2">
        {loading ? (
          <>
            {/* Elegant spinner */}
            <div className="relative w-4 h-4">
              <div className="absolute inset-0 rounded-full border-2 border-white/30"></div>
              <div className="absolute inset-0 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
            </div>
            <span className="text-white">Processing...</span>
          </>
        ) : success ? (
          <>
            <CheckCircle size={16} className="text-white animate-in fade-in zoom-in duration-300" />
            <span className="text-white">{successMessage}</span>
          </>
        ) : (
          <>
            {icon && (
              <span className="group-hover:scale-110 transition-transform duration-200">
                {icon}
              </span>
            )}
            <span className="text-white font-semibold">{children}</span>
          </>
        )}
      </div>

      {/* Shine effect on hover */}
      {!loading && !success && !disabled && (
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      )}
    </button>
  );
}

// Alternative with more loading animations
export function SubmitButtonWithDots({
  loading = false,
  disabled = false,
  children,
  type = "submit",
  fullWidth = true,
}: {
  loading?: boolean;
  disabled?: boolean;
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
}) {
  return (
    <button
      type={type}
      disabled={loading || disabled}
      className={`relative ${fullWidth ? "w-full" : ""} py-2.5 rounded-xl font-medium text-sm transition-all duration-300 overflow-hidden ${
        loading || disabled
          ? "bg-indigo-400 cursor-not-allowed"
          : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-200 hover:scale-[1.02] active:scale-98"
      }`}
    >
      <div className="flex items-center justify-center gap-2">
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-white">{children}</span>
          </div>
        ) : (
          <span className="text-white font-semibold">{children}</span>
        )}
      </div>
    </button>
  );
}