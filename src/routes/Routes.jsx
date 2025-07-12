import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/Home";
import AllClasses from "../pages/AllClasses";
import ClassDetails from "../pages/ClassDetails";
import Teach from "../pages/Teach";
import Error from "../pages/Error";
import PaymentPage from "../pages/PaymentPage";

// Auth pages
import Login from "../pages/Login";
import Register from "../pages/Register";


// Dashboard pages (student,teacher,admin)
import EnrollClassDetails from "../pages/dashboard/student/EnrollClassDetails";
import MyEnrollClasses from "../pages/dashboard/student/MyEnrollClasses";

// import TeacherDashboard from "../pages/dashboard/teacher/TeacherDashboard";
import MyClasses from "../pages/dashboard/teacher/MyClasses";
import AddClass from "../pages/dashboard/teacher/AddClass";

import AllUsers from "../pages/dashboard/admin/AllUsers";
import AllClassAdmin from "../pages/dashboard/admin/AllClassAdmin";
import TeacherRequests from "../pages/dashboard/admin/TeacherRequests";
// shared
import Profile from "../pages/dashboard/Profile";
import MyClassDetails from "../pages/dashboard/teacher/MyClassDetails";



const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "all-classes", element: <AllClasses /> },
      { path: "teach", element: <Teach /> },
      { path: "all-classes/:id", element: <ClassDetails /> },
      { path:"payment/:id" , element:<PaymentPage/>}
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
            { path: "my-enroll-classes", element: <MyEnrollClasses/> },
            { path: "my-enroll-classes/:id", element: <EnrollClassDetails/> },

      //       // Teacher routes
      //       { path: "teacher", element: <TeacherDashboard /> },
      { path: "add-class", element: <AddClass /> },
      { path: "my-class", element: <MyClasses /> },
            { path: "my-class/:id", element: <MyClassDetails/> },

      // Admin routes
      { path: "all-users", element: <AllUsers /> },
      { path: "all-classes", element: <AllClassAdmin /> },
      { path: "teacher-requests", element: <TeacherRequests /> },

      // Shared
      { path: "profile", element: <Profile /> },
    ],
  },
]);

export default router;
