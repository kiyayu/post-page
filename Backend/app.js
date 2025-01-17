// app.js
import cors from 'cors'
import express from 'express'
import { connectDB } from './config/db.js'
import  userRoutes  from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
const app = express()
app.use(express.json())
app.use(cors())

connectDB()


app.use('/api', userRoutes)
app.use('/api', postRoutes)
app.use('/api', notificationRoutes)

export default app

 

