import React from 'react';
import { useState,useEffect } from 'react';
import axios from 'axios';
import { BaseUrl } from '../../constant';

function UserDashboard() {

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");
  const [categories,setCategories]=useState([]);

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
    setCategory("");
    setUrl("");



    
  };

  useEffect(()=>{
    const fetchCategories=async()=>{
      

      try {
        const response= await axios.get(`${BaseUrl}/api/category/getCategories`,{
          withCredentials:true,
        })
        setCategories(response.data);
        console.log(categories)

      } catch (error) {
        console.log(error);
      }
    }
    fetchCategories();
  },[])



  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">My Links</h2>
            <div className="space-y-4">
              {/* Placeholder for user's submitted links */}
              <p className="text-gray-500">No links submitted yet</p>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Submit New Link</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="name"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e)=>(setName(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter the title  "
                />
              </div>
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                  URL
                </label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  value={url}
                  onChange={(e)=>(setUrl(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={category}
                 
                  onChange={(e)=>(setCategory(e.target.value))}
                  
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >


                  {categories.map((cate)=>(
                    <option key={cate.id} value={cate.name}>{cate.name}</option>
                  ))}
                  
                </select>
              </div>
              <button
                type="submit"
                onClick={handleCreateLink}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;