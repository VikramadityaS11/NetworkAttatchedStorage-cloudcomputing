import { useEffect, useState } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

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

  useEffect(() => {

    axios.get(`http://127.0.0.1:8000/files`)
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
              <td className="px-4 py-5">
                <span className="mr-2">{getFileIcon(file.name)}</span>
                {file.name}
              </td>
              <td className="px-4 py-5">
                {file.size_kb > 1024
                  ? `${(file.size_kb / 1024).toFixed(2)} MB`
                  : `${file.size_kb} KB`}
              </td>
              <td className="px-4 py-5">
                {file.modified
                  ? formatDistanceToNow(new Date(file.modified), { addSuffix: true })
                  : "-"}
              </td>
              <td className="px-4 py-5 space-x-2">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() =>
                    window.open(`http://127.0.0.1:8000/download/${encodeURIComponent(file.name)}`, "_blank")
                  }
                >
                  Download
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={async () => {
                    try {
                      await axios.delete(`http://127.0.0.1:8000/delete`, {
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
    </div>
  );
}

export default FileList;
