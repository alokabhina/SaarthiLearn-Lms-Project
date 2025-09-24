import { v2 as cloudinary } from 'cloudinary';
import Course from '../models/Course.js';
import { Purchase } from '../models/Purchase.js';
import User from '../models/User.js';
import { clerkClient } from '@clerk/express';

// Update role to educator
export const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth.userId;

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: 'educator',
      },
    });

    res.status(200).json({ success: true, message: 'You can publish a course now' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add New Course
export const addCourse = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    const { courseData } = req.body;
    const imageFile = req.file;
    const educatorId = req.auth.userId;

    if (!imageFile) {
      return res.status(400).json({ success: false, message: 'Thumbnail Not Attached' });
    }

    if (!courseData) {
      return res.status(400).json({ success: false, message: 'Course data is required' });
    }

    let parsedCourseData;
    try {
      parsedCourseData = JSON.parse(courseData);
    } catch (error) {
      return res.status(400).json({ success: false, message: 'Invalid course data format: ' + error.message });
    }

    // Validate required fields
    if (!parsedCourseData.courseTitle || parsedCourseData.coursePrice === undefined) {
      return res.status(400).json({ success: false, message: 'Course title and price are required' });
    }

    if (typeof parsedCourseData.coursePrice !== 'number' || parsedCourseData.coursePrice < 0) {
      return res.status(400).json({ success: false, message: 'Course price must be a non-negative number' });
    }

    if (typeof parsedCourseData.discount !== 'number' || parsedCourseData.discount < 0 || parsedCourseData.discount > 100) {
      return res.status(400).json({ success: false, message: 'Discount must be a number between 0 and 100' });
    }

    if (!parsedCourseData.courseDescription) {
      return res.status(400).json({ success: false, message: 'Course description is required' });
    }

    // Validate courseContent structure
    if (parsedCourseData.courseContent && Array.isArray(parsedCourseData.courseContent)) {
      for (const chapter of parsedCourseData.courseContent) {
        if (!chapter.chapterId || !chapter.chapterTitle || !chapter.chapterOrder) {
          return res.status(400).json({ success: false, message: 'Each chapter must have chapterId, chapterTitle, and chapterOrder' });
        }
        if (chapter.chapterContent && Array.isArray(chapter.chapterContent)) {
          for (const lecture of chapter.chapterContent) {
            if (
              !lecture.lectureId ||
              !lecture.lectureTitle ||
              lecture.lectureDuration === undefined ||
              !lecture.lectureUrl ||
              lecture.isPreviewFree === undefined ||
              !lecture.lectureOrder
            ) {
              return res.status(400).json({ success: false, message: 'Each lecture must have lectureId, lectureTitle, lectureDuration, lectureUrl, isPreviewFree, and lectureOrder' });
            }
            if (typeof lecture.lectureDuration !== 'number') {
              return res.status(400).json({ success: false, message: 'Lecture duration must be a number' });
            }
          }
        }
      }
    }

    parsedCourseData.educator = educatorId;

    const newCourse = await Course.create(parsedCourseData);

    // Upload the image directly from buffer to Cloudinary
    const imageUpload = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'course_thumbnails' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      stream.end(imageFile.buffer);
    });

    newCourse.courseThumbnail = imageUpload.secure_url;
    await newCourse.save();

    res.status(201).json({ success: true, message: 'Course Added', course: newCourse });
  } catch (error) {
    console.error('Error in addCourse:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Educator Courses
export const getEducatorCourses = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });

    res.status(200).json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Educator Dashboard Data
