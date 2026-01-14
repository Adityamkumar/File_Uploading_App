import { formatFileSize } from "../utils/utils";

export default function FileUploadBox({
  onFileChange,
  onUpload,
  uploading,
  errorMessage,
  selectedFile,
  onClose,
  uploadProgress = { uploadProgress },
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-xl bg-white dark:bg-zinc-950 shadow-lg">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 dark:border-zinc-700">
              ☁️
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Upload files
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Select and upload the files of your choice
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        {/* Drop zone */}
        <div className="p-6">
          <label
            htmlFor="fileInput"
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed
              border-gray-300 dark:border-zinc-700 px-6 py-10 text-center
              hover:border-blue-500 transition"
          >
            <div className="mb-4 text-2xl">☁️</div>

            <p className="text-base font-medium text-gray-900 dark:text-gray-100">
              Choose a file or drag & drop it here
            </p>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              JPEG, PNG, PDF up to 40MB
            </p>

            <span
              className="mt-5 inline-flex items-center rounded-md border
              border-gray-300 dark:border-zinc-700 px-4 py-2 text-sm font-medium
              text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-900
              hover:bg-gray-50 dark:hover:bg-zinc-800"
            >
              Browse File
            </span>

            <input
              id="fileInput"
              type="file"
              className="hidden"
              onChange={onFileChange}
            />
          </label>

          {selectedFile && (
            <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 truncate">
              Selected: {selectedFile.name} {formatFileSize(selectedFile.size)}
            </p>
          )}

          {errorMessage && (
            <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
          )}
        </div>
        {uploading && (
          <div className="px-6 pb-2">
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-zinc-800">
              <div
                className="h-2 rounded-full bg-blue-600 transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 text-right">
              {uploadProgress}%
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-zinc-800">
          <button
            onClick={onClose}
            className="rounded-md cursor-pointer px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>

          <button
            onClick={onUpload}
            disabled={!selectedFile || uploading}
            className="relative cursor-pointer inline-flex items-center justify-center rounded-md bg-blue-600
              px-5 py-2 text-sm font-medium text-white
              hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <span className="absolute h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span className="opacity-0">Upload</span>
              </>
            ) : (
              "Upload"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
