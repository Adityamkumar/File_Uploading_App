import React from "react";

const SkeletonRow = () => (
  <div className="grid grid-cols-1 md:grid-cols-[1fr_120px_160px_140px] items-center gap-4 px-8 py-5 border-b border-white/5 animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-white/5 rounded-2xl" />
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-white/10 rounded w-[60%]" />
        <div className="h-3 bg-white/5 rounded w-[30%] md:hidden" />
      </div>
    </div>
    <div className="hidden md:block h-4 bg-white/5 rounded w-16" />
    <div className="hidden md:block h-4 bg-white/5 rounded w-24" />
    <div className="flex justify-end gap-2">
      <div className="w-9 h-9 bg-white/5 rounded-xl" />
      <div className="w-9 h-9 bg-white/5 rounded-xl" />
      <div className="w-9 h-9 bg-white/5 rounded-xl" />
    </div>
  </div>
);

const FileListSkeleton = () => {
    return (
        <div className="glass rounded-[2rem] border border-white/10 overflow-hidden">
            <div className="hidden md:grid grid-cols-[1fr_120px_160px_140px] gap-4 px-8 py-5 border-b border-white/5 bg-white/5">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-4 bg-white/10 rounded w-16" />)}
            </div>
            <div className="divide-y divide-white/5">
                {[1, 2, 3, 4, 5].map(i => <SkeletonRow key={i} />)}
            </div>
        </div>
    );
};

export default FileListSkeleton;
