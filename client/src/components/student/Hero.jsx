import React from 'react';
import { assets } from '../../assets/assets';
import SearchBar from '../../components/student/SearchBar';

const Hero = () => {
  return (
    <section className="w-full flex flex-col items-center justify-center text-center px-6 md:px-0 pt-24 md:pt-36 pb-24 bg-gradient-to-b from-[#0a1126] to-[#1a1f33]">
      {/* Heading */}
      <h1 className="relative text-3xl md:text-5xl font-extrabold text-[#D1F2FF] max-w-3xl leading-snug tracking-tight">
        Step into your future with courses designed to
        <span className="text-[#64ffda] drop-shadow-md animate-pulse"> shape your journey.</span>
        <img
          src={assets.sktech}
          alt="sketch"
          className="hidden md:block absolute -bottom-6 right-0 w-24 opacity-70 pointer-events-none"
        />
      </h1>

      {/* Paragraph for desktop */}
      <p className="hidden md:block text-[#CBD5E1] text-lg mt-6 max-w-2xl">
        Join a vibrant community of learners and experts, transforming your career with real-world learning.
      </p>

      {/* Paragraph for mobile */}
      <p className="md:hidden text-[#CBD5E1] text-sm mt-4 max-w-sm">
        Learn at your pace and connect with experts. Your growth starts here.
      </p>

      {/* Search Bar */}
      <div className="mt-10 w-full max-w-2xl bg-[#ffffff08] rounded-xl p-4 shadow-lg backdrop-blur-md border border-[#64ffda30]">
        <SearchBar />
      </div>
    </section>
  );
};

export default Hero;
