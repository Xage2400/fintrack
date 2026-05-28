# 💰 FinTrack — Personal Budget Tracker

A full-stack MERN budget tracking application with JWT authentication, transaction management, and data visualisation dashboards.

## 🌐 Live Demo
[FinTrack Live](https://main.d21xs34jvlnbna.amplifyapp.com)

## 🛠️ Tech Stack

**Frontend**
- React.js
- React Router
- Recharts (data visualisation)
- Axios
- AWS Amplify (hosting)

**Backend**
- Node.js
- Express.js
- MongoDB Atlas
- JSON Web Tokens (JWT)
- bcryptjs
- AWS Lambda + API Gateway (serverless deployment)

## ✨ Features
- User authentication (register/login/logout)
- JWT protected routes
- Full CRUD for income and expense transactions
- Category filtering
- Dashboard with Pie and Bar charts
- Responsive dark UI

## 🚀 Getting Started

### Prerequisites
- Node.js
- MongoDB Atlas account
- AWS account

### Installation

1. Clone the repository
2. Install server dependencies: `cd server && npm install`
3. Install client dependencies: `cd client && npm install`
4. Create a `.env` file in the server folder with `MONGO_URI`, `JWT_SECRET` and `PORT`
5. Run backend: `npm run dev`
6. Run frontend: `npm start`

## 📁 Project Structure

- client/ — React frontend (context, pages, utils)
- server/ — Express backend (middleware, models, routes)

## 👤 Author
Nyasha Kurimwi — [GitHub](https://github.com/Xage2400)