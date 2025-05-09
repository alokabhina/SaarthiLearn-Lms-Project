import React, { useContext, useEffect, useState } from 'react';
import Footer from '../../components/student/Footer';
import { assets } from '../../assets/assets';
import CourseCard from '../../components/student/CourseCard';
import { AppContext } from '../../context/AppContext';
import { useParams } from 'react-router-dom';
import SearchBar from '../../components/student/SearchBar';

const CoursesList = () => {
  const { input } = useParams();
  const { allCourses, navigate } = useContext(AppContext);
  const [filteredCourse, setFilteredCourse] = useState([]);

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const tempCourses = allCourses.slice();
      input
        ? setFilteredCourse(
            tempCourses.filter((item) =>
              item.courseTitle.toLowerCase().includes(input.toLowerCase())
            )
          )
        : setFilteredCourse(tempCourses);
    }
  }, [allCourses, input]);

  return (
    <>
      <div className="relative md:px-36 px-8 pt-20 min-h-screen bg-[#0a1126] text-[#c0d7ff]">
        <div className="flex md:flex-row flex-col gap-6 items-start justify-between w-full">
          <div>
            <h1 className="text-4xl font-semibold text-[#c0d7ff] text-shadow-[0_0_8px_rgba(253,216,53,0.3)]">
              Course List
            </h1>
            <p className="text-[#f8f8ff]">
              <span
                onClick={() => navigate('/')}
                className="text-[#64ffda] cursor-pointer hover:text-[#52d1d1] transition-colors duration-200 underline"
              >
                Home
              </span>{' '}
              / <span>Course List</span>
            </p>
          </div>
          <SearchBar data={input} />
        </div>

        {input && (
          <div className="inline-flex items-center gap-4 px-4 py-2 border border-[#1a2a4d] mt-8 -mb-8 text-[#f8f8ff] bg-[#2a3a6e]/50 rounded-lg shadow-[0_0_10px_rgba(61,90,241,0.3)]">
            <p>{input}</p>
            <img
              onClick={() => navigate('/course-list')}
              className="cursor-pointer w-4 h-4 hover:opacity-80 transition-opacity duration-200"
              src={assets.cross_icon}
              alt="Clear"
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-6 px-2 md:px-0">
          {filteredCourse.length > 0 ? (
            filteredCourse.map((course, index) => <CourseCard key={index} course={course} />)
          ) : (
            <p className="col-span-full text-center text-[#f8f8ff]">No courses found.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CoursesList;