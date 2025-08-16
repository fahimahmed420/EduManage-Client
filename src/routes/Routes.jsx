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
import PrivateRoute from "./PrivateRoute";
import AboutUs from "../pages/AboutUs";

// Auth pages
import Login from "../pages/Login";
import Register from "../pages/Register";

// Dashboard pages (student,teacher,admin)
import EnrollClassDetails from "../pages/dashboard/student/EnrollClassDetails";
import MyEnrollClasses from "../pages/dashboard/student/MyEnrollClasses";
import OrderPage from "../pages/dashboard/student/OrderPage";

import MyClasses from "../pages/dashboard/teacher/MyClasses";
import AddClass from "../pages/dashboard/teacher/AddClass";
import MyClassDetails from "../pages/dashboard/teacher/MyClassDetails";

import AllUsers from "../pages/dashboard/admin/AllUsers";
import AllClassAdmin from "../pages/dashboard/admin/AllClassAdmin";
import TeacherRequests from "../pages/dashboard/admin/TeacherRequests";

// shared
import Profile from "../pages/dashboard/Profile";


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "all-classes", element: <AllClasses /> },
      { path: "about", element: <AboutUs /> },
      { path: "teach", element: <PrivateRoute><Teach /></PrivateRoute> },
      { path: "all-classes/:id", element: <PrivateRoute><ClassDetails /></PrivateRoute> },
      { path: "payment/:id", element: <PrivateRoute><PaymentPage /></PrivateRoute> }
    ],
  },
  {
    path: "*",
    element: <Error />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      // Student routes converted to PrivateRoute
      {
        path: "my-enroll-classes",
        element: (
          <PrivateRoute>
            <MyEnrollClasses />
          </PrivateRoute>
        ),
      },
      {
        path: "my-enroll-classes/:id",
        element: (
          <PrivateRoute>
            <EnrollClassDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "my-order",
        element: (
          <PrivateRoute>
            <OrderPage />
          </PrivateRoute>
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

      // Shared route
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
