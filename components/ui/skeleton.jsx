import React from "react";
import clsx from "clsx"; // Or use your own cn() helper

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={clsx("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}
