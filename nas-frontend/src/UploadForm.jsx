import { useState } from "react";
import axios from "axios";

function UploadForm({onUploadSuccess}){
    const [file, setFile] = useState(null);
    const [uploading,setUploading] = useState(false);

    const handleUpload = async () => {
        if(!file) return;

        const formData = new FormData(); // to send data as html form
        formData.append("file", file);
        setUploading(true);
        try {
            await axios.post("http://127.0.0.1:8000/upload",formData);
            setFile(null);
            onUploadSuccess(); // call handleUploadSuccess in App.jsx
        } catch(err){
            alert("Upload failed");
        } finally {
      setUploading(false);
    }
    };
        
    return(

       <div className="px-20 pt-6">
        <div className="flex items-center space-x-4 bg-gray-100 p-4 rounded shadow">
        <input
      type="file"
      onChange={(e) => setFile(e.target.files[0])}
      className="block w-full text-sm text-gray-700 bg-white border border-gray-300 rounded cursor-pointer focus:outline-none"
    />
    <button
      onClick={handleUpload}
      disabled={!file || uploading}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
    >
      {uploading ? "Uploading..." : "Upload"}
    </button>
  </div>
</div>
        
    );
}

export default UploadForm