import { useState } from 'react'
import reactLogo from './assets/storage-icon.svg'
import viteLogo from './assets/storage-icon.svg'
import Navbar from './Navbar'
import FileList from './FileList'
import './App.css'
import UploadForm from './UploadForm'

function App() {
  const [searchTerm, setSearchTerm] = useState(""); 
  const [refresh, setRefresh] = useState(false);

  const handleUploadSuccess = () => {
    setRefresh((prev) => !prev);
  };
  return (
    <>
      <Navbar setSearchTerm={setSearchTerm}/>
      <UploadForm onUploadSuccess={handleUploadSuccess} />
      <FileList searchTerm = {searchTerm} refresh = {refresh}/>
      
    </>
  )
}

export default App
