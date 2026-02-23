import React, { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

const Toast = ({ message, type = "success", onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
  };

  const borders = {
    success: "border-emerald-500/20",
    error: "border-red-500/20",
    info: "border-blue-500/20",
  };

  return (
    <div className={`glass p-4 rounded-2xl border ${borders[type]} shadow-2xl flex items-center gap-4 min-w-[300px] animate-in slide-in-from-right-full fade-in duration-500`}>
      <div className="shrink-0">{icons[type]}</div>
      <p className="text-sm font-medium text-zinc-200 flex-1">{message}</p>
      <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-lg transition-colors">
        <X className="w-4 h-4 text-zinc-500" />
      </button>
      <div className="absolute bottom-0 left-0 h-1 bg-current opacity-20 transition-all duration-linear" style={{ width: '100%', animation: `shrink ${duration}ms linear forwards` }} />
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export const Toaster = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};
