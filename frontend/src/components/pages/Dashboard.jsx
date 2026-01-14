import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUploadBox from "../FileUploadBox";
import { Eye, Trash2 } from "lucide-react";
import { formatFileSize } from "../../utils/utils";

export default function Dashboard() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [showProfile, setShowProfile] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const navigate = useNavigate();

  // 🔐 Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/auth/user/me",
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
      await axios.get("http://localhost:3000/api/auth/user/logout", {
        withCredentials: true,
      });
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  // 📁 File selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // ⬆️ Upload file
  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setUploading(true);
      setErrorMessage("");
      setUploadProgress(0);

      await axios.post("http://localhost:3000/api/files/upload", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return;

          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );

          setUploadProgress(Math.min(percent, 99));
        },
      });
      setUploadProgress(100);
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadProgress(0);
        fetchFiles();
      }, 400);
      setSelectedFile(null);
    } catch (error) {
      const message = error.response?.data?.message || "File upload failed";
      setErrorMessage(message);
    } finally {
      setUploading(false);
    }
  };

  // 📄 Fetch files
  const fetchFiles = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/files", {
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
      await axios.delete(`http://localhost:3000/api/files/${id}`, {
        withCredentials: true,
      });
      fetchFiles();
    } catch (error) {
      console.log("Delete failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 border-b bg-white dark:bg-zinc-950">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          File Dashboard
        </h1>

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
            onFileSelect={setSelectedFile}
            onUpload={handleUpload}
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
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {file.originalName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <a
                      title="view"
                      href={file.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      <Eye />
                    </a>

                    <button
                      title="delete"
                      onClick={() => handleDelete(file._id)}
                      className="text-sm cursor-pointer text-red-600"
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
