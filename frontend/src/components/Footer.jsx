import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white shadow-inner dark:bg-gray-800 mt-auto">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              &copy; {currentYear} Countries Explorer. All rights reserved.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-4">
              <li>
                <Link 
                  to="/"
                  className="text-sm text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  Home
                </Link>
              </li>
              <li>
                <a 
                  href="https://restcountries.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  REST Countries API
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 