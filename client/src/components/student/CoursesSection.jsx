import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import CourseCard from './CourseCard';
import { Link } from 'react-router-dom';

const CoursesSection = () => {
  const { allCourses } = useContext(AppContext);

  return (
    <section className="w-full bg-[#0a1126] py-16 px-6 md:px-12 lg:px-20">
      {/* Section Header */}
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-[#c0d7ff] mb-4">
          Unlock your <span className="text-[#64ffda]">next big skill</span>
        </h2>
        <p className="text-[#c0d7ff]/80 text-lg md:text-xl leading-relaxed">
          Dive into expertly crafted courses—whether you’re coding, designing, or growing your business—every lesson is built to spark your progress.
        </p>
      </div>

      {/* Courses Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {allCourses.slice(0, 4).map((course, idx) => (
          <CourseCard key={idx} course={course} />
        ))}
      </div>

      {/* CTA Button */}
      <div className="max-w-6xl mx-auto text-center">
        <Link
          to="/course-list"
          onClick={() => window.scrollTo(0, 0)}
          className="
            inline-block 
            bg-[#64ffda] 
            text-[#0a1126] 
            font-semibold 
            px-8 py-3 
            rounded-full 
            shadow-lg 
            hover:shadow-[0_0_20px_rgba(100,255,218,0.3)]
          "
        >
          Browse all courses
        </Link>
      </div>
    </section>
  );
};

export default CoursesSection;
