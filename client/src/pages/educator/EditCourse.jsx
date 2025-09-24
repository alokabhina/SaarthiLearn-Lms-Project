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
    courseContent: [],
    isPublished: true,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch course data for editing
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`/api/course/${courseId}`);
        if (res.data.success) {
          setCourse(res.data.courseData);
          setForm({
            courseTitle: res.data.courseData.courseTitle || '',
            courseDescription: res.data.courseData.courseDescription || '',
            coursePrice: res.data.courseData.coursePrice || 0,
            discount: res.data.courseData.discount || 0,
            courseThumbnail: res.data.courseData.courseThumbnail || '',
            courseContent: res.data.courseData.courseContent || [],
            isPublished: res.data.courseData.isPublished,
          });
        }
      } catch (err) {
        setMessage('Failed to load course data');
      }
    };
    fetchCourse();
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.put(`/api/educator/edit-course/${courseId}`, form);
      if (res.data.success) {
        setMessage('Course updated successfully!');
      } else {
        setMessage(res.data.message || 'Update failed');
      }
    } catch (err) {
      setMessage('Error updating course');
    }
    setLoading(false);
  };

  if (!course) return <div>Loading...</div>;

  return (
    <div className="edit-course-form">
      <h2>Edit Course</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input name="courseTitle" value={form.courseTitle} onChange={handleChange} required />
        <label>Description:</label>
        <textarea name="courseDescription" value={form.courseDescription} onChange={handleChange} required />
        <label>Price:</label>
        <input name="coursePrice" type="number" value={form.coursePrice} onChange={handleChange} required />
        <label>Discount (%):</label>
        <input name="discount" type="number" value={form.discount} onChange={handleChange} min="0" max="100" />
        <label>Thumbnail URL:</label>
        <input name="courseThumbnail" value={form.courseThumbnail} onChange={handleChange} />
        <label>Published:</label>
        <input name="isPublished" type="checkbox" checked={form.isPublished} onChange={e => setForm(prev => ({ ...prev, isPublished: e.target.checked }))} />
        {/* For simplicity, courseContent editing is omitted here. You can add a dynamic editor for chapters/lectures. */}
        <button type="submit" disabled={loading}>Update Course</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default EditCourse;