export const educatorDashboardData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    const totalCourses = courses.length;
    const courseIds = courses.map((course) => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: 'completed',
    });

    const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

    const enrolledStudentsData = [];
    for (const course of courses) {
      const students = await User.find(
        { _id: { $in: course.enrolledStudents } },
        'name imageUrl'
      );

      students.forEach((student) => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student,
        });
      });
    }

    res.status(200).json({
      success: true,
      dashboardData: {
        totalEarnings,
        enrolledStudentsData,
        totalCourses,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Enrolled Students Data with Purchase Data
export const getEnrolledStudentsData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    const courseIds = courses.map((course) => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: 'completed',
    })
      .populate('userId', 'name imageUrl')
      .populate('courseId', 'courseTitle');

    const enrolledStudents = purchases.map((purchase) => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt,
    }));

    // Include students enrolled in free courses
    for (const course of courses) {
      if (course.coursePrice === 0) {
        const students = await User.find(
          { _id: { $in: course.enrolledStudents } },
          'name imageUrl'
        );
        students.forEach((student) => {
          enrolledStudents.push({
            student,
            courseTitle: course.courseTitle,
            purchaseDate: null,
          });
        });
      }
    }

    res.status(200).json({
      success: true,
      enrolledStudents,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Educator's Course
export const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const educatorId = req.auth.userId;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.educator.toString() !== educatorId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this course' });
    }

    await course.deleteOne();

    res.status(200).json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Enroll in Free Course
export const enrollFreeCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.auth.userId;

    if (!courseId) {
      return res.status(400).json({ success: false, message: 'Course ID is required' });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.coursePrice !== 0) {
      return res.status(400).json({ success: false, message: 'This is not a free course' });
    }

    if (course.enrolledStudents.includes(userId)) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }

    course.enrolledStudents.push(userId);
    await course.save();

    await User.findByIdAndUpdate(userId, {
      $addToSet: { enrolledCourses: courseId },
    });

    res.status(200).json({ success: true, message: 'Successfully enrolled in free course' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Edit Educator's Course (Updated with validation)
export const editCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const educatorId = req.auth.userId;
    const updates = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.educator.toString() !== educatorId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to edit this course' });
    }

    // Validation for updated fields
    if (updates.courseTitle && !updates.courseTitle.trim()) {
      return res.status(400).json({ success: false, message: 'Course title is required' });
    }
    if (updates.courseDescription && !updates.courseDescription.trim()) {
      return res.status(400).json({ success: false, message: 'Course description is required' });
    }
    if (updates.coursePrice !== undefined && (typeof updates.coursePrice !== 'number' || updates.coursePrice < 0)) {
      return res.status(400).json({ success: false, message: 'Course price must be a non-negative number' });
    }
    if (updates.discount !== undefined && (typeof updates.discount !== 'number' || updates.discount < 0 || updates.discount > 100)) {
      return res.status(400).json({ success: false, message: 'Discount must be a number between 0 and 100' });
    }
    if (updates.courseContent && Array.isArray(updates.courseContent)) {
      for (const chapter of updates.courseContent) {
        if (!chapter.chapterId || !chapter.chapterTitle || !chapter.chapterOrder) {
          return res.status(400).json({ success: false, message: 'Each chapter must have chapterId, chapterTitle, and chapterOrder' });
        }
        if (chapter.chapterContent && Array.isArray(chapter.chapterContent)) {
          for (const lecture of chapter.chapterContent) {
            if (
              !lecture.lectureId ||
              !lecture.lectureTitle ||
              lecture.lectureDuration === undefined ||
              !lecture.lectureUrl ||
              lecture.isPreviewFree === undefined ||
              !lecture.lectureOrder
            ) {
              return res.status(400).json({ success: false, message: 'Each lecture must have lectureId, lectureTitle, lectureDuration, lectureUrl, isPreviewFree, and lectureOrder' });
            }
            if (typeof lecture.lectureDuration !== 'number') {
              return res.status(400).json({ success: false, message: 'Lecture duration must be a number' });
            }
          }
        }
      }
    }

    // Only allow certain fields to be updated
    const allowedFields = [
      'courseTitle',
      'courseDescription',
      'courseThumbnail',
      'coursePrice',
      'discount',
      'courseContent',
      'isPublished'
    ];
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        course[field] = updates[field];
      }
    });

    await course.save();
    res.status(200).json({ success: true, message: 'Course updated successfully', course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};