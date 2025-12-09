# 🌐 Mini Social Feed App

A lightweight yet feature-rich social media application built with **React Native (Expo)** and a **TypeScript Node.js backend (Express)**, offering real-time interactions, push notifications, multi-category posting, authentication, and more.

This project fulfills all given requirements — plus additional enhancements like multi-category posting, username-based filtering, full CRUD for posts with meaningful UI, and rate-limited APIs for security.

---

## 📦 Download APK

👉 **Google Drive Link:**   [App Download Link Here](https://drive.google.com/drive/folders/1FuJvABRAyU3zjlxRgQVmtvte0OPwYkuu?usp=drive_link)

---


## 🚀 Features Overview

### 🔐 Authentication (JWT + Refresh Token)
- Signup / Login  
- Secure access tokens + refresh token flow  
- Logout from current session  
- Logout from all sessions  
- Complete role-safe and secure backend API protection  

### 📝 Post Management
- Create text-only posts  
- Update and delete your posts  
- View feed of all posts (paginated and ordered)  
- Multi-category posting (choose up to 3 categories per post)  
- Post filtering by:
  - Username
  - Category  

### ❤️💬 Real-Time Interactions
- Like/unlike any post  
- Comment on any post  
- Post owners receive **real-time push notifications** (via FCM + Expo Notifications)

### 🔔 Push Notifications
Implemented using:
- Firebase Cloud Messaging (FCM)  
- Expo Push Notification API  
- Tokens saved and updated during signup & login  
- Real-time notification triggers on likes and comments  

### 👤 User Profile
- View your own posts  
- Edit or delete posts  
- Other users’ posts visible in the feed  

### 🛡️ Security & Rate Limiting
- Upstash Redis Rate Limiter: **400 requests per IP per hour**  
- Secure JWT handling  
- Strong backend input validation  

---

## 📱 Mobile App (Expo + React Native)

Built using **Expo Router**, offering a smooth and modern UI/UX:

- Login & Signup  
- Feed screen  
- Create Post screen  
- Filter by category or username  
- Profile: view/edit/delete own posts  
- Interaction screens for comments & likes  
- Works on Android (APK available)  
- Real-time push notifications  

---

## 🧩 Tech Stack

### Backend
- Node.js + Express (TypeScript)
- Firebase Firestore
- Firebase Admin SDK
- Upstash Redis (Rate Limiting)
- JWT Authentication
- Vercel Hosting

### Frontend (Mobile)
- React Native + Expo
- Expo Router
- Expo Notifications + FCM Integration
- Axios
- EAS Build (APK generation)

---

## 🔗 API Base URL - https://mini-social-feed-app.vercel.app/



---

## 📌 API Endpoints

### 🔐 Auth Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/signup | Create account |
| POST | /auth/login | Login user |
| POST | /auth/refresh | Generate new access token |
| POST | /auth/logout | Logout from current session |
| POST | /auth/logout-all | Logout from all sessions |

---

### 👤 User Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /user/:id | Get user information |
| PUT | /user/:id | Update logged-in user info |

---

### 📝 Post Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /post | Get all posts |
| POST | /post | Create a new post |
| GET | /post/:id | Get post by ID |
| PUT | /post/:id | Update post |
| DELETE | /post/:id | Delete post |
| GET | /post/user/id/:userId | Get posts by user ID |
| GET | /post/user/name/:userName | Get posts by username |
| GET | /post/category/:name | Get posts by category |

---

### ❤️ Like Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /post/like/:postId | Like / Unlike a post |

---

### 💬 Comment Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /post/comment/:postId | Add a comment |
| GET | /post/comment/:postId | Fetch all comments on a post |

---

### 🔔 Notification Route

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/push-notification | Internal API to send FCM notification |

---

## 📁 Repository Structure

/project-root

├── backend/ # Express + TypeScript backend

├── mobile/ # React Native Expo app

└── README.md


---

## 🧭 Future Scope / Upcoming Enhancements

- CRON job to keep hosted server warm  
- Store notifications & display inside a dedicated tab  
- OAuth login + two-step verification  
- Aggressive caching (React Query, Redis caching)  
- Real-time live chat  
- Enhanced UI/UX (professional social media design)  
- More robust performance improvements  

---

## 🏁 Conclusion

The Mini Social Feed App is fully aligned with the project requirements and enhanced with additional features like category filtering, multi-category posts, CRUD UI, rate-limited endpoints, and real-time FCM notifications.

It is ready for demonstration, evaluation, and further expansion.

---
