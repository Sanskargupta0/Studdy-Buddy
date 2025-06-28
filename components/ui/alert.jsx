import React from "react";
import { AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react"; // optional icons
import clsx from "clsx"; // or use your own `cn` helper

export function Alert({ className, children, variant = "default", ...props }) {
  const iconMap = {
    info: <Info className="h-4 w-4 text-blue-500" />,
    success: <CheckCircle className="h-4 w-4 text-green-500" />,
    error: <XCircle className="h-4 w-4 text-red-500" />,
    warning: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
    default: <Info className="h-4 w-4 text-gray-500" />,
  };

  return (
    <div
      role="alert"
      className={clsx(
        "relative w-full rounded-lg border p-4 flex gap-3 items-start text-sm bg-background",
        {
          "border-blue-200": variant === "info",
          "border-green-200": variant === "success",
          "border-red-200": variant === "error",
          "border-yellow-200": variant === "warning",
          "border-gray-200": variant === "default",
        },
        className
      )}
      {...props}
    >
      {iconMap[variant]}
      <div className="flex-1">{children}</div>
    </div>
  );
}

export function AlertTitle({ children, className }) {
  return <p className={clsx("font-semibold", className)}>{children}</p>;
}

export function AlertDescription({ children, className }) {
  return <p className={clsx("text-muted-foreground", className)}>{children}</p>;
}
