import express from 'express';
import { ClerkExpressRequireAuth } from '@clerk/express';
import { addUserRating, getUserCourseProgress, getUserData, purchaseCourse, updateUserCourseProgress, userEnrolledCourses } from '../controllers/userController.js';

const userRouter = express.Router();
const authMiddleware = ClerkExpressRequireAuth(); // Clerk's middleware

// Routes
userRouter.get('/data', authMiddleware, getUserData);
userRouter.post('/purchase-course', authMiddleware, purchaseCourse);
userRouter.get('/enrolled-courses', authMiddleware, userEnrolledCourses);
userRouter.post('/update-course-progress', authMiddleware, updateUserCourseProgress);
userRouter.post('/get-course-progress', authMiddleware, getUserCourseProgress);
userRouter.post('/add-rating', authMiddleware, addUserRating);

export default userRouter;