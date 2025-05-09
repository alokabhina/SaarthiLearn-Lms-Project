import React, { useState } from 'react';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const SearchBarSection = ({ data }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState(data || '');

  const onSearchHandler = (e) => {
    e.preventDefault();
    navigate('/course-list/' + input);
  };

  return (
    <section className="w-full bg-gradient-to-br from-[#1c2230] to-[#0a1126] py-16 px-6 md:px-12 lg:px-20">
      <form
        onSubmit={onSearchHandler}
        className="max-w-xl mx-auto h-14 flex items-center bg-[#0e1529] border border-[#2a3a6e] rounded-lg overflow-hidden shadow-lg transition focus-within:ring-2 focus-within:ring-[#64ffda]/40"
      >
        <div className="px-4">
          <img
            src={assets.search_icon}
            alt="search_icon"
            className="w-5 h-5"
            style={{
              filter: 'invert(93%) sepia(12%) saturate(895%) hue-rotate(185deg) brightness(104%) contrast(92%)'
            }}
          />
        </div>
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          className="flex-1 h-full bg-transparent outline-none text-[#c0d7ff] placeholder-[#c0d7ff]/60 text-base"
          placeholder="Search for courses"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-[#3d5af1] to-[#64ffda] text-[#0a1126] font-medium px-8 h-full hover:brightness-110 hover:shadow-[0_0_10px_#64ffda88] transition-all"
        >
          Search
        </button>
      </form>
    </section>
  );
};

export default SearchBarSection;
