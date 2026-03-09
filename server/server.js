import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import authRoutes from './routes/authRoutes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '.env') })

const app = express()

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'NxtTrendz API is running ✅' })
})

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