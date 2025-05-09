import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';

const SideBar = () => {
  const { isEducator } = useContext(AppContext);

  const menuItems = [
    { name: 'Dashboard', path: '/educator', icon: assets.home_icon },
    { name: 'Add Course', path: '/educator/add-course', icon: assets.add_icon },
    { name: 'My Courses', path: '/educator/my-courses', icon: assets.my_course_icon },
    { name: 'Students', path: '/educator/student-enrolled', icon: assets.person_tick_icon },
  ];

  return isEducator && (
    <div className="w-64 min-h-screen bg-[#0a1126] border-r border-[#1a2a4d] text-[#c0d7ff] flex flex-col py-6 shadow-[0_0_12px_rgba(100,255,218,0.08)]">
      {menuItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          end={item.path === '/educator'}
          className={({ isActive }) => `
            group flex items-center gap-4 px-6 py-3 mx-3 my-1 rounded-xl font-medium transition-all duration-300
            ${isActive
              ? 'bg-[#2a3a6e]/30 text-[#64ffda] ring-2 ring-[#64ffda]/30 shadow-md'
              : 'hover:bg-[#2a3a6e]/20 hover:text-[#64ffda]'}
          `}
        >
          <div
            className="w-6 h-6 bg-current mask mask-icon"
            style={{
              WebkitMaskImage: `url(${item.icon})`,
              maskImage: `url(${item.icon})`,
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
            }}
          />
          <span className="text-sm">{item.name}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default SideBar;