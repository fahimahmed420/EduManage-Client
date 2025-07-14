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
  const [userFromDB, setUserFromDB] = useState(undefined); // MongoDB user

  // Create user in Firebase
  const createUser = async (email, password, fullName = "", photoURL = "") => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (fullName || photoURL) {
        await updateProfile(auth.currentUser, {
          displayName: fullName,
          photoURL: photoURL,
        });
        await reload(auth.currentUser);
      }
      const currentUser = auth.currentUser;
      setUser(currentUser);
      await saveUserToDB(currentUser); // Save to MongoDB
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
      await fetchUserFromDB(userCredential.user.email);
      return userCredential;
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;
      setUser(googleUser);
      await saveUserToDB(googleUser);
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
      setUserFromDB(null);
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

  // Save new user to MongoDB (only if not exists)
  const saveUserToDB = async (firebaseUser) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${firebaseUser.email}`);
      if (res.status === 404) {
        await fetch(`${import.meta.env.VITE_API_URL}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: firebaseUser.displayName || "Unnamed User",
            email: firebaseUser.email,
            photo: firebaseUser.photoURL || "https://i.ibb.co/9t9cYgW/avatar.png",
            role: "student",
          }),
        });
      }
      await fetchUserFromDB(firebaseUser.email);
    } catch (err) {
      console.error("Saving user to DB failed:", err);
    }
  };

  // Get user from MongoDB
  const fetchUserFromDB = async (email) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${email}`);
      if (res.ok) {
        const data = await res.json();
        setUserFromDB(data);
      } else {
        setUserFromDB(null);
      }
    } catch (err) {
      console.error("Fetching backend user error:", err);
      setUserFromDB(null);
    }
  };

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser?.email) {
        await fetchUserFromDB(currentUser.email);
      } else {
        setUserFromDB(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Show loading while checking auth
  if (user === undefined) {
    return (
      <div className="text-center text-white text-xl py-10 flex justify-center flex-col items-center">
        <h2 className="my-16">Checking authentication...</h2>
        <svg class="pl" width="240" height="240" viewBox="0 0 240 240">
          <circle class="pl__ring pl__ring--a" cx="120" cy="120" r="105" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 660" stroke-dashoffset="-330" stroke-linecap="round"></circle>
          <circle class="pl__ring pl__ring--b" cx="120" cy="120" r="35" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 220" stroke-dashoffset="-110" stroke-linecap="round"></circle>
          <circle class="pl__ring pl__ring--c" cx="85" cy="120" r="70" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 440" stroke-linecap="round"></circle>
          <circle class="pl__ring pl__ring--d" cx="155" cy="120" r="70" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 440" stroke-linecap="round"></circle>
        </svg>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,         // Firebase user
        userFromDB,   // MongoDB user
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
