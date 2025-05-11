import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { UserButton, useUser } from '@clerk/clerk-react';

const Navbar = ({ bgColor }) => {
  const { isEducator } = useContext(AppContext);
  const { user } = useUser();

  return isEducator && user && (
    <div 
      className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 
             bg-[#0a1126]/90 border-b border-[#2a3a6e] 
             shadow-[0_0_15px_rgba(58,143,255,0.15)] backdrop-blur-sm"
    >
      {/* Logo with Glow Effect */}
      <Link to="/" className="hover:scale-105 transition-transform">
        <img 
          src={assets.logo} 
          alt="Logo" 
          className="w-28 lg:w-32 drop-shadow-[0_0_10px_rgba(100,255,218,0.5)]"
          style={{
            filter: 'brightness(1.1)'
          }}
        />
      </Link>

      {/* Center Text with Clear Visibility */}
      <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
        <p className="text-[#c0d7ff] text-sm font-medium">
          Welcome to your{' '}
          <span className="text-[#64ffda] font-semibold px-2 py-1 
                          bg-[#1a2a4d] rounded-lg border border-[#3d5af1]
                          shadow-[0_0_10px_rgba(61,90,241,0.3)]">
            Dashboard
          </span>
          , dear!
        </p>
      </div>

      {/* User Section with Clear Visibility */}
      <div className="flex items-center gap-4 text-[#c0d7ff]">
        <p className="flex items-center gap-2 text-sm">
          Hi! 
          <span className="font-semibold text-[#FDD835] 
                          drop-shadow-[0_0_8px_rgba(253,216,53,0.3)]">
            {user.fullName}
          </span>
        </p>
        <div className="hover:shadow-[0_0_12px_rgba(100,255,218,0.3)] rounded-full">
          <UserButton 
            appearance={{
              elements: {
                userButtonAvatarBox: "w-9 h-9 border-2 border-[#64ffda]",
              }
            }} 
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;