import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import GraduationHat from "../assets/logo-animation.json";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
  reload,
} from "firebase/auth";
import { auth } from "../../firebase.init";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../hooks/axiosSecure";
import Lottie from "lottie-react";

// Initialize Google Provider
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); // undefined = loading, null = not logged in

  // ✅ Save user to MongoDB if not already present
  const saveUserToDB = async (firebaseUser) => {
    try {
      const { email, displayName, photoURL } = firebaseUser;
      const res = await axiosSecure.get(`/users/${email}`);
      if (res.status === 200) return;

      await axiosSecure.post("/users", {
        name: displayName || "Unnamed User",
        email,
        photo: photoURL || "https://i.ibb.co/9t9cYgW/avatar.png",
        role: "student",
      });
    } catch (err) {
      console.error("❌ Error saving user to DB:", err);
    }
  };

  // ✅ Register user
  const createUser = async (email, password, fullName = "", photoURL = "") => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Optional profile update
    if (fullName || photoURL) {
      await updateProfile(auth.currentUser, { displayName: fullName, photoURL });
      await reload(auth.currentUser);
    }

    const currentUser = auth.currentUser;
    setUser(currentUser);
    await saveUserToDB(currentUser);

    return userCredential;
  };

  // ✅ Email/password login
  const signInUser = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    setUser(userCredential.user);
    return userCredential;
  };

  // ✅ Google login
  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const googleUser = result.user;
    setUser(googleUser);
    await saveUserToDB(googleUser);
    return result;
  };

  // ✅ Logout
  const signOutUser = async () => {
    await signOut(auth);
    setUser(null);
  };

  // ✅ Reset password
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  // ✅ Sync auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Fetch MongoDB user using TanStack Query (only if logged in)
  const {
    data: userFromDB,
    isLoading: userFromDBLoading,
    isError: userFromDBError,
  } = useQuery({
    queryKey: ["userFromDB", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });

  // ✅ Auth loading state (important for PrivateRoute + layout rendering)
  if (user === undefined) {
    return (
      <div className="text-center text-xl py-10 min-h-screen flex flex-col justify-center items-center">
        {/* <h2 className="mb-4 flex items-center gap-2">
          Checking authentication
        </h2>
        <progress className="progress w-56" /> */}
        <Lottie className="w-50" animationData={GraduationHat} loop />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userFromDB,
        userFromDBLoading,
        userFromDBError,
        createUser,
        signInUser,
        signOutUser,
        signInWithGoogle,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
