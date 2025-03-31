import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import {  UserIcon,Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/user/profile", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // Ensures credentials (cookies) are sent
        });
        // console.log(response);
        if (response.data) {
          setIsLoggedIn(true);
          setUser(response.data.user);
          // console.log(user); // Assuming response.data contains user details
        }
      } catch (error) {
        console.error("Error fetching profile:", error.response?.data || error.message);
        setIsLoggedIn(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout=async ()=>{
    setIsLoggedIn(false);
    setUser(null);
    try {
      const response =await axios.post("http://localhost:3000/api/user/logoutUser",{},{
        withCredentials:true
      })
      console.log("user logged out");
      window.location.href = "/";
    } catch (error) {
      
    }
  }

  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link to="/" className="text-2xl font-bold text-indigo-600">
                    LinkHub
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    to="/"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Home
                  </Link>
                  <Link
                    to={isLoggedIn? "/explorelinks":"/login"}
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Explore Links
                  </Link>
                </div>
              </div>

              {/* Authentication Links / User Profile */}
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {isLoggedIn && user ? (
                  <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center text-gray-700 hover:text-indigo-600 focus:outline-none">
                     <UserIcon className="h-6 w-6 text-gray-500" />
                      {/* Adjust key based on API response */}
                      
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md py-1">
                        
                      <Menu.Item>
                          {({ active }) => (
                            <span  className={`block px-4 py-2 text-sm ${active ? "bg-gray-100" : "text-gray-700"}`}>Hello {user.name}</span>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                            to={user.isAdmin && user.isVerified ? "/adminProfile" : "/profile"}
                            className={`block px-4 py-2 text-sm ${active ? "bg-gray-100" : "text-gray-700"}`}
                          >
                              Profile
                            </Link>
                          )}
                        </Menu.Item>

                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`block w-full text-left px-4 py-2 text-sm ${active ? "bg-gray-100" : "text-gray-700"}`}
                            >
                              Logout
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <div className="flex space-x-4">
                    <Link
                      to="/login"
                      className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/signup"
                      className="bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <Disclosure.Panel className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              >
                Home
              </Link>
              <Link
                to="/categories"
                className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              >
                Categories
              </Link>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              {isLoggedIn && user ? (
                <div className="space-y-1">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-gray-800 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setIsLoggedIn(false);
                      setUser(null);
                    }}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:text-gray-800 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <Link to="/login" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                    Log in
                  </Link>
                  <Link to="/signup" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

export default Navbar;
