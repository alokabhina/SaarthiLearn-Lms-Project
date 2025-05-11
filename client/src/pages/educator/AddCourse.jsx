import React, { useContext, useEffect, useRef, useState } from 'react';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';
import Quill from 'quill';
import uniqid from 'uniqid';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';

const AddCourse = () => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const { backendUrl, getToken } = useContext(AppContext);

  const [courseTitle, setCourseTitle] = useState('');
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    isPreviewFree: false,
  });

  const handleChapter = (action, chapterId) => {
    if (action === 'add') {
      const title = prompt('Enter Chapter Name:');
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === 'remove') {
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
    } else if (action === 'toggle') {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId ? { ...chapter, collapsed: !chapter.collapsed } : chapter
        )
      );
    }
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === 'add') {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === 'remove') {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            chapter.chapterContent.splice(lectureIndex, 1);
          }
          return chapter;
        })
      );
    }
  };

  const addLecture = () => {
    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetails,
            lectureDuration: Number(lectureDetails.lectureDuration), // Convert to Number
            lectureOrder: chapter.chapterContent.length > 0 ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1 : 1,
            lectureId: uniqid(),
          };
          chapter.chapterContent.push(newLecture);
        }
        return chapter;
      })
    );
    setShowPopup(false);
    setLectureDetails({
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      isPreviewFree: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!image) {
        toast.error('Thumbnail Not Selected');
        return;
      }
      if (!courseTitle || coursePrice < 0 || discount < 0 || discount > 100) {
        toast.error('Invalid course details');
        return;
      }

      // Prepare courseContent without the UI-only 'collapsed' field
      const preparedChapters = chapters.map(chapter => ({
        chapterId: chapter.chapterId,
        chapterTitle: chapter.chapterTitle,
        chapterOrder: chapter.chapterOrder,
        chapterContent: chapter.chapterContent.map(lecture => ({
          lectureId: lecture.lectureId,
          lectureTitle: lecture.lectureTitle,
          lectureDuration: lecture.lectureDuration,
          lectureUrl: lecture.lectureUrl,
          isPreviewFree: lecture.isPreviewFree,
          lectureOrder: lecture.lectureOrder,
        })),
      }));

      const courseData = {
        courseTitle,
        courseDescription: quillRef.current.root.innerHTML,
        coursePrice: Number(coursePrice), // Match schema field name
        discount: Number(discount),
        courseContent: preparedChapters,
      };

      const formData = new FormData();
      formData.append('courseData', JSON.stringify(courseData));
      formData.append('image', image);

      // Log FormData contents for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const token = await getToken();

      const { data } = await axios.post(`${backendUrl}/api/educator/add-course`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        toast.success(data.message);
        setCourseTitle('');
        setCoursePrice(0);
        setDiscount(0);
        setImage(null);
        setChapters([]);
        quillRef.current.root.innerHTML = '';
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create course');
      console.error('Error submitting course:', error.response?.data);
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
          ]
        },
        formats: [
          'header',
          'bold',
          'italic',
          'underline',
          'list',
          'bullet',
          'link',
          'image'
        ]
      });

      quillRef.current.format('color', '#E0F7FA');
      quillRef.current.on('text-change', () => {
        const range = quillRef.current.getSelection();
        if (range) {
          quillRef.current.format('color', '#E0F7FA');
        }
      });
    }
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-6 md:p-10'>
      <form onSubmit={handleSubmit} className='max-w-3xl mx-auto bg-gray-800/50 backdrop-blur-md rounded-xl p-6 shadow-xl'>
        <h2 className='text-2xl font-bold text-cyan-400 mb-6'>Create New Course</h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div>
            <label htmlFor="courseTitle" className='block text-sm font-medium text-gray-300 mb-1'>Course Title</label>
            <input
              id="courseTitle"
              onChange={e => setCourseTitle(e.target.value)}
              value={courseTitle}
              type="text"
              placeholder='Enter course title'
              className='w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500'
              required
            />
          </div>
          <div>
            <label htmlFor="coursePrice" className='block text-sm font-medium text-gray-300 mb-1'>Course Price</label>
            <input
              id="coursePrice"
              onChange={e => setCoursePrice(e.target.value)}
              value={coursePrice}
              type="number"
              placeholder='0'
              min="0"
              className='w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500'
              required
            />
          </div>
        </div>

        <div className='mb-6'>
          <label className='block text-sm font-medium text-gray-300 mb-1'>Course Description</label>
          <div ref={editorRef} className='bg-gray-700/50 text-gray-100 rounded-lg border border-gray-600' />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div>
            <label htmlFor="discount" className='block text-sm font-medium text-gray-300 mb-1'>Discount (%)</label>
            <input
              id="discount"
              onChange={e => setDiscount(e.target.value)}
              value={discount}
              type="number"
              placeholder='0'
              min="0"
              max="100"
              className='w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500'
              required
            />
          </div>
          <div>
            <label htmlFor="thumbnailImage" className='block text-sm font-medium text-gray-300 mb-1'>Course Thumbnail</label>
            <div className='flex items-center gap-3'>
              <label htmlFor='thumbnailImage' className='cursor-pointer'>
                <div className='p-3 bg-cyan-500 rounded-lg hover:bg-cyan-600 transition'>
                  <img src={assets.file_upload_icon} alt="Upload" className='w-6 h-6' />
                </div>
                <input
                  type="file"
                  id='thumbnailImage'
                  onChange={e => setImage(e.target.files[0])}
                  accept="image/*"
                  hidden
                />
              </label>
              {image && <img className='h-12 rounded' src={URL.createObjectURL(image)} alt="Thumbnail Preview" />}
            </div>
          </div>
        </div>

        <div className='mb-6'>
          <h3 className='text-lg font-semibold text-cyan-400 mb-4'>Course Chapters</h3>
          {chapters.map((chapter, chapterIndex) => (
            <div key={chapterIndex} className='bg-gray-700/50 rounded-lg mb-4 border border-gray-600'>
              <div className='flex justify-between items-center p-4 border-b border-gray-600'>
                <div className='flex items-center gap-3'>
                  <img
                    className={`w-5 h-5 cursor-pointer transition-transform ${chapter.collapsed ? 'rotate-90' : ''}`}
                    src={assets.dropdown_icon}
                    alt="Toggle"
                    onClick={() => handleChapter('toggle', chapter.chapterId)}
                  />
                  <span className='font-semibold text-gray-100'>{chapterIndex + 1}. {chapter.chapterTitle}</span>
                </div>
                <div className='flex items-center gap-4'>
                  <span className='text-sm text-gray-400'>{chapter.chapterContent.length} Lectures</span>
                  <img
                    onClick={() => handleChapter('remove', chapter.chapterId)}
                    src={assets.cross_icon}
                    alt="Remove"
                    className='w-5 h-5 cursor-pointer hover:opacity-80'
                  />
                </div>
              </div>
              {!chapter.collapsed && (
                <div className='p-4'>
                  {chapter.chapterContent.map((lecture, lectureIndex) => (
                    <div key={lectureIndex} className='flex justify-between items-center mb-3 bg-gray-600/30 p-3 rounded-lg'>
                      <span className='text-gray-200'>
                        {lectureIndex + 1}. {lecture.lectureTitle} - {lecture.lectureDuration} mins -{' '}
                        <a href={lecture.lectureUrl} target="_blank" rel="noreferrer" className="text-cyan-400 underline hover:text-cyan-300">
                          Link
                        </a>{' '}
                        - {lecture.isPreviewFree ? 'Free Preview' : 'Paid'}
                      </span>
                      <img
                        onClick={() => handleLecture('remove', chapter.chapterId, lectureIndex)}
                        src={assets.cross_icon}
                        alt="Remove"
                        className='w-5 h-5 cursor-pointer hover:opacity-80'
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => handleLecture('add', chapter.chapterId)}
                    className='mt-3 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition'
                  >
                    + Add Lecture
                  </button>
                </div>
              )}
            </div>
          ))}
          <button
            onClick={() => handleChapter('add')}
            className='w-full py-3 bg-gray-700/50 text-cyan-400 rounded-lg border border-gray-600 hover:bg-gray-600/80 transition'
          >
            + Add Chapter
          </button>
        </div>

        {showPopup && (
          <div className='fixed inset-0 flex items-center justify-center bg-black/70'>
            <div className='bg-gray-800/80 backdrop-blur-md p-6 rounded-xl w-full max-w-md border border-gray-600'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-semibold text-cyan-400'>Add Lecture</h2>
                <img
                  onClick={() => setShowPopup(false)}
                  src={assets.cross_icon}
                  className='w-5 h-5 cursor-pointer hover:opacity-80'
                  alt="Close"
                />
              </div>
              <div className='space-y-4'>
                <div>
                  <label htmlFor="lectureTitle" className='block text-sm font-medium text-gray-300 mb-1'>Lecture Title</label>
                  <input
                    id="lectureTitle"
                    type="text"
                    className='w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500'
                    value={lectureDetails.lectureTitle}
                    onChange={(e) => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="lectureDuration" className='block text-sm font-medium text-gray-300 mb-1'>Duration (minutes)</label>
                  <input
                    id="lectureDuration"
                    type="number"
                    className='w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500'
                    value={lectureDetails.lectureDuration}
                    onChange={(e) => setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="lectureUrl" className='block text-sm font-medium text-gray-300 mb-1'>Lecture URL</label>
                  <input
                    id="lectureUrl"
                    type="text"
                    className='w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500'
                    value={lectureDetails.lectureUrl}
                    onChange={(e) => setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })}
                  />
                </div>
                <div className='flex items-center gap-3'>
                  <label htmlFor="isPreviewFree" className='text-sm font-medium text-gray-300'>Is Preview Free?</label>
                  <input
                    id="isPreviewFree"
                    type="checkbox"
                    className='h-5 w-5 text-cyan-500 focus:ring-cyan-500'
                    checked={lectureDetails.isPreviewFree}
                    onChange={(e) => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })}
                  />
                </div>
              </div>
              <button
                type='button'
                className='w-full mt-6 bg-cyan-500 text-white py-3 rounded-lg hover:bg-cyan-600 transition'
                onClick={addLecture}
              >
                Add Lecture
              </button>
            </div>
          </div>
        )}

        <button
          type="submit"
          className='w-full py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition'
        >
          Create Course
        </button>
      </form>
    </div>
  );
};

export default AddCourse;