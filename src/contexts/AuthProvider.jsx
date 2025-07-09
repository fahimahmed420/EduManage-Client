import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
  reload
} from 'firebase/auth';
import { auth } from '../../firebase.init';

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);

  const createUser = async (email, password, fullName = '', photoURL = '') => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (fullName || photoURL) {
        await updateProfile(userCredential.user, { displayName: fullName, photoURL });
        await reload(userCredential.user);
      }
      setUser(auth.currentUser);
      return userCredential;
    } catch (error) {
      console.log(error);
    }
  };

  const signInUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      return userCredential;
    } catch (error) {
      console.log(error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${currentUser.email}`);
          const userData = await res.json();

          setUser({
            ...currentUser,
            role: userData?.role || "student", // fallback
          });
        } catch (err) {
          console.error("Error fetching role:", err);
          setUser({ ...currentUser, role: "student" }); // fallback
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);


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
        user,
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
