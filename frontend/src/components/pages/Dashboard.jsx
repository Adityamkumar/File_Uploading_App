import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUploadBox from "../FileUploadBox";
import { ArrowDownToLine, Share2, Trash2 } from "lucide-react";
import { formatFileSize } from "../../utils/utils";
import DeleteConfirmModel from "../DeleteConfirmModel";
import { formatTimeAgo } from "../../utils/time.js";
import  ShareModel  from "../ShareModel.jsx"
import { API_BASE_URL } from "../../config/api.js";

export default function Dashboard() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
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


  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);

  const navigate = useNavigate();

  // 🔐 Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/auth/user/me`,
          { withCredentials: true }
        );
        setUserEmail(response.data.user.email);
      } catch (error) {
        console.log(error);
        navigate("/login");
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  // 🚪 Logout
  const logoutUser = async () => {
    try {
      await axios.get(`${API_BASE_URL}/api/auth/user/logout`, {
        withCredentials: true,
      });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  // 📁 File selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const resetUploadState = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setErrorMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ⬆️ Upload file
  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    abortControllerRef.current = new AbortController();

    try {
      setUploading(true);
      setErrorMessage("");
      setUploadProgress(0);

      await axios.post(`${API_BASE_URL}/api/files/upload`, formData, {
        withCredentials: true,
        signal: abortControllerRef.current.signal,
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return;

          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );

          setUploadProgress(percent);
        },
      });
      setUploadProgress(100);
      setTimeout(() => {
        resetUploadState();
        setShowUploadModal(false);
        fetchFiles();
      }, 400);
      setSelectedFile(null);
    } catch (error) {
      if (error.name === "CanceledError") {
        console.log("Upload cancelled");
        return;
      }
      const message = error.response?.data?.message || "File upload failed";
      setErrorMessage(message);
    } finally {
      setUploading(false);
      abortControllerRef.current = null;
    }
  };

  // 📄 Fetch files
  const fetchFiles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/files`, {
        withCredentials: true,
      });
      setFiles(response.data.files);
    } catch (error) {
      console.log("Failed to fetch files", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // ❌ Delete file
  const handleDelete = async (id) => {
    try {
      setDeleting(true);

      await axios.delete(`${API_BASE_URL}/api/files/${id}`, {
        withCredentials: true,
      });
      setShowDeleteModal(false);
      setFileToDelete(null);
      fetchFiles();
    } catch (error) {
      console.log("Delete failed", error);
    } finally {
      setDeleting(false);
    }
  };

  const getFileIcon = (mimeType) => {
    if (!mimeType) return "📁";
    if (mimeType === "application/pdf") {
      return <img className="w-6" src="/pdf.png" alt="PDF" />;
    }

    if (mimeType.startsWith("image/")) {
      return <img className="w-6" src="/img.png" alt="Image" />;
    }

    return null;
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    resetUploadState();
    setUploading(false);
    setShowUploadModal(false);
  };

  const handleCancelDelete = () => {
    if (deleting) return;

    setShowDeleteModal(false);
    setFileToDelete(null);
  };

  const handleShare = async (fileId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/files/${fileId}/share`, {}, {
        withCredentials: true
      })
      setShareLink(response.data.shareUrl)
      setShowShareModal(true)
    } catch (error) {
      console.log("Share failed", error)
    }
  }

 


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 border-b bg-white dark:bg-zinc-950">
        <div className="flex gap-1">
          <h1 className="text-lg text-white font-semibold">Droply</h1>
          <div className="h-8 w-8 "><img className="w-8 object-cover" src="/cloud.png" alt="logo" /></div>
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="w-10 h-10 cursor-pointer rounded-full bg-blue-600 text-white font-semibold"
          >
            {userEmail.charAt(0).toUpperCase()}
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 rounded-lg border bg-white dark:bg-zinc-950 shadow-md">
              <div className="px-4 py-3 text-white text-sm">
                Signed in as
                <div className="font-medium text-white truncate mt-1">
                  {userEmail}
                </div>
              </div>
              <button
                onClick={logoutUser}
                className="w-full cursor-pointer px-4 py-2 text-left text-red-600 hover:bg-gray-100 dark:hover:bg-zinc-900"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Upload */}
        {showUploadModal && (
          <FileUploadBox
            selectedFile={selectedFile}
            uploading={uploading}
            errorMessage={errorMessage}
            onFileChange={handleFileChange}
            uploadProgress={uploadProgress}
            handleCancel={handleCancel}
            onUpload={handleUpload}
            fileInputRef={fileInputRef}
            onClose={() => setShowUploadModal(false)}
          />
        )}

        <button
          onClick={() => setShowUploadModal(true)}
          className="mb-6 rounded-md cursor-pointer bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700"
        >
          Upload File
        </button>

        {/* Files */}
        <section>
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Your Files
          </h2>

          <div
            className="rounded-lg border border-gray-200 dark:border-zinc-800
    bg-white dark:bg-zinc-950"
          >
            {files.length === 0 ? (
              <p className="p-4 text-sm text-gray-600 dark:text-gray-400">
                No files uploaded yet.
              </p>
            ) : (
              files.map((file) => (
                <div
                  key={file._id}
                  className="flex items-center justify-between px-4 py-3
            border-t border-gray-200 dark:border-zinc-800"
                >
                  <div className="md:flex  gap-2 items-center">
                    <span className="text-sm">{getFileIcon(file.type)}</span>

                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {file.originalName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(file.createdAt)}
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <button
                      title="Share"
                      onClick={() => handleShare(file._id)}
                      className="text-blue-500 hover:text-blue-400 cursor-pointer"
                    >
                      <Share2 />
                    </button>
                    <a
                      title="Download"
                      href={`${file.fileUrl}?ik-attachment=true`}
                    >
                      <ArrowDownToLine color="green" size={28} />
                    </a>

                    <button
                      title="delete"
                      onClick={() => {
                        setFileToDelete(file._id);
                        setShowDeleteModal(true);
                      }}
                      className="text-sm cursor-pointer text-red-600"
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <DeleteConfirmModel
            showDeleteModal={showDeleteModal}
            fileToDelete={fileToDelete}
            deleting={deleting}
            handleCancelDelete={handleCancelDelete}
            handleDelete={handleDelete}
          />
          {showShareModal &&(
            <ShareModel
              link={shareLink}
              onClose={() => setShowShareModal(false)}
            />
          )}

        </section>
      </main>
    </div>
  );
}
