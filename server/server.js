import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import connectCloudinary from './configs/cloudinary.js'
import userRouter from './routes/userRoutes.js'
import educatorRouter from './routes/educatorRoutes.js'
import courseRouter from './routes/courseRoute.js'
import invoiceRouter from './routes/invoiceRoute.js'
import { clerkMiddleware } from '@clerk/express'
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js'

// Initialize Express
const app = express()

// Connect to DB and Cloudinary
await connectDB()
await connectCloudinary()

// Middleware
app.use(cors())
app.use(clerkMiddleware())

// Webhook routes
app.post('/clerk', express.json(), clerkWebhooks)
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)

// JSON parsing middleware before protected routes
app.use('/api/user', express.json(), userRouter)
app.use('/api/educator', express.json(), educatorRouter)
app.use('/api/course', express.json(), courseRouter)
app.use('/api/invoice', express.json(), invoiceRouter) // 👈 ADDED invoice route here

// Test route
app.get('/', (req, res) => res.send("API Working"))

// Port
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
