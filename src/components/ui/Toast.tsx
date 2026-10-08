"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ToastContextType {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 2400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            "fixed bottom-6 right-6 z-[99999] px-4 py-2 bg-surface text-bone border border-bone/60",
            "font-mono text-xs uppercase tracking-dossier shadow-2xl flex items-center gap-2",
            "animate-in fade-in slide-in-from-bottom-2 duration-200"
          )}
        >
          <span className="w-2 h-2 rounded-full bg-sun animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </ToastContext.Provider>
  );
}
