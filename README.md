# NxtTrendz — Fullstack E-Commerce Platform

![NxtTrendz](https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png)

A full-featured e-commerce web application built with the MERN stack, featuring secure authentication, cart management, Razorpay payment integration, and an admin dashboard.

🔗 **Live Demo:** [nxt-trendz-fullstack.vercel.app](https://nxt-trendz-fullstack.vercel.app)
🔗 **API:** [nxt-trendz-fullstack.onrender.com](https://nxt-trendz-fullstack.onrender.com)

---

## Tech Stack

**Frontend**
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat&logo=vite)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript)

**Backend**
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat&logo=jsonwebtokens)

**Payments & Deployment**
![Razorpay](https://img.shields.io/badge/Razorpay-Payment-02042B?style=flat&logo=razorpay)
![Vercel](https://img.shields.io/badge/Vercel-Frontend-000000?style=flat&logo=vercel)
![Render](https://img.shields.io/badge/Render-Backend-46E3B7?style=flat&logo=render)

---

## Features

### User Features
- 🔐 JWT-based authentication (Register/Login)
- 🛍️ Browse products with search, filter by category & rating, sort by price
- 📦 Product detail page with similar products
- 🛒 Persistent cart (synced with MongoDB)
- 💳 Razorpay payment integration (UPI, Cards, NetBanking)
- 📋 Order history with payment and delivery status

### Admin Features
- 👑 Role-based access control (Admin/User)
- 📊 Admin dashboard with Orders, Products, Users tabs
- 🔄 Update order status (Processing → Shipped → Delivered)
- ➕ Add/Delete products
- 👥 View and delete users

---

## Project Structure
```
nxt-trendz-fullstack/
├── client/                 # React + Vite Frontend
│   ├── src/
│   │   ├── components/     # 18+ React components
│   │   ├── context/        # Cart Context
│   │   └── utils/          # API utility with base URL
│   └── vercel.json         # Client-side routing config
└── server/                 # Express Backend
    ├── controllers/        # Auth, Cart, Orders, Payment, Admin
    ├── middleware/         # JWT protect + admin guard
    ├── models/             # User, Cart, Order, Product
    └── routes/             # 20+ REST API endpoints
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/profile | Get user profile |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/cart | Get user cart |
| POST | /api/cart | Add item to cart |
| PUT | /api/cart/:productId | Update quantity |
| DELETE | /api/cart/:productId | Remove item |
| DELETE | /api/cart/clear | Clear cart |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/orders | Place order |
| GET | /api/orders/my | Get my orders |

### Payment
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/payment/create-order | Create Razorpay order |
| POST | /api/payment/verify | Verify payment signature |

---

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Razorpay test account

### Installation
```bash
# Clone the repo
git clone https://github.com/hrutik-codes/nxt-trendz-fullstack.git
cd nxt-trendz-fullstack

# Install dependencies
npm install
cd client && npm install
cd ../server && npm install
```

### Environment Variables

Create `server/.env`:
```
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Create `client/.env`:
```
VITE_API_URL=http://localhost:5000
```

### Run Development Server
```bash
# From root directory
npm run dev
```

Runs both frontend (port 5173) and backend (port 5000) concurrently.

---

## Test Credentials
```
Admin Account:
Email:    hrutik@test.com
Password: 123456

Test Payment (Razorpay):
UPI ID: success@razorpay
```

---

## Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | nxt-trendz-fullstack.vercel.app |
| Backend | Render | nxt-trendz-fullstack.onrender.com |
| Database | MongoDB Atlas | Cloud hosted |

> ⚠️ Render free tier spins down after 15 min inactivity. First request may take ~30 seconds.

---

## Author

**Hrutik Jagdale**
- GitHub: [@hrutik-codes](https://github.com/hrutik-codes)

---

## License
MIT © 2026 Hrutik Jagdale