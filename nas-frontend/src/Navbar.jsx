function Navbar({ setSearchTerm }){
    return(
        <nav className="sticky top-0 bg-white text-black px-6 py-3 flex justify-between items-center border-2 border-gray-200 z-50">
            <div className="flex items-center space-x-6">
                <h1 className="text-xl font-bold">NAS Dashboard</h1>
                <a href="/" className="hover:underline">My Files</a> {/* Add more nav links as needed */}
            </div>

            <input type="text" placeholder="Search files" className="bg-gray-200 px-3 py-1 rounded-2xl focus:outline-none focus:ring"
            onChange={(e)=>setSearchTerm(e.target.value)} />
        </nav>
    );
}

export default Navbar