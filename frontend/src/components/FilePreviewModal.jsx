import React from "react";
import { X, Download, Share2, FileText, Image as ImageIcon, FileCode, Monitor, ExternalLink } from "lucide-react";
import { formatFileSize } from "@/utils/utils";
import { formatTimeAgo } from "@/utils/time.js";

const FilePreviewModal = ({ file, onClose, onShare }) => {
  if (!file) return null;

  const isImage = file.type?.startsWith("image/");
  const isPdf = file.type === "application/pdf";

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="relative w-full max-w-5xl h-full max-h-[90vh] glass rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/20 text-blue-500">
              {isImage ? <ImageIcon className="w-5 h-5" /> : isPdf ? <FileText className="w-5 h-5" /> : <FileCode className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-white truncate tracking-tight">
                {file.originalName}
              </h3>
              <p className="text-xs text-zinc-400">
                {formatFileSize(file.size)} • {formatTimeAgo(file.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
                onClick={() => onShare(file._id)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                title="Share"
            >
                <Share2 className="w-5 h-5" />
            </button>
            <a
                href={`${file.fileUrl}?ik-attachment=true`}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                title="Download"
            >
                <Download className="w-5 h-5" />
            </a>
            <button
                onClick={onClose}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer border-l border-white/5 ml-2"
            >
                <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-zinc-950/50 overflow-auto flex items-center justify-center p-4 md:p-8">
            {isImage ? (
                <img 
                    src={file.fileUrl} 
                    alt={file.originalName} 
                    onDragStart={(e) => e.preventDefault()}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in fade-in zoom-in duration-500 select-none"
                />
            ) : isPdf ? (
                <iframe 
                    src={file.fileUrl} 
                    className="w-full h-full rounded-lg border border-white/5 bg-white shadow-2xl"
                    title={file.originalName}
                />
            ) : (
                <div className="text-center p-12 glass rounded-3xl max-w-md border-dashed border-white/10">
                    <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 mx-auto">
                        <FileCode className="w-10 h-10 text-zinc-500" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">No Preview Available</h4>
                    <p className="text-zinc-400 mb-8 lowercase">
                        We can't preview this file type directly. Please download it to view the content.
                    </p>
                    <a
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-gradient inline-flex items-center gap-2"
                    >
                        <ExternalLink className="w-4 h-4" />
                        <span>Open in New Tab</span>
                    </a>
                </div>
            )}
        </div>

        {/* Bottom Bar (Optional) */}
        <div className="px-6 py-4 border-t border-white/5 bg-white/5 text-center">
            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-medium">
                Droply Secure Cloud Storage • Encrypted Preview
            </p>
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
