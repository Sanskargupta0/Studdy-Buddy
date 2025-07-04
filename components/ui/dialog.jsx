import React from "react";

export function Dialog({ open, onOpenChange, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm transition-opacity duration-200"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-10 animate-dialog-pop-in">{children}</div>
    </div>
  );
}

Dialog.Content = function DialogContent({ children, onClose }) {
  return (
    <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-7 min-w-[340px] max-w-full w-full sm:min-w-[400px] transition-all duration-200">
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
        onClick={onClose}
        aria-label="Close dialog"
        type="button"
      >
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
      {children}
    </div>
  );
};

Dialog.Title = function DialogTitle({ children, icon }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      {icon && <span className="text-blue-600 dark:text-blue-400 text-xl">{icon}</span>}
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{children}</h2>
    </div>
  );
};

// Animations
// Add these to your global CSS (e.g., globals.css):
// .animate-fade-in { animation: fadeIn 0.2s; }
// .animate-dialog-pop-in { animation: dialogPopIn 0.22s cubic-bezier(0.4,0,0.2,1); }
// @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
// @keyframes dialogPopIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
