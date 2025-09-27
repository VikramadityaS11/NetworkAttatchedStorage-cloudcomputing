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
    try {
      await axios.put(`${API_BASE}/edit/${filename}`, { content });
      alert("File saved!");
    } catch (err) {
      console.error(err);
      alert("Error saving file");
    }
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
  } else if (["png", "jpg", "jpeg", "gif", "webp"].includes(fileType)) {
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
 } else if (fileType === "pdf") {
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
} else if (fileType === "docx") {
  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">{filename}</h2>
      <iframe
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(API_BASE + '/view/' + filename)}`}
        width="100%"
        height="600px"
        frameBorder="0"
      ></iframe>
    </div>
  );
} else if (["txt", "csv", "log"].includes(fileType)) {
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
} else
{
  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">{filename}</h2>
      <p className="text-gray-600">
        Viewing this file type is not supported. Please download to view it.
      </p>
    </div>
  );
}

}

export default EditPage;
