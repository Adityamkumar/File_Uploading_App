import { useState } from "react";

export default function ShareModal({ link, onClose }) {
    const handleCopy = async () => {
        await navigator.clipboard.writeText(link);
        setCopied(true)

        setTimeout(() => setCopied(false), 2000)
    };

    const [copied, setCopied] = useState(false)

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center px-3 justify-center z-50">
            <div className="relative w-full max-w-lg bg-zinc-900 rounded-xl p-6 shadow-lg">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 cursor-pointer text-gray-400 hover:text-white"
                >
                    ✕
                </button>

                <h2 className="text-lg font-semibold text-white mb-4">
                    Share file
                </h2>

                <div className="flex items-center gap-2 bg-zinc-800 rounded-lg p-2">
                    <input
                        value={link}
                        readOnly
                        className="flex-1 bg-transparent text-gray-200 text-sm outline-none px-2"
                    />
                    <button
                        onClick={handleCopy}
                        className={`cursor-pointer text-white text-sm px-4 py-2 rounded-lg transition
                        ${copied ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"}`}
                    >
                        {copied ? "Copied" : "Copy"}
                    </button>

                </div>
            </div>
        </div>
    );
}
