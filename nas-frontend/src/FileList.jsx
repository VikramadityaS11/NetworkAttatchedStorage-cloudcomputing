import { useEffect, useState } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import API_BASE_URL from "./config";


function getFileIcon(filename) {
  const ext = filename?.split('.').pop().toLowerCase();
  if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return "🖼️";
  if (["zip", "rar", "7z"].includes(ext)) return "🗜️";
  if (["pdf"].includes(ext)) return "📄";
  if (["doc", "docx"].includes(ext)) return "📝";
  if (["mp4", "mkv", "mov"].includes(ext)) return "🎬";
  if (["mp3", "wav"].includes(ext)) return "🎵";
  if (["txt"].includes(ext)) return "📃";
  if (["exe"].includes(ext)) return "💾";
  return "📁";
}

function FileList({ searchTerm = "", refresh = 0}) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [textContent, setTextContent] = useState("");   // stores editable text
  const [isEditing, setIsEditing] = useState(false);    // toggle editing mode

  const [previewFile, setPreviewFile] = useState(null);
  const [previewType, setPreviewType] = useState(null);

  const API_BASE = API_BASE_URL

  const viewTextFile = async (filename) => {
    try {
      const res = await axios.get(
        `${API_BASE}/view/${encodeURIComponent(filename)}`,
        { responseType: "text" }
      );
      setTextContent(res.data);
      setPreviewFile(filename);
      setPreviewType("text");
      setIsEditing(true);
    } catch (err) {
      console.error(err);
      alert("Failed to load file");
    }
  };

  const saveTextFile = async (filename) => {
    try {
      await axios.put(
        `${API_BASE}/edit/${encodeURIComponent(filename)}`,
        { content: textContent },
        { headers: { "Content-Type": "application/json" } }
      );
      alert("File saved!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save file");
    }
  };

  useEffect(() => {

    axios.get(`${API_BASE}/files`)
      .then(res => {
        const filesArray = Array.isArray(res.data.files)
          ? res.data.files
          : Array.isArray(res.data)
            ? res.data
            : [];
        setFiles(filesArray);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load files:", err);
        setError("Failed to load files");
        setLoading(false);
      });
  }, [refresh]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  const filteredFiles = (files || []).filter(file =>
    (file.name || "").toLowerCase().includes((searchTerm || "").toLowerCase())
  );

  return (
    <div className="pt-10 px-20 overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4">My Files</h2>
      <table className="table-auto w-full text-left border-collapse border-2 border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">File Name</th>
            <th className="px-4 py-2">Size</th>
            <th className="px-4 py-2">Modified</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredFiles.map(file => (
            <tr key={file.name} className="border-b hover:bg-gray-50">
              {/* File Icon Column */}
              <td className="px-4 py-5">
                <span className="mr-2">{getFileIcon(file.name)}</span>
                {file.name}
              </td>
              {/* File Name Column */}
              <td className="px-4 py-5">
                {file.size_kb > 1024
                  ? `${(file.size_kb / 1024).toFixed(2)} MB`
                  : `${file.size_kb} KB`}
              </td>
              {/* Last Modified Column */}
              <td className="px-4 py-5">
                {file.modified
                  ? formatDistanceToNow(new Date(file.modified), { addSuffix: true })
                  : "-"}
              </td>
              {/* All Actions Column */}
              <td className="px-4 py-5 space-x-2">

                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => {
                    const ext = file.name.split(".").pop().toLowerCase();
                                        
                    if (["txt", "csv", "log"].includes(ext)) {
                      viewTextFile(file.name);
                    } else if (["mp4", "mkv", "mov"].includes(ext)) {
                      window.open(`${API_BASE}/view/${encodeURIComponent(file.name)}`, "_blank");
                    } else {
                      // maybe still handle PDFs or images if needed
                      window.open(
                        `http://127.0.0.1:8000/view/${encodeURIComponent(file.name)}`,
                        "_blank"
                      );
                    }

                  }}
                >
                  View
                </button>

                <button
                  className="text-blue-600 hover:underline"
                  onClick={() =>
                    window.open(`${API_BASE}/download/${encodeURIComponent(file.name)}`, "_blank")
                  }
                >
                  Download
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={async () => {
                    try {
                      await axios.delete(`${API_BASE}/delete`, {
                        data: { name: file.name },
                        headers: { "Content-Type": "application/json" },
                      });
                      setFiles(prev => (prev || []).filter(f => f.name !== file.name));
                    } catch (err) {
                      console.error(err);
                      alert("Failed to delete file");
                    }
                  }}
                >
                  Delete
                </button>
              </td>

            </tr>
          ))}
          {filteredFiles.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-5 text-center text-gray-500">
                No files found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Text editor preview */}
            {isEditing && (
              <div className="mt-6 w-3/4">
                <textarea
                  className="w-full h-96 border p-2"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                ></textarea>
                <div className="mt-2 space-x-2">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={() => saveTextFile(previewFile)}
                  >
                    Save
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-400 text-white rounded"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

    </div>
  );
}

export default FileList;
