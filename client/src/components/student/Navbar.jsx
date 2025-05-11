import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = () => {
  const location = useLocation();
  const { backendUrl, isEducator, setIsEducator, navigate, getToken } = useContext(AppContext);
  const { openSignIn } = useClerk();
  const { user } = useUser();

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate('/educator');
        return;
      }

      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/educator/update-role`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success(data.message);
        setIsEducator(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <header
      className="sticky top-0 z-50 w-full px-4 sm:px-8 lg:px-28 py-4 
             transition-colors duration-300 border-b 
             bg-[#0a1126]/90 text-[#c0d7ff] border-[#1a2a4d] 
             backdrop-blur-sm shadow-[0_2px_10px_rgba(100,255,218,0.1)]"
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <img
          onClick={() => navigate('/')}
          src={assets.logo}
          alt="Logo"
          className="w-28 lg:w-32 cursor-pointer"
        />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 font-semibold text-sm">
          <Link
            to="/team"
            className="bg-[#1a2a4d] text-white px-4 py-1.5 rounded-full hover:bg-[#64ffda] hover:text-black transition-all duration-200"
          >
            Our Team
          </Link>

          {user && (
            <>
              <button
                onClick={becomeEducator}
                className="bg-[#1a2a4d] text-white px-4 py-1.5 rounded-full hover:bg-[#64ffda] hover:text-black transition-all duration-200"
              >
                {isEducator ? 'Educator Dashboard' : 'Become Educator'}
              </button>

              <Link
                to="/my-enrollments"
                className="bg-[#1a2a4d] text-white px-4 py-1.5 rounded-full hover:bg-[#64ffda] hover:text-black transition-all duration-200"
              >
                My Enrollments
              </Link>
            </>
          )}

          {user ? (
            <div className="rounded-full bg-[#192a4d] p-1 hover:ring-2 hover:ring-[#64ffda] transition-all">
              <UserButton />
            </div>
          ) : (
            <button
              onClick={() => openSignIn()}
              className="bg-[#64ffda] text-black px-5 py-2 rounded-full hover:bg-[#46c6b0] transition font-semibold"
            >
              Create Account
            </button>
          )}
        </nav>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-4">
          <Link to="/team" className="text-xs font-medium hover:text-[#64ffda]">
            Team
          </Link>

          {user && (
            <>
              <button
                onClick={becomeEducator}
                className="text-xs font-medium hover:text-[#64ffda]"
              >
                {isEducator ? 'Dashboard' : 'Educator'}
              </button>

              <Link to="/my-enrollments" className="text-xs font-medium hover:text-[#64ffda]">
                Enrollments
              </Link>
            </>
          )}

          {user ? (
            <UserButton />
          ) : (
            <button onClick={() => openSignIn()}>
              <img src={assets.user_icon} alt="User" className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
