import express from 'express';
import {
  addCourse,
  educatorDashboardData,
  getEducatorCourses,
  getEnrolledStudentsData,
  updateRoleToEducator,
  deleteCourse,
  editCourse,
  enrollFreeCourse,
} from '../controllers/educatorController.js';
import upload from '../configs/multer.js';
import { protectEducator } from '../middlewares/authMiddleware.js';

const educatorRouter = express.Router();

// Add Educator Role
educatorRouter.get('/update-role', updateRoleToEducator);

// Add Courses
educatorRouter.post('/add-course', upload.single('image'), protectEducator, addCourse);

// Get Educator Courses
educatorRouter.get('/courses', protectEducator, getEducatorCourses);

// Delete Educator Course
educatorRouter.delete('/delete-course/:courseId', protectEducator, deleteCourse);

// Edit Educator Course
educatorRouter.put('/edit-course/:courseId', protectEducator, editCourse);

// Get Educator Dashboard Data
educatorRouter.get('/dashboard', protectEducator, educatorDashboardData);

// Get Educator Students Data
educatorRouter.get('/enrolled-students', protectEducator, getEnrolledStudentsData);

// Enroll in Free Course
educatorRouter.post('/enroll-free-course', protectEducator, enrollFreeCourse);

export default educatorRouter;