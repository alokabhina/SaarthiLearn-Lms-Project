import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';

const StudentsEnrolled = () => {
  const { backendUrl, getToken, isEducator } = useContext(AppContext);
  const [enrolledStudents, setEnrolledStudents] = useState(null);

  const fetchEnrolledStudents = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + '/api/educator/enrolled-students', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setEnrolledStudents(data.enrolledStudents.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEnrolledStudents();
    }
  }, [isEducator]);

  return enrolledStudents ? (
    <div className="min-h-screen flex flex-col items-start gap-6 p-4 md:p-8 bg-[#0a1126] text-[#c0d7ff]">
      <div className="w-full">
        <h2 className="pb-4 text-xl font-semibold text-[#c0d7ff] text-shadow-[0_0_8px_rgba(253,216,53,0.3)]">
          Enrolled Students
        </h2>
        <div className="max-w-5xl w-full rounded-lg bg-[#2a3a6e]/50 border border-[#1a2a4d] shadow-[0_0_10px_rgba(61,90,241,0.3)]">
          <table className="table-fixed md:table-auto w-full">
            <thead className="text-[#c0d7ff] border-b border-[#1a2a4d] text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">#</th>
                <th className="px-4 py-3 font-semibold">Student Name</th>
                <th className="px-4 py-3 font-semibold">Course Title</th>
                <th className="px-4 py-3 font-semibold hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="text-sm text-[#f8f8ff]">
              {enrolledStudents.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-[#1a2a4d] hover:bg-[#1e3a8a]/30 transition-colors duration-200"
                >
                  <td className="px-4 py-3 text-center hidden sm:table-cell">{index + 1}</td>
                  <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                    <img
                      src={item.student.imageUrl}
                      alt="Student"
                      className="w-9 h-9 rounded-full border border-[#64ffda]/30"
                    />
                    <span className="truncate text-[#c0d7ff]">{item.student.name}</span>
                  </td>
                  <td className="px-4 py-3 truncate">{item.courseTitle}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {new Date(item.purchaseDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default StudentsEnrolled;