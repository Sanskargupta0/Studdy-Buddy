"use client";

import { useZenMode } from "@/app/provider";

export default function ZenModeContainer({ children, className = "" }) {
  const { zenMode } = useZenMode();
  
  return (
    <div className={`${zenMode ? 'zen-mode-container' : ''} ${className}`}>
      {children}
    </div>
  );
} 