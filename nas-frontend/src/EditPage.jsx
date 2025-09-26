import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "./config";

function EditPage() {
  const { filename } = useParams();
  const [content, setContent] = useState("");
  const [fileType, setFileType] = useState("");

  useEffect(() => {
    const ext = filename.split(".").pop().toLowerCase();
    setFileType(ext);

    if (["txt", "csv", "log"].includes(ext)) {
      axios
        .get(`${API_BASE}/view/${filename}`)
        .then((res) => setContent(res.data))
        .catch(console.error);
    }
  }, [filename]);

  const saveFile = async () => {
    await axios.post(`${API_BASE}/save`, { filename, content });
    alert("File saved!");
  };

  if (["mp4", "mkv", "mov"].includes(fileType)) {
    return (
      <div className="p-6">
        <h2 className="text-xl mb-4">{filename}</h2>
        <video controls className="w-full max-w-3xl">
          <source src={`${API_BASE}/view/${filename}`} type="video/mp4" />
        </video>
      </div>
    );
  }

  if (["png", "jpg", "jpeg", "gif", "webp"].includes(fileType)) {
  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">{filename}</h2>
      <img 
        src={`${API_BASE}/view/${filename}`} 
        alt={filename} 
        className="max-w-full h-auto border"
      />
    </div>
  );
 }

 if (fileType === "svg") {
    return (
      <div className="p-6">
        <h2 className="text-xl mb-4">{filename}</h2>
        <object
          type="image/svg+xml"
          data={`${API_BASE}/view/${filename}`}
          className="max-w-full h-auto border"
        >
          SVG cannot be displayed
        </object>
      </div>
    );
  }

 if (fileType === "pdf") {
  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">{filename}</h2>
      <iframe
        src={`${API_BASE}/view/${filename}`}
        title={filename}
        className="w-full h-[80vh] border"
      ></iframe>
    </div>
  );
}


  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">{filename}</h2>
      <textarea
        className="w-full h-96 border p-2"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded mt-2"
        onClick={saveFile}
      >
        Save
      </button>
    </div>
  );
}

export default EditPage;
