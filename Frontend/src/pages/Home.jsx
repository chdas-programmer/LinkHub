import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { BeakerIcon, LightBulbIcon, ShieldCheckIcon, UserGroupIcon, LinkIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className=" py-40 px-2 text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to <span className="text-indigo-600">LinkHub</span></h1>
        <p className="text-lg max-w-2xl mx-auto mb-6">
          Discover and share curated links across different categories. Join our community today!
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/signup" className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-500">Get Started</Link>
          <Link to="/login" className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-gray-200">Log In</Link>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-48 px-6 text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[{ title: "Join Us", desc: "Create an account and start sharing valuable links.", icon: UserGroupIcon },
            { title: "Categorize Links", desc: "Organize links to help others find useful content.", icon: BeakerIcon },
            { title: "Explore & Learn", desc: "Browse a growing collection of valuable resources.", icon: LightBulbIcon }]
            .map((item, idx) => (
              <Card key={idx} className="shadow-lg border border-gray-200">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <item.icon className="h-12 w-12 text-indigo-600 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 mt-2">{item.desc}</p>
                </CardContent>
              </Card>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-16 bg-white px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Explore Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {["Technology", "Design", "Business", "Education", "Entertainment", "Lifestyle"].map((category) => (
              <div key={category} className="bg-gray-100 p-4 rounded-lg text-gray-800 font-medium hover:bg-indigo-600 hover:text-white transition">
                {category}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          <div>
            <h3 className="text-xl font-bold text-white">LinkHub</h3>
            <p className="mt-2">Your go-to platform for sharing and discovering valuable resources.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold">Quick Links</h4>
            <ul className="mt-2 space-y-2">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/login" className="hover:text-white">Login</Link></li>
              <li><Link to="/signup" className="hover:text-white">Sign Up</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold">Categories</h4>
            <ul className="mt-2 space-y-2">
              {["Technology", "Design", "Business", "Education"].map((category) => (
                <li key={category}><a href="#" className="hover:text-white">{category}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-center text-gray-500 mt-8">© {new Date().getFullYear()} LinkHub. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
