import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditCourse = ({ courseId }) => {
  const [course, setCourse] = useState(null);
  const [form, setForm] = useState({
    courseTitle: '',
    courseDescription: '',
    coursePrice: 0,
    discount: 0,
    courseThumbnail: '',
    courseContent: [], // Placeholder; add editor below if needed
    isPublished: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // Renamed for clarity
  const [message, setMessage] = useState('');

  // Assume token from localStorage or Clerk; adjust as needed (e.g., use @clerk/clerk-react for getToken)
  const getToken = () => localStorage.getItem('token'); // Or integrate Clerk's useAuth

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) {
        setError('Invalid course ID');
        return;
      }
      try {
        setError(''); // Clear previous errors
        const token = getToken();
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const res = await axios.get(`/api/educator/courses/${courseId}`, config);
        if (res.data.success) {
          const courseData = res.data.courseData;
          setCourse(courseData);
          setForm({
            courseTitle: courseData.courseTitle || '',
            courseDescription: courseData.courseDescription || '',
            coursePrice: courseData.coursePrice || 0,
            discount: courseData.discount || 0,
            courseThumbnail: courseData.courseThumbnail || '',
            courseContent: courseData.courseContent || [],
            isPublished: !!courseData.isPublished, // Ensure boolean
          });
        } else {
          setError(res.data.message || 'Course not found');
        }
      } catch (err) {
        console.error('Fetch error:', err); // For debugging
        setError(err.response?.data?.message || 'Failed to load course data');
      }
    };
    fetchCourse();
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) || 0 : value) 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!form.courseTitle.trim() || form.coursePrice < 0 || form.discount < 0 || form.discount > 100) {
      setError('Please fix form errors (e.g., positive price, valid discount)');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const token = getToken();
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.put(`/api/educator/edit-course/${courseId}`, form, config);
      if (res.data.success) {
        setMessage('Course updated successfully!');
        // Optionally refetch to sync
      } else {
        setError(res.data.message || 'Update failed');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.response?.data?.message || 'Error updating course');
    }
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error && !course) return <div>Error: {error}</div>; // Show error if no course

  return (
    <div className="edit-course-form">
      <h2>Edit Course</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input 
          name="courseTitle" 
          value={form.courseTitle} 
          onChange={handleChange} 
          required 
        />
        <label>Description:</label>
        <textarea 
          name="courseDescription" 
          value={form.courseDescription} 
          onChange={handleChange} 
          required 
        />
        <label>Price:</label>
        <input 
          name="coursePrice" 
          type="number" 
          min="0" 
          step="0.01"
          value={form.coursePrice} 
          onChange={handleChange} 
          required 
        />
        <label>Discount (%):</label>
        <input 
          name="discount" 
          type="number" 
          min="0" 
          max="100" 
          value={form.discount} 
          onChange={handleChange} 
        />
        <label>Thumbnail URL:</label>
        <input 
          name="courseThumbnail" 
          value={form.courseThumbnail} 
          onChange={handleChange} 
          placeholder="https://example.com/image.jpg"
        />
        <label>Published:</label>
        <input 
          name="isPublished" 
          type="checkbox" 
          checked={form.isPublished} 
          onChange={handleChange} 
        />
        {/* Add this for courseContent if needed */}
        <label>Course Content:</label>
        <textarea 
          placeholder="JSON array of chapters/lectures (e.g., [{title: 'Intro', content: '...'}])"
          readOnly // For now; make editable with a rich editor
        >
          {JSON.stringify(form.courseContent, null, 2)}
        </textarea>
        <button type="submit" disabled={loading}>Update Course</button>
      </form>
      {message && <p className="success">{message}</p>}
    </div>
  );
};

export default EditCourse;