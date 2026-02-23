import React from "react";
import { AlertCircle, Trash2, X } from "lucide-react";

const DeleteConfirmModel = ({
  showDeleteModal,
  fileToDelete,
  deleting,
  handleCancelDelete,
  handleDelete,
}) => {
  if (!showDeleteModal) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md glass rounded-[2rem] border border-white/10 p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        <button
          onClick={handleCancelDelete}
          className="absolute top-6 right-6 p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 mb-6">
                <AlertCircle className="w-8 h-8" />
            </div>
            
            <h2 className="text-2xl font-bold text-white tracking-tight mb-3">
               Delete File?
            </h2>

            <p className="text-zinc-400 leading-relaxed mb-8">
                Are you sure you want to delete <span className="text-white font-semibold">"{fileToDelete?.originalName}"</span>? 
                This action is permanent and cannot be undone.
            </p>

            <div className="flex items-center gap-3 w-full">
                <button
                    onClick={handleCancelDelete}
                    disabled={deleting}
                    className="flex-1 px-6 py-3 rounded-xl font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer disabled:opacity-50"
                >
                    Cancel
                </button>

                <button
                    onClick={() => handleDelete(fileToDelete)}
                    disabled={deleting}
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-red-600/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {deleting ? (
                        <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            <span>Deleting</span>
                        </>
                    ) : (
                        <>
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                        </>
                    )}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModel;
