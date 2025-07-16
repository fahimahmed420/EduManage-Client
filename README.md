# EduManage 🎓

EduManage is a full-stack MERN educational platform that allows students and teachers to manage classes, assignments, feedback, and more. The platform includes a dynamic dashboard, authentication system, and admin controls — all wrapped in a beautiful UI.

🌐 **Live Site**: [https://edumanage-d7a0d.web.app/](https://edumanage-d7a0d.web.app/)

Admin email: admin123@gmail.com
Admin password: Admin123

## ✨ Features

### 🔐 Authentication
- Firebase Authentication (Email/Password + Google)
- JWT-based secure backend communication
- Password strength validation
- Password reset functionality

### 👥 Roles & Permissions
- `Admin`: Full access to manage users, classes, feedback, and more
- `Teacher`: Can create and manage classes, assignments, and track submissions
- `Student`: Can enroll, submit assignments, and give feedback

### 📚 Class Management
- Teachers can create/update/delete classes
- Students can view and enroll in available classes

### 📝 Assignments & Submissions
- Teachers create assignments for their classes
- Students can submit assignments with file uploads
- Submission tracking for teachers

### ⭐ Feedback System
- Teaching Evaluation Report (TER) from students for completed classes
- Rating, review, and timestamp features
- Feedback saved to MongoDB

### 💰 Payments
- Stripe payment gateway integration for class enrollments
- Payment history and invoice generation

### 📊 Dashboards
- Role-based dashboards for Admin, Teacher, and Student
- Stats: enrollments, assignment submissions, feedbacks

### 📦 Tech Stack

| Tech         | Purpose                           |
|--------------|------------------------------------|
| React        | Frontend                          |
| React Router | Routing                           |
| Firebase     | Auth + Hosting                    |
| Express.js   | Backend Server                    |
| MongoDB      | Database                          |
| Stripe       | Payment Integration               |
| React Query  | Data fetching and caching         |
| Tailwind CSS | Styling                           |
| Lottie       | Animations                        |
| Toastify     | Notifications                     |

---

## 🚀 Getting Started (Local Setup)

### 1. Clone the repo

```bash
git clone https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-fahimahmed420
cd edumanage
