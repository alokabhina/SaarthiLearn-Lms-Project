import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';

const CallToAction = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/course-list');
  };

  return (
    <section className="w-full bg-[#0a1126] text-center py-16 px-4 border-b border-[#2a3a6e]">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-[#c0d7ff]">
          Empower Your Learning Journey —  
          <span className="text-[#64ffda]"> Anytime, Anywhere</span>
        </h1>

        {/* Subheading */}
        <p className="text-[#c0d7ff]/90 text-base md:text-lg mb-8 leading-relaxed">
          Access expert-led courses at your pace, on any device.  
          Your skills, your schedule, your future—start building today.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          {/* Primary */}
          <button
            onClick={handleGetStarted}
            className="
              bg-[#64ffda] text-[#0a1126] font-semibold 
              px-10 py-3 rounded-full 
              shadow-[0_0_16px_rgba(100,255,218,0.3)] 
              hover:shadow-[0_0_24px_rgba(100,255,218,0.5)] 
              transition-shadow duration-300
            "
          >
            Get Started
          </button>

          {/* Secondary */}
          <button
            className="
              inline-flex items-center gap-2 text-[#FDD835] 
              font-medium hover:text-[#64ffda] 
              transition-colors duration-200
            "
          >
            Learn More
            <img
              src={assets.arrow_icon}
              alt="arrow"
              className="w-5 h-5 transition-transform duration-300 hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;