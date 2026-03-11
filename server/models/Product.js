import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required']
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  image: {
    type: String,
    required: [true, 'Product image is required']
  },
  category: {
    type: String,
    required: [true, 'Product category is required']
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  rating: {
    rate: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  }
}, { timestamps: true })

const Product = mongoose.model('Product', productSchema)
export default Product
