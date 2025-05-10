import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { Line } from 'rc-progress';
import Footer from '../../components/student/Footer';
import { toast } from 'react-toastify';

const MyEnrollments = () => {
  const {
    userData,
    enrolledCourses,
    fetchUserEnrolledCourses,
    navigate,
    backendUrl,
    getToken,
    calculateCourseDuration,
    calculateNoOfLectures
  } = useContext(AppContext);

  const [progressArray, setProgressData] = useState([]);

  const getCourseProgress = async () => {
    try {
      const token = await getToken();

      const tempProgressArray = await Promise.all(
        enrolledCourses.map(async (course) => {
          const { data } = await axios.post(
            `${backendUrl}/api/user/get-course-progress`,
            { courseId: course._id },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          let totalLectures = calculateNoOfLectures(course);
          const lectureCompleted = data.progressData ? data.progressData.lectureCompleted.length : 0;
          return { totalLectures, lectureCompleted };
        })
      );

      setProgressData(tempProgressArray);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchUserEnrolledCourses();
    }
  }, [userData]);

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseProgress();
    }
  }, [enrolledCourses]);

  return (
    <div className="flex flex-col min-h-screen bg-[#1E1E2F] text-[#C0C0C0]">
      <div className="flex-grow md:px-36 px-8 pt-10">
        <h1 className="text-2xl font-semibold text-white">My Enrollments</h1>

        {enrolledCourses.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">No courses enrolled yet.</p>
        ) : (
          <table className="w-full mt-10 border border-gray-500/20 rounded-lg overflow-hidden">
            <thead className="text-gray-200 border-b border-gray-500/20 text-sm text-left bg-[#2A2A3B]">
              <tr>
                <th className="px-4 py-3 font-semibold">Course</th>
                <th className="px-4 py-3 font-semibold max-sm:hidden">Duration</th>
                <th className="px-4 py-3 font-semibold max-sm:hidden">Completed</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {enrolledCourses.map((course, index) => {
                const progress = progressArray[index];
                const total = progress?.totalLectures || 0;
                const completed = progress?.lectureCompleted || 0;
                const percent = total > 0 ? (completed * 100) / total : 0;

                return (
                  <tr key={index} className="border-b border-gray-500/20 hover:bg-[#2A2A3B] transition-colors">
                    <td className="px-4 py-3 flex items-center space-x-3">
                      <img
                        src={course.courseThumbnail}
                        alt={course.courseTitle}
                        className="w-16 sm:w-20 md:w-24 h-auto rounded"
                      />
                      <div className="flex-1">
                        <p className="mb-1 max-sm:text-sm font-medium">{course.courseTitle}</p>
                        <Line
                          className="bg-gray-600 rounded-full w-full max-w-[200px]"
                          strokeWidth={2}
                          strokeColor="#3B82F6"
                          percent={percent}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 max-sm:hidden">{calculateCourseDuration(course)}</td>
                    <td className="px-4 py-3 max-sm:hidden">
                      {progress && `${completed} / ${total}`}<span className="text-xs ml-2">Lectures</span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => navigate('/player/' + course._id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors max-sm:text-xs"
                      >
                        {progress && total > 0 && completed / total === 1 ? 'Completed' : 'Continue'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyEnrollments;
