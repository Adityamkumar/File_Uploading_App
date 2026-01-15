import React from "react";

const DeleteConfirmModel = ({
  showDeleteModal,
  fileToDelete,
  deleting,
  handleCancelDelete,
  handleDelete,
}) => {
  return (
    showDeleteModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-full max-w-sm rounded-lg bg-white dark:bg-zinc-900 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Delete file?
          </h2>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to delete{" "}
            <span className="font-medium">{fileToDelete?.originalName}</span>?
            This action cannot be undone.
          </p>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={handleCancelDelete}
              disabled={deleting}
              className="rounded-lg cursor-pointer px-4 py-2 text-sm bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={() => handleDelete(fileToDelete)}
              disabled={deleting}
              className="flex items-center justify-center rounded-lg cursor-pointer px-4 py-2 text-sm bg-red-600 text-white disabled:opacity-60"
            >
              {deleting ? (
                <>
                  <span className="absolute h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span className="opacity-0">Delete</span>
                </>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default DeleteConfirmModel;
