import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../hooks/axiosSecure";

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const queryClient = useQueryClient();

  // ✅ JWT Request
  const getJWT = async (email) => {
    try {
      const res = await axiosSecure.post("/jwt", { email });
      const { token } = res.data;
      if (token) localStorage.setItem("access-token", token);
    } catch (err) {
      console.error("Failed to fetch JWT:", err);
    }
  };

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
    await getJWT(currentUser.email);
    queryClient.invalidateQueries(["userFromDB"]);
    return userCredential;
  };

  // ✅ Login
  const signInUser = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    setUser(userCredential.user);
    await getJWT(userCredential.user.email);
    queryClient.invalidateQueries(["userFromDB"]);
    return userCredential;
  };

  // ✅ Google login
  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const googleUser = result.user;
    setUser(googleUser);
    await saveUserToDB(googleUser);
    await getJWT(googleUser.email);
    queryClient.invalidateQueries(["userFromDB"]);
    return result;
  };

  // ✅ Logout
  const signOutUser = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem("access-token");
    queryClient.invalidateQueries(["userFromDB"]);
  };

  // ✅ Password reset
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  // ✅ Sync Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser?.email) {
        await getJWT(currentUser.email);
        queryClient.invalidateQueries(["userFromDB"]);
      } else {
        localStorage.removeItem("access-token");
      }
    });
    return () => unsubscribe();
  }, [queryClient]);

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
        <h2 className="my-10">Checking authentication...</h2>
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
