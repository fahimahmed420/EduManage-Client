import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
// import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/Home";
// import AllClasses from "../pages/AllClasses";
// import Teach from "../pages/Teach";
import Error from "../pages/Error";

// Auth pages
import Login from "../pages/Login";
import Register from "../pages/Register";


// Dashboard pages (these will be nested by role)
// import StudentDashboard from "../pages/dashboard/student/StudentDashboard";
// import MyEnrollClass from "../pages/dashboard/student/MyEnrollClass";
// import MyProfile from "../pages/dashboard/shared/MyProfile";

// import TeacherDashboard from "../pages/dashboard/teacher/TeacherDashboard";
// import AddClass from "../pages/dashboard/teacher/AddClass";
// import MyClass from "../pages/dashboard/teacher/MyClass";

// import AdminDashboard from "../pages/dashboard/admin/AdminDashboard";
// import AllUsers from "../pages/dashboard/admin/AllUsers";
// import AllClassAdmin from "../pages/dashboard/admin/AllClassAdmin";
// import TeacherRequests from "../pages/dashboard/admin/TeacherRequests";

// Class Details Page (Private)
// import ClassDetails from "../pages/ClassDetails";


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
    //   { path: "all-classes", element: <AllClasses /> },
    //   { path: "teach", element: <Teach /> },
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
//   {
//     path: "/dashboard",
//     element: <DashboardLayout />,
//     children: [
//       // Student routes
//       { path: "student", element: <StudentDashboard /> },
//       { path: "my-enroll-class", element: <MyEnrollClass /> },
//       { path: "my-enroll-class/:id", element: <div>Enroll Class Details</div> },

//       // Teacher routes
//       { path: "teacher", element: <TeacherDashboard /> },
//       { path: "add-class", element: <AddClass /> },
//       { path: "my-class", element: <MyClass /> },
//       { path: "my-class/:id", element: <div>My Class Details</div> },

//       // Admin routes
//       { path: "admin", element: <AdminDashboard /> },
//       { path: "all-users", element: <AllUsers /> },
//       { path: "all-classes", element: <AllClassAdmin /> },
//       { path: "teacher-requests", element: <TeacherRequests /> },

//       // Shared
//       { path: "profile", element: <MyProfile /> },
//     ],
//   },
]);

export default router;
