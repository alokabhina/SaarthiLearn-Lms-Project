import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';

const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext);

  return (
    <Link
      onClick={() => scrollTo(0, 0)}
      to={`/course/${course._id}`}
      className="bg-[#121826] border border-[#2a3a6e] rounded-xl overflow-hidden shadow-md hover:shadow-[0_0_15px_rgba(100,255,218,0.2)] transition-shadow duration-300"
    >
      <img
        className="w-full h-44 object-cover"
        src={course.courseThumbnail}
        alt={course.courseTitle}
      />
      <div className="p-4 text-white">
        <h3 className="text-lg font-semibold text-[#c0d7ff] mb-1">
          {course.courseTitle}
        </h3>
        <p className="text-[#9ca3af] text-sm mb-2">{course.educator.name}</p>

        <div className="flex items-center space-x-2 mb-3">
          <span className="text-sm text-[#64ffda]">{calculateRating(course)}</span>
          <div className="flex space-x-[2px]">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                className="w-4 h-4"
                src={i < Math.floor(calculateRating(course)) ? assets.star : assets.star_blank}
                alt="star"
              />
            ))}
          </div>
          <span className="text-[#64748b] text-sm">
            ({course.courseRatings.length})
          </span>
        </div>

        <p className="text-base font-semibold text-[#00CFEA]">
          {currency}
          {(course.coursePrice - (course.discount * course.coursePrice) / 100).toFixed(2)}
        </p>
      </div>
    </Link>
  );
};

export default CourseCard;
