import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PrimaryButton from '../buttons/PrimaryButton';
import SecondaryButton from '../buttons/SecondaryButton';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-[#141414] h-16 px-4 flex items-center relative z-50">
      <div className="container mx-auto max-w-[1152px] flex items-center justify-between">
        <div className="text-white text-2xl font-bold">
          H
        </div>

        <div className="lg:hidden text-white" onClick={toggleMenu}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>

        <ul className="hidden lg:flex items-center space-x-4 ml-auto">
          <li className="text-white hover:text-gray-400">
            <Link to="/">
            Home
            </Link>
          </li>
          <li className="text-white hover:text-gray-400">
            <Link to="/Profile">
              Profile
            </Link>
          </li>
          <li>
            <Link to="/Login">
              <PrimaryButton>
                Login
              </PrimaryButton>
            </Link>            
          </li>
          <li>
            <Link to="/Register">
              <SecondaryButton>
                Register
              </SecondaryButton>
            </Link>               
          </li>
        </ul>
        {isOpen && (
            <ul className="lg:hidden absolute top-16 left-0 w-full bg-gray-800 flex flex-col items-center space-y-4 py-4 z-50">
              <li className="text-white hover:text-gray-400">
                <Link to="/">
                Home
                </Link>
              </li>
              <li className="text-white hover:text-gray-400">
                <Link to="/Profile">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/Login">
                  <PrimaryButton>
                    Login
                  </PrimaryButton>
                </Link>            
              </li>
              <li>
                <Link to="/Register">
                  <SecondaryButton>
                    Register
                  </SecondaryButton>
                </Link>               
              </li>
            </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;