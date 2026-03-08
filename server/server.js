import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express()

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your Vite frontend URL
  credentials: true
}))
app.use(express.json())

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'NxtTrendz API is running ✅' })
})

// DB Connection + Server Start
const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected ✅')
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} ✅`)
    })
  })
  .catch((err) => {
    console.error('MongoDB connection failed ❌', err)
    process.exit(1)
  })