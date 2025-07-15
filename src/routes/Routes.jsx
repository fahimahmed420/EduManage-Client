import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/Home";
import AllClasses from "../pages/AllClasses";
import ClassDetails from "../pages/ClassDetails";
import Teach from "../pages/Teach";
import Error from "../pages/Error";
import PaymentPage from "../pages/PaymentPage";
import AdminRoute from "./AdminRoute";
import TeacherRoute from "./TeacherRoute";
import StudentRoute from "./StudentRoute";
import PrivateRoute from "./PrivateRoute";

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
      { path: "all-classes/:id", element: <PrivateRoute><ClassDetails /></PrivateRoute> },
      { path:"payment/:id" , element:<PrivateRoute><PaymentPage/></PrivateRoute>}
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

// Dashboard routes (Protected)
{
  path: "/dashboard",
  element: (
    <PrivateRoute>
      <DashboardLayout />
    </PrivateRoute>
  ),
  children: [
    // Student routes
    {
      path: "my-enroll-classes",
      element: (
        <StudentRoute>
          <MyEnrollClasses />
        </StudentRoute>
      ),
    },
    {
      path: "my-enroll-classes/:id",
      element: (
        <StudentRoute>
          <EnrollClassDetails />
        </StudentRoute>
      ),
    },

    // Teacher routes
    {
      path: "add-class",
      element: (
        <TeacherRoute>
          <AddClass />
        </TeacherRoute>
      ),
    },
    {
      path: "my-classes",
      element: (
        <TeacherRoute>
          <MyClasses />
        </TeacherRoute>
      ),
    },
    {
      path: "my-classes/:id",
      element: (
        <TeacherRoute>
          <MyClassDetails />
        </TeacherRoute>
      ),
    },

    // Admin routes
    {
      path: "all-users",
      element: (
        <AdminRoute>
          <AllUsers />
        </AdminRoute>
      ),
    },
    {
      path: "all-classes",
      element: (
        <AdminRoute>
          <AllClassAdmin />
        </AdminRoute>
      ),
    },
    {
      path: "teacher-requests",
      element: (
        <AdminRoute>
          <TeacherRequests />
        </AdminRoute>
      ),
    },

    // Shared (any authenticated user)
    {
      path: "profile",
      element: (
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      ),
    },
  ],
}

]);

export default router;
