import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminPanel from './pages/AdminPanel';
import AdminLinkManagement from './pages/AdminLinkManagement';
import AdminUserManagement from './pages/AdminUserManagement';
import UserDashboard from './pages/UserDashboard';
import { Button } from "@/components/ui/button";
import CategoriesPage from './pages/AllLinksPage';
import { ToastContainer } from "react-toastify";

function App() {
  return (
    
    <Router>
      <ToastContainer />
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/explorelinks" element={<CategoriesPage />} />
          <Route path="/adminProfile" element={<AdminPanel />} />
          <Route path="/profile" element={<UserDashboard />} />
          <Route path="/linkmanagement" element={<AdminLinkManagement />} />
          <Route path="/usermanagement" element={<AdminUserManagement />} />
          
        </Routes>
        
      </div>

    </Router>
  );
}

export default App;