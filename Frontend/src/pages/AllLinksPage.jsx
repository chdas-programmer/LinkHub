import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { BaseUrl } from "../../constant";

// const categories = [
//   "Technology",
//   "Health",
//   "Fashion",
//   "Sports",
//   "Education",
//   "Business",
//   "Entertainment",
//   "Science",
// ];

// const links = [
//   { name: "Latest Gadgets", category: "Technology" },
//   { name: "Fitness Tips", category: "Health" },
//   { name: "Trending Styles", category: "Fashion" },
//   { name: "Football Updates", category: "Sports" },
//   { name: "Online Courses", category: "Education" },
//   { name: "Stock Market News", category: "Business" },
//   { name: "Movie Reviews", category: "Entertainment" },
//   { name: "Space Discoveries", category: "Science" },
// ];

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);



    const [categories,setCategories]=useState([]);
    const [links, setLinks] = useState([]);
    const filteredLinks = selectedCategory
    ? links.filter((link) => link.category_name === selectedCategory)
    : links;

    useEffect(() => {
      const fetchLinksAndCategories = async () => {
        try {
          const response1 = await axios.get(`${BaseUrl}/api/link/getApprovedLinks`,{
            withCredentials:true
          });
          const response2 = await axios.get(`${BaseUrl}api/category/getCategories`,{
            withCredentials:true
          });
  
          
          setLinks(response1.data);
          setCategories(response2.data); // Update state with fetched links
        } catch (error) {
          console.error("Error fetching links:", error.response1?.data || error.message);
        }
      };
  
      fetchLinksAndCategories();
    }, []);


  return (
    <div className="flex min-h-screen bg-gray-100 p-4">
      {/* Left Sidebar - Filters */}
      <aside className="w-1/4 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-3">Filter by Category</h2>
        <ul>
          {categories.map((category) => (
            <li
              key={category.id}
              className={`cursor-pointer p-2 rounded-md mb-1 ${
                selectedCategory === category
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name}
            </li>
          ))}
        </ul>
        <button
          className="mt-3 px-4 py-2 text-sm text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
          onClick={() => setSelectedCategory(null)}
        >
          Reset Filters
        </button>
      </aside>

      {/* Right Content - Links */}
      <main className="flex-1 p-4">
        <h2 className="text-xl font-semibold mb-4">All Links</h2>
        <div className="grid grid-cols-2 gap-4">
            {filteredLinks.map((link, index) => (
            <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
            >
                {link.name}
            </a>
            ))}
        </div>
        </main>

    </div>
  );
}
