import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/Home";
import AllClasses from "../pages/AllClasses";
import Teach from "../pages/Teach";
import Error from "../pages/Error";

// Auth pages
import Login from "../pages/Login";
import Register from "../pages/Register";



// Dashboard pages (these will be nested by role)
// import StudentDashboard from "../pages/dashboard/student/StudentDashboard";
// import MyEnrollClass from "../pages/dashboard/student/MyEnrollClass";

// import TeacherDashboard from "../pages/dashboard/teacher/TeacherDashboard";
import MyClasses from "../pages/dashboard/teacher/MyClasses";
import AddClass from "../pages/dashboard/teacher/AddClass";

import AllUsers from "../pages/dashboard/admin/AllUsers";
import AllClassAdmin from "../pages/dashboard/admin/AllClassAdmin";
import TeacherRequests from "../pages/dashboard/admin/TeacherRequests";
import Profile from "../pages/dashboard/Profile";



// Class Details Page (Private)
// import ClassDetails from "../pages/ClassDetails";


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "all-classes", element: <AllClasses /> },
      { path: "teach", element: <Teach /> },
    //   { path: "class/:id", element: <ClassDetails /> },
    ],
  },
  {
    path: "*",
    element: <Error />,
  },
  // Auth routes (NOT inside MainLayout)
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  // Dashboard routes (Private)
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
//       // Student routes
//       { path: "student", element: <StudentDashboard /> },
//       { path: "my-enroll-class", element: <MyEnrollClass /> },
//       { path: "my-enroll-class/:id", element: <div>Enroll Class Details</div> },

//       // Teacher routes
//       { path: "teacher", element: <TeacherDashboard /> },
      { path: "add-class", element: <AddClass /> },
      { path: "my-class", element: <MyClasses /> },
//       { path: "my-class/:id", element: <div>My Class Details</div> },

      // Admin routes
      { path: "all-users", element: <AllUsers /> },
      { path: "all-classes", element: <AllClassAdmin /> },
      { path: "teacher-requests", element: <TeacherRequests /> },

      // Shared
      { path: "profile", element: <Profile/> },
    ],
  },
]);

export default router;
