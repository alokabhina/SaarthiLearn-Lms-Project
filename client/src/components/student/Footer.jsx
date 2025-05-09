import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';

const socialLinks = [
  { icon: assets.facebook_icon, label: 'Facebook', url: '#' },
  { icon: assets.twitter_icon,  label: 'Twitter',  url: '#' },
  { icon: assets.instagram_icon, label: 'Instagram', url: '#' },
];

const Footer = () => {
  return (
    <footer className="w-full bg-[#0a1126] text-[#c0d7ff] py-8 px-6 md:px-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10 md:gap-20">

        {/* Left - Logo & Text */}
        <div className="flex-1 max-w-sm space-y-3">
          <img src={assets.logo} alt="SaarthiLearn Logo" className="h-8" />
          <p className="text-sm text-[#c0d7ff]/70 leading-relaxed">
            SaarthiLearn helps you grow your skills, career, and future with expert-led online courses crafted for success.
          </p>
        </div>

        {/* Center - Navigation */}
        <div className="space-y-2 text-sm">
          <h4 className="font-semibold text-[#64ffda]">Company</h4>
          <ul className="space-y-1 text-[#c0d7ff]/70">
            <li><a href="#" className="hover:text-[#64ffda] transition">Home</a></li>
            <li>
              <Link to="/team" className="hover:text-[#64ffda] transition">
                About Us
              </Link>
            </li>
            <li><a href="#" className="hover:text-[#64ffda] transition">Contact</a></li>
            <li><a href="#" className="hover:text-[#64ffda] transition">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Right - Social Media */}
        <div className="space-y-3">
          <h4 className="font-semibold text-[#64ffda] text-sm">Follow Us</h4>
          <div className="flex gap-5">
            {socialLinks.map(({ icon, label, url }) => (
              <a
                key={label}
                href={url}
                className="group flex flex-col items-center"
              >
                <img
                  src={icon}
                  alt={label}
                  className="w-5 h-5 filter grayscale group-hover:filter-none group-hover:drop-shadow-[0_0_6px_rgba(100,255,218,0.5)] transition"
                />
                <span className="text-[10px] text-[#c0d7ff]/60 group-hover:text-[#64ffda] mt-1">
                  {label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="mt-6 text-center border-t border-[#2a3a6e] pt-4 text-xs text-[#c0d7ff]/50">
        © 2024 SaarthiLearn. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;