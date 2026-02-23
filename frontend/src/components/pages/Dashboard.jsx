import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import FileUploadBox from "@/components/FileUploadBox";
import { ArrowDownToLine, Share2, Trash2, Cloud, LogOut, Plus, Search, FileText, Image as ImageIcon, FileCode, Monitor, ChevronUp, ChevronDown, MousePointer2, X } from "lucide-react";
import { formatFileSize } from "@/utils/utils";
import DeleteConfirmModel from "@/components/DeleteConfirmModel";
import { formatTimeAgo } from "@/utils/time.js";
import ShareModel from "@/components/ShareModel.jsx"
import DotGrid from "@/components/DotGrid";
import FilePreviewModal from "@/components/FilePreviewModal";
import FileListSkeleton from "@/components/FileListSkeleton";
import { Toaster } from "@/components/Toast";
import api from '@/api'

export default function Dashboard() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewFile, setPreviewFile] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  
  // Advanced UX States
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [toasts, setToasts] = useState([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  
  // 🆕 Batch & Filter States
  const [selectedFileIds, setSelectedFileIds] = useState(new Set());
  const [activeFilter, setActiveFilter] = useState('all');
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);
  const navigate = useNavigate();

  // 🍞 Toast Helpers
  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // 🔐 Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await api.get(`/api/auth/user/me`, { withCredentials: true });
        setUserEmail(response.data.user.email);
      } catch (error) {
        navigate("/login");
      }
    };
    fetchCurrentUser();
  }, [navigate]);

  // 🚪 Logout
  const logoutUser = async () => {
    try {
      await api.get(`/api/auth/user/logout`, { withCredentials: true });
      navigate("/");
    } catch (error) {
      addToast("Logout failed", "error");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const resetUploadState = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setErrorMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async (fileToUpload = null) => {
    const file = fileToUpload || selectedFile;
    if (!file) {
      setErrorMessage("Please select a file");
      return;
    }
    const fileExists = files.some(f => f.originalName === file.name);
    if (fileExists) {
      setErrorMessage(`${file.name} already exists in your storage.`);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    abortControllerRef.current = new AbortController();
    try {
      setUploading(true);
      setErrorMessage("");
      setUploadProgress(0);
      await api.post(`/api/files/upload`, formData, {
        withCredentials: true,
        signal: abortControllerRef.current.signal,
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return;
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });
      setUploadProgress(100);
      addToast(`${file.name} uploaded successfully!`);
      setTimeout(() => {
        resetUploadState();
        setShowUploadModal(false);
        fetchFiles();
      }, 400);
    } catch (error) {
      if (error.name === "CanceledError") return;
      const message = error.response?.data?.message || "File upload failed";
      setErrorMessage(message);
      addToast(message, "error");
    } finally {
      setUploading(false);
      abortControllerRef.current = null;
    }
  };

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/files`, { withCredentials: true });
      setFiles(response.data.files);
    } catch (error) {
      addToast("Failed to fetch files", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDelete = async (file) => {
    try {
      setDeleting(true);
      await api.delete(`/api/files/${file._id}`, { withCredentials: true });
      setShowDeleteModal(false);
      setFileToDelete(null);
      addToast(`"${file.originalName}" deleted`);
      fetchFiles();
    } catch (error) {
      addToast("Delete failed", "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleShare = async (fileId) => {
    try {
      const response = await api.post(`/api/files/${fileId}/share`, {}, { withCredentials: true });
      setShareLink(response.data.shareUrl);
      setShowShareModal(true);
    } catch (error) {
      addToast("Failed to generate link", "error");
    }
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedFiles = [...files].sort((a, b) => {
    let aVal = a[sortConfig.key];
    let bVal = b[sortConfig.key];
    
    if (sortConfig.key === 'originalName') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
    }
    
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredFiles = sortedFiles.filter(file => {
    const matchesSearch = file.originalName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      activeFilter === 'all' || 
      (activeFilter === 'image' && file.type?.startsWith('image/')) ||
      (activeFilter === 'pdf' && file.type === 'application/pdf') ||
      (activeFilter === 'document' && (file.type?.includes('text') || file.type?.includes('doc') || file.type?.includes('xls'))) ||
      (activeFilter === 'other' && !file.type?.startsWith('image/') && file.type !== 'application/pdf' && !file.type?.includes('text') && !file.type?.includes('doc') && !file.type?.includes('xls'));
    
    return matchesSearch && matchesFilter;
  });

  const getFileIcon = (mimeType) => {
    if (!mimeType) return <FileCode className="text-gray-400" />;
    if (mimeType === "application/pdf") return <FileText className="text-red-500" />;
    if (mimeType.startsWith("image/")) return <ImageIcon className="text-blue-500" />;
    return <FileCode className="text-gray-400" />;
  };

  // 🆕 Selection & Bulk Logic
  const toggleSelectAll = () => {
    if (selectedFileIds.size === filteredFiles.length) {
      setSelectedFileIds(new Set());
    } else {
      setSelectedFileIds(new Set(filteredFiles.map(f => f._id)));
    }
  };

  const toggleSelectFile = (id) => {
    const next = new Set(selectedFileIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedFileIds(next);
  };

  const handleBulkDelete = async () => {
    try {
      setIsBulkDeleting(true);
      const ids = Array.from(selectedFileIds);
      // We'll perform deletions sequentially or concurrently with Promise.all
      // Note: Ideal backend would have a bulk delete endpoint
      await Promise.all(ids.map(id => api.delete(`/api/files/${id}`, { withCredentials: true })));
      addToast(`${ids.length} files deleted successfully`);
      setSelectedFileIds(new Set());
      fetchFiles();
    } catch (error) {
      addToast("Failed to delete some files", "error");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleBulkDownload = async () => {
    // Standard approach: trigger individual downloads
    selectedFileIds.forEach(id => {
      const file = files.find(f => f._id === id);
      if (file) {
        const link = document.createElement('a');
        link.href = `${file.fileUrl}?ik-attachment=true`;
        link.setAttribute('download', file.originalName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
    addToast(`Starting download of ${selectedFileIds.size} files`);
  };

  const handleCancel = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    resetUploadState();
    setUploading(false);
    setShowUploadModal(false);
  };

  // 🎯 Global Drag & Drop Handlers
  const onDragOver = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const onDragLeave = () => setIsDraggingOver(false);

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setShowUploadModal(true);
      handleUpload(file);
    }
  };

  const SortIcon = ({ colKey }) => {
    if (sortConfig.key !== colKey) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />;
  };

  return (
    <div 
        className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-blue-500/30 overflow-hidden relative"
        onDragOver={onDragOver}
        onDrop={onDrop}
    >
      <DotGrid 
        dotSize={2} 
        gap={40} 
        baseColor="rgba(255,255,255,0.05)" 
        activeColor="rgba(59,130,246,0.3)" 
        className="fixed inset-0 pointer-events-none opacity-50"
      />
      
      {/* 🌪️ Global Drag Overlay */}
      {isDraggingOver && (
        <div 
            className="fixed inset-0 z-[200] bg-blue-600/10 backdrop-blur-xl border-4 border-dashed border-blue-500/50 m-4 rounded-[4rem] flex flex-col items-center justify-center transition-all animate-in fade-in duration-300"
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
        >
            <div className="p-8 bg-blue-500/20 rounded-full mb-6 pointer-events-none">
                <MousePointer2 className="w-16 h-16 text-blue-500" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-2 pointer-events-none">Drop it like it's hot</h2>
            <p className="text-blue-400 font-medium pointer-events-none">Release to start uploading your file instantly</p>
        </div>
      )}

      {/* Dynamic Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Toaster */}
      <Toaster toasts={toasts} removeToast={removeToast} />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between glass px-6 py-3 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
             <div className="p-2 bg-blue-600/20 rounded-xl group-hover:bg-blue-600/30 transition-colors">
                <Cloud className="w-6 h-6 text-blue-500" />
             </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Drop<span className="text-blue-500">ly</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-400">
              <Monitor className="w-3.5 h-3.5" />
              <span>Personal Workspace</span>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer overflow-hidden"
              >
                {userEmail ? userEmail.charAt(0).toUpperCase() : "?"}
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-3 w-64 bg-zinc-950 p-2 rounded-2xl border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-3 border-b border-white/5">
                    <p className="text-xs text-zinc-500 mb-1">Signed in as</p>
                    <p className="font-semibold truncate text-zinc-200">{userEmail}</p>
                  </div>
                  <button
                    onClick={logoutUser}
                    className="w-full mt-1 flex items-center gap-3 px-4 py-2.5 text-left text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="relative pt-32 pb-20 px-6 max-w-6xl mx-auto min-h-screen">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="animate-in fade-in slide-in-from-left-4 duration-700">
            <h2 className="text-4xl font-bold mb-2">My Storage</h2>
            <p className="text-zinc-400">Manage and share your files securely.</p>
          </div>
          
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
               <input 
                type="text" 
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
               />
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn-gradient flex items-center gap-2 cursor-pointer group"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span>Upload</span>
            </button>
          </div>
        </div>

        {/* 🆕 Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
           {['all', 'image', 'pdf', 'document', 'other'].map(filter => (
             <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer border ${activeFilter === filter ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25' : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10'}`}
             >
                {filter}
             </button>
           ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
           <div className="glass p-6 rounded-3xl border border-white/10 group hover:border-blue-500/30 transition-all duration-500">
               <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                     <FileCode className="w-6 h-6" />
                  </div>
                  <div>
                     <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Total Files</p>
                     <p className="text-2xl font-bold">{files.length}</p>
                  </div>
               </div>
               <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min((files.length / 50) * 100, 100)}%` }} />
               </div>
           </div>

           <div className="glass p-6 rounded-3xl border border-white/10 group hover:border-purple-500/30 transition-all duration-500">
               <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500">
                     <Cloud className="w-6 h-6" />
                  </div>
                  <div>
                     <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Storage Used</p>
                     <p className="text-2xl font-bold">
                        {formatFileSize(files.reduce((acc, file) => acc + (file.size || 0), 0))}
                     </p>
                  </div>
               </div>
               <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.min((files.reduce((acc, file) => acc + (file.size || 0), 0) / (500 * 1024 * 1024)) * 100, 100)}%` }} 
                  />
               </div>
           </div>

           <div className="glass p-6 rounded-3xl border border-white/10 group hover:border-emerald-500/30 transition-all duration-500 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                     <Monitor className="w-6 h-6" />
                  </div>
                  <div>
                     <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Account Tier</p>
                     <p className="text-2xl font-bold text-emerald-400">Free</p>
                  </div>
               </div>
               <div className="px-3 py-1 bg-emerald-500/10 rounded-full text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                  Active
               </div>
           </div>
        </div>

        {/* Files Area */}
        <div className="min-h-[400px]">
          {loading ? (
            <FileListSkeleton />
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[500px] glass rounded-3xl border border-white/5 relative overflow-hidden group animate-in fade-in duration-700">
               <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none" />
               <div className="relative">
                  <div className="w-32 h-32 bg-blue-600/10 rounded-full flex items-center justify-center mb-8 relative">
                     <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping duration-[3000ms]" />
                     <Cloud className="w-16 h-16 text-blue-500 relative z-10" />
                  </div>
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-purple-600/20 rounded-2xl flex items-center justify-center animate-bounce duration-[4000ms]">
                    <FileText className="w-6 h-6 text-purple-500" />
                  </div>
                  <div className="absolute -bottom-2 -left-6 w-10 h-10 bg-emerald-600/20 rounded-2xl flex items-center justify-center animate-bounce duration-[5000ms] delay-500">
                    <ImageIcon className="w-5 h-5 text-emerald-500" />
                  </div>
               </div>
               <h3 className="text-2xl font-bold mb-3 tracking-tight">Your vault is empty</h3>
               <p className="text-zinc-400 max-w-sm text-center leading-relaxed">
                  Start secure cloud storage today. Drag your files here or use the upload button to get started.
               </p>
               <button 
                  onClick={() => setShowUploadModal(true)}
                  className="mt-8 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2"
               >
                  <Plus className="w-4 h-4" />
                  <span>Upload your first file</span>
               </button>
            </div>
          ) : (
            <div className="glass rounded-[2rem] border border-white/10 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="hidden md:grid grid-cols-[40px_1fr_120px_160px_140px] gap-4 px-8 py-5 text-sm font-semibold text-zinc-500 border-b border-white/5 bg-white/5">
                <div className="flex items-center">
                    <input 
                        type="checkbox" 
                        checked={selectedFileIds.size === filteredFiles.length && filteredFiles.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-white/10 bg-white/5 accent-blue-600 cursor-pointer"
                    />
                </div>
                <div onClick={() => handleSort('originalName')} className="flex items-center cursor-pointer hover:text-white transition-colors">
                    NAME <SortIcon colKey="originalName" />
                </div>
                <div onClick={() => handleSort('size')} className="flex items-center cursor-pointer hover:text-white transition-colors">
                    SIZE <SortIcon colKey="size" />
                </div>
                <div onClick={() => handleSort('createdAt')} className="flex items-center cursor-pointer hover:text-white transition-colors">
                    DATE <SortIcon colKey="createdAt" />
                </div>
                <div className="text-right">ACTIONS</div>
              </div>
              
              <div className="divide-y divide-white/5">
                {(filteredFiles.length > 0 ? filteredFiles : []).map((file, idx) => (
                  <div
                    key={file._id}
                    className={`grid grid-cols-1 md:grid-cols-[40px_1fr_120px_160px_140px] items-center gap-4 px-8 py-5 transition-all group cursor-pointer animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both ${selectedFileIds.has(file._id) ? 'bg-blue-600/10' : 'hover:bg-white/[0.03]'}`}
                    style={{ animationDelay: `${idx * 40}ms` }}
                    onClick={() => { setPreviewFile(file); setShowPreviewModal(true); }}
                  >
                    <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                        <input 
                            type="checkbox" 
                            checked={selectedFileIds.has(file._id)}
                            onChange={() => toggleSelectFile(file._id)}
                            className="w-4 h-4 rounded border-white/10 bg-white/5 accent-blue-600 cursor-pointer"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-zinc-100 truncate group-hover:text-blue-400 transition-colors">
                          {file.originalName}
                        </p>
                        <p className="text-xs text-zinc-500 block md:hidden mt-1">
                          {formatFileSize(file.size)} • {formatTimeAgo(file.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="hidden md:block text-sm text-zinc-400 font-medium tracking-tight">
                       {formatFileSize(file.size)}
                    </div>
                    
                    <div className="hidden md:block text-sm text-zinc-400 font-medium">
                       {formatTimeAgo(file.createdAt)}
                    </div>

                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                       <button
                         title="Share"
                         onClick={() => handleShare(file._id)}
                         className="p-2.5 rounded-xl text-zinc-100 hover:bg-blue-500/20 hover:text-blue-400 transition-all cursor-pointer"
                       >
                         <Share2 className="w-5 h-5" />
                       </button>
                       <a
                         title="Download"
                         href={`${file.fileUrl}?ik-attachment=true`}
                         className="p-2.5 rounded-xl text-zinc-100 hover:bg-emerald-500/20 hover:text-emerald-400 transition-all cursor-pointer"
                       >
                         <ArrowDownToLine className="w-5 h-5" />
                       </a>
                       <button
                         title="Delete"
                         onClick={() => {
                           setFileToDelete(file);
                           setShowDeleteModal(true);
                         }}
                         className="p-2.5 rounded-xl text-zinc-100 hover:bg-red-500/20 hover:text-red-400 transition-all cursor-pointer"
                       >
                         <Trash2 className="w-5 h-5" />
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {showUploadModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-lg animate-in zoom-in-95 duration-300">
              <FileUploadBox
                selectedFile={selectedFile}
                uploading={uploading}
                errorMessage={errorMessage}
                onFileChange={handleFileChange}
                uploadProgress={uploadProgress}
                handleCancel={handleCancel}
                onUpload={handleUpload}
                onClose={() => setShowUploadModal(false)}
              />
            </div>
          </div>
      )}

      <DeleteConfirmModel
        showDeleteModal={showDeleteModal}
        fileToDelete={fileToDelete}
        deleting={deleting}
        handleCancelDelete={() => { setShowDeleteModal(false); setFileToDelete(null); }}
        handleDelete={handleDelete}
      />

      {showShareModal && (
        <ShareModel
          link={shareLink}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {showPreviewModal && (
        <FilePreviewModal 
            file={previewFile} 
            onClose={() => setShowPreviewModal(false)} 
            onShare={handleShare}
        />
      )}

      {/* 🆕 Floating Bulk Actions Bar */}
      {selectedFileIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-fit animate-in slide-in-from-bottom-10 fade-in duration-500">
          <div className="glass flex items-center gap-2 md:gap-6 px-4 md:px-8 py-3 md:py-4 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-zinc-950/80">
            <div className="flex items-center gap-2 md:gap-3 pr-2 md:pr-6 border-r border-white/10">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-blue-600 flex items-center justify-center text-[10px] md:text-xs font-bold text-white shadow-lg shadow-blue-600/20">
                {selectedFileIds.size}
              </div>
              <span className="text-xs md:text-sm font-bold text-zinc-300 hidden sm:inline">Selected</span>
            </div>
            
            <div className="flex items-center gap-1 md:gap-2">
              <button 
                onClick={handleBulkDownload}
                className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 transition-all text-xs md:text-sm font-semibold cursor-pointer"
              >
                <ArrowDownToLine className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden xs:inline">Download</span>
              </button>
              
              <button 
                disabled={isBulkDeleting}
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-red-400 hover:text-white hover:bg-red-500 transition-all text-xs md:text-sm font-semibold cursor-pointer disabled:opacity-50"
              >
                {isBulkDeleting ? (
                    <div className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                    <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                )}
                <span className="hidden xs:inline">Delete</span>
              </button>
            </div>

            <button 
              onClick={() => setSelectedFileIds(new Set())}
              className="ml-1 md:ml-2 p-1.5 md:p-2 rounded-lg text-zinc-500 hover:text-white transition-colors cursor-pointer"
              title="Cancel selection"
            >
              <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
