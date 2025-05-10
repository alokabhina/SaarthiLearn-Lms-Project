import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';
import { Trash2 } from 'lucide-react';

const MyCourses = () => {
  const { backendUrl, isEducator, currency, getToken } = useContext(AppContext);
  const [courses, setCourses] = useState(null);
  const [error, setError] = useState(null);

  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/educator/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setCourses(data.courses);
        setError(null);
      } else {
        setError('Failed to fetch courses');
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      const token = await getToken();
      const { data } = await axios.delete(`${backendUrl}/api/educator/delete-course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success('Course deleted successfully');
        fetchEducatorCourses();
      } else {
        toast.error('Failed to delete course');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting course');
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEducatorCourses();
    }
  }, [isEducator]);

  return (
    <div className="flex flex-col min-h-screen bg-[#0a1126] text-[#c0d7ff]">
      <div className="flex-grow p-4 md:p-8">
        <h2 className="pb-4 text-xl font-semibold text-[#c0d7ff] text-shadow-[0_0_8px_rgba(253,216,53,0.3)]">
          My Courses
        </h2>
        {error && <p className="text-red-400 text-center">{error}</p>}
        {courses ? (
          courses.length === 0 ? (
            <p className="text-center text-[#f8f8ff]">No courses found.</p>
          ) : (
            <div className="max-w-6xl w-full rounded-lg bg-[#2a3a6e]/50 border border-[#1a2a4d] shadow-[0_0_10px_rgba(61,90,241,0.3)]">
              <table className="table-fixed md:table-auto w-full">
                <thead className="text-[#c0d7ff] border-b border-[#1a2a4d] text-sm text-left">
                  <tr>
                    <th className="px-4 py-3 font-semibold truncate">All Courses</th>
                    <th className="px-4 py-3 font-semibold truncate">Earnings</th>
                    <th className="px-4 py-3 font-semibold truncate">Students</th>
                    <th className="px-4 py-3 font-semibold truncate">Published On</th>
                    <th className="px-4 py-3 font-semibold truncate">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-[#f8f8ff]">
                  {courses.map((course) => (
                    <tr
                      key={course._id}
                      className="border-b border-[#1a2a4d] hover:bg-[#1e3a8a]/30 transition-colors duration-200"
                    >
                      <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                        <img
                          src={course.courseThumbnail}
                          alt={course.courseTitle}
                          className="w-16 rounded border border-[#64ffda]/30"
                        />
                        <span className="truncate text-[#c0d7ff] hidden md:block">
                          {course.courseTitle}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {currency}{' '}
                        {Math.floor(
                          course.enrolledStudents.length *
                            (course.coursePrice -
                              ((course.discount || 0) * course.coursePrice) / 100)
                        )}
                      </td>
                      <td className="px-4 py-3">{course.enrolledStudents.length}</td>
                      <td className="px-4 py-3">
                        {new Date(course.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(course._id)}
                          className="flex items-center text-sm text-red-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
};

export default MyCourses;