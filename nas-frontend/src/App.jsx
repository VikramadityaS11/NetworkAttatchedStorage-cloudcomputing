import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import FileList from "./FileList";
import UploadForm from "./UploadForm";
import './App.css'
import EditPage from "./EditPage"; // <-- new page

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [refresh, setRefresh] = useState(false);

  const handleUploadSuccess = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <Router>
      <Navbar setSearchTerm={setSearchTerm} />
      <Routes>
        {/* Home page (upload + list) */}
        <Route
          path="/"
          element={
            <>
              <UploadForm onUploadSuccess={handleUploadSuccess} />
              <FileList searchTerm={searchTerm} refresh={refresh} />
            </>
          }
        />

        {/* New edit page */}
        <Route path="/edit/:filename" element={<EditPage />} />
      </Routes>
    </Router>
  );
}

export default App;
