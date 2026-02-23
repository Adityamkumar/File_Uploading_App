import { useState } from "react";
import { Copy, Check, X, Share2 } from "lucide-react";

export default function ShareModal({ link, onClose }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-lg glass rounded-[2rem] border border-white/10 p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-4 mb-6 md:mb-8">
                    <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-500 shrink-0">
                        <Share2 className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                            Share Link
                        </h2>
                        <p className="text-xs md:text-sm text-zinc-400">
                            Anyone with this link can view the file.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3 bg-white/[0.03] border border-white/10 rounded-2xl p-2 sm:pl-4 group focus-within:border-blue-500/50 transition-all">
                        <input
                            value={link}
                            readOnly
                            className="flex-1 bg-transparent text-zinc-200 text-sm outline-none font-medium truncate py-2 px-2 sm:px-0"
                        />
                        <button
                            onClick={handleCopy}
                            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer shrink-0
                            ${copied 
                                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25" 
                                : "bg-white text-black hover:bg-zinc-200"}`}
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    <span>Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    <span>Copy</span>
                                </>
                            )}
                        </button>
                    </div>
                    
                    <p className="text-center text-[10px] md:text-xs text-zinc-500 px-2 italic">
                         The link is public and will never expire unless you delete the file.
                    </p>
                </div>
            </div>
        </div>
    );
}
