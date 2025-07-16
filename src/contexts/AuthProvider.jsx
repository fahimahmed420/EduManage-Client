import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {createUserWithEmailAndPassword,onAuthStateChanged,signInWithEmailAndPassword,
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

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);

  // ✅ Save user to DB if not exists
  const saveUserToDB = async (firebaseUser) => {
    try {
      const res = await axiosSecure.get(`/users/${firebaseUser.email}`);
      if (res.status === 200) return;

      await axiosSecure.post("/users", {
        name: firebaseUser.displayName || "Unnamed User",
        email: firebaseUser.email,
        photo: firebaseUser.photoURL || "https://i.ibb.co/9t9cYgW/avatar.png",
        role: "student",
      });
    } catch (err) {
      console.error("Error saving user to DB:", err);
    }
  };

  // ✅ Firebase auth registration
  const createUser = async (email, password, fullName = "", photoURL = "") => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (fullName || photoURL) {
      await updateProfile(auth.currentUser, {
        displayName: fullName,
        photoURL,
      });
      await reload(auth.currentUser);
    }
    const currentUser = auth.currentUser;
    setUser(currentUser);
    await saveUserToDB(currentUser);
    return userCredential;
  };

  // ✅ Login
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

  // ✅ Password reset
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  // ✅ Sync Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Fetch MongoDB user using TanStack Query
  const {
    data: userFromDB,
    isLoading: userFromDBLoading,
    isError,
  } = useQuery({
    queryKey: ["userFromDB", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });

  // ✅ Show loading until Firebase confirms auth state
  if (user === undefined) {
    return (
      <div className="text-center text-xl py-10">
        <h2 className="my-10"><span className="loading loading-spinner text-info"></span>Checking authentication<span className="loading loading-spinner text-info"></span></h2>
        <progress className="progress w-56" />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userFromDB,
        userFromDBLoading,
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
