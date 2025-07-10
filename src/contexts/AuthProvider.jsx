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

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); // Firebase user
  const [userFromDB, setUserFromDB] = useState(undefined); // Backend user

  // Create user in Firebase
  const createUser = async (email, password, fullName = "", photoURL = "") => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (fullName || photoURL) {
        await updateProfile(userCredential.user, { displayName: fullName, photoURL });
        await reload(userCredential.user);
      }
      setUser(auth.currentUser);
      return userCredential;
    } catch (error) {
      console.error("Create user error:", error);
      throw error;
    }
  };

  const signInUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      return userCredential;
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      return result;
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserFromDB(null); // Clear backend user too
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Reset password error:", error);
    }
  };

  // Fetch backend user
  const fetchUserFromDB = async (email) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${email}`);
      if (res.ok) {
        const backendUser = await res.json();
        setUserFromDB(backendUser);
      } else if (res.status === 404) {
        console.log("User not found in DB, creating...");
        // If user not found, create in DB
        await fetch(`${import.meta.env.VITE_API_URL}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: user.displayName || "Unnamed User",
            email,
            photo: user.photoURL || "https://i.ibb.co/9t9cYgW/avatar.png",
            role: "student", // default role
          }),
        });
        // Fetch again
        await fetchUserFromDB(email);
      }
    } catch (err) {
      console.error("Error fetching backend user:", err);
      setUserFromDB(null);
    }
  };

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserFromDB(currentUser.email);
      } else {
        setUser(null);
        setUserFromDB(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Loading indicator while checking auth
  if (user === undefined) {
    return (
      <div className="text-center text-white text-xl py-10">
        <h2 className="my-16">Checking authentication...</h2>
        <progress className="progress w-56"></progress>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,         // Firebase user
        userFromDB,   // Backend user
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
