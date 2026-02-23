import { formatFileSize } from "@/utils/utils";
import { Cloud, X, Upload, File } from "lucide-react";

export default function FileUploadBox({
  onFileChange,
  onUpload,
  uploading,
  errorMessage,
  selectedFile,
  onClose,
  handleCancel,
  uploadProgress = 0,
}) {
  return (
    <div className="glass rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-white/5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-500">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Upload Files
            </h3>
            <p className="text-sm text-zinc-400">
              Personal Storage • Workspace
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drop zone */}
      <div className="p-8">
        <label
          htmlFor="fileInput"
          className="relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed
            border-white/10 bg-white/[0.02] p-10 text-center
            hover:border-blue-500/50 hover:bg-blue-500/[0.02] transition-all group"
        >
          <div className="mb-4 p-4 bg-zinc-900 rounded-full group-hover:scale-110 transition-transform duration-300">
            <Cloud className="w-8 h-8 text-blue-500" />
          </div>

          <p className="text-lg font-semibold text-white mb-1">
            {selectedFile ? selectedFile.name : "Choose a file or drag it here"}
          </p>

          <p className="text-sm text-zinc-500">
            JPEG, PNG, PDF up to 10MB
          </p>

          <div className="mt-6 px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white group-hover:bg-white/10 transition-colors">
            Browse Files
          </div>
          
          {!uploading && (
            <input
              id="fileInput"
              type="file"
              className="hidden"
              onChange={onFileChange}
            />
          )}
        </label>

        {selectedFile && (
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
            <File className="w-4 h-4 text-blue-400" />
            <p className="text-sm text-blue-100 truncate flex-1">
              Ready to upload: <span className="font-semibold">{selectedFile.name}</span> ({formatFileSize(selectedFile.size)})
            </p>
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 animate-in shake duration-500">
            <div className="p-1.5 bg-red-500/20 rounded-lg">
                <Cloud className="w-4 h-4 text-red-500" />
            </div>
            <p className="text-sm font-semibold text-red-400">
                {errorMessage}
            </p>
          </div>
        )}
        
        {uploading && (
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-xs font-medium text-zinc-400 uppercase tracking-wider">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-3 w-full rounded-full bg-white/5 border border-white/5 p-0.5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 relative overflow-hidden"
                style={{ width: `${uploadProgress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 px-8 py-6 border-t border-white/5 bg-white/5 font-medium">
        <button
          onClick={handleCancel}
          className="px-6 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          Cancel
        </button>

        <button
          onClick={onUpload}
          disabled={!selectedFile || uploading}
          className="btn-gradient relative min-w-[140px] flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              <span>Processing</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span>Start Upload</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
