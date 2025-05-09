import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';

const Dashboard = () => {
  const { backendUrl, isEducator, currency, getToken } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/educator/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setDashboardData(data.dashboardData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchDashboardData();
    }
  }, [isEducator]);

  return dashboardData ? (
    <div className='min-h-screen flex flex-col items-start gap-8 p-4 md:p-8 bg-[#0a1126] text-[#c0d7ff]'>
      <div className='space-y-6 w-full'>
        {/* Stats */}
        <div className='flex flex-wrap gap-6'>
          <div className='flex items-center gap-4 bg-[#2a3a6e]/50 border border-[#1a2a4d] p-4 w-64 rounded-lg shadow-[0_0_10px_rgba(61,90,241,0.3)]'>
            <img src={assets.patients_icon} alt="students" className='w-10 h-10' />
            <div>
              <p className='text-2xl font-semibold text-[#c0d7ff] text-shadow-[0_0_8px_rgba(253,216,53,0.3)]'>
                {dashboardData.enrolledStudentsData.length}
              </p>
              <p className='text-base text-[#f8f8ff]'>Total Enrolments</p>
            </div>
          </div>
          <div className='flex items-center gap-4 bg-[#2a3a6e]/50 border border-[#1a2a4d] p-4 w-64 rounded-lg shadow-[0_0_10px_rgba(61,90,241,0.3)]'>
            <img src={assets.appointments_icon} alt="courses" className='w-10 h-10' />
            <div>
              <p className='text-2xl font-semibold text-[#c0d7ff] text-shadow-[0_0_8px_rgba(253,216,53,0.3)]'>
                {dashboardData.totalCourses}
              </p>
              <p className='text-base text-[#f8f8ff]'>Total Courses</p>
            </div>
          </div>
          <div className='flex items-center gap-4 bg-[#2a3a6e]/50 border border-[#1a2a4d] p-4 w-64 rounded-lg shadow-[0_0_10px_rgba(61,90,241,0.3)]'>
            <img src={assets.earning_icon} alt="earnings" className='w-10 h-10' />
            <div>
              <p className='text-2xl font-semibold text-[#c0d7ff] text-shadow-[0_0_8px_rgba(253,216,53,0.3)]'>
                {currency}{Math.floor(dashboardData.totalEarnings)}
              </p>
              <p className='text-base text-[#f8f8ff]'>Total Earnings</p>
            </div>
          </div>
        </div>

        {/* Latest Enrolments */}
        <div className='w-full'>
          <h2 className='pb-4 text-xl font-semibold text-[#c0d7ff] text-shadow-[0_0_8px_rgba(253,216,53,0.3)]'>
            Latest Enrolments
          </h2>
          <div className='max-w-4xl w-full rounded-lg bg-[#2a3a6e]/50 border border-[#1a2a4d] shadow-[0_0_10px_rgba(61,90,241,0.3)]'>
            <table className='table-fixed md:table-auto w-full'>
              <thead className='text-[#c0d7ff] border-b border-[#1a2a4d] text-sm text-left'>
                <tr>
                  <th className='px-4 py-3 font-semibold text-center hidden sm:table-cell'>#</th>
                  <th className='px-4 py-3 font-semibold'>Student Name</th>
                  <th className='px-4 py-3 font-semibold'>Course Title</th>
                </tr>
              </thead>
              <tbody className='text-sm text-[#f8f8ff]'>
                {dashboardData.enrolledStudentsData.map((item, index) => (
                  <tr
                    key={index}
                    className='border-b border-[#1a2a4d] hover:bg-[#1e3a8a]/30 transition-colors duration-200'
                  >
                    <td className='px-4 py-3 text-center hidden sm:table-cell'>{index + 1}</td>
                    <td className='md:px-4 px-2 py-3 flex items-center space-x-3'>
                      <img
                        src={item.student.imageUrl}
                        alt="Profile"
                        className='w-9 h-9 rounded-full border border-[#64ffda]/30'
                      />
                      <span className='truncate text-[#c0d7ff]'>{item.student.name}</span>
                    </td>
                    <td className='px-4 py-3 truncate'>{item.courseTitle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Dashboard;