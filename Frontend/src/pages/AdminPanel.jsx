import React, { useEffect, useState } from 'react';
import { Popover, TextField, Button, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { Link } from "react-router-dom";
import axios from 'axios';
import { BaseUrl } from '../../constant';

function AdminPanel() {
  const [anchorElCreate, setAnchorElCreate] = useState(null);
  const [anchorElUpdate, setAnchorElUpdate] = useState(null);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [categories,setCategories]=useState([]);

  

  const handleOpenCreate = (event) => setAnchorElCreate(event.currentTarget);
  const handleCloseCreate = () => setAnchorElCreate(null);

  const handleOpenUpdate = (event) => setAnchorElUpdate(event.currentTarget);
  const handleCloseUpdate = () => setAnchorElUpdate(null);

  const handleCreateLink = async () => {
    console.log("New Link Data:", { name, url, category });
    try {
      const response=await axios.post(`${BaseUrl}/api/link/createLink`,{
        name:name,
        url:url,
        category:category
      },{
        headers: { "Content-Type": "application/json" },
        withCredentials: true, 
      });
      console.log(response.data);

    } catch (error) {
      console.log(error);
    }



    setName("");
    setUrl("");
    setCategory("");
    handleCloseCreate();
  };

  const handleUpdateDetails = () => {
    console.log("Updated Details:", { username, email });
    setUsername("");
    setEmail("");
    handleCloseUpdate();
  };

  useEffect(()=>{
    const fetchCategories=async()=>{
      

      try {
        const response= await axios.get(`${BaseUrl}/api/category/getCategories`,{
          withCredentials:true,
        })
        setCategories(response.data);

      } catch (error) {
        console.log(error);
      }
    }
    fetchCategories();
  },[])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Link to="/linkmanagement" className="bg-white overflow-hidden shadow rounded-lg transition duration-300 hover:bg-indigo-600 hover:text-white flex items-center justify-center text-center px-4 py-5 sm:p-6">
          <h2 className="text-lg font-bold">Update and Delete Link</h2>
        </Link>
        <Link to="/usermanagement" className="bg-white overflow-hidden shadow rounded-lg transition duration-300 hover:bg-indigo-600 hover:text-white flex items-center justify-center text-center px-4 py-5 sm:p-6">
          <h2 className="text-lg font-bold">Update and Delete User</h2>
        </Link>
        <button onClick={handleOpenCreate} className="bg-white overflow-hidden shadow rounded-lg transition duration-300 hover:bg-indigo-600 hover:text-white flex items-center justify-center text-center px-4 py-5 sm:p-6">
          <h2 className="text-lg font-bold">Create Link</h2>
        </button>
        <button onClick={handleOpenUpdate} className="bg-white overflow-hidden shadow rounded-lg transition duration-300 hover:bg-indigo-600 hover:text-white flex items-center justify-center text-center px-4 py-5 sm:p-6">
          <h2 className="text-lg font-bold">Update Your Details</h2>
        </button>
      </div>

      {/* Create Link Popover */}
      <Popover open={Boolean(anchorElCreate)} anchorEl={anchorElCreate} onClose={handleCloseCreate} anchorOrigin={{ vertical: "bottom", horizontal: "center" }} transformOrigin={{ vertical: "top", horizontal: "center" }}>
        <div className="p-4 w-80">
          <h3 className="text-lg font-semibold mb-4">Create Link</h3>
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth className="mb-3" />
          <TextField label="URL" value={url} onChange={(e) => setUrl(e.target.value)} fullWidth className="mb-3" />
          <FormControl fullWidth className="mb-3">
            <InputLabel>Category</InputLabel>
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((cat) => <MenuItem key={cat.id} value={cat.name}>{cat.name}</MenuItem>)}
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" fullWidth onClick={handleCreateLink}>Create</Button>
        </div>
      </Popover>

      {/* Update Details Popover */}
      <Popover open={Boolean(anchorElUpdate)} anchorEl={anchorElUpdate} onClose={handleCloseUpdate} anchorOrigin={{ vertical: "bottom", horizontal: "center" }} transformOrigin={{ vertical: "top", horizontal: "center" }}>
        <div className="p-4 w-80">
          <h3 className="text-lg font-semibold mb-4 p-2">Update Your Details</h3>
          <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth className="mb-3 p-2" />
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth className="mb-3 p-2" />
          <Button variant="contained" color="primary" fullWidth onClick={handleUpdateDetails}>Update</Button>
        </div>
      </Popover>
    </div>
  );
}

export default AdminPanel;
