import React, { useContext, useEffect, useState } from 'react';
import Footer from '../../components/student/Footer';
import { assets } from '../../assets/assets';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import humanizeDuration from 'humanize-duration';
import YouTube from 'react-youtube';
import { useAuth } from '@clerk/clerk-react';
import Loading from '../../components/student/Loading';

const CourseDetails = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);

  const { backendUrl, currency, userData, calculateChapterTime, calculateCourseDuration, calculateRating, calculateNoOfLectures } = useContext(AppContext);
  const { getToken } = useAuth();

  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/course/${id}`);
      if (data.success) setCourseData(data.courseData);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const enrollCourse = async () => {
    try {
      if (!userData) return toast.warn('Login to Enroll');
      if (isAlreadyEnrolled) return toast.warn('Already Enrolled');

      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/purchase`,
        { courseId: courseData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        window.location.replace(data.session_url);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const [openSections, setOpenSections] = useState({});
  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    fetchCourseData();
  }, []);

  useEffect(() => {
    if (userData && courseData) {
      setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id));
    }
  }, [userData, courseData]);

  return courseData ? (
    <>
      <div className="min-h-screen flex md:flex-row flex-col-reverse gap-10 items-start justify-between md:px-36 px-8 md:pt-20 pt-10 bg-[#0a1126] text-[#c0d7ff] relative">
        <div className="absolute top-0 left-0 w-full h-[400px] -z-10 bg-gradient-to-b from-[#2a3a6e]/70 to-transparent"></div>

        <div className="max-w-xl z-10">
          <h1 className="md:text-4xl text-2xl font-semibold text-[#c0d7ff] text-shadow-[0_0_8px_rgba(253,216,53,0.3)]">
            {courseData.courseTitle}
          </h1>
          <p
            className="pt-4 md:text-base text-sm text-[#f8f8ff]"
            dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0, 200) }}
          />

          <div className="flex items-center space-x-2 pt-3 pb-1 text-sm">
            <p className="text-[#c0d7ff]">{calculateRating(courseData)}</p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={i < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank}
                  alt="star"
                  className="w-3.5 h-3.5"
                />
              ))}
            </div>
            <p className="text-[#64ffda]">
              ({courseData.courseRatings.length} {courseData.courseRatings.length > 1 ? 'ratings' : 'rating'})
            </p>
            <p className="text-[#f8f8ff]">
              {courseData.enrolledStudents.length} {courseData.enrolledStudents.length > 1 ? 'students' : 'student'}
            </p>
          </div>

          <p className="text-sm text-[#f8f8ff]">
            Course by <span className="text-[#64ffda] underline">{courseData.educator.name}</span>
          </p>

          <div className="pt-8">
            <h2 className="text-xl font-semibold text-[#c0d7ff] text-shadow-[0_0_8px_rgba(253,216,53,0.3)]">
              Course Structure
            </h2>
            <div className="pt-5">
              {courseData.courseContent.map((chapter, index) => (
                <div
                  key={index}
                  className="border border-[#1a2a4d] bg-[#2a3a6e]/50 mb-2 rounded-lg shadow-[0_0_10px_rgba(61,90,241,0.3)]"
                >
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer select-none hover:bg-[#1e3a8a]/30 transition-colors duration-200"
                    onClick={() => toggleSection(index)}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={assets.down_arrow_icon}
                        alt="arrow"
                        className={`w-5 h-5 transform transition-transform ${openSections[index] ? 'rotate-180' : ''}`}
                      />
                      <p className="font-medium md:text-base text-sm text-[#c0d7ff]">{chapter.chapterTitle}</p>
                    </div>
                    <p className="text-sm text-[#f8f8ff]">
                      {chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}
                    </p>
                  </div>

                  <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? 'max-h-96' : 'max-h-0'}`}>
                    <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-[#f8f8ff] border-t border-[#1a2a4d]">
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className="flex items-start gap-2 py-1">
                          <img src={assets.play_icon} alt="bullet" className="w-4 h-4 mt-1" />
                          <div className="flex items-center justify-between w-full text-[#c0d7ff] text-xs md:text-sm">
                            <p>{lecture.lectureTitle}</p>
                            <div className="flex gap-2">
                              {lecture.isPreviewFree && (
                                <p
                                  onClick={() => setPlayerData({ videoId: lecture.lectureUrl.split('/').pop() })}
                                  className="text-[#64ffda] cursor-pointer hover:text-[#52d1d1] transition-colors duration-200"
                                >
                                  Preview
                                </p>
                              )}
                              <p className="text-[#f8f8ff]">
                                {humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'] })}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="py-10">
            <h3 className="text-xl font-semibold text-[#c0d7ff] text-shadow-[0_0_8px_rgba(253,216,53,0.3)]">
              Course Description
            </h3>
            <p
              className="rich-text pt-3 text-[#f8f8ff] md:text-base text-sm"
              dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}
            />
          </div>
        </div>

        <div className="max-w-[420px] min-w-[300px] z-10 bg-[#2a3a6e]/50 border border-[#1a2a4d] rounded-lg shadow-[0_0_10px_rgba(61,90,241,0.3)]">
          {playerData ? (
            <YouTube
              videoId={playerData.videoId}
              opts={{ playerVars: { autoplay: 1 } }}
              iframeClassName="w-full aspect-video rounded-t-lg"
            />
          ) : (
            <img src={courseData.courseThumbnail} alt="Thumbnail" className="w-full rounded-t-lg" />
          )}
          <div className="p-5">
            <div className="flex items-center gap-2">
              <img className="w-3.5" src={assets.time_left_clock_icon} alt="clock" />
              <p className="text-[#FDD835]">
                <span className="font-medium">7 days</span> left at this price!
              </p>
            </div>
            <div className="flex gap-3 items-center pt-2">
              <p className="text-[#c0d7ff] md:text-4xl text-2xl font-semibold text-shadow-[0_0_8px_rgba(253,216,53,0.3)]">
                {currency}{(courseData.coursePrice - (courseData.discount * courseData.coursePrice) / 100).toFixed(2)}
              </p>
              <p className="md:text-lg text-[#f8f8ff] line-through">{currency}{courseData.coursePrice}</p>
              <p className="md:text-lg text-[#f8f8ff]">{courseData.discount}% off</p>
            </div>
            <div className="flex items-center text-sm md:text-base gap-4 pt-2 md:pt-4 text-[#f8f8ff]">
              <div className="flex items-center gap-1">
                <img src={assets.star} alt="star" />
                <p>{calculateRating(courseData)}</p>
              </div>
              <div className="h-4 w-px bg-[#1a2a4d]"></div>
              <div className="flex items-center gap-1">
                <img src={assets.time_clock_icon} alt="clock" />
                <p>{calculateCourseDuration(courseData)}</p>
              </div>
              <div className="h-4 w-px bg-[#1a2a4d]"></div>
              <div className="flex items-center gap-1">
                <img src={assets.lesson_icon} alt="lessons" />
                <p>{calculateNoOfLectures(courseData)} lessons</p>
              </div>
            </div>
            <button
              onClick={enrollCourse}
              className="md:mt-6 mt-4 w-full py-3 rounded bg-[#3d5af1] hover:bg-[#1e3a8a] transition-colors duration-200 text-[#c0d7ff] font-medium shadow-[0_0_10px_rgba(61,90,241,0.3)]"
            >
              {isAlreadyEnrolled ? 'Already Enrolled' : 'Enroll Now'}
            </button>
            <div className="pt-6">
              <p className="md:text-xl text-lg font-medium text-[#c0d7ff] text-shadow-[0_0_8px_rgba(253,216,53,0.3)]">
                What's in the course?
              </p>
              <ul className="ml-4 pt-2 text-sm md:text-base list-disc text-[#f8f8ff]">
                <li>Lifetime access with free updates.</li>
                <li>Step-by-step, hands-on project guidance.</li>
                <li>Downloadable resources and source code.</li>
                <li>Quizzes to test your knowledge.</li>
                <li>Certificate of completion.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default CourseDetails;