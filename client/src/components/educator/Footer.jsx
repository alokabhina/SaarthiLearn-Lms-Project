import React from 'react';
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <footer className="relative w-full px-8 py-8 bg-[#0a1126] border-t border-[#2a3a6e] text-[#c0d7ff] overflow-hidden">
      {/* Cosmic glow effect at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#3d5af1] via-[#64ffda] to-[#FDD835] opacity-20"></div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Section - Logo + Copyright */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Animated Logo */}
          <div className="group relative">
            <img 
              className="w-20 transition-all duration-500 group-hover:scale-105" 
              src={assets.logo} 
              alt="logo" 
              style={{
                filter: 'drop-shadow(0 0 8px rgba(100, 255, 218, 0.3))',
              }}
            />
            <div className="absolute inset-0 rounded-full bg-[#64ffda] opacity-0 group-hover:opacity-10 blur-md transition-opacity duration-300"></div>
          </div>

          {/* Copyright Text */}
          <div className="text-center md:text-left">
            <p className="text-sm md:text-base tracking-wide">
              Copyright 2025 © <span 
                className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#64ffda] to-[#3d5af1]"
                style={{ textShadow: '0 0 8px rgba(100, 255, 218, 0.3)' }}
              >
                SaarthiLearn
              </span>
            </p>
            <p className="text-xs text-[#c0d7ff]/80 mt-1">All Rights Reserved</p>
          </div>
        </div>

        {/* Right Section - Social Icons */}
        <div className="flex items-center gap-6">
          {[
            { icon: assets.facebook_icon, name: 'Facebook' },
            { icon: assets.twitter_icon, name: 'Twitter' },
            { icon: assets.instagram_icon, name: 'Instagram' }
          ].map((social, index) => (
            <a 
              key={index}
              href={`https://${social.name.toLowerCase()}.com`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative group"
            >
              {/* Social Icon with Glow */}
              <div className="p-2 rounded-full transition-all duration-300 
                  bg-[#1a2a4d] group-hover:bg-[#2a3a6e]
                  shadow-[0_0_12px_rgba(61,90,241,0.2)] group-hover:shadow-[0_0_20px_rgba(100,255,218,0.3)]">
                <img 
                  className="w-5 h-5 object-contain invert-[80%] sepia-[10%] hue-rotate-[180deg] 
                    transition-all group-hover:invert-[100%] group-hover:scale-110" 
                  src={social.icon} 
                  alt={social.name} 
                />
              </div>
              
              {/* Hover Tooltip */}
              <span className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 
                  text-xs bg-[#1a2a4d] text-[#64ffda] px-2 py-1 rounded 
                  opacity-0 group-hover:opacity-100 transition-opacity
                  shadow-lg border border-[#2a3a6e] whitespace-nowrap">
                Follow us on {social.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;