import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import YouTube from 'react-youtube';
import { assets } from '../../assets/assets';
import { useParams } from 'react-router-dom';
import humanizeDuration from 'humanize-duration';
import axios from 'axios';
import { toast } from 'react-toastify';
import Rating from '../../components/student/Rating';
import Footer from '../../components/student/Footer';
import Loading from '../../components/student/Loading';

// Utility function to extract YouTube video ID from URL
const getYouTubeVideoId = (url) => {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    console.warn('Invalid or empty YouTube URL:', url);
    return null;
  }

  let sanitizedUrl = url.trim();

  try {
    const urlObject = new URL(sanitizedUrl);
    const hostname = urlObject.hostname.toLowerCase();

    let id = null;

    if (hostname === 'youtu.be') {
      id = urlObject.pathname.slice(1).split('/')[0];
    } else if (hostname.endsWith('youtube.com') || hostname.endsWith('youtube-nocookie.com')) {
      const pathname = urlObject.pathname;
      if (pathname.startsWith('/watch')) {
        id = urlObject.searchParams.get('v');
      } else if (pathname.startsWith('/embed/')) {
        id = pathname.slice(7).split('/')[0];
      } else if (pathname.startsWith('/v/')) {
        id = pathname.slice(3).split('/')[0];
      } else if (pathname.startsWith('/live/')) {
        id = pathname.slice(6).split('/')[0];
      } else if (pathname.startsWith('/shorts/')) {
        id = pathname.slice(8).split('/')[0];
      }
    }

    // Validate the extracted ID: must be exactly 11 characters of allowed set
    if (id && id.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(id)) {
      return id;
    } else {
      console.warn('Extracted invalid YouTube video ID:', id, 'from URL:', sanitizedUrl);
      return null;
    }
  } catch (error) {
    console.error('Error parsing YouTube URL:', error, url);
    return null;
  }
};

const Player = () => {
  const { enrolledCourses, backendUrl, getToken, calculateChapterTime, userData, fetchUserEnrolledCourses } = useContext(AppContext);
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [playerData, setPlayerData] = useState(null);
  const [initialRating, setInitialRating] = useState(0);
  const [previewData, setPreviewData] = useState(null);

  // Fetch course data for enrolled users
  const getCourseData = () => {
    enrolledCourses.forEach((course) => {
      if (course._id === courseId) {
        setCourseData(course);
        course.courseRatings.forEach((item) => {
          if (item.userId === userData._id) {
            setInitialRating(item.rating);
          }
        });
      }
    });
  };

  // Fetch course data for preview (no authentication required)
  const fetchPreviewData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/course/${courseId}`);
      if (data.success) {
        setPreviewData(data.course);
        // Automatically select the first preview lecture if available
        const previewLecture = data.course.courseContent
          .flatMap((chapter) => chapter.chapterContent)
          .find((lecture) => lecture.isPreviewFree && lecture.lectureUrl);
        if (previewLecture) {
          setPlayerData({ ...previewLecture, chapter: 1, lecture: 1 });
        } else {
          toast.error('No free preview video available for this course.');
        }
      } else {
        toast.error(data.message || 'Failed to load preview data');
      }
    } catch (error) {
      toast.error('Error fetching preview data: ' + error.message);
    }
  };

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseData();
    } else {
      fetchPreviewData();
    }
  }, [enrolledCourses]);

  const markLectureAsCompleted = async (lectureId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/update-course-progress`,
        { courseId, lectureId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message);
        getCourseProgress();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/get-course-progress`,
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setProgressData(data.progressData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRate = async (rating) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/add-rating`,
        { courseId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message);
        fetchUserEnrolledCourses();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseProgress();
    }
  }, []);

  const displayData = courseData || previewData;

  return displayData ? (
    <>
      <div className="p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36 bg-[#1E1E2F] text-[#C0C0C0]">
        <div>
          <h2 className="text-xl font-semibold text-white">Course Structure</h2>
          <div className="pt-5">
            {displayData.courseContent.map((chapter, index) => (
              <div key={index} className="border border-gray-500 bg-[#2E2E3A] mb-2 rounded">
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                  onClick={() => toggleSection(index)}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={assets.down_arrow_icon}
                      alt="arrow icon"
                      className={`transform transition-transform ${openSections[index] ? 'rotate-180' : ''}`}
                    />
                    <p className="font-medium text-white">{chapter.chapterTitle}</p>
                  </div>
                  <p className="text-sm text-gray-400">
                    {chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}
                  </p>
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openSections[index] ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-300 border-t border-gray-500">
                    {chapter.chapterContent.map((lecture, i) => (
                      <li key={i} className="flex items-start gap-2 py-1">
                        <img
                          src={
                            progressData && progressData.lectureCompleted.includes(lecture.lectureId)
                              ? assets.blue_tick_icon
                              : assets.play_icon
                          }
                          alt="bullet icon"
                          className="w-4 h-4 mt-1"
                        />
                        <div className="flex items-center justify-between w-full text-white text-xs md:text-default">
                          <p>{lecture.lectureTitle}</p>
                          <div className="flex gap-2">
                            {lecture.lectureUrl && (lecture.isPreviewFree || courseData) && (
                              <p
                                onClick={() => {
                                  const videoId = getYouTubeVideoId(lecture.lectureUrl);
                                  if (videoId) {
                                    setPlayerData({ ...lecture, chapter: index + 1, lecture: i + 1 });
                                  } else {
                                    toast.error('Invalid YouTube URL for this lecture');
                                  }
                                }}
                                className="text-blue-500 cursor-pointer"
                              >
                                Watch
                              </p>
                            )}
                            {!lecture.lectureUrl && !courseData && (
                              <p className="text-gray-500">Enroll to access</p>
                            )}
                            <p>{humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'] })}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          {courseData && (
            <div className="flex items-center gap-2 py-3 mt-10">
              <h1 className="text-xl font-bold text-white">Rate this Course:</h1>
              <Rating initialRating={initialRating} onRate={handleRate} />
            </div>
          )}
        </div>
        <div className="md:mt-10">
          {playerData && playerData.lectureUrl ? (
            <div>
              <YouTube
                iframeClassName="w-full aspect-video"
                videoId={getYouTubeVideoId(playerData.lectureUrl)}
                onError={(e) => {
                  console.error('YouTube player error:', e);
                  toast.error('Failed to load video. It may be private, deleted, or the URL is invalid.');
                }}
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xl text-white">
                  {playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}
                </p>
                {courseData && (
                  <button
                    onClick={() => markLectureAsCompleted(playerData.lectureId)}
                    className="text-blue-600"
                  >
                    {progressData && progressData.lectureCompleted.includes(playerData.lectureId)
                      ? 'Completed'
                      : 'Mark Complete'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div>
              <img src={displayData.courseThumbnail} alt="Course Thumbnail" />
              {!courseData && <p className="text-gray-400 mt-2">No preview video available. Enroll to access full content.</p>}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default Player;