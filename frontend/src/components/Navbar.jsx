import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { MoonIcon } from "@heroicons/react/24/outline"; // For outline version
import { MoonIcon as MoonSolid } from "@heroicons/react/24/solid";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md dark:bg-gray-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="font-bold text-xl text-blue-600 dark:text-blue-400"
          >
            Countries Explorer
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/favorites"
                  className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Favorites
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Hello, {user?.username}
                </span>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Register
                </Link>
              </>
            )}

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDarkMode ? (
                <MoonSolid className="h-6 w-6 text-yellow-400" />
              ) : (
                <MoonIcon className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleDarkMode}
              className="p-2 mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDarkMode ? (
                <MoonSolid className="h-6 w-6 text-yellow-400" />
              ) : (
                <MoonIcon className="h-6 w-6 text-gray-700" />
              )}
            </button>

            <button
              onClick={toggleMenu}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6 text-gray-700" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="mt-4 py-2 md:hidden">
            <Link
              to="/"
              className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/favorites"
                  className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  Favorites
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
                <span className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-300">
                  Hello, {user?.username}
                </span>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
